# Production Deployment Checklist - SSO

## 🚀 **Pre-Deployment Checklist**

### 1. **Environment Variables**
- [ ] `GOOGLE_CLIENT_ID` (production)
- [ ] `GOOGLE_CLIENT_SECRET` (production)
- [ ] `GOOGLE_CALLBACK_URL` (HTTPS)
- [ ] `FACEBOOK_APP_ID` (production)
- [ ] `FACEBOOK_APP_SECRET` (production)
- [ ] `FACEBOOK_CALLBACK_URL` (HTTPS)
- [ ] `SSO_SUCCESS_REDIRECT` (HTTPS)
- [ ] `JWT_LOGIN_SECRET` (strong secret)
- [ ] `NEXT_PUBLIC_BACKEND_URL` (HTTPS)

### 2. **OAuth App Configuration**

#### Google Cloud Console
- [ ] Production OAuth 2.0 Client ID created
- [ ] Authorized redirect URIs updated:
  - `https://yourdomain.com/api/v1/auth/sso/google/callback`
- [ ] OAuth consent screen configured
- [ ] App verified (if required)
- [ ] Scopes configured: `profile`, `email`

#### Facebook Developers
- [ ] Production app created
- [ ] Facebook Login product added
- [ ] Valid OAuth Redirect URIs added:
  - `https://yourdomain.com/api/v1/auth/sso/facebook/callback`
- [ ] App domains configured
- [ ] Privacy policy URL added
- [ ] App review completed (if required)

### 3. **Security Configuration**
- [ ] HTTPS enforced
- [ ] SSL certificate valid
- [ ] Security headers configured
- [ ] CORS settings updated
- [ ] Rate limiting enabled
- [ ] Environment variables secured
- [ ] Database connection encrypted

### 4. **Database Migration**
- [ ] SSO fields added to users table
- [ ] Password field made nullable
- [ ] Indexes created for performance
- [ ] Database backup created

## 🌐 **Deployment Steps**

### 1. **Backend Deployment**
```bash
# Build backend
cd backend
npm run build

# Deploy to production server
# Update environment variables
# Restart server
```

### 2. **Frontend Deployment**
```bash
# Build frontend
cd frontend
npm run build

# Deploy to production server
# Update environment variables
# Restart server
```

### 3. **Database Migration**
```sql
-- Run if not already done
ALTER TABLE users 
ADD COLUMN google_id VARCHAR(255),
ADD COLUMN facebook_id VARCHAR(255),
ADD COLUMN sign_in_type VARCHAR(50);

ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
```

## 🧪 **Post-Deployment Testing**

### 1. **Health Checks**
- [ ] Backend server responding
- [ ] Frontend application loading
- [ ] Database connection working
- [ ] SSO endpoints accessible

### 2. **SSO Flow Testing**
- [ ] Google SSO initiation works
- [ ] Facebook SSO initiation works
- [ ] OAuth redirects work
- [ ] Callback handling works
- [ ] User creation works
- [ ] User login works
- [ ] Token storage works
- [ ] Session management works

### 3. **Error Handling**
- [ ] Invalid credentials handled
- [ ] Network errors handled
- [ ] Missing data handled
- [ ] User-friendly error messages

### 4. **Security Testing**
- [ ] HTTPS enforced
- [ ] No sensitive data exposed
- [ ] JWT tokens secure
- [ ] Session management secure
- [ ] CORS configured correctly

### 5. **Performance Testing**
- [ ] Response times acceptable
- [ ] No memory leaks
- [ ] Database queries optimized
- [ ] Load testing completed

## 📊 **Monitoring Setup**

### 1. **Application Monitoring**
- [ ] Error logging configured
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring set up
- [ ] Alert system configured

### 2. **SSO-Specific Monitoring**
- [ ] OAuth success/failure rates
- [ ] User creation rates
- [ ] Token generation metrics
- [ ] Callback error tracking

### 3. **Security Monitoring**
- [ ] Failed authentication attempts
- [ ] Suspicious activity detection
- [ ] Token validation monitoring
- [ ] Rate limit monitoring

