@echo off
echo.
echo ========================================
echo   Starting Admin Frontend (Port 3001)
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

REM Check if main network exists
docker network ls | findstr eximpo_eximpo-network >nul 2>&1
if %errorlevel% neq 0 (
    echo Creating Docker network...
    docker network create eximpo_eximpo-network
)

echo Starting admin frontend on port 3001...
echo.
docker-compose -f docker-compose.admin.yml up -d

echo.
echo ========================================
echo   Admin Frontend Started!
echo ========================================
echo.
echo Access admin dashboard at:
echo   http://localhost:3001
echo.
echo Login via:
echo   admin\index.html
echo.
echo Credentials:
echo   Email: admin@eximpo.com
echo   Password: admin123
echo.
pause
