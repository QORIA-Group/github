import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';
import { atlasConfig } from './config/atlas.config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './modules/health/health.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { AuthModule } from './modules/auth/auth.module';
import { PulseFlowModule } from './modules/pulseflow/pulseflow.module';
import { AtlasModule } from './modules/atlas/atlas.module';
import { NexusModule } from './modules/nexus/nexus.module';
import { AscendModule } from './modules/ascend/ascend.module';
import { StructuredLoggerModule } from './common/utils/structured-logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, atlasConfig],
      envFilePath: ['.env'],
    }),
    StructuredLoggerModule,
    DatabaseModule,
    TenantModule,
    AuthModule,
    HealthModule,
    PulseFlowModule,
    AtlasModule,
    NexusModule,
    AscendModule,
  ],
})
export class AppModule {}
