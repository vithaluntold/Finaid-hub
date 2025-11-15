# Backend API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Server Configuration](#server-configuration)
3. [Security](#security)
4. [Authentication](#authentication)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Error Handling](#error-handling)
8. [Middleware](#middleware)

---

## Overview

The FinAidHub backend is built with **Node.js** and **Express.js**, providing RESTful API endpoints for the financial aid management system.

**Server File**: `simple-server.js`

**Server Port**: 9003

**API Base Path**: `/api/v1`

**CORS Origin**: `http://localhost:3000`

---

## Server Configuration

### Environment Variables

Location: `.env` file in root directory

```env
# Environment Configuration
NODE_ENV=development
PORT=9003

# Frontend Configuration
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=finaid-jwt-secret-key-change-in-production-2024-secure
JWT_EXPIRES_IN=24h

# Database Configuration (MongoDB)
MONGODB_URI=mongodb://localhost:27017/finaid_hub

# Email Configuration
MAIL_FROM=noreply@finaidhub.io
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Server Startup

```javascript
const PORT = process.env.PORT || 9003;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});
```

---

## Security

### Security Middleware

#### Helmet.js
Provides security headers:
```javascript
app.use(helmet());
```

**Headers Set**:
- Content-Security-Policy
- Cross-Origin-Opener-Policy
- Cross-Origin-Resource-Policy
- X-DNS-Prefetch-Control
- X-Frame-Options
- X-Content-Type-Options

#### Rate Limiting
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

#### CORS Configuration
```javascript
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Authentication

### JWT Token System

#### Token Generation
```javascript
const jwt = require('jsonwebtoken');

const generateToken = (userId, userType) => {
  return jwt.sign(
    { userId, userType },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};
```

#### Token Verification Middleware
```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
};
```

### Password Hashing
```javascript
const bcryptjs = require('bcryptjs');

// Hash password
const hashedPassword = await bcryptjs.hash(password, 10);

// Compare password
const isValid = await bcryptjs.compare(password, hashedPassword);
```

---

## API Endpoints

### 1. Health Check

#### GET /health

**Description**: Check server health status

**Authentication**: Not required

**Request**:
```http
GET /health HTTP/1.1
Host: localhost:9003
```

**Response**:
```json
{
  "success": true,
  "message": "Server is healthy and running",
  "data": {
    "status": "OK",
    "uptime": 159.6614019,
    "memory": {
      "rss": 50204672,
      "heapTotal": 14270464,
      "heapUsed": 12597768,
      "external": 2310767,
      "arrayBuffers": 1023126
    },
    "timestamp": "2025-11-09T10:30:00.000Z"
  }
}
```

---

### 2. Authentication Endpoints

#### POST /api/v1/auth

**Description**: User login

**Authentication**: Not required

**Request**:
```http
POST /api/v1/auth HTTP/1.1
Host: localhost:9003
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response** (Success):
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "user123",
      "email": "user@example.com",
      "user_type": "admin",
      "name": "John Doe",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  },
  "message": "Login successful"
}
```

**Response** (Error):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Status Codes**:
- 200: Success
- 401: Invalid credentials
- 400: Missing required fields

---

#### POST /api/v1/verify

**Description**: Complete user registration / change password

**Authentication**: Not required

**Request**:
```http
POST /api/v1/verify HTTP/1.1
Host: localhost:9003
Content-Type: application/json

{
  "email": "user@example.com",
  "current_password": "temppass123",
  "new_password": "newpass123",
  "new_password_confirmation": "newpass123"
}
```

**Response**:
```json
{
  "status": "Success",
  "message": "Password updated successfully"
}
```

**Validation**:
- Email must be valid
- Current password must match
- New passwords must match
- New password minimum 8 characters

---

### 3. User Management Endpoints

#### GET /api/v1/users/:id

**Description**: Get user by ID

**Authentication**: Required (Bearer token)

**Request**:
```http
GET /api/v1/users/user123 HTTP/1.1
Host: localhost:9003
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "user123",
    "email": "user@example.com",
    "user_type": "admin",
    "name": "John Doe",
    "phone": "+1234567890",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-11-09T00:00:00.000Z"
  }
}
```

**Status Codes**:
- 200: Success
- 401: Unauthorized
- 404: User not found

---

#### GET /api/v1/user/get-user-info

**Description**: Get current authenticated user info

**Authentication**: Required

**Request**:
```http
GET /api/v1/user/get-user-info HTTP/1.1
Host: localhost:9003
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user123",
      "email": "user@example.com",
      "user_type": "admin",
      "name": "John Doe"
    }
  }
}
```

---

### 4. Client Management Endpoints

#### GET /api/v1/clients

**Description**: Get all clients

**Authentication**: Required

**Query Parameters**:
- `status` (optional): Filter by status (active, inactive)
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page

**Request**:
```http
GET /api/v1/clients?status=active&page=1&limit=10 HTTP/1.1
Host: localhost:9003
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "client123",
      "name": "Acme Corporation",
      "company_location": "New York, NY",
      "owner_name": "John Smith",
      "company_nature": "Technology",
      "user_id": "user456",
      "created_at": "2025-01-15T00:00:00.000Z",
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

#### GET /api/v1/clients/:clientId

**Description**: Get client by ID

**Authentication**: Required

**Request**:
```http
GET /api/v1/clients/client123 HTTP/1.1
Host: localhost:9003
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "client123",
    "company_name": "Acme Corporation",
    "company_id": "ACM001",
    "company_owner_name": "John Smith",
    "company_location": "New York, NY",
    "company_nature": "Technology",
    "client_id": "CLT001",
    "accountant_id": "acc123",
    "user_id": "user456",
    "created_at": "2025-01-15T00:00:00.000Z",
    "updated_at": "2025-11-09T00:00:00.000Z"
  }
}
```

---

#### POST /api/v1/clients

**Description**: Create new client

**Authentication**: Required

**Request**:
```http
POST /api/v1/clients HTTP/1.1
Host: localhost:9003
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "company_name": "New Company Inc",
  "company_owner_name": "Jane Doe",
  "company_location": "Los Angeles, CA",
  "company_nature": "Finance",
  "email": "jane@newcompany.com",
  "phone": "+1234567890"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "_id": "client789",
    "company_name": "New Company Inc",
    "client_id": "CLT050",
    "created_at": "2025-11-09T10:30:00.000Z"
  }
}
```

**Validation**:
- company_name: Required, min 2 characters
- company_owner_name: Required
- email: Required, valid email format
- phone: Optional, valid phone format

---

### 5. Accountant Management Endpoints

#### GET /api/v1/accountants

**Description**: Get all accountants

**Authentication**: Required

**Request**:
```http
GET /api/v1/accountants HTTP/1.1
Host: localhost:9003
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "acc123",
      "name": "Sarah Johnson",
      "email": "sarah@accounting.com",
      "firm_id": "firm001",
      "user_type": "accountant",
      "status": "active",
      "created_at": "2025-01-10T00:00:00.000Z"
    }
  ]
}
```

---

#### POST /api/v1/accountants

**Description**: Create new accountant

**Authentication**: Required (Admin only)

**Request**:
```http
POST /api/v1/accountants HTTP/1.1
Host: localhost:9003
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Mike Chen",
  "email": "mike@accounting.com",
  "firm_id": "firm001",
  "password": "temporaryPassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Accountant created successfully",
  "data": {
    "_id": "acc456",
    "email": "mike@accounting.com",
    "status": "invited"
  }
}
```

---

### 6. FinAid Profile Endpoints

#### GET /api/v1/finaid-profiles

**Description**: Get all FinAid profiles

**Authentication**: Required

**Request**:
```http
GET /api/v1/finaid-profiles HTTP/1.1
Host: localhost:9003
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "finaid123",
      "name": "Invoice Management AI",
      "description": "Automated invoice processing and management",
      "category": "accounting",
      "version": "1.0.0",
      "pricing": {
        "monthly": 99.99,
        "annual": 999.99
      },
      "features": [
        "Automatic invoice generation",
        "Payment tracking",
        "Reminder automation"
      ],
      "status": "active",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### POST /api/v1/finaid-profiles

