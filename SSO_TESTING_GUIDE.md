# SSO Testing Guide - Localhost & Production

## 🏠 **Localhost Testing**

### 1. **Environment Setup**

#### Backend Environment Variables (`.env`)
```env
# Development URLs
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8080/api/v1/auth/sso/google/callback

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:8080/api/v1/auth/sso/facebook/callback

SSO_SUCCESS_REDIRECT=http://localhost:3000/auth/success
```

#### Frontend Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### 2. **Start Servers**

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 3. **Test Flow**

1. **Navigate to login page**: `http://localhost:3000`
2. **Click SSO buttons**:
   - "Sign in with Google"
   - "Sign in with Facebook"
3. **Complete OAuth flow**:
   - Authorize the app
   - Should redirect to callback page
   - Should redirect to home page with token

### 4. **Expected Results**

✅ **Success Flow**:
- User redirected to Google/Facebook OAuth
- After authorization, redirected to `/auth/success?token=xxx`
- Token stored in localStorage
- User redirected to home page
- User logged in successfully

❌ **Error Flow**:
- If OAuth fails, redirected to `/?error=sso_failed`
- If no token, redirected to `/?error=no_token`

## 🌐 **Production Testing**

### 1. **Environment Setup**

#### Backend Environment Variables (Production)
```env
# Production URLs
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/v1/auth/sso/google/callback

FACEBOOK_APP_ID=your_production_facebook_app_id
FACEBOOK_APP_SECRET=your_production_facebook_app_secret
FACEBOOK_CALLBACK_URL=https://yourdomain.com/api/v1/auth/sso/facebook/callback

SSO_SUCCESS_REDIRECT=https://yourdomain.com/auth/success
```

#### Frontend Environment Variables (Production)
```env
NEXT_PUBLIC_BACKEND_URL=https://yourdomain.com
```

### 2. **OAuth App Configuration**

#### Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Edit your OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `https://yourdomain.com/api/v1/auth/sso/google/callback`

#### Facebook Developers
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your app
3. Go to "Facebook Login" → "Settings"
4. Add Valid OAuth Redirect URIs:
   - `https://yourdomain.com/api/v1/auth/sso/facebook/callback`

### 3. **Production Test Flow**

1. **Deploy your application**
2. **Test on production domain**:
   - Navigate to `https://yourdomain.com`
   - Test both Google and Facebook SSO
   - Verify callback handling
   - Check token storage and user session

## 🔍 **Testing Checklist**

### Backend Testing
- [ ] Server starts without errors
- [ ] SSO routes are accessible
- [ ] Database connection works
- [ ] User creation/update works
- [ ] JWT token generation works
- [ ] Error handling works

### Frontend Testing
- [ ] SSO buttons are visible
- [ ] Buttons redirect to correct URLs
- [ ] Callback page loads correctly
- [ ] Token is stored properly
- [ ] User is redirected after login
- [ ] Error messages display correctly

### OAuth Testing
- [ ] Google OAuth flow works
- [ ] Facebook OAuth flow works
- [ ] User data is received correctly
- [ ] Email verification works
- [ ] User profile is created/updated

### Security Testing
- [ ] HTTPS is used in production
- [ ] Environment variables are secure
- [ ] JWT tokens are valid
- [ ] Session management works
- [ ] Error handling is secure

## 🐛 **Debugging Steps**

### 1. **Check Backend Logs**
```bash
# Monitor backend logs
cd backend
npm run start:dev
# Look for SSO-related errors
```

### 2. **Check Frontend Console**
```javascript
// Open browser dev tools
// Check Console tab for errors
// Check Network tab for failed requests
```

### 3. **Test Individual Components**

#### Test SSO Routes Directly
```bash
# Test Google SSO initiation
curl http://localhost:8080/api/v1/auth/sso/google

# Test Facebook SSO initiation  
curl http://localhost:8080/api/v1/auth/sso/facebook
```

