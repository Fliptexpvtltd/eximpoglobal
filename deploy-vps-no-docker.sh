#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Eximpo VPS Non-Docker Deployment${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Configuration
DEPLOY_DIR="/var/www/app"
RELEASE_NAME="$(date +%Y-%m-%d-%H%M%S)"
RELEASE_DIR="$DEPLOY_DIR/releases/$RELEASE_NAME"
GITHUB_REPO="https://github.com/Fliptexpvtltd/eximpoglobal.git"
APP_USER="root"  # Current setup uses root

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Install Node.js if not installed
echo -e "${YELLOW}Step 1: Checking Node.js installation...${NC}"
if ! command_exists node; then
    echo -e "${BLUE}Installing Node.js 20...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    apt-get install -y nodejs
else
    echo -e "${GREEN}✓ Node.js already installed: $(node --version)${NC}"
fi

# Step 2: Install PostgreSQL if not installed
echo -e "${YELLOW}Step 2: Checking PostgreSQL installation...${NC}"
if ! command_exists psql; then
    echo -e "${BLUE}Installing PostgreSQL...${NC}"
    apt-get update
    apt-get install -y postgresql postgresql-contrib
    systemctl start postgresql
    systemctl enable postgresql
else
    echo -e "${GREEN}✓ PostgreSQL already installed${NC}"
fi

# Step 3: Install Redis
echo -e "${YELLOW}Step 3: Checking Redis installation...${NC}"
if ! command_exists redis-cli; then
    echo -e "${BLUE}Installing Redis...${NC}"
    apt-get install -y redis-server
    systemctl start redis-server
    systemctl enable redis-server
else
    echo -e "${GREEN}✓ Redis already installed${NC}"
fi

# Step 4: Install PM2 (Process Manager)
echo -e "${YELLOW}Step 4: Checking PM2 installation...${NC}"
if ! command_exists pm2; then
    echo -e "${BLUE}Installing PM2...${NC}"
    npm install -g pm2
else
    echo -e "${GREEN}✓ PM2 already installed${NC}"
fi

# Step 5: Install Nginx if not installed
echo -e "${YELLOW}Step 5: Checking Nginx installation...${NC}"
if ! command_exists nginx; then
    echo -e "${BLUE}Installing Nginx...${NC}"
    apt-get install -y nginx
    systemctl start nginx
    systemctl enable nginx
else
    echo -e "${GREEN}✓ Nginx already installed${NC}"
fi

# Step 6: Create deployment directories
echo -e "${YELLOW}Step 6: Creating deployment directories...${NC}"
mkdir -p $DEPLOY_DIR/releases
mkdir -p $DEPLOY_DIR/shared
echo -e "${GREEN}✓ Directories created${NC}"

# Step 7: Setup database
echo -e "${YELLOW}Step 7: Setting up database...${NC}"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'eximpo'" | grep -q 1 || \
sudo -u postgres psql <<EOF
CREATE DATABASE eximpo;
CREATE USER eximpo_user WITH PASSWORD 'Eximpo2024@SecureDB!9x7z';
GRANT ALL PRIVILEGES ON DATABASE eximpo TO eximpo_user;
ALTER DATABASE eximpo OWNER TO eximpo_user;
EOF
echo -e "${GREEN}✓ Database configured${NC}"

# Step 8: Clone/Update repository
echo -e "${YELLOW}Step 8: Deploying application code...${NC}"
echo -e "${BLUE}Creating new release: $RELEASE_NAME${NC}"

# Use SSH instead of HTTPS for private repo
git clone git@github.com:Fliptexpvtltd/eximpoglobal.git $RELEASE_DIR 2>&1 || \
git clone https://github.com/Fliptexpvtltd/eximpoglobal.git $RELEASE_DIR

if [ ! -d "$RELEASE_DIR" ]; then
    echo -e "${RED}Failed to clone repository!${NC}"
    echo -e "${YELLOW}Please ensure:${NC}"
    echo -e "  1. GitHub SSH key is configured: ssh -T git@github.com"
    echo -e "  2. Or repository is public"
    exit 1
fi

cd $RELEASE_DIR

# Create symlink to new release
rm -f $DEPLOY_DIR/current
ln -sf $RELEASE_DIR $DEPLOY_DIR/current
echo -e "${GREEN}✓ Code deployed to $RELEASE_DIR${NC}"

# Step 9: Install dependencies
echo -e "${YELLOW}Step 9: Installing dependencies...${NC}"

echo -e "${BLUE}Installing backend dependencies...${NC}"
cd $RELEASE_DIR/backend
npm install --production

echo -e "${BLUE}Installing frontend dependencies...${NC}"
cd $RELEASE_DIR/frontend
npm install

echo -e "${BLUE}Installing admin dependencies...${NC}"
cd $RELEASE_DIR/admin
npm install

# Step 10: Setup environment files
echo -e "${YELLOW}Step 10: Creating environment files...${NC}"

