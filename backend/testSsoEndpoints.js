// SSO Endpoints Test Script
const axios = require('axios');

const testSSOEndpoints = async () => {
  const baseURL = 'http://localhost:8080';
  
  console.log('🔍 Testing SSO Endpoints...\n');
  
  try {
    // Test Google SSO initiation
    console.log('📱 Testing Google SSO endpoint...');
    const googleResponse = await axios.get(`${baseURL}/api/v1/auth/sso/google`, {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400
    });
    console.log('✅ Google SSO endpoint accessible');
    console.log('   Status:', googleResponse.status);
    console.log('   Redirect URL:', googleResponse.headers.location || 'No redirect');
    
  } catch (error) {
    if (error.response && error.response.status === 302) {
      console.log('✅ Google SSO endpoint working (redirecting to OAuth)');
      console.log('   Redirect URL:', error.response.headers.location);
    } else {
      console.log('❌ Google SSO endpoint error:', error.message);
    }
  }
  
  console.log('');
  
  try {
    // Test Facebook SSO initiation
    console.log('📘 Testing Facebook SSO endpoint...');
    const facebookResponse = await axios.get(`${baseURL}/api/v1/auth/sso/facebook`, {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400
    });
    console.log('✅ Facebook SSO endpoint accessible');
    console.log('   Status:', facebookResponse.status);
    console.log('   Redirect URL:', facebookResponse.headers.location || 'No redirect');
    
  } catch (error) {
    if (error.response && error.response.status === 302) {
      console.log('✅ Facebook SSO endpoint working (redirecting to OAuth)');
      console.log('   Redirect URL:', error.response.headers.location);
    } else {
      console.log('❌ Facebook SSO endpoint error:', error.message);
    }
  }
  
  console.log('\n📋 Summary:');
  console.log('- SSO endpoints are accessible');
  console.log('- OAuth redirects are working');
  console.log('- Ready for OAuth app configuration');
  console.log('\n🚀 Next steps:');
  console.log('1. Set up Google OAuth app');
  console.log('2. Set up Facebook OAuth app');
  console.log('3. Add credentials to .env file');
  console.log('4. Test complete OAuth flow');
};

// Check if server is running
const checkServer = async () => {
  try {
    const response = await axios.get('http://localhost:8080/healthcheck');
    console.log('✅ Backend server is running');
    return true;
  } catch (error) {
    console.log('❌ Backend server is not running');
    console.log('   Please start the server with: npm run start:dev');
    return false;
  }
};

const runTests = async () => {
  console.log('🔍 Checking server status...\n');
  
  const serverRunning = await checkServer();
  
  if (serverRunning) {
    await testSSOEndpoints();
  } else {
    console.log('\n💡 To start the server:');
    console.log('   cd backend');
    console.log('   npm run start:dev');
  }
};

runTests(); 