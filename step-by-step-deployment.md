# Step-by-Step EC2 Deployment Guide for Dinerosweeps.com

## 🎯 Port Configuration
- **Frontend (Next.js)**: Port 3000
- **Backend (Node.js)**: Port 5000
- **Nginx**: Port 80 (HTTP) and 443 (HTTPS)

---

## Step 1: Launch EC2 Instance

### 1.1 AWS Console Setup
1. **Login to AWS Console** → EC2 Dashboard
2. **Click "Launch Instance"**
3. **Configure Instance:**
   - **Name**: `dinerosweeps-production`
   - **AMI**: Ubuntu 22.04 LTS (Free tier eligible)
   - **Instance Type**: `t3.medium` (2 vCPU, 4GB RAM)
   - **Key Pair**: Create new or select existing
   - **Network Settings**: 
     - **Security Groups**: Create new security group
     - **Allow SSH**: Port 22 (Your IP)
     - **Allow HTTP**: Port 80 (Anywhere)
     - **Allow HTTPS**: Port 443 (Anywhere)
     - **Allow Custom TCP**: Port 3000 (Anywhere) - Frontend
     - **Allow Custom TCP**: Port 5000 (Anywhere) - Backend

4. **Configure Storage**: 20GB GP3 SSD
5. **Launch Instance**

### 1.2 Get Your EC2 Details
- **Public IP**: Note this down (e.g., `3.250.123.45`)
- **Key File**: Download your `.pem` file

---

## Step 2: Connect to EC2 Instance

```bash
# Connect via SSH (replace with your details)
ssh -i Dinero-sweeps.pem ubuntu@3.82.45.138

# Example:
ssh -i dinerosweeps-key.pem ubuntu@3.250.123.45
```

---

## Step 3: Initial Server Setup

### 3.1 Update System
```bash
# Update package list and upgrade existing packages
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

### 3.2 Install Node.js 18.x
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

### 3.3 Install PM2
```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify PM2 installation
pm2 --version
```

### 3.4 Install Required Services
```bash
# Install Nginx
sudo apt install -y nginx

# Install PostgreSQL client tools (for AWS RDS connection)
sudo apt install -y postgresql-client

# Install Redis
sudo apt install -y redis-server

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### 3.5 Start and Enable Services
```bash
# Start services
sudo systemctl start nginx
sudo systemctl start redis-server

# Enable services to start on boot
sudo systemctl enable nginx
sudo systemctl enable redis-server

# Verify services are running
sudo systemctl status nginx
sudo systemctl status redis-server
```

---

## Step 4: AWS RDS Database Configuration

### 4.1 Get Your RDS Details
You'll need the following information from your AWS RDS console:
- **RDS Endpoint**: `your-db-instance.region.rds.amazonaws.com`
- **Database Name**: Your database name
- **Username**: Your database username
- **Password**: Your database password
- **Port**: Usually 5432 (PostgreSQL default)

### 4.2 Test RDS Connection
```bash
# Test connection to your RDS instance
psql -h dinero-db1.capk26ewitle.us-east-1.rds.amazonaws.com -U postgres -d readme_to_recover

# Example:
# psql -h dinerosweeps-db.us-east-1.rds.amazonaws.com -U dinerosweeps_user -d dinerosweeps
# Enter your password when prompted
# Type \q to exit
```

### 4.3 Verify Database Access
```bash
# Test if you can connect and run basic queries
psql -h your-rds-endpoint.region.rds.amazonaws.com -U your_username -d your_database_name -c "SELECT version();"
```

---

## Step 5: Application Directory Setup

### 5.1 Create Application Directory
```bash
# Create directory
sudo mkdir -p /var/www/dinerosweeps

# Set ownership
sudo chown ubuntu:ubuntu /var/www/dinerosweeps

# Navigate to directory
cd /var/www/dinerosweeps
```

### 5.2 Upload Your Code
**Option A: Git Clone (Recommended)**
```bash
# Clone your repository
git clone https://github.com/yourusername/New-Dinero1.git .

# Or if you have a private repo:
git clone https://username:token@github.com/yourusername/New-Dinero1.git .
```

**Option B: Upload via SCP (from your local machine)**
```bash
# From your local machine, run:
scp -r -i your-key.pem ./New-Dinero1 ubuntu@your-ec2-ip:/var/www/dinerosweeps/
```

---

## Step 6: Backend Configuration

### 6.1 Install Backend Dependencies
```bash
cd /var/www/dinerosweeps/backend

# Install dependencies
npm install
```

### 6.2 Configure Backend Environment
```bash
# Copy environment template
cp env.sample .env

# Edit environment file
nano .env
```

