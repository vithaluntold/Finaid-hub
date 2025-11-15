# Complete API Endpoints Documentation

## Base Configuration
- **Backend Base URL**: `https://backend.finaidhub.io`
- **API Version**: `/api/v1`
- **Authentication**: Bearer JWT Token in Authorization header
- **Request Format**: JSON
- **Response Format**: JSON

---

## Authentication & Authorization Endpoints

### Public Endpoints (No Auth Required)

#### Authentication
```http
POST /api/v1/auth
Content-Type: application/json
{
  "username": "user@example.com",
  "password": "password123"
}
Response: { "data": { "token": "jwt_token", "user": {...} } }
```

#### Password Reset
```http
POST /api/v1/reset
Content-Type: application/json
{
  "email": "user@example.com"
}
Response: OTP sent to email

PUT /api/v1/reset
Content-Type: application/json
{
  "email": "user@example.com",
  "otp": "123456",
  "password": "newpassword"
}
```

#### Registration & Verification
```http
POST /api/v1/register
POST /api/v1/verify
POST /api/v1/admin/invite
```

#### Fin(Ai)d Profiles (Public)
```http
GET /api/v1/finaid-profiles/filter?finaid_profile_id={id}
POST /api/v1/finaid-profiles
GET /api/v1/finaid-profiles
GET /api/v1/finaid-profiles/{id}
PUT /api/v1/finaid-profiles/{id}
DELETE /api/v1/finaid-profiles/{id}
GET /api/v1/finaid-profiles/{profileId}/users
```

#### Licensing Master
```http
POST /api/v1/licensing-master
GET /api/v1/licensing-master
GET /api/v1/licensing-master/{id}
GET /api/v1/licensing-master/profile-id/{id}
PUT /api/v1/licensing-master/{id}
DELETE /api/v1/licensing-master/{id}
```

#### User Info (Unauth)
```http
GET /api/v1/user/get-user-info
```

---

## Protected Endpoints (Requires Authentication)

### User Management

#### Accounting Firm Owners
```http
POST /api/v1/users/accounting-owner/invite
Authorization: Bearer {token}
{
  "email": "owner@firm.com",
  "first_name": "John",
  "last_name": "Doe"
}

POST /api/v1/users/accounting-owner/verify
PUT /api/v1/users/accounting-owner/complete-profile
GET /api/v1/users/accounting-owner
```

#### Accountants
```http
POST /api/v1/users/accountant/invite
Authorization: Bearer {token}
{
  "email": "accountant@firm.com",
  "first_name": "Jane",
  "last_name": "Smith"
}

GET /api/v1/users/accountant/invited
POST /api/v1/users/accountant/accept-invite
POST /api/v1/users/accountant/assign-license
POST /api/v1/users/accountant/remove-license
```

#### General User Operations
```http
GET /api/v1/users/profile
GET /api/v1/users
GET /api/v1/users/{id}
POST /api/v1/users/{id}
DELETE /api/v1/users/{id}
PUT /api/v1/users/{id}/update-password
PUT /api/v1/users/profile
POST /api/v1/users/resend-invite/{id}
```

#### Admin Users
```http
GET /api/v1/admins/users
GET /api/v1/admins/users/by-superadmin
PUT /api/v1/admins/users/{id}
```

---

### License Management

```http
POST /api/v1/licenses/purchase
Authorization: Bearer {token}
{
  "finaid_profile_id": "profile_id",
  "quantity": 5,
  "payment_details": {...}
}

GET /api/v1/licenses/my-assignments
GET /api/v1/licenses/my-licenses
GET /api/v1/licenses/my-licenses/accountant
POST /api/v1/licenses/assign
POST /api/v1/licenses/revoke/{license_key}
PUT /api/v1/licenses/edit/{license_key}
DELETE /api/v1/licenses/delete/{finaid_license_id}
PATCH /api/v1/licenses/update-status/{finaid_payment_license_id}
GET /api/v1/licenses/my-license
GET /api/v1/licenses/assigned-to/{user_id}
```

---

### Accounting Firm Management

```http
POST /api/v1/accounting-firm/create
Authorization: Bearer {token}
{
  "name": "ABC Accounting Firm",
  "address": "123 Main St",
  "contact_email": "contact@abc.com"
}

POST /api/v1/accounting-firm/{firm_id}/attach-owner
POST /api/v1/accounting-firm/{firm_id}/attach-user
GET /api/v1/accounting-firm/{firm_id}
```

---

### QuickBooks Integration

#### Authentication & Setup
```http
GET /api/v1/quickbooks/authorize
Authorization: Bearer {token}
Query Params: ?client_id={id}&state={state}&code={code}&realmId={realm}
```

#### Data Fetching
```http
POST /api/v1/quickbooks/vendors/transactions
Authorization: Bearer {token}
{
  "client_company_id": "company_id",
  "from": "2024-01-01",
  "to": "2024-12-31"
}

POST /api/v1/quickbooks/customers/transactions
POST /api/v1/quickbooks/vendors
POST /api/v1/quickbooks/customers
POST /api/v1/quickbooks/bills
POST /api/v1/quickbooks/invoices
POST /api/v1/quickbooks/accounts/bank
POST /api/v1/quickbooks/accounts/payment
POST /api/v1/quickbooks/accounts/income
POST /api/v1/quickbooks/accounts/expense
```

