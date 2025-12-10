# 🐳 Docker Deployment Guide

This guide will help you containerize and deploy the Eximpo platform using Docker.

## 📋 Prerequisites

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)
- DigitalOcean PostgreSQL database (or use local PostgreSQL)

## 🚀 Quick Start

### Windows
```powershell
.\docker-setup.bat
```

### Linux/Mac
```bash
chmod +x docker-setup.sh
./docker-setup.sh
```

## 📁 Docker Files Overview

- **Dockerfile** - Production build (multi-stage)
- **Dockerfile.dev** - Development build with hot reload
- **docker-compose.yml** - Full stack with local PostgreSQL
- **docker-compose.prod.yml** - Production with DigitalOcean DB
- **nginx.conf** - Nginx configuration for frontend
- **.dockerignore** - Files to exclude from Docker build

## 🛠️ Manual Setup

### 1. Environment Configuration

Update `.env` file with your credentials:

```env
# DigitalOcean PostgreSQL
DATABASE_URL=postgresql://user:password@host:25060/dbname?sslmode=require
DB_HOST=your-db.db.ondigitalocean.com
DB_PORT=25060
DB_NAME=eximpo
DB_USER=doadmin
DB_PASSWORD=your-password

# JWT Secret
JWT_SECRET=your-super-secret-key-change-this-in-production

# API URL
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. Development Mode

Run with hot reload and local database:

```bash
docker-compose up --build
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- pgAdmin: http://localhost:5050

### 3. Production Mode (Local DB)

```bash
docker-compose -f docker-compose.yml up --build -d
```

### 4. Production Mode (DigitalOcean DB)

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

Access:
- Frontend: http://localhost
- Backend: http://localhost:5000

## 📦 Individual Container Management

### Build Frontend Only
```bash
docker build -t eximpo-frontend .
docker run -p 3000:80 eximpo-frontend
```

### Build Backend Only
```bash
cd backend
docker build -t eximpo-backend .
docker run -p 5000:5000 --env-file ../.env eximpo-backend
```

## 🔍 Useful Docker Commands

### View Running Containers
```bash
docker ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Stop Containers
```bash
docker-compose down
```

### Stop and Remove Volumes
```bash
docker-compose down -v
```

### Rebuild Without Cache
```bash
docker-compose build --no-cache
```

### Access Container Shell
```bash
docker-compose exec frontend sh
docker-compose exec backend sh
docker-compose exec postgres psql -U postgres
```

## 🌐 DigitalOcean Deployment

### Option 1: Docker Droplet

1. **Create a Droplet** with Docker pre-installed
2. **Clone your repository**:
   ```bash
   git clone https://github.com/yourusername/eximpo.git
   cd eximpo
   ```

3. **Set environment variables**:
   ```bash
   nano .env.production
   ```

4. **Run containers**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

5. **Setup reverse proxy** (optional - for HTTPS):
   ```bash
   # Install Caddy or Nginx
   sudo apt install caddy
   ```

### Option 2: DigitalOcean App Platform

1. **Connect repository** to App Platform
2. **Configure build**:
   - Build command: `docker build -t eximpo .`
   - Run command: `nginx -g daemon off;`

3. **Add environment variables** in App Platform dashboard

4. **Connect to managed PostgreSQL database**

### Option 3: Kubernetes (Advanced)

Create Kubernetes manifests and deploy to DigitalOcean Kubernetes:
```bash
kubectl apply -f k8s/
```

## 🔐 Security Best Practices

1. **Use secrets** for sensitive data:
   ```bash
   docker secret create jwt_secret ./jwt_secret.txt
   ```

2. **Don't commit .env** files to git

3. **Use SSL/TLS** in production

4. **Restrict database access** to your droplet IP

5. **Regular updates**:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

## 📊 Health Checks

Backend health endpoint:
```bash
curl http://localhost:5000/health
```

Frontend health endpoint:
```bash
curl http://localhost:3000/health
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :3000
# Kill process (Windows)
taskkill /PID <pid> /F
```

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Rebuild
docker-compose build --no-cache backend
```

### Database Connection Issues
- Verify `DATABASE_URL` in `.env`
- Check DigitalOcean firewall settings
- Ensure SSL mode is set correctly

### Permission Denied
```bash
# Linux/Mac
sudo chown -R $USER:$USER .
```

## 📈 Performance Optimization

### Production Build Optimization
- Multi-stage builds (already configured)
- Nginx gzip compression (already configured)
- Static asset caching (already configured)

### Database Optimization
- Connection pooling in backend
- Indexes on frequently queried columns
- Regular VACUUM and ANALYZE

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and push Docker image
        run: |
          docker build -t registry.digitalocean.com/eximpo/frontend .
          docker push registry.digitalocean.com/eximpo/frontend
```

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for JWT tokens | `your-secret-key` |
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000/api` |
| `NODE_ENV` | Environment mode | `production` or `development` |

## 🎯 Next Steps

1. Set up backend API (Node.js/Express)
2. Configure DigitalOcean managed database
3. Set up domain and SSL certificate
4. Configure monitoring and logging
5. Set up automated backups

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)

## 💡 Tips

- Use `docker-compose logs -f` to monitor real-time logs
- Keep your Docker images small by using Alpine variants
- Use `.dockerignore` to exclude unnecessary files
- Regularly prune unused containers and images: `docker system prune`
- Set up health checks for all services

## 🆘 Support

If you encounter issues:
1. Check container logs: `docker-compose logs`
2. Verify environment variables
3. Ensure ports are not in use
4. Check Docker daemon is running
