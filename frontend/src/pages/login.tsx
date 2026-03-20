import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { TenantType } from '../../../shared/types/tenant';
import { useAuth } from '../context/auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, tenantContext } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch {
      setError('Identifiants invalides');
    }
  };

  // Redirect after successful login
  React.useEffect(() => {
    if (tenantContext) {
      if (tenantContext.tenantType === TenantType.CGO) {
        router.push('/cgo/dashboard');
      } else {
        router.push('/client/autopilot');
      }
    }
  }, [tenantContext, router]);

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
      <h1>QORIA OS – Connexion</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '8px 24px' }}>
          Se connecter
        </button>
      </form>
      <div style={{ marginTop: 24, fontSize: 12, color: '#666' }}>
        <p>Comptes de démonstration :</p>
        <p>CGO : cgo@nexus.qoria.eu</p>
        <p>Client : client@ascendia.qoria.eu</p>
      </div>
    </div>
  );
}