**Description**: Create new FinAid profile

**Authentication**: Required (Admin only)

**Request**:
```http
POST /api/v1/finaid-profiles HTTP/1.1
Host: localhost:9003
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Expense Tracker AI",
  "description": "AI-powered expense tracking",
  "category": "expense_management",
  "pricing": {
    "monthly": 79.99,
    "annual": 799.99
  },
  "features": ["Receipt scanning", "Category detection"]
}
```

**Response**:
```json
{
  "success": true,
  "message": "FinAid profile created successfully",
  "data": {
    "_id": "finaid456",
    "name": "Expense Tracker AI",
    "status": "active"
  }
}
```

---

### 7. License Management Endpoints

#### GET /api/v1/licenses

**Description**: Get all licenses

**Authentication**: Required

**Query Parameters**:
- `status`: active | inactive | expired
- `user_id`: Filter by user
- `finaid_id`: Filter by FinAid profile

**Request**:
```http
GET /api/v1/licenses?status=active HTTP/1.1
Host: localhost:9003
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "lic123",
      "license_key": "FINAID-XXXX-XXXX-XXXX",
      "finaid_profile_id": "finaid123",
      "user_id": "user456",
      "status": "active",
      "valid_from": "2025-01-01T00:00:00.000Z",
      "valid_until": "2026-01-01T00:00:00.000Z",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### POST /api/v1/licenses

**Description**: Create new license

**Authentication**: Required (Admin only)

**Request**:
```http
POST /api/v1/licenses HTTP/1.1
Host: localhost:9003
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "finaid_profile_id": "finaid123",
  "user_id": "user456",
  "duration_months": 12
}
```

**Response**:
```json
{
  "success": true,
  "message": "License created successfully",
  "data": {
    "_id": "lic789",
    "license_key": "FINAID-ABCD-EFGH-IJKL",
    "status": "active",
    "valid_until": "2026-11-09T00:00:00.000Z"
  }
}
```

---

### 8. Admin Management Endpoints

#### GET /api/v1/admins

**Description**: Get all admins

**Authentication**: Required (Super Admin only)

**Request**:
```http
GET /api/v1/admins HTTP/1.1
Host: localhost:9003
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "admin123",
      "email": "admin@finaidhub.com",
      "name": "Admin User",
      "user_type": "admin",
      "status": "active",
      "permissions": ["users", "clients", "finaids"],
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### POST /api/v1/admins/invite

