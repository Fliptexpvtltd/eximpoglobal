#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

clear
echo -e "${BLUE}========================================"
echo -e "  Eximpo - Local Development Setup"
echo -e "========================================${NC}\n"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}ERROR: Docker is not running. Please start Docker.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}\n"

# Check if .env file exists, if not create from example
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file for local development...${NC}"
    cat > .env << EOF
# Local Development Environment
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000

# Database
DB_NAME=eximpo
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=dev-secret-key-change-in-production
EOF
    echo -e "${GREEN}✓ .env file created with default values${NC}\n"
fi

echo "Choose an option:"
echo "1) Start all services (Frontend + Backend + Database + pgAdmin)"
echo "2) Start minimal (Frontend + Backend + Database only)"
echo "3) Start with Redis cache"
echo "4) Stop all services"
echo "5) Clean up (remove containers and volumes)"
echo "6) View logs"
echo "7) Restart services"
echo ""
read -p "Enter choice [1-7]: " choice

case $choice in
    1)
        echo -e "\n${GREEN}Starting all services...${NC}\n"
        docker-compose -f docker-compose.dev.yml up -d
        SUCCESS=true
        ;;
    2)
        echo -e "\n${GREEN}Starting minimal services...${NC}\n"
        docker-compose -f docker-compose.dev.yml up -d frontend backend postgres
        SUCCESS=true
        ;;
    3)
        echo -e "\n${GREEN}Starting with Redis cache...${NC}\n"
        docker-compose -f docker-compose.dev.yml --profile cache up -d
        SUCCESS=true
        ;;
    4)
        echo -e "\n${YELLOW}Stopping all services...${NC}\n"
        docker-compose -f docker-compose.dev.yml down
        echo -e "${GREEN}✓ All services stopped${NC}"
        exit 0
        ;;
    5)
        echo -e "\n${RED}WARNING: This will remove all data!${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" == "yes" ]; then
            echo -e "\n${YELLOW}Cleaning up...${NC}\n"
            docker-compose -f docker-compose.dev.yml down -v
            docker system prune -f
            echo -e "${GREEN}✓ Cleanup complete${NC}"
        else
            echo "Cancelled."
        fi
        exit 0
        ;;
    6)
        echo -e "\n${GREEN}Showing logs (Press Ctrl+C to exit)...${NC}\n"
        docker-compose -f docker-compose.dev.yml logs -f
        exit 0
        ;;
    7)
        echo -e "\n${GREEN}Restarting services...${NC}\n"
        docker-compose -f docker-compose.dev.yml restart
        SUCCESS=true
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

if [ "$SUCCESS" = true ]; then
    echo -e "\n${GREEN}========================================"
    echo -e "  Services Started Successfully!"
    echo -e "========================================${NC}\n"
    echo -e "${BLUE}Access your application at:${NC}"
    echo -e "  Frontend:  ${GREEN}http://localhost:3000${NC}"
    echo -e "  Backend:   ${GREEN}http://localhost:5000${NC}"
    echo -e "  pgAdmin:   ${GREEN}http://localhost:5050${NC}"
    echo -e "             (admin@local.dev / admin)"
    echo -e "  Database:  ${GREEN}localhost:5432${NC}"
    echo -e "             (postgres / postgres / eximpo)\n"
    
    echo -e "${BLUE}Useful commands:${NC}"
    echo -e "  View logs:     ${YELLOW}docker-compose -f docker-compose.dev.yml logs -f${NC}"
    echo -e "  Stop services: ${YELLOW}docker-compose -f docker-compose.dev.yml down${NC}"
    echo -e "  Restart:       ${YELLOW}docker-compose -f docker-compose.dev.yml restart${NC}\n"
fi
