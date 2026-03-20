import { Injectable } from '@nestjs/common';
import { TenantContext, TenantType, isCgoRole, Role } from '../../../shared/types/tenant';

@Injectable()
export class TenantService {
  /**
   * Build a TenantContext from a decoded JWT payload.
   * This is the single source of truth for tenant resolution.
   */
  resolveTenantContext(jwtPayload: {
    sub: string;
    tenantId: string;
    tenantType: string;
    role: string;
  }): TenantContext {
    return {
      userId: jwtPayload.sub,
      tenantId: jwtPayload.tenantId,
      tenantType: jwtPayload.tenantType as TenantType,
      role: jwtPayload.role as Role,
    };
  }

  isCgo(ctx: TenantContext): boolean {
    return ctx.tenantType === TenantType.CGO && isCgoRole(ctx.role);
  }

  isClient(ctx: TenantContext): boolean {
    return ctx.tenantType === TenantType.CLIENT;
  }
}
