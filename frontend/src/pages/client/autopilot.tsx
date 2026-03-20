import React from 'react';
import { TenantType } from '../../../../shared/types/tenant';
import { RouteGuard } from '../../guards/route-guard';
import { TaskExecution } from '../../components/ascendia/task-execution';
import { AutomationStatus } from '../../components/ascendia/automation-status';
import { InsightCard } from '../../components/ascendia/insight-card';

/**
 * Client Autopilot – Ascendia Platform
 * Single-client cockpit view showing own automations,
 * task statuses, and personalized insights.
 */
export default function ClientAutopilotPage() {
  return (
    <RouteGuard allowedTenantType={TenantType.CLIENT}>
      <div style={{ padding: 24 }}>
        <header style={{ marginBottom: 24 }}>
          <h1>Ascendia – Cockpit Autopilot</h1>
          <p style={{ color: '#666' }}>
            Vos automatisations et tâches en temps réel
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <TaskExecution />
          <AutomationStatus />
        </div>

        <div style={{ marginTop: 24 }}>
          <InsightCard />
        </div>
      </div>
    </RouteGuard>
  );
}
