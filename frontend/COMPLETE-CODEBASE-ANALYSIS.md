# Complete Codebase Analysis: Fin(Ai)d Hub

## Project Architecture Overview

This is a **full-stack financial advisory platform** with separated frontend and backend codebases:
- **Frontend**: Next.js 15 React application (TypeScript)
- **Backend**: Laravel 11 PHP API (separate repository)

---

## Frontend Architecture (Current Repository)

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS with custom theme
- **UI Components**: Radix UI primitives + custom components
- **State Management**: React hooks + Context API
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Package Manager**: pnpm

### Project Structure
```
├── app/                     # Next.js App Router pages
│   ├── [role]/dashboard/   # Role-based dashboards
│   ├── complete-registration/
│   ├── forget-password/
│   └── marketplace/
├── components/             # React components
│   ├── ui/                # Radix UI + custom components
│   ├── [role]/           # Role-specific components
│   └── general/          # Shared components
├── hooks/                 # Custom React hooks
├── lib/                  # Utilities
├── assets/               # Constants & helper functions
└── public/              # Static assets
```

### Authentication & Authorization
- **JWT Token**: Stored in localStorage as `accessToken`
- **Role-based Access**: 4 user types (super_admin, admin, accounting_firm_owner, accountant)
- **Route Protection**: Implemented via `useEffect` in dashboard layouts
- **Login Flow**: Multi-role login form with role validation

### User Roles & Permissions

#### Super Admin
- **Full Platform Control**: Manage all accounting firms, admins, marketplace
- **Analytics**: Platform-wide metrics and performance data
- **Navigation**: Dashboard, Marketplace, Accounting Firms, Admins

#### Admin
- **Firm Management**: Manage accounting firms within assigned scope
- **Limited Analytics**: Firm-level metrics
- **Navigation**: Dashboard, Marketplace, Accounting Firms

#### Accounting Firm Owner
- **Firm Operations**: Manage accountants, clients, licenses
- **Team Management**: Invite/manage accountants
- **Navigation**: Dashboard, Accountants, Clients, Licenses, Marketplace

#### Accountant
- **Client Work**: Access assigned clients and licenses
- **Limited Access**: View-only for most features
- **Navigation**: Licenses, Clients (subset of firm owner features)

### Key Frontend Features

#### Dashboard System
- **Role-specific Dashboards**: Each role has tailored dashboard with relevant metrics
- **Real-time Data**: Fetched via API calls with loading states
- **Metrics Cards**: Active users, licenses, deployments, revenue
- **Charts & Graphs**: Using Recharts library for data visualization

#### Component Architecture
- **Shared UI Components**: 40+ reusable components in `/components/ui/`
- **Role-based Components**: Separate component folders per user role
- **Layout System**: Centralized `DashboardLayout` with role-aware navigation
- **Theme System**: Dark/light mode with CSS variables

#### State Management Patterns
- **Local State**: useState for component-specific data
- **Global State**: Context providers (Theme, Toast)
- **Server State**: Direct API calls with local caching
- **Form State**: React Hook Form with Zod schema validation

---

## Backend Architecture (Laravel API)

### Technology Stack
- **Framework**: Laravel 11 PHP
- **Authentication**: Laravel Sanctum/Passport API tokens
- **Database**: MySQL/PostgreSQL (presumed)
- **Architecture**: RESTful API with resource controllers

### API Structure Overview

#### Authentication Endpoints (`/api/v1/auth`)
```php
POST /auth                    # Login
POST /admin/invite           # Invite admin
POST /verify                 # Verify account
POST /reset                  # Forgot password
PUT  /reset                  # Reset password with OTP
POST /register               # Register new user
```

#### User Management (`/api/v1/users`)
```php
# Accounting Firm Owners
POST /accounting-owner/invite
POST /accounting-owner/verify
PUT  /accounting-owner/complete-profile
GET  /accounting-owner/       # List all

# Accountants
POST /accountant/invite
GET  /accountant/invited      # List invited
POST /accountant/accept-invite
POST /accountant/assign-license
POST /accountant/remove-license

# General User Operations
GET  /profile                 # Get user profile
GET  /                        # List users
GET  /{id}                    # Get specific user
POST /{id}                    # Update user
DELETE /{id}                  # Delete user
PUT  /{id}/update-password    # Change password
```

#### License Management (`/api/v1/licenses`)
```php
POST /purchase               # Purchase license
GET  /my-assignments        # User's license assignments
GET  /my-licenses          # User's licenses
GET  /my-licenses/accountant # Accountant-specific licenses
POST /assign               # Assign license to user
POST /revoke/{license_key} # Revoke license
PUT  /edit/{license_key}   # Edit license
DELETE /delete/{finaid_license_id}
```

#### Fin(Ai)d Profiles (`/api/v1/finaid-profiles`)
```php
GET  /filter                # Filter profiles
POST /                     # Create profile
GET  /                     # List all profiles
GET  /{id}                 # Get specific profile
PUT  /{id}                 # Update profile
DELETE /{id}               # Delete profile
GET  /{profileId}/users    # Users by profile
```

