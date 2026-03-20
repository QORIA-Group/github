export interface SanitizedInsight {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  domain: string;
  createdAt: string;
}

export interface CognitiveTaskRequest {
  taskType: string;
  parameters: Record<string, unknown>;
}

export interface CognitiveTaskResponse {
  taskId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: SanitizedInsight;
}

/** CGO-specific: multi-client optimization recommendation */
export interface OptimizationRecommendation {
  clientId: string;
  clientName: string;
  insights: SanitizedInsight[];
  score: number;
}

/** CLIENT-specific: automation task status */
export interface AutomationTask {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'error';
  lastRun: string;
  nextRun?: string;
  category: 'payroll' | 'reporting' | 'compliance' | 'monitoring';
}
