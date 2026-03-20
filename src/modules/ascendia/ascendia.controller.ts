import { Body, Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AscendiaService, AutopilotStatus } from './ascendia.service';
import { CurrentTenant } from '../../common/decorators/tenant.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { TenantContext } from '../../common/interfaces/tenant-context.interface';
import { CognitiveResult } from '../../common/interfaces/cognitive-task.interface';

@ApiTags('ascendia')
@ApiBearerAuth()
@Controller({ path: 'ascendia', version: '1' })
export class AscendiaController {
  constructor(private readonly ascendiaService: AscendiaService) {}

  @Get('autopilot')
  @Roles(Role.CLIENT, Role.MANAGER, Role.ANALYST)
  @ApiOperation({ summary: 'Get Autopilot dashboard status (Client view)' })
  @ApiOkResponse({ description: 'Client autopilot status with recent tasks and alerts' })
  async getAutopilotStatus(
    @CurrentTenant() tenant: TenantContext,
  ): Promise<AutopilotStatus> {
    return this.ascendiaService.getAutopilotStatus(tenant);
  }

  @Post('tasks/payroll')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.CLIENT, Role.MANAGER)
  @ApiOperation({ summary: 'Execute a payroll task via KYRA' })
  @ApiCreatedResponse({ description: 'Payroll task executed and result returned' })
  async executePayroll(
    @CurrentTenant() tenant: TenantContext,
    @Body() payload: Record<string, unknown>,
  ): Promise<CognitiveResult> {
    return this.ascendiaService.executePayrollTask(tenant, payload);
  }

  @Post('tasks/esg-reporting')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.CLIENT, Role.MANAGER, Role.ANALYST)
  @ApiOperation({ summary: 'Execute an ESG/CSRD reporting task via KYRA' })
  @ApiCreatedResponse({ description: 'ESG reporting task executed and result returned' })
  async executeEsgReporting(
    @CurrentTenant() tenant: TenantContext,
    @Body() payload: Record<string, unknown>,
  ): Promise<CognitiveResult> {
    return this.ascendiaService.executeEsgReporting(tenant, payload);
  }

  @Get('automations/status')
  @Roles(Role.CLIENT, Role.MANAGER, Role.ANALYST)
  @ApiOperation({ summary: 'Get automation task execution status' })
  @ApiOkResponse({ description: 'Task counts by status (pending, processing, completed)' })
  async getAutomationStatus(
    @CurrentTenant() tenant: TenantContext,
  ): Promise<{ pending: number; processing: number; completed: number }> {
    return this.ascendiaService.getAutomationStatus(tenant);
  }
}
