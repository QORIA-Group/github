'use client';

import React, { useState } from 'react';
import { CognitiveResult } from '../../types/kyra.types';

interface TaskExecutorProps {
  onExecutePayroll: (payload: Record<string, unknown>) => Promise<CognitiveResult>;
  onExecuteEsgReporting: (payload: Record<string, unknown>) => Promise<CognitiveResult>;
}

export function TaskExecutor({
  onExecutePayroll,
  onExecuteEsgReporting,
}: TaskExecutorProps): React.ReactElement {
  const [result, setResult] = useState<CognitiveResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<string | null>(null);

  const execute = async (
    taskName: string,
    handler: (payload: Record<string, unknown>) => Promise<CognitiveResult>,
  ): Promise<void> => {
    setIsLoading(true);
    setActiveTask(taskName);
    try {
      const res = await handler({});
      setResult(res);
    } finally {
      setIsLoading(false);
      setActiveTask(null);
    }
  };

  return (
    <div className="task-executor">
      <h3>Execute Tasks</h3>
      <div className="task-actions">
        <button
          onClick={() => execute('payroll', onExecutePayroll)}
          disabled={isLoading}
        >
          {activeTask === 'payroll' ? 'Executing Payroll...' : 'Execute Payroll'}
        </button>
        <button
          onClick={() => execute('esg', onExecuteEsgReporting)}
          disabled={isLoading}
        >
          {activeTask === 'esg' ? 'Generating ESG Report...' : 'ESG Reporting'}
        </button>
      </div>
      {result && (
        <div className="task-result">
          <p>Task ID: {result.taskId}</p>
          <p>Brain Level: {result.level}</p>
          <p>Processing Time: {result.processingTimeMs}ms</p>
          <p>Cached: {result.cached ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
}