**Backend Environment Configuration (.env):**
```env
# Database settings (AWS RDS)
DB_SYNC=true
DB_PORT=5432
DB_WRITE_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_READ_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_USER=your_rds_username
DB_PASSWORD=your_rds_password
DB_NAME=your_database_name

# App settings
NODE_ENV=production
WINDOW_AGE=86400
PORT=5000
USER_BACKEND_URL=https://api.dinerosweeps.com
USER_FRONTEND_URL=https://dinerosweeps.com
ADMIN_BACKEND_URL=https://admin.dinerosweeps.com
ALLOWED_ORIGIN=https://dinerosweeps.com,https://www.dinerosweeps.com

# JWT Keys (CHANGE THESE TO SECURE VALUES!)
VERIFICATION_TOKEN_SECRET=your_secure_verification_secret_here
VERIFICATION_TOKEN_EXPIRY=2h
JWT_LOGIN_SECRET=your_secure_jwt_secret_here
JWT_LOGIN_TOKEN_EXPIRY=2h
EMAIL_TOKEN_KEY=your_secure_email_token_key_here
EMAIL_TOKEN_EXPIRY=4h

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=dinerosweeps_redis_password_2024

# Other settings (fill with your actual values)
MICRO_SERVICE_ACCESS_TOKEN=your_token_here
SOCKET_ENCRYPTION_KEY=your_socket_key_here
SOCKET_MAX_PER_USER_CONNECTION=5
MAILJET_API_KEY=your_mailjet_key_here
MAILJET_SECRET_KEY=your_mailjet_secret_here
BASIC_USERNAME=admin
BASIC_PASSWORD=your_secure_admin_password_here

# AWS S3 (if using)
AWS_SECRET_ACCESS_KEY=your_aws_secret_here
AWS_ACCESS_KEY=your_aws_key_here
AWS_BUCKET=your_bucket_name_here
AWS_REGION=us-east-1

# Add other required environment variables from env.sample
```

### 6.3 Build and Test Backend
```bash
# Build the backend
npm run build

# Test the build (should start on port 5000)
npm start

# Press Ctrl+C to stop the test
```

---

## Step 7: Frontend Configuration

### 7.1 Install Frontend Dependencies
```bash
cd /var/www/dinerosweeps/frontend

# Install dependencies
npm install
```

### 7.2 Configure Frontend Environment
```bash
# Create environment file
nano .env.local
```

