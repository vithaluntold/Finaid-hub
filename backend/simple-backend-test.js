// Simple test to verify backend separation works
const axios = require('axios');

const BASE_URL = 'http://localhost:9003';

async function testBackend() {
    try {
        console.log('🧪 Testing New Backend Structure');
        console.log('==================================\n');
        
        // Test health endpoint
        console.log('❤️  Testing Health Endpoint...');
        const healthResponse = await axios.get(`${BASE_URL}/api/v1/health`);
        console.log('✅ Health check SUCCESS!');
        console.log(`   Status: ${healthResponse.data.status}`);
        console.log(`   Version: ${healthResponse.data.version}\n`);
        
        // Test authentication
        console.log('🔐 Testing Authentication...');
        const authResponse = await axios.post(`${BASE_URL}/api/v1/auth`, {
            username: 'admin@finaidhub.io',
            password: 'admin123'
        });
        
        console.log('✅ Authentication SUCCESS!');
        console.log(`   User: ${authResponse.data.data.user.first_name} ${authResponse.data.data.user.last_name}`);
        console.log(`   Role: ${authResponse.data.data.user.user_type}\n`);
        
        // Test protected endpoint
        console.log('🔒 Testing Protected Endpoint...');
        const token = authResponse.data.data.token;
        const usersResponse = await axios.get(`${BASE_URL}/api/v1/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('✅ Protected endpoint SUCCESS!');
        console.log(`   Users found: ${usersResponse.data.data.users.length}\n`);
        
        console.log('🎉 ALL BACKEND TESTS PASSED!');
        console.log('🚀 New backend structure is working correctly!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

testBackend();