#### Test Callback URLs
```bash
# Test with mock token
curl "http://localhost:3000/auth/success?token=test_token"
```

### 4. **Database Verification**
```sql
-- Check if users are created
SELECT * FROM users WHERE sign_in_type IN ('google', 'facebook');

-- Check SSO fields
SELECT google_id, facebook_id, sign_in_type FROM users;
```

## 📊 **Test Cases**

### Test Case 1: New User Google SSO
1. Clear browser data
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Verify user created in database
5. Verify token stored
6. Verify redirect to home page

### Test Case 2: Existing User Google SSO
1. Use existing Google account
2. Complete OAuth flow
3. Verify user updated (not created)
4. Verify login successful

### Test Case 3: Facebook SSO
1. Repeat above tests with Facebook
2. Verify Facebook-specific fields
3. Verify email handling

### Test Case 4: Error Handling
1. Test with invalid OAuth credentials
2. Test with network errors
3. Test with missing environment variables
4. Verify error messages display

### Test Case 5: Production Security
1. Test HTTPS enforcement
2. Test secure cookie settings
3. Test CORS configuration
4. Test rate limiting

## 🚨 **Common Issues & Solutions**

### Issue 1: "Invalid redirect URI"
**Solution**: 
- Check OAuth app settings
- Ensure URLs match exactly
- Verify protocol (http/https)

### Issue 2: "Client ID not found"
**Solution**:
- Verify environment variables
- Restart backend server
- Check .env file format

### Issue 3: "User not found"
**Solution**:
- Check database connection
- Verify User model fields
- Check database migrations

### Issue 4: "Callback not working"
**Solution**:
- Verify SSO_SUCCESS_REDIRECT
- Check callback page exists
- Test frontend-backend communication

## 📈 **Performance Testing**

### Load Testing
```bash
# Test SSO endpoints under load
ab -n 100 -c 10 http://localhost:8080/api/v1/auth/sso/google
```

### Response Time Testing
- Measure OAuth flow completion time
- Monitor database query performance
- Check JWT token generation speed

## 🔒 **Security Testing**

### Token Validation
```javascript
// Test JWT token structure
const token = localStorage.getItem('token');
const decoded = jwt_decode(token);
console.log('Token payload:', decoded);
```

### Session Management
- Test token expiration
- Test logout functionality
- Test session persistence

## 📝 **Test Report Template**

```
SSO Test Report
===============

Environment: [Localhost/Production]
Date: [Date]
Tester: [Name]

Google SSO:
- [ ] Initiation works
- [ ] OAuth flow completes
- [ ] User creation/update works
- [ ] Token generation works
- [ ] Redirect works

Facebook SSO:
- [ ] Initiation works
- [ ] OAuth flow completes
- [ ] User creation/update works
- [ ] Token generation works
- [ ] Redirect works

Error Handling:
- [ ] Invalid credentials handled
- [ ] Network errors handled
- [ ] Missing data handled

Security:
- [ ] HTTPS enforced (production)
- [ ] Tokens are secure
- [ ] No sensitive data exposed

Performance:
- [ ] Response times acceptable
- [ ] No memory leaks
- [ ] Database queries optimized

Issues Found:
1. [Issue description]
2. [Issue description]

Recommendations:
1. [Recommendation]
2. [Recommendation]
```

## 🎯 **Success Criteria**

✅ **SSO is working correctly when**:
- Users can sign in with Google
- Users can sign in with Facebook
- New users are created automatically
- Existing users are logged in
- Tokens are stored securely
- Users are redirected properly
- Error messages are user-friendly
- No sensitive data is exposed
- Performance is acceptable

## 📞 **Support**

If you encounter issues:
1. Check the troubleshooting section in `SSO_SETUP_GUIDE.md`
2. Review backend logs for detailed error messages
3. Test individual components step by step
4. Verify all environment variables are set correctly
5. Ensure OAuth apps are configured properly 