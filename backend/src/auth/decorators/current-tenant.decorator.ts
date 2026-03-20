import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TenantContext } from '../../../../shared/types/tenant';

/**
 * Parameter decorator that extracts TenantContext from the request.
 * The context is set by the JwtStrategy after token validation.
 *
 * @example
 * async getInsights(@CurrentTenant() ctx: TenantContext) { ... }
 */
export const CurrentTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TenantContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as TenantContext;
  },
);
