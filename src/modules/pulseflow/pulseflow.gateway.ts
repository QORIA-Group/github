import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { StructuredLogger } from '../../common/utils/structured-logger';
import { TenantType } from '../../common/enums/tenant-type.enum';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/pulseflow',
})
export class PulseFlowGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly logger: StructuredLogger) {}

  handleConnection(client: Socket): void {
    const tenantId = client.handshake.query['tenantId'] as string;
    const tenantType = client.handshake.query['tenantType'] as string;

    if (!tenantId) {
      this.logger.warn(
        `Client ${client.id} connected without tenantId - disconnecting`,
        'PulseFlowGateway',
      );
      client.disconnect(true);
      return;
    }

    // Join own tenant room
    void client.join(`tenant:${tenantId}`);

    // CGO clients also join a CGO-specific room for cross-tenant events
    if (tenantType === TenantType.CGO) {
      void client.join(`cgo:${tenantId}`);
      // Join rooms for each managed client (sent as comma-separated query param)
      const managedIds = client.handshake.query['managedTenantIds'] as string;
      if (managedIds) {
        for (const clientTenantId of managedIds.split(',')) {
          if (clientTenantId.trim()) {
            void client.join(`tenant:${clientTenantId.trim()}`);
          }
        }
      }
    }

    this.logger.log(
      `Client ${client.id} connected: tenant=${tenantId} type=${tenantType ?? 'CLIENT'}`,
      'PulseFlowGateway',
    );
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(
      `Client ${client.id} disconnected`,
      'PulseFlowGateway',
    );
  }

  /**
   * Broadcast a PulseFlow event to all clients in a tenant room.
   */
  emitToTenant(tenantId: string, eventType: string, payload: Record<string, unknown>): void {
    this.server.to(`tenant:${tenantId}`).emit(eventType, payload);
  }

  /**
   * Broadcast to CGO-specific room (e.g., integrity gate alerts, optimization results).
   */
  emitToCgo(cgoTenantId: string, eventType: string, payload: Record<string, unknown>): void {
    this.server.to(`cgo:${cgoTenantId}`).emit(eventType, payload);
  }
}
