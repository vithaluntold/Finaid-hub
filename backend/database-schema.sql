-- ==========================================
-- FinAidHub PostgreSQL Database Schema
-- ==========================================
-- Description: Complete database schema for FinAidHub application
-- Version: 1.0
-- Date: November 9, 2025
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE user_type_enum AS ENUM (
    'super_admin',
    'admin',
    'accounting_firm_owner',
    'accountant',
    'client'
);

CREATE TYPE user_status_enum AS ENUM (
    'active',
    'inactive',
    'invited',
    'suspended',
    'pending'
);

CREATE TYPE license_status_enum AS ENUM (
    'active',
    'inactive',
    'expired',
    'suspended'
);

CREATE TYPE billing_cycle_enum AS ENUM (
    'monthly',
    'quarterly',
    'annually',
    'one_time'
);

CREATE TYPE finaid_category_enum AS ENUM (
    'analytics',
    'ai-automation',
    'bookkeeping',
    'tax-preparation',
    'audit',
    'reporting',
    'compliance'
);

CREATE TYPE transaction_type_enum AS ENUM (
    'income',
    'expense',
    'transfer',
    'adjustment'
);

CREATE TYPE document_type_enum AS ENUM (
    'invoice',
    'receipt',
    'statement',
    'contract',
    'report',
    'tax_document',
    'other'
);

CREATE TYPE communication_type_enum AS ENUM (
    'email',
    'phone',
    'meeting',
    'note',
    'message'
);

-- ==========================================
-- TABLES
-- ==========================================

-- Users Table (Main user management)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type user_type_enum NOT NULL,
    status user_status_enum DEFAULT 'pending',
    phone VARCHAR(20),
    department VARCHAR(100),
    profile_picture_url TEXT,
    invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- User Sessions/Tokens (for JWT blacklisting and session management)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info TEXT,
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTP Storage (for password reset and verification)
CREATE TABLE otp_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    purpose VARCHAR(50) NOT NULL, -- 'password_reset', 'email_verification', etc.
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accounting Firms
CREATE TABLE accounting_firms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    firm_name VARCHAR(255) NOT NULL,
    business_registration_number VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url TEXT,
    tax_id VARCHAR(50),
    status user_status_enum DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fin(AI)d Profiles (AI Agent Profiles)
CREATE TABLE finaid_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category finaid_category_enum NOT NULL,
    features JSONB, -- Array of features as JSON
    configuration JSONB, -- AI model configuration
    version VARCHAR(20),
    status license_status_enum DEFAULT 'active',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Licensing Master (Pricing and License Templates)
CREATE TABLE licensing_master (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    finaid_profile_id UUID NOT NULL REFERENCES finaid_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    billing_cycle billing_cycle_enum NOT NULL,
    features JSONB,
    max_users INTEGER DEFAULT 1,
    max_clients INTEGER,
    storage_limit_gb INTEGER,
    api_calls_limit INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Licenses (Actual licenses issued to users)
CREATE TABLE licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    finaid_profile_id UUID NOT NULL REFERENCES finaid_profiles(id) ON DELETE CASCADE,
    licensing_master_id UUID REFERENCES licensing_master(id) ON DELETE SET NULL,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_key VARCHAR(255) UNIQUE NOT NULL,
    status license_status_enum DEFAULT 'active',
    assigned_users JSONB DEFAULT '[]', -- Array of user IDs
    max_users INTEGER DEFAULT 1,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activation_date TIMESTAMP,
    expires_at TIMESTAMP,
    auto_renew BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- License Assignments (Many-to-many relationship between licenses and users)
CREATE TABLE license_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_id UUID NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    status license_status_enum DEFAULT 'active',
    UNIQUE(license_id, user_id)
);

-- Clients (Business clients of accounting firms)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    company_owner_name VARCHAR(255),
    company_location VARCHAR(255),
    company_nature VARCHAR(100), -- Industry/business type
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    tax_id VARCHAR(50),
    website VARCHAR(255),
    accounting_firm_id UUID REFERENCES accounting_firms(id) ON DELETE SET NULL,
    assigned_accountant_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status user_status_enum DEFAULT 'active',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Client Contacts (Multiple contacts per client)
