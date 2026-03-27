import { Module } from '@nestjs/common';
import { AtlasController } from './atlas.controller';
import { AtlasService } from './atlas.service';
import { ReptilianService } from './tri-brain/reptilian.service';
import { LimbicService } from './tri-brain/limbic.service';
import { NeocortexService } from './tri-brain/neocortex.service';
import { PulseFlowModule } from '../pulseflow/pulseflow.module';

@Module({
  imports: [PulseFlowModule],
  controllers: [AtlasController],
  providers: [AtlasService, ReptilianService, LimbicService, NeocortexService],
  exports: [AtlasService],
})
export class AtlasModule {}
