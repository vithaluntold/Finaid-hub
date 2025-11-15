# Complete User Role Testing Guide - Fin(Ai)d Hub

## 🎯 Testing Overview

This guide provides detailed steps to test all functionalities for each user role in the Fin(Ai)d Hub platform. Each role has specific responsibilities and access levels that need to be thoroughly tested.

---

## 🔐 Pre-Testing Setup

### 1. Environment Verification
```bash
# Frontend (Next.js)
cd "c:\Nikesh\Personal\FinAce\globalxchange-studio-finaid-78c2970a0ea2\globalxchange-studio-finaid-78c2970a0ea2"
pnpm install
pnpm dev
# Access: http://localhost:3000

# Backend (Laravel) - Should be running at:
# https://backend.finaidhub.io
```

### 2. Test Data Requirements
- Valid user credentials for each role
- Sample accounting firm data
- Test license keys
- QuickBooks test account (optional)

---

## 👑 SUPER ADMIN ROLE TESTING

### **Access Level**: Full platform control, manage all firms and admins

### 🔑 Login Testing
**File**: `components/login-form.tsx`
```
1. Navigate to login page (/)
2. Select "Super Admin" from user type dropdown
3. Enter super admin credentials
4. Expected: Redirect to /super-admin/dashboard
```

### 📊 Dashboard Testing
**File**: `app/super-admin/dashboard/page.tsx`

#### Test Metrics Cards:
```
✅ Active Firms Count
✅ Total Revenue Display  
✅ Total Users Count
✅ Fin(Ai)ds Deployed Count

API Calls to Verify:
- GET /api/v1/users/accounting-owner (for firm count)
- GET /api/v1/licenses/my-licenses (for licenses count)
```

**Test Steps:**
1. Check dashboard loads without errors
2. Verify metrics show actual data
3. Check loading skeletons appear during data fetch
4. Verify charts/graphs render properly

### 🏢 Accounting Firms Management
**Navigation**: `/super-admin/accounting-firms`

#### Test Create New Firm:
```
API: POST /api/v1/accounting-firm/create
Test Data:
{
  "name": "Test Accounting Firm",
  "address": "123 Test Street", 
  "contact_email": "test@firm.com",
  "phone": "+1234567890"
}

Steps:
1. Click "Create New Firm" button
2. Fill all required fields
3. Submit form
4. Verify firm appears in list
5. Check success notification
```

#### Test Firm Management:
```
API Calls:
- GET /api/v1/accounting-firm/{firm_id}
- POST /api/v1/accounting-firm/{firm_id}/attach-owner
- POST /api/v1/accounting-firm/{firm_id}/attach-user

Steps:
1. View firm details
2. Edit firm information
3. Attach/detach owners
4. Attach/detach users
5. Delete firm (if permissions allow)
```

### 👥 Admin Management
**Navigation**: `/super-admin/admins`

#### Test Invite Admin:
**File**: `components/super-admin/DialogPopups/invite-admin-dialog.tsx`
```
API: POST /api/v1/admin/invite
Test Data:
{
  "email": "newadmin@test.com",
  "first_name": "Test",
  "last_name": "Admin",
  "role": "admin"
}

Steps:
1. Click "Invite Admin" button
2. Fill invitation form
3. Send invitation
4. Verify admin appears in pending list
5. Check email sent notification
```

#### Test Admin List Management:
**File**: `components/super-admin/invite-admin-list.tsx`
```
API: GET /api/v1/admins/users/by-superadmin

Steps:
1. View all admins list
2. Check admin details
3. Resend invitations
4. Update admin profiles
5. Deactivate/activate admins
```

### 🛒 Marketplace Management
**Navigation**: `/super-admin/marketplace`
```
Test Areas:
1. View all marketplace items
2. Add new marketplace products
3. Edit existing products
4. Manage product categories
5. Set pricing and availability
```

---

## 🔧 ADMIN ROLE TESTING

### **Access Level**: Manage assigned accounting firms, limited analytics

### 🔑 Login Testing
```
1. Select "Admin" from user type dropdown
2. Enter admin credentials  
3. Expected: Redirect to /admin/dashboard
```

### 📊 Dashboard Testing
**File**: `app/admin/dashboard/page.tsx`

#### Test Admin Dashboard:
```
Similar to Super Admin but with limited scope:
✅ Active Firms (assigned only)
✅ Total Revenue (assigned firms)
✅ Total Users (assigned firms)  
✅ Fin(Ai)ds Deployed (assigned firms)

API Calls:
- GET /api/v1/users/accounting-owner (filtered)
- GET /api/v1/licenses/my-licenses (filtered)
```

