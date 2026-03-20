import { SetMetadata } from '@nestjs/common';
import { Role } from '../../../../shared/types/tenant';

export const ROLES_KEY = 'roles';

/**
 * Decorator to restrict endpoint access to specific roles.
 * Used with RolesGuard for RBAC enforcement.
 *
 * @example
 * @Roles(Role.CGO_ADMIN, Role.CGO_ANALYST)
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * async getCgoData() { ... }
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
