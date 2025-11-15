const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:9002';
const API_BASE = '/api/v1';

// Test credentials (matching server defaults)
const testCredentials = {
    superAdmin: { username: 'superadmin@finaidhub.io', password: 'password123' },
    admin: { username: 'admin@finaidhub.io', password: 'admin123' },
    accountant: { username: 'accountant@firm.com', password: 'acc123' },
    firmOwner: { username: 'owner@firm.com', password: 'owner123' }
};

// Colors for output
const colors = {
    reset: '\x1b[0m', bright: '\x1b[1m', red: '\x1b[31m',
    green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[34m',
    magenta: '\x1b[35m', cyan: '\x1b[36m'
};

// Delay function to avoid rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test Results
let healthCheck = {
    server: { status: 'unknown', details: null },
    authentication: { status: 'unknown', tokens: {} },
    coreEndpoints: { status: 'unknown', working: [], failing: [] },
    dataIntegrity: { status: 'unknown', details: {} },
    security: { status: 'unknown', details: {} },
    frontend: { status: 'unknown', details: {} },
    overall: { status: 'unknown', score: 0 }
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
                'User-Agent': 'FinAidHub-HealthCheck/1.0',
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

        req.setTimeout(15000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        if (data && method !== 'GET') {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// 1. Server Health Check
async function checkServerHealth() {
    console.log(`${colors.cyan}🏥 CHECKING SERVER HEALTH${colors.reset}\n`);
    
    try {
        // Wait a bit to avoid rate limiting
        await delay(1000);
        
        // Basic connectivity
        const healthResponse = await makeRequest('/health');
        
        if (healthResponse.statusCode === 200 && 
            healthResponse.data.success && 
            healthResponse.data.data?.status === 'OK') {
            
            healthCheck.server.status = 'healthy';
            healthCheck.server.details = {
                uptime: healthResponse.data.data.uptime,
                memory: healthResponse.data.data.memory,
                pid: healthResponse.data.data.pid
            };
            
            console.log(`${colors.green}✅ Server is healthy and running${colors.reset}`);
            console.log(`   Uptime: ${Math.floor(healthResponse.data.data.uptime)}s`);
            console.log(`   Memory: ${Math.round(healthResponse.data.data.memory.heapUsed / 1024 / 1024)}MB`);
            
        } else {
            healthCheck.server.status = 'unhealthy';
            console.log(`${colors.red}❌ Server health check failed${colors.reset}`);
        }
        
        // API root check
        await delay(500);
        const rootResponse = await makeRequest('/');
        if (rootResponse.statusCode === 200) {
            console.log(`${colors.green}✅ API root responding${colors.reset}`);
        }
        
    } catch (error) {
        healthCheck.server.status = 'down';
        healthCheck.server.details = { error: error.message };
        console.log(`${colors.red}❌ Server is down: ${error.message}${colors.reset}`);
        return false;
    }
    
    return healthCheck.server.status === 'healthy';
}

// 2. Authentication System Check
async function checkAuthentication() {
    console.log(`\n${colors.cyan}🔐 CHECKING AUTHENTICATION SYSTEM${colors.reset}\n`);
    
    let workingUsers = 0;
    let totalUsers = Object.keys(testCredentials).length;
    
    for (const [userType, credentials] of Object.entries(testCredentials)) {
        try {
            const loginResponse = await makeRequest(`${API_BASE}/auth`, 'POST', credentials);
            
            if (loginResponse.statusCode === 200 && 
                loginResponse.data.success && 
                loginResponse.data.data?.token) {
                
                healthCheck.authentication.tokens[userType] = loginResponse.data.data.token;
                workingUsers++;
                
                console.log(`${colors.green}✅ ${userType} authentication working${colors.reset}`);
            } else {
                console.log(`${colors.red}❌ ${userType} authentication failed${colors.reset}`);
                console.log(`   Error: ${loginResponse.data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.log(`${colors.red}❌ ${userType} authentication error: ${error.message}${colors.reset}`);
        }
    }
    
    // Test invalid credentials
    try {
        const invalidResponse = await makeRequest(`${API_BASE}/auth`, 'POST', {
            username: 'invalid@test.com',
            password: 'wrongpassword'
        });
        
        if (invalidResponse.statusCode === 401 || !invalidResponse.data.success) {
            console.log(`${colors.green}✅ Invalid credentials properly rejected${colors.reset}`);
        } else {
            console.log(`${colors.yellow}⚠️  Invalid credentials not properly rejected${colors.reset}`);
        }
    } catch (error) {
        console.log(`${colors.yellow}⚠️  Could not test invalid credentials${colors.reset}`);
    }
    
    const authSuccessRate = (workingUsers / totalUsers) * 100;
    healthCheck.authentication.status = authSuccessRate >= 75 ? 'good' : authSuccessRate >= 50 ? 'partial' : 'poor';
    
    console.log(`\n📊 Authentication Success Rate: ${authSuccessRate.toFixed(1)}% (${workingUsers}/${totalUsers})`);
    
    return workingUsers > 0;
}

// 3. Core Endpoints Check
async function checkCoreEndpoints() {
    console.log(`\n${colors.cyan}🚀 CHECKING CORE ENDPOINTS${colors.reset}\n`);
    
    const adminToken = healthCheck.authentication.tokens.admin;
    const headers = adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {};
    
    const coreEndpoints = [
        // Public endpoints
        { path: '/health', method: 'GET', name: 'Health Check', requireAuth: false },
        { path: '/', method: 'GET', name: 'API Root', requireAuth: false },
        { path: `${API_BASE}/finaid-profiles`, method: 'GET', name: 'FinAid Profiles', requireAuth: false },
        { path: `${API_BASE}/finaid-profiles/filter`, method: 'GET', name: 'Profile Filter', requireAuth: false },
        
        // Protected endpoints
        { path: `${API_BASE}/users/profile`, method: 'GET', name: 'User Profile', requireAuth: true },
        { path: `${API_BASE}/licenses/my-licenses`, method: 'GET', name: 'My Licenses', requireAuth: true },
        { path: `${API_BASE}/clients`, method: 'GET', name: 'Clients List', requireAuth: true },
        { path: `${API_BASE}/client-companies`, method: 'GET', name: 'Client Companies', requireAuth: true },
        { path: `${API_BASE}/search?q=test`, method: 'GET', name: 'Search', requireAuth: true },
        
        // QuickBooks endpoints
        { path: `${API_BASE}/quickbooks/authorize`, method: 'GET', name: 'QuickBooks Auth', requireAuth: true },
        
        // AI Agent endpoints
        { path: `${API_BASE}/finaid-agent/runs/company/test123`, method: 'GET', name: 'AI Runs', requireAuth: true },
        { path: `${API_BASE}/finaid-agent/vector/get?query=test`, method: 'GET', name: 'Vector Search', requireAuth: true },
    ];
    
    let workingEndpoints = 0;
    
    for (const endpoint of coreEndpoints) {
        try {
            const testHeaders = endpoint.requireAuth ? headers : {};
            const response = await makeRequest(endpoint.path, endpoint.method, null, testHeaders);
            
            // Consider 200-299 status codes as success, also 401 for auth-protected endpoints without tokens
            const isSuccess = (response.statusCode >= 200 && response.statusCode < 300) ||
                             (endpoint.requireAuth && !adminToken && response.statusCode === 401);
            
            if (isSuccess) {
                healthCheck.coreEndpoints.working.push(endpoint.name);
                workingEndpoints++;
                console.log(`${colors.green}✅ ${endpoint.name}${colors.reset}`);
            } else {
                healthCheck.coreEndpoints.failing.push({
                    name: endpoint.name,
                    status: response.statusCode,
                    error: response.data.message || 'Unknown error'
                });
                console.log(`${colors.red}❌ ${endpoint.name} (${response.statusCode})${colors.reset}`);
            }
        } catch (error) {
            healthCheck.coreEndpoints.failing.push({
                name: endpoint.name,
                status: 'ERROR',
                error: error.message
            });
            console.log(`${colors.red}❌ ${endpoint.name} (ERROR: ${error.message})${colors.reset}`);
        }
    }
    
    const endpointSuccessRate = (workingEndpoints / coreEndpoints.length) * 100;
    healthCheck.coreEndpoints.status = endpointSuccessRate >= 80 ? 'excellent' : 
                                      endpointSuccessRate >= 60 ? 'good' : 
                                      endpointSuccessRate >= 40 ? 'fair' : 'poor';
    
    console.log(`\n📊 Core Endpoints Success Rate: ${endpointSuccessRate.toFixed(1)}% (${workingEndpoints}/${coreEndpoints.length})`);
    
    return endpointSuccessRate >= 60;
}

// 4. Data Integrity Check
async function checkDataIntegrity() {
    console.log(`\n${colors.cyan}📊 CHECKING DATA INTEGRITY${colors.reset}\n`);
    
    const adminToken = healthCheck.authentication.tokens.admin;
    if (!adminToken) {
        console.log(`${colors.yellow}⚠️  Skipping data checks - no admin token available${colors.reset}`);
        healthCheck.dataIntegrity.status = 'skipped';
        return false;
    }
    
    const headers = { 'Authorization': `Bearer ${adminToken}` };
    let checks = { passed: 0, total: 0 };
    
    // Check if default data exists
    try {
        const profilesResponse = await makeRequest(`${API_BASE}/finaid-profiles`, 'GET');
        checks.total++;
        if (profilesResponse.statusCode === 200 && Array.isArray(profilesResponse.data.profiles)) {
            checks.passed++;
            console.log(`${colors.green}✅ FinAid Profiles data structure valid${colors.reset}`);
            healthCheck.dataIntegrity.details.profiles = profilesResponse.data.profiles.length;
        } else {
            console.log(`${colors.red}❌ FinAid Profiles data structure invalid${colors.reset}`);
        }
    } catch (error) {
        checks.total++;
        console.log(`${colors.red}❌ Could not check FinAid Profiles: ${error.message}${colors.reset}`);
    }
    
    // Check user data
    try {
        const userResponse = await makeRequest(`${API_BASE}/users/profile`, 'GET', null, headers);
        checks.total++;
        if (userResponse.statusCode === 200 && userResponse.data.success) {
            checks.passed++;
            console.log(`${colors.green}✅ User profile data accessible${colors.reset}`);
            healthCheck.dataIntegrity.details.userProfile = true;
        } else {
            console.log(`${colors.red}❌ User profile data inaccessible${colors.reset}`);
        }
    } catch (error) {
        checks.total++;
        console.log(`${colors.red}❌ Could not check user profile: ${error.message}${colors.reset}`);
    }
    
    // Test CRUD operations
    try {
        const createClientData = {
            name: 'Test Client Health Check',
            email: 'healthcheck@test.com',
            phone: '+1234567890'
        };
        
        const createResponse = await makeRequest(`${API_BASE}/clients`, 'POST', createClientData, headers);
        checks.total++;
        if (createResponse.statusCode === 200 || createResponse.statusCode === 201) {
            checks.passed++;
            console.log(`${colors.green}✅ CRUD operations working (Create)${colors.reset}`);
            healthCheck.dataIntegrity.details.crud = true;
        } else {
            console.log(`${colors.red}❌ CRUD operations failing: ${createResponse.data.message}${colors.reset}`);
        }
    } catch (error) {
        checks.total++;
        console.log(`${colors.red}❌ CRUD test failed: ${error.message}${colors.reset}`);
    }
    
    const dataIntegrityRate = (checks.passed / checks.total) * 100;
    healthCheck.dataIntegrity.status = dataIntegrityRate >= 75 ? 'excellent' : 
                                      dataIntegrityRate >= 50 ? 'good' : 'poor';
    
    console.log(`\n📊 Data Integrity Score: ${dataIntegrityRate.toFixed(1)}% (${checks.passed}/${checks.total})`);
    
    return dataIntegrityRate >= 50;
}

// 5. Security Check
async function checkSecurity() {
    console.log(`\n${colors.cyan}🛡️ CHECKING SECURITY MEASURES${colors.reset}\n`);
    
    let securityChecks = { passed: 0, total: 0 };
    
    // Test unauthorized access
    try {
        const unauthorizedResponse = await makeRequest(`${API_BASE}/users/profile`, 'GET');
        securityChecks.total++;
        if (unauthorizedResponse.statusCode === 401) {
            securityChecks.passed++;
            console.log(`${colors.green}✅ Unauthorized access properly blocked${colors.reset}`);
        } else {
            console.log(`${colors.red}❌ Security vulnerability: Unauthorized access allowed${colors.reset}`);
        }
    } catch (error) {
        securityChecks.total++;
        console.log(`${colors.yellow}⚠️  Could not test unauthorized access${colors.reset}`);
    }
    
    // Test invalid JWT token
    try {
        const invalidTokenResponse = await makeRequest(`${API_BASE}/users/profile`, 'GET', null, {
            'Authorization': 'Bearer invalid_token_here'
        });
        securityChecks.total++;
        if (invalidTokenResponse.statusCode === 401 || invalidTokenResponse.statusCode === 403) {
            securityChecks.passed++;
            console.log(`${colors.green}✅ Invalid JWT tokens properly rejected${colors.reset}`);
        } else {
            console.log(`${colors.red}❌ Security vulnerability: Invalid tokens accepted${colors.reset}`);
        }
    } catch (error) {
        securityChecks.total++;
        console.log(`${colors.yellow}⚠️  Could not test invalid tokens${colors.reset}`);
    }
    
    // Check rate limiting headers
    try {
        const rateLimitResponse = await makeRequest('/health');
        securityChecks.total++;
        if (rateLimitResponse.headers['x-ratelimit-limit']) {
            securityChecks.passed++;
            console.log(`${colors.green}✅ Rate limiting active${colors.reset}`);
            console.log(`   Limit: ${rateLimitResponse.headers['x-ratelimit-limit']} requests`);
        } else {
            console.log(`${colors.yellow}⚠️  Rate limiting not detected${colors.reset}`);
        }
    } catch (error) {
        securityChecks.total++;
        console.log(`${colors.yellow}⚠️  Could not check rate limiting${colors.reset}`);
    }
    
    // Check security headers
    try {
        const securityResponse = await makeRequest('/health');
        securityChecks.total++;
        const securityHeaders = ['content-security-policy', 'x-frame-options', 'x-content-type-options'];
        const presentHeaders = securityHeaders.filter(header => securityResponse.headers[header]);
        
        if (presentHeaders.length >= 2) {
            securityChecks.passed++;
            console.log(`${colors.green}✅ Security headers present (${presentHeaders.length}/${securityHeaders.length})${colors.reset}`);
        } else {
            console.log(`${colors.yellow}⚠️  Limited security headers (${presentHeaders.length}/${securityHeaders.length})${colors.reset}`);
        }
    } catch (error) {
        securityChecks.total++;
        console.log(`${colors.yellow}⚠️  Could not check security headers${colors.reset}`);
    }
    
    const securityScore = (securityChecks.passed / securityChecks.total) * 100;
    healthCheck.security.status = securityScore >= 75 ? 'secure' : securityScore >= 50 ? 'moderate' : 'weak';
    healthCheck.security.details = { score: securityScore, checks: securityChecks };
    
    console.log(`\n📊 Security Score: ${securityScore.toFixed(1)}% (${securityChecks.passed}/${securityChecks.total})`);
    
    return securityScore >= 50;
}

// 6. Frontend Integration Check
async function checkFrontendIntegration() {
    console.log(`\n${colors.cyan}🖥️ CHECKING FRONTEND INTEGRATION${colors.reset}\n`);
    
    const frontendPath = path.join(__dirname, 'globalxchange-studio-finaid-78c2970a0ea2');
    
    // Check if frontend exists
    if (!fs.existsSync(frontendPath)) {
        console.log(`${colors.red}❌ Frontend directory not found${colors.reset}`);
        healthCheck.frontend.status = 'missing';
        return false;
    }
    
    // Check package.json
    const packageJsonPath = path.join(frontendPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        console.log(`${colors.green}✅ Frontend package.json exists${colors.reset}`);
        console.log(`   Framework: Next.js ${packageJson.dependencies?.next || 'Unknown'}`);
        healthCheck.frontend.details.framework = 'Next.js';
        healthCheck.frontend.details.dependencies = Object.keys(packageJson.dependencies || {}).length;
    }
    
    // Check if node_modules exists
    const nodeModulesPath = path.join(frontendPath, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
        console.log(`${colors.green}✅ Frontend dependencies installed${colors.reset}`);
        healthCheck.frontend.details.dependenciesInstalled = true;
    } else {
        console.log(`${colors.yellow}⚠️  Frontend dependencies not installed${colors.reset}`);
        healthCheck.frontend.details.dependenciesInstalled = false;
    }
    
    // Check API integration patterns
    try {
        const apiUsageCount = await checkApiUsageInFrontend(frontendPath);
        if (apiUsageCount > 0) {
            console.log(`${colors.green}✅ Frontend-Backend integration detected (${apiUsageCount} API calls)${colors.reset}`);
            healthCheck.frontend.details.apiIntegration = apiUsageCount;
        } else {
            console.log(`${colors.yellow}⚠️  Limited frontend-backend integration detected${colors.reset}`);
        }
    } catch (error) {
        console.log(`${colors.yellow}⚠️  Could not analyze frontend integration${colors.reset}`);
    }
    
    healthCheck.frontend.status = 'present';
    return true;
}

async function checkApiUsageInFrontend(frontendPath) {
    const { execSync } = require('child_process');
    
    try {
        // Search for API calls in TypeScript/JavaScript files
        const result = execSync(
            `grep -r "api/v1\\|fetch\\|axios" "${frontendPath}" --include="*.tsx" --include="*.ts" --include="*.js" --include="*.jsx" | wc -l`,
            { encoding: 'utf8', shell: true }
        );
        return parseInt(result.trim()) || 0;
    } catch (error) {
        // Fallback: manual count if grep fails
        return 0;
    }
}

// 7. Generate Overall Health Score
function calculateOverallHealth() {
    console.log(`\n${colors.cyan}📈 CALCULATING OVERALL HEALTH${colors.reset}\n`);
    
    let totalScore = 0;
    let maxScore = 0;
    
    // Server Health (25 points)
    maxScore += 25;
    if (healthCheck.server.status === 'healthy') totalScore += 25;
    else if (healthCheck.server.status === 'unhealthy') totalScore += 10;
    
    // Authentication (20 points)
    maxScore += 20;
    const authTokenCount = Object.keys(healthCheck.authentication.tokens).length;
    totalScore += (authTokenCount / 4) * 20;
    
    // Core Endpoints (25 points)
    maxScore += 25;
    const endpointScore = (healthCheck.coreEndpoints.working.length / 
                          (healthCheck.coreEndpoints.working.length + healthCheck.coreEndpoints.failing.length)) * 25;
    totalScore += endpointScore || 0;
    
    // Data Integrity (15 points)
    maxScore += 15;
    if (healthCheck.dataIntegrity.status === 'excellent') totalScore += 15;
    else if (healthCheck.dataIntegrity.status === 'good') totalScore += 12;
    else if (healthCheck.dataIntegrity.status === 'poor') totalScore += 5;
    
    // Security (10 points)
    maxScore += 10;
    if (healthCheck.security.status === 'secure') totalScore += 10;
    else if (healthCheck.security.status === 'moderate') totalScore += 7;
    else if (healthCheck.security.status === 'weak') totalScore += 3;
    
    // Frontend (5 points)
    maxScore += 5;
    if (healthCheck.frontend.status === 'present') totalScore += 5;
    
    const overallScore = (totalScore / maxScore) * 100;
    healthCheck.overall.score = overallScore;
    
    if (overallScore >= 90) {
        healthCheck.overall.status = 'excellent';
        console.log(`${colors.green}🎉 EXCELLENT HEALTH${colors.reset}`);
    } else if (overallScore >= 75) {
        healthCheck.overall.status = 'good';
        console.log(`${colors.green}✅ GOOD HEALTH${colors.reset}`);
    } else if (overallScore >= 60) {
        healthCheck.overall.status = 'fair';
        console.log(`${colors.yellow}⚠️  FAIR HEALTH${colors.reset}`);
    } else if (overallScore >= 40) {
        healthCheck.overall.status = 'poor';
        console.log(`${colors.red}❌ POOR HEALTH${colors.reset}`);
    } else {
        healthCheck.overall.status = 'critical';
        console.log(`${colors.red}🚨 CRITICAL HEALTH${colors.reset}`);
    }
    
    console.log(`\n📊 Overall Health Score: ${overallScore.toFixed(1)}% (${totalScore.toFixed(1)}/${maxScore})`);
}

// Main Health Check Runner
async function runCompleteHealthCheck() {
    console.log(`${colors.bright}🔍 FINAID HUB - COMPLETE HEALTH CHECK${colors.reset}`);
    console.log(`${colors.cyan}Testing: ${BASE_URL}${colors.reset}`);
    console.log(`${colors.cyan}Timestamp: ${new Date().toISOString()}${colors.reset}\n`);
    
    const startTime = Date.now();
    
    // Run all health checks
    const serverOk = await checkServerHealth();
    
    if (!serverOk) {
        console.log(`\n${colors.red}🚨 Server is down - aborting further checks${colors.reset}`);
        return;
    }
    
    await checkAuthentication();
    await checkCoreEndpoints();
    await checkDataIntegrity();
    await checkSecurity();
    await checkFrontendIntegration();
    
    calculateOverallHealth();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Generate detailed report
    console.log(`\n${colors.bright}📋 DETAILED HEALTH REPORT${colors.reset}`);
    console.log(`${colors.cyan}Duration: ${duration} seconds${colors.reset}\n`);
    
    console.log(`🖥️  Server: ${getStatusEmoji(healthCheck.server.status)} ${healthCheck.server.status}`);
    console.log(`🔐 Authentication: ${getStatusEmoji(healthCheck.authentication.status)} ${healthCheck.authentication.status} (${Object.keys(healthCheck.authentication.tokens).length}/4 users)`);
    console.log(`🚀 Core Endpoints: ${getStatusEmoji(healthCheck.coreEndpoints.status)} ${healthCheck.coreEndpoints.status} (${healthCheck.coreEndpoints.working.length} working)`);
    console.log(`📊 Data Integrity: ${getStatusEmoji(healthCheck.dataIntegrity.status)} ${healthCheck.dataIntegrity.status}`);
    console.log(`🛡️  Security: ${getStatusEmoji(healthCheck.security.status)} ${healthCheck.security.status}`);
    console.log(`🖥️  Frontend: ${getStatusEmoji(healthCheck.frontend.status)} ${healthCheck.frontend.status}`);
    
    console.log(`\n${colors.bright}🎯 OVERALL HEALTH: ${getStatusEmoji(healthCheck.overall.status)} ${healthCheck.overall.status.toUpperCase()} (${healthCheck.overall.score.toFixed(1)}%)${colors.reset}`);
    
    // Save detailed report
    const reportPath = path.join(__dirname, 'health-check-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        duration: `${duration} seconds`,
        healthCheck,
        summary: {
            overall: healthCheck.overall.status,
            score: healthCheck.overall.score,
            server: healthCheck.server.status,
            authentication: healthCheck.authentication.status,
            endpoints: healthCheck.coreEndpoints.status,
            dataIntegrity: healthCheck.dataIntegrity.status,
            security: healthCheck.security.status,
            frontend: healthCheck.frontend.status
        }
    }, null, 2));
    
    console.log(`\n📝 Detailed report saved to: ${reportPath}`);
    
    // Recommendations
    if (healthCheck.overall.score < 80) {
        console.log(`\n${colors.yellow}💡 RECOMMENDATIONS:${colors.reset}`);
        
        if (healthCheck.coreEndpoints.failing.length > 0) {
            console.log(`   • Fix failing endpoints: ${healthCheck.coreEndpoints.failing.map(e => e.name).join(', ')}`);
        }
        
        if (Object.keys(healthCheck.authentication.tokens).length < 4) {
            console.log(`   • Check user authentication credentials`);
        }
        
        if (healthCheck.security.status === 'weak') {
            console.log(`   • Strengthen security measures`);
        }
        
        if (!healthCheck.frontend.details?.dependenciesInstalled) {
            console.log(`   • Install frontend dependencies: npm install`);
        }
    }
}

function getStatusEmoji(status) {
    const emojis = {
        'excellent': '🎉', 'healthy': '✅', 'good': '✅', 'secure': '🔒',
        'fair': '⚠️', 'moderate': '⚠️', 'partial': '⚠️', 'present': '✅',
        'poor': '❌', 'weak': '⚠️', 'unhealthy': '❌', 'critical': '🚨',
        'down': '💀', 'missing': '❓', 'skipped': '⏭️', 'unknown': '❓'
    };
    return emojis[status] || '❓';
}

// Run the complete health check
if (require.main === module) {
    runCompleteHealthCheck().catch(console.error);
}

module.exports = { runCompleteHealthCheck, healthCheck };