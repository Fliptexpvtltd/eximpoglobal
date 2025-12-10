# 🚀 Contabo VPS Deployment Guide

Complete guide to deploy Eximpo platform on Contabo VPS with Docker.

## 📋 Prerequisites

- Contabo VPS (recommended: VPS M or higher - 4GB+ RAM)
- Domain name (optional but recommended)
- SSH access to your VPS
- Basic Linux knowledge

## 🖥️ Recommended Contabo VPS Specs

### Minimum (VPS S):
- 4 vCPU Cores
- 8 GB RAM
- 200 GB SSD
- **Good for:** Testing, small traffic

### Recommended (VPS M):
- 6 vCPU Cores
- 16 GB RAM
- 400 GB SSD
- **Good for:** Production, moderate traffic

### Optimal (VPS L):
- 8 vCPU Cores
- 30 GB RAM
- 800 GB SSD
- **Good for:** High traffic, multiple services

## 🔧 Initial VPS Setup

### 1. Connect to Your VPS

```bash
ssh root@your-vps-ip
```

### 2. Update System

```bash
apt update && apt upgrade -y
```

### 3. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 4. Install Essential Tools

```bash
apt install -y git curl wget nano ufw fail2ban
```

### 5. Configure Firewall

```bash
# Enable UFW
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw allow 5000/tcp    # Backend API
ufw --force enable

# Check status
ufw status
```

### 6. Set Up Fail2Ban (Security)

```bash
systemctl enable fail2ban
systemctl start fail2ban
```

## 📦 Deploy Application

### 1. Clone Repository

```bash
cd /opt
git clone https://github.com/yourusername/eximpo.git
cd eximpo
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit configuration
nano .env
```

Update `.env` with:
```env
# Database
DB_NAME=eximpo
DB_USER=postgres
DB_PASSWORD=your-strong-password-here

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# API
API_URL=http://your-domain.com
CORS_ORIGIN=http://your-domain.com

# Admin (optional)
PGADMIN_EMAIL=admin@yourdomain.com
PGADMIN_PASSWORD=admin-password

# Redis (optional)
REDIS_PASSWORD=redis-strong-password
```

### 3. Build and Start Services

```bash
# Using Contabo optimized config
docker-compose -f docker-compose.contabo.yml up -d

# Or with all services including pgAdmin
docker-compose -f docker-compose.contabo.yml --profile admin up -d

# Or with Redis cache
docker-compose -f docker-compose.contabo.yml --profile cache up -d

# Or with both
docker-compose -f docker-compose.contabo.yml --profile admin --profile cache up -d
```

### 4. Check Container Status

```bash
docker-compose -f docker-compose.contabo.yml ps
docker-compose -f docker-compose.contabo.yml logs -f
```

## 🌐 Domain Setup

### 1. Point Domain to VPS

Add A records in your domain DNS:
```
@ A your-vps-ip
www A your-vps-ip
api A your-vps-ip
```

### 2. Install Nginx (Reverse Proxy)

```bash
apt install -y nginx certbot python3-certbot-nginx
```

### 3. Configure Nginx

```bash
nano /etc/nginx/sites-available/eximpo
```

Add configuration:
```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/eximpo /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 4. Install SSL Certificate

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

## 🔐 Security Hardening

### 1. SSH Key Authentication

```bash
# On your local machine
ssh-keygen -t rsa -b 4096

# Copy to server
ssh-copy-id root@your-vps-ip

# On server, disable password auth
nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
systemctl restart sshd
```

### 2. Change Default Ports (Optional)

```bash
# Edit SSH port
nano /etc/ssh/sshd_config
# Change Port 22 to something else like 2222

# Update firewall
ufw allow 2222/tcp
ufw delete allow 22/tcp
systemctl restart sshd
```

### 3. Set Up Automatic Updates

```bash
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

## 📊 Monitoring & Maintenance

### 1. View Logs

```bash
# All services
docker-compose -f docker-compose.contabo.yml logs -f

# Specific service
docker-compose -f docker-compose.contabo.yml logs -f backend
docker-compose -f docker-compose.contabo.yml logs -f postgres
```

### 2. Database Backup

```bash
# Create backup script
nano /opt/backup-db.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

docker exec eximpo-postgres-1 pg_dump -U postgres eximpo > $BACKUP_DIR/db_backup_$DATE.sql
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
```

Make executable and schedule:
```bash
chmod +x /opt/backup-db.sh
crontab -e
# Add: 0 2 * * * /opt/backup-db.sh >> /var/log/db-backup.log 2>&1
```

