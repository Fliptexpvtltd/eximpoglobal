#!/bin/bash

# Production Deployment Script for app.eximpoglobal.net
# Run this on your production server

set -e

echo "================================================"
echo "  Eximpo Production Deployment"
echo "  Domain: app.eximpoglobal.net"
echo "================================================"
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please copy .env.production.example to .env.production and configure it"
    exit 1
fi

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

echo "✅ Environment variables loaded"
echo ""

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main || echo "⚠️  Git pull skipped (not in git repo)"
echo ""

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.production.yml down
echo ""

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.production.yml up -d --build
echo ""

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10
echo ""

# Check service status
echo "📊 Service Status:"
docker-compose -f docker-compose.production.yml ps
echo ""

# Initialize database (if needed)
echo "🗄️  Initializing database..."
docker exec -i eximpo-backend-prod node seed-products.js || echo "⚠️  Products already seeded"
docker exec -i eximpo-backend-prod node create-test-users.js || echo "⚠️  Users already created"
echo ""

echo "================================================"
echo "  ✅ Deployment Complete!"
echo "================================================"
echo ""
echo "🌐 Your application is now running at:"
echo "   Frontend: https://app.eximpoglobal.net"
echo "   Backend:  https://app.eximpoglobal.net/api"
echo "   Admin:    https://app.eximpoglobal.net:3001"
echo ""
echo "📋 Test Credentials:"
echo "   Admin:  admin@eximpo.net / Admin@123"
echo "   Buyer:  buyer@eximpo.net / Test@123"
echo "   Seller: seller@eximpo.net / Test@123"
echo ""
echo "📝 Useful commands:"
echo "   View logs:    docker-compose -f docker-compose.production.yml logs -f"
echo "   Restart:      docker-compose -f docker-compose.production.yml restart"
echo "   Stop all:     docker-compose -f docker-compose.production.yml down"
echo ""
