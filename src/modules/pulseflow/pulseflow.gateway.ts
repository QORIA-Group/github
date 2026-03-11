import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { StructuredLogger } from '../../common/utils/structured-logger';

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

    if (tenantId) {
      void client.join(`tenant:${tenantId}`);
      this.logger.log(
        `Client ${client.id} connected to tenant room: ${tenantId}`,
        'PulseFlowGateway',
      );
    } else {
      this.logger.warn(
        `Client ${client.id} connected without tenantId - disconnecting`,
        'PulseFlowGateway',
      );
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(
      `Client ${client.id} disconnected`,
      'PulseFlowGateway',
    );
  }

  /**
   * Broadcast a PulseFlow event to all clients in a tenant room.
   * Called by the outbox dispatcher after pg_notify emission.
   */
  emitToTenant(tenantId: string, eventType: string, payload: Record<string, unknown>): void {
    this.server.to(`tenant:${tenantId}`).emit(eventType, payload);
  }
}
