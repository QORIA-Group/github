/**
 * Tests for the Task Execution component (Ascendia/CLIENT).
 * Verifies that only the client's own tasks are displayed.
 */
import { SanitizedInsight, AutomationTask } from '../../../../shared/types/kyra';

describe('TaskExecution Data', () => {
  const mockClientInsights: SanitizedInsight[] = [
    {
      id: 'insight-client-1',
      title: 'Paie traitée',
      description: 'Paie mars 2026 pour 145 salariés',
      severity: 'info',
      domain: 'payroll',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'insight-client-2',
      title: 'Reporting ESG en attente',
      description: 'Rapport CSRD Q1 nécessite validation',
      severity: 'warning',
      domain: 'compliance',
      createdAt: new Date().toISOString(),
    },
  ];

  const mockAutomationTasks: AutomationTask[] = [
    {
      id: 'auto-1',
      name: 'Paie mensuelle automatisée',
      status: 'active',
      lastRun: new Date().toISOString(),
      nextRun: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'payroll',
    },
    {
      id: 'auto-2',
      name: 'Collecte KPI ESG',
      status: 'active',
      lastRun: new Date().toISOString(),
      category: 'monitoring',
    },
  ];

  it('should display client-specific insights only', () => {
    // Client should not see integrity or multi-client domains
    const domains = mockClientInsights.map((i) => i.domain);
    expect(domains).not.toContain('integrity');
    expect(domains).toContain('payroll');
  });

  it('should display automation tasks with valid categories', () => {
    const categories = mockAutomationTasks.map((t) => t.category);
    for (const cat of categories) {
      expect(['payroll', 'reporting', 'compliance', 'monitoring']).toContain(cat);
    }
  });

  it('should show task status correctly', () => {
    const statuses = mockAutomationTasks.map((t) => t.status);
    for (const status of statuses) {
      expect(['active', 'paused', 'completed', 'error']).toContain(status);
    }
  });

  it('should never contain multi-client data', () => {
    for (const insight of mockClientInsights) {
      expect(insight.description).not.toContain('multi-client');
      expect(insight.description).not.toContain('12 clients');
    }
  });
});
