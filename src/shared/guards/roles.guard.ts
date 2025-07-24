import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@shared/decorators/roles.decorator';
import { JwtPayload } from '@features/auth/types/jwt-payload.interface';
import { ROLES } from '@shared/constants/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * Determines whether the current request is authorized based on user roles.
   * - Retrieves required roles from the metadata set by the @Roles decorator.
   * - Automatically allows access if user has SUPERADMIN role.
   * - Otherwise, compares the user's role against the allowed roles.
   *
   * @param context - The execution context for the request.
   * @returns True if access is granted; otherwise throws ForbiddenException.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (user.role === ROLES.SUPERADMIN) {
      return true;
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied: insufficient role');
    }

    return true;
  }
}
