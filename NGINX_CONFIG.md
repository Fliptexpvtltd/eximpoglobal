# Nginx Configuration for app.eximpoglobal.net

## VPS Information
- **IP Address**: 217.217.250.49
- **Domain**: app.eximpoglobal.net
- **User**: root

---

## Step 1: Install Nginx

SSH into your VPS:
```bash
ssh root@217.217.250.49
```

Install Nginx:
```bash
apt update
apt install nginx -y
systemctl enable nginx
systemctl start nginx
```

---

## Step 2: Create Nginx Configuration

Create the configuration file:
```bash
nano /etc/nginx/sites-available/eximpoglobal
```

Paste this configuration:
```nginx
# HTTP - Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name app.eximpoglobal.net;

    # Let's Encrypt validation
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS - Main Application
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.eximpoglobal.net;

    # SSL certificates (will be configured by certbot)
    ssl_certificate /etc/letsencrypt/live/app.eximpoglobal.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.eximpoglobal.net/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Increase upload size for product images
    client_max_body_size 50M;

    # Frontend (React App)
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

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts for long-running requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Admin Panel
    location /admin/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support for development
    location /sockjs-node/ {
        proxy_pass http://localhost:3000/sockjs-node/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }

    # Logs
    access_log /var/log/nginx/eximpoglobal_access.log;
    error_log /var/log/nginx/eximpoglobal_error.log;
}
```

---

## Step 3: Enable Configuration

```bash
# Create symlink
ln -s /etc/nginx/sites-available/eximpoglobal /etc/nginx/sites-enabled/

# Remove default configuration
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

---

## Step 4: Configure DNS

Before setting up SSL, configure your DNS:

1. Go to your domain registrar (e.g., GoDaddy, Namecheap)
2. Add an A record:
   - **Host**: app
   - **Type**: A
   - **Value**: 217.217.250.49
   - **TTL**: 300

Wait 5-10 minutes for DNS propagation, then verify:
```bash
# From your local machine
nslookup app.eximpoglobal.net
# Should return: 217.217.250.49
```

---

## Step 5: Install SSL Certificate

Install Certbot:
```bash
apt install certbot python3-certbot-nginx -y
```

Obtain SSL certificate:
```bash
certbot --nginx -d app.eximpoglobal.net
```

Follow the prompts:
- Enter email address for urgent renewal notices
- Agree to Terms of Service
- Choose whether to share email with EFF
- Certificate will be automatically installed

Test auto-renewal:
```bash
certbot renew --dry-run
```

---

## Step 6: Configure Firewall

```bash
# Allow SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

---

## Step 7: Verify Deployment

### Check Docker Containers
```bash
cd /opt/eximpo
docker-compose -f docker-compose.production.yml ps
```

All services should be "Up" and healthy.

### Check Nginx Status
```bash
systemctl status nginx
```

### Test URLs
From your browser:
- https://app.eximpoglobal.net (Frontend)
- https://app.eximpoglobal.net/api/health (Backend)
- https://app.eximpoglobal.net/admin (Admin Panel)

### Test Login
- Email: buyer@eximpo.net
- Password: Test@123

---

## Step 8: Monitor Logs

### Nginx Logs
```bash
# Access logs
tail -f /var/log/nginx/eximpoglobal_access.log

# Error logs
tail -f /var/log/nginx/eximpoglobal_error.log
```

### Application Logs
```bash
cd /opt/eximpo

# Backend logs
docker-compose -f docker-compose.production.yml logs -f backend

# Frontend logs
docker-compose -f docker-compose.production.yml logs -f frontend

# Database logs
docker-compose -f docker-compose.production.yml logs -f postgres
```

---

## Troubleshooting

### Issue: 502 Bad Gateway
**Cause**: Backend container not running or not accessible

**Solution**:
```bash
cd /opt/eximpo
docker-compose -f docker-compose.production.yml ps
docker-compose -f docker-compose.production.yml restart backend
```

### Issue: SSL Certificate Error
**Cause**: Certificate not properly installed

**Solution**:
```bash
certbot certificates
certbot renew --force-renewal -d app.eximpoglobal.net
systemctl reload nginx
```

### Issue: Can't Connect to Database
**Cause**: PostgreSQL container not running

**Solution**:
```bash
cd /opt/eximpo
docker-compose -f docker-compose.production.yml restart postgres
docker exec -i eximpo-postgres-prod psql -U postgres -c "SELECT 1;"
```

### Issue: CORS Errors
**Cause**: Backend CORS_ORIGIN misconfigured

**Solution**:
1. Edit `/opt/eximpo/.env.production`
2. Set: `CORS_ORIGIN=https://app.eximpoglobal.net`
3. Restart backend: `docker-compose -f docker-compose.production.yml restart backend`

---

## Security Checklist

- ✅ Firewall enabled (UFW)
- ✅ SSH key authentication (disable password auth)
- ✅ SSL/TLS certificate installed
- ✅ Strong database password
- ✅ Random JWT secret (64 chars)
- ✅ Regular security updates
- ✅ Fail2ban installed (optional but recommended)

### Install Fail2ban (Optional)
```bash
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban
```

---

## Maintenance Commands

### Update Application
```bash
cd /opt/eximpo
git pull origin main  # If using git
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d --build
```

### Backup Database
```bash
docker exec eximpo-postgres-prod pg_dump -U postgres eximpo > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
docker exec -i eximpo-postgres-prod psql -U postgres eximpo < backup_20241210.sql
```

### View Disk Usage
```bash
df -h
docker system df
```

### Clean Docker
```bash
docker system prune -a
```

---

## Quick Commands Reference

| Action | Command |
|--------|---------|
| Start services | `cd /opt/eximpo && docker-compose -f docker-compose.production.yml up -d` |
| Stop services | `cd /opt/eximpo && docker-compose -f docker-compose.production.yml down` |
| Restart services | `cd /opt/eximpo && docker-compose -f docker-compose.production.yml restart` |
| View logs | `cd /opt/eximpo && docker-compose -f docker-compose.production.yml logs -f` |
| Check status | `cd /opt/eximpo && docker-compose -f docker-compose.production.yml ps` |
| Reload Nginx | `systemctl reload nginx` |
| Restart Nginx | `systemctl restart nginx` |
| Renew SSL | `certbot renew` |

---

## Support

For issues or questions:
- Check logs: Application logs in Docker, Nginx logs in `/var/log/nginx/`
- Review documentation: `PRODUCTION_DEPLOYMENT.md`, `DEPLOYMENT_CHECKLIST.md`
- Verify environment: `.env.production` settings correct
