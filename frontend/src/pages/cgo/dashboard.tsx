import React from 'react';
import { TenantType } from '../../../../shared/types/tenant';
import { RouteGuard } from '../../guards/route-guard';
import { MultiClientDashboard } from '../../components/nexus/multi-client-dashboard';
import { KyraAnalysisPanel } from '../../components/nexus/kyra-analysis-panel';
import { ClientSelector } from '../../components/nexus/client-selector';

/**
 * CGO Dashboard – Nexus Platform
 * Multi-client back-office view for CGO administrators.
 * Shows all Ascendia clients, optimization insights, and integrity alerts.
 */
export default function CgoDashboardPage() {
  return (
    <RouteGuard allowedTenantType={TenantType.CGO}>
      <div style={{ padding: 24 }}>
        <header style={{ marginBottom: 24 }}>
          <h1>Nexus CGO – Tableau de bord multi-clients</h1>
          <p style={{ color: '#666' }}>
            Vue consolidée de tous vos clients Ascendia
          </p>
        </header>

        <ClientSelector />

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginTop: 24 }}>
          <MultiClientDashboard />
          <KyraAnalysisPanel />
        </div>
      </div>
    </RouteGuard>
  );
}