## 🔧 **Configuration Files**

### 1. **Backend Configuration**
```env
# Production Environment Variables
NODE_ENV=production
PORT=8080

# Database
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name

# SSO Configuration
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/v1/auth/sso/google/callback

FACEBOOK_APP_ID=your-production-facebook-app-id
FACEBOOK_APP_SECRET=your-production-facebook-app-secret
FACEBOOK_CALLBACK_URL=https://yourdomain.com/api/v1/auth/sso/facebook/callback

SSO_SUCCESS_REDIRECT=https://yourdomain.com/auth/success

# JWT Configuration
JWT_LOGIN_SECRET=your-strong-jwt-secret
JWT_LOGIN_TOKEN_EXPIRY=24h

# Security
CORS_ORIGIN=https://yourdomain.com
```

### 2. **Frontend Configuration**
```env
# Production Environment Variables
NEXT_PUBLIC_BACKEND_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. **Nginx Configuration** (if using)
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🚨 **Rollback Plan**

### 1. **Database Rollback**
```sql
-- If needed, remove SSO fields
ALTER TABLE users DROP COLUMN google_id;
ALTER TABLE users DROP COLUMN facebook_id;
ALTER TABLE users DROP COLUMN sign_in_type;
ALTER TABLE users ALTER COLUMN password SET NOT NULL;
```

### 2. **Code Rollback**
- [ ] Revert to previous version
- [ ] Remove SSO routes
- [ ] Remove SSO buttons
- [ ] Remove callback page

### 3. **Configuration Rollback**
- [ ] Remove SSO environment variables
- [ ] Remove OAuth app configurations
- [ ] Restore previous settings

## 📈 **Performance Optimization**

### 1. **Database Optimization**
- [ ] Indexes on SSO fields
- [ ] Query optimization
- [ ] Connection pooling
- [ ] Caching strategy

### 2. **Application Optimization**
- [ ] JWT token caching
- [ ] User session caching
- [ ] OAuth response caching
- [ ] CDN configuration

### 3. **Security Optimization**
- [ ] Rate limiting
- [ ] Request validation
- [ ] Input sanitization
- [ ] Output encoding

## 🔍 **Troubleshooting Guide**

### Common Production Issues

#### Issue 1: "Invalid redirect URI"
**Solution**:
- Check OAuth app settings
- Verify HTTPS URLs
- Ensure exact URL matching

#### Issue 2: "CORS errors"
**Solution**:
- Update CORS configuration
- Check frontend-backend communication
- Verify domain settings

#### Issue 3: "Database connection errors"
**Solution**:
- Check database credentials
- Verify network connectivity
- Check connection pooling

#### Issue 4: "SSL certificate issues"
**Solution**:
- Verify SSL certificate validity
- Check certificate chain
- Update certificate if expired

## 📞 **Support Contacts**

### Development Team
- [ ] Backend developer contact
- [ ] Frontend developer contact
- [ ] DevOps engineer contact

### External Services
- [ ] Google Cloud Console support
- [ ] Facebook Developers support
- [ ] Hosting provider support
- [ ] SSL certificate provider

## ✅ **Final Checklist**

### Before Going Live
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Documentation updated
- [ ] Team notified
- [ ] Monitoring active
- [ ] Rollback plan ready

### Post-Launch
- [ ] Monitor for 24 hours
- [ ] Check error logs
- [ ] Verify user feedback
- [ ] Performance monitoring
- [ ] Security monitoring
- [ ] Update documentation

## 🎯 **Success Metrics**

### Technical Metrics
- [ ] SSO success rate > 95%
- [ ] Response time < 2 seconds
- [ ] Error rate < 1%
- [ ] Uptime > 99.9%

### Business Metrics
- [ ] User adoption rate
- [ ] Conversion rate improvement
- [ ] User satisfaction scores
- [ ] Support ticket reduction

---

**Remember**: Always test thoroughly in staging environment before deploying to production! 