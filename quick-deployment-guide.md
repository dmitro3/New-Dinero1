# Quick Deployment Guide - Dinerosweeps.com

## 🚀 Quick Start (Step-by-Step)

### 1. Launch EC2 Instance
- **Instance**: Ubuntu 22.04 LTS, t3.medium (2GB RAM)
- **Storage**: 20GB GP3 SSD
- **Security Groups**: SSH(22), HTTP(80), HTTPS(443), Custom(3000, 5000)

### 2. Connect & Setup Server
```bash
# Connect to your EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Run the setup script
chmod +x scripts/setup-server.sh
./scripts/setup-server.sh
```

### 3. Upload Your Code
```bash
# Option A: Git clone
cd /var/www/dinerosweeps
git clone https://github.com/yourusername/New-Dinero1.git .

# Option B: Upload via SCP
scp -r -i your-key.pem ./New-Dinero1 ubuntu@your-ec2-ip:/var/www/dinerosweeps/
```

### 4. Configure Environment
```bash
# Backend
cd /var/www/dinerosweeps/backend
cp .env.template .env
nano .env  # Edit with your actual values

# Frontend
cd /var/www/dinerosweeps/frontend
cp .env.local.template .env.local
nano .env.local  # Edit with your actual values
```

### 5. Deploy Application
```bash
cd /var/www/dinerosweeps
chmod +x deploy.sh
./deploy.sh
```

### 6. Configure DNS (Namecheap)
Add these A records pointing to your EC2 IP:
- `dinerosweeps.com` → Your EC2 IP
- `www.dinerosweeps.com` → Your EC2 IP
- `api.dinerosweeps.com` → Your EC2 IP

### 7. Install SSL Certificate
```bash
# Wait for DNS propagation (up to 48 hours), then:
sudo certbot --nginx -d dinerosweeps.com -d www.dinerosweeps.com -d api.dinerosweeps.com
```

## 📋 Essential Commands

### Monitoring
```bash
# Check system health
./scripts/monitoring.sh

# PM2 status
pm2 status
pm2 logs

# Service status
sudo systemctl status nginx postgresql redis-server
```

### Deployment
```bash
# Deploy updates
./deploy.sh

# Manual restart
pm2 restart all
sudo systemctl restart nginx
```

### Backups
```bash
# Manual backup
./backup.sh

# Check backups
ls -la /var/backups/dinerosweeps/
```

### Logs
```bash
# Application logs
pm2 logs dinerosweeps-backend
pm2 logs dinerosweeps-frontend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
sudo journalctl -u postgresql -f
```

## 🔧 Configuration Files

### Backend Environment (.env)
```env
# Database
DB_USER=dinerosweeps_user
DB_PASSWORD=dinerosweeps_secure_password_2024
DB_NAME=dinerosweeps

# URLs
USER_BACKEND_URL=https://api.dinerosweeps.com
USER_FRONTEND_URL=https://dinerosweeps.com

# JWT Secrets (CHANGE THESE!)
JWT_LOGIN_SECRET=your_secure_jwt_secret_here
VERIFICATION_TOKEN_SECRET=your_secure_verification_secret_here
```

### Frontend Environment (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.dinerosweeps.com
NEXT_PUBLIC_SOCKET_URL=https://api.dinerosweeps.com
NEXT_PUBLIC_SITE_URL=https://dinerosweeps.com
```

## 🛠️ Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Check what's using the port
sudo netstat -tlnp | grep :5000
sudo netstat -tlnp | grep :3000

# Kill process if needed
sudo kill -9 <PID>
```

**Permission Issues**
```bash
# Fix ownership
sudo chown -R ubuntu:ubuntu /var/www/dinerosweeps
sudo chown -R ubuntu:ubuntu /var/backups/dinerosweeps
```

**Database Connection Failed**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U dinerosweeps_user -d dinerosweeps
```

**SSL Certificate Issues**
```bash
# Check certificate status
sudo certbot certificates

# Renew manually
sudo certbot renew --force-renewal
```

**PM2 Process Not Starting**
```bash
# Check PM2 logs
pm2 logs dinerosweeps-backend --lines 50

# Restart PM2
pm2 kill
pm2 start ecosystem.config.js
pm2 start npm --name "dinerosweeps-frontend" -- start
```

## 📊 Performance Monitoring

### System Resources
```bash
# CPU and Memory
htop
free -h
df -h

# Network
iftop
nethogs
```

### Application Performance
```bash
# PM2 monitoring
pm2 monit

# Nginx status
sudo nginx -t
sudo systemctl status nginx
```

## 🔒 Security Checklist

- [ ] Firewall enabled (UFW)
- [ ] SSH key-based authentication only
- [ ] PostgreSQL bound to localhost only
- [ ] Redis password protected
- [ ] SSL certificates installed
- [ ] Regular backups configured
- [ ] Environment variables secured
- [ ] JWT secrets changed from defaults

## 📞 Support Commands

### Emergency Restart
```bash
# Full system restart
sudo reboot

# After reboot, start services
pm2 resurrect
sudo systemctl start nginx postgresql redis-server
```

### Rollback Deployment
```bash
# Restore from backup
cd /var/backups/dinerosweeps
# Find latest backup and restore
```

### Check All Services
```bash
# One-liner health check
echo "=== System Status ===" && \
echo "Nginx: $(systemctl is-active nginx)" && \
echo "PostgreSQL: $(systemctl is-active postgresql)" && \
echo "Redis: $(systemctl is-active redis-server)" && \
echo "PM2 Backend: $(pm2 list | grep dinerosweeps-backend | awk '{print $10}')" && \
echo "PM2 Frontend: $(pm2 list | grep dinerosweeps-frontend | awk '{print $10}')"
```

## 🎯 Final URLs

After successful deployment:
- **Frontend**: https://dinerosweeps.com
- **Backend API**: https://api.dinerosweeps.com
- **Health Check**: https://api.dinerosweeps.com/health

## 📝 Notes

- Keep your `.env` files secure and never commit them to git
- Regularly update your system: `sudo apt update && sudo apt upgrade`
- Monitor disk space: `df -h`
- Check logs regularly for errors
- Test SSL certificate renewal: `sudo certbot renew --dry-run`
