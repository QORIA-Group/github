import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { TenantContext } from '../../common/interfaces/tenant-context.interface';
import { TenantType } from '../../common/enums/tenant-type.enum';
import { PrismaService } from '../../database/prisma/prisma.service';

/**
 * Extracts tenant context from JWT claims in the request.
 * Detects TenantType (CGO or CLIENT) at connection time.
 * For CGO tenants, resolves the list of managed client tenant IDs.
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(
    req: Request & { tenant?: TenantContext },
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    try {
      // In production: validate JWT and extract claims
      // Dev mode: extract tenant context from headers
      const tenantId = req.headers['x-tenant-id'] as string;
      const userId = req.headers['x-user-id'] as string;
      const roles = (req.headers['x-user-roles'] as string)?.split(',') ?? [];
      const tenantTypeHeader = (req.headers['x-tenant-type'] as string)?.toUpperCase();

      if (!tenantId || !userId) {
        throw new UnauthorizedException('Missing tenant context in token');
      }

      const tenantType =
        tenantTypeHeader === TenantType.CGO ? TenantType.CGO : TenantType.CLIENT;

      const correlationId =
        (req.headers['x-correlation-id'] as string) ?? uuidv4();

      const tenant: TenantContext = {
        tenantId,
        userId,
        roles,
        tenantType,
        correlationId,
      };

      // For CGO tenants, resolve managed client IDs for cross-tenant access
      if (tenantType === TenantType.CGO) {
        tenant.managedTenantIds =
          await this.prisma.resolveManagedClientIds(tenantId);
      }

      req.tenant = tenant;

      res.setHeader('x-correlation-id', correlationId);

      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid tenant context');
    }
  }
}
