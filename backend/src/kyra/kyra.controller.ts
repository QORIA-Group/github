import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { KyraService } from './kyra.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';
import { TenantContext, Role } from '../../../shared/types/tenant';
import { SanitizedInsight, CognitiveTaskRequest, CognitiveTaskResponse } from '../../../shared/types/kyra';

/**
 * KYRA Cognitive Engine controller.
 *
 * Routing logic:
 * - GET /kyra/insights: Returns data based on tenantType
 *   - CGO → multi-client aggregated insights
 *   - CLIENT → single-tenant insights only
 * - POST /kyra/tasks: Executes cognitive tasks per role
 *   - CGO → optimization, multi-client analysis, integrity gate alerts
 *   - CLIENT → payroll execution, automation status, alert notifications
 *
 * RLS at database level provides defense-in-depth even if routing logic is bypassed.
 */
@Controller('kyra')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KyraController {
  constructor(private readonly kyraService: KyraService) {}

  @Get('insights')
  async getInsights(@CurrentTenant() ctx: TenantContext): Promise<SanitizedInsight[]> {
    return this.kyraService.getInsights(ctx);
  }

  @Post('tasks')
  async executeTask(
    @CurrentTenant() ctx: TenantContext,
    @Body() task: CognitiveTaskRequest,
  ): Promise<CognitiveTaskResponse> {
    return this.kyraService.executeTask(ctx, task);
  }

  /** CGO-only: multi-client optimization recommendations */
  @Get('optimization')
  @Roles(Role.CGO_ADMIN, Role.CGO_ANALYST)
  async getOptimization(@CurrentTenant() ctx: TenantContext) {
    return this.kyraService.getMultiClientOptimization(ctx);
  }

  /** CGO-only: integrity gate alerts across all clients */
  @Get('integrity-alerts')
  @Roles(Role.CGO_ADMIN, Role.CGO_ANALYST)
  async getIntegrityAlerts(@CurrentTenant() ctx: TenantContext) {
    return this.kyraService.getIntegrityAlerts(ctx);
  }

  /** CLIENT-only: automation task statuses */
  @Get('automations')
  @Roles(Role.CLIENT_EXEC, Role.CLIENT_USER)
  async getAutomations(@CurrentTenant() ctx: TenantContext) {
    return this.kyraService.getAutomationTasks(ctx);
  }
}
