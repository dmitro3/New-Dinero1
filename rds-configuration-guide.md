# AWS RDS Configuration Guide for Dinerosweeps.com

## 🎯 Overview
Since you already have AWS RDS set up, this guide will help you configure your application to use your existing RDS database instead of setting up a local PostgreSQL instance.

## 📋 Prerequisites
- AWS RDS PostgreSQL instance running
- RDS endpoint, username, password, and database name
- EC2 instance in the same VPC as RDS (or proper security group configuration)

---

## Step 1: Verify Your RDS Configuration

### 1.1 Get RDS Details from AWS Console
1. **Login to AWS Console** → RDS Dashboard
2. **Select your database instance**
3. **Note down these details:**
   - **Endpoint**: `your-db-instance.region.rds.amazonaws.com`
   - **Port**: Usually 5432
   - **Database Name**: Your database name
   - **Master Username**: Your database username
   - **Master Password**: Your database password

### 1.2 Check RDS Security Group
Ensure your RDS security group allows connections from your EC2 instance:
- **Type**: PostgreSQL
- **Port**: 5432
- **Source**: Your EC2 security group or EC2 private IP

---

## Step 2: Test RDS Connection from EC2

### 2.1 Install PostgreSQL Client
```bash
# On your EC2 instance
sudo apt update
sudo apt install -y postgresql-client
```

### 2.2 Test Connection
```bash
# Test connection to your RDS instance
psql -h your-rds-endpoint.region.rds.amazonaws.com -U your_username -d your_database_name

# Example:
# psql -h dinerosweeps-db.us-east-1.rds.amazonaws.com -U dinerosweeps_user -d dinerosweeps
```

### 2.3 Verify Database Access
```bash
# Test basic queries
psql -h your-rds-endpoint.region.rds.amazonaws.com -U your_username -d your_database_name -c "SELECT version();"
psql -h your-rds-endpoint.region.rds.amazonaws.com -U your_username -d your_database_name -c "SELECT current_database();"
```

---

## Step 3: Configure Backend Environment

### 3.1 Update Backend .env File
```bash
cd /var/www/dinerosweeps/backend
nano .env
```

**Replace the database settings with your RDS details:**
```env
# Database settings (AWS RDS)
DB_SYNC=true
DB_PORT=5432
DB_WRITE_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_READ_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_USER=your_rds_username
DB_PASSWORD=your_rds_password
DB_NAME=your_database_name

# Example:
# DB_WRITE_HOST=dinerosweeps-db.us-east-1.rds.amazonaws.com
# DB_READ_HOST=dinerosweeps-db.us-east-1.rds.amazonaws.com
# DB_USER=dinerosweeps_user
# DB_PASSWORD=your_secure_password
# DB_NAME=dinerosweeps
```

### 3.2 Test Backend Database Connection
```bash
# Test if your backend can connect to RDS
cd /var/www/dinerosweeps/backend
npm run build
npm start

# Check the logs for database connection success
```

---

## Step 4: Update Monitoring Scripts

### 4.1 Update Monitoring Script
```bash
nano /var/www/dinerosweeps/monitoring.sh
```

**Find and update the database check function:**
```bash
# Check database connection
check_database() {
    # Update with your actual RDS details
    if pg_isready -h your-rds-endpoint.region.rds.amazonaws.com -U your_username -d your_database_name > /dev/null 2>&1; then
        log "RDS database connection is healthy"
        return 0
    else
        error "RDS database connection failed"
        return 1
    fi
}
```

### 4.2 Update Backup Script
```bash
nano /var/www/dinerosweeps/backup.sh
```

**Find and update the database backup section:**
```bash
# Database backup (AWS RDS)
log "Creating database backup..."
DB_BACKUP_FILE="$BACKUP_DIR/db_backup_$DATE.sql"
if pg_dump -h your-rds-endpoint.region.rds.amazonaws.com -U your_username your_database_name > $DB_BACKUP_FILE 2>/dev/null; then
    log "Database backup created: $DB_BACKUP_FILE"
    
    # Compress database backup
    gzip $DB_BACKUP_FILE
    log "Database backup compressed: ${DB_BACKUP_FILE}.gz"
else
    error "Database backup failed"
    log "Note: Update the backup script with your actual RDS endpoint and credentials"
    exit 1
fi
```

