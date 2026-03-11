export interface TenantContext {
  tenantId: string;
  userId: string;
  roles: string[];
  correlationId: string;
}
