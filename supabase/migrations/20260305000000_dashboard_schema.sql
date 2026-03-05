-- =============================================================================
-- Dashboard Schema: Operational tables for The Cleanup Crew admin + agent app
-- =============================================================================

-- -------------------------
-- 1. TEAM MEMBERS
-- -------------------------
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'field_agent'
        CHECK (role IN ('admin', 'dispatcher', 'manager', 'field_agent')),
    availability JSONB,
    region TEXT,
    pay_type TEXT CHECK (pay_type IN ('hourly', 'salary', 'contractor')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------
-- 2. PLACES (job sites)
-- -------------------------
CREATE TABLE IF NOT EXISTS places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address TEXT NOT NULL,
    city TEXT,
    province TEXT,
    postal_code TEXT,
    access_instructions TEXT,
    hazards TEXT,
    gate_code TEXT,
    recurring_schedule TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------
-- 3. LEADS (operations)
-- -------------------------
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_submission_id UUID REFERENCES contact_submissions(id) ON DELETE SET NULL,
    place_id UUID REFERENCES places(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    source TEXT DEFAULT 'manual',
    status TEXT NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'contacted', 'quoted', 'booked', 'lost', 'cancelled')),
    assigned_to UUID REFERENCES team_members(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------
-- 4. ASSIGNMENTS (dispatch)
-- -------------------------
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    place_id UUID REFERENCES places(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES team_members(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'created'
        CHECK (status IN (
            'created', 'assigned', 'accepted', 'en_route', 'arrived',
            'in_progress', 'completed', 'qa', 'invoiced'
        )),
    scheduled_date DATE,
    scheduled_window_start TIME,
    scheduled_window_end TIME,
    priority TEXT NOT NULL DEFAULT 'normal'
        CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    estimated_duration_minutes INT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- -------------------------
-- 5. ASSIGNMENT STATUS LOG (immutable audit)
-- -------------------------
CREATE TABLE IF NOT EXISTS assignment_status_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES team_members(id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    notes TEXT
);

-- Prevent UPDATE and DELETE on this table (append-only)
CREATE OR REPLACE RULE no_update_status_log AS
    ON UPDATE TO assignment_status_log DO INSTEAD NOTHING;

CREATE OR REPLACE RULE no_delete_status_log AS
    ON DELETE TO assignment_status_log DO INSTEAD NOTHING;

-- -------------------------
-- 6. TEAM AUDIT LOG
-- -------------------------
CREATE TABLE IF NOT EXISTS team_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_member_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
    field_changed TEXT,
    old_value TEXT,
    new_value TEXT,
    changed_by UUID REFERENCES team_members(id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------
-- 7. INVOICES
-- -------------------------
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
    place_id UUID REFERENCES places(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'sent', 'paid', 'void', 'partially_paid')),
    subtotal NUMERIC(10, 2),
    tax_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.13,
    tax_amount NUMERIC(10, 2),
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10, 2),
    due_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------
-- INDEXES
-- -------------------------
CREATE INDEX IF NOT EXISTS idx_team_members_auth_user ON team_members(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assignments_assigned_to ON assignments(assigned_to);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_scheduled_date ON assignments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_assignment_status_log_assignment ON assignment_status_log(assignment_id);
CREATE INDEX IF NOT EXISTS idx_invoices_assignment ON invoices(assignment_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- -------------------------
-- AUTO updated_at TRIGGERS
-- -------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER places_updated_at
    BEFORE UPDATE ON places
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER assignments_updated_at
    BEFORE UPDATE ON assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -------------------------
-- ROW LEVEL SECURITY
-- -------------------------
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_status_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's role from team_members
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
    SELECT role FROM team_members WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: get current team_member id
CREATE OR REPLACE FUNCTION get_my_team_member_id()
RETURNS UUID AS $$
    SELECT id FROM team_members WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- TEAM MEMBERS policies
CREATE POLICY "team_members_select" ON team_members
    FOR SELECT USING (
        get_my_role() IN ('admin', 'dispatcher', 'manager')
        OR auth_user_id = auth.uid()
    );

CREATE POLICY "team_members_insert" ON team_members
    FOR INSERT WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "team_members_update" ON team_members
    FOR UPDATE USING (get_my_role() IN ('admin', 'dispatcher'));

CREATE POLICY "team_members_delete" ON team_members
    FOR DELETE USING (get_my_role() = 'admin');

-- PLACES policies
CREATE POLICY "places_select" ON places
    FOR SELECT USING (get_my_role() IN ('admin', 'dispatcher', 'manager'));

CREATE POLICY "places_insert" ON places
    FOR INSERT WITH CHECK (get_my_role() IN ('admin', 'dispatcher'));

CREATE POLICY "places_update" ON places
    FOR UPDATE USING (get_my_role() IN ('admin', 'dispatcher'));

CREATE POLICY "places_delete" ON places
    FOR DELETE USING (get_my_role() = 'admin');

-- LEADS policies
CREATE POLICY "leads_select" ON leads
    FOR SELECT USING (get_my_role() IN ('admin', 'dispatcher', 'manager'));

CREATE POLICY "leads_insert" ON leads
    FOR INSERT WITH CHECK (get_my_role() IN ('admin', 'dispatcher'));

CREATE POLICY "leads_update" ON leads
    FOR UPDATE USING (get_my_role() IN ('admin', 'dispatcher'));

CREATE POLICY "leads_delete" ON leads
    FOR DELETE USING (get_my_role() = 'admin');

-- ASSIGNMENTS policies
CREATE POLICY "assignments_select_admin" ON assignments
    FOR SELECT USING (get_my_role() IN ('admin', 'dispatcher', 'manager'));

CREATE POLICY "assignments_select_agent" ON assignments
    FOR SELECT USING (
        get_my_role() = 'field_agent'
        AND assigned_to = get_my_team_member_id()
    );

CREATE POLICY "assignments_insert" ON assignments
    FOR INSERT WITH CHECK (get_my_role() IN ('admin', 'dispatcher'));

CREATE POLICY "assignments_update_admin" ON assignments
    FOR UPDATE USING (get_my_role() IN ('admin', 'dispatcher'));

CREATE POLICY "assignments_update_agent" ON assignments
    FOR UPDATE USING (
        get_my_role() = 'field_agent'
        AND assigned_to = get_my_team_member_id()
    );

CREATE POLICY "assignments_delete" ON assignments
    FOR DELETE USING (get_my_role() = 'admin');

-- ASSIGNMENT STATUS LOG policies
CREATE POLICY "status_log_select" ON assignment_status_log
    FOR SELECT USING (get_my_role() IN ('admin', 'dispatcher', 'manager'));

CREATE POLICY "status_log_insert_admin" ON assignment_status_log
    FOR INSERT WITH CHECK (get_my_role() IN ('admin', 'dispatcher'));

CREATE POLICY "status_log_insert_agent" ON assignment_status_log
    FOR INSERT WITH CHECK (
        get_my_role() = 'field_agent'
        AND EXISTS (
            SELECT 1 FROM assignments
            WHERE id = assignment_id
            AND assigned_to = get_my_team_member_id()
        )
    );

-- TEAM AUDIT LOG policies
CREATE POLICY "team_audit_log_select" ON team_audit_log
    FOR SELECT USING (get_my_role() = 'admin');

CREATE POLICY "team_audit_log_insert" ON team_audit_log
    FOR INSERT WITH CHECK (get_my_role() IN ('admin', 'dispatcher'));

-- INVOICES policies
CREATE POLICY "invoices_select" ON invoices
    FOR SELECT USING (get_my_role() IN ('admin', 'manager'));

CREATE POLICY "invoices_insert" ON invoices
    FOR INSERT WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "invoices_update" ON invoices
    FOR UPDATE USING (get_my_role() = 'admin');

CREATE POLICY "invoices_delete" ON invoices
    FOR DELETE USING (get_my_role() = 'admin');
