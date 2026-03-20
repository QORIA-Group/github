export enum TenantType {
  CGO = 'CGO',
  CLIENT = 'CLIENT',
}

export enum Role {
  CGO_ADMIN = 'CGO_ADMIN',
  CGO_ANALYST = 'CGO_ANALYST',
  CLIENT_EXEC = 'CLIENT_EXEC',
  CLIENT_USER = 'CLIENT_USER',
}

export interface TenantContext {
  tenantId: string;
  tenantType: TenantType;
  role: Role;
  userId: string;
}

export const CGO_ROLES: Role[] = [Role.CGO_ADMIN, Role.CGO_ANALYST];
export const CLIENT_ROLES: Role[] = [Role.CLIENT_EXEC, Role.CLIENT_USER];

export function isCgoRole(role: Role): boolean {
  return CGO_ROLES.includes(role);
}

export function isClientRole(role: Role): boolean {
  return CLIENT_ROLES.includes(role);
}
