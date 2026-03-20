import React from 'react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../store';
import { AuthProvider } from '../context/auth-context';
import { TenantProvider } from '../context/tenant-context';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <TenantProvider>
          <Component {...pageProps} />
        </TenantProvider>
      </AuthProvider>
    </Provider>
  );
}
