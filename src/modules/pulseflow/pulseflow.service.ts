import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import { StructuredLogger } from '../../common/utils/structured-logger';
import { PulseFlowEventType } from '../../common/enums/pulseflow-event-type.enum';
import { TenantContext } from '../../common/interfaces/tenant-context.interface';

export interface PulseFlowEvent {
  id: string;
  tenantId: string;
  eventType: PulseFlowEventType;
  aggregateId: string;
  aggregateType: string;
  payload: Record<string, unknown>;
  correlationId: string;
  createdAt: Date;
}

@Injectable()
export class PulseFlowService {
  private readonly channel: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly logger: StructuredLogger,
  ) {
    this.channel = this.configService.get<string>(
      'kyra.pulseflowChannel',
      'pulseflow_events',
    );
  }

  /**
   * Emits an event using the Outbox Pattern.
   * The event is written to the EventOutbox table within the same
   * database transaction as the business mutation (ensuring atomicity).
   * A background worker dispatches it via pg_notify.
   */
  async emitEvent(
    tenant: TenantContext,
    eventType: PulseFlowEventType,
    aggregateId: string,
    aggregateType: string,
    payload: Record<string, unknown>,
  ): Promise<PulseFlowEvent> {
    const event = await this.prisma.executeInTenantContext(
      tenant.tenantId,
      async (tx) => {
        const outboxEntry = await tx.eventOutbox.create({
          data: {
            tenantId: tenant.tenantId,
            eventType,
            aggregateId,
            aggregateType,
            payload: payload as Prisma.InputJsonValue,
            correlationId: tenant.correlationId,
          },
        });

        // Write to audit log in the same transaction
        await tx.eventAuditLog.create({
          data: {
            tenantId: tenant.tenantId,
            eventType,
            aggregateId,
            aggregateType,
            payload: payload as Prisma.InputJsonValue,
            correlationId: tenant.correlationId,
            actorType: tenant.roles.includes('ai_agent') ? 'AI_AGENT' : 'HUMAN',
            actorId: tenant.userId,
          },
        });

        return outboxEntry;
      },
    );

    this.logger.logCognitiveDecision('PulseFlowService', `Event emitted: ${eventType}`, {
      event_type: eventType,
      aggregate_id: aggregateId,
      aggregate_type: aggregateType,
      correlation_id: tenant.correlationId,
    });

    return {
      id: event.id,
      tenantId: event.tenantId,
      eventType: event.eventType as PulseFlowEventType,
      aggregateId: event.aggregateId,
      aggregateType: event.aggregateType,
      payload: event.payload as Record<string, unknown>,
      correlationId: event.correlationId,
      createdAt: event.createdAt,
    };
  }

  /**
   * Outbox dispatcher: picks up unpublished events and dispatches them
   * via pg_notify. Called by a scheduled worker / interval.
   */
  async dispatchPendingEvents(): Promise<number> {
    const pendingEvents = await this.prisma.eventOutbox.findMany({
      where: { publishedAt: null },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });

    let dispatched = 0;

    for (const event of pendingEvents) {
      try {
        const notification = JSON.stringify({
          id: event.id,
          tenantId: event.tenantId,
          eventType: event.eventType,
          aggregateId: event.aggregateId,
          payload: event.payload,
          correlationId: event.correlationId,
        });

        await this.prisma.$executeRawUnsafe(
          `SELECT pg_notify('${this.channel}', $1)`,
          notification,
        );

        await this.prisma.eventOutbox.update({
          where: { id: event.id },
          data: { publishedAt: new Date() },
        });

        dispatched++;
      } catch (error) {
        this.logger.error(
          `Failed to dispatch event ${event.id}: ${error instanceof Error ? error.message : 'Unknown'}`,
          undefined,
          'PulseFlowService',
        );
      }
    }

    if (dispatched > 0) {
      this.logger.log(
        `Dispatched ${dispatched} PulseFlow events`,
        'PulseFlowService',
      );
    }

    return dispatched;
  }
}
