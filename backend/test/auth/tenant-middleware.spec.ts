import { TenantMiddleware } from '../../src/tenant/tenant.middleware';
import { TenantType } from '../../../shared/types/tenant';

describe('TenantMiddleware', () => {
  let middleware: TenantMiddleware;

  beforeEach(() => {
    middleware = new TenantMiddleware();
  });

  it('should set tenantId and isCgo=true for CGO users', () => {
    const req: Record<string, unknown> = {
      user: {
        tenantId: 'cgo-tenant-1',
        tenantType: TenantType.CGO,
      },
    };
    const next = jest.fn();

    middleware.use(req as never, {} as never, next);

    expect(req.tenantId).toBe('cgo-tenant-1');
    expect(req.isCgo).toBe(true);
    expect(next).toHaveBeenCalled();
  });

  it('should set tenantId and isCgo=false for CLIENT users', () => {
    const req: Record<string, unknown> = {
      user: {
        tenantId: 'client-tenant-1',
        tenantType: TenantType.CLIENT,
      },
    };
    const next = jest.fn();

    middleware.use(req as never, {} as never, next);

    expect(req.tenantId).toBe('client-tenant-1');
    expect(req.isCgo).toBe(false);
    expect(next).toHaveBeenCalled();
  });

  it('should not set tenant context when no user is present', () => {
    const req: Record<string, unknown> = {};
    const next = jest.fn();

    middleware.use(req as never, {} as never, next);

    expect(req.tenantId).toBeUndefined();
    expect(req.isCgo).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});
