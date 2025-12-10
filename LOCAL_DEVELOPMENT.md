# 🚀 Local Development Guide

Quick guide to start developing Eximpo locally with Docker.

## 📋 Prerequisites

- Docker Desktop installed and running
- Git (to clone repository)
- 8GB+ RAM recommended
- 10GB+ free disk space

## 🎯 Quick Start

### Windows
```powershell
.\start-dev.bat
```

### Linux/Mac
```bash
chmod +x start-dev.sh
./start-dev.sh
```

## 🛠️ Manual Setup

### 1. Start All Services
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 2. Start Minimal (No pgAdmin)
```bash
docker-compose -f docker-compose.dev.yml up -d frontend backend postgres
```

### 3. Start with Redis Cache
```bash
docker-compose -f docker-compose.dev.yml --profile cache up -d
```

## 🌐 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | - |
| **Backend API** | http://localhost:5000 | - |
| **pgAdmin** | http://localhost:5050 | admin@local.dev / admin |
| **PostgreSQL** | localhost:5432 | postgres / postgres / eximpo |
| **Redis** | localhost:6379 | (no password in dev) |

## 📁 Project Structure

```
eximpo/
├── src/                    # Frontend source
│   ├── components/        # React components
│   ├── services/          # API services
│   ├── config/            # Configuration
│   └── hooks/             # Custom hooks
├── backend/               # Backend API (create this)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   ├── Dockerfile.dev
│   └── package.json
├── docker-compose.dev.yml # Local development compose
└── .env                   # Local environment variables
```

## 🔧 Development Workflow

### 1. First Time Setup

```bash
# Clone repository
git clone https://github.com/yourusername/eximpo.git
cd eximpo

# Start services
.\start-dev.bat    # Windows
./start-dev.sh     # Linux/Mac

# Install dependencies (if not using Docker)
npm install
```

### 2. Daily Development

```bash
# Start services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop when done
docker-compose -f docker-compose.dev.yml down
```

### 3. Hot Reload

Both frontend and backend have hot reload enabled:
- **Frontend**: Changes in `src/` reload automatically
- **Backend**: Changes in `backend/src/` reload automatically (using nodemon)

## 📦 Working with Database

### Connect to Database

Using pgAdmin:
1. Go to http://localhost:5050
2. Login with: admin@local.dev / admin
3. Add server:
   - Name: Local
   - Host: postgres
   - Port: 5432
   - Database: eximpo
   - Username: postgres
   - Password: postgres

Using CLI:
```bash
docker exec -it eximpo-postgres-1 psql -U postgres -d eximpo
```

### Run Migrations

```bash
# Execute SQL file
docker exec -i eximpo-postgres-1 psql -U postgres -d eximpo < ./backend/migrations/001_initial.sql

# Or connect and run manually
docker exec -it eximpo-postgres-1 psql -U postgres -d eximpo
```

### Backup Database

```bash
docker exec eximpo-postgres-1 pg_dump -U postgres eximpo > backup.sql
```

### Restore Database

```bash
docker exec -i eximpo-postgres-1 psql -U postgres eximpo < backup.sql
```

## 🐛 Debugging

### View Container Logs

```bash
# All containers
docker-compose -f docker-compose.dev.yml logs -f

# Specific container
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f postgres
```

### Access Container Shell

```bash
# Frontend
docker exec -it eximpo-frontend-1 sh

# Backend
docker exec -it eximpo-backend-1 sh

# Database
docker exec -it eximpo-postgres-1 sh
```

### Check Container Status

```bash
docker-compose -f docker-compose.dev.yml ps
```

### Restart Services

```bash
# All services
docker-compose -f docker-compose.dev.yml restart

# Specific service
docker-compose -f docker-compose.dev.yml restart backend
```

## 🔄 Common Tasks

### Install New Package

**Frontend:**
```bash
# Stop frontend
docker-compose -f docker-compose.dev.yml stop frontend

# Install package
npm install package-name

# Restart frontend
docker-compose -f docker-compose.dev.yml up -d frontend
```

**Backend:**
```bash
# Access backend container
docker exec -it eximpo-backend-1 npm install package-name

# Or rebuild
docker-compose -f docker-compose.dev.yml up -d --build backend
```

