'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth.context';
import { AutopilotDashboard } from '../../components/ascendia/autopilot-dashboard';
import { TaskExecutor } from '../../components/ascendia/task-executor';
import { AlertNotifications } from '../../components/ascendia/alert-notifications';
import { CognitiveResult } from '../../types/kyra.types';

/**
 * Client Autopilot Page (Ascendia)
 * Route: /client/autopilot
 *
 * Single-tenant view: shows only the client's own automations and data.
 * KYRA actions: payroll execution, ESG reporting, task monitoring.
 */
export default function ClientAutopilot(): React.ReactElement {
  const { user, isClient } = useAuth();
  const [tenantName, setTenantName] = useState('');
  const [recentTasks, setRecentTasks] = useState<TaskSummary[]>([]);
  const [automationCounts, setAutomationCounts] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
  });
  const [alerts, setAlerts] = useState<ClientAlert[]>([]);

  useEffect(() => {
    if (!isClient || !user) return;

    // Fetch autopilot status from /api/v1/ascendia/autopilot
    // Fetch automation status from /api/v1/ascendia/automations/status
    // These API calls include x-tenant-id, x-tenant-type=CLIENT headers
  }, [isClient, user]);

  const handlePayroll = async (
    payload: Record<string, unknown>,
  ): Promise<CognitiveResult> => {
    // POST /api/v1/ascendia/tasks/payroll
    return {} as CognitiveResult; // Placeholder
  };

  const handleEsgReporting = async (
    payload: Record<string, unknown>,
  ): Promise<CognitiveResult> => {
    // POST /api/v1/ascendia/tasks/esg-reporting
    return {} as CognitiveResult; // Placeholder
  };

  if (!isClient) {
    return <div>Access denied. Client role required.</div>;
  }

  return (
    <div className="client-autopilot">
      <header>
        <h1>Ascendia Autopilot</h1>
      </header>

      <div className="autopilot-grid">
        <section className="status-section">
          <AutopilotDashboard
            tenantName={tenantName}
            recentTasks={recentTasks}
            automationCounts={automationCounts}
          />
        </section>

        <section className="executor-section">
          <TaskExecutor
            onExecutePayroll={handlePayroll}
            onExecuteEsgReporting={handleEsgReporting}
          />
        </section>

        <section className="alerts-section">
          <AlertNotifications alerts={alerts} />
        </section>
      </div>
    </div>
  );
}

// Local type aliases matching backend response
interface TaskSummary {
  id: string;
  taskType: string;
  status: string;
  brainLevel: string | null;
  processingTimeMs: number | null;
  createdAt: string;
}

interface ClientAlert {
  alertType: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  detectedAt: string;
}
