@echo off
setlocal enabledelayedexpansion

echo ================================================
echo   Eximpo Production Deployment
echo   Domain: app.eximpoglobal.net
echo ================================================
echo.

REM Check if .env.production exists
if not exist .env.production (
    echo ERROR: .env.production file not found!
    echo Please copy .env.production.example to .env.production and configure it
    pause
    exit /b 1
)

echo [OK] Environment file found
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

echo [OK] Docker is running
echo.

REM Stop existing containers
echo Stopping existing containers...
docker-compose -f docker-compose.production.yml down
echo.

REM Build and start services
echo Building and starting services...
docker-compose -f docker-compose.production.yml up -d --build
echo.

REM Wait for services
echo Waiting for services to be ready...
timeout /t 15 /nobreak > nul
echo.

REM Check service status
echo Service Status:
docker-compose -f docker-compose.production.yml ps
echo.

REM Initialize database
echo Initializing database...
docker exec -i eximpo-backend-prod node seed-products.js 2>nul || echo [SKIP] Products already seeded
docker exec -i eximpo-backend-prod node create-test-users.js 2>nul || echo [SKIP] Users already created
echo.

echo ================================================
echo   Deployment Complete!
echo ================================================
echo.
echo Your application is now running at:
echo   Frontend: https://app.eximpoglobal.net
echo   Backend:  https://app.eximpoglobal.net/api
echo   Admin:    https://app.eximpoglobal.net:3001
echo.
echo Test Credentials:
echo   Admin:  admin@eximpo.net / Admin@123
echo   Buyer:  buyer@eximpo.net / Test@123
echo   Seller: seller@eximpo.net / Test@123
echo.
echo Useful commands:
echo   View logs:    docker-compose -f docker-compose.production.yml logs -f
echo   Restart:      docker-compose -f docker-compose.production.yml restart
echo   Stop all:     docker-compose -f docker-compose.production.yml down
echo.
pause
