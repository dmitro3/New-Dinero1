# EC2 Deployment Guide for Dinerosweeps.com

## Prerequisites
- AWS EC2 instance (Ubuntu 22.04 LTS recommended)
- Domain: dinerosweeps.com (configured on Namecheap)
- Basic DNS plan on Namecheap
- SSH access to your EC2 instance

## Step 1: EC2 Instance Setup

### 1.1 Launch EC2 Instance
- **Instance Type**: t3.medium or t3.large (minimum 2GB RAM)
- **OS**: Ubuntu 22.04 LTS
- **Storage**: 20GB GP3 SSD
- **Security Groups**: 
  - SSH (Port 22)
  - HTTP (Port 80)
  - HTTPS (Port 443)
  - Custom TCP (Port 3000) - for Next.js Frontend
  - Custom TCP (Port 5000) - for Backend API

### 1.2 Connect to EC2
```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

## Step 2: System Updates and Basic Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Start and enable services
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

## Step 3: Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE dinerosweeps;
CREATE USER dinerosweeps_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE dinerosweeps TO dinerosweeps_user;
ALTER USER dinerosweeps_user CREATEDB;
\q

# Test connection
psql -h localhost -U dinerosweeps_user -d dinerosweeps
```

## Step 4: Application Directory Setup

```bash
# Create application directory
sudo mkdir -p /var/www/dinerosweeps
sudo chown ubuntu:ubuntu /var/www/dinerosweeps
cd /var/www/dinerosweeps

# Clone your repository (replace with your actual repo URL)
git clone https://github.com/yourusername/New-Dinero1.git .

# Or upload your files via SCP/SFTP
```

## Step 5: Backend Setup

```bash
cd /var/www/dinerosweeps/backend

# Install dependencies
npm install

# Create production environment file
cp env.sample .env
nano .env
```

### Backend Environment Configuration (.env)
```env
# Database settings
DB_SYNC=true
DB_PORT=5432
DB_WRITE_HOST=localhost
DB_READ_HOST=localhost
DB_USER=dinerosweeps_user
DB_PASSWORD=your_secure_password
DB_NAME=dinerosweeps

# App settings
NODE_ENV=production
WINDOW_AGE=86400
PORT=5000
USER_BACKEND_URL=https://api.dinerosweeps.com
USER_FRONTEND_URL=https://dinerosweeps.com
ADMIN_BACKEND_URL=https://admin.dinerosweeps.com
ALLOWED_ORIGIN=https://dinerosweeps.com,https://www.dinerosweeps.com

# JWT Keys (generate secure keys)
VERIFICATION_TOKEN_SECRET=your_secure_verification_secret
VERIFICATION_TOKEN_EXPIRY=2h
JWT_LOGIN_SECRET=your_secure_jwt_secret
JWT_LOGIN_TOKEN_EXPIRY=2h
EMAIL_TOKEN_KEY=your_secure_email_token_key
EMAIL_TOKEN_EXPIRY=4h

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Other settings (fill with your actual values)
MICRO_SERVICE_ACCESS_TOKEN=your_token
SOCKET_ENCRYPTION_KEY=your_socket_key
SOCKET_MAX_PER_USER_CONNECTION=5
MAILJET_API_KEY=your_mailjet_key
MAILJET_SECRET_KEY=your_mailjet_secret
BASIC_USERNAME=admin
BASIC_PASSWORD=your_secure_admin_password

# AWS S3 (if using)
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_ACCESS_KEY=your_aws_key
AWS_BUCKET=your_bucket_name
AWS_REGION=us-east-1

# Add other required environment variables from env.sample
```

```bash
# Build the backend
npm run build

# Test the build
npm start
```

## Step 6: Frontend Setup

```bash
cd /var/www/dinerosweeps/frontend

# Install dependencies
npm install

# Create production environment file
nano .env.local
```

### Frontend Environment Configuration (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.dinerosweeps.com
NEXT_PUBLIC_SOCKET_URL=https://api.dinerosweeps.com
NEXT_PUBLIC_SITE_URL=https://dinerosweeps.com
```

```bash
# Build the frontend
npm run build

# Test the build
npm start
```

## Step 7: PM2 Configuration

### Backend PM2 Configuration
```bash
cd /var/www/dinerosweeps/backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Frontend PM2 Configuration
```bash
cd /var/www/dinerosweeps/frontend
pm2 start npm --name "dinerosweeps-frontend" -- start
pm2 save
```

## Step 8: Nginx Configuration

### Main Domain Configuration
```bash
sudo nano /etc/nginx/sites-available/dinerosweeps.com
```

