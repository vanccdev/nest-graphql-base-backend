import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'

@WebSocketGateway({
  cors: {
    origin: '*', // 🔒 En producción, especifica tu dominio
  },
  namespace: '/events', // Opcional: crea un namespace
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server

  private logger: Logger = new Logger('EventsGateway')

  // 🔄 Lifecycle: después de inicializar el servidor
  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway inicializado')
  }

  // 🔌 Cuando un cliente se conecta
  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`)
  }

  // ❌ Cuando un cliente se desconecta
  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`)
  }

  // 📨 Escuchar mensajes del cliente
  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket
  ): string {
    this.logger.log(`Mensaje recibido: ${data}`)
    return data // Responde automáticamente al cliente
  }

  // 📤 Emitir a todos los clientes
  @SubscribeMessage('broadcast')
  handleBroadcast(@MessageBody() data: any): void {
    this.server.emit('message', data) // Envía a TODOS
  }
}
