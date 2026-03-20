'use client';

import React, { useState } from 'react';
import { CognitiveResult } from '../../types/kyra.types';

interface MultiClientAnalysisProps {
  onRequestOptimization: (payload: Record<string, unknown>) => Promise<CognitiveResult>;
  onRequestAnalysis: (payload: Record<string, unknown>) => Promise<CognitiveResult>;
}

export function MultiClientAnalysis({
  onRequestOptimization,
  onRequestAnalysis,
}: MultiClientAnalysisProps): React.ReactElement {
  const [result, setResult] = useState<CognitiveResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOptimize = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await onRequestOptimization({ type: 'full_portfolio' });
      setResult(res);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await onRequestAnalysis({ type: 'comparative' });
      setResult(res);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="multi-client-analysis">
      <h3>KYRA Multi-Client Intelligence</h3>
      <div className="analysis-actions">
        <button onClick={handleOptimize} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Optimize Portfolio'}
        </button>
        <button onClick={handleAnalyze} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Comparative Analysis'}
        </button>
      </div>
      {result && (
        <div className="analysis-result">
          <p>Brain Level: {result.level}</p>
          <p>Processing Time: {result.processingTimeMs}ms</p>
          <p>Causal Evidence: {result.causalEvidence.length} paths</p>
          <pre>{JSON.stringify(result.result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
