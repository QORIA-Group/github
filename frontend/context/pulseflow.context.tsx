'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react';
import { useAuth } from './auth.context';
import { PulseFlowEvent } from '../types/kyra.types';

interface PulseFlowContextValue {
  lastEvent: PulseFlowEvent | null;
  isConnected: boolean;
  events: PulseFlowEvent[];
}

const PulseFlowContext = createContext<PulseFlowContextValue>({
  lastEvent: null,
  isConnected: false,
  events: [],
});

export function PulseFlowProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<PulseFlowEvent[]>([]);
  const [lastEvent, setLastEvent] = useState<PulseFlowEvent | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    // In production: connect to WebSocket with tenant context
    // const wsUrl = `${WS_BASE}/pulseflow?tenantId=${user.tenantId}&tenantType=${user.tenantType}`;
    // if (user.tenantType === 'CGO' && user.managedTenantIds) {
    //   wsUrl += `&managedTenantIds=${user.managedTenantIds.join(',')}`;
    // }

    setIsConnected(true);

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setIsConnected(false);
    };
  }, [isAuthenticated, user]);

  const value = useMemo(
    () => ({ lastEvent, isConnected, events }),
    [lastEvent, isConnected, events],
  );

  return <PulseFlowContext.Provider value={value}>{children}</PulseFlowContext.Provider>;
}

export function usePulseFlow(): PulseFlowContextValue {
  return useContext(PulseFlowContext);
}
