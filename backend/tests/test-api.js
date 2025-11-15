const http = require('http');

// Test function to make HTTP requests
function testAPI(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 9000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    data: data
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Starting API Tests...\n');
    
    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing Health Check...');
        const health = await testAPI('/health');
        console.log(`   Status: ${health.status}`);
        console.log(`   Response: ${health.data}\n`);

        // Test 2: API Base
        console.log('2️⃣ Testing API Base...');
        const apiBase = await testAPI('/api/v1');
        console.log(`   Status: ${apiBase.status}`);
        console.log(`   Response: ${apiBase.data}\n`);

        // Test 3: Login Endpoint
        console.log('3️⃣ Testing Login...');
        const loginData = {
            email: 'admin@finaidhub.com',
            password: 'admin123'
        };
        const login = await testAPI('/api/v1/auth/login', 'POST', loginData);
        console.log(`   Status: ${login.status}`);
        console.log(`   Response: ${login.data}\n`);

        // Test 4: Dashboard Stats
        console.log('4️⃣ Testing Dashboard Stats...');
        const stats = await testAPI('/api/v1/dashboard/stats');
        console.log(`   Status: ${stats.status}`);
        console.log(`   Response: ${stats.data}\n`);

        // Test 5: Clients List
        console.log('5️⃣ Testing Clients List...');
        const clients = await testAPI('/api/v1/clients');
        console.log(`   Status: ${clients.status}`);
        console.log(`   Response: ${clients.data.substring(0, 200)}...\n`);

        console.log('✅ All tests completed!');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

runTests();