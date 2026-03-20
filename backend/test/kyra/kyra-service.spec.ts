import { TenantService } from '../../src/tenant/tenant.service';
import { TenantType, Role } from '../../../shared/types/tenant';

describe('TenantService', () => {
  let service: TenantService;

  beforeEach(() => {
    service = new TenantService();
  });

  it('should resolve CGO tenant context from JWT payload', () => {
    const ctx = service.resolveTenantContext({
      sub: 'user-1',
      tenantId: 'tenant-1',
      tenantType: 'CGO',
      role: 'CGO_ADMIN',
    });

    expect(ctx.tenantType).toBe(TenantType.CGO);
    expect(ctx.role).toBe(Role.CGO_ADMIN);
    expect(ctx.userId).toBe('user-1');
  });

  it('should resolve CLIENT tenant context from JWT payload', () => {
    const ctx = service.resolveTenantContext({
      sub: 'user-2',
      tenantId: 'tenant-2',
      tenantType: 'CLIENT',
      role: 'CLIENT_EXEC',
    });

    expect(ctx.tenantType).toBe(TenantType.CLIENT);
    expect(ctx.role).toBe(Role.CLIENT_EXEC);
  });

  it('should correctly identify CGO context', () => {
    const ctx = service.resolveTenantContext({
      sub: 'user-1',
      tenantId: 'tenant-1',
      tenantType: 'CGO',
      role: 'CGO_ADMIN',
    });

    expect(service.isCgo(ctx)).toBe(true);
    expect(service.isClient(ctx)).toBe(false);
  });

  it('should correctly identify CLIENT context', () => {
    const ctx = service.resolveTenantContext({
      sub: 'user-2',
      tenantId: 'tenant-2',
      tenantType: 'CLIENT',
      role: 'CLIENT_EXEC',
    });

    expect(service.isCgo(ctx)).toBe(false);
    expect(service.isClient(ctx)).toBe(true);
  });
});