CREATE TABLE client_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    position VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions (Financial transactions for clients)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    transaction_type transaction_type_enum NOT NULL,
    date DATE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    category_id UUID REFERENCES transaction_categories(id) ON DELETE SET NULL,
    category_name VARCHAR(100),
    payee VARCHAR(255),
    receipt_url TEXT,
    reference_number VARCHAR(100),
    bank_account VARCHAR(100),
    completed BOOLEAN DEFAULT FALSE,
    vector_found BOOLEAN DEFAULT FALSE, -- AI categorization status
    parsed_description TEXT,
    parsed_type VARCHAR(50),
    comments TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transaction Categories
CREATE TABLE transaction_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES transaction_categories(id) ON DELETE SET NULL,
    description TEXT,
    category_type transaction_type_enum,
    is_system_category BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, parent_id)
);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, paid, overdue, cancelled
    payment_terms TEXT,
    notes TEXT,
    items JSONB, -- Array of invoice line items
    pdf_url TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments (Invoice payments)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50), -- credit_card, bank_transfer, check, cash
    transaction_id VARCHAR(255),
    reference_number VARCHAR(100),
    notes TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    document_type document_type_enum NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT, -- in bytes
    mime_type VARCHAR(100),
    tags JSONB, -- Array of tags
    is_confidential BOOLEAN DEFAULT FALSE,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Communications (Client communications log)
CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    communication_type communication_type_enum NOT NULL,
    subject VARCHAR(255),
    content TEXT,
    attachments JSONB, -- Array of attachment URLs
    scheduled_at TIMESTAMP,
    completed_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'completed', -- pending, completed, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent Runs (AI Agent execution logs)
CREATE TABLE agent_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    finaid_profile_id UUID NOT NULL REFERENCES finaid_profiles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    run_name VARCHAR(255),
    input_data JSONB,
    output_data JSONB,
    status VARCHAR(50) DEFAULT 'running', -- running, completed, failed
    error_message TEXT,
    execution_time_ms INTEGER,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Vector Data (AI embeddings and vector storage)
CREATE TABLE vector_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    finaid_profile_id UUID REFERENCES finaid_profiles(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    vector_type VARCHAR(50), -- transaction, document, description, etc.
    embedding VECTOR(1536), -- Requires pgvector extension
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs (System-wide audit trail)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100), -- users, clients, transactions, etc.
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System Settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- info, warning, error, success
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- INDEXES
-- ==========================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- User sessions indexes
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_token_hash ON user_sessions(token_hash);

-- OTP codes indexes
CREATE INDEX idx_otp_codes_email ON otp_codes(email);
CREATE INDEX idx_otp_codes_expires_at ON otp_codes(expires_at);

-- Accounting firms indexes
CREATE INDEX idx_accounting_firms_owner_id ON accounting_firms(owner_id);
CREATE INDEX idx_accounting_firms_status ON accounting_firms(status);

-- Finaid profiles indexes
CREATE INDEX idx_finaid_profiles_category ON finaid_profiles(category);
CREATE INDEX idx_finaid_profiles_status ON finaid_profiles(status);

-- Licenses indexes
CREATE INDEX idx_licenses_owner_id ON licenses(owner_id);
CREATE INDEX idx_licenses_finaid_profile_id ON licenses(finaid_profile_id);
CREATE INDEX idx_licenses_status ON licenses(status);
CREATE INDEX idx_licenses_license_key ON licenses(license_key);

-- License assignments indexes
CREATE INDEX idx_license_assignments_license_id ON license_assignments(license_id);
CREATE INDEX idx_license_assignments_user_id ON license_assignments(user_id);

