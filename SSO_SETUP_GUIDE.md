# SSO Setup Guide for Google and Facebook Authentication

## Overview
This guide covers the setup and configuration of Single Sign-On (SSO) authentication using Google and Facebook for both login and signup functionality.

## Backend Setup

### 1. Dependencies
The following packages are already installed in `backend/package.json`:
- `passport`: Authentication middleware
- `passport-google-oauth20`: Google OAuth 2.0 strategy
- `passport-facebook`: Facebook OAuth strategy
- `jsonwebtoken`: JWT token generation

### 2. Environment Variables
Add the following variables to your `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8080/api/v1/auth/sso/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:8080/api/v1/auth/sso/facebook/callback

# SSO Redirect URL
SSO_SUCCESS_REDIRECT=http://localhost:3000/auth/success
```

### 3. Database Schema
The User model has been updated to support SSO:
- `googleId`: Stores Google user ID
- `facebookId`: Stores Facebook user ID
- `signInType`: Tracks authentication method ('google', 'facebook', 'normal')
- `password`: Now allows null values for SSO users

### 4. Backend Implementation
✅ **Completed**:
- Passport strategies configured in `backend/index.js`
- SSO routes in `backend/src/rest-resources/routes/api/v1/auth.sso.router.js`
- Error handling added to callback routes
- User model updated to support SSO fields
- Automatic user creation/update logic
- JWT token generation

## Frontend Setup

### 1. SSO Buttons
✅ **Completed**: SSO buttons are implemented in `frontend/src/components/LoginSignup/UserForm/index.js`

### 2. Callback Handler
✅ **Completed**: Created `frontend/src/app/[locale]/auth/success/page.js` to handle SSO redirects

### 3. Environment Variables
Add to your frontend `.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

## Google OAuth Setup

### 1. Create Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen
6. Set application type to "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:8080/api/v1/auth/sso/google/callback` (development)
   - `https://yourdomain.com/api/v1/auth/sso/google/callback` (production)

### 2. Get Credentials
- Copy the Client ID and Client Secret
- Add them to your backend `.env` file

## Facebook OAuth Setup

### 1. Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure Facebook Login settings
5. Add OAuth redirect URIs:
   - `http://localhost:8080/api/v1/auth/sso/facebook/callback` (development)
   - `https://yourdomain.com/api/v1/auth/sso/facebook/callback` (production)

### 2. Get Credentials
- Copy the App ID and App Secret
- Add them to your backend `.env` file

## Testing SSO

### 1. Backend Testing
```bash
# Start backend server
cd backend
npm run start:dev
```

### 2. Frontend Testing
```bash
# Start frontend server
cd frontend
npm run dev
```

### 3. Test Flow
1. Navigate to login/signup page
2. Click "Sign in with Google" or "Sign in with Facebook"
3. Complete OAuth flow
4. Should redirect to success page and then to home page

## Security Considerations

### 1. Environment Variables
- Never commit OAuth secrets to version control
- Use different credentials for development and production
- Rotate secrets regularly

### 2. HTTPS in Production
- Always use HTTPS in production
- Update callback URLs to use HTTPS
- Configure secure cookie settings

### 3. Error Handling
- Implement proper error handling for failed SSO attempts
- Log authentication failures
- Provide user-friendly error messages

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Check that callback URLs match exactly in OAuth app settings
   - Ensure protocol (http/https) matches

2. **"Client ID not found"**
   - Verify environment variables are set correctly
   - Check that backend server is restarted after env changes

3. **"User not found" errors**
   - Check database connection
   - Verify User model has required SSO fields
   - Check database migrations

4. **Frontend callback not working**
   - Verify `SSO_SUCCESS_REDIRECT` environment variable
   - Check that success page exists at `/auth/success`
   - Ensure frontend can access backend URL

### Debug Steps
1. Check backend logs for SSO errors
2. Verify environment variables are loaded
3. Test OAuth endpoints directly
4. Check database for user creation
5. Verify JWT token generation

## Production Deployment

### 1. Update Environment Variables
```env
# Production URLs
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/v1/auth/sso/google/callback
FACEBOOK_CALLBACK_URL=https://yourdomain.com/api/v1/auth/sso/facebook/callback
SSO_SUCCESS_REDIRECT=https://yourdomain.com/auth/success
```

### 2. Update OAuth App Settings
- Add production callback URLs to Google/Facebook apps
- Update app domains and privacy policy URLs
- Configure app review if required

### 3. Security Headers
- Implement proper CORS settings
- Add security headers (helmet.js)
- Configure session management

## API Endpoints

### Google SSO
- **Initiate**: `GET /api/v1/auth/sso/google`
- **Callback**: `GET /api/v1/auth/sso/google/callback`

### Facebook SSO
- **Initiate**: `GET /api/v1/auth/sso/facebook`
- **Callback**: `GET /api/v1/auth/sso/facebook/callback`

## Database Migrations

If you need to add SSO fields to existing database:

```sql
-- Add SSO fields to users table
ALTER TABLE users 
ADD COLUMN google_id VARCHAR(255),
ADD COLUMN facebook_id VARCHAR(255),
ADD COLUMN sign_in_type VARCHAR(50);

-- Make password nullable for SSO users
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
```

## Support

For issues or questions:
1. Check backend logs for detailed error messages
2. Verify all environment variables are set
3. Test OAuth flow step by step
4. Ensure database schema is up to date 