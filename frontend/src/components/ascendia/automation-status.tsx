import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchPulseFlowStatus } from '../../store/slices/pulseflow-slice';

/**
 * Ascendia CLIENT Component: Automation Status
 * Displays PulseFlow automation pipeline status for the client.
 * Shows active, pending, and failed events.
 */
export function AutomationStatus() {
  const dispatch = useAppDispatch();
  const { status, loading } = useAppSelector((state) => state.pulseflow);

  useEffect(() => {
    dispatch(fetchPulseFlowStatus());
  }, [dispatch]);

  if (loading) {
    return <div data-testid="loading">Chargement du statut...</div>;
  }

  if (!status) {
    return <div>Aucune donnée PulseFlow disponible.</div>;
  }

  return (
    <div data-testid="automation-status">
      <h2>Statut Automatisations</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div
          style={{
            padding: 16,
            backgroundColor: '#e8f5e9',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, color: '#2e7d32' }}>{status.activeEvents}</div>
          <div style={{ fontSize: 12, color: '#666' }}>Actifs</div>
        </div>
        <div
          style={{
            padding: 16,
            backgroundColor: '#fff3e0',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, color: '#e65100' }}>{status.pendingEvents}</div>
          <div style={{ fontSize: 12, color: '#666' }}>En attente</div>
        </div>
        <div
          style={{
            padding: 16,
            backgroundColor: status.failedEvents > 0 ? '#ffebee' : '#f5f5f5',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: status.failedEvents > 0 ? '#c62828' : '#999',
            }}
          >
            {status.failedEvents}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>Échoués</div>
        </div>
      </div>
      {status.lastProcessedAt && (
        <p style={{ fontSize: 11, color: '#999', marginTop: 8 }}>
          Dernier traitement : {new Date(status.lastProcessedAt).toLocaleString('fr-FR')}
        </p>
      )}
    </div>
  );
}
