import { Injectable } from '@nestjs/common';
import { TenantContext, TenantType } from '../../../shared/types/tenant';
import { PulseEvent, PulseFlowStatus } from '../../../shared/types/pulseflow';

/**
 * PulseFlow Protocol service.
 * Implements the Outbox pattern for async event-driven communication.
 * Events are written to the EventOutbox table in the same transaction
 * as business mutations, then dispatched via pg_notify.
 */
@Injectable()
export class PulseFlowService {
  /**
   * Emit a PulseFlow event into the outbox.
   * In production, this writes to the event_outbox table within the current transaction.
   */
  async emit(ctx: TenantContext, eventType: string, payload: Record<string, unknown>): Promise<PulseEvent> {
    const event: PulseEvent = {
      id: `evt-${Date.now()}`,
      tenantId: ctx.tenantId,
      eventType,
      payload,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    // In production: INSERT INTO event_outbox within current DB transaction
    return event;
  }

  /**
   * Get PulseFlow status for the current tenant context.
   * CGO sees aggregated status across all clients; CLIENT sees own only.
   */
  async getStatus(ctx: TenantContext): Promise<PulseFlowStatus> {
    if (ctx.tenantType === TenantType.CGO) {
      return {
        activeEvents: 47,
        pendingEvents: 12,
        failedEvents: 2,
        lastProcessedAt: new Date().toISOString(),
      };
    }
    return {
      activeEvents: 8,
      pendingEvents: 3,
      failedEvents: 0,
      lastProcessedAt: new Date().toISOString(),
    };
  }

  /**
   * Get recent events for the tenant.
   * RLS at DB level ensures proper filtering.
   */
  async getRecentEvents(ctx: TenantContext): Promise<PulseEvent[]> {
    const baseEvents: PulseEvent[] = [
      {
        id: 'evt-001',
        tenantId: ctx.tenantId,
        eventType: 'payroll.processed',
        payload: { month: '2026-03', employeeCount: 145 },
        status: 'processed',
        createdAt: new Date().toISOString(),
        processedAt: new Date().toISOString(),
      },
      {
        id: 'evt-002',
        tenantId: ctx.tenantId,
        eventType: 'compliance.report.generated',
        payload: { reportType: 'CSRD-Q1' },
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ];
    return baseEvents;
  }
}
