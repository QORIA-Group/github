import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, TenantContext } from '../../../../shared/types/tenant';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * RBAC guard that checks if the authenticated user's role
 * matches the required roles defined by @Roles() decorator.
 *
 * This is the core of provider/consumer routing at the API level:
 * - CGO roles can access /cgo/* endpoints
 * - CLIENT roles can access /client/* endpoints
 * - Shared endpoints use tenantContext.tenantType for behavior branching
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No @Roles() decorator means endpoint is open to all authenticated users
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: TenantContext = request.user;

    if (!user) {
      throw new ForbiddenException('No authentication context found');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Role ${user.role} is not authorized. Required: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
