import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Intercepts HTTP requests and adds audit fields (`createdBy`, `updatedBy`, `deletedBy`, etc.)
 * based on HTTP method and the authenticated user.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user || !user.sub) return next.handle();

    const userId = user.sub;
    const now = new Date();

    if (!req.body) {
      req.body = {};
    }

    switch (req.method) {
      case 'POST':
        req.body.createdBy = userId;
        req.body.createdAt = now;
        break;
      case 'PATCH':
      case 'PUT':
        req.body.updatedBy = userId;
        req.body.updatedAt = now;
        break;
      case 'DELETE':
        req.body.deletedBy = userId;
        req.body.deletedAt = now;
        break;
    }

    return next.handle();
  }
}
