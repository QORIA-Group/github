import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchInsights } from '../../store/slices/kyra-slice';

/**
 * Nexus CGO Component: Strategic Analysis Panel
 * Displays sanitized insights from the cognitive engine.
 * Note: Never exposes "KYRA" name or internal reasoning chains.
 */
export function KyraAnalysisPanel() {
  const dispatch = useAppDispatch();
  const { insights, loading } = useAppSelector((state) => state.kyra);

  useEffect(() => {
    dispatch(fetchInsights());
  }, [dispatch]);

  const criticalInsights = insights.filter((i) => i.severity === 'critical');
  const warningInsights = insights.filter((i) => i.severity === 'warning');

  if (loading) {
    return <div>Analyse en cours...</div>;
  }

  return (
    <div data-testid="analysis-panel">
      <h2>Analyses Stratégiques</h2>

      {criticalInsights.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ color: '#c00' }}>Alertes Critiques ({criticalInsights.length})</h3>
          {criticalInsights.map((insight) => (
            <div
              key={insight.id}
              style={{ padding: 12, marginBottom: 8, backgroundColor: '#fee', borderRadius: 8 }}
            >
              <strong>{insight.title}</strong>
              <p style={{ margin: '4px 0 0', fontSize: 13 }}>{insight.description}</p>
            </div>
          ))}
        </div>
      )}

      {warningInsights.length > 0 && (
        <div>
          <h3 style={{ color: '#a80' }}>Avertissements ({warningInsights.length})</h3>
          {warningInsights.map((insight) => (
            <div
              key={insight.id}
              style={{ padding: 12, marginBottom: 8, backgroundColor: '#ffe', borderRadius: 8 }}
            >
              <strong>{insight.title}</strong>
              <p style={{ margin: '4px 0 0', fontSize: 13 }}>{insight.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
