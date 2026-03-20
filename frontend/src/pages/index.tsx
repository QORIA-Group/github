import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { TenantType } from '../../../shared/types/tenant';
import { useAuth } from '../context/auth-context';

/**
 * Landing page that redirects authenticated users to their role-specific dashboard.
 */
export default function HomePage() {
  const { isAuthenticated, tenantContext } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (tenantContext?.tenantType === TenantType.CGO) {
      router.replace('/cgo/dashboard');
    } else if (tenantContext?.tenantType === TenantType.CLIENT) {
      router.replace('/client/autopilot');
    }
  }, [isAuthenticated, tenantContext, router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Redirection en cours...</p>
    </div>
  );
}
