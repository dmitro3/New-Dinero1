#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root"
   exit 1
fi

log "Starting server setup for Dinerosweeps.com..."

# Update system
log "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
log "Installing essential packages..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Node.js 18.x
log "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
log "Node.js version: $NODE_VERSION"
log "NPM version: $NPM_VERSION"

# Install PM2 globally
log "Installing PM2..."
sudo npm install -g pm2

# Install Nginx
log "Installing Nginx..."
sudo apt install -y nginx

# Note: Using AWS RDS instead of local PostgreSQL
log "Installing PostgreSQL client tools..."
sudo apt install -y postgresql-client

# Install Redis
log "Installing Redis..."
sudo apt install -y redis-server

# Install Certbot for SSL
log "Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Start and enable services
log "Starting and enabling services..."
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Create application directory
log "Creating application directory..."
sudo mkdir -p /var/www/dinerosweeps
sudo chown ubuntu:ubuntu /var/www/dinerosweeps

# Create backup directory
log "Creating backup directory..."
sudo mkdir -p /var/backups/dinerosweeps
sudo chown ubuntu:ubuntu /var/backups/dinerosweeps

# Note: Using AWS RDS - Database setup will be done separately
log "AWS RDS detected - skipping local PostgreSQL setup..."
log "Please configure your RDS connection details in the backend .env file"

# Secure Redis
log "Securing Redis..."
sudo sed -i "s/# bind 127.0.0.1/bind 127.0.0.1/" /etc/redis/redis.conf
sudo sed -i "s/# requirepass foobared/requirepass dinerosweeps_redis_password_2024/" /etc/redis/redis.conf
sudo systemctl restart redis-server

# Configure firewall
log "Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Create logs directory for PM2
log "Creating PM2 logs directory..."
mkdir -p ~/.pm2/logs

# Setup PM2 startup
log "Setting up PM2 startup..."
pm2 startup

# Create environment template files
log "Creating environment template files..."

# Backend environment template
cat > /var/www/dinerosweeps/backend/.env.template << 'EOF'
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

# JWT Keys (CHANGE THESE!)
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

# Add other required environment variables
EOF

# Frontend environment template
cat > /var/www/dinerosweeps/frontend/.env.local.template << 'EOF'
NEXT_PUBLIC_API_URL=https://api.dinerosweeps.com
NEXT_PUBLIC_SOCKET_URL=https://api.dinerosweeps.com
NEXT_PUBLIC_SITE_URL=https://dinerosweeps.com
EOF

# Copy deployment scripts
log "Setting up deployment scripts..."
cp scripts/deploy.sh /var/www/dinerosweeps/
cp scripts/backup.sh /var/www/dinerosweeps/
chmod +x /var/www/dinerosweeps/deploy.sh
chmod +x /var/www/dinerosweeps/backup.sh

# Setup cron jobs
log "Setting up cron jobs..."
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/dinerosweeps/backup.sh") | crontab -
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Create Nginx configuration
log "Creating Nginx configuration..."
sudo cp nginx-config/dinerosweeps.com /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/dinerosweeps.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
if sudo nginx -t; then
    log "Nginx configuration is valid"
    sudo systemctl reload nginx
else
    error "Nginx configuration is invalid"
    exit 1
fi

# Display system information
log "System setup completed!"
log "System information:"
log "  Node.js: $NODE_VERSION"
log "  NPM: $NPM_VERSION"
log "  PostgreSQL: Using AWS RDS"
log "  Redis: $(sudo systemctl status redis-server | grep Active | awk '{print $2}')"
log "  Nginx: $(sudo systemctl status nginx | grep Active | awk '{print $2}')"

log "Next steps:"
log "1. Upload your application code to /var/www/dinerosweeps/"
log "2. Configure your domain DNS records to point to this server"
log "3. Copy and configure environment files:"
log "   - cp /var/www/dinerosweeps/backend/.env.template /var/www/dinerosweeps/backend/.env"
log "   - cp /var/www/dinerosweeps/frontend/.env.local.template /var/www/dinerosweeps/frontend/.env.local"
log "4. Edit the environment files with your actual values (including RDS details)"
log "5. Run the deployment script: /var/www/dinerosweeps/deploy.sh"
log "6. Install SSL certificates: sudo certbot --nginx -d dinerosweeps.com -d www.dinerosweeps.com -d api.dinerosweeps.com"

log "Server setup completed successfully!"
