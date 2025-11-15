# Exact API Endpoints - Authentication & User Management

## Base URL
```
https://backend.finaidhub.io/api/v1
```

---

## 🔐 AUTHENTICATION ENDPOINTS

### Public Authentication (No Auth Required)

#### User Login
```
POST /api/v1/auth
```

#### Admin Invitation/Signup
```
POST /api/v1/admin/invite
```

#### Account Verification
```
POST /api/v1/verify
```

#### Password Reset Flow
```
POST /api/v1/reset          # Send reset OTP
PUT  /api/v1/reset          # Reset password with OTP
```

#### User Registration
```
POST /api/v1/register
```

#### Social Authentication
```
GET /api/v1/social/{provider}/redirect
GET /api/v1/social/{provider}/authorize
```

---

## 👥 USER MANAGEMENT ENDPOINTS (Protected - Requires Auth Token)

### General User Operations
```
POST /api/v1/users/                     # Create user
GET  /api/v1/users/profile              # Get my profile
GET  /api/v1/users/                     # List all users
GET  /api/v1/users/{id}                 # Get specific user
POST /api/v1/users/{id}                 # Update user
DELETE /api/v1/users/{id}               # Delete user
PUT  /api/v1/users/{id}/update-password # Update user password
PUT  /api/v1/users/profile              # Update my profile
POST /api/v1/users/resend-invite/{id}   # Resend invitation
```

### Accounting Firm Owners
```
POST /api/v1/users/accounting-owner/invite           # Invite firm owner
POST /api/v1/users/accounting-owner/verify           # Verify firm owner account
PUT  /api/v1/users/accounting-owner/complete-profile # Complete owner profile
GET  /api/v1/users/accounting-owner/                 # List all firm owners
```

### Accountants
```
POST /api/v1/users/accountant/invite         # Invite accountant
GET  /api/v1/users/accountant/invited        # List invited accountants
POST /api/v1/users/accountant/accept-invite  # Accept invitation
POST /api/v1/users/accountant/assign-license # Assign license to accountant
POST /api/v1/users/accountant/remove-license # Remove license from accountant
```

### Admin Users
```
GET /api/v1/admins/users/                    # Get admin users
GET /api/v1/admins/users/by-superadmin      # Get admins by super admin
PUT /api/v1/admins/users/{id}               # Update admin profile
```

### User Relationships
```
GET /api/v1/user/attached-users-by-parent   # Get attached users by parent ID
GET /api/v1/user/get-user-info              # Get user info (unauth)
```

---

## 🏢 ACCOUNTING FIRM MANAGEMENT

```
POST /api/v1/accounting-firm/create                  # Create accounting firm
POST /api/v1/accounting-firm/{firm_id}/attach-owner  # Attach owner to firm
POST /api/v1/accounting-firm/{firm_id}/attach-user   # Attach user to firm
GET  /api/v1/accounting-firm/{firm_id}              # Get firm details
```

---

## 🎫 LICENSE MANAGEMENT

```
POST   /api/v1/licenses/purchase                                  # Purchase license
GET    /api/v1/licenses/my-assignments                           # My license assignments
GET    /api/v1/licenses/my-licenses                              # My licenses
GET    /api/v1/licenses/my-licenses/accountant                   # Accountant licenses
POST   /api/v1/licenses/assign                                   # Assign license
POST   /api/v1/licenses/revoke/{license_key}                     # Revoke license
PUT    /api/v1/licenses/edit/{license_key}                       # Edit license
DELETE /api/v1/licenses/delete/{finaid_license_id}               # Delete license
PATCH  /api/v1/licenses/update-status/{finaid_payment_license_id} # Update payment status
GET    /api/v1/licenses/my-license                               # Get my license
GET    /api/v1/licenses/assigned-to/{user_id}                    # Licenses by accountant
```

---

## 🤖 FIN(AI)D PROFILES

```
GET    /api/v1/finaid-profiles/filter                # Filter profiles
POST   /api/v1/finaid-profiles/                      # Create profile
GET    /api/v1/finaid-profiles/                      # List all profiles
GET    /api/v1/finaid-profiles/{id}                  # Get specific profile
PUT    /api/v1/finaid-profiles/{id}                  # Update profile
DELETE /api/v1/finaid-profiles/{id}                  # Delete profile
GET    /api/v1/finaid-profiles/{profileId}/users     # Get users by profile
```

---

## ⚙️ LICENSING MASTER

```
POST   /api/v1/licensing-master/              # Create licensing master
GET    /api/v1/licensing-master/              # List licensing masters
GET    /api/v1/licensing-master/{id}          # Get specific licensing master
GET    /api/v1/licensing-master/profile-id/{id} # Get by profile ID
PUT    /api/v1/licensing-master/{id}          # Update licensing master
DELETE /api/v1/licensing-master/{id}          # Delete licensing master
```

---

## 📱 FRONTEND USAGE EXAMPLES

### Login Request
```typescript
const response = await axios.post(
  'https://backend.finaidhub.io/api/v1/auth',
  {
    username: 'user@example.com',
    password: 'password123'
  }
);
```

### Get User Profile (Authenticated)
```typescript
const response = await axios.get(
  'https://backend.finaidhub.io/api/v1/users/profile',
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
  }
);
```

### Invite Accountant
```typescript
const response = await axios.post(
  'https://backend.finaidhub.io/api/v1/users/accountant/invite',
  {
    email: 'accountant@firm.com',
    first_name: 'John',
    last_name: 'Doe'
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
  }
);
```

### Get My Licenses
```typescript
const response = await axios.get(
  'https://backend.finaidhub.io/api/v1/licenses/my-licenses',
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
  }
);
```

---

## 🔒 Authentication Required
All endpoints under the protected group require:
```
Authorization: Bearer {jwt_token}
```

## 🌐 Social OAuth Endpoints
```
GET /api/v1/{provider}/redirect           # OAuth redirect (protected)
GET /api/v1/quickbooks/authorize          # QuickBooks OAuth (protected)
```

---

**Note**: All protected endpoints require a valid JWT token in the Authorization header. The token is obtained from the `/auth` endpoint after successful login.