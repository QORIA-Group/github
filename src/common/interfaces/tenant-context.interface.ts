import { TenantType } from '../enums/tenant-type.enum';

export interface TenantContext {
  tenantId: string;
  userId: string;
  roles: string[];
  tenantType: TenantType;
  correlationId: string;
  /** For CGO tenants: list of managed client tenant IDs */
  managedTenantIds?: string[];
}
