# Workflow and User Functionalities

## Overview
This project is a role-based financial advisory platform (Fin(Ai)d Hub) built with Next.js, React, and TypeScript. It supports multiple user roles: Accountant, Accounting Firm Owner, Admin, and Super Admin. Each role has a dedicated dashboard and set of functionalities.

---

## General Workflow
- **Authentication**: Users log in and receive an access token stored in localStorage. Role-based access is enforced throughout the app.
- **Navigation**: Each role sees a custom sidebar and dashboard, managed by `DashboardLayout`.
- **API Integration**: Data is fetched from backend endpoints using Axios, with the access token for authorization.
- **State Management**: Local state and React hooks are used for data and UI state.
- **UI Components**: Shared and role-specific components are organized in `components/`.

---

## User Functionalities by Role

### Accountant
- **Dashboard**: View metrics for active accountants, clients, licenses, and deployed Fin(Ai)ds.
- **Team Members**: See a list of accountants in the firm.
- **Clients**: View and manage recent clients.
- **Licenses**: View active licenses and associated Fin(Ai)d profiles.
- **Marketplace**: Access financial products/services.

### Accounting Firm Owner
- **Dashboard**: View metrics for accountants, clients, licenses, and deployed Fin(Ai)ds.
- **Team Members**: Manage accountants in the firm.
- **Clients**: View and manage recent clients.
- **Licenses**: View and manage firm licenses.
- **Marketplace**: Access financial products/services.

### Admin
- **Dashboard**: View metrics for active firms, total revenue, total users, and deployed Fin(Ai)ds.
- **Accounting Firms**: Manage and view accounting firms.
- **Marketplace**: Access and manage financial products/services.
- **Analytics/Reports**: (Planned) View analytics and exportable reports.

### Super Admin
- **Dashboard**: View metrics for active firms, total revenue, total users, and deployed Fin(Ai)ds.
- **Accounting Firms**: Manage and view all accounting firms.
- **Admins**: Manage admin users.
- **Marketplace**: Access and manage financial products/services.
- **Analytics/Reports**: (Planned) View analytics and exportable reports.

---

## Example Workflow
1. **Login**: User authenticates and is redirected to their role-specific dashboard.
2. **Dashboard**: User views key metrics and recent activity.
3. **Navigation**: User accesses sidebar to manage clients, licenses, team members, or marketplace.
4. **Data Fetching**: Components fetch data from backend using Axios and display in cards, tables, or lists.
5. **Role Enforcement**: UI and API calls are restricted based on user role and access token.

---

## Notes
- All dashboards use tabs for switching between overview, team, clients, analytics, and reports.
- Data loading states are handled with skeleton loaders.
- All API calls require a valid access token.
- Role-based navigation and access are strictly enforced.

---

For more details, see the dashboard pages in `app/[role]/dashboard/page.tsx` and shared components in `components/`.
