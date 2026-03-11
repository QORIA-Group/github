import { TriBrainLevel } from '../enums/tri-brain-level.enum';

export interface CognitiveTask {
  taskId: string;
  tenantId: string;
  type: string;
  payload: Record<string, unknown>;
  context: CognitiveContext;
  createdAt: Date;
}

export interface CognitiveContext {
  correlationId: string;
  userId: string;
  source: string;
}

export interface CognitiveResult {
  taskId: string;
  level: TriBrainLevel;
  result: Record<string, unknown>;
  causalEvidence: CausalEvidence[];
  processingTimeMs: number;
  cached: boolean;
}

export interface CausalEvidence {
  sourceNodeId: string;
  relationship: string;
  targetNodeId: string;
  confidence: number;
  graphPath: string[];
}
