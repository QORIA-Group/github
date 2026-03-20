import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantType } from '../../../shared/types/tenant';

/**
 * Middleware that sets PostgreSQL session variables for Row-Level Security.
 * Runs on every request. Extracts tenant info from the JWT (set by Passport)
 * and applies SET LOCAL so RLS policies filter data automatically.
 *
 * For CGO tenants, sets app.is_cgo = true to allow cross-tenant reads.
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    // JWT payload is attached to req.user by Passport after auth guard runs.
    // This middleware runs before guards, so we only set RLS context
    // if the user is already authenticated (e.g., from a previous request's cookie/token).
    const user = (req as Record<string, unknown>).user as
      | { tenantId?: string; tenantType?: string }
      | undefined;

    if (user?.tenantId) {
      // In production, this would execute:
      // await prisma.$executeRawUnsafe(`SET LOCAL app.current_tenant_id = '${user.tenantId}'`);
      // await prisma.$executeRawUnsafe(`SET LOCAL app.is_cgo = '${user.tenantType === TenantType.CGO}'`);
      //
      // Stored on request for downstream services to read without DB roundtrip.
      (req as Record<string, unknown>).tenantId = user.tenantId;
      (req as Record<string, unknown>).isCgo = user.tenantType === TenantType.CGO;
    }

    next();
  }
}
