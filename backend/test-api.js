const axios = require('axios');

const BASE_URL = 'http://localhost:9003';
let accessToken = '';
let testUserId = '';
let testClientId = '';
let testFinaidProfileId = '';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(test, data) {
  log(`✅ ${test}`, 'green');
  if (data) log(`   ${JSON.stringify(data).substring(0, 100)}...`, 'gray');
}

function logError(test, error) {
  log(`❌ ${test}`, 'red');
  if (error.code === 'ECONNREFUSED') {
    log(`   Cannot connect to server at ${BASE_URL}`, 'gray');
    log(`   Make sure the backend server is running on port 9003`, 'gray');
  } else if (error.response) {
    log(`   Status: ${error.response.status} - ${error.response.statusText}`, 'gray');
    if (error.response.data) {
      log(`   Response: ${JSON.stringify(error.response.data).substring(0, 100)}`, 'gray');
    }
  } else {
    log(`   ${error.message}`, 'gray');
  }
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Test functions
async function testHealthCheck() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/health`);
    logSuccess('Health Check', response.data);
    return true;
  } catch (error) {
    logError('Health Check', error);
    return false;
  }
}

async function testConnectionTest() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/test/ping`);
    logSuccess('Connection Test (Ping)', response.data);
    return true;
  } catch (error) {
    logError('Connection Test (Ping)', error);
    return false;
  }
}

async function testDatabaseStatus() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/test/db-status`);
    logSuccess('Database Status Check', response.data);
    return true;
  } catch (error) {
    logError('Database Status Check', error);
    return false;
  }
}

async function testLogin() {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/auth`, {
      username: 'superadmin@finaidhub.io',
      password: 'password123'
    });
    
    if (response.data.success && response.data.data.token) {
      accessToken = response.data.data.token;
      logSuccess('Login (Super Admin)', { 
        email: response.data.data.user.email,
        userType: response.data.data.user.user_type,
        tokenReceived: true 
      });
      return true;
    }
    return false;
  } catch (error) {
    logError('Login', error);
    return false;
  }
}

async function testGetAllUsers() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/users`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    logSuccess('Get All Users', { count: response.data.data.length });
    return true;
  } catch (error) {
    logError('Get All Users', error);
    return false;
  }
}

async function testGetAccountingOwners() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/users/accounting-owner`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    logSuccess('Get Accounting Owners', { count: response.data.data.length });
    return true;
  } catch (error) {
    logError('Get Accounting Owners', error);
    return false;
  }
}

async function testCreateUser() {
  try {
    const newUser = {
      first_name: 'Test',
      last_name: 'User',
      email: `test.user.${Date.now()}@example.com`,
      user_type: 'accountant'
    };

    const response = await axios.post(`${BASE_URL}/api/v1/users`, newUser, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (response.data.success) {
      testUserId = response.data.data._id;
      logSuccess('Create User', { 
        id: testUserId, 
        email: newUser.email 
      });
      return true;
    }
    return false;
  } catch (error) {
    logError('Create User', error);
    return false;
  }
}

async function testGetUserById() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/users/${testUserId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    logSuccess('Get User By ID', { email: response.data.data.email });
    return true;
  } catch (error) {
    logError('Get User By ID', error);
    return false;
  }
}

async function testUpdateUser() {
  try {
    const response = await axios.put(`${BASE_URL}/api/v1/users/${testUserId}`, {
      first_name: 'Updated',
      last_name: 'User'
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    logSuccess('Update User', { name: 'Updated User' });
    return true;
  } catch (error) {
    logError('Update User', error);
    return false;
  }
}

async function testCreateClient() {
  try {
    const newClient = {
      name: 'Test Client Company',
      email: `client.${Date.now()}@example.com`,
      phone: '9876543210'
    };

    const response = await axios.post(`${BASE_URL}/api/v1/clients`, newClient, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (response.data.success) {
      testClientId = response.data.data._id;
      logSuccess('Create Client', { 
        id: testClientId, 
        name: newClient.name 
      });
      return true;
    }
    return false;
  } catch (error) {
    logError('Create Client', error);
    return false;
  }
}

async function testGetAllClients() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/clients`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    logSuccess('Get All Clients', { count: response.data.data.length });
    return true;
  } catch (error) {
    logError('Get All Clients', error);
    return false;
  }
}

async function testCreateFinaidProfile() {
  try {
    const newProfile = {
      name: `Test Finaid Profile ${Date.now()}`,
      desc: 'This is a test Finaid profile',
      platform: JSON.stringify({ key: 'quickbooks', name: 'QuickBooks' }),
      model: JSON.stringify({ identifier: 'claude-3.7', display_name: 'Anthropic Claude' }),
      integration: JSON.stringify({ identifier: 'csv_json', display_options: ['CSV In', 'JSON Out'] })
    };

    const response = await axios.post(`${BASE_URL}/api/v1/finaid-profiles`, newProfile, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (response.data.success) {
      testFinaidProfileId = response.data.data._id;
      logSuccess('Create Finaid Profile', { 
        id: testFinaidProfileId, 
        name: newProfile.name 
      });
      return true;
    }
    return false;
  } catch (error) {
    logError('Create Finaid Profile', error);
    return false;
  }
}

async function testGetFinaidProfiles() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/finaid-profiles`);
    logSuccess('Get Finaid Profiles', { count: response.data.data.length });
    return true;
  } catch (error) {
    logError('Get Finaid Profiles', error);
    return false;
  }
}

