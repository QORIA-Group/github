export interface PulseEvent {
  id: string;
  tenantId: string;
  eventType: string;
  payload: Record<string, unknown>;
  status: 'pending' | 'dispatched' | 'processed' | 'failed';
  createdAt: string;
  processedAt?: string;
}

export interface PulseFlowStatus {
  activeEvents: number;
  pendingEvents: number;
  failedEvents: number;
  lastProcessedAt?: string;
}
