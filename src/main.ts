import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import dotenv from 'dotenv'
import { ValidationPipe } from '@nestjs/common'

import express from 'express'
import session from 'express-session'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'

import { DataSource } from 'typeorm'
import { Session } from './core/authentication/entity/session.entity'
import { ConfigService } from '@nestjs/config'
import { TypeormStore } from 'connect-typeorm'
import { printInfo, printLogo, printRoutes } from './core/logger'

import packageJson from '../package.json'

dotenv.config()

export const SessionAppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
  // synchronize: false,
  synchronize: true,
  entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)

  // swagger
  /* if (configService.get('NODE_ENV') !== 'production') {
    createSwagger(app);
  } */

  await SessionAppDataSource.initialize()

  // configuration app
  const repositorySession = SessionAppDataSource.getRepository(Session)

  app.use(
    session({
      secret: configService.get('SESSION_SECRET') || '',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      name: 'base.connect.sid',
      cookie: {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
      },
      store: new TypeormStore({ ttl: 3600, cleanupLimit: 2 }).connect(
        repositorySession
      ),
    })
  )

  app.use(passport.initialize())
  app.use(passport.session())
  app.use(cookieParser())
  app.use(express.static('public'))

  app.enableCors()

  app.use(helmet())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  )

  const port = configService.get('PORT')
  await app.listen(port)

  printRoutes(app)
  printLogo()
  printInfo({
    env: String(process.env.NODE_ENV),
    name: packageJson.name,
    port: port,
    version: packageJson.version,
  })
}
bootstrap()
