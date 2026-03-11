import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';
import { kyraConfig } from './config/kyra.config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './modules/health/health.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { AuthModule } from './modules/auth/auth.module';
import { PulseFlowModule } from './modules/pulseflow/pulseflow.module';
import { KyraModule } from './modules/kyra/kyra.module';
import { StructuredLoggerModule } from './common/utils/structured-logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, kyraConfig],
      envFilePath: ['.env'],
    }),
    StructuredLoggerModule,
    DatabaseModule,
    TenantModule,
    AuthModule,
    HealthModule,
    PulseFlowModule,
    KyraModule,
  ],
})
export class AppModule {}
