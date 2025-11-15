const http = require('http');

async function testConnection() {
    console.log('🔍 Testing direct connection to server...\n');
    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 9002,
            path: '/health',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            console.log(`Status Code: ${res.statusCode}`);
            console.log(`Headers:`, res.headers);
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`Raw Response: ${data}`);
                try {
                    const parsed = JSON.parse(data);
                    console.log('Parsed Response:', parsed);
                } catch (e) {
                    console.log('Response is not JSON:', data);
                }
                resolve({ statusCode: res.statusCode, data });
            });
        });

        req.on('error', (err) => {
            console.error('Request Error:', err.message);
            reject(err);
        });

        req.setTimeout(5000, () => {
            console.error('Request timeout');
            req.destroy();
            reject(new Error('Timeout'));
        });

        req.end();
    });
}

async function testAuth() {
    console.log('\n🔐 Testing authentication endpoint...\n');
    
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            username: 'admin@finaidhub.io',
            password: 'admin123'
        });

        const options = {
            hostname: 'localhost',
            port: 9002,
            path: '/api/v1/auth',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            console.log(`Status Code: ${res.statusCode}`);
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`Auth Response: ${data}`);
                try {
                    const parsed = JSON.parse(data);
                    console.log('Auth Parsed:', parsed);
                } catch (e) {
                    console.log('Auth response is not JSON:', data);
                }
                resolve({ statusCode: res.statusCode, data });
            });
        });

        req.on('error', (err) => {
            console.error('Auth Request Error:', err.message);
            reject(err);
        });

        req.write(postData);
        req.end();
    });
}

async function main() {
    try {
        await testConnection();
        await testAuth();
        console.log('\n✅ Manual testing completed!');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

main();