-- Row-Level Security policies for QORIA OS multi-tenant isolation
-- Applied per-table to enforce tenant boundaries at the database level.

-- Enable RLS on all tenant-scoped tables
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_outbox ENABLE ROW LEVEL SECURITY;

-- CLIENT policy: can only see own tenant data
CREATE POLICY tenant_isolation_insights ON insights
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid
    OR current_setting('app.is_cgo', true)::boolean = true
  );

CREATE POLICY tenant_isolation_automation ON automation_tasks
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid
    OR current_setting('app.is_cgo', true)::boolean = true
  );

CREATE POLICY tenant_isolation_events ON event_outbox
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid
    OR current_setting('app.is_cgo', true)::boolean = true
  );

-- CGO users: app.is_cgo is set to true by the tenant middleware,
-- allowing cross-tenant reads for multi-client analysis.
-- This flag is derived from the JWT claim, never from client headers.