### Reset Database

```bash
# Stop all services
docker-compose -f docker-compose.dev.yml down

# Remove volumes
docker-compose -f docker-compose.dev.yml down -v

# Start fresh
docker-compose -f docker-compose.dev.yml up -d
```

### Clean Everything

```bash
# Stop and remove all containers, volumes, and images
docker-compose -f docker-compose.dev.yml down -v --rmi all

# Remove unused Docker resources
docker system prune -a --volumes
```

## 🧪 Testing

### Run Frontend Tests

```bash
npm test
```

### Run Backend Tests

```bash
docker exec -it eximpo-backend-1 npm test
```

### API Testing

Use tools like:
- **Postman**: Import API collection
- **curl**: Test endpoints directly
- **Thunder Client** (VS Code extension)

Example:
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test API endpoint
curl http://localhost:5000/api/products
```

## 📊 Monitoring

### Resource Usage

```bash
# See resource usage of containers
docker stats

# Check disk usage
docker system df
```

### Database Performance

```sql
-- Connect to database
docker exec -it eximpo-postgres-1 psql -U postgres -d eximpo

-- Check active connections
SELECT * FROM pg_stat_activity;

-- Check database size
SELECT pg_size_pretty(pg_database_size('eximpo'));

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 🔐 Environment Variables

### Default Local Values (.env)

```env
# API
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000

# Database
DB_NAME=eximpo
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

### Override for Testing

Create `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
# Add test-specific overrides
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows - Find process
netstat -ano | findstr :3000

# Kill process
taskkill /PID <pid> /F

# Linux/Mac - Find process
lsof -i :3000

# Kill process
kill -9 <pid>
```

### Container Won't Start

```bash
# Check logs
docker-compose -f docker-compose.dev.yml logs backend

# Rebuild from scratch
docker-compose -f docker-compose.dev.yml build --no-cache backend
docker-compose -f docker-compose.dev.yml up -d backend
```

### Database Connection Failed

1. Check if postgres is running:
   ```bash
   docker-compose -f docker-compose.dev.yml ps postgres
   ```

2. Check postgres logs:
   ```bash
   docker-compose -f docker-compose.dev.yml logs postgres
   ```

3. Verify credentials in `.env`

4. Restart postgres:
   ```bash
   docker-compose -f docker-compose.dev.yml restart postgres
   ```

### Frontend Not Hot Reloading

1. Check if files are properly mounted:
   ```bash
   docker-compose -f docker-compose.dev.yml config
   ```

2. Restart frontend:
   ```bash
   docker-compose -f docker-compose.dev.yml restart frontend
   ```

### Out of Memory

```bash
# Check Docker Desktop settings
# Increase memory allocation to at least 4GB

# Or reduce running containers
docker-compose -f docker-compose.dev.yml up -d frontend backend postgres
```

## 📝 Best Practices

1. **Always use volume mounts** for development (already configured)
2. **Keep .env file local** (never commit)
3. **Use meaningful commit messages**
4. **Test before pushing** to repository
5. **Stop services when not using** (saves resources)
6. **Regular cleanup** of Docker resources
7. **Backup database** before major changes

## 🚀 Next Steps

1. **Create Backend API** (Node.js/Express)
2. **Set up database schema** (PostgreSQL)
3. **Integrate frontend with API**
4. **Add authentication** (JWT)
5. **Test all features** locally
6. **Prepare for production** deployment

## 📚 Additional Resources

- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Vite Docs](https://vitejs.dev/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [React Docs](https://react.dev/)

## 💡 Tips

- Use VS Code Docker extension for easier management
- Set up Docker debugging in your IDE
- Use pgAdmin for visual database management
- Keep containers running during active development
- Use `docker-compose logs -f` to monitor real-time logs

## 🆘 Getting Help

If you encounter issues:
1. Check logs: `docker-compose -f docker-compose.dev.yml logs`
2. Verify all containers are running: `docker-compose -f docker-compose.dev.yml ps`
3. Check .env configuration
4. Restart services: `docker-compose -f docker-compose.dev.yml restart`
5. Clean rebuild: `docker-compose -f docker-compose.dev.yml up -d --build`

Happy coding! 🎉
