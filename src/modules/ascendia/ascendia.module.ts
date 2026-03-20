import { Module } from '@nestjs/common';
import { AscendiaController } from './ascendia.controller';
import { AscendiaService } from './ascendia.service';
import { KyraModule } from '../kyra/kyra.module';
import { PulseFlowModule } from '../pulseflow/pulseflow.module';

@Module({
  imports: [KyraModule, PulseFlowModule],
  controllers: [AscendiaController],
  providers: [AscendiaService],
})
export class AscendiaModule {}
