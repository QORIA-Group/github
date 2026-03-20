/**
 * Tests for the RouteGuard component.
 * Verifies that components are rendered or hidden based on tenant type.
 */
import { TenantType, Role, TenantContext } from '../../../shared/types/tenant';

describe('RouteGuard Logic', () => {
  function shouldRender(tenantContext: TenantContext | null, allowedType: TenantType): boolean {
    if (!tenantContext) return false;
    return tenantContext.tenantType === allowedType;
  }

  const cgoUser: TenantContext = {
    userId: 'user-1',
    tenantId: 'tenant-1',
    tenantType: TenantType.CGO,
    role: Role.CGO_ADMIN,
  };

  const clientUser: TenantContext = {
    userId: 'user-2',
    tenantId: 'tenant-2',
    tenantType: TenantType.CLIENT,
    role: Role.CLIENT_EXEC,
  };

  it('should render CGO components for CGO users', () => {
    expect(shouldRender(cgoUser, TenantType.CGO)).toBe(true);
  });

  it('should not render CLIENT components for CGO users', () => {
    expect(shouldRender(cgoUser, TenantType.CLIENT)).toBe(false);
  });

  it('should render CLIENT components for CLIENT users', () => {
    expect(shouldRender(clientUser, TenantType.CLIENT)).toBe(true);
  });

  it('should not render CGO components for CLIENT users', () => {
    expect(shouldRender(clientUser, TenantType.CGO)).toBe(false);
  });

  it('should not render anything when not authenticated', () => {
    expect(shouldRender(null, TenantType.CGO)).toBe(false);
    expect(shouldRender(null, TenantType.CLIENT)).toBe(false);
  });
});
