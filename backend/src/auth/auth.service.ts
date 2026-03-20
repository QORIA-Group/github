import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TenantType, Role, TenantContext } from '../../../shared/types/tenant';

interface LoginPayload {
  email: string;
  password: string;
}

interface JwtPayload {
  sub: string;
  tenantId: string;
  tenantType: TenantType;
  role: Role;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Authenticates a user and returns a JWT containing tenant context.
   * In production, this would validate against the database with hashed passwords.
   */
  async login(payload: LoginPayload): Promise<{ accessToken: string; tenantContext: TenantContext }> {
    // Placeholder: in production, query User + Tenant from DB
    const user = await this.validateUser(payload.email, payload.password);

    const jwtPayload: JwtPayload = {
      sub: user.userId,
      tenantId: user.tenantId,
      tenantType: user.tenantType,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(jwtPayload);

    return {
      accessToken,
      tenantContext: {
        userId: user.userId,
        tenantId: user.tenantId,
        tenantType: user.tenantType,
        role: user.role,
      },
    };
  }

  private async validateUser(
    email: string,
    _password: string,
  ): Promise<{ userId: string; tenantId: string; tenantType: TenantType; role: Role }> {
    // Placeholder user resolution - in production, uses Prisma + bcrypt
    if (!email) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Demo users for development
    if (email === 'cgo@nexus.qoria.eu') {
      return {
        userId: '00000000-0000-0000-0000-000000000001',
        tenantId: '10000000-0000-0000-0000-000000000001',
        tenantType: TenantType.CGO,
        role: Role.CGO_ADMIN,
      };
    }

    if (email === 'client@ascendia.qoria.eu') {
      return {
        userId: '00000000-0000-0000-0000-000000000002',
        tenantId: '20000000-0000-0000-0000-000000000001',
        tenantType: TenantType.CLIENT,
        role: Role.CLIENT_EXEC,
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
