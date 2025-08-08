#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/dinerosweeps"
APP_DIR="/var/www/dinerosweeps"
DB_NAME="dinerosweeps"
DB_USER="dinerosweeps_user"
LOG_FILE="$BACKUP_DIR/backup.log"

# Create backup directory
mkdir -p $BACKUP_DIR

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

log "Starting backup process..."

# Database backup (AWS RDS)
log "Creating database backup..."
DB_BACKUP_FILE="$BACKUP_DIR/db_backup_$DATE.sql"
if pg_dump -h your-rds-endpoint.region.rds.amazonaws.com -U your_username $DB_NAME > $DB_BACKUP_FILE 2>/dev/null; then
    log "Database backup created: $DB_BACKUP_FILE"
    
    # Compress database backup
    gzip $DB_BACKUP_FILE
    log "Database backup compressed: ${DB_BACKUP_FILE}.gz"
else
    error "Database backup failed"
    log "Note: Update the backup script with your actual RDS endpoint and credentials"
    exit 1
fi

# Application backup
log "Creating application backup..."
APP_BACKUP_FILE="$BACKUP_DIR/app_backup_$DATE.tar.gz"
if tar -czf $APP_BACKUP_FILE -C /var/www dinerosweeps --exclude='node_modules' --exclude='.git' --exclude='.next' --exclude='dist' 2>/dev/null; then
    log "Application backup created: $APP_BACKUP_FILE"
else
    error "Application backup failed"
    exit 1
fi

# Environment files backup
log "Creating environment files backup..."
ENV_BACKUP_FILE="$BACKUP_DIR/env_backup_$DATE.tar.gz"
if tar -czf $ENV_BACKUP_FILE -C $APP_DIR backend/.env frontend/.env.local 2>/dev/null; then
    log "Environment files backup created: $ENV_BACKUP_FILE"
else
    warning "Environment files backup failed (files might not exist)"
fi

# PM2 configuration backup
log "Creating PM2 configuration backup..."
PM2_BACKUP_FILE="$BACKUP_DIR/pm2_backup_$DATE.json"
if pm2 save --force > /dev/null 2>&1; then
    cp ~/.pm2/dump.pm2 $PM2_BACKUP_FILE 2>/dev/null && log "PM2 configuration backup created: $PM2_BACKUP_FILE" || warning "PM2 configuration backup failed"
else
    warning "PM2 save failed"
fi

# Nginx configuration backup
log "Creating Nginx configuration backup..."
NGINX_BACKUP_FILE="$BACKUP_DIR/nginx_backup_$DATE.tar.gz"
if tar -czf $NGINX_BACKUP_FILE -C /etc nginx/sites-available nginx/sites-enabled 2>/dev/null; then
    log "Nginx configuration backup created: $NGINX_BACKUP_FILE"
else
    warning "Nginx configuration backup failed"
fi

# Calculate backup sizes
log "Backup sizes:"
if [ -f "${DB_BACKUP_FILE}.gz" ]; then
    DB_SIZE=$(du -h "${DB_BACKUP_FILE}.gz" | cut -f1)
    log "  Database: $DB_SIZE"
fi

if [ -f "$APP_BACKUP_FILE" ]; then
    APP_SIZE=$(du -h "$APP_BACKUP_FILE" | cut -f1)
    log "  Application: $APP_SIZE"
fi

if [ -f "$ENV_BACKUP_FILE" ]; then
    ENV_SIZE=$(du -h "$ENV_BACKUP_FILE" | cut -f1)
    log "  Environment files: $ENV_SIZE"
fi

# Cleanup old backups (keep last 7 days)
log "Cleaning up old backups..."
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete 2>/dev/null || true
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete 2>/dev/null || true
find $BACKUP_DIR -name "*.json" -mtime +7 -delete 2>/dev/null || true

# List remaining backups
log "Remaining backups:"
ls -lh $BACKUP_DIR/*.gz $BACKUP_DIR/*.json 2>/dev/null | while read line; do
    log "  $line"
done

# Check available disk space
DISK_USAGE=$(df -h $BACKUP_DIR | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    warning "Disk usage is high: ${DISK_USAGE}%"
fi

log "Backup process completed successfully!"
log "Backup location: $BACKUP_DIR"

# Optional: Upload to S3 or other cloud storage
# Uncomment and configure if you want to upload backups to S3
# log "Uploading backup to S3..."
# aws s3 cp $DB_BACKUP_FILE.gz s3://your-backup-bucket/database/
# aws s3 cp $APP_BACKUP_FILE s3://your-backup-bucket/application/