**Description**: Invite new admin

**Authentication**: Required (Super Admin only)

**Request**:
```http
POST /api/v1/admins/invite HTTP/1.1
Host: localhost:9003
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "email": "newadmin@finaidhub.com",
  "name": "New Admin",
  "permissions": ["users", "clients"]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Admin invitation sent successfully",
  "data": {
    "_id": "admin456",
    "email": "newadmin@finaidhub.com",
    "status": "invited",
    "invitation_token": "inv_abc123xyz",
    "expires_at": "2025-11-16T00:00:00.000Z"
  }
}
```

---

## Database Schema

### In-Memory Data Storage

The backend uses in-memory Maps for data storage:

```javascript
const USERS_DB = new Map();
const CLIENTS_DB = new Map();
const ACCOUNTANTS_DB = new Map();
const FINAIDS_DB = new Map();
const LICENSES_DB = new Map();
const ADMINS_DB = new Map();
```

### User Schema
```javascript
{
  _id: string,
  email: string,
  password: string, // hashed with bcryptjs
  user_type: "super_admin" | "admin" | "accounting_firm_owner" | "accountant",
  name: string,
  phone: string,
  status: "active" | "inactive" | "invited",
  created_at: Date,
  updated_at: Date,
  last_login: Date
}
```

### Client Schema
```javascript
{
  _id: string,
  company_name: string,
  company_id: string,
  company_owner_name: string,
  company_location: string,
  company_nature: string,
  client_id: string,
  accountant_id: string,
  user_id: string,
  email: string,
  phone: string,
  status: "active" | "inactive",
  created_at: Date,
  updated_at: Date
}
```

### FinAid Profile Schema
```javascript
{
  _id: string,
  name: string,
  description: string,
  category: string,
  version: string,
  pricing: {
    monthly: number,
    annual: number
  },
  features: string[],
  status: "active" | "inactive",
  created_at: Date,
  updated_at: Date
}
```

### License Schema
```javascript
{
  _id: string,
  license_key: string,
  finaid_profile_id: string,
  user_id: string,
  status: "active" | "inactive" | "expired",
  valid_from: Date,
  valid_until: Date,
  created_at: Date,
  updated_at: Date
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `AUTH_REQUIRED` | Authentication required | 401 |
| `INVALID_TOKEN` | Invalid or expired token | 403 |
| `INVALID_CREDENTIALS` | Wrong username/password | 401 |
| `NOT_FOUND` | Resource not found | 404 |
| `VALIDATION_ERROR` | Input validation failed | 400 |
| `DUPLICATE_ENTRY` | Resource already exists | 409 |
| `SERVER_ERROR` | Internal server error | 500 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |

### Example Error Responses

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Access token required"
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "User not found",
  "error": {
    "code": "NOT_FOUND",
    "resource": "user",
    "id": "user123"
  }
}
```

