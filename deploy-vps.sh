#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Eximpo VPS Deployment Script ===${NC}"

# Configuration
VPS_IP="217.217.250.49"
DEPLOY_DIR="/opt/eximpo"
GITHUB_REPO="https://github.com/Fliptexpvtltd/eximpoglobal.git"

echo -e "${YELLOW}Step 1: Cleaning deployment directory...${NC}"
cd /opt || exit 1
rm -rf eximpo
mkdir -p eximpo
cd eximpo || exit 1

echo -e "${YELLOW}Step 2: Cloning repository...${NC}"
git clone "$GITHUB_REPO" .

if [ ! -f "docker-compose.vps.yml" ]; then
    echo -e "${RED}Error: docker-compose.vps.yml not found!${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 3: Creating .env.production file...${NC}"
cat > .env.production << 'EOF'
# Database Configuration (PostgreSQL on VPS host)
DATABASE_URL=postgresql://eximpo_user:Eximpo2024@SecureDB!9x7z@217.217.250.49:5432/eximpo

# Server Configuration
NODE_ENV=production
PORT=5000

# CORS Configuration
CORS_ORIGIN=https://app.eximpoglobal.net

# JWT Configuration
JWT_SECRET=a8f5e7c9d2b4f6e8a1c3d5e7f9b2d4e6f8a0c2e4f6a8b0d2e4f6a8c0e2f4a6b8c0d2e4f6a8b0c2e4f6

# Email Configuration (Brevo/Sendinblue)
BREVO_API_KEY=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

# Contabo Object Storage Configuration
CONTABO_S3_ACCESS_KEY=ee50cd914b1f62bf42bc6bdec93fed4c
CONTABO_S3_SECRET_KEY=2f5e8b4c9a1d6e3f7b0c8a5d2e9f4b1c
CONTABO_S3_ENDPOINT=https://eu2.contabostorage.com
CONTABO_S3_REGION=eu-central-1
CONTABO_S3_BUCKET=eximpo-storage

# Frontend URL
FRONTEND_URL=https://app.eximpoglobal.net
EOF

echo -e "${YELLOW}Step 4: Stopping old containers...${NC}"
docker-compose -f docker-compose.vps.yml down 2>/dev/null || true

echo -e "${YELLOW}Step 5: Building and starting containers...${NC}"
docker-compose -f docker-compose.vps.yml up -d --build

echo -e "${YELLOW}Step 6: Waiting for services to start...${NC}"
sleep 10

echo -e "${YELLOW}Step 7: Checking container status...${NC}"
docker-compose -f docker-compose.vps.yml ps

echo -e "${YELLOW}Step 8: Seeding database...${NC}"
docker exec eximpo-backend-vps node seed-products.js 2>/dev/null || echo "Seed already done or failed"

echo -e "${YELLOW}Step 9: Creating test users...${NC}"
docker exec eximpo-backend-vps node create-test-users.js 2>/dev/null || echo "Users already exist or failed"

echo -e "${GREEN}=== Deployment Complete! ===${NC}"
echo ""
echo -e "${GREEN}Services:${NC}"
echo -e "  Frontend: http://$VPS_IP:3000"
echo -e "  Admin:    http://$VPS_IP:3001"
echo -e "  Backend:  http://$VPS_IP:5000"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Point app.eximpoglobal.net DNS to $VPS_IP"
echo -e "  2. Run SSL setup: certbot --nginx -d app.eximpoglobal.net"
echo ""
echo -e "${YELLOW}Test Credentials:${NC}"
echo -e "  Admin:  admin@eximpo.net / Admin@123"
echo -e "  Buyer:  buyer@eximpo.net / Test@123"
echo -e "  Seller: seller@eximpo.net / Test@123"
