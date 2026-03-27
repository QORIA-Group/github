-- =============================================================================
-- Qorway OS - Row Level Security (RLS) Policies
-- =============================================================================
-- Applied after Prisma migrations to enforce multi-tenant data isolation.
--
-- Two context variables control RLS:
--   app.tenant_id    → the authenticated tenant's own ID
--   app.tenant_type  → 'CGO' or 'CLIENT'
--
-- CLIENT tenants see only their own rows (tenant_id = app.tenant_id).
-- CGO tenants see their own rows PLUS rows of managed clients
-- (looked up via cgo_client_relations).
-- =============================================================================

-- Enable RLS on all tenant-scoped tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cgo_client_relations ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owners too (prevents bypass)
ALTER TABLE tenants FORCE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE event_outbox FORCE ROW LEVEL SECURITY;
ALTER TABLE event_audit_log FORCE ROW LEVEL SECURITY;
ALTER TABLE cognitive_tasks FORCE ROW LEVEL SECURITY;
ALTER TABLE cgo_client_relations FORCE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- CLIENT isolation: sees only own tenant_id
-- ---------------------------------------------------------------------------
CREATE POLICY client_isolation_tenants ON tenants
  USING (
    id = current_setting('app.tenant_id', true)::uuid
  );

CREATE POLICY client_isolation_users ON users
  USING (
    tenant_id = current_setting('app.tenant_id', true)::uuid
  );

CREATE POLICY client_isolation_event_outbox ON event_outbox
  USING (
    tenant_id = current_setting('app.tenant_id', true)::uuid
  );

CREATE POLICY client_isolation_event_audit_log ON event_audit_log
  USING (
    tenant_id = current_setting('app.tenant_id', true)::uuid
  );

CREATE POLICY client_isolation_cognitive_tasks ON cognitive_tasks
  USING (
    tenant_id = current_setting('app.tenant_id', true)::uuid
  );

-- ---------------------------------------------------------------------------
-- CGO cross-tenant access: own rows + managed client rows
-- ---------------------------------------------------------------------------
CREATE POLICY cgo_cross_tenant_tenants ON tenants
  USING (
    current_setting('app.tenant_type', true) = 'CGO'
    AND (
      id = current_setting('app.tenant_id', true)::uuid
      OR id IN (
        SELECT client_tenant_id FROM cgo_client_relations
        WHERE cgo_tenant_id = current_setting('app.tenant_id', true)::uuid
          AND is_active = true
      )
    )
  );

CREATE POLICY cgo_cross_tenant_users ON users
  USING (
    current_setting('app.tenant_type', true) = 'CGO'
    AND (
      tenant_id = current_setting('app.tenant_id', true)::uuid
      OR tenant_id IN (
        SELECT client_tenant_id FROM cgo_client_relations
        WHERE cgo_tenant_id = current_setting('app.tenant_id', true)::uuid
          AND is_active = true
      )
    )
  );

CREATE POLICY cgo_cross_tenant_event_outbox ON event_outbox
  USING (
    current_setting('app.tenant_type', true) = 'CGO'
    AND (
      tenant_id = current_setting('app.tenant_id', true)::uuid
      OR tenant_id IN (
        SELECT client_tenant_id FROM cgo_client_relations
        WHERE cgo_tenant_id = current_setting('app.tenant_id', true)::uuid
          AND is_active = true
      )
    )
  );

CREATE POLICY cgo_cross_tenant_event_audit_log ON event_audit_log
  USING (
    current_setting('app.tenant_type', true) = 'CGO'
    AND (
      tenant_id = current_setting('app.tenant_id', true)::uuid
      OR tenant_id IN (
        SELECT client_tenant_id FROM cgo_client_relations
        WHERE cgo_tenant_id = current_setting('app.tenant_id', true)::uuid
          AND is_active = true
      )
    )
  );

CREATE POLICY cgo_cross_tenant_cognitive_tasks ON cognitive_tasks
  USING (
    current_setting('app.tenant_type', true) = 'CGO'
    AND (
      tenant_id = current_setting('app.tenant_id', true)::uuid
      OR tenant_id IN (
        SELECT client_tenant_id FROM cgo_client_relations
        WHERE cgo_tenant_id = current_setting('app.tenant_id', true)::uuid
          AND is_active = true
      )
    )
  );

-- CGO can see its own client relations
CREATE POLICY cgo_own_relations ON cgo_client_relations
  USING (
    cgo_tenant_id = current_setting('app.tenant_id', true)::uuid
  );

-- CLIENT can see relations where they are the client
CREATE POLICY client_own_relations ON cgo_client_relations
  USING (
    client_tenant_id = current_setting('app.tenant_id', true)::uuid
  );

-- ---------------------------------------------------------------------------
-- Superadmin bypass role (for system migrations only)
-- ---------------------------------------------------------------------------
CREATE ROLE qorway_superadmin NOLOGIN;

CREATE POLICY superadmin_bypass_tenants ON tenants
  TO qorway_superadmin USING (true);

CREATE POLICY superadmin_bypass_users ON users
  TO qorway_superadmin USING (true);

CREATE POLICY superadmin_bypass_event_outbox ON event_outbox
  TO qorway_superadmin USING (true);

CREATE POLICY superadmin_bypass_event_audit_log ON event_audit_log
  TO qorway_superadmin USING (true);

CREATE POLICY superadmin_bypass_cognitive_tasks ON cognitive_tasks
  TO qorway_superadmin USING (true);

CREATE POLICY superadmin_bypass_cgo_client_relations ON cgo_client_relations
  TO qorway_superadmin USING (true);