-- Clients indexes
CREATE INDEX idx_clients_accounting_firm_id ON clients(accounting_firm_id);
CREATE INDEX idx_clients_assigned_accountant_id ON clients(assigned_accountant_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_email ON clients(email);

-- Transactions indexes
CREATE INDEX idx_transactions_client_id ON transactions(client_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);

-- Invoices indexes
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);

-- Payments indexes
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);

-- Documents indexes
CREATE INDEX idx_documents_client_id ON documents(client_id);
CREATE INDEX idx_documents_document_type ON documents(document_type);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);

-- Communications indexes
CREATE INDEX idx_communications_client_id ON communications(client_id);
CREATE INDEX idx_communications_user_id ON communications(user_id);
CREATE INDEX idx_communications_type ON communications(communication_type);

-- Agent runs indexes
CREATE INDEX idx_agent_runs_finaid_profile_id ON agent_runs(finaid_profile_id);
CREATE INDEX idx_agent_runs_user_id ON agent_runs(user_id);
CREATE INDEX idx_agent_runs_client_id ON agent_runs(client_id);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounting_firms_updated_at BEFORE UPDATE ON accounting_firms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_finaid_profiles_updated_at BEFORE UPDATE ON finaid_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_licensing_master_updated_at BEFORE UPDATE ON licensing_master
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_licenses_updated_at BEFORE UPDATE ON licenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_contacts_updated_at BEFORE UPDATE ON client_contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transaction_categories_updated_at BEFORE UPDATE ON transaction_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit log trigger function
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values)
        VALUES (
            COALESCE(NULLIF(current_setting('app.current_user_id', TRUE), ''), NULL)::UUID,
            TG_OP,
            TG_TABLE_NAME,
            NEW.id,
            to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
        VALUES (
            COALESCE(NULLIF(current_setting('app.current_user_id', TRUE), ''), NULL)::UUID,
            TG_OP,
            TG_TABLE_NAME,
            NEW.id,
            to_jsonb(OLD),
            to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values)
        VALUES (
            COALESCE(NULLIF(current_setting('app.current_user_id', TRUE), ''), NULL)::UUID,
            TG_OP,
            TG_TABLE_NAME,
            OLD.id,
            to_jsonb(OLD)
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_licenses AFTER INSERT OR UPDATE OR DELETE ON licenses
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_transactions AFTER INSERT OR UPDATE OR DELETE ON transactions
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- ==========================================
-- VIEWS
-- ==========================================

-- Active users view
CREATE VIEW active_users AS
SELECT 
    id,
    first_name,
    last_name,
    email,
    user_type,
    status,
    last_login,
    created_at
FROM users
WHERE status = 'active' AND deleted_at IS NULL;

-- Client summary view
CREATE VIEW client_summary AS
SELECT 
    c.id,
    c.company_name,
    c.email,
    c.status,
    af.firm_name AS accounting_firm,
    CONCAT(u.first_name, ' ', u.last_name) AS assigned_accountant,
    COUNT(DISTINCT t.id) AS transaction_count,
    COUNT(DISTINCT i.id) AS invoice_count,
    COALESCE(SUM(i.total_amount), 0) AS total_invoiced,
    c.created_at
FROM clients c
LEFT JOIN accounting_firms af ON c.accounting_firm_id = af.id
LEFT JOIN users u ON c.assigned_accountant_id = u.id
LEFT JOIN transactions t ON c.id = t.client_id
LEFT JOIN invoices i ON c.id = i.client_id
GROUP BY c.id, c.company_name, c.email, c.status, af.firm_name, u.first_name, u.last_name, c.created_at;

-- License usage view
CREATE VIEW license_usage AS
SELECT 
    l.id AS license_id,
    l.license_key,
    fp.name AS finaid_profile_name,
    CONCAT(u.first_name, ' ', u.last_name) AS owner_name,
    l.status,
    l.max_users,
    jsonb_array_length(l.assigned_users) AS assigned_user_count,
    l.expires_at,
    l.created_at
FROM licenses l
JOIN finaid_profiles fp ON l.finaid_profile_id = fp.id
JOIN users u ON l.owner_id = u.id;

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- Function to get user's active licenses
CREATE OR REPLACE FUNCTION get_user_licenses(p_user_id UUID)
RETURNS TABLE (
    license_id UUID,
    license_key VARCHAR,
    finaid_name VARCHAR,
    status license_status_enum,
    expires_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.license_key,
        fp.name,
        l.status,
        l.expires_at
    FROM licenses l
    JOIN finaid_profiles fp ON l.finaid_profile_id = fp.id
    JOIN license_assignments la ON l.id = la.license_id
    WHERE la.user_id = p_user_id
      AND l.status = 'active'
      AND (l.expires_at IS NULL OR l.expires_at > CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

-- Function to check license capacity
CREATE OR REPLACE FUNCTION check_license_capacity(p_license_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_max_users INTEGER;
    v_current_users INTEGER;
BEGIN
    SELECT max_users INTO v_max_users
    FROM licenses
    WHERE id = p_license_id;
    
    SELECT COUNT(*) INTO v_current_users
    FROM license_assignments
    WHERE license_id = p_license_id
      AND status = 'active';
    
    RETURN v_current_users < v_max_users;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- DEFAULT DATA (Initial System Setup)
-- ==========================================

-- Insert default transaction categories
INSERT INTO transaction_categories (name, category_type, is_system_category) VALUES
('Salary', 'income', TRUE),
('Sales Revenue', 'income', TRUE),
('Investment Income', 'income', TRUE),
('Other Income', 'income', TRUE),
('Office Rent', 'expense', TRUE),
('Utilities', 'expense', TRUE),
('Salaries & Wages', 'expense', TRUE),
('Office Supplies', 'expense', TRUE),
('Travel', 'expense', TRUE),
('Marketing', 'expense', TRUE),
('Insurance', 'expense', TRUE),
('Taxes', 'expense', TRUE),
('Other Expenses', 'expense', TRUE);

-- Insert system settings
INSERT INTO system_settings (key, value, description, is_public) VALUES
('company_name', '"FinAidHub"', 'Company name', TRUE),
('support_email', '"support@finaidhub.io"', 'Support email address', TRUE),
('max_file_size_mb', '50', 'Maximum file upload size in MB', FALSE),
('session_timeout_minutes', '60', 'User session timeout in minutes', FALSE),
('password_min_length', '8', 'Minimum password length', FALSE),
('default_currency', '"USD"', 'Default currency code', TRUE);

-- ==========================================
-- COMMENTS
-- ==========================================

COMMENT ON TABLE users IS 'Main user management table for all user types';
COMMENT ON TABLE accounting_firms IS 'Accounting firm companies that use the platform';
COMMENT ON TABLE finaid_profiles IS 'AI agent profiles/configurations';
COMMENT ON TABLE licenses IS 'Licenses issued to users for accessing Fin(AI)d profiles';
COMMENT ON TABLE clients IS 'Business clients of accounting firms';
COMMENT ON TABLE transactions IS 'Financial transactions for clients';
COMMENT ON TABLE invoices IS 'Invoices issued to clients';
COMMENT ON TABLE documents IS 'Document storage and management';
COMMENT ON TABLE communications IS 'Communication logs with clients';
COMMENT ON TABLE agent_runs IS 'AI agent execution logs';
COMMENT ON TABLE audit_logs IS 'System-wide audit trail';

-- ==========================================
-- PERMISSIONS (Example - adjust as needed)
-- ==========================================

-- Create roles
CREATE ROLE finaidhub_admin;
CREATE ROLE finaidhub_user;
CREATE ROLE finaidhub_readonly;

-- Grant permissions to admin role
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO finaidhub_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO finaidhub_admin;

-- Grant permissions to user role
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO finaidhub_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO finaidhub_user;

-- Grant permissions to readonly role
GRANT SELECT ON ALL TABLES IN SCHEMA public TO finaidhub_readonly;

-- ==========================================
-- END OF SCHEMA
-- ==========================================
