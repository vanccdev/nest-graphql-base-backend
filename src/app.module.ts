import { join } from 'path'
import { AppController } from './app.controller'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Request } from 'express'
import { UsersModule } from './core/users/users.module'
import packageJson from '../package.json'
import { MiddlewareConsumer, Module } from '@nestjs/common'

import { CoreModule } from './core/core.module'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'

import dotenv from 'dotenv'
import { LoggerModule } from './core/logger'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { TimeoutInterceptor } from './common/interceptors'
import { LoggerMiddleware } from './common/middlewares'
dotenv.config()

@Module({
  imports: [
    LoggerModule.forRoot({
      console: process.env.LOG_CONSOLE,
      appName: packageJson.name,
      level: process.env.LOG_LEVEL,
      fileParams: process.env.LOG_PATH
        ? {
            path: process.env.LOG_PATH,
            size: process.env.LOG_SIZE,
            rotateInterval: process.env.LOG_INTERVAL,
          }
        : undefined,
      lokiParams: process.env.LOG_LOKI_URL
        ? {
            url: process.env.LOG_LOKI_URL,
            username: process.env.LOG_LOKI_USERNAME,
            password: process.env.LOG_LOKI_PASSWORD,
            batching: process.env.LOG_LOKI_BATCHING,
            batchInterval: process.env.LOG_LOKI_BATCH_INTERVAL,
          }
        : undefined,
      auditParams: {
        context: process.env.LOG_AUDIT,
      },
    }),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      // 📌 1. Aquí Nest busca tus archivos .graphql
      typePaths: ['./**/*.graphql'],

      // 📌 2. Genera automáticamente las clases TS desde el schema
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
        emitTypenameField: true, // ✅ Agrega esto
      },
      // 📌 3. Opcional pero recomendado
      debug: true, // errores detallados en dev

      // 📌 4. Contexto (luego servirá para auth, user, etc)
      context: ({ req }: { req: Request }) => ({ req }),

      graphiql: true,
    }),
    CoreModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
// export class AppModule {}
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
