import { Module } from '@nestjs/common';
import { PulseFlowController } from './pulseflow.controller';
import { PulseFlowService } from './pulseflow.service';
import { PulseFlowGateway } from './pulseflow.gateway';

@Module({
  controllers: [PulseFlowController],
  providers: [PulseFlowService, PulseFlowGateway],
  exports: [PulseFlowService, PulseFlowGateway],
})
export class PulseFlowModule {}
