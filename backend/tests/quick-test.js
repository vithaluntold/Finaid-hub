const http = require('http');

function quickTest() {
    console.log('🔍 Quick server test...\n');
    
    const req = http.request({
        hostname: 'localhost',
        port: 9002,
        path: '/health',
        method: 'GET',
        timeout: 5000
    }, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers:`, JSON.stringify(res.headers, null, 2));
        
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`Response: ${data}`);
            
            if (res.statusCode === 200) {
                console.log('✅ Server is healthy!');
            } else if (res.statusCode === 429) {
                console.log('⚠️  Rate limited - server is working but too many requests');
            } else {
                console.log('❌ Unexpected response');
            }
        });
    });

    req.on('error', (err) => {
        console.log('❌ Connection error:', err.message);
    });

    req.on('timeout', () => {
        console.log('❌ Request timeout');
        req.destroy();
    });

    req.end();
}

quickTest();