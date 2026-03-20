'use client';

import React from 'react';

interface ClientAlert {
  alertType: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  detectedAt: string;
}

interface AlertNotificationsProps {
  alerts: ClientAlert[];
}

export function AlertNotifications({ alerts }: AlertNotificationsProps): React.ReactElement {
  if (alerts.length === 0) {
    return (
      <div className="alert-notifications">
        <p>No active alerts.</p>
      </div>
    );
  }

  return (
    <div className="alert-notifications">
      <h3>Alerts ({alerts.length})</h3>
      {alerts.map((alert, index) => (
        <div key={`${alert.alertType}-${index}`} className={`alert alert-${alert.severity}`}>
          <strong>{alert.severity.toUpperCase()}</strong>: {alert.message}
          <span className="alert-time">{alert.detectedAt}</span>
        </div>
      ))}
    </div>
  );
}
