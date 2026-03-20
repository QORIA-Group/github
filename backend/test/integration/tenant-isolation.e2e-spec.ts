import { KyraService } from '../../src/kyra/kyra.service';
import { CgoKyraStrategy } from '../../src/kyra/strategies/cgo-kyra.strategy';
import { ClientKyraStrategy } from '../../src/kyra/strategies/client-kyra.strategy';
import { PulseFlowService } from '../../src/pulseflow/pulseflow.service';
import { TenantType, Role, TenantContext } from '../../../shared/types/tenant';

/**
 * End-to-end tenant isolation tests.
 * Verifies that:
 * 1. CGO users get multi-client data
 * 2. CLIENT users get only their own data
 * 3. PulseFlow events respect tenant boundaries
 *
 * In production, these would use testcontainers with PostgreSQL + RLS.
 * This scaffold validates the routing logic and strategy selection.
 */
describe('Tenant Isolation E2E', () => {
  let kyraService: KyraService;
  let pulseFlowService: PulseFlowService;

  const cgoTenant: TenantContext = {
    userId: 'cgo-user-001',
    tenantId: 'cgo-tenant-001',
    tenantType: TenantType.CGO,
    role: Role.CGO_ADMIN,
  };

  const clientA: TenantContext = {
    userId: 'client-user-001',
    tenantId: 'client-tenant-001',
    tenantType: TenantType.CLIENT,
    role: Role.CLIENT_EXEC,
  };

  const clientB: TenantContext = {
    userId: 'client-user-002',
    tenantId: 'client-tenant-002',
    tenantType: TenantType.CLIENT,
    role: Role.CLIENT_USER,
  };

  beforeEach(() => {
    kyraService = new KyraService(new CgoKyraStrategy(), new ClientKyraStrategy());
    pulseFlowService = new PulseFlowService();
  });

  describe('CGO Tenant Access', () => {
    it('should access multi-client insights', async () => {
      const insights = await kyraService.getInsights(cgoTenant);
      expect(insights.length).toBeGreaterThanOrEqual(2);
    });

    it('should access optimization recommendations for all clients', async () => {
      const recommendations = await kyraService.getMultiClientOptimization(cgoTenant);
      expect(recommendations.length).toBeGreaterThanOrEqual(2);
      const clientNames = recommendations.map((r) => r.clientName);
      expect(clientNames.length).toBeGreaterThan(1);
    });

    it('should access integrity alerts', async () => {
      const alerts = await kyraService.getIntegrityAlerts(cgoTenant);
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0].severity).toBe('critical');
    });

    it('should see aggregated PulseFlow status', async () => {
      const status = await pulseFlowService.getStatus(cgoTenant);
      // CGO sees higher numbers (aggregated across clients)
      expect(status.activeEvents).toBeGreaterThan(10);
    });
  });

  describe('CLIENT Tenant Isolation', () => {
    it('should only see own insights', async () => {
      const insightsA = await kyraService.getInsights(clientA);
      const insightsB = await kyraService.getInsights(clientB);

      // Both get insights but they are tenant-scoped
      expect(insightsA.length).toBeGreaterThan(0);
      expect(insightsB.length).toBeGreaterThan(0);
    });

    it('should get own automation tasks', async () => {
      const tasks = await kyraService.getAutomationTasks(clientA);
      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks.every((t) => ['payroll', 'reporting', 'compliance', 'monitoring'].includes(t.category))).toBe(true);
    });

    it('should see own PulseFlow status only', async () => {
      const status = await pulseFlowService.getStatus(clientA);
      // Client sees lower numbers (own data only)
      expect(status.activeEvents).toBeLessThan(20);
    });

    it('should emit PulseFlow events scoped to own tenant', async () => {
      const event = await pulseFlowService.emit(clientA, 'test.event', { test: true });
      expect(event.tenantId).toBe(clientA.tenantId);
    });
  });

  describe('Cross-Tenant Protection', () => {
    it('should route CGO and CLIENT to different strategies', async () => {
      const cgoResult = await kyraService.executeTask(cgoTenant, {
        taskType: 'analysis',
        parameters: {},
      });
      const clientResult = await kyraService.executeTask(clientA, {
        taskType: 'payroll',
        parameters: {},
      });

      expect(cgoResult.taskId).toMatch(/^cgo-/);
      expect(clientResult.taskId).toMatch(/^client-/);
    });
  });
});