# Backend .env
cat > $RELEASE_DIR/backend/.env << 'EOF'
DATABASE_URL=postgresql://eximpo_user:Eximpo2024@SecureDB!9x7z@localhost:5432/eximpo
NODE_ENV=production
PORT=5000
JWT_SECRET=eximpo-production-jwt-secret-key-2024-very-secure
JWT_EXPIRES_IN=7d
BREVO_API_KEY=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
EMAIL_FROM=noreply@eximpoglobal.net
EMAIL_FROM_NAME=Eximpo Global
FRONTEND_URL=https://app.eximpoglobal.net
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_ENABLED=true
CORS_ORIGIN=https://app.eximpoglobal.net,https://admin.eximpoglobal.net
CONTABO_S3_ACCESS_KEY=ee50cd914b1f62bf42bc6bdec93fed4c
CONTABO_S3_SECRET_KEY=2f5e8b4c9a1d6e3f7b0c8a5d2e9f4b1c
CONTABO_S3_ENDPOINT=https://eu2.contabostorage.com
CONTABO_S3_REGION=eu-central-1
CONTABO_S3_BUCKET=eximpo-storage
EOF

echo -e "${GREEN}✓ Environment files created${NC}"

# Step 11: Initialize database schema
echo -e "${YELLOW}Step 11: Initializing database...${NC}"
cd $RELEASE_DIR/backend
sudo -u postgres psql -d eximpo -f init.sql 2>/dev/null || echo "Schema already exists"
echo -e "${GREEN}✓ Database initialized${NC}"

# Step 12: Build frontend and admin
echo -e "${YELLOW}Step 12: Building frontend applications...${NC}"

echo -e "${BLUE}Building frontend...${NC}"
cd $RELEASE_DIR/frontend
npm run build

echo -e "${BLUE}Building admin panel...${NC}"
cd $RELEASE_DIR/admin
npm run build

echo -e "${GREEN}✓ Builds completed${NC}"

# Step 13: Stop existing PM2 processes
echo -e "${YELLOW}Step 13: Stopping old processes...${NC}"
pm2 delete all 2>/dev/null || true

# Step 14: Start services with PM2
echo -e "${YELLOW}Step 14: Starting services with PM2...${NC}"

cd $DEPLOY_DIR/current/backend
pm2 start src/server.js --name "eximpo-backend" --time
pm2 start src/workers/emailWorker.js --name "eximpo-email-worker" --time

cd $DEPLOY_DIR/current/frontend
pm2 serve dist 3000 --name "eximpo-frontend" --spa

cd $DEPLOY_DIR/current/admin
pm2 serve dist 3001 --name "eximpo-admin" --spa

# Save PM2 process list
pm2 save
pm2 startup | tail -n 1 | bash

echo -e "${GREEN}✓ Services started${NC}"

# Step 15: Configure Nginx
echo -e "${YELLOW}Step 15: Configuring Nginx...${NC}"

cat > /etc/nginx/sites-available/eximpo << 'EOF'
# Backend API
server {
    listen 80;
    server_name api.eximpoglobal.net;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend App
server {
    listen 80;
    server_name app.eximpoglobal.net;
    
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
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin Panel
server {
    listen 80;
    server_name admin.eximpoglobal.net;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/eximpo /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
nginx -t && systemctl reload nginx

echo -e "${GREEN}✓ Nginx configured${NC}"

# Step 16: Configure firewall
echo -e "${YELLOW}Step 16: Configuring firewall...${NC}"
if command_exists ufw; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    echo -e "${GREEN}✓ Firewall configured${NC}"
else
    echo -e "${YELLOW}⚠ UFW not installed, skipping firewall setup${NC}"
fi

# Final status
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Services Status:${NC}"
pm2 list
echo ""
echo -e "${BLUE}Access URLs:${NC}"
echo -e "  Frontend: ${GREEN}http://app.eximpoglobal.net${NC}"
echo -e "  Admin:    ${GREEN}http://admin.eximpoglobal.net${NC}"
echo -e "  Backend:  ${GREEN}http://localhost:5000${NC}"
echo ""
echo -e "${BLUE}Deployment Info:${NC}"
echo -e "  Release:  ${GREEN}$RELEASE_NAME${NC}"
echo -e "  Location: ${GREEN}$RELEASE_DIR${NC}"
echo -e "  Current:  ${GREEN}$(readlink $DEPLOY_DIR/current)${NC}"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo -e "  View logs:       ${YELLOW}pm2 logs${NC}"
echo -e "  Restart all:     ${YELLOW}pm2 restart all${NC}"
echo -e "  Stop all:        ${YELLOW}pm2 stop all${NC}"
echo -e "  Service status:  ${YELLOW}pm2 status${NC}"
echo -e "  Nginx logs:      ${YELLOW}tail -f /var/log/nginx/error.log${NC}"
echo -e "  Rollback:        ${YELLOW}ln -sf /var/www/app/releases/PREVIOUS_RELEASE /var/www/app/current && pm2 restart all${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Configure SSL: ${BLUE}certbot --nginx -d app.eximpoglobal.net -d admin.eximpoglobal.net${NC}"
echo -e "  2. Create admin: ${BLUE}cd $DEPLOY_DIR/current/backend && node create-admin.js${NC}"
echo -e "  3. Seed data: ${BLUE}node seed-products.js${NC}"
echo ""
