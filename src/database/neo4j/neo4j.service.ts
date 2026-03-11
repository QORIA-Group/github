import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver, Session, ManagedTransaction } from 'neo4j-driver';
import { StructuredLogger } from '../../common/utils/structured-logger';

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
  private driver: Driver | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: StructuredLogger,
  ) {}

  async onModuleInit(): Promise<void> {
    const uri = this.configService.get<string>('database.neo4jUri', 'bolt://localhost:7687');
    const user = this.configService.get<string>('database.neo4jUser', 'neo4j');
    const password = this.configService.get<string>('database.neo4jPassword', '');

    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    try {
      await this.driver.verifyConnectivity();
      this.logger.log('Neo4j (Knowledge Graph) connected', 'Neo4jService');
    } catch (error) {
      this.logger.warn(
        `Neo4j connection deferred - will retry on first query: ${error instanceof Error ? error.message : 'Unknown'}`,
        'Neo4jService',
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.driver) {
      await this.driver.close();
      this.logger.log('Neo4j disconnected', 'Neo4jService');
    }
  }

  getSession(database?: string): Session {
    if (!this.driver) {
      throw new Error('Neo4j driver not initialized');
    }
    return this.driver.session({ database: database ?? 'neo4j' });
  }

  async executeRead<T>(
    cypher: string,
    params: Record<string, unknown> = {},
  ): Promise<T[]> {
    const session = this.getSession();
    try {
      const result = await session.executeRead(
        (tx: ManagedTransaction) => tx.run(cypher, params),
      );
      return result.records.map((record) => record.toObject() as T);
    } finally {
      await session.close();
    }
  }

  async executeWrite<T>(
    cypher: string,
    params: Record<string, unknown> = {},
  ): Promise<T[]> {
    const session = this.getSession();
    try {
      const result = await session.executeWrite(
        (tx: ManagedTransaction) => tx.run(cypher, params),
      );
      return result.records.map((record) => record.toObject() as T);
    } finally {
      await session.close();
    }
  }
}
