import { Injectable } from '@nestjs/common';
import { TenantContext } from '../../../../shared/types/tenant';
import {
  SanitizedInsight,
  CognitiveTaskRequest,
  CognitiveTaskResponse,
  AutomationTask,
} from '../../../../shared/types/kyra';

/**
 * CLIENT strategy for KYRA cognitive engine.
 * Handles single-tenant task execution, automation statuses,
 * and alert notifications for the connected client only.
 */
@Injectable()
export class ClientKyraStrategy {
  async getSingleTenantInsights(ctx: TenantContext): Promise<SanitizedInsight[]> {
    // In production: query insights table – RLS filters to ctx.tenantId only
    return [
      {
        id: 'insight-client-001',
        title: 'Paie du mois traitée',
        description: 'La paie de mars 2026 a été traitée avec succès pour 145 salariés.',
        severity: 'info',
        domain: 'payroll',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'insight-client-002',
        title: 'Reporting ESG en attente',
        description: 'Le rapport CSRD Q1 2026 nécessite votre validation.',
        severity: 'warning',
        domain: 'compliance',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async executeTask(ctx: TenantContext, task: CognitiveTaskRequest): Promise<CognitiveTaskResponse> {
    return {
      taskId: `client-task-${Date.now()}`,
      status: 'queued',
      result: {
        id: `result-${Date.now()}`,
        title: `Exécution: ${task.taskType}`,
        description: `Tâche en cours d'exécution pour votre organisation.`,
        severity: 'info',
        domain: task.taskType,
        createdAt: new Date().toISOString(),
      },
    };
  }

  async getAutomationTasks(ctx: TenantContext): Promise<AutomationTask[]> {
    return [
      {
        id: 'auto-001',
        name: 'Paie mensuelle automatisée',
        status: 'active',
        lastRun: new Date().toISOString(),
        nextRun: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'payroll',
      },
      {
        id: 'auto-002',
        name: 'Collecte KPI ESG',
        status: 'active',
        lastRun: new Date().toISOString(),
        nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'monitoring',
      },
      {
        id: 'auto-003',
        name: 'Reporting conformité CSRD',
        status: 'paused',
        lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'reporting',
      },
    ];
  }
}