async function testFilterFinaidProfiles() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/finaid-profiles/filter?finaid_profile_id=${testFinaidProfileId}`);
    logSuccess('Filter Finaid Profiles', { found: response.data.data.length > 0 });
    return true;
  } catch (error) {
    logError('Filter Finaid Profiles', error);
    return false;
  }
}

async function testGetLicenses() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/licenses`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    logSuccess('Get Licenses', response.data);
    return true;
  } catch (error) {
    logError('Get Licenses', error);
    return false;
  }
}

async function testSearch() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/search?query=test`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    logSuccess('Search', { 
      users: response.data.data.results.users.length,
      clients: response.data.data.results.clients.length,
      total: response.data.data.total_results
    });
    return true;
  } catch (error) {
    logError('Search', error);
    return false;
  }
}

async function testPasswordReset() {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/auth/reset`, {
      email: 'superadmin@finaidhub.io'
    });
    logSuccess('Password Reset Request', { email: 'superadmin@finaidhub.io' });
    return true;
  } catch (error) {
    logError('Password Reset Request', error);
    return false;
  }
}

async function testComprehensiveAPITest() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/test/test-all`);
    logSuccess('Comprehensive API Test', { 
      working: response.data.data.summary.working,
      total: response.data.data.summary.total 
    });
    return true;
  } catch (error) {
    logError('Comprehensive API Test', error);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  log('\n🚀 Starting API Tests for FinAid Hub Backend\n', 'blue');
  log('════════════════════════════════════════════════════\n', 'yellow');

  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };

  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Connection Test', fn: testConnectionTest },
    { name: 'Database Status', fn: testDatabaseStatus },
    { name: 'Comprehensive API Test', fn: testComprehensiveAPITest },
    { name: 'Login', fn: testLogin },
    { name: 'Get All Users', fn: testGetAllUsers },
    { name: 'Get Accounting Owners', fn: testGetAccountingOwners },
    { name: 'Create User', fn: testCreateUser },
    { name: 'Get User By ID', fn: testGetUserById },
    { name: 'Update User', fn: testUpdateUser },
    { name: 'Create Client', fn: testCreateClient },
    { name: 'Get All Clients', fn: testGetAllClients },
    { name: 'Create Finaid Profile', fn: testCreateFinaidProfile },
    { name: 'Get Finaid Profiles', fn: testGetFinaidProfiles },
    { name: 'Filter Finaid Profiles', fn: testFilterFinaidProfiles },
    { name: 'Get Licenses', fn: testGetLicenses },
    { name: 'Search', fn: testSearch },
    { name: 'Password Reset', fn: testPasswordReset }
  ];

  for (const test of tests) {
    results.total++;
    logInfo(`Testing: ${test.name}`);
    const success = await test.fn();
    if (success) {
      results.passed++;
    } else {
      results.failed++;
    }
    console.log(''); // Empty line for readability
  }

  log('\n════════════════════════════════════════════════════', 'yellow');
  log('\n📊 Test Summary:', 'blue');
  log(`   Total Tests: ${results.total}`, 'blue');
  log(`   Passed: ${results.passed}`, 'green');
  log(`   Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`   Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`, 'yellow');
  log('\n════════════════════════════════════════════════════\n', 'yellow');

  if (results.failed === 0) {
    log('🎉 All tests passed successfully!', 'green');
  } else {
    log(`⚠️  ${results.failed} test(s) failed. Please check the logs above.`, 'red');
  }

  log('\n📝 Test Data Created:', 'blue');
  if (testUserId) log(`   User ID: ${testUserId}`, 'gray');
  if (testClientId) log(`   Client ID: ${testClientId}`, 'gray');
  if (testFinaidProfileId) log(`   Finaid Profile ID: ${testFinaidProfileId}`, 'gray');
  log('');
}

// Run tests
runAllTests().catch(error => {
  logError('Test Runner Error', error);
  process.exit(1);
});
