import { TenantType, Role } from '../../../../shared/types/tenant';

export class TenantContextDto {
  tenantId!: string;
  tenantType!: TenantType;
  role!: Role;
  userId!: string;
}
