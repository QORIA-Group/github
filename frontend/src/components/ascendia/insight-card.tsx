import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchInsights } from '../../store/slices/kyra-slice';

/**
 * Ascendia CLIENT Component: Insight Card
 * Displays personalized insights for the single tenant.
 * Data is filtered by RLS to only show the client's own insights.
 */
export function InsightCard() {
  const dispatch = useAppDispatch();
  const { insights, loading } = useAppSelector((state) => state.kyra);

  useEffect(() => {
    dispatch(fetchInsights());
  }, [dispatch]);

  if (loading) {
    return <div>Chargement des insights...</div>;
  }

  return (
    <div data-testid="insight-card">
      <h2>Vos Insights</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {insights.map((insight) => (
          <div
            key={insight.id}
            style={{
              padding: 16,
              backgroundColor: '#f8f9fa',
              borderRadius: 8,
              border: '1px solid #e0e0e0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong>{insight.title}</strong>
              <span
                style={{
                  fontSize: 11,
                  padding: '2px 6px',
                  borderRadius: 4,
                  backgroundColor:
                    insight.severity === 'critical'
                      ? '#fee'
                      : insight.severity === 'warning'
                        ? '#ffe'
                        : '#efe',
                }}
              >
                {insight.severity}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#666' }}>{insight.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
