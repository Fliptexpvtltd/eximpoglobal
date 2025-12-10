#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

clear
echo -e "${BLUE}========================================"
echo -e "  Eximpo - Local Development Setup"
echo -e "  All Services in Docker"
echo -e "========================================${NC}\n"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}ERROR: Docker is not running. Please start Docker.${NC}"
    exit 1
fi
echo -e "${GREEN}[OK] Docker is running${NC}\n"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file for local development...${NC}"
    cat > .env << EOF
# Local Development Environment
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000

# PostgreSQL (Host Machine)
DB_NAME=eximpo
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT
JWT_SECRET=dev-secret-key-change-in-production
EOF
    echo -e "${GREEN}[CREATED] .env file created${NC}"
    echo -e "${RED}IMPORTANT: Update DB_PASSWORD in .env file with your PostgreSQL password!${NC}\n"
    read -p "Press enter to continue..."
fi

echo ""
echo "Choose an option:"
echo "1) Start all services (Frontend + Backend + PostgreSQL)"
echo "2) Start with pgAdmin (Database management UI)"
echo "3) Start frontend only"
echo "4) Start backend only"
echo "5) Stop all services"
echo "6) View logs"
echo "7) Restart services"
echo "8) Rebuild containers"
echo "9) Clean data (remove database volume)"
echo ""
read -p "Enter choice [1-9]: " choice

case $choice in
    1)
        echo -e "\n${GREEN}Starting all services...${NC}\n"
        docker-compose -f docker-compose.local.yml up -d
        SUCCESS=true
        ;;
    2)
        echo -e "\n${GREEN}Starting all services with pgAdmin...${NC}\n"
        docker-compose -f docker-compose.local.yml --profile tools up -d
        PGADMIN=true
        SUCCESS=true
        ;;
    3)
        echo -e "\n${GREEN}Starting Frontend only...${NC}\n"
        docker-compose -f docker-compose.local.yml up -d postgres frontend
        SUCCESS=true
        ;;
    4)
        echo -e "\n${GREEN}Starting Backend only...${NC}\n"
        docker-compose -f docker-compose.local.yml up -d postgres backend
        SUCCESS=true
        ;;
    5)
        echo -e "\n${YELLOW}Stopping all services...${NC}\n"
        docker-compose -f docker-compose.local.yml --profile tools down
        echo -e "${GREEN}[OK] All services stopped${NC}"
        exit 0
        ;;
    6)
        echo -e "\n${GREEN}Showing logs (Press Ctrl+C to exit)...${NC}\n"
        docker-compose -f docker-compose.local.yml logs -f
        exit 0
        ;;
    7)
        echo -e "\n${GREEN}Restarting services...${NC}\n"
        docker-compose -f docker-compose.local.yml restart
        SUCCESS=true
        ;;
    8)
        echo -e "\n${GREEN}Rebuilding containers...${NC}\n"
        docker-compose -f docker-compose.local.yml up -d --build
        SUCCESS=true
        ;;
    9)
        echo -e "\n${RED}WARNING: This will DELETE all database data!${NC}"
        read -p "Are you sure? (y/n): " confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            echo -e "\n${YELLOW}Stopping services and removing volumes...${NC}"
            docker-compose -f docker-compose.local.yml down -v
            echo -e "${GREEN}[OK] Database volume removed${NC}"
        else
            echo "Cancelled."
        fi
        exit 0
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
    echo -e "  Backend:   ${GREEN}http://localhost:5000${NC}\n"
    
    echo -e "${BLUE}PostgreSQL Connection:${NC}"
    echo -e "  Host:      ${GREEN}localhost${NC}"
    echo -e "  Port:      ${GREEN}5432${NC}"
    echo -e "  Database:  ${GREEN}eximpo${NC}"
    echo -e "  User:      ${GREEN}postgres${NC}"
    echo -e "  Password:  ${GREEN}postgres${NC}\n"
    
    if [ "$PGADMIN" = true ]; then
        echo -e "${BLUE}pgAdmin:    ${GREEN}http://localhost:5050${NC}"
        echo -e "  Email:     ${GREEN}admin@eximpo.local${NC}"
        echo -e "  Password:  ${GREEN}admin${NC}\n"
    fi
    
    echo -e "${BLUE}Useful commands:${NC}"
    echo -e "  View logs:     ${YELLOW}docker-compose -f docker-compose.local.yml logs -f${NC}"
    echo -e "  Stop services: ${YELLOW}docker-compose -f docker-compose.local.yml down${NC}"
    echo -e "  Restart:       ${YELLOW}docker-compose -f docker-compose.local.yml restart${NC}"
    echo -e "  Shell access:  ${YELLOW}docker exec -it eximpo-postgres psql -U postgres -d eximpo${NC}\n"
fi
