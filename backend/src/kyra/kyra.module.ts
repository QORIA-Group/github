import { Module } from '@nestjs/common';
import { KyraController } from './kyra.controller';
import { KyraService } from './kyra.service';
import { CgoKyraStrategy } from './strategies/cgo-kyra.strategy';
import { ClientKyraStrategy } from './strategies/client-kyra.strategy';

@Module({
  controllers: [KyraController],
  providers: [KyraService, CgoKyraStrategy, ClientKyraStrategy],
})
export class KyraModule {}
