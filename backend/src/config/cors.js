const CORS_ORIGIN = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000';
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`🔗 CORS Origin: ${CORS_ORIGIN}`);

// CORS configuration - support both development and production
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? [CORS_ORIGIN] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000', CORS_ORIGIN],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

module.exports = corsOptions;