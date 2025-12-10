# Eximpo Admin Portal

Complete standalone admin application for managing the Eximpo platform.

## Features

- ✨ **Beautiful UI** - Modern gradient design with purple/blue theme
- 🔐 **Secure Authentication** - JWT-based admin login
- 📊 **Dashboard** - Platform statistics and insights
- 👥 **User Management** - Approve and manage users
- 📦 **Product Moderation** - Review and approve products
- 📋 **RFQ Management** - Monitor RFQ activities
- 🛍️ **Order Tracking** - View all platform orders
- 📈 **Analytics** - Platform metrics and trends
- ⚙️ **Settings** - Configure platform settings
- 📱 **Responsive** - Collapsible sidebar for mobile

## Quick Start

### Using Docker (Recommended)

```powershell
# Start admin panel (from project root)
./start-admin-panel.bat

# Or manually
docker-compose -f docker-compose.admin.yml up -d --build
```

### Local Development

```powershell
cd admin
npm install
npm run dev
```

## Access

- **Admin Portal**: http://localhost:3001
- **Backend API**: http://localhost:5000

## Default Credentials

```
Email:    admin@eximpo.com
Password: admin123
```

## Project Structure

```
admin/
├── src/
│   ├── components/
│   │   ├── AdminDashboard.tsx    # Main dashboard
│   │   ├── AdminLayout.tsx       # Layout with sidebar
│   │   ├── AdminLogin.tsx        # Login page
│   │   └── ui/                   # Shadcn UI components
│   ├── contexts/
│   │   └── AuthContext.tsx       # Auth state management
│   ├── styles/
│   │   └── globals.css           # Tailwind + theme
│   ├── App.tsx                   # Root component
│   └── main.tsx                  # Entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
└── Dockerfile.dev
```

## Navigation Menu

- **Dashboard** - Platform overview with statistics
- **Users** - User management and approval
- **Products** - Product moderation
- **RFQs** - RFQ monitoring
- **Orders** - Order tracking
- **Analytics** - Platform analytics
- **Settings** - Configuration

## Technologies

- React 18.3.1
- TypeScript 5.6.2
- Vite 6.0.1
- Tailwind CSS 4.0.0
- Lucide React (icons)
- Shadcn UI components

## API Integration

All API calls go to `http://localhost:5000/api`:

- `POST /auth/login` - Admin login
- `GET /admin/stats` - Platform statistics
- `GET /admin/users` - User list
- `GET /admin/products` - Product list
- `PATCH /admin/users/:id/verify` - Verify user
- `PATCH /admin/products/:id/approve` - Approve product

## Security

- JWT token authentication
- Admin role verification
- Secure localStorage token storage
- Protected routes
- API request validation

## Development

```powershell
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Docker Commands

```powershell
# Start admin container
docker-compose -f docker-compose.admin.yml up -d

# Rebuild after changes
docker-compose -f docker-compose.admin.yml up -d --build

# View logs
docker-compose -f docker-compose.admin.yml logs -f

# Stop container
docker-compose -f docker-compose.admin.yml down

# Restart container
docker-compose -f docker-compose.admin.yml restart
```

## Troubleshooting

### Port 3001 already in use
```powershell
# Kill process on port 3001
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
```

### Backend not responding
```powershell
# Check backend status
docker-compose -f docker-compose.local.yml ps

# Restart backend
docker-compose -f docker-compose.local.yml restart backend
```

### Login fails
```powershell
# Check admin user exists
docker exec -it eximpo-postgres psql -U postgres -d eximpo -c "SELECT * FROM users WHERE role = 'admin';"

# Recreate admin user
docker exec -it eximpo-backend node create-admin.js
```

## License

Proprietary - Eximpo Platform
