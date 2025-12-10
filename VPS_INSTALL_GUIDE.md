# VPS Deployment Guide
## Installing Eximpo on VPS 217.217.250.49 with Native PostgreSQL

This guide will install PostgreSQL directly on your VPS and run the application in Docker containers.

---

## Quick Start

### Method 1: Copy and Run on VPS

1. **SSH into your VPS:**
```bash
ssh root@217.217.250.49
```

2. **Download the installation script:**
```bash
curl -o install-vps.sh https://raw.githubusercontent.com/YOUR_REPO/main/install-vps.sh
# Or if files are already on VPS:
# cd /opt/eximpo
```

3. **Make executable and run:**
```bash
chmod +x install-vps.sh
./install-vps.sh
```

The script will automatically:
- ✅ Install PostgreSQL on VPS
- ✅ Create database and user
- ✅ Install Docker & Docker Compose
- ✅ Build and start application containers
- ✅ Configure Nginx
- ✅ Setup firewall
- ✅ Seed database with sample data

---

### Method 2: Upload from Windows

From your Windows machine with the project:

```powershell
# Upload project files
scp -r e:\projects\eximpo root@217.217.250.49:/opt/

# SSH into VPS
ssh root@217.217.250.49

# Run installation
cd /opt/eximpo
chmod +x install-vps.sh
./install-vps.sh
```

---

## What Gets Installed

### On VPS (Native):
- **PostgreSQL 14+** - Database server
- **Nginx** - Web server and reverse proxy
- **Certbot** - SSL certificate management
- **Docker & Docker Compose** - Container runtime

### In Docker Containers:
- **Backend** - Node.js + Express API (Port 5000)
- **Frontend** - React app served by Nginx (Port 3000)
- **Admin Panel** - Admin interface (Port 3001)

---

## Database Configuration

### Connection Details:
```
Host: localhost (on VPS)
Database: eximpo
User: eximpo_user
Password: Eximpo2024@SecureDB!9x7z
Port: 5432
```

### Access Database:
```bash
# From VPS
sudo -u postgres psql -d eximpo

# Check tables
\dt

# Check users
SELECT email, role FROM users;

# Exit
\q
```

---

## After Installation

### 1. Configure DNS

Point your domain to the VPS:
- **Type**: A Record
- **Host**: app
- **Value**: 217.217.250.49
- **TTL**: 300

Verify DNS:
```bash
nslookup app.eximpoglobal.net
# Should return: 217.217.250.49
```

### 2. Install SSL Certificate

Once DNS is configured:
```bash
certbot --nginx -d app.eximpoglobal.net
```

Follow the prompts:
- Enter your email
- Agree to Terms of Service
- Choose to redirect HTTP to HTTPS (recommended)

### 3. Test the Application

**Before SSL (HTTP):**
- http://app.eximpoglobal.net

**After SSL (HTTPS):**
- https://app.eximpoglobal.net

**Login with:**
- Admin: admin@eximpo.net / Admin@123
- Buyer: buyer@eximpo.net / Test@123
- Seller: seller@eximpo.net / Test@123

---

## Management Commands

### Application Services

```bash
cd /opt/eximpo

# View status
docker-compose -f docker-compose.vps.yml ps

# View logs
docker-compose -f docker-compose.vps.yml logs -f backend

# Restart services
docker-compose -f docker-compose.vps.yml restart

# Stop all
docker-compose -f docker-compose.vps.yml down

# Start all
docker-compose -f docker-compose.vps.yml up -d
```

### PostgreSQL

```bash
# Check status
systemctl status postgresql

# Restart
systemctl restart postgresql

# View logs
journalctl -u postgresql -f

# Access database
sudo -u postgres psql -d eximpo

# Backup database
sudo -u postgres pg_dump eximpo > backup_$(date +%Y%m%d).sql

# Restore database
sudo -u postgres psql eximpo < backup_20241210.sql
```

### Nginx

```bash
# Check status
systemctl status nginx

# Test configuration
nginx -t

# Reload (without downtime)
systemctl reload nginx

# Restart
systemctl restart nginx

# View access logs
tail -f /var/log/nginx/access.log

# View error logs
tail -f /var/log/nginx/error.log
```

---

## Troubleshooting

### Issue: Can't connect to database from Docker

**Check PostgreSQL is accepting connections:**
```bash
sudo -u postgres psql -c "SHOW listen_addresses;"
```

Should show `*` or `0.0.0.0`

**Check pg_hba.conf:**
```bash
cat /etc/postgresql/*/main/pg_hba.conf | grep 172.17
```

Should include Docker networks.

