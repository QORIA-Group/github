import { Controller, Get, UseGuards } from '@nestjs/common';
import { PulseFlowService } from './pulseflow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';
import { TenantContext } from '../../../shared/types/tenant';

@Controller('pulseflow')
@UseGuards(JwtAuthGuard)
export class PulseFlowController {
  constructor(private readonly pulseFlowService: PulseFlowService) {}

  @Get('status')
  async getStatus(@CurrentTenant() ctx: TenantContext) {
    return this.pulseFlowService.getStatus(ctx);
  }

  @Get('events')
  async getRecentEvents(@CurrentTenant() ctx: TenantContext) {
    return this.pulseFlowService.getRecentEvents(ctx);
  }
}
