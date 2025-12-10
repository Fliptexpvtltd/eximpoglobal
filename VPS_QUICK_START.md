# Quick Deployment to VPS 217.217.250.49

## One-Command Deployment

### Prerequisites (Do Once)
```bash
# 1. Configure environment
cp .env.production.example .env.production
# Edit .env.production with your values

# 2. Run deployment script
chmod +x deploy-to-vps.sh
./deploy-to-vps.sh
```

---

## Post-Deployment Setup (Do Once)

### 1. Configure DNS (Before SSL)
Point your domain to VPS:
- **Type**: A Record
- **Host**: app
- **Value**: 217.217.250.49

Wait 5-10 minutes, then verify:
```bash
nslookup app.eximpoglobal.net
```

### 2. Setup Nginx + SSL (On VPS)
```bash
ssh root@217.217.250.49

# Install Nginx
apt update && apt install nginx certbot python3-certbot-nginx -y

# Copy Nginx config (see NGINX_CONFIG.md for full config)
nano /etc/nginx/sites-available/eximpoglobal
# Paste config from NGINX_CONFIG.md

# Enable site
ln -s /etc/nginx/sites-available/eximpoglobal /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# Install SSL
certbot --nginx -d app.eximpoglobal.net

# Configure firewall
ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp
ufw enable
```

---

## Access Information

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | https://app.eximpoglobal.net | N/A |
| **Admin Panel** | https://app.eximpoglobal.net/admin | admin@eximpo.net / Admin@123 |
| **Buyer Login** | https://app.eximpoglobal.net | buyer@eximpo.net / Test@123 |
| **Seller Login** | https://app.eximpoglobal.net | seller@eximpo.net / Test@123 |

---

## Quick Commands (On VPS)

```bash
# SSH into VPS
ssh root@217.217.250.49

# Navigate to app
cd /opt/eximpo

# Check status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f backend

# Restart services
docker-compose -f docker-compose.production.yml restart

# Stop all
docker-compose -f docker-compose.production.yml down

# Start all
docker-compose -f docker-compose.production.yml up -d
```

---

## Files Overview

| File | Purpose |
|------|---------|
| `deploy-to-vps.sh` | Main deployment script (run from local) |
| `.env.production` | Production environment variables |
| `docker-compose.production.yml` | Production Docker configuration |
| `NGINX_CONFIG.md` | Complete Nginx configuration guide |
| `PRODUCTION_DEPLOYMENT.md` | Detailed deployment documentation |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step checklist |
| `CLIENT_DEMO_GUIDE.md` | Client presentation guide |

---

## Troubleshooting

**502 Bad Gateway?**
```bash
cd /opt/eximpo
docker-compose -f docker-compose.production.yml restart backend
```

**Can't access site?**
```bash
# Check DNS
nslookup app.eximpoglobal.net

# Check Nginx
systemctl status nginx

# Check containers
docker-compose -f docker-compose.production.yml ps
```

**Database issues?**
```bash
cd /opt/eximpo
docker-compose -f docker-compose.production.yml restart postgres
docker exec -i eximpo-postgres-prod psql -U postgres -c "SELECT 1;"
```

---

## Next Steps

1. ✅ Deploy: `./deploy-to-vps.sh`
2. ✅ Configure DNS: Point app.eximpoglobal.net to 217.217.250.49
3. ✅ Setup Nginx: Follow NGINX_CONFIG.md
4. ✅ Install SSL: `certbot --nginx -d app.eximpoglobal.net`
5. ✅ Test: Open https://app.eximpoglobal.net
6. ✅ Demo: Use CLIENT_DEMO_GUIDE.md for client presentation

**Full documentation**: See PRODUCTION_DEPLOYMENT.md and NGINX_CONFIG.md
