import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TenantMiddleware } from './tenant.middleware';

@Module({})
export class TenantModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(TenantMiddleware)
      .exclude('api/v1/health(.*)', 'api/docs(.*)')
      .forRoutes('*');
  }
}