### 🏢 Assigned Firms Management
**Navigation**: `/admin/accounting-firms`
```
Test Scope: Only firms assigned to this admin

Steps:
1. View assigned firms list
2. Access firm details
3. Manage firm users (if permissions allow)
4. View firm analytics
5. Generate reports for assigned firms
```

### 📈 Limited Analytics Access
```
Test Areas:
1. View firm-level analytics
2. Generate reports for assigned firms
3. Monitor license usage
4. Track user activity
```

---

## 🏢 ACCOUNTING FIRM OWNER ROLE TESTING

### **Access Level**: Full control over owned firm, manage accountants and clients

### 🔑 Login Testing
```
1. Select "Accounting Firm Owner" from user type dropdown
2. Enter firm owner credentials
3. Expected: Redirect to /accounting-firm-owner/dashboard
```

### 📊 Dashboard Testing
**File**: `app/accounting-firm-owner/dashboard/page.tsx`

#### Test Owner Dashboard:
```
✅ Active Accountants Count
✅ Active Clients Count  
✅ Fin(Ai)ds Deployed Count
✅ Active Licenses Count

API Calls:
- GET /api/v1/users/accountant/invited
- GET /api/v1/licenses/my-licenses
- GET /api/v1/client-companies
```

### 👨‍💼 Accountant Management
**Navigation**: `/accounting-firm-owner/accountants`

#### Test Invite Accountant:
**File**: `components/accounting-firm-owner/employee-management.tsx`
```
API: POST /api/v1/users/accountant/invite
Test Data:
{
  "email": "accountant@firm.com",
  "first_name": "John",
  "last_name": "Accountant",
  "department": "Audit"
}

Steps:
1. Click "Invite Accountant"
2. Fill invitation form
3. Send invitation
4. Verify accountant in pending list
5. Track invitation status
```

#### Test Accountant List Management:
```
API: GET /api/v1/users/accountant/invited

Steps:
1. View all accountants
2. See accountant details
3. Resend invitations
4. Assign/revoke licenses
5. Deactivate accountants
```

### 🎫 License Management
**Navigation**: `/accounting-firm-owner/licenses`

#### Test Purchase Licenses:
```
API: POST /api/v1/licenses/purchase
Test Data:
{
  "finaid_profile_id": "profile123",
  "quantity": 5,
  "payment_method": "credit_card"
}

Steps:
1. Browse available Fin(Ai)d profiles
2. Select license quantity
3. Complete purchase flow
4. Verify licenses in account
5. Check payment confirmation
```

#### Test License Assignment:
```
API: POST /api/v1/licenses/assign
Test Data:
{
  "license_key": "LIC123456",
  "user_id": "accountant_id",
  "assignment_type": "temporary"
}

Steps:
1. View available licenses
2. Select accountant to assign
3. Assign license
4. Verify assignment successful
5. Track license usage
```

### 👥 Client Management
**Navigation**: `/accounting-firm-owner/clients`
**File**: `app/accounting-firm-owner/clients/page.tsx`

#### Test Add Client:
```
API: POST /api/v1/client-companies
Test Data:
{
  "company_name": "Test Client Corp",
  "industry": "Technology",
  "contact_person": "Jane Doe",
  "email": "jane@testclient.com",
  "phone": "+1234567890"
}

Steps:
1. Click "Add Client" button
2. Fill client information form
3. Submit client details
4. Verify client in list
5. Check client profile created
```

#### Test Client Management:
```
API Calls:
- GET /api/v1/client-companies
- PUT /api/v1/client-companies/{id}
- DELETE /api/v1/client-companies/{id}

Steps:
1. View all clients list
2. Edit client information
3. View client details/profile
4. Assign accountants to clients
5. Manage client access permissions
6. Archive/delete clients
```

### 🤖 Fin(Ai)d Profile Management
**File**: `components/accounting-firm-owner/finaid-profiles.tsx`

#### Test Profile Operations:
```
API Calls:
- GET /api/v1/finaid-profiles
- POST /api/v1/finaid-profiles
- PUT /api/v1/finaid-profiles/{id}
- DELETE /api/v1/finaid-profiles/{id}

Steps:
1. View available profiles
2. Create custom profiles
3. Edit profile settings
4. Delete unused profiles
5. Assign profiles to licenses
```

