import React, { createContext, useContext, ReactNode } from 'react';
import { TenantType } from '../../../shared/types/tenant';
import { useAuth } from './auth-context';

interface TenantContextValue {
  tenantType: TenantType | null;
  tenantId: string | null;
  isCgo: boolean;
  isClient: boolean;
}

const TenantContext = createContext<TenantContextValue>({
  tenantType: null,
  tenantId: null,
  isCgo: false,
  isClient: false,
});

export function TenantProvider({ children }: { children: ReactNode }) {
  const { tenantContext } = useAuth();

  const value: TenantContextValue = {
    tenantType: tenantContext?.tenantType ?? null,
    tenantId: tenantContext?.tenantId ?? null,
    isCgo: tenantContext?.tenantType === TenantType.CGO,
    isClient: tenantContext?.tenantType === TenantType.CLIENT,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantContextValue {
  return useContext(TenantContext);
}
