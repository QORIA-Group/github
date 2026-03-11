import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Neo4jService } from '../../database/neo4j/neo4j.service';
import { StructuredLogger } from '../../common/utils/structured-logger';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
  subsystems: {
    postgresql: SubsystemStatus;
    neo4j: SubsystemStatus;
    pulseflow: SubsystemStatus;
  };
}

interface SubsystemStatus {
  status: 'up' | 'down';
  latencyMs?: number;
}

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly neo4j: Neo4jService,
    private readonly logger: StructuredLogger,
  ) {}

  async check(): Promise<HealthCheckResult> {
    const [postgresql, neo4jStatus] = await Promise.all([
      this.checkPostgreSQL(),
      this.checkNeo4j(),
    ]);

    const subsystems = {
      postgresql,
      neo4j: neo4jStatus,
      pulseflow: { status: 'up' as const },
    };

    const allUp = Object.values(subsystems).every((s) => s.status === 'up');
    const allDown = Object.values(subsystems).every((s) => s.status === 'down');

    const result: HealthCheckResult = {
      status: allUp ? 'healthy' : allDown ? 'unhealthy' : 'degraded',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      subsystems,
    };

    this.logger.log(
      `Health check: ${result.status}`,
      'HealthService',
    );

    return result;
  }

  private async checkPostgreSQL(): Promise<SubsystemStatus> {
    try {
      const start = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'up', latencyMs: Date.now() - start };
    } catch {
      return { status: 'down' };
    }
  }

  private async checkNeo4j(): Promise<SubsystemStatus> {
    try {
      const start = Date.now();
      await this.neo4j.executeRead('RETURN 1');
      return { status: 'up', latencyMs: Date.now() - start };
    } catch {
      return { status: 'down' };
    }
  }
}
