export interface CognitiveResult {
  taskId: string;
  level: 'REPTILIAN' | 'LIMBIC' | 'NEOCORTEX';
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

export interface PulseFlowEvent {
  id: string;
  tenantId: string;
  eventType: string;
  aggregateId: string;
  payload: Record<string, unknown>;
  correlationId: string;
}
