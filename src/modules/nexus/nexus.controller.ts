import { Body, Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import {
  NexusService,
  MultiClientAnalysisResult,
  IntegrityGateAlert,
} from './nexus.service';
import { CurrentTenant } from '../../common/decorators/tenant.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { TenantContext } from '../../common/interfaces/tenant-context.interface';
import { CognitiveResult } from '../../common/interfaces/cognitive-task.interface';

@ApiTags('nexus')
@ApiBearerAuth()
@Controller({ path: 'nexus', version: '1' })
export class NexusController {
  constructor(private readonly nexusService: NexusService) {}

  @Get('clients')
  @Roles(Role.CGO, Role.C_LEVEL)
  @ApiOperation({ summary: 'Get all managed clients with summary metrics (CGO dashboard)' })
  @ApiOkResponse({ description: 'Multi-client overview with aggregated metrics' })
  async getManagedClients(
    @CurrentTenant() tenant: TenantContext,
  ): Promise<MultiClientAnalysisResult> {
    return this.nexusService.getManagedClients(tenant);
  }

  @Post('optimize')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.CGO, Role.C_LEVEL)
  @ApiOperation({ summary: 'Request ATLAS multi-client optimization analysis' })
  @ApiCreatedResponse({ description: 'Cross-tenant optimization result from ATLAS' })
  async requestOptimization(
    @CurrentTenant() tenant: TenantContext,
    @Body() payload: Record<string, unknown>,
  ): Promise<CognitiveResult> {
    return this.nexusService.requestMultiClientOptimization(tenant, payload);
  }

  @Post('analyze')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.CGO, Role.C_LEVEL)
  @ApiOperation({ summary: 'Request ATLAS multi-client comparative analysis' })
  @ApiCreatedResponse({ description: 'Comparative analysis result from ATLAS' })
  async requestAnalysis(
    @CurrentTenant() tenant: TenantContext,
    @Body() payload: Record<string, unknown>,
  ): Promise<CognitiveResult> {
    return this.nexusService.requestMultiClientAnalysis(tenant, payload);
  }

  @Get('alerts')
  @Roles(Role.CGO, Role.C_LEVEL)
  @ApiOperation({ summary: 'Get Integrity Gate alerts across managed clients' })
  @ApiOkResponse({ description: 'List of alerts (anomalies, compliance risks, SLA violations)' })
  async getAlerts(
    @CurrentTenant() tenant: TenantContext,
  ): Promise<IntegrityGateAlert[]> {
    return this.nexusService.getIntegrityGateAlerts(tenant);
  }
}
