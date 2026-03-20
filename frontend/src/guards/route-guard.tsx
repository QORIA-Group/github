import React, { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { TenantType } from '../../../shared/types/tenant';
import { useAuth } from '../context/auth-context';

interface RouteGuardProps {
  children: ReactNode;
  allowedTenantType: TenantType;
}

/**
 * Client-side route guard. Defense-in-depth layer on top of Next.js middleware.
 * Redirects users who somehow reach the wrong dashboard.
 */
export function RouteGuard({ children, allowedTenantType }: RouteGuardProps) {
  const { isAuthenticated, tenantContext } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (tenantContext && tenantContext.tenantType !== allowedTenantType) {
      const redirect =
        tenantContext.tenantType === TenantType.CGO
          ? '/cgo/dashboard'
          : '/client/autopilot';
      router.replace(redirect);
    }
  }, [isAuthenticated, tenantContext, allowedTenantType, router]);

  if (!isAuthenticated || !tenantContext) {
    return null;
  }

  if (tenantContext.tenantType !== allowedTenantType) {
    return null;
  }

  return <>{children}</>;
}
