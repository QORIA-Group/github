import { Test, TestingModule } from '@nestjs/testing';
import { ReptilianService } from './reptilian.service';
import { StructuredLogger } from '../../../common/utils/structured-logger';
import { CognitiveTask } from '../../../common/interfaces/cognitive-task.interface';
import { TriBrainLevel } from '../../../common/enums/tri-brain-level.enum';
import { TenantType } from '../../../common/enums/tenant-type.enum';

describe('ReptilianService', () => {
  let service: ReptilianService;

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    logCognitiveDecision: jest.fn(),
    logCausalEvidence: jest.fn(),
    setTenantContext: jest.fn(),
  };

  const createTask = (type: string, payload: Record<string, unknown>): CognitiveTask => ({
    taskId: 'test-task-id',
    tenantId: 'test-tenant-id',
    type,
    payload,
    context: {
      correlationId: 'test-correlation-id',
      userId: 'test-user-id',
      source: 'test',
      tenantType: TenantType.CLIENT,
    },
    createdAt: new Date(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReptilianService,
        { provide: StructuredLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<ReptilianService>(ReptilianService);
    service.clearCache();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('threshold_check', () => {
    it('should resolve a threshold check when value exceeds threshold', async () => {
      const task = createTask('threshold_check', { value: 100, threshold: 50 });

      const result = await service.process(task);

      expect(result).not.toBeNull();
      expect(result?.level).toBe(TriBrainLevel.REPTILIAN);
      expect(result?.result).toEqual({
        exceeds_threshold: true,
        value: 100,
        threshold: 50,
        delta: 50,
      });
      expect(result?.cached).toBe(false);
    });

    it('should resolve a threshold check when value is below threshold', async () => {
      const task = createTask('threshold_check', { value: 30, threshold: 50 });

      const result = await service.process(task);

      expect(result).not.toBeNull();
      expect(result?.result).toEqual({
        exceeds_threshold: false,
        value: 30,
        threshold: 50,
        delta: -20,
      });
    });

    it('should return null when payload is missing required fields', async () => {
      const task = createTask('threshold_check', {});

      const result = await service.process(task);

      expect(result).toBeNull();
    });
  });

  describe('caching', () => {
    it('should return cached result on second call with same input', async () => {
      const task = createTask('threshold_check', { value: 100, threshold: 50 });

      const first = await service.process(task);
      const second = await service.process(task);

      expect(first?.cached).toBe(false);
      expect(second?.cached).toBe(true);
      expect(second?.result).toEqual(first?.result);
    });
  });

  describe('unknown task types', () => {
    it('should return null for unknown task types (escalate to Limbic)', async () => {
      const task = createTask('complex_analysis', { data: 'test' });

      const result = await service.process(task);

      expect(result).toBeNull();
    });
  });
});
