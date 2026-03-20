'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/auth.context';

/**
 * Hook that redirects the user to the correct route based on TenantType.
 * CGO  -> /cgo/dashboard
 * CLIENT -> /client/autopilot
 */
export function useRoleRouter(router: { push: (path: string) => void }): {
  isRedirecting: boolean;
} {
  const { user, isAuthenticated, isLoading, isCgo, isClient } = useAuth();

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    if (isCgo) {
      router.push('/cgo/dashboard');
    } else if (isClient) {
      router.push('/client/autopilot');
    }
  }, [isLoading, isAuthenticated, user, isCgo, isClient, router]);

  return { isRedirecting: isLoading || (isAuthenticated && !!user) };
}