---

## Step 5: Database Schema Setup

### 5.1 Run Database Migrations
If your application uses database migrations:
```bash
cd /var/www/dinerosweeps/backend

# Run migrations (if your app has them)
npm run migrate
# or
npm run db:migrate
# or whatever migration command your app uses
```

### 5.2 Verify Tables
```bash
# Connect to RDS and check if tables exist
psql -h your-rds-endpoint.region.rds.amazonaws.com -U your_username -d your_database_name

# List tables
\dt

# Check specific table structure
\d table_name

# Exit
\q
```

---

## Step 6: Security Considerations

### 6.1 RDS Security Best Practices
- **Use SSL connections** (if required by your app)
- **Keep RDS in private subnet** (if possible)
- **Use strong passwords**
- **Regularly rotate credentials**
- **Enable automated backups**

### 6.2 Environment Variable Security
```bash
# Ensure .env file has proper permissions
chmod 600 /var/www/dinerosweeps/backend/.env

# Don't commit .env files to git
echo ".env" >> /var/www/dinerosweeps/backend/.gitignore
```

---

## Step 7: Testing Your RDS Setup

### 7.1 Test Application Connection
```bash
# Start your backend application
cd /var/www/dinerosweeps/backend
pm2 start ecosystem.config.js

# Check logs for database connection
pm2 logs dinerosweeps-backend
```

### 7.2 Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test any database-dependent endpoints
curl http://localhost:5000/api/your-endpoint
```

---

## 🔧 Troubleshooting RDS Issues

### Common Issues and Solutions

**1. Connection Timeout**
```bash
# Check if RDS endpoint is reachable
ping your-rds-endpoint.region.rds.amazonaws.com

# Check if port 5432 is open
telnet your-rds-endpoint.region.rds.amazonaws.com 5432
```

**2. Authentication Failed**
```bash
# Verify credentials
psql -h your-rds-endpoint.region.rds.amazonaws.com -U your_username -d your_database_name

# Check if user exists and has proper permissions
psql -h your-rds-endpoint.region.rds.amazonaws.com -U your_username -d your_database_name -c "\du"
```

**3. Security Group Issues**
- Ensure RDS security group allows connections from EC2
- Check if both instances are in the same VPC
- Verify network ACLs allow the traffic

**4. Database Not Found**
```bash
# List all databases
psql -h your-rds-endpoint.region.rds.amazonaws.com -U your_username -l

# Create database if it doesn't exist
psql -h your-rds-endpoint.region.rds.amazonaws.com -U your_username -c "CREATE DATABASE your_database_name;"
```

---

## 📊 Monitoring RDS

### 7.1 AWS CloudWatch Metrics
Monitor these key metrics in AWS CloudWatch:
- **CPU Utilization**
- **Database Connections**
- **Free Storage Space**
- **Read/Write IOPS**
- **Network Throughput**

### 7.2 Application-Level Monitoring
```bash
# Check database connection in your app logs
pm2 logs dinerosweeps-backend | grep -i database

# Monitor query performance
pm2 logs dinerosweeps-backend | grep -i "query\|sql"
```

---

## ✅ RDS Configuration Checklist

- [ ] RDS endpoint, username, password, and database name noted
- [ ] PostgreSQL client installed on EC2
- [ ] RDS connection tested from EC2
- [ ] Backend .env file updated with RDS details
- [ ] Database migrations run (if applicable)
- [ ] Application can connect to RDS
- [ ] Monitoring scripts updated with RDS details
- [ ] Backup script updated with RDS details
- [ ] Security groups properly configured
- [ ] Environment variables secured
- [ ] Application tested with RDS connection

---

## 🎯 Benefits of Using AWS RDS

✅ **Managed Service**: AWS handles backups, updates, and maintenance  
✅ **High Availability**: Multi-AZ deployment options  
✅ **Scalability**: Easy to scale up/down as needed  
✅ **Security**: Built-in encryption and security features  
✅ **Monitoring**: CloudWatch integration for monitoring  
✅ **Backup**: Automated backups and point-in-time recovery  

**Your Dinerosweeps.com application is now configured to use AWS RDS! 🚀**
