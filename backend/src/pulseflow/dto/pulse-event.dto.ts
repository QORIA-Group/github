export class PulseEventDto {
  id!: string;
  tenantId!: string;
  eventType!: string;
  payload!: Record<string, unknown>;
  status!: 'pending' | 'dispatched' | 'processed' | 'failed';
  createdAt!: string;
  processedAt?: string;
}
