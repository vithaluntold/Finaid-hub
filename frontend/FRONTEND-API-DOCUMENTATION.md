# Frontend API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Configuration](#configuration)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Component API Integration](#component-api-integration)
6. [Error Handling](#error-handling)
7. [Data Types](#data-types)

---

## Overview

The FinAidHub frontend is built with **Next.js 15.1.0** and uses **React 18+** with TypeScript. It communicates with the backend API using axios for HTTP requests.

**Base URL**: `http://localhost:9003/api/v1`

**Environment**: Development

---

## Configuration

### API Base URL Configuration

Located in: `frontend/assets/constants/constant.js`

```javascript
export const backendBaseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9003";
```

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:9003
```

---

## Authentication

### Authentication Flow

1. User logs in via `/api/v1/auth` endpoint
2. Backend returns JWT token and user data
3. Token stored in `localStorage` with key `accessToken`
4. Token sent in Authorization header for protected routes

### Storage Keys

```typescript
localStorage.setItem("accessToken", token);
localStorage.setItem("userType", userType);
localStorage.setItem("userDetails", JSON.stringify(user));
localStorage.setItem("allCountries", JSON.stringify(countries));
```

### Authorization Header

```typescript
headers: {
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`
}
```

---

## API Endpoints

### 1. Authentication Endpoints

#### Login
```typescript
POST /api/v1/auth

Request Body:
{
  username: string,  // email address
  password: string
}

Response:
{
  data: {
    token: string,
    user: {
      user_type: "super_admin" | "admin" | "accounting_firm_owner" | "accountant",
      email: string,
      name: string,
      // ... other user fields
    }
  },
  message: string
}
```

**Frontend Implementation**:
```typescript
// Location: frontend/components/login-form.tsx
const response = await axios.post(`${backendBaseURL}/api/v1/auth`, {
  username: email,
  password,
});
```

#### Complete Registration / Verify User
```typescript
POST /api/v1/verify

Request Body:
{
  email: string,
  current_password: string,
  new_password: string,
  new_password_confirmation: string
}

Response:
{
  status: "Success" | "Error",
  message: string
}
```

**Frontend Implementation**:
```typescript
// Location: frontend/components/complete-registration-form.tsx
const response = await axios.post(
  `${backendBaseURL}/api/v1/verify`,
  temporaryCredentials
);
```

---

### 2. User Management Endpoints

#### Get User by ID
```typescript
GET /api/v1/users/:id

Headers:
Authorization: Bearer <token>

Response:
{
  success: true,
  data: {
    id: string,
    email: string,
    user_type: string,
    // ... other user fields
  }
}
```

#### Get User Info
```typescript
GET /api/v1/user/get-user-info

Headers:
Authorization: Bearer <token>

Response:
{
  success: true,
  data: {
    user: { /* user data */ }
  }
}
```

---

### 3. Client Management Endpoints

#### Get All Clients
```typescript
GET /api/v1/clients

Headers:
Authorization: Bearer <token>

Response:
{
  data: [
    {
      _id: string,
      name: string,
      company_location: string,
      owner_name: string,
      company_nature: string,
      user_id: string,
      created_at: string
    }
  ]
}
```

**Frontend Implementation**:
```typescript
// Location: frontend/components/admin/clients-table.tsx
const response = await axios.get(`${backendBaseURL}/api/v1/clients`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});
```

#### Get Client by ID
```typescript
GET /api/v1/clients/:clientId

Headers:
Authorization: Bearer <token>

Response:
{
  success: true,
  data: {
    _id: string,
    company_name: string,
    company_owner_name: string,
    // ... other client fields
  }
}
```

---

### 4. Accountant Management Endpoints

#### Get All Accountants
```typescript
GET /api/v1/accountants

Headers:
Authorization: Bearer <token>

Response:
{
  data: [
    {
      _id: string,
      name: string,
      email: string,
      firm_id: string,
      // ... other accountant fields
    }
  ]
}
```

**Frontend Implementation**:
```typescript
// Location: frontend/components/admin/accountant-table.tsx
const response = await axios.get(`${backendBaseURL}/api/v1/accountants`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});
```

---

### 5. FinAid Profile Endpoints

#### Get All FinAid Profiles
```typescript
GET /api/v1/finaid-profiles

Headers:
Authorization: Bearer <token>

Response:
{
  data: [
    {
      _id: string,
      name: string,
      description: string,
      category: string,
      // ... other profile fields
    }
  ]
}
```

**Frontend Implementation**:
```typescript
// Location: frontend/components/admin/finaid-profiles-list.tsx
const response = await axios.get(`${backendBaseURL}/api/v1/finaid-profiles`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});
```

---

### 6. License Management Endpoints

#### Get All Licenses
```typescript
GET /api/v1/licenses

Headers:
Authorization: Bearer <token>

Response:
{
  data: [
    {
      _id: string,
      license_key: string,
      finaid_profile_id: string,
      status: "active" | "inactive",
      // ... other license fields
    }
  ]
}
```

---

### 7. Admin Management Endpoints

#### Get All Admins
```typescript
GET /api/v1/admins

Headers:
Authorization: Bearer <token>

Response:
{
  data: [
    {
      _id: string,
      email: string,
      name: string,
      status: "active" | "invited",
      // ... other admin fields
    }
  ]
}
```

---

### 8. Health Check

#### Server Health
```typescript
GET /health

Response:
{
  success: true,
  message: "Server is healthy and running",
  data: {
    status: "OK",
    uptime: number,
    memory: {
      rss: number,
      heapTotal: number,
      heapUsed: number
    }
  }
}
```

---

## Component API Integration

### Client Overview Component
**Location**: `frontend/components/client-overview.tsx`

**Features**:
- Create Invoice
- Record Payment
- Send Statement
- Send Payment Reminder

**State Management**:
```typescript
const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
const [invoiceForm, setInvoiceForm] = useState({
  description: "",
  amount: "",
  dueDate: "",
});
```

---

### Client Communications Component
**Location**: `frontend/components/client-communications.tsx`

**API Features**:
- Send Email
- Log Phone Call
- Schedule Meeting
- Add Note

**Handler Example**:
```typescript
const handleSendEmail = () => {
  const email: Communication = {
    id: `${clientId}-comm-${Date.now()}`,
    type: "email",
    subject: emailForm.subject,
    content: emailForm.body,
    date: new Date(),
    from: "Current User",
    to: emailForm.to,
    status: "sent",
  };
  setCommunications([email, ...communications]);
  showToast({ title: "Success", description: "Email sent successfully" });
};
```

---

### Client Documents Component
**Location**: `frontend/components/client-documents.tsx`

**API Features**:
- Upload Document
- View Document
- Download Document
- Delete Document

**Upload Handler**:
```typescript
const handleUploadDocument = () => {
  const newDocument: Document = {
    id: `${clientId}-doc-${Date.now()}`,
    name: uploadForm.name,
    type: uploadForm.type,
    size: `${Math.round(uploadForm.file.size / 1024)} KB`,
    uploadDate: new Date(),
    uploadedBy: "Current User",
  };
  setDocuments([newDocument, ...documents]);
};
```

---

### Client Invoices Component
**Location**: `frontend/components/client-invoices.tsx`

**API Features**:
- Create Invoice
- View Invoice
- Download Invoice PDF
- Send Payment Reminder
- Sort Invoices

**Create Invoice Handler**:
```typescript
const handleCreateInvoice = () => {
  const invoice: Invoice = {
    id: newId,
    invoiceNumber: newId,
    date: new Date(),
    dueDate: new Date(newInvoice.dueDate),
    amount: Number(newInvoice.amount),
    paidAmount: 0,
    status: "draft",
    description: newInvoice.description,
  };
  setInvoices([invoice, ...invoices]);
};
```

---

## Error Handling

### Standard Error Handling Pattern

```typescript
try {
  const response = await axios.get(`${backendBaseURL}/api/v1/endpoint`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  
  if (response?.data?.data) {
    // Handle success
    setData(response.data.data);
  }
} catch (error: any) {
  console.error("Error message:", error?.message);
  showToast({
    title: "Error",
    description: error?.response?.data?.message || "An error occurred",
  });
}
```

### Toast Notifications

```typescript
import { useToast } from "@/hooks/use-toast";

const { showToast } = useToast();

// Success
showToast({
  title: "Success",
  description: "Operation completed successfully",
});

// Error
showToast({
  title: "Error",
  description: "Something went wrong",
});
```

---

## Data Types

### User Types
```typescript
type UserType = "super_admin" | "admin" | "accounting_firm_owner" | "accountant";

interface User {
  _id: string;
  email: string;
  name: string;
  user_type: UserType;
  created_at: string;
  updated_at: string;
}
```

### Client Types
```typescript
interface Client {
  _id: string;
  name: string;
  company_location: string;
  owner_name: string;
  company_nature: string;
  user_id: string;
  created_at: string;
}
```

### Invoice Types
```typescript
interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  amount: number;
  paidAmount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  description: string;
}
```

### Document Types
```typescript
interface Document {
  id: string;
  name: string;
  type: "contract" | "invoice" | "receipt" | "statement" | "other";
  size: string;
  uploadDate: Date;
  uploadedBy: string;
}
```

### Communication Types
```typescript
interface Communication {
  id: string;
  type: "email" | "phone" | "meeting" | "note";
  subject: string;
  content: string;
  date: Date;
  from: string;
  to: string;
  status: "sent" | "received" | "scheduled";
}
```

### Transaction Types
```typescript
interface Transaction {
  id: string;
  date: Date;
  description: string;
  type: "invoice" | "payment" | "credit" | "adjustment";
  amount: number;
  status: "completed" | "pending" | "failed";
  reference: string;
}
```

---

## API Request Examples

### Authentication Request
```typescript
// Login
const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${backendBaseURL}/api/v1/auth`, {
      username: email,
      password,
    });
    
    if (response?.data?.data?.token) {
      localStorage.setItem("accessToken", response.data.data.token);
      localStorage.setItem("userDetails", JSON.stringify(response.data.data.user));
      return { success: true, user: response.data.data.user };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
```

### Protected Request with Auth
```typescript
// Get Clients
const getClients = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Not authenticated");
    
    const response = await axios.get(`${backendBaseURL}/api/v1/clients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching clients:", error.message);
    throw error;
  }
};
```

---

## Best Practices

### 1. Always Check Token Before API Calls
```typescript
const token = localStorage.getItem("accessToken");
if (!token) {
  router.push("/");
  return;
}
```

### 2. Handle Loading States
```typescript
const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    // API call
  } finally {
    setIsLoading(false);
  }
};
```

### 3. Validate Form Data Before Submission
```typescript
if (!formData.field || formData.field.trim() === "") {
  showToast({
    title: "Error",
    description: "Field is required",
  });
  return;
}
```

### 4. Use TypeScript Types
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const response: ApiResponse<Client[]> = await axios.get(...);
```

---

## Debugging

### Enable Debug Logs
Add to component:
```typescript
useEffect(() => {
  console.log("Component mounted");
  console.log("Current state:", state);
}, []);
```

### Check Network Requests
Open browser DevTools → Network tab → Filter by "Fetch/XHR"

### Check LocalStorage
```typescript
console.log("Token:", localStorage.getItem("accessToken"));
console.log("User:", JSON.parse(localStorage.getItem("userDetails") || "{}"));
```

---

## Version History

- **v1.0.0** - Initial API documentation
- **Date**: November 9, 2025
- **Frontend Framework**: Next.js 15.1.0
- **React Version**: 18+
- **TypeScript**: Enabled

---

## Support

For issues or questions:
1. Check backend logs
2. Verify token is valid
3. Check network tab for request/response
4. Verify environment variables are set correctly
