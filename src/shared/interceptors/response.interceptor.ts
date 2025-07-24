import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

/**
 * Intercepts all successful HTTP responses and wraps them
 * in a standardized response format.
 *
 * Format:
 * {
 *   code: 200,
 *   message: 'Success',
 *   data: ...,
 *   metadata: {
 *     timestamp: ISODate
 *   }
 * }
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  /**
   * Applies transformation to successful responses.
   * @param _ - The execution context (unused).
   * @param next - The call handler for the request.
   * @returns Observable of the wrapped response.
   */
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        code: 200,
        message: 'Success',
        data,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      })),
    );
  }
}
