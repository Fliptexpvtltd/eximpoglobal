@echo off
setlocal enabledelayedexpansion

echo ================================
echo   Eximpo Docker Setup
echo ================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo Docker and Docker Compose are installed.
echo.

REM Check if .env file exists
if not exist .env (
    echo WARNING: .env file not found.
    if exist .env.example (
        echo Creating .env from .env.example...
        copy .env.example .env
        echo .env file created. Please update with your actual values.
        echo.
    ) else (
        echo ERROR: .env.example not found. Please create .env file manually.
        pause
        exit /b 1
    )
)

echo Choose deployment mode:
echo 1. Development (with hot reload)
echo 2. Production (with local PostgreSQL)
echo 3. Production (with DigitalOcean PostgreSQL)
echo 4. Stop all containers
echo 5. Clean up (remove containers and volumes)
echo.
set /p choice="Enter choice [1-5]: "

if "%choice%"=="1" (
    echo.
    echo Starting development environment...
    echo.
    docker-compose -f docker-compose.yml up --build
) else if "%choice%"=="2" (
    echo.
    echo Starting production environment with local database...
    echo.
    docker-compose -f docker-compose.yml up --build -d
    echo.
    echo Services started!
    echo Frontend: http://localhost:3000
    echo Backend: http://localhost:5000
    echo pgAdmin: http://localhost:5050
) else if "%choice%"=="3" (
    echo.
    echo Starting production environment with DigitalOcean database...
    echo.
    docker-compose -f docker-compose.prod.yml up --build -d
    echo.
    echo Services started!
    echo Frontend: http://localhost:80
    echo Backend: http://localhost:5000
) else if "%choice%"=="4" (
    echo.
    echo Stopping all containers...
    echo.
    docker-compose -f docker-compose.yml down
    docker-compose -f docker-compose.prod.yml down
    echo.
    echo All containers stopped.
) else if "%choice%"=="5" (
    echo.
    echo Cleaning up containers and volumes...
    echo.
    docker-compose -f docker-compose.yml down -v
    docker-compose -f docker-compose.prod.yml down -v
    docker system prune -f
    echo.
    echo Cleanup complete.
) else (
    echo Invalid choice.
    pause
    exit /b 1
)

echo.
pause
