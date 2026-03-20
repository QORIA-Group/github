import React, { useState } from 'react';

interface ClientOption {
  id: string;
  name: string;
}

const DEMO_CLIENTS: ClientOption[] = [
  { id: 'all', name: 'Tous les clients' },
  { id: '20000000-0000-0000-0000-000000000001', name: 'ACME Corp' },
  { id: '20000000-0000-0000-0000-000000000002', name: 'EuroTech SA' },
  { id: '20000000-0000-0000-0000-000000000003', name: 'GreenEnergy GmbH' },
];

/**
 * Nexus CGO Component: Client Selector
 * Allows CGO users to filter the dashboard by specific client.
 */
export function ClientSelector() {
  const [selectedClient, setSelectedClient] = useState('all');

  return (
    <div data-testid="client-selector" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <label htmlFor="client-filter" style={{ fontWeight: 600 }}>
        Filtrer par client :
      </label>
      <select
        id="client-filter"
        value={selectedClient}
        onChange={(e) => setSelectedClient(e.target.value)}
        style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc' }}
      >
        {DEMO_CLIENTS.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
    </div>
  );
}
