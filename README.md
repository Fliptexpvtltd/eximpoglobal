# Eximpo - Global Trade Platform

Complete e-commerce trade platform connecting buyers and suppliers worldwide with RFQ management, product catalog, and shipment tracking.

## 📁 Project Structure

```
eximpo/
├── frontend/              # React buyer/seller application (Port 3000)
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # Auth & state management
│   │   └── styles/       # Tailwind CSS
│   ├── package.json
│   └── vite.config.ts
│
├── admin/                # React admin dashboard (Port 3001)
│   ├── src/
│   │   ├── components/   # Admin UI components
│   │   ├── contexts/     # Admin auth
│   │   └── styles/       # Admin styling
│   ├── package.json
│   └── vite.config.ts
│
├── backend/              # Node.js + Express API (Port 5000)
│   ├── src/
│   │   ├── controllers/  # API logic
│   │   ├── middleware/   # Auth & validation
│   │   ├── routes/       # API routes
│   │   └── config/       # Database config
│   ├── init.sql         # Database schema
│   └── package.json
│
├── docker-compose.local.yml   # Main app services
├── docker-compose.admin.yml   # Admin app service
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- Git

### Start All Services

```powershell
# Start main application (Frontend + Backend + Database)
.\start-local.bat

# Start admin panel (separate container)
.\start-admin-panel.bat
```

### Access Points

- **Main App** (Buyers/Sellers): http://localhost:3000
- **Admin Portal**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

## 🔑 Default Credentials

### Admin Account
- **Email**: admin@eximpo.com
- **Password**: admin123

## 📦 Modules

### 1. Frontend (Buyer/Seller App)
**Location**: `frontend/`  
**Port**: 3000  
**Technology**: React 18 + Vite + Tailwind CSS

**Features**:
- Product catalog browsing
- RFQ (Request for Quote) creation
- Quote comparison
- Purchase order management
- Shipment tracking
- Buyer/Seller dashboards
- Authentication & role selection

### 2. Admin Portal
**Location**: `admin/`  
**Port**: 3001  
**Technology**: React 18 + Vite + Tailwind CSS

**Features**:
- Platform statistics dashboard
- User management & approval
- Product moderation
- RFQ monitoring
- Order tracking
- Analytics
- Left sidebar navigation

### 3. Backend API
**Location**: `backend/`  
**Port**: 5000  
**Technology**: Node.js 20 + Express + PostgreSQL

**Features**:
- RESTful API
- JWT authentication
- Role-based access control
- User management
- Product CRUD
- RFQ management
- Order processing
- Admin endpoints

## 🛠️ Development

### Frontend Development
```powershell
cd frontend
npm install
npm run dev
```

### Admin Development
```powershell
cd admin
npm install
npm run dev
```

### Backend Development
```powershell
cd backend
npm install
npm run dev
```

## 🐳 Docker Commands

### Main Application
```powershell
# Start all services
docker-compose -f docker-compose.local.yml up -d

# Stop all services
docker-compose -f docker-compose.local.yml down

# View logs
docker-compose -f docker-compose.local.yml logs -f

# Rebuild
docker-compose -f docker-compose.local.yml up -d --build
```

### Admin Panel
```powershell
# Start admin
docker-compose -f docker-compose.admin.yml up -d

# Stop admin
docker-compose -f docker-compose.admin.yml down

# View logs
docker-compose -f docker-compose.admin.yml logs -f
```

## 📊 Database

**PostgreSQL 16 Alpine**  
**Port**: 5432  
**Database**: eximpo  
**User**: postgres  
**Password**: postgres

### Tables
- users
- products
- rfqs
- quotes
- orders
- shipments
- supplier_profiles
- analytics_events

### Schema
Located in `backend/init.sql` - automatically initialized on first run.

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product (seller)
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### RFQs
- `GET /api/rfqs` - List RFQs
- `POST /api/rfqs` - Create RFQ (buyer)
- `GET /api/rfqs/:id` - Get RFQ details
- `POST /api/rfqs/:id/quotes` - Submit quote (seller)

### Admin (Protected)
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id/verify` - Verify user
- `GET /api/admin/products` - List all products
- `PATCH /api/admin/products/:id/approve` - Approve product

## 🎨 Tech Stack

### Frontend & Admin
- React 18.3.1
- TypeScript 5.6.2
- Vite 6.0.1
- Tailwind CSS 3.4.17
- Lucide React (icons)
- Shadcn UI components

### Backend
- Node.js 20
- Express 4.18.2
- PostgreSQL 16
- JWT (jsonwebtoken)
- bcryptjs
- Joi validation

### DevOps
- Docker & Docker Compose
- Multi-stage builds
- Volume mounts for hot reload
- Health checks

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=eximpo
JWT_SECRET=your-secret-key-change-in-production
```

## 🚦 Services Status

Check running containers:
```powershell
docker ps --filter "name=eximpo"
```

Expected output:
```
eximpo-frontend       Up      0.0.0.0:3000->3000/tcp
eximpo-admin-frontend Up      0.0.0.0:3001->3000/tcp
eximpo-backend        Up      0.0.0.0:5000->5000/tcp
eximpo-postgres       Up      0.0.0.0:5432->5432/tcp
```

## 🔧 Troubleshooting

### Port Already in Use
```powershell
# Kill process on specific port (e.g., 3000)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

### Reset Database
```powershell
docker-compose -f docker-compose.local.yml down -v
docker-compose -f docker-compose.local.yml up -d
```

### View Container Logs
```powershell
docker logs eximpo-frontend -f
docker logs eximpo-backend -f
docker logs eximpo-postgres -f
```

## 📚 Documentation

- Frontend README: `frontend/README.md`
- Admin README: `admin/README.md`
- Backend API: See API endpoints section above

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test locally with Docker
4. Submit pull request

## 📄 License

Proprietary - Eximpo Platform

---

**Built with ❤️ for global trade**