#### Entity Management
```http
POST /api/v1/quickbooks/vendor/create
Authorization: Bearer {token}
{
  "client_company_id": "company_id",
  "display_name": "New Vendor Name"
}

POST /api/v1/quickbooks/customer/create
POST /api/v1/quickbooks/transaction/post
POST /api/v1/quickbooks/transaction/delete
```

#### Unified QuickBooks Data
```http
POST /api/v1/quickbooks/unified/payees
POST /api/v1/quickbooks/unified/categories
POST /api/v1/quickbooks/unified/bills
POST /api/v1/quickbooks/unified/invoices
```

---

### Client Management

#### Clients
```http
POST /api/v1/clients
Authorization: Bearer {token}
{
  "name": "Client Company",
  "email": "client@company.com",
  "phone": "+1234567890"
}

GET /api/v1/clients
PUT /api/v1/clients/{id}
GET /api/v1/clients/by-accountant/{user_id}
GET /api/v1/clients/{client_id}/auth-details
```

#### Client Companies
```http
GET /api/v1/client-companies
Authorization: Bearer {token}

POST /api/v1/client-companies
{
  "company_name": "ABC Corp",
  "industry": "Technology",
  "size": "50-100"
}

GET /api/v1/client-companies/{id}
PUT /api/v1/client-companies/{id}
DELETE /api/v1/client-companies/{id}
```

---

### AI Agent System (Fin(Ai)d Agent)

#### Testing & Health
```http
GET /api/v1/finaid-agent/test
Authorization: Bearer {token}
```

#### Vector Data Management
```http
POST /api/v1/finaid-agent/vector/index
Authorization: Bearer {token}
{
  "client_company_id": "company_id",
  "data": {...}
}

GET /api/v1/finaid-agent/vector/get
GET /api/v1/finaid-agent/vector/clear
GET /api/v1/finaid-agent/vector/last-sync
```

#### AI Processing
```http
GET /api/v1/finaid-agent/predictor/configs
POST /api/v1/finaid-agent/predictor/test
POST /api/v1/finaid-agent/predictor/process
Authorization: Bearer {token}
{
  "client_company_id": "company_id",
  "parameters": {...}
}

POST /api/v1/finaid-agent/predictor/retry
GET /api/v1/finaid-agent/langsmith/{runId}
```

#### Run Management
```http
GET /api/v1/finaid-agent/runs
GET /api/v1/finaid-agent/runs/{run_id}
GET /api/v1/finaid-agent/runs/company/{client_company_id}
GET /api/v1/finaid-agent/runs/data/{run_id}
```

#### QuickBooks Integration
```http
POST /api/v1/finaid-agent/post-agent/quickbooks
Authorization: Bearer {token}
{
  "run_id": "run_id",
  "action": "post_transactions"
}
```

---

### Social Authentication (OAuth)

```http
GET /api/v1/social/{provider}/redirect
GET /api/v1/social/{provider}/authorize
GET /api/v1/{provider}/redirect
GET /api/v1/quickbooks/authorize
```

---

## Frontend API Usage Examples

### Login Authentication
```typescript
const response = await axios.post(`${backendBaseURL}/api/v1/auth`, {
  username: email,
  password: password
});

if (response?.data?.data?.token) {
  localStorage.setItem("accessToken", response.data.data.token);
  localStorage.setItem("userType", userType);
}
```

### Fetch User Data
```typescript
const response = await axios.get(
  `${backendBaseURL}/api/v1/users/accountant/invited`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  }
);
```

### Fetch Licenses
```typescript
const response = await axios.get(
  `${backendBaseURL}/api/v1/licenses/my-licenses/accountant`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  }
);
```

### Fetch Client Companies
```typescript
const response = await axios.get(
  `${backendBaseURL}/api/v1/client-companies`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  }
);
```

### Create Fin(Ai)d Profile
```typescript
const response = await axios.post(
  `${backendBaseURL}/api/v1/finaid-profiles`,
  profileData,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  }
);
```

---

## Error Handling

### Standard Error Responses
```json
{
  "error": "Error message",
  "message": "Detailed error description",
  "status": false
}
```

### Frontend Error Handling Pattern
```typescript
try {
  const response = await axios.get(endpoint, config);
  // Handle success
} catch (error) {
  showToast({
    title: "Error",
    description: error?.response?.data?.message || "An error occurred"
  });
}
```

---

## Common Request Headers

```http
Authorization: Bearer {jwt_token}
Content-Type: application/json
Accept: application/json
```

---

## Rate Limiting & Security

- API requests are protected by JWT token validation
- Rate limiting may be applied (implementation-dependent)
- CORS is configured for frontend domain
- Middleware validates tokens and user permissions

---

This documentation covers all the major API endpoints used by the Fin(Ai)d Hub platform, including authentication, user management, license management, QuickBooks integration, AI agent functionality, and client management systems.