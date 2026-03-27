'use client';

import React from 'react';

interface TaskSummary {
  id: string;
  taskType: string;
  status: string;
  brainLevel: string | null;
  processingTimeMs: number | null;
  createdAt: string;
}

interface AutopilotDashboardProps {
  tenantName: string;
  recentTasks: TaskSummary[];
  automationCounts: { pending: number; processing: number; completed: number };
}

export function AutopilotDashboard({
  tenantName,
  recentTasks,
  automationCounts,
}: AutopilotDashboardProps): React.ReactElement {
  return (
    <div className="autopilot-dashboard">
      <h2>{tenantName} - Autopilot</h2>

      <div className="automation-stats">
        <div className="stat-card">
          <span className="stat-value">{automationCounts.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{automationCounts.processing}</span>
          <span className="stat-label">Processing</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{automationCounts.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      <h3>Recent Tasks</h3>
      <ul className="task-list">
        {recentTasks.map((task) => (
          <li key={task.id} className="task-item">
            <span className="task-type">{task.taskType}</span>
            <span className={`task-status status-${task.status.toLowerCase()}`}>
              {task.status}
            </span>
            {task.brainLevel && (
              <span className="task-brain-level">{task.brainLevel}</span>
            )}
            {task.processingTimeMs !== null && (
              <span className="task-time">{task.processingTimeMs}ms</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
