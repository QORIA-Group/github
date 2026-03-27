import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { AscendService } from './ascend.service';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AtlasService } from '../atlas/atlas.service';
import { PulseFlowService } from '../pulseflow/pulseflow.service';
import { StructuredLogger } from '../../common/utils/structured-logger';
import { TenantContext } from '../../common/interfaces/tenant-context.interface';
import { TenantType } from '../../common/enums/tenant-type.enum';

describe('AscendService', () => {
  let service: AscendService;

  const mockPrisma = {
    executeInTenantContext: jest.fn(),
    cognitiveTask: { count: jest.fn() },
  };

  const mockAtlas = {
    processCognitiveTask: jest.fn(),
  };

  const mockPulseflow = {
    emitEvent: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    logCognitiveDecision: jest.fn(),
  };

  const clientTenant: TenantContext = {
    tenantId: 'client-tenant-001',
    userId: 'client-user-001',
    roles: ['client'],
    tenantType: TenantType.CLIENT,
    correlationId: 'corr-001',
  };

  const cgoTenant: TenantContext = {
    tenantId: 'cgo-tenant-001',
    userId: 'cgo-user-001',
    roles: ['cgo'],
    tenantType: TenantType.CGO,
    correlationId: 'corr-002',
    managedTenantIds: ['client-tenant-001'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AscendService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AtlasService, useValue: mockAtlas },
        { provide: PulseFlowService, useValue: mockPulseflow },
        { provide: StructuredLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<AscendService>(AscendService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getAutopilotStatus', () => {
    it('should return autopilot status for CLIENT tenant', async () => {
      mockPrisma.executeInTenantContext
        .mockResolvedValueOnce({ id: 'client-tenant-001', name: 'Test Corp' })
        .mockResolvedValueOnce([
          {
            id: 'task-1',
            taskType: 'payroll_execution',
            status: 'COMPLETED',
            brainLevel: 'REPTILIAN',
            processingTimeMs: 12,
            createdAt: new Date(),
          },
        ]);
      mockPrisma.cognitiveTask.count.mockResolvedValue(0);

      const result = await service.getAutopilotStatus(clientTenant);

      expect(result.tenantId).toBe('client-tenant-001');
      expect(result.recentTasks).toHaveLength(1);
      expect(result.recentTasks[0].taskType).toBe('payroll_execution');
    });

    it('should REJECT access for CGO tenants', async () => {
      await expect(service.getAutopilotStatus(cgoTenant)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('executePayrollTask', () => {
    it('should route payroll task through ATLAS with single_tenant scope', async () => {
      const mockResult = {
        taskId: 'task-1',
        level: 'REPTILIAN',
        result: {},
        causalEvidence: [],
        processingTimeMs: 5,
        cached: false,
      };
      mockAtlas.processCognitiveTask.mockResolvedValue(mockResult);
      mockPulseflow.emitEvent.mockResolvedValue({});

      const result = await service.executePayrollTask(clientTenant, { month: '2026-03' });

      expect(result).toEqual(mockResult);
      expect(mockAtlas.processCognitiveTask).toHaveBeenCalledWith(
        clientTenant,
        'payroll_execution',
        expect.objectContaining({
          scope: 'single_tenant',
          tenant_id: 'client-tenant-001',
          month: '2026-03',
        }),
      );
    });

    it('should REJECT payroll execution from CGO tenants', async () => {
      await expect(
        service.executePayrollTask(cgoTenant, {}),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getAutomationStatus', () => {
    it('should return task counts for CLIENT tenant', async () => {
      mockPrisma.executeInTenantContext.mockResolvedValue({
        pending: 3,
        processing: 1,
        completed: 42,
      });

      const result = await service.getAutomationStatus(clientTenant);

      expect(result.pending).toBe(3);
      expect(result.processing).toBe(1);
      expect(result.completed).toBe(42);
    });

    it('should REJECT from CGO tenants', async () => {
      await expect(service.getAutomationStatus(cgoTenant)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
