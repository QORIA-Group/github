import { Module } from '@nestjs/common';
import { NexusController } from './nexus.controller';
import { NexusService } from './nexus.service';
import { KyraModule } from '../kyra/kyra.module';

@Module({
  imports: [KyraModule],
  controllers: [NexusController],
  providers: [NexusService],
})
export class NexusModule {}
