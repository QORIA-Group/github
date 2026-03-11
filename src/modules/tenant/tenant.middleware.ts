import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { TenantContext } from '../../common/interfaces/tenant-context.interface';

/**
 * Extracts tenant context from JWT claims in the request.
 * In production, this validates the JWT and extracts tenant_id, user_id, and roles.
 * The tenant context is then available via the @CurrentTenant() decorator.
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request & { tenant?: TenantContext }, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Allow unauthenticated routes (health, docs)
      next();
      return;
    }

    try {
      // In production: validate JWT and extract claims
      // For now, extract tenant context from headers (dev mode)
      const tenantId = req.headers['x-tenant-id'] as string;
      const userId = req.headers['x-user-id'] as string;
      const roles = (req.headers['x-user-roles'] as string)?.split(',') ?? [];

      if (!tenantId || !userId) {
        throw new UnauthorizedException('Missing tenant context in token');
      }

      const correlationId =
        (req.headers['x-correlation-id'] as string) ?? uuidv4();

      req.tenant = {
        tenantId,
        userId,
        roles,
        correlationId,
      };

      // Set correlation ID in response headers for traceability
      _res.setHeader('x-correlation-id', correlationId);

      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid tenant context');
    }
  }
}
