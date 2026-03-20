import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TenantService } from '../../tenant/tenant.service';
import { TenantContext } from '../../../../shared/types/tenant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly tenantService: TenantService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'qoria-dev-secret',
    });
  }

  /**
   * Called by Passport after JWT is verified.
   * Returns TenantContext which is attached to req.user.
   */
  validate(payload: {
    sub: string;
    tenantId: string;
    tenantType: string;
    role: string;
  }): TenantContext {
    return this.tenantService.resolveTenantContext(payload);
  }
}
