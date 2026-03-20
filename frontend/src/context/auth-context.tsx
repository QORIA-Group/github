import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { TenantContext, TenantType, Role } from '../../../shared/types/tenant';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  tenantContext: TenantContext | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function decodeJwtPayload(token: string): Record<string, unknown> {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );
  return JSON.parse(jsonPayload);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    accessToken: null,
    tenantContext: null,
  });

  // Restore from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('qoria_token');
    if (token) {
      try {
        const payload = decodeJwtPayload(token);
        setState({
          isAuthenticated: true,
          accessToken: token,
          tenantContext: {
            userId: payload.sub as string,
            tenantId: payload.tenantId as string,
            tenantType: payload.tenantType as TenantType,
            role: payload.role as Role,
          },
        });
      } catch {
        localStorage.removeItem('qoria_token');
      }
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error('Authentication failed');
    }

    const data = await res.json();
    localStorage.setItem('qoria_token', data.accessToken);

    setState({
      isAuthenticated: true,
      accessToken: data.accessToken,
      tenantContext: data.tenantContext,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('qoria_token');
    setState({ isAuthenticated: false, accessToken: null, tenantContext: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
