import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchInsights } from '../../store/slices/kyra-slice';

/**
 * Ascendia CLIENT Component: Task Execution Panel
 * Shows the client's active cognitive tasks and their statuses.
 * Only displays data belonging to the authenticated client (enforced by RLS).
 */
export function TaskExecution() {
  const dispatch = useAppDispatch();
  const { insights, loading } = useAppSelector((state) => state.kyra);

  useEffect(() => {
    dispatch(fetchInsights());
  }, [dispatch]);

  if (loading) {
    return <div data-testid="loading">Chargement des tâches...</div>;
  }

  return (
    <div data-testid="task-execution">
      <h2>Tâches en cours</h2>
      {insights.length === 0 ? (
        <p>Aucune tâche active.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {insights.map((insight) => (
            <li
              key={insight.id}
              style={{
                padding: 12,
                marginBottom: 8,
                backgroundColor: '#f8f9fa',
                borderRadius: 8,
                borderLeft: `4px solid ${
                  insight.severity === 'critical' ? '#c00' : insight.severity === 'warning' ? '#f90' : '#0a0'
                }`,
              }}
            >
              <strong>{insight.title}</strong>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#666' }}>{insight.description}</p>
              <span style={{ fontSize: 11, color: '#999' }}>{insight.domain}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
