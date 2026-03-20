import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { TenantMiddleware } from './tenant.middleware';
import { PrismaService } from '../../database/prisma/prisma.service';
import { TenantType } from '../../common/enums/tenant-type.enum';

describe('TenantMiddleware', () => {
  let middleware: TenantMiddleware;

  const mockPrisma = {
    resolveManagedClientIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantMiddleware,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    middleware = module.get<TenantMiddleware>(TenantMiddleware);
  });

  afterEach(() => jest.clearAllMocks());

  const createMockReq = (headers: Record<string, string> = {}): Record<string, unknown> => ({
    headers: {
      authorization: 'Bearer token',
      ...headers,
    },
  });

  const mockRes = {
    setHeader: jest.fn(),
  };

  const mockNext = jest.fn();

  it('should allow unauthenticated requests through (health, docs)', async () => {
    const req = { headers: {} };

    await middleware.use(req as never, mockRes as never, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect((req as Record<string, unknown>).tenant).toBeUndefined();
  });

  it('should detect CLIENT tenant type and set context', async () => {
    const req = createMockReq({
      'x-tenant-id': 'client-tenant-001',
      'x-user-id': 'user-001',
      'x-user-roles': 'client,analyst',
      'x-tenant-type': 'CLIENT',
    });

    await middleware.use(req as never, mockRes as never, mockNext);

    const tenant = (req as Record<string, unknown>).tenant as Record<string, unknown>;
    expect(tenant.tenantType).toBe(TenantType.CLIENT);
    expect(tenant.managedTenantIds).toBeUndefined();
    expect(mockPrisma.resolveManagedClientIds).not.toHaveBeenCalled();
  });

  it('should detect CGO tenant type and resolve managed client IDs', async () => {
    mockPrisma.resolveManagedClientIds.mockResolvedValue([
      'client-001',
      'client-002',
    ]);

    const req = createMockReq({
      'x-tenant-id': 'cgo-tenant-001',
      'x-user-id': 'cgo-user-001',
      'x-user-roles': 'cgo',
      'x-tenant-type': 'CGO',
    });

    await middleware.use(req as never, mockRes as never, mockNext);

    const tenant = (req as Record<string, unknown>).tenant as Record<string, unknown>;
    expect(tenant.tenantType).toBe(TenantType.CGO);
    expect(tenant.managedTenantIds).toEqual(['client-001', 'client-002']);
    expect(mockPrisma.resolveManagedClientIds).toHaveBeenCalledWith('cgo-tenant-001');
  });

  it('should default to CLIENT when x-tenant-type header is missing', async () => {
    const req = createMockReq({
      'x-tenant-id': 'tenant-001',
      'x-user-id': 'user-001',
      'x-user-roles': 'analyst',
    });

    await middleware.use(req as never, mockRes as never, mockNext);

    const tenant = (req as Record<string, unknown>).tenant as Record<string, unknown>;
    expect(tenant.tenantType).toBe(TenantType.CLIENT);
  });

  it('should throw UnauthorizedException when tenant_id is missing', async () => {
    const req = createMockReq({
      'x-user-id': 'user-001',
    });

    await expect(
      middleware.use(req as never, mockRes as never, mockNext),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should set correlation-id response header', async () => {
    const req = createMockReq({
      'x-tenant-id': 'tenant-001',
      'x-user-id': 'user-001',
      'x-user-roles': 'client',
      'x-correlation-id': 'my-corr-id',
    });

    await middleware.use(req as never, mockRes as never, mockNext);

    expect(mockRes.setHeader).toHaveBeenCalledWith('x-correlation-id', 'my-corr-id');
  });
});