```nginx
# Frontend (Next.js)
server {
    listen 80;
    server_name dinerosweeps.com www.dinerosweeps.com;
    
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
    }
}

# Backend API
server {
    listen 80;
    server_name api.dinerosweeps.com;
    
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
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/dinerosweeps.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 9: Domain Configuration (Namecheap)

### DNS Records to Add:
1. **A Record**: `dinerosweeps.com` → Your EC2 Public IP
2. **A Record**: `www.dinerosweeps.com` → Your EC2 Public IP  
3. **A Record**: `api.dinerosweeps.com` → Your EC2 Public IP

### Wait for DNS Propagation (up to 48 hours)

## Step 10: SSL Certificate Setup

```bash
# Install SSL certificates
sudo certbot --nginx -d dinerosweeps.com -d www.dinerosweeps.com -d api.dinerosweeps.com

# Test auto-renewal
sudo certbot renew --dry-run

# Set up auto-renewal cron job
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## Step 11: Final Nginx Configuration (with SSL)

After SSL installation, your Nginx config will be updated automatically. Verify it looks like this:

```nginx
# Frontend with SSL
server {
    listen 443 ssl http2;
    server_name dinerosweeps.com www.dinerosweeps.com;
    
    ssl_certificate /etc/letsencrypt/live/dinerosweeps.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dinerosweeps.com/privkey.pem;
    
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
    }
}

# Backend API with SSL
server {
    listen 443 ssl http2;
    server_name api.dinerosweeps.com;
    
    ssl_certificate /etc/letsencrypt/live/dinerosweeps.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dinerosweeps.com/privkey.pem;
    
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
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name dinerosweeps.com www.dinerosweeps.com api.dinerosweeps.com;
    return 301 https://$server_name$request_uri;
}
```

## Step 12: Security Hardening

```bash
# Configure firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Secure PostgreSQL
sudo nano /etc/postgresql/*/main/postgresql.conf
# Add: listen_addresses = 'localhost'

sudo nano /etc/postgresql/*/main/pg_hba.conf
# Ensure only local connections are allowed

# Restart PostgreSQL
sudo systemctl restart postgresql

# Secure Redis
sudo nano /etc/redis/redis.conf
# Add: bind 127.0.0.1
# Add: requirepass your_redis_password

sudo systemctl restart redis-server
```

## Step 13: Monitoring and Logs

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Application logs
pm2 logs dinerosweeps-backend
pm2 logs dinerosweeps-frontend
```

## Step 14: Backup Strategy

```bash
# Create backup script
sudo nano /var/www/dinerosweeps/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/dinerosweeps"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U dinerosweeps_user dinerosweeps > $BACKUP_DIR/db_backup_$DATE.sql

# Application backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /var/www/dinerosweeps

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

```bash
# Make executable and add to cron
chmod +x /var/www/dinerosweeps/backup.sh
sudo crontab -e
# Add: 0 2 * * * /var/www/dinerosweeps/backup.sh
```

## Step 15: Deployment Scripts

### Update Script
```bash
sudo nano /var/www/dinerosweeps/deploy.sh
```

```bash
#!/bin/bash
cd /var/www/dinerosweeps

# Pull latest changes
git pull origin main

# Backend deployment
cd backend
npm install
npm run build
pm2 restart dinerosweeps-backend

# Frontend deployment
cd ../frontend
npm install
npm run build
pm2 restart dinerosweeps-frontend

echo "Deployment completed!"
```

```bash
chmod +x /var/www/dinerosweeps/deploy.sh
```

## Troubleshooting

### Common Issues:
1. **Port conflicts**: Check if ports 3000 and 5000 are free
2. **Permission issues**: Ensure proper file ownership
3. **Database connection**: Verify PostgreSQL is running and accessible
4. **SSL issues**: Check certificate validity and renewal
5. **DNS issues**: Use `nslookup` or `dig` to verify DNS propagation

### Useful Commands:
```bash
# Check service status
sudo systemctl status nginx postgresql redis-server

# Check PM2 status
pm2 status

# Check logs
pm2 logs --lines 100

# Restart services
sudo systemctl restart nginx
pm2 restart all
```

## Final Checklist

- [ ] EC2 instance running Ubuntu 22.04
- [ ] All required packages installed
- [ ] PostgreSQL database created and configured
- [ ] Redis server running
- [ ] Backend built and running on PM2
- [ ] Frontend built and running on PM2
- [ ] Nginx configured and running
- [ ] Domain DNS records configured
- [ ] SSL certificates installed
- [ ] Firewall configured
- [ ] Backup strategy implemented
- [ ] Monitoring set up

Your application should now be accessible at:
- Frontend: https://dinerosweeps.com
- Backend API: https://api.dinerosweeps.com
