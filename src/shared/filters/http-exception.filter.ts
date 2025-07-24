import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtPayload } from '@features/auth/types/jwt-payload.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /**
   * Handles all unhandled exceptions and formats the response.
   * Converts any thrown error into a structured API error response.
   *
   * @param exception - The caught exception (can be an HttpException or any error).
   * @param host - The arguments host to extract the HTTP context.
   */
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
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

    const errors =
      typeof response === 'object' && 'errors' in response
        ? response.errors
        : typeof message === 'object'
          ? message
          : { general: [message] };

    const user = req.user as JwtPayload;

    this.logger.error({
      path: req.url,
      method: req.method,
      status,
      user: user?.sub ?? null,
      message: exception.message ?? message,
      stack: exception.stack,
    });

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
