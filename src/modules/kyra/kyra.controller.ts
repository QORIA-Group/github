import { Body, Controller, Get, Post, Query, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { KyraService } from './kyra.service';
import { CreateCognitiveTaskDto } from './dto/cognitive-task.dto';
import { CurrentTenant } from '../../common/decorators/tenant.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { TenantContext } from '../../common/interfaces/tenant-context.interface';
import { CognitiveResult } from '../../common/interfaces/cognitive-task.interface';

@ApiTags('kyra')
@ApiBearerAuth()
@Controller({ path: 'kyra', version: '1' })
export class KyraController {
  constructor(private readonly kyraService: KyraService) {}

  @Post('tasks')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.C_LEVEL, Role.CGO, Role.MANAGER, Role.ANALYST, Role.AI_AGENT)
  @ApiOperation({ summary: 'Submit a cognitive task to the KYRA Tri-Brain engine' })
  @ApiCreatedResponse({ description: 'Cognitive task processed and result returned' })
  async submitTask(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: CreateCognitiveTaskDto,
  ): Promise<CognitiveResult> {
    return this.kyraService.processCognitiveTask(
      tenant,
      dto.taskType,
      dto.payload,
    );
  }

  @Get('tasks/history')
  @Roles(Role.C_LEVEL, Role.CGO, Role.TENANT_ADMIN)
  @ApiOperation({ summary: 'Get cognitive task processing history' })
  @ApiOkResponse({ description: 'List of cognitive tasks with their processing metadata' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getHistory(
    @CurrentTenant() tenant: TenantContext,
    @Query('limit') limit?: string,
  ): Promise<{ tasks: Record<string, unknown>[] }> {
    const parsedLimit = limit ? parseInt(limit, 10) : 20;
    return this.kyraService.getTaskHistory(tenant, parsedLimit);
  }
}
