import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const response = exception.getResponse?.();
    const message =
      typeof response === 'string'
        ? response
        : response?.message || 'Unexpected error';

    const errors = typeof response === 'object' && 'errors' in response
      ? response.errors
      : typeof message === 'object'
        ? message
        : { general: [message] };

    res.status(status).json({
      code: status,
      message: message,
      data: null,
      metadata: {
        timestamp: new Date().toISOString(),
      },
      errors,
    });
  }
}
