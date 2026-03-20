import { KyraService } from '../../src/kyra/kyra.service';
import { CgoKyraStrategy } from '../../src/kyra/strategies/cgo-kyra.strategy';
import { ClientKyraStrategy } from '../../src/kyra/strategies/client-kyra.strategy';
import { TenantType, Role, TenantContext } from '../../../shared/types/tenant';

describe('KyraService – Role-Based Routing', () => {
  let service: KyraService;

  const cgoContext: TenantContext = {
    userId: 'user-cgo',
    tenantId: 'tenant-cgo',
    tenantType: TenantType.CGO,
    role: Role.CGO_ADMIN,
  };

  const clientContext: TenantContext = {
    userId: 'user-client',
    tenantId: 'tenant-client',
    tenantType: TenantType.CLIENT,
    role: Role.CLIENT_EXEC,
  };

  beforeEach(() => {
    service = new KyraService(new CgoKyraStrategy(), new ClientKyraStrategy());
  });

  it('should return multi-client insights for CGO users', async () => {
    const insights = await service.getInsights(cgoContext);
    expect(insights.length).toBeGreaterThan(0);
    // CGO insights should include multi-client analysis
    const domains = insights.map((i) => i.domain);
    expect(domains).toContain('integrity');
  });

  it('should return single-tenant insights for CLIENT users', async () => {
    const insights = await service.getInsights(clientContext);
    expect(insights.length).toBeGreaterThan(0);
    // Client insights should be about their own operations
    const domains = insights.map((i) => i.domain);
    expect(domains).toContain('payroll');
    expect(domains).not.toContain('integrity');
  });

  it('should route CGO task execution to CGO strategy', async () => {
    const result = await service.executeTask(cgoContext, {
      taskType: 'optimization',
      parameters: {},
    });
    expect(result.taskId).toMatch(/^cgo-task-/);
    expect(result.status).toBe('queued');
  });

  it('should route CLIENT task execution to CLIENT strategy', async () => {
    const result = await service.executeTask(clientContext, {
      taskType: 'payroll',
      parameters: {},
    });
    expect(result.taskId).toMatch(/^client-task-/);
    expect(result.status).toBe('queued');
  });

  it('should return optimization recommendations for CGO only', async () => {
    const recommendations = await service.getMultiClientOptimization(cgoContext);
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0].clientName).toBeDefined();
    expect(recommendations[0].score).toBeGreaterThan(0);
  });

  it('should return automation tasks for CLIENT only', async () => {
    const tasks = await service.getAutomationTasks(clientContext);
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks[0].category).toBeDefined();
    expect(['payroll', 'reporting', 'compliance', 'monitoring']).toContain(tasks[0].category);
  });

  it('should never expose KYRA internals in sanitized insights', async () => {
    const cgoInsights = await service.getInsights(cgoContext);
    const clientInsights = await service.getInsights(clientContext);

    const allInsights = [...cgoInsights, ...clientInsights];
    for (const insight of allInsights) {
      const json = JSON.stringify(insight);
      expect(json).not.toContain('KYRA');
      expect(json).not.toContain('reasoningChain');
      expect(json).not.toContain('computeMetadata');
    }
  });
});