**Fix:**
```bash
# Edit postgresql.conf
nano /etc/postgresql/*/main/postgresql.conf
# Add: listen_addresses = '*'

# Edit pg_hba.conf
nano /etc/postgresql/*/main/pg_hba.conf
# Add: host all all 172.17.0.0/16 md5
#      host all all 172.18.0.0/16 md5

# Restart
systemctl restart postgresql
```

### Issue: 502 Bad Gateway

**Check if containers are running:**
```bash
cd /opt/eximpo
docker-compose -f docker-compose.vps.yml ps
```

**Check backend logs:**
```bash
docker-compose -f docker-compose.vps.yml logs backend
```

**Restart backend:**
```bash
docker-compose -f docker-compose.vps.yml restart backend
```

### Issue: Database connection refused

**Get VPS IP:**
```bash
hostname -I | awk '{print $1}'
```

**Update DATABASE_URL in .env.production:**
```bash
nano /opt/eximpo/.env.production
# Change DATABASE_URL to use correct IP
```

**Restart services:**
```bash
docker-compose -f docker-compose.vps.yml restart
```

### Issue: SSL certificate failed

**Make sure DNS is pointing correctly:**
```bash
nslookup app.eximpoglobal.net
dig app.eximpoglobal.net
```

**Check Nginx is running:**
```bash
systemctl status nginx
netstat -tlnp | grep :80
```

**Try again:**
```bash
certbot --nginx -d app.eximpoglobal.net
```

---

## Security Checklist

- ✅ PostgreSQL password changed from default
- ✅ Firewall enabled (UFW)
- ✅ Only necessary ports open (22, 80, 443)
- ✅ PostgreSQL not exposed to internet (local only)
- ✅ SSL certificate installed
- ✅ JWT secret set to random string
- ✅ Admin passwords changed

### Additional Security (Recommended)

**Install Fail2ban:**
```bash
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban
```

**Disable SSH password authentication:**
```bash
nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
systemctl restart sshd
```

**Setup automatic updates:**
```bash
apt install unattended-upgrades -y
dpkg-reconfigure --priority=low unattended-upgrades
```

---

## Backup Strategy

### Database Backup Script

Create `/opt/backup-db.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

sudo -u postgres pg_dump eximpo > $BACKUP_DIR/eximpo_$DATE.sql
gzip $BACKUP_DIR/eximpo_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "eximpo_*.sql.gz" -mtime +7 -delete

echo "Backup completed: eximpo_$DATE.sql.gz"
```

**Make executable:**
```bash
chmod +x /opt/backup-db.sh
```

**Add to crontab (daily at 2 AM):**
```bash
crontab -e
# Add: 0 2 * * * /opt/backup-db.sh
```

---

## Monitoring

### Check System Resources

```bash
# CPU and Memory
htop

# Disk usage
df -h

# Docker stats
docker stats

# PostgreSQL connections
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"
```

### Application Health

```bash
# Backend health check
curl http://localhost:5000/api/health

# Check if frontend is serving
curl -I http://localhost:3000

# Check database connectivity
docker exec eximpo-backend-vps node -e "const { Pool } = require('pg'); const pool = new Pool({connectionString: process.env.DATABASE_URL}); pool.query('SELECT NOW()').then(res => console.log('DB OK:', res.rows[0])).catch(err => console.error('DB Error:', err));"
```

---

## Update Application

### Pull Latest Code and Rebuild

```bash
cd /opt/eximpo

# Backup database first
sudo -u postgres pg_dump eximpo > backup_before_update_$(date +%Y%m%d).sql

# Pull latest code (if using git)
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.vps.yml down
docker-compose -f docker-compose.vps.yml up -d --build

# Check status
docker-compose -f docker-compose.vps.yml ps
docker-compose -f docker-compose.vps.yml logs -f
```

---

## Support

### Log Locations

- **Application**: `docker-compose -f /opt/eximpo/docker-compose.vps.yml logs`
- **Nginx**: `/var/log/nginx/`
- **PostgreSQL**: `/var/log/postgresql/`
- **System**: `journalctl -u service-name`

### Useful Links

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

---

## Quick Reference

| Service | Port | Command |
|---------|------|---------|
| Frontend | 3000 | `docker logs eximpo-frontend-vps` |
| Backend | 5000 | `docker logs eximpo-backend-vps` |
| Admin | 3001 | `docker logs eximpo-admin-vps` |
| PostgreSQL | 5432 | `sudo -u postgres psql -d eximpo` |
| Nginx | 80/443 | `systemctl status nginx` |

**Application URL**: https://app.eximpoglobal.net  
**Database**: PostgreSQL on VPS (localhost:5432)  
**Password**: Eximpo2024@SecureDB!9x7z
