# 📋 Pre-Deployment Checklist for app.eximpoglobal.net

## ✅ Server Requirements

- [ ] VPS/Server with minimum 4GB RAM, 2 CPU cores
- [ ] Ubuntu 20.04+ or similar Linux distribution
- [ ] Docker and Docker Compose installed
- [ ] Domain DNS pointing to server IP
- [ ] SSL certificate ready (Let's Encrypt)
- [ ] Ports 80, 443, 5000, 3000 open in firewall

---

## ✅ Files to Prepare

### 1. Environment Configuration
```bash
# Copy and configure production environment
cp .env.production.example .env.production
nano .env.production
```

**Update these values in .env.production:**
- `DB_PASSWORD` - Strong database password
- `JWT_SECRET` - Random 64-character string
- `CORS_ORIGIN` - https://app.eximpoglobal.net
- Keep existing Contabo and Brevo credentials

### 2. Upload to Server
```bash
# From your local machine
scp -r ./eximpo root@your-server-ip:/opt/
```

Or clone from Git:
```bash
ssh root@your-server-ip
cd /opt
git clone https://github.com/your-repo/eximpo.git
cd eximpo
```

---

## ✅ Deployment Steps

### Step 1: Configure Environment
```bash
cd /opt/eximpo
cp .env.production.example .env.production
nano .env.production  # Edit with your values
```

### Step 2: Run Deployment Script
```bash
chmod +x deploy-production.sh
./deploy-production.sh
```

### Step 3: Configure Nginx
```bash
# Install Nginx
sudo apt install nginx

# Create site configuration
sudo nano /etc/nginx/sites-available/app.eximpoglobal.net
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name app.eximpoglobal.net;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.eximpoglobal.net;

    ssl_certificate /etc/letsencrypt/live/app.eximpoglobal.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.eximpoglobal.net/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 10M;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/app.eximpoglobal.net /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: Get SSL Certificate
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d app.eximpoglobal.net
```

---

## ✅ Post-Deployment Verification

### 1. Check Services
```bash
docker-compose -f docker-compose.production.yml ps
```

All services should show "Up" status.

### 2. Test Endpoints
```bash
# Health check
curl https://app.eximpoglobal.net/api/health

# Products
curl https://app.eximpoglobal.net/api/products
```

### 3. Test Login
Visit: https://app.eximpoglobal.net

Login with:
- **Buyer:** buyer@eximpo.net / Test@123
- **Seller:** seller@eximpo.net / Test@123
- **Admin:** admin@eximpo.net / Admin@123

### 4. Verify Features
- [ ] Products loading in catalog
- [ ] Login/Register working
- [ ] User can browse products
- [ ] Images loading correctly
- [ ] No console errors

---

## ✅ Security Checklist

- [ ] Strong database password set
- [ ] JWT_SECRET is random and secure
- [ ] SSL certificate installed and valid
- [ ] Firewall configured (UFW)
- [ ] Fail2Ban installed for SSH protection
- [ ] Environment variables not exposed
- [ ] CORS properly configured
- [ ] Regular backups scheduled

---

## 🔧 Maintenance Commands

### View Logs
```bash
docker-compose -f docker-compose.production.yml logs -f
docker-compose -f docker-compose.production.yml logs -f backend
```

### Restart Services
```bash
docker-compose -f docker-compose.production.yml restart
docker-compose -f docker-compose.production.yml restart backend
```

### Update Application
```bash
git pull origin main
docker-compose -f docker-compose.production.yml up -d --build
```

### Database Backup
```bash
docker exec eximpo-postgres-prod pg_dump -U postgres eximpo > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
cat backup_20241210.sql | docker exec -i eximpo-postgres-prod psql -U postgres -d eximpo
```

---

## 🆘 Troubleshooting

### Services Won't Start
```bash
docker-compose -f docker-compose.production.yml logs
```

### Database Connection Failed
Check DATABASE_URL in .env.production matches postgres service name

### Frontend 502 Error
Backend not ready yet, wait 30 seconds and refresh

### SSL Certificate Issues
```bash
sudo certbot renew --dry-run
```

---

## 📞 Support Contact

For deployment support:
- Technical Team: [your-email]
- Documentation: /PRODUCTION_DEPLOYMENT.md

---

**Deployment Checklist Version:** 1.0
**Last Updated:** December 10, 2025
**Target Domain:** app.eximpoglobal.net
