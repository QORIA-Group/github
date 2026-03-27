import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { HealthService, HealthCheckResult } from './health.service';

@ApiTags('health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'System health check' })
  @ApiOkResponse({ description: 'Health status of all Qorway OS subsystems' })
  async check(): Promise<HealthCheckResult> {
    return this.healthService.check();
  }
}
