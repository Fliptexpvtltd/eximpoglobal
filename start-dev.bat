@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   Eximpo - Local Development Setup
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

echo Docker is running.
echo.

REM Check if .env file exists, if not create from example
if not exist .env (
    echo Creating .env file for local development...
    (
        echo # Local Development Environment
        echo VITE_API_BASE_URL=http://localhost:5000/api
        echo VITE_API_TIMEOUT=30000
        echo.
        echo # Database
        echo DB_NAME=eximpo
        echo DB_USER=postgres
        echo DB_PASSWORD=postgres
        echo.
        echo # JWT
        echo JWT_SECRET=dev-secret-key-change-in-production
    ) > .env
    echo .env file created with default values.
    echo.
)

echo Choose an option:
echo.
echo 1. Start all services (Frontend + Backend + Database + pgAdmin)
echo 2. Start minimal (Frontend + Backend + Database only)
echo 3. Start with Redis cache
echo 4. Stop all services
echo 5. Clean up (remove containers and volumes)
echo 6. View logs
echo 7. Restart services
echo.
set /p choice="Enter choice [1-7]: "

if "%choice%"=="1" (
    echo.
    echo Starting all services...
    echo.
    docker-compose -f docker-compose.dev.yml up -d
    goto :success
) else if "%choice%"=="2" (
    echo.
    echo Starting minimal services...
    echo.
    docker-compose -f docker-compose.dev.yml up -d frontend backend postgres
    goto :success
) else if "%choice%"=="3" (
    echo.
    echo Starting with Redis cache...
    echo.
    docker-compose -f docker-compose.dev.yml --profile cache up -d
    goto :success
) else if "%choice%"=="4" (
    echo.
    echo Stopping all services...
    echo.
    docker-compose -f docker-compose.dev.yml down
    echo.
    echo All services stopped.
    goto :end
) else if "%choice%"=="5" (
    echo.
    echo WARNING: This will remove all data!
    set /p confirm="Are you sure? (yes/no): "
    if "!confirm!"=="yes" (
        echo.
        echo Cleaning up...
        docker-compose -f docker-compose.dev.yml down -v
        docker system prune -f
        echo.
        echo Cleanup complete.
    ) else (
        echo Cancelled.
    )
    goto :end
) else if "%choice%"=="6" (
    echo.
    echo Showing logs (Press Ctrl+C to exit)...
    echo.
    docker-compose -f docker-compose.dev.yml logs -f
    goto :end
) else if "%choice%"=="7" (
    echo.
    echo Restarting services...
    echo.
    docker-compose -f docker-compose.dev.yml restart
    goto :success
) else (
    echo Invalid choice.
    pause
    exit /b 1
)

:success
echo.
echo ========================================
echo   Services Started Successfully!
echo ========================================
echo.
echo Access your application at:
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:5000
echo   pgAdmin:   http://localhost:5050
echo            (admin@local.dev / admin)
echo   Database:  localhost:5432
echo            (postgres / postgres / eximpo)
echo.
echo View logs with:
echo   docker-compose -f docker-compose.dev.yml logs -f
echo.
echo Stop services with:
echo   docker-compose -f docker-compose.dev.yml down
echo.

:end
pause
