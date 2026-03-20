import { Module } from '@nestjs/common';
import { PulseFlowService } from './pulseflow.service';
import { PulseFlowController } from './pulseflow.controller';

@Module({
  controllers: [PulseFlowController],
  providers: [PulseFlowService],
  exports: [PulseFlowService],
})
export class PulseFlowModule {}
