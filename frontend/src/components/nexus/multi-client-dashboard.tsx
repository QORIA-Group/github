import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchInsights } from '../../store/slices/kyra-slice';

/**
 * Nexus CGO Component: Multi-Client Dashboard
 * Displays all Ascendia clients with their KPIs and optimization scores.
 * Data returned by the API is already filtered by the CGO tenant context.
 */
export function MultiClientDashboard() {
  const dispatch = useAppDispatch();
  const { insights, loading } = useAppSelector((state) => state.kyra);

  useEffect(() => {
    dispatch(fetchInsights());
  }, [dispatch]);

  if (loading) {
    return <div data-testid="loading">Chargement des données clients...</div>;
  }

  return (
    <div data-testid="multi-client-dashboard">
      <h2>Clients Ascendia</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '2px solid #eee' }}>Domaine</th>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '2px solid #eee' }}>Insight</th>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '2px solid #eee' }}>Sévérité</th>
          </tr>
        </thead>
        <tbody>
          {insights.map((insight) => (
            <tr key={insight.id}>
              <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{insight.domain}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>
                <strong>{insight.title}</strong>
                <br />
                <span style={{ fontSize: 12, color: '#666' }}>{insight.description}</span>
              </td>
              <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    backgroundColor:
                      insight.severity === 'critical'
                        ? '#fee'
                        : insight.severity === 'warning'
                          ? '#ffe'
                          : '#efe',
                    color:
                      insight.severity === 'critical'
                        ? '#c00'
                        : insight.severity === 'warning'
                          ? '#a80'
                          : '#080',
                  }}
                >
                  {insight.severity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
