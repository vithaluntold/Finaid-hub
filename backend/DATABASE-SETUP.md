# PostgreSQL Database Setup Guide

## Prerequisites

- PostgreSQL 14+ installed
- pgAdmin or psql CLI
- Node.js packages: `pg`, `pg-hstore` (for Sequelize) or `pg` (for raw queries)

## Installation Steps

### 1. Install PostgreSQL Extensions

```sql
-- Connect to your database and run:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Optional: For vector embeddings (AI features)
CREATE EXTENSION IF NOT EXISTS "vector";
```

### 2. Create Database

```bash
# Using psql
createdb finaidhub

# Or in psql
CREATE DATABASE finaidhub;
```

### 3. Run Schema

```bash
# Using psql
psql -U postgres -d finaidhub -f database-schema.sql

# Or using pgAdmin
# Open Query Tool and paste the contents of database-schema.sql
```

## Node.js Configuration

### Install Dependencies

```bash
npm install pg dotenv
# Or if using Sequelize ORM
npm install sequelize pg pg-hstore
```

### Environment Variables

Create `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finaidhub
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_SSL=false

# For production
DATABASE_URL=postgresql://user:password@host:5432/finaidhub

# Connection Pool
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_IDLE=10000
```

### Database Connection (pg library)

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: parseInt(process.env.DB_POOL_MAX) || 10,
  min: parseInt(process.env.DB_POOL_MIN) || 2,
  idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE) || 10000,
});

module.exports = pool;
```

### Database Connection (Sequelize ORM)

```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 10,
      min: parseInt(process.env.DB_POOL_MIN) || 2,
      acquire: 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000,
    },
  }
);

module.exports = sequelize;
```

## Migration from In-Memory to PostgreSQL

### Step 1: Create Migration Script

```javascript
const pool = require('./db-connection');
const bcrypt = require('bcryptjs');

async function migrateUsers() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Migrate Super Admin
    const hashedPassword = await bcrypt.hash('password123', 12);
    await client.query(`
      INSERT INTO users (first_name, last_name, email, password_hash, user_type, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
    `, ['Super', 'Admin', 'superadmin@finaidhub.io', hashedPassword, 'super_admin', 'active']);
    
    await client.query('COMMIT');
    console.log('✅ Users migrated successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
  } finally {
    client.release();
  }
}

migrateUsers();
```

### Step 2: Update simple-server.js

Replace in-memory Maps with PostgreSQL queries:

```javascript
// Before (In-Memory)
const USERS_DB = new Map();

// After (PostgreSQL)
const pool = require('./db-connection');

// Example: Get user by email
async function getUserByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL',
    [email]
  );
  return result.rows[0];
}
```

## Useful Queries

### Check Database Status

```sql
-- List all tables
\dt

-- Check table size
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Count records in all tables
SELECT 
  schemaname,
  tablename,
  n_live_tup AS row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
```

### Backup and Restore

```bash
# Backup
pg_dump -U postgres -d finaidhub -F c -b -v -f finaidhub_backup.dump

# Restore
pg_restore -U postgres -d finaidhub -v finaidhub_backup.dump

# SQL format backup
pg_dump -U postgres -d finaidhub -f finaidhub_backup.sql
```

### Performance Optimization

```sql
-- Analyze tables
ANALYZE;

-- Vacuum tables
VACUUM ANALYZE;

-- Create additional indexes if needed
CREATE INDEX idx_custom_field ON table_name(custom_field);
```

## Testing Connection

```javascript
const pool = require('./db-connection');

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', result.rows[0].now);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();
```

## Common Issues

### Issue: Connection Refused
```bash
# Check if PostgreSQL is running
sudo service postgresql status  # Linux
brew services list              # macOS
# Windows: Check Services app
```

### Issue: Authentication Failed
```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Change to:
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
```

### Issue: Port Already in Use
```bash
# Check what's using port 5432
netstat -an | grep 5432
```

## Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use strong passwords** - Generate with `openssl rand -base64 32`
3. **Limit database user permissions** - Create specific user for app
4. **Enable SSL in production** - Set `DB_SSL=true`
5. **Regular backups** - Set up automated backup schedule
6. **Monitor connections** - Use connection pooling
7. **Sanitize inputs** - Always use parameterized queries

## Next Steps

1. Run the schema: `psql -U postgres -d finaidhub -f database-schema.sql`
2. Create `.env` file with your credentials
3. Update `simple-server.js` to use PostgreSQL instead of in-memory storage
4. Run migration script to import existing data
5. Test all endpoints
6. Deploy to production

## Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [node-postgres (pg) Documentation](https://node-postgres.com/)
- [Sequelize ORM Documentation](https://sequelize.org/)
