const axios = require('axios');

// Test the geolocation blocking middleware
async function testGeoBlock() {
  const baseURL = 'http://localhost:3000'; // Adjust port as needed
  
  const testCases = [
    {
      name: 'Blocked US State (Michigan)',
      ip: '98.207.254.136', // Michigan IP
      expectedBlocked: true
    },
    {
      name: 'Blocked Country (Mexico)',
      ip: '187.188.0.1', // Mexico IP
      expectedBlocked: true
    },
    {
      name: 'Allowed Region (California)',
      ip: '8.8.8.8', // Google DNS (usually US)
      expectedBlocked: false
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\nTesting: ${testCase.name}`);
      console.log(`IP: ${testCase.ip}`);
      
      const response = await axios.post(`${baseURL}/api/v1/user/login`, {
        username: 'test',
        password: 'test'
      }, {
        headers: {
          'X-Forwarded-For': testCase.ip,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Allowed (expected: ' + !testCase.expectedBlocked + ')');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('🚫 Blocked (expected: ' + testCase.expectedBlocked + ')');
        console.log('Error:', error.response.data.error);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
  }
}

testGeoBlock(); 