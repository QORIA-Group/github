'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth.context';
import { ClientOverviewTable } from '../../components/nexus/client-overview-table';
import { IntegrityGatePanel } from '../../components/nexus/integrity-gate-panel';
import { MultiClientAnalysis } from '../../components/nexus/multi-client-analysis';
import { CognitiveResult } from '../../types/kyra.types';

/**
 * CGO Dashboard Page (Nexus)
 * Route: /cgo/dashboard
 *
 * Multi-client view: shows all managed Ascendia clients.
 * KYRA actions: optimization, multi-client analysis, Integrity Gate alerts.
 */
export default function CgoDashboard(): React.ReactElement {
  const { user, isCgo } = useAuth();
  const [clients, setClients] = useState<ManagedClient[]>([]);
  const [alerts, setAlerts] = useState<IntegrityAlert[]>([]);
  const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null);

  useEffect(() => {
    if (!isCgo || !user) return;

    // Fetch managed clients from /api/v1/nexus/clients
    // Fetch alerts from /api/v1/nexus/alerts
    // These API calls include x-tenant-id, x-tenant-type=CGO headers
  }, [isCgo, user]);

  const handleSelectClient = (tenantId: string): void => {
    // Navigate to client detail view or filter dashboard
    console.log('Selected client:', tenantId);
  };

  const handleOptimization = async (
    payload: Record<string, unknown>,
  ): Promise<CognitiveResult> => {
    // POST /api/v1/nexus/optimize
    // Backend routes to KYRA with tenantType=CGO context
    return {} as CognitiveResult; // Placeholder
  };

  const handleAnalysis = async (
    payload: Record<string, unknown>,
  ): Promise<CognitiveResult> => {
    // POST /api/v1/nexus/analyze
    return {} as CognitiveResult; // Placeholder
  };

  if (!isCgo) {
    return <div>Access denied. CGO role required.</div>;
  }

  return (
    <div className="cgo-dashboard">
      <header>
        <h1>Nexus CGO Platform</h1>
        {metrics && (
          <div className="metrics-bar">
            <span>{metrics.activeClients} active clients</span>
            <span>{metrics.totalUsers} total users</span>
            <span>{metrics.totalCognitiveTasks} cognitive tasks</span>
          </div>
        )}
      </header>

      <div className="dashboard-grid">
        <section className="clients-section">
          <ClientOverviewTable clients={clients} onSelectClient={handleSelectClient} />
        </section>

        <section className="intelligence-section">
          <MultiClientAnalysis
            onRequestOptimization={handleOptimization}
            onRequestAnalysis={handleAnalysis}
          />
        </section>

        <section className="alerts-section">
          <IntegrityGatePanel alerts={alerts} />
        </section>
      </div>
    </div>
  );
}

// Local type aliases matching backend response
interface ManagedClient {
  tenantId: string;
  name: string;
  slug: string;
  userCount: number;
  taskCount: number;
  isActive: boolean;
}

interface IntegrityAlert {
  clientTenantId: string;
  clientName: string;
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  detectedAt: string;
}

interface AggregatedMetrics {
  totalUsers: number;
  totalCognitiveTasks: number;
  activeClients: number;
}
