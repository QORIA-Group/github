'use client';

import React from 'react';

interface ManagedClient {
  tenantId: string;
  name: string;
  slug: string;
  userCount: number;
  taskCount: number;
  isActive: boolean;
}

interface ClientOverviewTableProps {
  clients: ManagedClient[];
  onSelectClient: (tenantId: string) => void;
}

export function ClientOverviewTable({
  clients,
  onSelectClient,
}: ClientOverviewTableProps): React.ReactElement {
  return (
    <div className="nexus-client-overview">
      <h2>Managed Clients</h2>
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Status</th>
            <th>Users</th>
            <th>Tasks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.tenantId}>
              <td>{client.name}</td>
              <td>
                <span className={client.isActive ? 'status-active' : 'status-inactive'}>
                  {client.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>{client.userCount}</td>
              <td>{client.taskCount}</td>
              <td>
                <button onClick={() => onSelectClient(client.tenantId)}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
