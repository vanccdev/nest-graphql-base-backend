import { DynamicModule, INestApplication, Module } from '@nestjs/common'

import { LoggerOptions } from '../types'
import { expressMiddleware } from 'cls-rtracer'
import { LoggerService } from './LoggerService'

@Module({})
export class LoggerModule {
  static forRoot(options: LoggerOptions = {}): DynamicModule {
    LoggerService.initialize(options)

    const loggerParams = LoggerService.getLoggerParams()
    if (!loggerParams) throw new Error('LoggerService no ha sido inicializado')

    return {
      module: LoggerModule,
      providers: [LoggerService],
      exports: [LoggerService],
      imports: [],
    }
  }

  static initialize(app: INestApplication) {
    app.use(expressMiddleware())
  }
}
