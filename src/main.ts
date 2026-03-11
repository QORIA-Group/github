import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { QoriaExceptionFilter } from './common/filters/qoria-exception.filter';
import { StructuredLogger } from './common/utils/structured-logger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(StructuredLogger);
  app.useLogger(logger);

  app.use(helmet());

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3001',
    credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  app.useGlobalFilters(new QoriaExceptionFilter(logger));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('QORIA OS API')
    .setDescription('QORIA OS - European Causal AI Operating System API Gateway')
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('health', 'Health check endpoints')
    .addTag('auth', 'Authentication & Authorization')
    .addTag('kyra', 'KYRA Cognitive Engine')
    .addTag('pulseflow', 'PulseFlow Event Protocol')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`QORIA OS Gateway started on port ${port}`, 'Bootstrap');
  logger.log(`Swagger documentation available at /api/docs`, 'Bootstrap');
}

bootstrap();