### 🛒 Marketplace Access
**Navigation**: `/accounting-firm-owner/marketplace`
```
Test Areas:
1. Browse marketplace products
2. Purchase additional licenses
3. View product details
4. Compare pricing options
```

---

## 👨‍💼 ACCOUNTANT ROLE TESTING

### **Access Level**: Limited access to assigned clients and licenses

### 🔑 Login Testing
```
1. Select "Accountant" from user type dropdown
2. Enter accountant credentials
3. Expected: Redirect to /accountant/licenses (not dashboard)
```

### 🎫 License Access
**Navigation**: `/accountant/licenses`
**File**: `app/accountant/licenses/page.tsx`

#### Test View Assigned Licenses:
```
API: GET /api/v1/licenses/my-licenses/accountant

Steps:
1. View assigned licenses list
2. Check license details
3. See license expiration dates
4. View associated Fin(Ai)d profiles
5. Check license usage statistics
```

### 👥 Client Access
**Navigation**: `/accountant/clients`
**File**: `app/accountant/clients/page.tsx`

#### Test Assigned Clients:
```
API: GET /api/v1/client-companies (filtered by accountant)

Steps:
1. View assigned clients only
2. Access client details
3. View client financial data
4. Cannot add/delete clients
5. Limited editing permissions
```

### 🤖 AI Agent Usage
**File**: `components/general/accountant-accountantFirmOwner/agent-actions.tsx`

#### Test AI Processing:
```
API Calls:
- POST /api/v1/finaid-agent/predictor/process
- GET /api/v1/finaid-agent/runs
- POST /api/v1/finaid-agent/vector/index

Test Scenarios:
1. Upload client financial data
2. Process transactions with AI
3. View processing results
4. Generate financial insights
5. Export processed data
```

### 📊 Limited Dashboard Access
**File**: `app/accountant/dashboard/page.tsx`

#### Test Dashboard Metrics:
```
Limited scope compared to firm owner:
✅ Active Accountants (view only)
✅ Active Clients (assigned only)
✅ Fin(Ai)ds Deployed (assigned only)  
✅ Active Licenses (personal only)

Steps:
1. View personal metrics
2. See assigned client count
3. Check license utilization
4. Limited analytics access
```

---

## 🔗 INTEGRATION TESTING

### QuickBooks Integration
**Files**: Various components with QB integration
```
API Endpoints:
- GET /api/v1/quickbooks/authorize
- POST /api/v1/quickbooks/vendors/transactions
- POST /api/v1/quickbooks/customers/transactions

Test Scenarios:
1. OAuth connection setup
2. Sync transactions from QuickBooks
3. Import vendor/customer data
4. Export processed data back
5. Handle connection errors
```

### Cross-Role Functionality
```
Test Scenarios:
1. Firm Owner invites Accountant → Accountant accepts
2. Admin manages multiple firms
3. License assignment flow
4. Client assignment between roles
5. Data visibility restrictions
```

---

## 🧪 ERROR HANDLING TESTING

### Authentication Errors
```
Test Cases:
1. Invalid credentials
2. Expired tokens
3. Wrong role selection
4. Account not activated
5. Password reset flow
```

### API Error Handling
```
Test Scenarios:
1. Network connectivity issues
2. Server timeout responses
3. Invalid data submissions
4. Unauthorized access attempts
5. Rate limiting responses
```

### UI Error States
```
Test Areas:
1. Loading state displays
2. Error message notifications
3. Toast notifications
4. Form validation errors
5. Empty state handling
```

---

## ✅ TEST COMPLETION CHECKLIST

### Per Role Testing:
- [ ] **Super Admin**: All firm management functions
- [ ] **Admin**: Limited firm access works correctly  
- [ ] **Firm Owner**: Full firm control verified
- [ ] **Accountant**: Limited access enforced

### Cross-Functional Testing:
- [ ] **Authentication**: All roles login correctly
- [ ] **Authorization**: Access restrictions enforced
- [ ] **License Management**: Full flow working
- [ ] **Client Management**: Role-based access
- [ ] **AI Integration**: Processing functions work
- [ ] **QuickBooks**: Integration functional
- [ ] **Error Handling**: Graceful error management

### Performance Testing:
- [ ] **Dashboard Loading**: Under 3 seconds
- [ ] **API Response Times**: Reasonable performance
- [ ] **Large Data Sets**: Pagination works
- [ ] **Concurrent Users**: Multi-user access

This comprehensive testing guide ensures all functionalities work correctly for each user role and validates the complete application flow.