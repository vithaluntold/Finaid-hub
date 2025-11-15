const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// =================== DATA STORAGE (In-Memory for Development) ===================
// TODO: Replace with MongoDB/PostgreSQL in production

// User Storage
const USERS_DB = new Map();
const TOKENS_DB = new Map(); // For token blacklisting
const OTP_STORE = new Map();

// Business Data Storage
const FINAID_PROFILES_DB = new Map();
const LICENSES_DB = new Map();
const LICENSING_MASTER_DB = new Map();
const CLIENTS_DB = new Map();
const CLIENT_COMPANIES_DB = new Map();
const ADMINS_DB = new Map();
const AGENTS_RUNS_DB = new Map();
const VECTOR_DATA_DB = new Map();

// Initialize default data
const initializeDefaultData = () => {
  // Default Super Admin
  const superAdminId = uuidv4();
  USERS_DB.set(superAdminId, {
    _id: superAdminId,
    first_name: 'Super',
    last_name: 'Admin',
    email: 'superadmin@finaidhub.io',
    password: bcryptjs.hashSync('password123', 12),
    user_type: 'super_admin',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Default Admin
  const adminId = uuidv4();
  USERS_DB.set(adminId, {
    _id: adminId,
    first_name: 'John',
    last_name: 'Admin',
    email: 'admin@finaidhub.io',
    password: bcryptjs.hashSync('admin123', 12),
    user_type: 'admin',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Default Accounting Firm Owner
  const ownerId = uuidv4();
  USERS_DB.set(ownerId, {
    _id: ownerId,
    first_name: 'Jane',
    last_name: 'Owner',
    email: 'owner@firm.com',
    password: bcryptjs.hashSync('owner123', 12),
    user_type: 'accounting_firm_owner',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Default Accountant
  const accountantId = uuidv4();
  USERS_DB.set(accountantId, {
    _id: accountantId,
    first_name: 'Bob',
    last_name: 'Accountant',
    email: 'accountant@firm.com',
    password: bcryptjs.hashSync('acc123', 12),
    user_type: 'accountant',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  console.log('✅ Default users initialized');

  // Initialize sample Fin(AI)d profiles
  const profile1Id = uuidv4();
  FINAID_PROFILES_DB.set(profile1Id, {
    _id: profile1Id,
    name: 'Basic Financial Analytics',
    description: 'Entry-level financial analysis and reporting',
    category: 'analytics',
    features: ['Transaction Categorization', 'Basic Reports', 'Expense Tracking'],
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: superAdminId
  });

  const profile2Id = uuidv4();
  FINAID_PROFILES_DB.set(profile2Id, {
    _id: profile2Id,
    name: 'Advanced AI Bookkeeping',
    description: 'AI-powered bookkeeping with smart categorization',
    category: 'ai-automation',
    features: ['AI Categorization', 'Smart Reconciliation', 'Predictive Analytics'],
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: superAdminId
  });

  // Initialize sample licenses
  const license1Id = uuidv4();
  LICENSES_DB.set(license1Id, {
    _id: license1Id,
    finaid_profile_id: profile1Id,
    license_key: 'FINAID-BASIC-' + Date.now(),
    owner_id: ownerId,
    assigned_users: [],
    status: 'active',
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  const license2Id = uuidv4();
  LICENSES_DB.set(license2Id, {
    _id: license2Id,
    finaid_profile_id: profile2Id,
    license_key: 'FINAID-ADVANCED-' + Date.now(),
    owner_id: ownerId,
    assigned_users: [accountantId],
    status: 'active',
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Initialize sample licensing master data
  const master1Id = uuidv4();
  LICENSING_MASTER_DB.set(master1Id, {
    _id: master1Id,
    finaid_profile_id: profile1Id,
    price: 99.99,
    currency: 'USD',
    billing_cycle: 'monthly',
    features: ['Transaction Categorization', 'Basic Reports', 'Expense Tracking'],
    max_users: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Initialize sample client companies
  const company1Id = uuidv4();
  CLIENT_COMPANIES_DB.set(company1Id, {
    _id: company1Id,
    company_name: 'ABC Corporation',
    industry: 'Technology',
    size: '50-100 employees',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner_id: ownerId
  });

  // Initialize sample clients
  const client1Id = uuidv4();
  CLIENTS_DB.set(client1Id, {
    _id: client1Id,
    name: 'John Client',
    email: 'john.client@abccorp.com',
    phone: '+1-555-0123',
    company_id: company1Id,
    profile_id: profile1Id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assigned_accountant: accountantId
  });

  console.log('✅ Sample data initialized');
};

module.exports = {
  USERS_DB,
  TOKENS_DB,
  OTP_STORE,
  FINAID_PROFILES_DB,
  LICENSES_DB,
  LICENSING_MASTER_DB,
  CLIENTS_DB,
  CLIENT_COMPANIES_DB,
  ADMINS_DB,
  AGENTS_RUNS_DB,
  VECTOR_DATA_DB,
  initializeDefaultData
};