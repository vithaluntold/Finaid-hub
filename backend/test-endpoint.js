const axios = require('axios');

async function testEndpoints() {
  console.log('🧪 Testing API Endpoints...\n');

  // Test 1: New RESTful endpoint
  try {
    const response1 = await axios.get('http://localhost:9003/api/v1/users/125bfed4-45a2-4773-8173-501974e26692');
    console.log('✅ /api/v1/users/:id endpoint working');
    console.log('Response:', JSON.stringify(response1.data, null, 2));
  } catch (error) {
    console.log('❌ /api/v1/users/:id failed:', error.message);
  }

  console.log('\n---\n');

  // Test 2: Finaid profiles endpoint
  try {
    const response2 = await axios.get('http://localhost:9003/api/v1/finaid-profiles');
    console.log('✅ /api/v1/finaid-profiles endpoint working');
    console.log(`Found ${response2.data.data.length} profiles`);
  } catch (error) {
    console.log('❌ /api/v1/finaid-profiles failed:', error.message);
  }

  console.log('\n---\n');

  // Test 3: External API
  try {
    const response3 = await axios.get('https://finaid.marketsverse.com/api/v1/predictor/get-supported-configs');
    console.log('✅ External API (marketsverse) working');
    console.log(`Platforms available: ${Object.keys(response3.data.data).length}`);
  } catch (error) {
    console.log('❌ External API failed:', error.message);
  }

  console.log('\n✅ All tests complete!');
}

testEndpoints();