#### QuickBooks Integration (`/api/v1/quickbooks`)
```php
GET  /authorize            # OAuth authorization
POST /vendors/transactions # Fetch vendor transactions
POST /customers/transactions # Fetch customer transactions
POST /vendors              # Fetch vendors
POST /customers            # Fetch customers
POST /bills                # Fetch bills
POST /invoices             # Fetch invoices
POST /accounts/bank        # Get bank accounts
POST /vendor/create        # Create vendor
POST /customer/create      # Create customer
POST /transaction/post     # Post transaction
POST /transaction/delete   # Delete transaction
```

#### AI Agent System (`/api/v1/finaid-agent`)
```php
GET  /test                 # Test endpoint
POST /vector/index         # Index data for vector search
GET  /vector/get          # Get vector data
GET  /vector/clear        # Clear vector data
POST /predictor/process   # AI processing
POST /predictor/test      # Test AI processing
POST /predictor/retry     # Retry processing
GET  /runs/               # List all runs
GET  /runs/{run_id}       # Get specific run
```

#### Client Management (`/api/v1/clients`, `/api/v1/client-companies`)
```php
POST /                     # Add client
GET  /                     # Get all clients
PUT  /{id}                 # Update client
GET  /by-accountant/{user_id} # Clients by accountant
GET  /{client_id}/auth-details # Client auth details
```

### Backend Security & Middleware
- **API Token Authentication**: Custom `CheckAPIToken` middleware
- **Session Management**: Laravel session handling for OAuth flows
- **CORS Configuration**: Cross-origin request handling
- **Route Protection**: Middleware groups for authenticated routes

---

## Frontend-Backend Integration

### API Communication Pattern
```typescript
// Example API call pattern
const response = await axios.get(
  `${backendBaseURL}/api/v1/users/accountant/invited`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  }
);
```

### Configuration
- **Base URL**: `https://backend.finaidhub.io` (from `assets/constants/constant.js`)
- **Authentication**: JWT tokens passed in Authorization header
- **Error Handling**: Global toast notifications for API errors
- **Loading States**: Skeleton loaders during API calls

### Data Flow
1. **User Authentication**: Login → JWT token → localStorage storage
2. **Dashboard Loading**: Role detection → API calls → State updates → UI rendering
3. **CRUD Operations**: Form submission → API call → Response handling → UI updates
4. **Real-time Updates**: Polling or manual refresh for data updates

---

## Key Business Logic

### License Management System
- **Purchase Flow**: Users purchase licenses for Fin(Ai)d profiles
- **Assignment**: Firm owners assign licenses to accountants
- **Usage Tracking**: Monitor license utilization across teams
- **Profile Integration**: Each license connects to specific AI profiles

### AI Agent Integration
- **Vector Database**: Store and index financial data for AI processing
- **Prediction Engine**: Process financial data using AI models
- **QuickBooks Sync**: Bi-directional data sync with QuickBooks
- **Run Tracking**: Monitor AI processing jobs and results

### Multi-Tenant Architecture
- **Accounting Firms**: Top-level tenant isolation
- **User Hierarchy**: Super Admin → Admin → Firm Owner → Accountant
- **Data Isolation**: Firm-level data separation
- **License Sharing**: Within-firm license distribution

---

## Development Workflow

### Frontend Development
```bash
# Development commands
pnpm dev          # Start development server
pnpm build        # Production build
pnpm lint         # ESLint checking
pnpm start        # Production server
```

### Code Organization Principles
1. **Role-based Structure**: Features organized by user roles
2. **Component Composition**: Reusable UI components with props
3. **Separation of Concerns**: API logic, UI components, business logic separated
4. **Type Safety**: Full TypeScript coverage with strict mode
5. **Responsive Design**: Mobile-first with Tailwind breakpoints

---

## External Dependencies & Integrations

### Major Frontend Dependencies
- **UI Framework**: @radix-ui/* (40+ components)
- **Styling**: tailwindcss, tailwindcss-animate
- **Forms**: react-hook-form, zod
- **Charts**: recharts
- **HTTP**: axios
- **Date/Time**: date-fns, moment
- **Icons**: lucide-react

### Backend Integrations
- **QuickBooks API**: OAuth2 integration for accounting data
- **AI/ML Services**: Custom predictor and vector processing
- **Email Services**: Laravel mail system
- **Social Auth**: OAuth providers (Google, etc.)

---

## Deployment & Configuration

### Environment Setup
- **Frontend**: Next.js with custom config for build optimization
- **Backend**: Laravel with API-first architecture
- **Database**: Relational database with migrations
- **File Storage**: Public assets and user uploads

### Performance Optimizations
- **Next.js Features**: Image optimization, code splitting, SSR
- **API Optimization**: Eager loading, pagination, caching
- **UI Performance**: Skeleton loading, lazy loading, memoization

---

This platform represents a comprehensive B2B SaaS solution for AI-powered accounting automation, with sophisticated role management, QuickBooks integration, and machine learning capabilities for financial data processing.