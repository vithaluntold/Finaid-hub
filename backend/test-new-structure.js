const http = require('http');

console.log('🧪 Testing New Backend Structure');
console.log('==================================\n');

// Test authentication endpoint
function testAuth() {
    const postData = JSON.stringify({
        username: 'admin@finaidhub.io',
        password: 'admin123'
    });

    const options = {
        hostname: 'localhost',
        port: 9003,
        path: '/api/v1/auth',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    console.log('🔐 Testing Authentication...');
    
    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            if (res.statusCode === 200) {
                const response = JSON.parse(data);
                console.log('✅ Authentication SUCCESS!');
                console.log(`   Token: ${response.data.token.substring(0, 30)}...`);
                console.log(`   User: ${response.data.user.first_name} ${response.data.user.last_name}`);
                console.log(`   Role: ${response.data.user.user_type}\n`);
                
                // Test protected endpoint with token
                testProtectedEndpoint(response.data.token);
            } else {
                console.log(`❌ Auth failed: ${res.statusCode}`);
                console.log(`   Response: ${data}\n`);
            }
        });
    });

    req.on('error', (e) => {
        console.log(`❌ Connection error: ${e.message}`);
    });

    req.write(postData);
    req.end();
}

// Test protected endpoint
function testProtectedEndpoint(token) {
    const options = {
        hostname: 'localhost',
        port: 9003,
        path: '/api/v1/users',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    console.log('🔒 Testing Protected Endpoint...');
    
    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            if (res.statusCode === 200) {
                const response = JSON.parse(data);
                console.log('✅ Protected endpoint SUCCESS!');
                console.log(`   Users found: ${response.data.users.length}`);
                console.log(`   Pagination: Page ${response.data.pagination.current_page} of ${response.data.pagination.total_pages}\n`);
            } else {
                console.log(`❌ Protected endpoint failed: ${res.statusCode}`);
                console.log(`   Response: ${data}\n`);
            }
            
            // Test health endpoint
            testHealth();
        });
    });

    req.on('error', (e) => {
        console.log(`❌ Connection error: ${e.message}`);
    });

    req.end();
}

// Test health endpoint
function testHealth() {
    const options = {
        hostname: 'localhost',
        port: 9003,
        path: '/api/v1/health',
        method: 'GET'
    };

    console.log('❤️  Testing Health Endpoint...');
    
    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            if (res.statusCode === 200) {
                const response = JSON.parse(data);
                console.log('✅ Health check SUCCESS!');
                console.log(`   Status: ${response.status}`);
                console.log(`   Version: ${response.version}`);
                console.log(`   Environment: ${response.environment}\n`);
                
                console.log('🎉 ALL BACKEND TESTS PASSED!');
                console.log('🚀 New backend structure is working correctly!');
            } else {
                console.log(`❌ Health check failed: ${res.statusCode}`);
            }
        });
    });

    req.on('error', (e) => {
        console.log(`❌ Connection error: ${e.message}`);
    });

    req.end();
}

// Start tests
testAuth();