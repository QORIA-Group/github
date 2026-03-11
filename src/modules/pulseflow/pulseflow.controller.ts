import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { PulseFlowService, PulseFlowEvent } from './pulseflow.service';
import { EmitEventDto } from './dto/emit-event.dto';
import { CurrentTenant } from '../../common/decorators/tenant.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { TenantContext } from '../../common/interfaces/tenant-context.interface';

@ApiTags('pulseflow')
@ApiBearerAuth()
@Controller({ path: 'pulseflow', version: '1' })
export class PulseFlowController {
  constructor(private readonly pulseFlowService: PulseFlowService) {}

  @Post('emit')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.TENANT_ADMIN, Role.C_LEVEL, Role.AI_AGENT)
  @ApiOperation({ summary: 'Emit a PulseFlow event via the Outbox pattern' })
  @ApiCreatedResponse({ description: 'Event successfully queued in outbox' })
  async emitEvent(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: EmitEventDto,
  ): Promise<PulseFlowEvent> {
    return this.pulseFlowService.emitEvent(
      tenant,
      dto.eventType,
      dto.aggregateId,
      dto.aggregateType,
      dto.payload,
    );
  }
}
