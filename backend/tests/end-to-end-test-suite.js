const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Test Configuration
const BASE_URL = 'http://localhost:9002';
const API_BASE = '/api/v1';

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Test results tracker
let testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    failedTests: []
};

// Authentication tokens for different user types
let authTokens = {
    superAdmin: null,
    admin: null,
    accountant: null,
    firmOwner: null
};

// Test user credentials
const testUsers = {
    superAdmin: { username: 'superadmin@finaidhub.io', password: 'password123' },
    admin: { username: 'admin@finaidhub.io', password: 'admin123' },
    accountant: { username: 'accountant@firm.com', password: 'acc123' },
    firmOwner: { username: 'owner@firm.com', password: 'owner123' }
};

// HTTP Request Helper
function makeRequest(path, method = 'GET', data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(BASE_URL + path);
        
        const options = {
            hostname: url.hostname,
            port: url.port || 80,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'FinAidHub-Test-Suite/1.0',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                let parsedData;
                try {
                    parsedData = JSON.parse(responseData);
                } catch (e) {
                    parsedData = responseData;
                }
                
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    data: parsedData,
                    raw: responseData
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data && method !== 'GET') {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// Test Result Logger
function logTest(testName, passed, expected = null, actual = null, error = null) {
    testResults.total++;
    
    if (passed) {
        testResults.passed++;
        console.log(`${colors.green}✅ PASS${colors.reset} | ${testName}`);
    } else {
        testResults.failed++;
        testResults.failedTests.push({
            name: testName,
            expected,
            actual,
            error: error ? error.message : null
        });
        console.log(`${colors.red}❌ FAIL${colors.reset} | ${testName}`);
        if (expected && actual) {
            console.log(`   Expected: ${colors.yellow}${expected}${colors.reset}`);
            console.log(`   Actual: ${colors.red}${actual}${colors.reset}`);
        }
        if (error) {
            console.log(`   Error: ${colors.red}${error.message}${colors.reset}`);
        }
    }
}

// Test Suite Functions
async function testHealthCheck() {
    console.log(`\n${colors.cyan}🏥 Testing Health & Utility Endpoints${colors.reset}`);
    
    try {
        // Test health endpoint
        const healthResponse = await makeRequest('/health');
        logTest('GET /health - Health check', 
            healthResponse.statusCode === 200 && healthResponse.data.data && healthResponse.data.data.status === 'OK',
            'status: OK',
            `status: ${healthResponse.data.data ? healthResponse.data.data.status : 'undefined'}`
        );

        // Test API root
        const rootResponse = await makeRequest('/');
        logTest('GET / - API root', 
            rootResponse.statusCode === 200 && rootResponse.data.message,
            'message exists',
            `message: ${rootResponse.data.message ? 'exists' : 'missing'}`
        );

    } catch (error) {
        logTest('Health Check Endpoints', false, null, null, error);
    }
}

async function testAuthentication() {
    console.log(`\n${colors.cyan}🔐 Testing Authentication Endpoints${colors.reset}`);
    
    try {
        // Test login for each user type
        for (const [userType, credentials] of Object.entries(testUsers)) {
            const loginResponse = await makeRequest(`${API_BASE}/auth`, 'POST', credentials);
            
            const loginSuccess = loginResponse.statusCode === 200 && 
                               loginResponse.data.success && 
                               loginResponse.data.data && 
                               loginResponse.data.data.token;
            
            logTest(`POST /api/v1/auth - Login as ${userType}`, 
                loginSuccess,
                'successful login with token',
                loginSuccess ? 'successful login with token' : `failed login (${loginResponse.statusCode}: ${loginResponse.data.message || 'unknown error'})`
            );

            if (loginSuccess) {
                authTokens[userType] = loginResponse.data.data.token;
            }
        }

        // Test invalid login
        const invalidLogin = await makeRequest(`${API_BASE}/auth`, 'POST', {
            username: 'invalid@example.com',
            password: 'wrongpassword'
        });
        
        logTest('POST /api/v1/auth - Invalid credentials', 
            invalidLogin.statusCode === 401 || !invalidLogin.data.success,
            'authentication failure',
            invalidLogin.data.success ? 'unexpected success' : 'authentication failure'
        );

    } catch (error) {
        logTest('Authentication Tests', false, null, null, error);
    }
}

async function testUserManagement() {
    console.log(`\n${colors.cyan}👥 Testing User Management Endpoints${colors.reset}`);
    
    try {
        // Test get user profile
        const headers = { 'Authorization': `Bearer ${authTokens.admin}` };
        
        const profileResponse = await makeRequest(`${API_BASE}/users/profile`, 'GET', null, headers);
        logTest('GET /api/v1/users/profile - Get user profile', 
            profileResponse.statusCode === 200 && profileResponse.data.success,
            'profile data returned',
            profileResponse.data.success ? 'profile data returned' : 'profile fetch failed'
        );

        // Test update user profile
        const updateData = {
            name: 'Updated Test User',
            email: 'admin@finaidhub.com'
        };
        
        const updateResponse = await makeRequest(`${API_BASE}/users/profile`, 'PUT', updateData, headers);
        logTest('PUT /api/v1/users/profile - Update user profile', 
            updateResponse.statusCode === 200 && updateResponse.data.success,
            'profile updated successfully',
            updateResponse.data.success ? 'profile updated successfully' : 'profile update failed'
        );

        // Test get user info (public endpoint)
        const userInfoResponse = await makeRequest(`${API_BASE}/user/get-user-info`);
        logTest('GET /api/v1/user/get-user-info - Get user info', 
            userInfoResponse.statusCode === 200,
            'user info returned',
            userInfoResponse.statusCode === 200 ? 'user info returned' : 'user info failed'
        );

        // Test super admin endpoints
        if (authTokens.superAdmin) {
            const superHeaders = { 'Authorization': `Bearer ${authTokens.superAdmin}` };
            
            const adminUsersResponse = await makeRequest(`${API_BASE}/admins/users/by-superadmin`, 'GET', null, superHeaders);
            logTest('GET /api/v1/admins/users/by-superadmin - List admin users (Super Admin)', 
                adminUsersResponse.statusCode === 200,
                'admin users list returned',
                adminUsersResponse.statusCode === 200 ? 'admin users list returned' : 'admin users list failed'
            );
        }

    } catch (error) {
        logTest('User Management Tests', false, null, null, error);
    }
}

async function testLicenseManagement() {
    console.log(`\n${colors.cyan}📋 Testing License Management Endpoints${colors.reset}`);
    
    try {
        const headers = { 'Authorization': `Bearer ${authTokens.admin}` };
        
        // Test get my licenses
        const licensesResponse = await makeRequest(`${API_BASE}/licenses/my-licenses`, 'GET', null, headers);
        logTest('GET /api/v1/licenses/my-licenses - Get user licenses', 
            licensesResponse.statusCode === 200,
            'licenses data returned',
            licensesResponse.statusCode === 200 ? 'licenses data returned' : 'licenses fetch failed'
        );

        // Test accountant licenses (if accountant token available)
        if (authTokens.accountant) {
            const accHeaders = { 'Authorization': `Bearer ${authTokens.accountant}` };
            const accLicensesResponse = await makeRequest(`${API_BASE}/licenses/my-licenses/accountant`, 'GET', null, accHeaders);
            logTest('GET /api/v1/licenses/my-licenses/accountant - Get accountant licenses', 
                accLicensesResponse.statusCode === 200,
                'accountant licenses returned',
                accLicensesResponse.statusCode === 200 ? 'accountant licenses returned' : 'accountant licenses failed'
            );
        }

    } catch (error) {
        logTest('License Management Tests', false, null, null, error);
    }
}

async function testFinAidProfiles() {
    console.log(`\n${colors.cyan}🎯 Testing FinAid Profiles Endpoints${colors.reset}`);
    
    try {
        // Test get all profiles (public)
        const profilesResponse = await makeRequest(`${API_BASE}/finaid-profiles`);
        logTest('GET /api/v1/finaid-profiles - Get all profiles', 
            profilesResponse.statusCode === 200 && Array.isArray(profilesResponse.data.profiles),
            'profiles array returned',
            Array.isArray(profilesResponse.data.profiles) ? 'profiles array returned' : 'profiles fetch failed'
        );

        // Test filter profiles
        const filterResponse = await makeRequest(`${API_BASE}/finaid-profiles/filter?category=tax`);
        logTest('GET /api/v1/finaid-profiles/filter - Filter profiles', 
            filterResponse.statusCode === 200,
            'filtered profiles returned',
            filterResponse.statusCode === 200 ? 'filtered profiles returned' : 'filter failed'
        );

        // Test create profile (admin only)
        if (authTokens.admin) {
            const headers = { 'Authorization': `Bearer ${authTokens.admin}` };
            const newProfile = {
                name: 'Test Profile',
                description: 'Test profile for API testing',
                category: 'test',
                price: 99.99
            };
            
            const createResponse = await makeRequest(`${API_BASE}/finaid-profiles`, 'POST', newProfile, headers);
            logTest('POST /api/v1/finaid-profiles - Create profile (Admin)', 
                createResponse.statusCode === 201 || createResponse.statusCode === 200,
                'profile created successfully',
                createResponse.data.success ? 'profile created successfully' : 'profile creation failed'
            );
        }

    } catch (error) {
        logTest('FinAid Profiles Tests', false, null, null, error);
    }
}

async function testClientManagement() {
    console.log(`\n${colors.cyan}👤 Testing Client Management Endpoints${colors.reset}`);
    
    try {
        const headers = { 'Authorization': `Bearer ${authTokens.admin}` };
        
        // Test get clients
        const clientsResponse = await makeRequest(`${API_BASE}/clients`, 'GET', null, headers);
        logTest('GET /api/v1/clients - Get clients list', 
            clientsResponse.statusCode === 200,
            'clients list returned',
            clientsResponse.statusCode === 200 ? 'clients list returned' : 'clients fetch failed'
        );

        // Test create client
        const newClient = {
            name: 'Test Client',
            email: 'testclient@example.com',
            phone: '+1234567890',
            address: '123 Test St'
        };
        
        const createClientResponse = await makeRequest(`${API_BASE}/clients`, 'POST', newClient, headers);
        logTest('POST /api/v1/clients - Create new client', 
            createClientResponse.statusCode === 201 || createClientResponse.statusCode === 200,
            'client created successfully',
            createClientResponse.data.success ? 'client created successfully' : 'client creation failed'
        );

        // Test get client companies
        const companiesResponse = await makeRequest(`${API_BASE}/client-companies`, 'GET', null, headers);
        logTest('GET /api/v1/client-companies - Get client companies', 
            companiesResponse.statusCode === 200,
            'companies list returned',
            companiesResponse.statusCode === 200 ? 'companies list returned' : 'companies fetch failed'
        );

    } catch (error) {
        logTest('Client Management Tests', false, null, null, error);
    }
}

async function testQuickBooksIntegration() {
    console.log(`\n${colors.cyan}💼 Testing QuickBooks Integration Endpoints${colors.reset}`);
    
    try {
        const headers = { 'Authorization': `Bearer ${authTokens.admin}` };
        
        // Test QB authorization
        const authResponse = await makeRequest(`${API_BASE}/quickbooks/authorize`, 'GET', null, headers);
        logTest('GET /api/v1/quickbooks/authorize - QB authorization', 
            authResponse.statusCode === 200,
            'QB auth URL returned',
            authResponse.statusCode === 200 ? 'QB auth URL returned' : 'QB auth failed'
        );

        // Test QB vendors endpoint
        const vendorsData = {
            companyId: '123456789',
            accessToken: 'test_token'
        };
        
        const vendorsResponse = await makeRequest(`${API_BASE}/quickbooks/vendors`, 'POST', vendorsData, headers);
        logTest('POST /api/v1/quickbooks/vendors - Get QB vendors', 
            vendorsResponse.statusCode === 200,
            'QB vendors data handled',
            vendorsResponse.statusCode === 200 ? 'QB vendors data handled' : 'QB vendors failed'
        );

        // Test QB unified endpoints
        const unifiedData = { companyId: '123456789' };
        
        const payeesResponse = await makeRequest(`${API_BASE}/quickbooks/unified/payees`, 'POST', unifiedData, headers);
        logTest('POST /api/v1/quickbooks/unified/payees - Get unified payees', 
            payeesResponse.statusCode === 200,
            'unified payees returned',
            payeesResponse.statusCode === 200 ? 'unified payees returned' : 'unified payees failed'
        );

    } catch (error) {
        logTest('QuickBooks Integration Tests', false, null, null, error);
    }
}

async function testAIAgentSystem() {
    console.log(`\n${colors.cyan}🤖 Testing AI Agent System Endpoints${colors.reset}`);
    
    try {
        const headers = { 'Authorization': `Bearer ${authTokens.admin}` };
        
        // Test AI agent runs
        const runsResponse = await makeRequest(`${API_BASE}/finaid-agent/runs/company/test_client_123`, 'GET', null, headers);
        logTest('GET /api/v1/finaid-agent/runs/company/:clientID - Get AI runs', 
            runsResponse.statusCode === 200,
            'AI runs data returned',
            runsResponse.statusCode === 200 ? 'AI runs data returned' : 'AI runs fetch failed'
        );

        // Test vector indexing
        const vectorData = {
            documents: [{
                id: 'test_doc_1',
                content: 'Test document content for indexing',
                metadata: { type: 'test', source: 'api_test' }
            }]
        };
        
        const indexResponse = await makeRequest(`${API_BASE}/finaid-agent/vector/index`, 'POST', vectorData, headers);
        logTest('POST /api/v1/finaid-agent/vector/index - Index documents', 
            indexResponse.statusCode === 200,
            'documents indexed successfully',
            indexResponse.data.success ? 'documents indexed successfully' : 'indexing failed'
        );

        // Test vector search
        const searchResponse = await makeRequest(`${API_BASE}/finaid-agent/vector/get?query=test&limit=5`, 'GET', null, headers);
        logTest('GET /api/v1/finaid-agent/vector/get - Vector search', 
            searchResponse.statusCode === 200,
            'search results returned',
            searchResponse.statusCode === 200 ? 'search results returned' : 'search failed'
        );

        // Test QuickBooks AI analysis
        const qbAnalysisData = {
            query: 'Analyze expense trends',
            client_id: 'test_client_123',
            quickbooks_data: { expenses: [], revenue: [] }
        };
        
        const analysisResponse = await makeRequest(`${API_BASE}/post-agent/quickbooks`, 'POST', qbAnalysisData, headers);
        logTest('POST /api/v1/post-agent/quickbooks - QB AI analysis', 
            analysisResponse.statusCode === 200,
            'AI analysis completed',
            analysisResponse.data.success ? 'AI analysis completed' : 'AI analysis failed'
        );

    } catch (error) {
        logTest('AI Agent System Tests', false, null, null, error);
    }
}

async function testFileManagement() {
    console.log(`\n${colors.cyan}📁 Testing File Management Endpoints${colors.reset}`);
    
    try {
        const headers = { 'Authorization': `Bearer ${authTokens.admin}` };
        
        // Note: File upload tests require FormData, which is complex with raw Node.js
        // Testing the endpoint availability instead
        
        // Test file download endpoint (will likely return 404 for non-existent file)
        const downloadResponse = await makeRequest('/uploads/test_file.pdf');
        logTest('GET /uploads/:filename - File download endpoint', 
            downloadResponse.statusCode === 404 || downloadResponse.statusCode === 200,
            'file download endpoint responds',
            'file download endpoint responds'
        );

    } catch (error) {
        logTest('File Management Tests', false, null, null, error);
    }
}

async function testAdvancedSearch() {
    console.log(`\n${colors.cyan}🔍 Testing Advanced Search Endpoints${colors.reset}`);
    
    try {
        const headers = { 'Authorization': `Bearer ${authTokens.admin}` };
        
        // Test universal search
        const searchResponse = await makeRequest(`${API_BASE}/search?q=test&type=clients&limit=5`, 'GET', null, headers);
        logTest('GET /api/v1/search - Universal search', 
            searchResponse.statusCode === 200,
            'search results returned',
            searchResponse.statusCode === 200 ? 'search results returned' : 'search failed'
        );

        // Test search without query
        const emptySearchResponse = await makeRequest(`${API_BASE}/search`, 'GET', null, headers);
        logTest('GET /api/v1/search - Empty search query', 
            emptySearchResponse.statusCode === 200 || emptySearchResponse.statusCode === 400,
            'handles empty search gracefully',
            'handles empty search gracefully'
        );

    } catch (error) {
        logTest('Advanced Search Tests', false, null, null, error);
    }
}

async function testEmailSystem() {
    console.log(`\n${colors.cyan}📧 Testing Email System Endpoints${colors.reset}`);
    
    try {
        if (authTokens.admin) {
            const headers = { 'Authorization': `Bearer ${authTokens.admin}` };
            
            // Test send email endpoint
            const emailData = {
                to: 'test@example.com',
                subject: 'Test Email from API Test Suite',
                message: 'This is a test email sent during API testing',
                type: 'test'
            };
            
            const emailResponse = await makeRequest(`${API_BASE}/test/send-email`, 'POST', emailData, headers);
            logTest('POST /api/v1/test/send-email - Send test email (Admin)', 
                emailResponse.statusCode === 200,
                'email sent successfully',
                emailResponse.data.success ? 'email sent successfully' : 'email send failed'
            );
        }

    } catch (error) {
        logTest('Email System Tests', false, null, null, error);
    }
}

async function testAuthorizationLevels() {
    console.log(`\n${colors.cyan}🛡️ Testing Authorization & Security${colors.reset}`);
    
    try {
        // Test accessing admin endpoint without token
        const noAuthResponse = await makeRequest(`${API_BASE}/admins/users/by-superadmin`);
        logTest('Authorization - Admin endpoint without token', 
            noAuthResponse.statusCode === 401 || !noAuthResponse.data.success,
            'access denied',
            noAuthResponse.statusCode === 401 ? 'access denied' : 'unexpected access granted'
        );

        // Test accessing super admin endpoint with regular admin token
        if (authTokens.admin) {
            const wrongRoleHeaders = { 'Authorization': `Bearer ${authTokens.admin}` };
            const wrongRoleResponse = await makeRequest(`${API_BASE}/admins/users/by-superadmin`, 'GET', null, wrongRoleHeaders);
            logTest('Authorization - Super admin endpoint with admin token', 
                wrongRoleResponse.statusCode === 403 || !wrongRoleResponse.data.success,
                'insufficient permissions',
                wrongRoleResponse.statusCode === 403 ? 'insufficient permissions' : 'unexpected access granted'
            );
        }

        // Test invalid token
        const invalidTokenHeaders = { 'Authorization': 'Bearer invalid_token_here' };
        const invalidTokenResponse = await makeRequest(`${API_BASE}/users/profile`, 'GET', null, invalidTokenHeaders);
        logTest('Authorization - Invalid JWT token', 
            invalidTokenResponse.statusCode === 401 || invalidTokenResponse.statusCode === 403,
            'token validation failed',
            (invalidTokenResponse.statusCode === 401 || invalidTokenResponse.statusCode === 403) ? 'token validation failed' : 'unexpected token acceptance'
        );

    } catch (error) {
        logTest('Authorization & Security Tests', false, null, null, error);
    }
}

// Main Test Runner
async function runAllTests() {
    console.log(`${colors.bright}🧪 FINAID HUB - END-TO-END API TEST SUITE${colors.reset}`);
    console.log(`${colors.cyan}Testing Backend: ${BASE_URL}${colors.reset}\n`);
    
    const startTime = Date.now();
    
    try {
        // Core functionality tests
        await testHealthCheck();
        await testAuthentication();
        
        // Feature tests (require authentication)
        await testUserManagement();
        await testLicenseManagement();
        await testFinAidProfiles();
        await testClientManagement();
        await testQuickBooksIntegration();
        await testAIAgentSystem();
        await testFileManagement();
        await testAdvancedSearch();
        await testEmailSystem();
        
        // Security tests
        await testAuthorizationLevels();
        
    } catch (error) {
        console.log(`${colors.red}❌ Test suite execution error: ${error.message}${colors.reset}`);
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Print final results
    console.log(`\n${colors.bright}📊 TEST RESULTS SUMMARY${colors.reset}`);
    console.log(`${colors.cyan}Duration: ${duration} seconds${colors.reset}`);
    console.log(`${colors.green}✅ Passed: ${testResults.passed}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${testResults.failed}${colors.reset}`);
    console.log(`${colors.blue}📈 Total: ${testResults.total}${colors.reset}`);
    
    const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
    console.log(`${colors.magenta}🎯 Success Rate: ${successRate}%${colors.reset}`);
    
    if (testResults.failed > 0) {
        console.log(`\n${colors.red}❌ FAILED TESTS:${colors.reset}`);
        testResults.failedTests.forEach((test, index) => {
            console.log(`${colors.red}${index + 1}. ${test.name}${colors.reset}`);
            if (test.expected && test.actual) {
                console.log(`   Expected: ${test.expected}`);
                console.log(`   Actual: ${test.actual}`);
            }
            if (test.error) {
                console.log(`   Error: ${test.error}`);
            }
        });
    }
    
    // Overall status
    if (testResults.failed === 0) {
        console.log(`\n${colors.green}🎉 ALL TESTS PASSED! API is fully functional.${colors.reset}`);
    } else if (successRate >= 80) {
        console.log(`\n${colors.yellow}⚠️  Most tests passed. API is largely functional with minor issues.${colors.reset}`);
    } else {
        console.log(`\n${colors.red}🚨 Multiple test failures. API requires attention.${colors.reset}`);
    }
    
    // Save results to file
    const reportData = {
        timestamp: new Date().toISOString(),
        duration: `${duration} seconds`,
        results: testResults,
        authTokens: Object.keys(authTokens).map(type => ({ 
            type, 
            hasToken: !!authTokens[type],
            tokenLength: authTokens[type] ? authTokens[type].length : 0
        })),
        summary: {
            successRate: `${successRate}%`,
            status: testResults.failed === 0 ? 'ALL_PASS' : successRate >= 80 ? 'MOSTLY_PASS' : 'MULTIPLE_FAILURES'
        }
    };
    
    const reportPath = path.join(__dirname, 'test-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`\n📝 Test report saved to: ${reportPath}`);
}

// Check if server is running before starting tests
async function checkServerStatus() {
    try {
        console.log(`${colors.cyan}🔍 Checking if FinAid Hub server is running...${colors.reset}`);
        const response = await makeRequest('/health');
        if (response.statusCode === 200) {
            console.log(`${colors.green}✅ Server is running and healthy!${colors.reset}`);
            return true;
        } else {
            console.log(`${colors.red}❌ Server returned status ${response.statusCode}${colors.reset}`);
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}❌ Cannot connect to server: ${error.message}${colors.reset}`);
        console.log(`${colors.yellow}💡 Make sure the server is running with: node simple-server.js${colors.reset}`);
        return false;
    }
}

// Entry point
async function main() {
    const serverRunning = await checkServerStatus();
    
    if (serverRunning) {
        await runAllTests();
    } else {
        console.log(`\n${colors.red}🚫 Tests aborted - server not accessible${colors.reset}`);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    runAllTests,
    makeRequest,
    testResults,
    colors
};