export enum TenantType {
  CGO = 'CGO',
  CLIENT = 'CLIENT',
}

export enum Role {
  SUPER_ADMIN = 'super_admin',
  TENANT_ADMIN = 'tenant_admin',
  C_LEVEL = 'c_level',
  CGO = 'cgo',
  CLIENT = 'client',
  MANAGER = 'manager',
  ANALYST = 'analyst',
  AI_AGENT = 'ai_agent',
}

export interface AuthUser {
  userId: string;
  tenantId: string;
  tenantType: TenantType;
  roles: Role[];
  email: string;
  firstName: string;
  lastName: string;
  managedTenantIds?: string[];
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
