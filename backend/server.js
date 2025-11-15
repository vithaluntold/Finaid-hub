const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import configurations
const corsConfig = require('./src/config/cors');
const rateLimitConfig = require('./src/config/rateLimiter');

// Import middleware
const authMiddleware = require('./src/middleware/auth');

// Import routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const clientRoutes = require('./src/routes/clients');
const profileRoutes = require('./src/routes/profiles');
const licenseRoutes = require('./src/routes/licenses');
const quickbooksRoutes = require('./src/routes/quickbooks');
const aiAgentRoutes = require('./src/routes/aiAgent');
const fileRoutes = require('./src/routes/files');
const emailRoutes = require('./src/routes/email');
const searchRoutes = require('./src/routes/search');
const finaidProfilesRoutes = require('./src/routes/finaidProfiles');
const licensingMasterRoutes = require('./src/routes/licensingMaster');
const connectionTestRoutes = require('./src/routes/connectionTest');

// Import data initialization
const { initializeDefaultData } = require('./src/config/database');

console.log('🔧 Starting FinAidHub Backend Server...');

const app = express();
const PORT = process.env.PORT || 9002;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`🌍 Environment: ${NODE_ENV}`);
console.log(`🔌 Using PORT: ${PORT}`);

// Security middleware
app.use(helmet());

// Rate limiting
app.use(rateLimitConfig);

// CORS configuration
app.use(cors(corsConfig));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

console.log('🔧 Middleware configured...');

// Initialize default data
initializeDefaultData();

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/register', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/licenses', licenseRoutes);
app.use('/api/v1/quickbooks', quickbooksRoutes);
app.use('/api/v1/ai-agent', aiAgentRoutes);
app.use('/api/v1', fileRoutes);
app.use('/api/v1', emailRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/finaid-profiles', finaidProfilesRoutes);
app.use('/api/v1/licensing-master', licensingMasterRoutes);
app.use('/api/v1/test', connectionTestRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'FinAid Hub Backend API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: NODE_ENV
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to FinAid Hub API',
        version: '1.0.0',
        endpoints: {
            health: '/api/v1/health',
            auth: '/api/v1/auth',
            register: '/api/v1/register',
            users: '/api/v1/users',
            clients: '/api/v1/clients',
            profiles: '/api/v1/profile',
            licenses: '/api/v1/licenses',
            quickbooks: '/api/v1/quickbooks',
            aiAgent: '/api/v1/ai-agent',
            files: '/api/v1/upload',
            email: '/api/v1/send-email',
            search: '/api/v1/search',
            finaidProfiles: '/api/v1/finaid-profiles',
            licensingMaster: '/api/v1/licensing-master'
        },
        testEndpoints: {
            ping: '/api/v1/test/ping',
            dbStatus: '/api/v1/test/db-status',
            connectionTest: '/api/v1/test/test-all'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableEndpoints: '/api/v1/'
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`\n🚀 FinAid Hub Backend Server running on port ${PORT}`);
    console.log(`🌐 Server URL: http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/v1/`);
    console.log('✅ Server ready to accept connections!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Process terminated');
        process.exit(0);
    });
});

module.exports = app;