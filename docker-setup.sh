#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐳 Eximpo Docker Setup${NC}\n"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}\n"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created. Please update with your actual values.${NC}\n"
    else
        echo -e "${RED}❌ .env.example not found. Please create .env file manually.${NC}"
        exit 1
    fi
fi

# Menu
echo "Choose deployment mode:"
echo "1) Development (with hot reload)"
echo "2) Production (with local PostgreSQL)"
echo "3) Production (with DigitalOcean PostgreSQL)"
echo "4) Stop all containers"
echo "5) Clean up (remove containers and volumes)"
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo -e "\n${GREEN}🚀 Starting development environment...${NC}\n"
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
        ;;
    2)
        echo -e "\n${GREEN}🚀 Starting production environment with local database...${NC}\n"
        docker-compose -f docker-compose.yml up --build -d
        echo -e "\n${GREEN}✅ Services started!${NC}"
        echo -e "Frontend: http://localhost:3000"
        echo -e "Backend: http://localhost:5000"
        echo -e "pgAdmin: http://localhost:5050"
        ;;
    3)
        echo -e "\n${GREEN}🚀 Starting production environment with DigitalOcean database...${NC}\n"
        docker-compose -f docker-compose.prod.yml up --build -d
        echo -e "\n${GREEN}✅ Services started!${NC}"
        echo -e "Frontend: http://localhost:80"
        echo -e "Backend: http://localhost:5000"
        ;;
    4)
        echo -e "\n${YELLOW}🛑 Stopping all containers...${NC}\n"
        docker-compose -f docker-compose.yml down
        docker-compose -f docker-compose.prod.yml down
        echo -e "${GREEN}✅ All containers stopped${NC}"
        ;;
    5)
        echo -e "\n${RED}🧹 Cleaning up containers and volumes...${NC}\n"
        docker-compose -f docker-compose.yml down -v
        docker-compose -f docker-compose.prod.yml down -v
        docker system prune -f
        echo -e "${GREEN}✅ Cleanup complete${NC}"
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac
