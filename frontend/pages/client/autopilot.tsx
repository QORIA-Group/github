'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth.context';
import { AutopilotDashboard } from '../../components/ascend/autopilot-dashboard';
import { TaskExecutor } from '../../components/ascend/task-executor';
import { AlertNotifications } from '../../components/ascend/alert-notifications';
import { CognitiveResult } from '../../types/atlas.types';

/**
 * Client Autopilot Page (Ascend)
 * Route: /client/autopilot
 *
 * Single-tenant view: shows only the client's own automations and data.
 * ATLAS actions: payroll execution, ESG reporting, task monitoring.
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

    // Fetch autopilot status from /api/v1/ascend/autopilot
    // Fetch automation status from /api/v1/ascend/automations/status
    // These API calls include x-tenant-id, x-tenant-type=CLIENT headers
  }, [isClient, user]);

  const handlePayroll = async (
    payload: Record<string, unknown>,
  ): Promise<CognitiveResult> => {
    // POST /api/v1/ascend/tasks/payroll
    return {} as CognitiveResult; // Placeholder
  };

  const handleEsgReporting = async (
    payload: Record<string, unknown>,
  ): Promise<CognitiveResult> => {
    // POST /api/v1/ascend/tasks/esg-reporting
    return {} as CognitiveResult; // Placeholder
  };

  if (!isClient) {
    return <div>Access denied. Client role required.</div>;
  }

  return (
    <div className="client-autopilot">
      <header>
        <h1>Ascend Autopilot</h1>
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
