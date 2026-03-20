import { Injectable } from '@nestjs/common';
import { TenantContext, TenantType } from '../../../shared/types/tenant';
import {
  SanitizedInsight,
  CognitiveTaskRequest,
  CognitiveTaskResponse,
  OptimizationRecommendation,
  AutomationTask,
} from '../../../shared/types/kyra';
import { CgoKyraStrategy } from './strategies/cgo-kyra.strategy';
import { ClientKyraStrategy } from './strategies/client-kyra.strategy';

@Injectable()
export class KyraService {
  constructor(
    private readonly cgoStrategy: CgoKyraStrategy,
    private readonly clientStrategy: ClientKyraStrategy,
  ) {}

  /**
   * Route insight requests based on tenant type.
   * CGO gets aggregated multi-client insights; CLIENT gets own data only.
   * Database RLS enforces this at the query level as well.
   */
  async getInsights(ctx: TenantContext): Promise<SanitizedInsight[]> {
    if (ctx.tenantType === TenantType.CGO) {
      return this.cgoStrategy.getMultiClientInsights(ctx);
    }
    return this.clientStrategy.getSingleTenantInsights(ctx);
  }

  /**
   * Route task execution based on tenant type.
   * CGO tasks: optimization, analysis, alerts
   * CLIENT tasks: payroll, reporting, monitoring
   */
  async executeTask(ctx: TenantContext, task: CognitiveTaskRequest): Promise<CognitiveTaskResponse> {
    if (ctx.tenantType === TenantType.CGO) {
      return this.cgoStrategy.executeTask(ctx, task);
    }
    return this.clientStrategy.executeTask(ctx, task);
  }

  async getMultiClientOptimization(ctx: TenantContext): Promise<OptimizationRecommendation[]> {
    return this.cgoStrategy.getOptimizationRecommendations(ctx);
  }

  async getIntegrityAlerts(ctx: TenantContext): Promise<SanitizedInsight[]> {
    return this.cgoStrategy.getIntegrityAlerts(ctx);
  }

  async getAutomationTasks(ctx: TenantContext): Promise<AutomationTask[]> {
    return this.clientStrategy.getAutomationTasks(ctx);
  }
}
