# Finaid-hub

A comprehensive financial management platform with role-based access control.

## Features

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Express.js API with JWT authentication
- **Roles**: Super Admin, Admin, Accounting Firm Owner, Accountant
- **Docker**: Full containerization support

## Quick Start

### Using Docker (Recommended)
```bash
git clone https://github.com/vithaluntold/Finaid-hub.git
cd Finaid-hub
docker-compose up -d
```

### Manual Setup
```bash
# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:9003

## Structure

```
📁 Finaid-hub/
├── 📁 backend/          # Express.js API
├── 📁 frontend/         # Next.js App
└── 📁 docs/            # Documentation
```

## License

MIT