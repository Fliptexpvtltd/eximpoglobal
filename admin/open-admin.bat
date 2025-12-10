@echo off
echo.
echo ========================================
echo   Opening Eximpo Admin Portal
echo ========================================
echo.

REM Check if backend is running
docker ps | findstr eximpo-backend >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Backend is not running!
    echo Please run: .\start-local.bat from project root
    echo.
    pause
    exit /b 1
)

echo [OK] Backend is running
echo.

REM Check if admin frontend is running on port 3001
curl -s http://localhost:3001 >nul 2>&1
if %errorlevel% neq 0 (
    echo Starting admin frontend on port 3001...
    cd ..
    docker-compose -f docker-compose.admin.yml up -d
    timeout /t 5 /nobreak >nul
    cd admin
)

echo [OK] Admin frontend is running on port 3001
echo.
echo Opening admin login portal...
echo.

REM Open admin portal in default browser
start "" "%~dp0index.html"

echo.
echo Admin Portal opened!
echo.
echo Default credentials:
echo   Email: admin@eximpo.com
echo   Password: admin123
echo.
pause
