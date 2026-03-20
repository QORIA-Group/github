import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../../src/auth/guards/roles.guard';
import { Role, TenantType } from '../../../shared/types/tenant';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  function createMockContext(user: unknown, requiredRoles?: Role[]): ExecutionContext {
    const mockRequest = { user };
    const mockHandler = jest.fn();
    const mockClass = jest.fn();

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles ?? null);

    return {
      getHandler: () => mockHandler,
      getClass: () => mockClass,
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => ({}),
        getNext: () => jest.fn(),
      }),
    } as unknown as ExecutionContext;
  }

  it('should allow access when no roles are required', () => {
    const ctx = createMockContext({ role: Role.CLIENT_USER }, undefined);
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should allow CGO_ADMIN to access CGO-restricted endpoints', () => {
    const user = {
      userId: 'user-1',
      tenantId: 'tenant-1',
      tenantType: TenantType.CGO,
      role: Role.CGO_ADMIN,
    };
    const ctx = createMockContext(user, [Role.CGO_ADMIN, Role.CGO_ANALYST]);
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should deny CLIENT_EXEC from CGO-restricted endpoints', () => {
    const user = {
      userId: 'user-2',
      tenantId: 'tenant-2',
      tenantType: TenantType.CLIENT,
      role: Role.CLIENT_EXEC,
    };
    const ctx = createMockContext(user, [Role.CGO_ADMIN, Role.CGO_ANALYST]);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('should allow CLIENT_EXEC to access CLIENT-restricted endpoints', () => {
    const user = {
      userId: 'user-2',
      tenantId: 'tenant-2',
      tenantType: TenantType.CLIENT,
      role: Role.CLIENT_EXEC,
    };
    const ctx = createMockContext(user, [Role.CLIENT_EXEC, Role.CLIENT_USER]);
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should deny CGO_ADMIN from CLIENT-restricted endpoints', () => {
    const user = {
      userId: 'user-1',
      tenantId: 'tenant-1',
      tenantType: TenantType.CGO,
      role: Role.CGO_ADMIN,
    };
    const ctx = createMockContext(user, [Role.CLIENT_EXEC, Role.CLIENT_USER]);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('should throw when no user is present on request', () => {
    const ctx = createMockContext(null, [Role.CGO_ADMIN]);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
