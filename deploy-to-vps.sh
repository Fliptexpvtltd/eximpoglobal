#!/bin/bash

# Deploy to VPS: 217.217.250.49 (app.eximpoglobal.net)
# Run this from your LOCAL machine

set -e

VPS_IP="217.217.250.49"
VPS_USER="root"
APP_DIR="/opt/eximpo"
DOMAIN="app.eximpoglobal.net"

echo "================================================"
echo "  Deploying Eximpo to app.eximpoglobal.net"
echo "  VPS: $VPS_IP"
echo "================================================"
echo ""

# Check if .env.production exists locally
if [ ! -f .env.production ]; then
    echo "⚠️  Creating .env.production from template..."
    cp .env.production.example .env.production
    echo ""
    echo "❌ Please edit .env.production with your production values:"
    echo "   - Set strong DB_PASSWORD"
    echo "   - Set random JWT_SECRET (64 characters)"
    echo "   - Verify all other settings"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Test SSH connection
echo "🔌 Testing SSH connection..."
if ! ssh -o ConnectTimeout=5 $VPS_USER@$VPS_IP "echo 'SSH connection successful'" 2>/dev/null; then
    echo "❌ Cannot connect to VPS. Please check:"
    echo "   - VPS IP: $VPS_IP"
    echo "   - SSH access for user: $VPS_USER"
    echo "   - Your SSH key is configured"
    exit 1
fi
echo "✅ SSH connection successful"
echo ""

# Create app directory on VPS
echo "📁 Creating application directory..."
ssh $VPS_USER@$VPS_IP "mkdir -p $APP_DIR"
echo ""

# Upload project files (excluding node_modules, .git, etc.)
echo "📤 Uploading project files to VPS..."
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'dist' \
    --exclude 'build' \
    --exclude '.env' \
    --exclude 'postgres_data' \
    --exclude 'mobile-app' \
    ./ $VPS_USER@$VPS_IP:$APP_DIR/

echo ""
echo "✅ Files uploaded"
echo ""

# Upload .env.production
echo "📤 Uploading production environment..."
scp .env.production $VPS_USER@$VPS_IP:$APP_DIR/.env.production
echo "✅ Environment configured"
echo ""

# Install Docker on VPS if not installed
echo "🐳 Checking Docker installation..."
ssh $VPS_USER@$VPS_IP << 'ENDSSH'
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

docker --version
docker-compose --version
ENDSSH
echo "✅ Docker ready"
echo ""

# Deploy application
echo "🚀 Deploying application..."
ssh $VPS_USER@$VPS_IP << ENDSSH
cd $APP_DIR

# Stop existing containers
echo "Stopping existing containers..."
docker-compose -f docker-compose.production.yml down 2>/dev/null || true

# Build and start services
echo "Building and starting services..."
docker-compose -f docker-compose.production.yml up -d --build

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 15

# Check status
docker-compose -f docker-compose.production.yml ps

# Initialize database
echo "Initializing database..."
docker exec -i eximpo-backend-prod node seed-products.js 2>/dev/null || echo "Products already seeded"
docker exec -i eximpo-backend-prod node create-test-users.js 2>/dev/null || echo "Users already created"

echo ""
echo "✅ Application deployed successfully!"
ENDSSH

echo ""
echo "================================================"
echo "  🎉 Deployment Complete!"
echo "================================================"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://$DOMAIN:3000"
echo "   Backend:  http://$DOMAIN:5000"
echo "   Admin:    http://$DOMAIN:3001"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo ""
echo "1. Configure DNS:"
echo "   Point $DOMAIN A record to $VPS_IP"
echo ""
echo "2. Install Nginx (on VPS):"
echo "   ssh $VPS_USER@$VPS_IP"
echo "   apt install nginx"
echo ""
echo "3. Setup SSL Certificate (on VPS):"
echo "   apt install certbot python3-certbot-nginx"
echo "   certbot --nginx -d $DOMAIN"
echo ""
echo "4. Configure Firewall (on VPS):"
echo "   ufw allow 22/tcp"
echo "   ufw allow 80/tcp"
echo "   ufw allow 443/tcp"
echo "   ufw enable"
echo ""
echo "📋 Test Credentials:"
echo "   Admin:  admin@eximpo.net / Admin@123"
echo "   Buyer:  buyer@eximpo.net / Test@123"
echo "   Seller: seller@eximpo.net / Test@123"
echo ""
echo "📚 Documentation:"
echo "   Full guide: PRODUCTION_DEPLOYMENT.md"
echo "   Checklist:  DEPLOYMENT_CHECKLIST.md"
echo ""