**400 Validation Error**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

---

## Middleware

### 1. Authentication Middleware

```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
};
```

### 2. Role-Based Access Control

```javascript
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }
    
    next();
  };
};

// Usage
app.get('/api/v1/admins', 
  authenticateToken, 
  requireRole('super_admin'), 
  (req, res) => {
    // Handle request
  }
);
```

### 3. Request Validation Middleware

```javascript
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(d => ({
          field: d.path[0],
          message: d.message
        }))
      });
    }
    
    next();
  };
};
```

### 4. Error Handler Middleware

```javascript
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

### 5. Request Logger Middleware

```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

---

## API Testing

### Using cURL

**Health Check**:
```bash
curl http://localhost:9003/health
```

**Login**:
```bash
curl -X POST http://localhost:9003/api/v1/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@example.com","password":"password123"}'
```

**Get Clients (with auth)**:
```bash
curl http://localhost:9003/api/v1/clients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using PowerShell

**Health Check**:
```powershell
Invoke-WebRequest -Uri "http://localhost:9003/health" -Method GET
```

**Login**:
```powershell
$body = @{
    username = "admin@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:9003/api/v1/auth" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

**Get Clients**:
```powershell
$headers = @{
    Authorization = "Bearer YOUR_TOKEN_HERE"
}

Invoke-WebRequest -Uri "http://localhost:9003/api/v1/clients" `
  -Method GET `
  -Headers $headers
```

---

## Default Users

The server initializes with default users:

```javascript
// Super Admin
{
  email: "superadmin@finaidhub.com",
  password: "admin123",
  user_type: "super_admin"
}

// Admin
{
  email: "admin@finaidhub.com",
  password: "admin123",
  user_type: "admin"
}

// Accounting Firm Owner
{
  email: "owner@accounting.com",
  password: "owner123",
  user_type: "accounting_firm_owner"
}

// Accountant
{
  email: "accountant@accounting.com",
  password: "accountant123",
  user_type: "accountant"
}
```

---

## Performance Considerations

### Response Times
- Health check: < 10ms
- Authentication: < 100ms
- Data queries: < 200ms
- Large data sets: < 500ms

### Optimization Tips
1. Use pagination for large datasets
2. Implement caching for frequently accessed data
3. Use proper indexes when using a real database
4. Minimize middleware chain length
5. Use compression for large responses

---

## Deployment

### Production Configuration

```env
NODE_ENV=production
PORT=443
CORS_ORIGIN=https://your-domain.com
JWT_SECRET=use-a-strong-random-secret
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

### Security Checklist
- [ ] Change JWT_SECRET to strong random value
- [ ] Use HTTPS in production
- [ ] Enable rate limiting
- [ ] Set up proper CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable request logging
- [ ] Set up error monitoring
- [ ] Use real database instead of in-memory storage
- [ ] Implement request validation
- [ ] Set up backup strategy

---

## Version History

- **v1.0.0** - Initial backend API
- **Date**: November 9, 2025
- **Node.js Version**: >=18.0.0
- **Express Version**: Latest
- **Port**: 9003

---

## Support & Troubleshooting

### Common Issues

**Server won't start**:
- Check if port 9003 is already in use
- Verify .env file exists and is properly configured
- Check Node.js version (>=18.0.0 required)

**Authentication fails**:
- Verify JWT_SECRET matches between requests
- Check token hasn't expired (24h default)
- Ensure Authorization header format is correct

**CORS errors**:
- Verify CORS_ORIGIN matches frontend URL
- Check frontend is sending credentials
- Ensure proper headers are allowed

### Logs

Server logs show:
- Server startup information
- Request paths and methods
- Error messages and stack traces
- Authentication attempts

---

## Future Enhancements

- [ ] Implement real MongoDB database
- [ ] Add WebSocket support for real-time updates
- [ ] Implement file upload handling
- [ ] Add email notification system
- [ ] Create API versioning strategy
- [ ] Add GraphQL endpoint
- [ ] Implement API rate limiting per user
- [ ] Add audit logging
- [ ] Create automated API documentation (Swagger)
- [ ] Implement data export functionality
