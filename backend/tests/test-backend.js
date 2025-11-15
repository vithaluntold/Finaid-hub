// Quick test script to verify the backend fixes
const axios = require('axios');

const baseURL = 'http://localhost:9000';

async function testBackend() {
  console.log('🧪 Testing FinAidHub Backend...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check:', healthResponse.data.message);

    // Test 2: Authentication with Super Admin
    console.log('\n2. Testing authentication...');
    const authResponse = await axios.post(`${baseURL}/api/v1/auth`, {
      username: 'superadmin@finaidhub.io',
      password: 'password123'
    });
    
    if (authResponse.data.data.token) {
      console.log('✅ Authentication successful');
      console.log('   User:', authResponse.data.data.user.first_name, authResponse.data.data.user.last_name);
      console.log('   Role:', authResponse.data.data.user.user_type);
      
      const token = authResponse.data.data.token;

      // Test 3: Protected endpoint - Get user profile
      console.log('\n3. Testing protected endpoint...');
      const profileResponse = await axios.get(`${baseURL}/api/v1/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Protected endpoint works:', profileResponse.data.message);

      // Test 4: Get Fin(AI)d profiles
      console.log('\n4. Testing Fin(AI)d profiles...');
      const profilesResponse = await axios.get(`${baseURL}/api/v1/finaid-profiles`);
      console.log('✅ Fin(AI)d profiles:', profilesResponse.data.data.length, 'profiles found');

      // Test 5: Get licenses
      console.log('\n5. Testing licenses...');
      const licensesResponse = await axios.get(`${baseURL}/api/v1/licenses/my-licenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Licenses:', licensesResponse.data.data.licenses.length, 'licenses found');

    } else {
      console.log('❌ Authentication failed - no token received');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

// Run the test
testBackend();