**Frontend Environment Configuration (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://api.dinerosweeps.com
NEXT_PUBLIC_SOCKET_URL=https://api.dinerosweeps.com
NEXT_PUBLIC_SITE_URL=https://dinerosweeps.com
```

### 7.3 Build and Test Frontend
```bash
# Build the frontend
npm run build

# Test the build (should start on port 3000)
npm start

# Press Ctrl+C to stop the test
```

---

## Step 8: PM2 Process Management

### 8.1 Start Backend with PM2
```bash
cd /var/www/dinerosweeps/backend

# Start backend process
pm2 start ecosystem.config.js

# Check status
pm2 status
```

### 8.2 Start Frontend with PM2
```bash
cd /var/www/dinerosweeps/frontend

# Start frontend process
pm2 start npm --name "dinerosweeps-frontend" -- start

# Check status
pm2 status
```

### 8.3 Save PM2 Configuration
```bash
# Save current PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup

# Follow the instructions provided by the above command
```

---

## Step 9: Nginx Configuration

### 9.1 Create Nginx Configuration
```bash
# Create Nginx site configuration
sudo nano /etc/nginx/sites-available/dinerosweeps.com
```

**Nginx Configuration:**
```nginx
# Frontend (Next.js) - Port 3000
server {
    listen 80;
    server_name dinerosweeps.com www.dinerosweeps.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Backend API - Port 5000
server {
    listen 80;
    server_name api.dinerosweeps.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # WebSocket support for Socket.IO
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:5000/health;
        access_log off;
    }
}
```

### 9.2 Enable Nginx Site
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/dinerosweeps.com /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

---

## Step 10: Domain Configuration (Namecheap)

### 10.1 Configure DNS Records
1. **Login to Namecheap** → Domain List → dinerosweeps.com → Manage
2. **Go to "Advanced DNS"**
3. **Add these A records:**
   - **Host**: `@` (or leave empty) → **Value**: Your EC2 Public IP
   - **Host**: `www` → **Value**: Your EC2 Public IP
   - **Host**: `api` → **Value**: Your EC2 Public IP

### 10.2 Wait for DNS Propagation
- DNS changes can take up to 48 hours to propagate
- You can check propagation using: `nslookup dinerosweeps.com`

---

## Step 11: SSL Certificate Setup

### 11.1 Install SSL Certificates
```bash
# Install SSL certificates (run after DNS propagation)
sudo certbot --nginx -d dinerosweeps.com -d www.dinerosweeps.com -d api.dinerosweeps.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose redirect option (recommend option 2)
```

### 11.2 Test SSL Auto-Renewal
```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Set up auto-renewal cron job
sudo crontab -e

# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## Step 12: Security Hardening

### 12.1 Configure Firewall
```bash
# Allow SSH
sudo ufw allow ssh

# Allow Nginx (HTTP and HTTPS)
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Check firewall status
sudo ufw status
```

### 12.2 Secure Redis
```bash
# Edit Redis configuration
sudo nano /etc/redis/redis.conf

# Find and change these lines:
bind 127.0.0.1
requirepass dinerosweeps_redis_password_2024

# Restart Redis
sudo systemctl restart redis-server
```

---

## Step 13: Testing Your Deployment

### 13.1 Test Local Services
```bash
# Test backend health
curl http://localhost:5000/health

# Test frontend
curl http://localhost:3000

# Check PM2 status
pm2 status

# Check service status
sudo systemctl status nginx redis-server
```

### 13.2 Test Domain Access
```bash
# Test HTTP access (before SSL)
curl http://dinerosweeps.com
curl http://api.dinerosweeps.com

# Test HTTPS access (after SSL)
curl https://dinerosweeps.com
curl https://api.dinerosweeps.com
```

---

## Step 14: Monitoring and Maintenance

### 14.1 Setup Monitoring Scripts
```bash
# Copy monitoring scripts
cp scripts/monitoring.sh /var/www/dinerosweeps/
cp scripts/backup.sh /var/www/dinerosweeps/
cp scripts/deploy.sh /var/www/dinerosweeps/

# Make scripts executable
chmod +x /var/www/dinerosweeps/*.sh

# Setup daily backup cron job
crontab -e

# Add this line:
0 2 * * * /var/www/dinerosweeps/backup.sh
```

### 14.2 Regular Maintenance Commands
```bash
# Check system health
/var/www/dinerosweeps/monitoring.sh

# View logs
pm2 logs
sudo tail -f /var/log/nginx/access.log

# Update system packages
sudo apt update && sudo apt upgrade -y

# Check disk space
df -h

# Check memory usage
free -h
```

---

## 🎯 Final URLs

After successful deployment:
- **Frontend**: https://dinerosweeps.com
- **Backend API**: https://api.dinerosweeps.com
- **Health Check**: https://api.dinerosweeps.com/health

---

## 🔧 Troubleshooting

### Common Issues and Solutions

**1. Port Already in Use**
```bash
# Check what's using the ports
sudo netstat -tlnp | grep :5000
sudo netstat -tlnp | grep :3000

# Kill process if needed
sudo kill -9 <PID>
```

**2. Permission Issues**
```bash
# Fix ownership
sudo chown -R ubuntu:ubuntu /var/www/dinerosweeps
```

**3. Database Connection Failed**
```bash
# Test RDS connection
psql -h your-rds-endpoint.region.rds.amazonaws.com -U your_username -d your_database_name

# Check if RDS endpoint is accessible
ping your-rds-endpoint.region.rds.amazonaws.com

# Verify security group allows connections from EC2
```

**4. PM2 Process Not Starting**
```bash
# Check PM2 logs
pm2 logs dinerosweeps-backend --lines 50

# Restart PM2
pm2 kill
pm2 start ecosystem.config.js
pm2 start npm --name "dinerosweeps-frontend" -- start
```

**5. Nginx Configuration Error**
```bash
# Test configuration
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx
```

---

## ✅ Deployment Checklist

- [ ] EC2 instance launched with correct security groups
- [ ] Connected to EC2 via SSH
- [ ] System packages updated and installed
- [ ] Node.js 18.x installed
- [ ] PM2 installed globally
- [ ] AWS RDS connection tested and working
- [ ] Redis installed and secured
- [ ] Application code uploaded to server
- [ ] Backend dependencies installed
- [ ] Backend environment configured (.env)
- [ ] Backend built successfully
- [ ] Frontend dependencies installed
- [ ] Frontend environment configured (.env.local)
- [ ] Frontend built successfully
- [ ] PM2 processes started (backend on port 5000, frontend on port 3000)
- [ ] Nginx configured and enabled
- [ ] DNS records configured in Namecheap
- [ ] SSL certificates installed
- [ ] Firewall configured
- [ ] Monitoring scripts set up
- [ ] Backup strategy implemented
- [ ] All services tested and working

**Congratulations! Your Dinerosweeps.com application is now deployed and running! 🚀**
