import { join } from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Request } from 'express';
import { UsersModule } from './core/users/users.module';

import dotenv from 'dotenv';
import { CoreModule } from './core/core.module';
dotenv.config();

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      // 📌 1. Aquí Nest busca tus archivos .graphql
      typePaths: ['./**/*.graphql'],

      // 📌 2. Genera automáticamente las clases TS desde el schema
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
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
  providers: [AppService],
})
export class AppModule {}
