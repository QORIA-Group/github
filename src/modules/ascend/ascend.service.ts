import { Injectable, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import { StructuredLogger } from '../../common/utils/structured-logger';
import { TenantContext } from '../../common/interfaces/tenant-context.interface';
import { TenantType } from '../../common/enums/tenant-type.enum';
import { AtlasService } from '../atlas/atlas.service';
import { PulseFlowService } from '../pulseflow/pulseflow.service';
import { PulseFlowEventType } from '../../common/enums/pulseflow-event-type.enum';
import { CognitiveResult } from '../../common/interfaces/cognitive-task.interface';

export interface AutopilotStatus {
  tenantId: string;
  tenantName: string;
  automations: AutomationEntry[];
  recentTasks: TaskSummary[];
  activeAlerts: ClientAlert[];
}

export interface AutomationEntry {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'error';
  lastRunAt: string | null;
}

export interface TaskSummary {
  id: string;
  taskType: string;
  status: string;
  brainLevel: string | null;
  processingTimeMs: number | null;
  createdAt: Date;
}

export interface ClientAlert {
  alertType: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  detectedAt: string;
}

@Injectable()
export class AscendService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly atlasService: AtlasService,
    private readonly pulseflow: PulseFlowService,
    private readonly logger: StructuredLogger,
  ) {}

  /**
   * Retrieve the Autopilot dashboard status for the client.
   * Single-tenant view: only the client's own data.
   */
  async getAutopilotStatus(tenant: TenantContext): Promise<AutopilotStatus> {
    this.assertClientAccess(tenant);

    const clientTenant = await this.prisma.executeInTenantContext(
      tenant.tenantId,
      async (tx) => {
        return tx.tenant.findUnique({
          where: { id: tenant.tenantId },
          select: { id: true, name: true },
        });
      },
      TenantType.CLIENT,
    );

    const recentTasks = await this.prisma.executeInTenantContext(
      tenant.tenantId,
      async (tx) => {
        return tx.cognitiveTask.findMany({
          where: { tenantId: tenant.tenantId },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            taskType: true,
            status: true,
            brainLevel: true,
            processingTimeMs: true,
            createdAt: true,
          },
        });
      },
      TenantType.CLIENT,
    );

    const alerts = await this.detectClientAlerts(tenant);

    this.logger.log(
      `Autopilot status loaded for client ${tenant.tenantId}`,
      'AscendService',
    );

    return {
      tenantId: tenant.tenantId,
      tenantName: clientTenant?.name ?? 'Unknown',
      automations: [], // Populated when automation engine is connected
      recentTasks: recentTasks.map((t) => ({
        id: t.id,
        taskType: t.taskType,
        status: t.status,
        brainLevel: t.brainLevel,
        processingTimeMs: t.processingTimeMs,
        createdAt: t.createdAt,
      })),
      activeAlerts: alerts,
    };
  }

  /**
   * Execute a payroll task via ATLAS.
   * Client-specific: processes payroll for the authenticated tenant only.
   */
  async executePayrollTask(
    tenant: TenantContext,
    payload: Record<string, unknown>,
  ): Promise<CognitiveResult> {
    this.assertClientAccess(tenant);

    const result = await this.atlasService.processCognitiveTask(
      tenant,
      'payroll_execution',
      {
        ...payload,
        scope: 'single_tenant',
        tenant_id: tenant.tenantId,
      },
    );

    await this.pulseflow.emitEvent(
      tenant,
      PulseFlowEventType.USER_ACTION,
      tenant.tenantId,
      'PayrollTask',
      {
        action: 'payroll_executed',
        task_type: 'payroll_execution',
        brain_level: result.level,
      },
    );

    return result;
  }

  /**
   * Execute an ESG/CSRD reporting task via ATLAS.
   */
  async executeEsgReporting(
    tenant: TenantContext,
    payload: Record<string, unknown>,
  ): Promise<CognitiveResult> {
    this.assertClientAccess(tenant);

    return this.atlasService.processCognitiveTask(tenant, 'esg_reporting', {
      ...payload,
      scope: 'single_tenant',
      tenant_id: tenant.tenantId,
    });
  }

  /**
   * Get automation/task execution status for the client.
   */
  async getAutomationStatus(
    tenant: TenantContext,
  ): Promise<{ pending: number; processing: number; completed: number }> {
    this.assertClientAccess(tenant);

    const counts = await this.prisma.executeInTenantContext(
      tenant.tenantId,
      async (tx) => {
        const [pending, processing, completed] = await Promise.all([
          tx.cognitiveTask.count({
            where: { tenantId: tenant.tenantId, status: 'PENDING' },
          }),
          tx.cognitiveTask.count({
            where: { tenantId: tenant.tenantId, status: 'PROCESSING' },
          }),
          tx.cognitiveTask.count({
            where: { tenantId: tenant.tenantId, status: 'COMPLETED' },
          }),
        ]);
        return { pending, processing, completed };
      },
      TenantType.CLIENT,
    );

    return counts;
  }

  private async detectClientAlerts(tenant: TenantContext): Promise<ClientAlert[]> {
    const alerts: ClientAlert[] = [];

    const staleTasks = await this.prisma.cognitiveTask.count({
      where: {
        tenantId: tenant.tenantId,
        status: 'PROCESSING',
        createdAt: { lt: new Date(Date.now() - 3_600_000) },
      },
    });

    if (staleTasks > 0) {
      alerts.push({
        alertType: 'stale_tasks',
        severity: 'medium',
        message: `${staleTasks} task(s) have been processing for over 1 hour`,
        detectedAt: new Date().toISOString(),
      });
    }

    return alerts;
  }

  private assertClientAccess(tenant: TenantContext): void {
    if (tenant.tenantType !== TenantType.CLIENT) {
      throw new ForbiddenException('Access restricted to Client tenants');
    }
  }
}
