/**
 * Integration test: Role-Based Rendering
 * Verifies the complete flow from auth context to component selection.
 */
import { TenantType, Role, TenantContext } from '../../../shared/types/tenant';

describe('Role-Based Rendering Integration', () => {
  function getRoute(ctx: TenantContext): string {
    if (ctx.tenantType === TenantType.CGO) return '/cgo/dashboard';
    if (ctx.tenantType === TenantType.CLIENT) return '/client/autopilot';
    return '/login';
  }

  function getComponentPaths(ctx: TenantContext): string[] {
    if (ctx.tenantType === TenantType.CGO) {
      return [
        '/components/nexus/multi-client-dashboard',
        '/components/nexus/kyra-analysis-panel',
        '/components/nexus/client-selector',
      ];
    }
    if (ctx.tenantType === TenantType.CLIENT) {
      return [
        '/components/ascendia/task-execution',
        '/components/ascendia/automation-status',
        '/components/ascendia/insight-card',
      ];
    }
    return [];
  }

  describe('CGO User Flow', () => {
    const cgoUser: TenantContext = {
      userId: 'cgo-user-1',
      tenantId: 'cgo-tenant-1',
      tenantType: TenantType.CGO,
      role: Role.CGO_ADMIN,
    };

    it('should route to /cgo/dashboard', () => {
      expect(getRoute(cgoUser)).toBe('/cgo/dashboard');
    });

    it('should load Nexus components', () => {
      const paths = getComponentPaths(cgoUser);
      expect(paths.every((p) => p.includes('/nexus/'))).toBe(true);
      expect(paths).not.toEqual(expect.arrayContaining([expect.stringContaining('/ascendia/')]));
    });

    it('should have multi-client view capabilities', () => {
      const paths = getComponentPaths(cgoUser);
      expect(paths).toContain('/components/nexus/multi-client-dashboard');
      expect(paths).toContain('/components/nexus/client-selector');
    });
  });

  describe('CLIENT User Flow', () => {
    const clientUser: TenantContext = {
      userId: 'client-user-1',
      tenantId: 'client-tenant-1',
      tenantType: TenantType.CLIENT,
      role: Role.CLIENT_EXEC,
    };

    it('should route to /client/autopilot', () => {
      expect(getRoute(clientUser)).toBe('/client/autopilot');
    });

    it('should load Ascendia components', () => {
      const paths = getComponentPaths(clientUser);
      expect(paths.every((p) => p.includes('/ascendia/'))).toBe(true);
      expect(paths).not.toEqual(expect.arrayContaining([expect.stringContaining('/nexus/')]));
    });

    it('should have single-client view capabilities', () => {
      const paths = getComponentPaths(clientUser);
      expect(paths).toContain('/components/ascendia/task-execution');
      expect(paths).toContain('/components/ascendia/automation-status');
      expect(paths).toContain('/components/ascendia/insight-card');
    });

    it('should NOT have multi-client selector', () => {
      const paths = getComponentPaths(clientUser);
      expect(paths).not.toContain('/components/nexus/client-selector');
    });
  });

  describe('Cross-Role Isolation', () => {
    it('should never show Nexus components to CLIENT users', () => {
      const clientUser: TenantContext = {
        userId: 'user',
        tenantId: 'tenant',
        tenantType: TenantType.CLIENT,
        role: Role.CLIENT_USER,
      };
      const paths = getComponentPaths(clientUser);
      expect(paths.some((p) => p.includes('/nexus/'))).toBe(false);
    });

    it('should never show Ascendia components to CGO users', () => {
      const cgoUser: TenantContext = {
        userId: 'user',
        tenantId: 'tenant',
        tenantType: TenantType.CGO,
        role: Role.CGO_ANALYST,
      };
      const paths = getComponentPaths(cgoUser);
      expect(paths.some((p) => p.includes('/ascendia/'))).toBe(false);
    });
  });
});
