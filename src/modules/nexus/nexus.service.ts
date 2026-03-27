import { Injectable, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import { StructuredLogger } from '../../common/utils/structured-logger';
import { TenantContext } from '../../common/interfaces/tenant-context.interface';
import { TenantType } from '../../common/enums/tenant-type.enum';
import { AtlasService } from '../atlas/atlas.service';
import { CognitiveResult } from '../../common/interfaces/cognitive-task.interface';

export interface ManagedClientSummary {
  tenantId: string;
  name: string;
  slug: string;
  userCount: number;
  taskCount: number;
  isActive: boolean;
}

export interface MultiClientAnalysisResult {
  cgoTenantId: string;
  clientCount: number;
  clients: ManagedClientSummary[];
  aggregatedMetrics: {
    totalUsers: number;
    totalCognitiveTasks: number;
    activeClients: number;
  };
}

export interface IntegrityGateAlert {
  clientTenantId: string;
  clientName: string;
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  detectedAt: string;
}

@Injectable()
export class NexusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly atlasService: AtlasService,
    private readonly logger: StructuredLogger,
  ) {}

  /**
   * Retrieve all managed clients for the CGO with summary metrics.
   * Uses CGO-scoped RLS to access cross-tenant data.
   */
  async getManagedClients(tenant: TenantContext): Promise<MultiClientAnalysisResult> {
    this.assertCgoAccess(tenant);

    const managedIds = tenant.managedTenantIds ?? [];

    const clients: ManagedClientSummary[] = [];
    let totalUsers = 0;
    let totalTasks = 0;
    let activeClients = 0;

    for (const clientTenantId of managedIds) {
      const clientTenant = await this.prisma.tenant.findUnique({
        where: { id: clientTenantId },
        select: { id: true, name: true, slug: true, isActive: true },
      });

      if (!clientTenant) continue;

      const userCount = await this.prisma.user.count({
        where: { tenantId: clientTenantId, deletedAt: null },
      });

      const taskCount = await this.prisma.cognitiveTask.count({
        where: { tenantId: clientTenantId },
      });

      clients.push({
        tenantId: clientTenant.id,
        name: clientTenant.name,
        slug: clientTenant.slug,
        userCount,
        taskCount,
        isActive: clientTenant.isActive,
      });

      totalUsers += userCount;
      totalTasks += taskCount;
      if (clientTenant.isActive) activeClients++;
    }

    this.logger.logCognitiveDecision(
      'NexusService',
      `CGO dashboard loaded: ${clients.length} managed clients`,
      {
        cgo_tenant_id: tenant.tenantId,
        client_count: clients.length,
        total_users: totalUsers,
      },
    );

    return {
      cgoTenantId: tenant.tenantId,
      clientCount: clients.length,
      clients,
      aggregatedMetrics: {
        totalUsers,
        totalCognitiveTasks: totalTasks,
        activeClients,
      },
    };
  }

  /**
   * Request ATLAS multi-client optimization analysis.
   * CGO-specific: analyzes patterns across all managed clients.
   */
  async requestMultiClientOptimization(
    tenant: TenantContext,
    payload: Record<string, unknown>,
  ): Promise<CognitiveResult> {
    this.assertCgoAccess(tenant);

    return this.atlasService.processCognitiveTask(tenant, 'multi_client_optimization', {
      ...payload,
      managed_tenant_ids: tenant.managedTenantIds,
      analysis_scope: 'cross_tenant',
    });
  }

  /**
   * Request ATLAS multi-client analysis (comparative insights).
   */
  async requestMultiClientAnalysis(
    tenant: TenantContext,
    payload: Record<string, unknown>,
  ): Promise<CognitiveResult> {
    this.assertCgoAccess(tenant);

    return this.atlasService.processCognitiveTask(tenant, 'multi_client_analysis', {
      ...payload,
      managed_tenant_ids: tenant.managedTenantIds,
      analysis_scope: 'comparative',
    });
  }

  /**
   * Retrieve Integrity Gate alerts across managed clients.
   * Monitors anomalies, compliance risks, and SLA violations.
   */
  async getIntegrityGateAlerts(
    tenant: TenantContext,
  ): Promise<IntegrityGateAlert[]> {
    this.assertCgoAccess(tenant);

    const managedIds = tenant.managedTenantIds ?? [];
    const alerts: IntegrityGateAlert[] = [];

    for (const clientTenantId of managedIds) {
      const clientTenant = await this.prisma.tenant.findUnique({
        where: { id: clientTenantId },
        select: { name: true, isActive: true },
      });

      if (!clientTenant) continue;

      // Check for inactive clients
      if (!clientTenant.isActive) {
        alerts.push({
          clientTenantId,
          clientName: clientTenant.name,
          alertType: 'client_inactive',
          severity: 'high',
          message: `Client "${clientTenant.name}" is currently inactive`,
          detectedAt: new Date().toISOString(),
        });
      }

      // Check for stale cognitive tasks (pending > 1 hour)
      const staleTasks = await this.prisma.cognitiveTask.count({
        where: {
          tenantId: clientTenantId,
          status: 'PROCESSING',
          createdAt: { lt: new Date(Date.now() - 3_600_000) },
        },
      });

      if (staleTasks > 0) {
        alerts.push({
          clientTenantId,
          clientName: clientTenant.name,
          alertType: 'stale_cognitive_tasks',
          severity: 'medium',
          message: `${staleTasks} cognitive task(s) stuck in PROCESSING for > 1 hour`,
          detectedAt: new Date().toISOString(),
        });
      }
    }

    this.logger.logCognitiveDecision(
      'NexusService',
      `Integrity Gate: ${alerts.length} alerts across ${managedIds.length} clients`,
      {
        cgo_tenant_id: tenant.tenantId,
        alert_count: alerts.length,
      },
    );

    return alerts;
  }

  private assertCgoAccess(tenant: TenantContext): void {
    if (tenant.tenantType !== TenantType.CGO) {
      throw new ForbiddenException('Access restricted to CGO tenants');
    }
  }
}
