import { Module } from '@nestjs/common';
import { AscendController } from './ascend.controller';
import { AscendService } from './ascend.service';
import { AtlasModule } from '../atlas/atlas.module';
import { PulseFlowModule } from '../pulseflow/pulseflow.module';

@Module({
  imports: [AtlasModule, PulseFlowModule],
  controllers: [AscendController],
  providers: [AscendService],
})
export class AscendModule {}
