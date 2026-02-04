import { ArgumentsHost, Catch } from '@nestjs/common'
import { GqlArgumentsHost } from '@nestjs/graphql'
import { Request, Response } from 'express'
import { BaseException } from 'src/core/logger'
import { ErrorResponseDto } from '../dto/error-response.dto'
import { BaseExceptionFilter } from '../base'

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  constructor() {
    super()
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const type = host.getType<'http' | 'graphql'>()

    // ================== GRAPHQL ==================
    if (type === 'graphql') {
      const gqlHost = GqlArgumentsHost.create(host)
      const ctx = gqlHost.getContext()
      const request: Request = ctx?.req

      const errorInfo = new BaseException(exception)

      const errorRequest = {
        method: request?.method ?? 'GRAPHQL',
        originalUrl: request?.originalUrl ?? 'graphql',
        headers: request?.headers,
        params: request?.params,
        query: request?.query,
        body: request?.body,
        user: (request as any)?.user,
      }

      const errorResult: ErrorResponseDto = {
        finalizado: false,
        codigo: errorInfo.getHttpStatus(),
        timestamp: Math.floor(Date.now() / 1000),
        mensaje: errorInfo.obtenerMensajeCliente(),
        datos: errorInfo.clientInfo,
      }

      // 🔥 LOGS
      this.logger.error(errorInfo, errorRequest, errorResult)

      if (errorResult.codigo >= 500) {
        this.logger.auditError('graphql-exception', {
          metadata: {
            usuario: errorRequest.user?.id,
            codigo: errorResult.codigo,
            mensaje: errorResult.mensaje,
          },
        })
      } else {
        this.logger.auditWarn('graphql-exception', {
          metadata: {
            usuario: errorRequest.user?.id,
            codigo: errorResult.codigo,
            mensaje: errorResult.mensaje,
          },
        })
      }

      // 🚨 MUY IMPORTANTE EN GRAPHQL
      throw exception
    }

    // ================== REST ==================
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const errorRequest = {
      method: request.method,
      originalUrl: request.originalUrl,
      headers: request.headers,
      params: request.params,
      query: request.query,
      body: request.body,
      user: (request as any).user,
    }

    const errorInfo = new BaseException(exception)

    const errorResult: ErrorResponseDto = {
      finalizado: false,
      codigo: errorInfo.getHttpStatus(),
      timestamp: Math.floor(Date.now() / 1000),
      mensaje: errorInfo.obtenerMensajeCliente(),
      datos: errorInfo.clientInfo,
    }

    this.logger.error(errorInfo, errorRequest, errorResult)

    if (errorResult.codigo >= 500) {
      this.logger.auditError('http-exception', {
        metadata: {
          usuario: errorRequest.user?.id,
          codigo: errorResult.codigo,
          mensaje: errorResult.mensaje,
        },
      })
    } else {
      this.logger.auditWarn('http-exception', {
        metadata: {
          usuario: errorRequest.user?.id,
          codigo: errorResult.codigo,
          mensaje: errorResult.mensaje,
        },
      })
    }

    response.status(errorResult.codigo).json(errorResult)
  }
}
