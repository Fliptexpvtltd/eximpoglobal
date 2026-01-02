# Non-Docker Development Guide

## ✅ Benefits of Non-Docker Development

- **Faster startup** - No container overhead
- **Easier debugging** - Direct access to logs and debuggers
- **Hot reload works better** - Instant code updates
- **Lower resource usage** - No Docker daemon needed
- **Simpler setup** - Just Node.js and PostgreSQL

## 📋 Prerequisites

### 1. Install Required Software:
- **Node.js** v18+ (https://nodejs.org/)
- **PostgreSQL** v14+ (https://www.postgresql.org/download/)
- **Redis** (Optional - for email queue) (https://redis.io/download/)

### 2. Setup PostgreSQL Database:

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database and user
CREATE DATABASE eximpo;
CREATE USER eximpo_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE eximpo TO eximpo_user;
```

### 3. Configure Environment Files:

**backend/.env:**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/eximpo
NODE_ENV=development
PORT=5000
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d
BREVO_API_KEY=your_brevo_key
EMAIL_FROM=noreply@eximpoglobal.net
EMAIL_FROM_NAME=Eximpo Global
FRONTEND_URL=http://localhost:3000
REDIS_HOST=localhost
REDIS_PORT=6379
CORS_ORIGIN=http://localhost:3000
```

**frontend/.env:** (Already configured with relative paths)
```env
VITE_API_TIMEOUT=30000
```

**admin/.env:** (Already configured with relative paths)
```env
VITE_API_TIMEOUT=30000
```

## 🚀 Quick Start

### Option 1: Using Start Script (Recommended)
```bash
.\start-no-docker.bat
```

This will:
- Install dependencies (if needed)
- Start Backend on http://localhost:5000
- Start Frontend on http://localhost:3000
- Start Admin on http://localhost:3001

### Option 2: Manual Start (Terminal for Each)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Terminal 3 - Admin:**
```bash
cd admin
npm install
npm run dev
```

## 🛑 Stop Services

### Option 1: Using Stop Script
```bash
.\stop-no-docker.bat
```

### Option 2: Manual Stop
Press `Ctrl+C` in each terminal window

## 🔧 Development Workflow

### Making Changes:

1. **Backend changes**: Auto-reload with nodemon
2. **Frontend changes**: Hot Module Replacement (HMR) with Vite
3. **Admin changes**: Hot Module Replacement (HMR) with Vite

### Database Changes:

```bash
cd backend
npm run db:migrate
```

### Check Logs:

All logs appear directly in the terminal windows - no need for `docker logs`!

## 🐛 Troubleshooting

### Backend won't start?
✅ Check PostgreSQL is running: `psql -U postgres -l`
✅ Check port 5000 is free: `netstat -ano | findstr :5000`
✅ Verify DATABASE_URL in `backend/.env`

### Frontend can't connect to Backend?
✅ Backend must be running on http://localhost:5000
✅ Check CORS settings in `backend/.env`
✅ Verify API calls use `/api` (relative paths)

### Admin panel not loading?
✅ Check port 3001 is free
✅ Verify `admin/.env` exists
✅ Check if `npm install` completed successfully

### Redis connection errors?
✅ Redis is optional for development
✅ Emails will be queued but need Redis to process
✅ Install Redis or emails won't send

## 🆚 Docker vs Non-Docker

| Feature | Non-Docker | Docker |
|---------|-----------|--------|
| Startup Speed | ⚡ Fast (5s) | 🐢 Slow (30s) |
| Resource Usage | 🟢 Low | 🔴 High |
| Debugging | ✅ Easy | ⚠️ Complex |
| Hot Reload | ✅ Instant | ⚠️ Slower |
| Setup | 🔧 Manual | 📦 Automated |
| Production-like | ❌ No | ✅ Yes |

## 🎯 Recommendations

### Use Non-Docker for:
- ✅ Daily development
- ✅ Frontend work
- ✅ API testing
- ✅ Quick iterations
- ✅ Learning the codebase

### Use Docker for:
- ✅ Production deployment
- ✅ Testing deployment
- ✅ Team onboarding (consistent env)
- ✅ CI/CD pipelines

## 📦 When Ready to Deploy

### Switch to Docker:
```bash
# Stop non-Docker services
.\stop-no-docker.bat

# Start with Docker for production testing
docker-compose -f docker-compose.production.yml up -d --build
```

### Production Checklist:
- [ ] Update `backend/.env.production` with real credentials
- [ ] Change JWT_SECRET to strong random string
- [ ] Update database password
- [ ] Configure production domain
- [ ] Test with Docker Compose before deploying

## 🔄 Switching Between Modes

### From Docker to Non-Docker:
```bash
docker-compose down
.\start-no-docker.bat
```

### From Non-Docker to Docker:
```bash
.\stop-no-docker.bat
docker-compose -f docker-compose.local.yml up -d
```

## 💡 Pro Tips

1. **Use VS Code integrated terminal** - Split terminal for all 3 services
2. **Install PostgreSQL GUI** - pgAdmin or DBeaver for database management
3. **Use Postman/Thunder Client** - Test APIs without frontend
4. **Enable logging** - Set `DEBUG=*` for verbose logs
5. **Git hooks** - Auto-format code before commit

## 🌐 URLs Reference

| Service | URL | Description |
|---------|-----|-------------|
| Backend API | http://localhost:5000 | REST API endpoints |
| Frontend | http://localhost:3000 | Buyer/Seller app |
| Admin Panel | http://localhost:3001 | Admin dashboard |
| API Docs | http://localhost:5000/api | API documentation |
| Health Check | http://localhost:5000/health | Backend health |

## 🔐 Security Notes

- Never commit `.env` files
- Use different credentials for production
- Keep dependencies updated: `npm outdated`
- Review security: `npm audit`
