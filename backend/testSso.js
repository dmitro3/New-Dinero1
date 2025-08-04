// SSO Configuration Test Script
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const testSSOConfig = () => {
  console.log('🔍 Testing SSO Configuration...\n');

  // Test Google OAuth Configuration
  console.log('📱 Google OAuth Configuration:');
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
  console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
  console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL || '❌ Missing');
  console.log('');

  // Test Facebook OAuth Configuration
  console.log('📘 Facebook OAuth Configuration:');
  console.log('FACEBOOK_APP_ID:', process.env.FACEBOOK_APP_ID ? '✅ Set' : '❌ Missing');
  console.log('FACEBOOK_APP_SECRET:', process.env.FACEBOOK_APP_SECRET ? '✅ Set' : '❌ Missing');
  console.log('FACEBOOK_CALLBACK_URL:', process.env.FACEBOOK_CALLBACK_URL || '❌ Missing');
  console.log('');

  // Test SSO Redirect Configuration
  console.log('🔄 SSO Redirect Configuration:');
  console.log('SSO_SUCCESS_REDIRECT:', process.env.SSO_SUCCESS_REDIRECT || '❌ Missing');
  console.log('');

  // Test JWT Configuration
  console.log('🔐 JWT Configuration:');
  console.log('JWT_LOGIN_SECRET:', process.env.JWT_LOGIN_SECRET ? '✅ Set' : '❌ Missing');
  console.log('');

  // Summary
  const requiredVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
    'FACEBOOK_APP_ID',
    'FACEBOOK_APP_SECRET',
    'FACEBOOK_CALLBACK_URL',
    'SSO_SUCCESS_REDIRECT',
    'JWT_LOGIN_SECRET'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length === 0) {
    console.log('✅ All SSO environment variables are configured!');
    console.log('🚀 SSO should work properly once OAuth apps are set up.');
  } else {
    console.log('❌ Missing environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('\n📝 Please add the missing variables to your .env file');
  }

  console.log('\n📋 Next Steps:');
  console.log('1. Set up Google OAuth app in Google Cloud Console');
  console.log('2. Set up Facebook OAuth app in Facebook Developers');
  console.log('3. Add the credentials to your .env file');
  console.log('4. Test the SSO flow');
};

testSSOConfig(); 