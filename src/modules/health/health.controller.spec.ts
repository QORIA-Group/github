import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService, HealthCheckResult } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthService;

  const mockHealthResult: HealthCheckResult = {
    status: 'healthy',
    version: '0.1.0',
    timestamp: '2026-01-01T00:00:00.000Z',
    subsystems: {
      postgresql: { status: 'up', latencyMs: 5 },
      neo4j: { status: 'up', latencyMs: 10 },
      pulseflow: { status: 'up' },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: {
            check: jest.fn().mockResolvedValue(mockHealthResult),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health check result', async () => {
    const result = await controller.check();

    expect(result).toEqual(mockHealthResult);
    expect(service.check).toHaveBeenCalledTimes(1);
  });

  it('should return degraded status when a subsystem is down', async () => {
    const degradedResult: HealthCheckResult = {
      ...mockHealthResult,
      status: 'degraded',
      subsystems: {
        ...mockHealthResult.subsystems,
        neo4j: { status: 'down' },
      },
    };
    jest.spyOn(service, 'check').mockResolvedValueOnce(degradedResult);

    const result = await controller.check();

    expect(result.status).toBe('degraded');
  });
});
