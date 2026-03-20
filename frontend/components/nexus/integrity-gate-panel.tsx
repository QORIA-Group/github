'use client';

import React from 'react';

interface IntegrityGateAlert {
  clientTenantId: string;
  clientName: string;
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  detectedAt: string;
}

interface IntegrityGatePanelProps {
  alerts: IntegrityGateAlert[];
}

const severityColors: Record<string, string> = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336',
  critical: '#9c27b0',
};

export function IntegrityGatePanel({ alerts }: IntegrityGatePanelProps): React.ReactElement {
  if (alerts.length === 0) {
    return (
      <div className="integrity-gate-panel">
        <h3>Integrity Gate</h3>
        <p className="no-alerts">All systems nominal across managed clients.</p>
      </div>
    );
  }

  return (
    <div className="integrity-gate-panel">
      <h3>Integrity Gate Alerts ({alerts.length})</h3>
      <ul className="alert-list">
        {alerts.map((alert, index) => (
          <li
            key={`${alert.clientTenantId}-${alert.alertType}-${index}`}
            className="alert-item"
            style={{ borderLeft: `4px solid ${severityColors[alert.severity]}` }}
          >
            <div className="alert-header">
              <span className="alert-severity">{alert.severity.toUpperCase()}</span>
              <span className="alert-client">{alert.clientName}</span>
            </div>
            <p className="alert-message">{alert.message}</p>
            <span className="alert-time">{alert.detectedAt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
