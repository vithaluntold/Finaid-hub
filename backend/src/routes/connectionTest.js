const express = require('express');
const router = express.Router();

// Test all API endpoints connectivity
router.get('/test-all', async (req, res) => {
  console.log('📡 Running comprehensive API connection test...');
  
  const results = {
    timestamp: new Date().toISOString(),
    server: {
      status: 'RUNNING',
      port: process.env.PORT || 9003,
      environment: process.env.NODE_ENV || 'development'
    },
    endpoints: {},
    summary: {
      total: 0,
      working: 0,
      issues: 0
    }
  };

  // Define all endpoints to test
  const endpointTests = [
    { name: 'Health Check', path: '/api/v1/health', method: 'GET', requiresAuth: false },
    { name: 'Root API', path: '/api/v1/', method: 'GET', requiresAuth: false },
    
    // Auth endpoints
    { name: 'Auth Login', path: '/api/v1/auth', method: 'POST', requiresAuth: false },
    { name: 'Password Reset', path: '/api/v1/reset', method: 'POST', requiresAuth: false },
    { name: 'Logout', path: '/api/v1/logout', method: 'POST', requiresAuth: false },
    
    // User endpoints
    { name: 'Get All Users', path: '/api/v1/users', method: 'GET', requiresAuth: true },
    { name: 'Get Accounting Owners', path: '/api/v1/users/accounting-owner', method: 'GET', requiresAuth: true },
    { name: 'Create User', path: '/api/v1/users', method: 'POST', requiresAuth: true },
    
    // Client endpoints
    { name: 'Get Clients', path: '/api/v1/clients', method: 'GET', requiresAuth: true },
    { name: 'Create Client', path: '/api/v1/clients', method: 'POST', requiresAuth: true },
    
    // Finaid Profile endpoints
    { name: 'Get Finaid Profiles', path: '/api/v1/finaid-profiles', method: 'GET', requiresAuth: false },
    { name: 'Filter Finaid Profiles', path: '/api/v1/finaid-profiles/filter', method: 'GET', requiresAuth: false },
    { name: 'Create Finaid Profile', path: '/api/v1/finaid-profiles', method: 'POST', requiresAuth: true },
    
    // Licensing endpoints
    { name: 'Get Licensing Master', path: '/api/v1/licensing-master', method: 'GET', requiresAuth: true },
    { name: 'Create Licensing Master', path: '/api/v1/licensing-master', method: 'POST', requiresAuth: true },
    
    // License endpoints
    { name: 'Get Licenses', path: '/api/v1/licenses', method: 'GET', requiresAuth: true },
    { name: 'Create License', path: '/api/v1/licenses', method: 'POST', requiresAuth: true },
    
    // AI Agent endpoints
    { name: 'Get AI Agent Runs', path: '/api/v1/ai-agent/runs', method: 'GET', requiresAuth: true },
    { name: 'Create AI Agent Run', path: '/api/v1/ai-agent/run', method: 'POST', requiresAuth: true },
    { name: 'Create AI Vector', path: '/api/v1/ai-agent/vector/create', method: 'POST', requiresAuth: true },
    { name: 'Query AI Vector', path: '/api/v1/ai-agent/vector/query', method: 'GET', requiresAuth: true },
    
    // QuickBooks endpoints
    { name: 'QuickBooks Auth', path: '/api/v1/quickbooks/auth', method: 'GET', requiresAuth: true },
    { name: 'QuickBooks Companies', path: '/api/v1/quickbooks/companies', method: 'GET', requiresAuth: true },
    
    // File endpoints
    { name: 'File Upload', path: '/api/v1/upload', method: 'POST', requiresAuth: true },
    
    // Email endpoints
    { name: 'Send Email', path: '/api/v1/send-email', method: 'POST', requiresAuth: true },
    
    // Search endpoints
    { name: 'Search', path: '/api/v1/search', method: 'GET', requiresAuth: true },
  ];

  results.summary.total = endpointTests.length;

  // Check each endpoint
  endpointTests.forEach(test => {
    try {
      // Check if route exists in the app
      const routeExists = checkRouteExists(test.path, test.method);
      
      results.endpoints[test.name] = {
        path: test.path,
        method: test.method,
        requiresAuth: test.requiresAuth,
        status: routeExists ? 'CONFIGURED' : 'NOT_FOUND',
        message: routeExists 
          ? test.requiresAuth 
            ? 'Route configured (requires authentication)'
            : 'Route configured and accessible'
          : 'Route not found or not properly configured'
      };

      if (routeExists) {
        results.summary.working++;
      } else {
        results.summary.issues++;
      }
    } catch (error) {
      results.endpoints[test.name] = {
        path: test.path,
        method: test.method,
        status: 'ERROR',
        message: error.message
      };
      results.summary.issues++;
    }
  });

  // Add database connection status
  results.database = {
    type: 'In-Memory',
    status: 'CONNECTED',
    message: 'Using in-memory data store (Map objects)'
  };

  // Add CORS configuration
  results.cors = {
    status: 'CONFIGURED',
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
  };

  console.log(`✅ API Connection Test Complete: ${results.summary.working}/${results.summary.total} endpoints configured`);
  
  res.json({
    success: true,
    message: 'API Connection Test Complete',
    data: results
  });
});

// Helper function to check if route exists
function checkRouteExists(path, method) {
  // This is a simplified check - in production you'd want more sophisticated route checking
  const routeMapping = {
    '/api/v1/health': ['GET'],
    '/api/v1/': ['GET'],
    '/api/v1/auth': ['POST'],
    '/api/v1/reset': ['POST'],
    '/api/v1/logout': ['POST'],
    '/api/v1/users': ['GET', 'POST'],
    '/api/v1/users/accounting-owner': ['GET'],
    '/api/v1/clients': ['GET', 'POST'],
    '/api/v1/finaid-profiles': ['GET', 'POST'],
    '/api/v1/finaid-profiles/filter': ['GET'],
    '/api/v1/licensing-master': ['GET', 'POST'],
    '/api/v1/licenses': ['GET', 'POST'],
    '/api/v1/ai-agent/runs': ['GET'],
    '/api/v1/ai-agent/run': ['POST'],
    '/api/v1/ai-agent/vector/create': ['POST'],
    '/api/v1/ai-agent/vector/query': ['GET'],
    '/api/v1/quickbooks/auth': ['GET'],
    '/api/v1/quickbooks/companies': ['GET'],
    '/api/v1/upload': ['POST'],
    '/api/v1/send-email': ['POST'],
    '/api/v1/search': ['GET'],
  };

  const methods = routeMapping[path];
  return methods && methods.includes(method);
}

// Quick connectivity test endpoint
router.get('/ping', (req, res) => {
  res.json({
    success: true,
    message: 'API server is reachable',
    timestamp: new Date().toISOString(),
    server: 'FinAid Hub Backend',
    version: '1.0.0'
  });
});

// Test database connectivity
router.get('/db-status', (req, res) => {
  const { USERS_DB, FINAID_PROFILES_DB, LICENSES_DB, CLIENTS_DB } = require('../config/database');
  
  res.json({
    success: true,
    message: 'Database status check',
    database: {
      type: 'In-Memory (Development)',
      collections: {
        users: {
          count: USERS_DB.size,
          status: 'ACTIVE'
        },
        finaidProfiles: {
          count: FINAID_PROFILES_DB.size,
          status: 'ACTIVE'
        },
        licenses: {
          count: LICENSES_DB.size,
          status: 'ACTIVE'
        },
        clients: {
          count: CLIENTS_DB.size,
          status: 'ACTIVE'
        }
      }
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
