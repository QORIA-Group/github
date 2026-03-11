import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { StructuredLogger } from '../../common/utils/structured-logger';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly logger: StructuredLogger) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('PostgreSQL (Relational Data Hub) connected', 'PrismaService');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('PostgreSQL disconnected', 'PrismaService');
  }

  /**
   * Execute a callback within a tenant-scoped transaction.
   * Sets the RLS context variable `app.tenant_id` so PostgreSQL
   * RLS policies automatically filter rows for this tenant.
   */
  async executeInTenantContext<T>(
    tenantId: string,
    callback: (tx: PrismaClient) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(
        `SET LOCAL app.tenant_id = '${tenantId}'`,
      );
      return callback(tx as unknown as PrismaClient);
    });
  }
}
