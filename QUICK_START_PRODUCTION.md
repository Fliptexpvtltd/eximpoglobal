# 🚀 Quick Deployment Guide - app.eximpoglobal.net

## 📋 One-Command Deployment

### On Your Server:
```bash
# 1. Clone repository
cd /opt && git clone YOUR_REPO_URL eximpo && cd eximpo

# 2. Configure environment
cp .env.production.example .env.production
nano .env.production  # Edit DB_PASSWORD and JWT_SECRET

# 3. Deploy
chmod +x deploy-production.sh && ./deploy-production.sh
```

## 🔑 Quick Access

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | https://app.eximpoglobal.net | buyer@eximpo.net / Test@123 |
| **Admin** | https://app.eximpoglobal.net:3001 | admin@eximpo.net / Admin@123 |
| **API** | https://app.eximpoglobal.net/api | - |

## ⚡ Quick Commands

```bash
# View logs
docker-compose -f docker-compose.production.yml logs -f

# Restart
docker-compose -f docker-compose.production.yml restart

# Stop
docker-compose -f docker-compose.production.yml down

# Update
git pull && docker-compose -f docker-compose.production.yml up -d --build
```

## 🛠️ Files Created

1. ✅ `docker-compose.production.yml` - Production Docker setup
2. ✅ `.env.production.example` - Environment template
3. ✅ `deploy-production.sh` - Deployment script (Linux)
4. ✅ `deploy-production.bat` - Deployment script (Windows)
5. ✅ `PRODUCTION_DEPLOYMENT.md` - Full deployment guide
6. ✅ `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist
7. ✅ `CLIENT_DEMO_GUIDE.md` - Client presentation guide

## 📱 What's Included

- ✅ Web Frontend (React + Vite)
- ✅ Mobile App (React Native - Android)
- ✅ Backend API (Node.js + Express)
- ✅ PostgreSQL Database
- ✅ Admin Panel
- ✅ Sample Data & Test Users
- ✅ SSL/HTTPS Ready
- ✅ Production Optimized

## 🎯 Next Steps

1. **Deploy to server** using deploy-production.sh
2. **Configure DNS** to point to your server
3. **Setup SSL** with Let's Encrypt
4. **Test all features** with provided credentials
5. **Present to client** at app.eximpoglobal.net

---

**Need Help?** See PRODUCTION_DEPLOYMENT.md for detailed instructions
