@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   Eximpo - Local Development Setup
echo   All Services in Docker
echo ========================================
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

REM Check if .env file exists
if not exist .env (
    echo Creating .env file for local development...
    (
        echo # Local Development Environment
        echo VITE_API_BASE_URL=http://localhost:5000/api
        echo VITE_API_TIMEOUT=30000
        echo.
        echo # PostgreSQL ^(Host Machine^)
        echo DB_NAME=eximpo
        echo DB_USER=postgres
        echo DB_PASSWORD=your_postgres_password
        echo.
        echo # JWT
        echo JWT_SECRET=dev-secret-key-change-in-production
    ) > .env
    echo.
    echo [CREATED] .env file created
    echo IMPORTANT: Update DB_PASSWORD in .env file with your PostgreSQL password!
    echo.
    pause
)

echo.
echo Choose an option:
echo.
echo 1. Start all services (Frontend + Backend + PostgreSQL)
echo 2. Start with Admin Panel (Frontend + Backend + Admin + PostgreSQL)
echo 3. Start with pgAdmin (Database management UI)
echo 4. Start frontend only
echo 5. Start backend only
echo 6. Stop all services
echo 7. View logs
echo 8. Restart services
echo 9. Rebuild containers
echo 10. Clean data (remove database volume)
echo.
set /p choice="Enter choice [1-10]: "

if "%choice%"=="1" (
    echo.
    echo Starting all services...
    echo.
    docker-compose -f docker-compose.local.yml up -d
    goto :success
) else if "%choice%"=="2" (
    echo.
    echo Starting all services with Admin Panel...
    echo.
    docker-compose -f docker-compose.local.yml up -d
    docker-compose -f docker-compose.admin.yml up -d
    set ADMIN=true
    goto :success
) else if "%choice%"=="3" (
    echo.
    echo Starting all services with pgAdmin...
    echo.
    docker-compose -f docker-compose.local.yml --profile tools up -d
    set PGADMIN=true
    goto :success
) else if "%choice%"=="4" (
    echo.
    echo Starting Frontend only...
    echo.
    docker-compose -f docker-compose.local.yml up -d postgres frontend
    goto :success
) else if "%choice%"=="5" (
    echo.
    echo Starting Backend only...
    echo.
    docker-compose -f docker-compose.local.yml up -d postgres backend
    goto :success
) else if "%choice%"=="6" (
    echo.
    echo Stopping all services...
    echo.
    docker-compose -f docker-compose.local.yml --profile tools down
    docker-compose -f docker-compose.admin.yml down 2>nul
    echo.
    echo [OK] All services stopped.
    goto :end
) else if "%choice%"=="7" (
    echo.
    echo Showing logs ^(Press Ctrl+C to exit^)...
    echo.
    docker-compose -f docker-compose.local.yml logs -f
    goto :end
) else if "%choice%"=="8" (
    echo.
    echo Restarting services...
    echo.
    docker-compose -f docker-compose.local.yml restart
    docker-compose -f docker-compose.admin.yml restart 2>nul
    goto :success
) else if "%choice%"=="9" (
    echo.
    echo Rebuilding containers...
    echo.
    docker-compose -f docker-compose.local.yml up -d --build
    docker-compose -f docker-compose.admin.yml up -d --build 2>nul
    goto :success
) else if "%choice%"=="10" (
    echo.
    echo WARNING: This will DELETE all database data!
    set /p confirm="Are you sure? (y/n): "
    if "!confirm!"=="y" if "!confirm!"=="Y" (
        echo.
        echo Stopping services and removing volumes...
        docker-compose -f docker-compose.local.yml down -v
        docker-compose -f docker-compose.admin.yml down 2>nul
        echo [OK] Database volume removed
    ) else (
        echo Cancelled.
    )
    goto :end
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
echo.
if defined ADMIN (
    echo   Admin Panel: http://localhost:3001
    echo.
)
echo PostgreSQL Connection:
echo   Host:      localhost
echo   Port:      5432
echo   Database:  eximpo
echo   User:      postgres
echo   Password:  postgres
echo.
if defined PGADMIN (
    echo pgAdmin:    http://localhost:5050
    echo   Email:     admin@eximpo.com
    echo   Password:  admin
    echo.
)
echo Useful commands:
echo   View logs:     docker-compose -f docker-compose.local.yml logs -f
echo   Stop services: docker-compose -f docker-compose.local.yml down
echo   Restart:       docker-compose -f docker-compose.local.yml restart
echo   Shell access:  docker exec -it eximpo-postgres psql -U postgres -d eximpo
echo.

:end
pause
