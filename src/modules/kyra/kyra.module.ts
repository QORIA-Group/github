import { Module } from '@nestjs/common';
import { KyraController } from './kyra.controller';
import { KyraService } from './kyra.service';
import { ReptilianService } from './tri-brain/reptilian.service';
import { LimbicService } from './tri-brain/limbic.service';
import { NeocortexService } from './tri-brain/neocortex.service';
import { PulseFlowModule } from '../pulseflow/pulseflow.module';

@Module({
  imports: [PulseFlowModule],
  controllers: [KyraController],
  providers: [KyraService, ReptilianService, LimbicService, NeocortexService],
  exports: [KyraService],
})
export class KyraModule {}
