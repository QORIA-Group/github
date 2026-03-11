-- =============================================================================
-- QORIA OS - Row Level Security (RLS) Policies
-- =============================================================================
-- Applied after Prisma migrations to enforce multi-tenant data isolation.
-- The app sets current_setting('app.tenant_id') per transaction.
-- =============================================================================

-- Enable RLS on all tenant-scoped tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_tasks ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owners too (prevents bypass)
ALTER TABLE tenants FORCE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE event_outbox FORCE ROW LEVEL SECURITY;
ALTER TABLE event_audit_log FORCE ROW LEVEL SECURITY;
ALTER TABLE cognitive_tasks FORCE ROW LEVEL SECURITY;

-- Tenant isolation policies
CREATE POLICY tenant_isolation_tenants ON tenants
  USING (id = current_setting('app.tenant_id', true)::uuid);

CREATE POLICY tenant_isolation_users ON users
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE POLICY tenant_isolation_event_outbox ON event_outbox
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE POLICY tenant_isolation_event_audit_log ON event_audit_log
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE POLICY tenant_isolation_cognitive_tasks ON cognitive_tasks
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- Superadmin bypass role (for system migrations only)
CREATE ROLE qoria_superadmin NOLOGIN;

CREATE POLICY superadmin_bypass_tenants ON tenants
  TO qoria_superadmin USING (true);

CREATE POLICY superadmin_bypass_users ON users
  TO qoria_superadmin USING (true);

CREATE POLICY superadmin_bypass_event_outbox ON event_outbox
  TO qoria_superadmin USING (true);

CREATE POLICY superadmin_bypass_event_audit_log ON event_audit_log
  TO qoria_superadmin USING (true);

CREATE POLICY superadmin_bypass_cognitive_tasks ON cognitive_tasks
  TO qoria_superadmin USING (true);
