#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/dinerosweeps"
LOG_FILE="$APP_DIR/monitoring.log"

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

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}" | tee -a $LOG_FILE
}

# Check if service is running
check_service() {
    local service_name=$1
    local service_display_name=${2:-$service_name}
    
    if systemctl is-active --quiet $service_name; then
        log "$service_display_name is running"
        return 0
    else
        error "$service_display_name is not running"
        return 1
    fi
}

# Check RDS connection
check_rds_connection() {
    # This would need to be configured with actual RDS details
    # For now, we'll just log that we're using RDS
    log "Using AWS RDS for database"
    return 0
}

# Check PM2 process
check_pm2_process() {
    local process_name=$1
    
    if pm2 list | grep -q "$process_name.*online"; then
        log "PM2 process $process_name is running"
        return 0
    else
        error "PM2 process $process_name is not running"
        return 1
    fi
}

# Check disk usage
check_disk_usage() {
    local threshold=80
    local usage=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [ "$usage" -gt "$threshold" ]; then
        warning "Disk usage is high: ${usage}%"
        return 1
    else
        log "Disk usage is normal: ${usage}%"
        return 0
    fi
}

# Check memory usage
check_memory_usage() {
    local threshold=80
    local usage=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
    
    if [ "$usage" -gt "$threshold" ]; then
        warning "Memory usage is high: ${usage}%"
        return 1
    else
        log "Memory usage is normal: ${usage}%"
        return 0
    fi
}

# Check database connection
check_database() {
    # Check RDS connection (you'll need to configure this with your actual RDS details)
    if pg_isready -h your-rds-endpoint.region.rds.amazonaws.com -U your_username -d your_database_name > /dev/null 2>&1; then
        log "RDS database connection is healthy"
        return 0
    else
        error "RDS database connection failed"
        return 1
    fi
}

# Check Redis connection
check_redis() {
    if redis-cli ping > /dev/null 2>&1; then
        log "Redis connection is healthy"
        return 0
    else
        error "Redis connection failed"
        return 1
    fi
}

# Check application endpoints
check_endpoints() {
    # Check backend health
    if curl -f -s http://localhost:5000/health > /dev/null 2>&1; then
        log "Backend health check passed"
    else
        error "Backend health check failed"
    fi
    
    # Check frontend
    if curl -f -s http://localhost:3000 > /dev/null 2>&1; then
        log "Frontend health check passed"
    else
        error "Frontend health check failed"
    fi
}

# Check SSL certificate expiration
check_ssl_certificates() {
    local domains=("dinerosweeps.com" "www.dinerosweeps.com" "api.dinerosweeps.com")
    
    for domain in "${domains[@]}"; do
        local cert_file="/etc/letsencrypt/live/$domain/fullchain.pem"
        if [ -f "$cert_file" ]; then
            local expiry_date=$(openssl x509 -enddate -noout -in "$cert_file" | cut -d= -f2)
            local expiry_epoch=$(date -d "$expiry_date" +%s)
            local current_epoch=$(date +%s)
            local days_until_expiry=$(( (expiry_epoch - current_epoch) / 86400 ))
            
            if [ "$days_until_expiry" -lt 30 ]; then
                warning "SSL certificate for $domain expires in $days_until_expiry days"
            else
                log "SSL certificate for $domain expires in $days_until_expiry days"
            fi
        else
            warning "SSL certificate for $domain not found"
        fi
    done
}

# Check log file sizes
check_log_sizes() {
    local max_size_mb=100
    
    # Check Nginx logs
    local nginx_access_size=$(du -m /var/log/nginx/access.log 2>/dev/null | cut -f1 || echo "0")
    local nginx_error_size=$(du -m /var/log/nginx/error.log 2>/dev/null | cut -f1 || echo "0")
    
    if [ "$nginx_access_size" -gt "$max_size_mb" ]; then
        warning "Nginx access log is large: ${nginx_access_size}MB"
    fi
    
    if [ "$nginx_error_size" -gt "$max_size_mb" ]; then
        warning "Nginx error log is large: ${nginx_error_size}MB"
    fi
    
    # Check PM2 logs
    local pm2_log_size=$(du -m ~/.pm2/logs 2>/dev/null | cut -f1 || echo "0")
    if [ "$pm2_log_size" -gt "$max_size_mb" ]; then
        warning "PM2 logs are large: ${pm2_log_size}MB"
    fi
}

# Check backup status
check_backups() {
    local backup_dir="/var/backups/dinerosweeps"
    local latest_backup=$(find "$backup_dir" -name "*.sql.gz" -type f -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2-)
    
    if [ -n "$latest_backup" ]; then
        local backup_age=$(( ($(date +%s) - $(stat -c %Y "$latest_backup")) / 86400 ))
        if [ "$backup_age" -gt 2 ]; then
            warning "Latest backup is $backup_age days old"
        else
            log "Latest backup is $backup_age days old"
        fi
    else
        warning "No database backups found"
    fi
}

# Main monitoring function
main() {
    log "Starting system monitoring..."
    
    local issues=0
    
    # System services
    info "Checking system services..."
    check_service nginx "Nginx" || ((issues++))
    check_rds_connection || ((issues++))
    check_service redis-server "Redis" || ((issues++))
    
    # PM2 processes
    info "Checking PM2 processes..."
    check_pm2_process "dinerosweeps-backend" || ((issues++))
    check_pm2_process "dinerosweeps-frontend" || ((issues++))
    
    # System resources
    info "Checking system resources..."
    check_disk_usage || ((issues++))
    check_memory_usage || ((issues++))
    
    # Database and Redis
    info "Checking database connections..."
    check_database || ((issues++))
    check_redis || ((issues++))
    
    # Application endpoints
    info "Checking application endpoints..."
    check_endpoints
    
    # SSL certificates
    info "Checking SSL certificates..."
    check_ssl_certificates
    
    # Log files
    info "Checking log file sizes..."
    check_log_sizes
    
    # Backups
    info "Checking backup status..."
    check_backups
    
    # Summary
    if [ "$issues" -eq 0 ]; then
        log "All systems are healthy!"
    else
        warning "Found $issues issue(s) that need attention"
    fi
    
    # Display system information
    info "System Information:"
    info "  Uptime: $(uptime -p)"
    info "  Load Average: $(uptime | awk -F'load average:' '{print $2}')"
    info "  Disk Usage: $(df -h / | tail -1 | awk '{print $5}')"
    info "  Memory Usage: $(free | grep Mem | awk '{printf("%.1f%%", $3/$2 * 100.0)}')"
    
    log "Monitoring completed!"
}

# Run monitoring
main "$@"
