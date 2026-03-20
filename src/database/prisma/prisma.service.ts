import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { StructuredLogger } from '../../common/utils/structured-logger';
import { TenantType } from '../../common/enums/tenant-type.enum';

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
   * Sets RLS context variables:
   *   app.tenant_id   → the authenticated tenant's own ID
   *   app.tenant_type → 'CGO' or 'CLIENT'
   *
   * PostgreSQL RLS policies use these to:
   * - CLIENT: access only own rows
   * - CGO: access own rows + managed client rows
   */
  async executeInTenantContext<T>(
    tenantId: string,
    callback: (tx: PrismaClient) => Promise<T>,
    tenantType: TenantType = TenantType.CLIENT,
  ): Promise<T> {
    return this.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(
        `SET LOCAL app.tenant_id = '${tenantId}'`,
      );
      await tx.$executeRawUnsafe(
        `SET LOCAL app.tenant_type = '${tenantType}'`,
      );
      return callback(tx as unknown as PrismaClient);
    });
  }

  /**
   * Resolve the list of client tenant IDs managed by a CGO tenant.
   * Called during tenant context initialization to populate managedTenantIds.
   */
  async resolveManagedClientIds(cgoTenantId: string): Promise<string[]> {
    const relations = await this.cgoClientRelation.findMany({
      where: {
        cgoTenantId,
        isActive: true,
        deletedAt: null,
      },
      select: { clientTenantId: true },
    });
    return relations.map((r) => r.clientTenantId);
  }
}
