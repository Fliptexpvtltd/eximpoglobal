# Environment Variables Configuration Guide

## Overview
This project uses separate `.env` files for different parts of the application. **Never commit `.env` files to Git!**

## File Structure

```
eximpo/
├── .env                          # Docker Compose only (DB credentials)
├── .env.production               # Production Docker Compose
├── backend/
│   ├── .env                      # Backend development
│   └── .env.production           # Backend production
├── frontend/
│   └── .env                      # Frontend (if needed)
└── admin/
    └── .env                      # Admin panel (if needed)
```

## 📋 Environment Files Explained

### 1. Root `.env` (Docker Compose only)
Used by `docker-compose.yml` for database configuration.
```env
DB_NAME=eximpo
DB_USER=postgres
DB_PASSWORD=postgres
```

### 2. Root `.env.production` (Production Docker Compose)
Used by `docker-compose.production.yml`
```env
DB_NAME=eximpo
DB_USER=postgres
DB_PASSWORD=YOUR_SECURE_PASSWORD
```

### 3. `backend/.env` (Backend Development)
All backend-specific variables:
- Database connection
- JWT secrets
- Email API keys
- Redis configuration
- CORS settings

### 4. `backend/.env.production` (Backend Production)
Production backend configuration with:
- Production database URL
- Strong JWT secret
- Production CORS origin
- Production frontend URL

### 5. `frontend/.env` & `admin/.env`
Minimal config - uses relative paths `/api` for all environments

## 🚀 Setup Instructions

### For Localhost Development:

1. **Backend:**
   ```bash
   cd backend
   # Copy and edit .env file
   cp .env.example .env
   # Update DB_PASSWORD if needed
   ```

2. **Frontend & Admin:**
   Already configured with relative paths - no changes needed!

3. **Start services:**
   ```bash
   .\start-localhost.bat
   ```

### For Production Deployment:

1. **On production server**, create `backend/.env.production`:
   ```env
   DATABASE_URL=postgresql://postgres:SECURE_PASSWORD@postgres:5432/eximpo
   JWT_SECRET=CHANGE_TO_RANDOM_64_CHAR_STRING
   FRONTEND_URL=https://yourdomain.com
   CORS_ORIGIN=https://yourdomain.com
   ```

2. **Update root `.env.production`** with database password

3. **Deploy:**
   ```bash
   docker-compose -f docker-compose.production.yml up -d --build
   ```

## ✅ Why This Works on Both Localhost and Production

### Frontend & Admin:
- Use relative API paths: `/api/auth/login`
- Nginx proxies `/api` → `backend:5000`
- No hardcoded URLs = works everywhere!

### Backend:
- Loads correct `.env` file based on NODE_ENV
- Uses FRONTEND_URL for email links
- Uses CORS_ORIGIN for security

## 🔒 Security Best Practices

1. **Never commit** `.env` files to Git
2. **Use strong passwords** in production
3. **Generate random JWT secret**: 
   ```bash
   openssl rand -hex 32
   ```
4. **Change default credentials** before deploying
5. **Use environment variables** in CI/CD pipelines

## 🐛 Troubleshooting

### API not working in production?
✅ Check: Nginx is proxying `/api` to backend
✅ Check: CORS_ORIGIN matches your domain
✅ Check: Database connection string is correct

### Emails not sending?
✅ Check: BREVO_API_KEY is set in `backend/.env`
✅ Check: Redis is running for email queue
✅ Check: FRONTEND_URL is correct for email links

### Frontend can't connect to backend?
✅ Don't use full URLs - use `/api` paths
✅ Check: Nginx configuration is correct
✅ Check: All services are running

## 📝 Environment Variables Reference

### Backend Variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - development | production
- `PORT` - Backend port (default: 5000)
- `JWT_SECRET` - Secret for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration (e.g., 7d)
- `BREVO_API_KEY` - Email service API key
- `EMAIL_FROM` - Sender email address
- `FRONTEND_URL` - Frontend URL for emails
- `CORS_ORIGIN` - Allowed CORS origin
- `REDIS_HOST` - Redis host for queues
- `REDIS_PORT` - Redis port

### Frontend/Admin Variables:
- `VITE_API_TIMEOUT` - API request timeout

**Note:** Frontend and Admin no longer use `VITE_API_BASE_URL` - they use relative paths!

## 🎯 Quick Commands

```bash
# Localhost
.\start-localhost.bat

# Production
docker-compose -f docker-compose.production.yml up -d --build

# Check logs
docker-compose logs -f backend

# Restart services
docker-compose restart
```
