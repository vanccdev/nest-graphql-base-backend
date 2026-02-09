import { Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway'

@Module({
  providers: [EventsGateway], // ⚠️ Importante: registrarlo como provider
})
export class EventsModule {}
