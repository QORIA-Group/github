import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TenantModule } from './tenant/tenant.module';
import { AuthModule } from './auth/auth.module';
import { KyraModule } from './kyra/kyra.module';
import { PulseFlowModule } from './pulseflow/pulseflow.module';
import { TenantMiddleware } from './tenant/tenant.middleware';

@Module({
  imports: [TenantModule, AuthModule, KyraModule, PulseFlowModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
