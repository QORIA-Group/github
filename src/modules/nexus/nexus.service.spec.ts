import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { NexusService } from './nexus.service';
import { PrismaService } from '../../database/prisma/prisma.service';
import { KyraService } from '../kyra/kyra.service';
import { StructuredLogger } from '../../common/utils/structured-logger';
import { TenantContext } from '../../common/interfaces/tenant-context.interface';
import { TenantType } from '../../common/enums/tenant-type.enum';

describe('NexusService', () => {
  let service: NexusService;

  const mockPrisma = {
    tenant: { findUnique: jest.fn() },
    user: { count: jest.fn() },
    cognitiveTask: { count: jest.fn() },
  };

  const mockKyra = {
    processCognitiveTask: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    logCognitiveDecision: jest.fn(),
  };

  const cgoTenant: TenantContext = {
    tenantId: 'cgo-tenant-001',
    userId: 'cgo-user-001',
    roles: ['cgo'],
    tenantType: TenantType.CGO,
    correlationId: 'corr-001',
    managedTenantIds: ['client-tenant-001', 'client-tenant-002'],
  };

  const clientTenant: TenantContext = {
    tenantId: 'client-tenant-001',
    userId: 'client-user-001',
    roles: ['client'],
    tenantType: TenantType.CLIENT,
    correlationId: 'corr-002',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NexusService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: KyraService, useValue: mockKyra },
        { provide: StructuredLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<NexusService>(NexusService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getManagedClients', () => {
    it('should return managed clients for CGO tenant', async () => {
      mockPrisma.tenant.findUnique
        .mockResolvedValueOnce({ id: 'client-tenant-001', name: 'Acme Corp', slug: 'acme', isActive: true })
        .mockResolvedValueOnce({ id: 'client-tenant-002', name: 'Beta Inc', slug: 'beta', isActive: false });
      mockPrisma.user.count.mockResolvedValue(5);
      mockPrisma.cognitiveTask.count.mockResolvedValue(10);

      const result = await service.getManagedClients(cgoTenant);

      expect(result.clientCount).toBe(2);
      expect(result.clients).toHaveLength(2);
      expect(result.clients[0].name).toBe('Acme Corp');
      expect(result.clients[1].name).toBe('Beta Inc');
      expect(result.aggregatedMetrics.activeClients).toBe(1);
    });

    it('should REJECT access for CLIENT tenants', async () => {
      await expect(service.getManagedClients(clientTenant)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('requestMultiClientOptimization', () => {
    it('should route KYRA task with cross_tenant scope for CGO', async () => {
      const mockResult = { taskId: 'task-1', level: 'NEOCORTEX' };
      mockKyra.processCognitiveTask.mockResolvedValue(mockResult);

      const result = await service.requestMultiClientOptimization(cgoTenant, { domain: 'payroll' });

      expect(result).toEqual(mockResult);
      expect(mockKyra.processCognitiveTask).toHaveBeenCalledWith(
        cgoTenant,
        'multi_client_optimization',
        expect.objectContaining({
          managed_tenant_ids: cgoTenant.managedTenantIds,
          analysis_scope: 'cross_tenant',
        }),
      );
    });

    it('should REJECT optimization requests from CLIENT tenants', async () => {
      await expect(
        service.requestMultiClientOptimization(clientTenant, {}),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getIntegrityGateAlerts', () => {
    it('should detect inactive client alert', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValue({
        name: 'Inactive Corp',
        isActive: false,
      });
      mockPrisma.cognitiveTask.count.mockResolvedValue(0);

      const alerts = await service.getIntegrityGateAlerts(cgoTenant);

      expect(alerts.length).toBeGreaterThanOrEqual(1);
      const inactiveAlert = alerts.find((a) => a.alertType === 'client_inactive');
      expect(inactiveAlert).toBeDefined();
      expect(inactiveAlert?.severity).toBe('high');
    });

    it('should REJECT alerts request from CLIENT tenants', async () => {
      await expect(
        service.getIntegrityGateAlerts(clientTenant),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
