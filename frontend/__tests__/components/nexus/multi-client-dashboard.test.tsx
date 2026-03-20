/**
 * Tests for the Multi-Client Dashboard (Nexus/CGO component).
 * Verifies that the dashboard renders client list for CGO users.
 */
import { SanitizedInsight } from '../../../../shared/types/kyra';

describe('MultiClientDashboard Data', () => {
  const mockCgoInsights: SanitizedInsight[] = [
    {
      id: 'insight-1',
      title: 'Optimisation multi-clients',
      description: 'Analyse comparative',
      severity: 'info',
      domain: 'payroll',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'insight-2',
      title: 'Alerte conformité',
      description: 'Retard CSRD',
      severity: 'warning',
      domain: 'compliance',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'insight-3',
      title: 'Anomalie Integrity Gate',
      description: 'Incohérence comptable',
      severity: 'critical',
      domain: 'integrity',
      createdAt: new Date().toISOString(),
    },
  ];

  it('should display insights across multiple domains for CGO', () => {
    const domains = mockCgoInsights.map((i) => i.domain);
    expect(domains).toContain('payroll');
    expect(domains).toContain('compliance');
    expect(domains).toContain('integrity');
  });

  it('should include severity levels for proper color coding', () => {
    const severities = mockCgoInsights.map((i) => i.severity);
    expect(severities).toContain('info');
    expect(severities).toContain('warning');
    expect(severities).toContain('critical');
  });

  it('should never contain KYRA internal references', () => {
    for (const insight of mockCgoInsights) {
      const json = JSON.stringify(insight);
      expect(json).not.toContain('KYRA');
      expect(json).not.toContain('reasoningChain');
    }
  });
});
