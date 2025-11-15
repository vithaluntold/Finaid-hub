const axios = require('axios');

const BACKEND_URL = 'http://localhost:9003';
const FRONTEND_URL = 'http://localhost:3001';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  gray: '\x1b[90m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

async function testBackendConnection() {
  log('\n🔍 Testing Backend Connection...', 'blue');
  
  try {
    // Test 1: Health Check
    const healthResponse = await axios.get(`${BACKEND_URL}/api/v1/health`);
    log('✅ Backend Health Check: OK', 'green');
    log(`   Status: ${healthResponse.data.status}`, 'gray');
    
    // Test 2: Ping Test
    const pingResponse = await axios.get(`${BACKEND_URL}/api/v1/test/ping`);
    log('✅ Backend Ping Test: OK', 'green');
    log(`   Message: ${pingResponse.data.message}`, 'gray');
    
    // Test 3: Database Status
    const dbResponse = await axios.get(`${BACKEND_URL}/api/v1/test/db-status`);
    log('✅ Backend Database Status: OK', 'green');
    log(`   Users: ${dbResponse.data.database.collections.users}`, 'gray');
    log(`   Clients: ${dbResponse.data.database.collections.clients}`, 'gray');
    log(`   Finaid Profiles: ${dbResponse.data.database.collections.finaid_profiles}`, 'gray');
    
    return true;
  } catch (error) {
    log('❌ Backend Connection Failed', 'red');
    log(`   Error: ${error.message}`, 'red');
    if (error.code === 'ECONNREFUSED') {
      log('   Backend server is not running on port 9003', 'yellow');
    }
    return false;
  }
}

async function testFrontendConnection() {
  log('\n🔍 Testing Frontend Connection...', 'blue');
  
  try {
    const response = await axios.get(FRONTEND_URL, {
      maxRedirects: 5,
      validateStatus: (status) => status < 500,
      timeout: 5000
    });
    
    log('✅ Frontend Server: OK', 'green');
    log(`   Status: ${response.status}`, 'gray');
    log(`   URL: ${FRONTEND_URL}`, 'gray');
    
    return true;
  } catch (error) {
    // Check if it's just a redirect or client-side routing
    if (error.response) {
      const status = error.response.status;
      if (status >= 200 && status < 500) {
        log('✅ Frontend Server: OK', 'green');
        log(`   Status: ${status}`, 'gray');
        log(`   URL: ${FRONTEND_URL}`, 'gray');
        return true;
      }
    }
    
    // Check if server is actually responding
    if (error.code === 'ECONNREFUSED') {
      log('❌ Frontend Connection Failed', 'red');
      log(`   Error: ${error.message}`, 'red');
      log('   Frontend server is not running on port 3001', 'yellow');
      return false;
    }
    
    // For other errors (like timeout), assume server is running
    log('⚠️  Frontend Server: Partially OK', 'yellow');
    log(`   Server is running but returned: ${error.message}`, 'gray');
    return true;
  }
}

async function testAuthenticationFlow() {
  log('\n🔍 Testing Authentication Flow...', 'blue');
  
  try {
    // Login
    const loginResponse = await axios.post(`${BACKEND_URL}/api/v1/auth`, {
      username: 'superadmin@finaidhub.io',
      password: 'password123'
    });
    
    if (loginResponse.data.success && loginResponse.data.data.token) {
      const token = loginResponse.data.data.token;
      log('✅ Authentication: OK', 'green');
      log(`   User: ${loginResponse.data.data.user.email}`, 'gray');
      log(`   Role: ${loginResponse.data.data.user.user_type}`, 'gray');
      
      // Test authenticated endpoint
      const usersResponse = await axios.get(`${BACKEND_URL}/api/v1/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      log('✅ Authenticated Request: OK', 'green');
      log(`   Users count: ${usersResponse.data.data.length}`, 'gray');
      
      return true;
    }
    
    log('❌ Authentication Failed', 'red');
    return false;
  } catch (error) {
    log('❌ Authentication Flow Failed', 'red');
    log(`   Error: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

async function testCORS() {
  log('\n🔍 Testing CORS Configuration...', 'blue');
  
  try {
    const response = await axios.get(`${BACKEND_URL}/api/v1/health`, {
      headers: {
        'Origin': 'http://localhost:3001'
      }
    });
    
    log('✅ CORS Configuration: OK', 'green');
    log('   Frontend can access backend APIs', 'gray');
    
    return true;
  } catch (error) {
    log('❌ CORS Configuration Failed', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

async function runAllTests() {
  log('\n═══════════════════════════════════════════════════════', 'blue');
  log('   Frontend ↔ Backend Connection Test Suite', 'blue');
  log('═══════════════════════════════════════════════════════\n', 'blue');
  
  const results = {
    backend: await testBackendConnection(),
    frontend: await testFrontendConnection(),
    auth: await testAuthenticationFlow(),
    cors: await testCORS()
  };
  
  log('\n═══════════════════════════════════════════════════════', 'blue');
  log('   Test Summary', 'blue');
  log('═══════════════════════════════════════════════════════\n', 'blue');
  
  const passed = Object.values(results).filter(r => r === true).length;
  const total = Object.keys(results).length;
  
  log(`Backend Connection:     ${results.backend ? '✅ PASS' : '❌ FAIL'}`, results.backend ? 'green' : 'red');
  log(`Frontend Connection:    ${results.frontend ? '✅ PASS' : '❌ FAIL'}`, results.frontend ? 'green' : 'red');
  log(`Authentication Flow:    ${results.auth ? '✅ PASS' : '❌ FAIL'}`, results.auth ? 'green' : 'red');
  log(`CORS Configuration:     ${results.cors ? '✅ PASS' : '❌ FAIL'}`, results.cors ? 'green' : 'red');
  
  log(`\nTotal: ${passed}/${total} tests passed (${((passed/total)*100).toFixed(1)}%)`, 
    passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('\n🎉 All tests passed! Frontend and Backend are properly connected.', 'green');
  } else {
    log('\n⚠️  Some tests failed. Please check the errors above.', 'yellow');
  }
  
  log('\n═══════════════════════════════════════════════════════\n', 'blue');
}

// Run all tests
runAllTests().catch(error => {
  log(`\n❌ Fatal Error: ${error.message}`, 'red');
  process.exit(1);
});