### 3. Resource Monitoring

```bash
# Install monitoring tools
docker run -d \
  --name=cadvisor \
  --restart=always \
  -p 8080:8080 \
  -v /:/rootfs:ro \
  -v /var/run:/var/run:ro \
  -v /sys:/sys:ro \
  -v /var/lib/docker/:/var/lib/docker:ro \
  google/cadvisor:latest

# Access at: http://your-vps-ip:8080
```

### 4. System Resources

```bash
# Check Docker stats
docker stats

# Check disk usage
df -h
docker system df

# Clean up unused resources
docker system prune -a --volumes
```

## 🔄 Updates & Deployment

### Update Application

```bash
cd /opt/eximpo

# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.contabo.yml up -d --build

# View logs
docker-compose -f docker-compose.contabo.yml logs -f
```

### Zero-Downtime Deployment

```bash
# Build new images
docker-compose -f docker-compose.contabo.yml build

# Rolling update
docker-compose -f docker-compose.contabo.yml up -d --no-deps --build frontend
docker-compose -f docker-compose.contabo.yml up -d --no-deps --build backend
```

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose -f docker-compose.contabo.yml logs backend

# Restart service
docker-compose -f docker-compose.contabo.yml restart backend

# Rebuild
docker-compose -f docker-compose.contabo.yml up -d --build backend
```

### Database Connection Issues

```bash
# Check if postgres is running
docker-compose -f docker-compose.contabo.yml ps postgres

# Access database
docker exec -it eximpo-postgres-1 psql -U postgres -d eximpo

# Check connections
docker exec -it eximpo-postgres-1 psql -U postgres -c "SELECT * FROM pg_stat_activity;"
```

### Out of Memory

```bash
# Check memory usage
free -h
docker stats

# Add swap space
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### Port Already in Use

```bash
# Find process using port
netstat -tulpn | grep :80

# Kill process
kill -9 <PID>
```

## 📈 Performance Optimization

### 1. Enable Docker Logging Limits

```bash
# Edit daemon.json
nano /etc/docker/daemon.json
```

Add:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Restart Docker:
```bash
systemctl restart docker
```

### 2. Database Tuning

The `postgres.conf` file is already optimized. Adjust based on your VPS:
- 2GB RAM: `shared_buffers = 512MB`
- 4GB RAM: `shared_buffers = 1GB`
- 8GB RAM: `shared_buffers = 2GB`

### 3. Enable Gzip in Nginx

Already configured in docker nginx.conf

## 💰 Estimated Costs

### Contabo VPS Pricing (as of 2025):
- **VPS S**: ~€5/month (4GB RAM)
- **VPS M**: ~€10/month (16GB RAM) ✅ Recommended
- **VPS L**: ~€20/month (30GB RAM)

### Additional Costs:
- Domain: ~€10-15/year
- SSL Certificate: FREE (Let's Encrypt)
- Backups: Built-in or external storage

## 🎯 Quick Commands Reference

```bash
# Start services
docker-compose -f docker-compose.contabo.yml up -d

# Stop services
docker-compose -f docker-compose.contabo.yml down

# View logs
docker-compose -f docker-compose.contabo.yml logs -f

# Restart service
docker-compose -f docker-compose.contabo.yml restart backend

# Update and rebuild
git pull && docker-compose -f docker-compose.contabo.yml up -d --build

# Database backup
docker exec eximpo-postgres-1 pg_dump -U postgres eximpo > backup.sql

# Restore database
docker exec -i eximpo-postgres-1 psql -U postgres eximpo < backup.sql

# Clean up
docker system prune -a --volumes
```

## 📞 Support & Resources

- **Contabo Support**: https://contabo.com/en/support/
- **Docker Docs**: https://docs.docker.com/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Nginx Docs**: https://nginx.org/en/docs/

## ✅ Post-Deployment Checklist

- [ ] VPS is secured (firewall, SSH keys)
- [ ] Domain is pointing to VPS
- [ ] SSL certificate is installed
- [ ] All containers are running
- [ ] Database backups are scheduled
- [ ] Monitoring is set up
- [ ] Application is accessible
- [ ] API endpoints are working
- [ ] Database connections are secure
- [ ] Logs are being collected

## 🎉 Success!

Your Eximpo platform is now live on Contabo VPS! 

Access your application at:
- **Frontend**: https://yourdomain.com
- **Backend API**: https://api.yourdomain.com
- **pgAdmin**: http://your-vps-ip:5050

Remember to:
1. Regular backups
2. Monitor resources
3. Keep software updated
4. Review security logs
