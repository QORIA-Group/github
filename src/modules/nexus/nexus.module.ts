import { Module } from '@nestjs/common';
import { NexusController } from './nexus.controller';
import { NexusService } from './nexus.service';
import { AtlasModule } from '../atlas/atlas.module';

@Module({
  imports: [AtlasModule],
  controllers: [NexusController],
  providers: [NexusService],
})
export class NexusModule {}
