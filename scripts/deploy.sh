#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/dinerosweeps"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
LOG_FILE="$APP_DIR/deploy.log"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a $LOG_FILE
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a $LOG_FILE
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root"
   exit 1
fi

# Check if app directory exists
if [ ! -d "$APP_DIR" ]; then
    error "Application directory $APP_DIR does not exist"
    exit 1
fi

log "Starting deployment process..."

# Navigate to app directory
cd $APP_DIR

# Backup current version
log "Creating backup of current version..."
BACKUP_DIR="/var/backups/dinerosweeps/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
cp -r $BACKEND_DIR/dist $BACKUP_DIR/backend_dist 2>/dev/null || warning "No backend dist folder to backup"
cp -r $FRONTEND_DIR/.next $BACKUP_DIR/frontend_next 2>/dev/null || warning "No frontend .next folder to backup"

# Pull latest changes
log "Pulling latest changes from git..."
if git pull origin main; then
    log "Git pull successful"
else
    error "Git pull failed"
    exit 1
fi

# Backend deployment
log "Starting backend deployment..."
cd $BACKEND_DIR

# Check if .env exists
if [ ! -f ".env" ]; then
    error "Backend .env file not found. Please create it first."
    exit 1
fi

# Install dependencies
log "Installing backend dependencies..."
if npm install --production; then
    log "Backend dependencies installed successfully"
else
    error "Backend dependencies installation failed"
    exit 1
fi

# Build backend
log "Building backend..."
if npm run build; then
    log "Backend build successful"
else
    error "Backend build failed"
    exit 1
fi

# Restart backend with PM2
log "Restarting backend with PM2..."
if pm2 restart dinerosweeps-backend; then
    log "Backend restarted successfully"
else
    error "Backend restart failed"
    exit 1
fi

# Frontend deployment
log "Starting frontend deployment..."
cd $FRONTEND_DIR

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    warning "Frontend .env.local file not found. Creating from template..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://api.dinerosweeps.com
NEXT_PUBLIC_SOCKET_URL=https://api.dinerosweeps.com
NEXT_PUBLIC_SITE_URL=https://dinerosweeps.com
EOF
fi

# Install dependencies
log "Installing frontend dependencies..."
if npm install --production; then
    log "Frontend dependencies installed successfully"
else
    error "Frontend dependencies installation failed"
    exit 1
fi

# Build frontend
log "Building frontend..."
if npm run build; then
    log "Frontend build successful"
else
    error "Frontend build failed"
    exit 1
fi

# Restart frontend with PM2
log "Restarting frontend with PM2..."
if pm2 restart dinerosweeps-frontend; then
    log "Frontend restarted successfully"
else
    error "Frontend restart failed"
    exit 1
fi

# Save PM2 configuration
log "Saving PM2 configuration..."
pm2 save

# Check if services are running
log "Checking service status..."
sleep 5

if pm2 list | grep -q "dinerosweeps-backend.*online"; then
    log "Backend is running successfully"
else
    error "Backend is not running properly"
    pm2 logs dinerosweeps-backend --lines 20
fi

if pm2 list | grep -q "dinerosweeps-frontend.*online"; then
    log "Frontend is running successfully"
else
    error "Frontend is not running properly"
    pm2 logs dinerosweeps-frontend --lines 20
fi

# Test endpoints
log "Testing endpoints..."
if curl -f -s http://localhost:5000/health > /dev/null; then
    log "Backend health check passed"
else
    warning "Backend health check failed"
fi

if curl -f -s http://localhost:3000 > /dev/null; then
    log "Frontend health check passed"
else
    warning "Frontend health check failed"
fi

# Cleanup old backups (keep last 5)
log "Cleaning up old backups..."
find /var/backups/dinerosweeps -type d -mtime +7 -exec rm -rf {} \; 2>/dev/null || true

log "Deployment completed successfully!"
log "Your application should be accessible at:"
log "  Frontend: https://dinerosweeps.com"
log "  Backend API: https://api.dinerosweeps.com"

# Show PM2 status
log "Current PM2 status:"
pm2 list
