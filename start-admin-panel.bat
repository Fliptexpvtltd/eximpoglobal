@echo off
echo ========================================
echo Starting Eximpo Admin Panel...
echo ========================================
echo.

echo [1/2] Starting admin container...
docker-compose -f docker-compose.admin.yml up -d --build

echo.
echo [2/2] Waiting for services to be ready...
timeout /t 10

echo.
echo ========================================
echo ✓ Admin Panel Started Successfully!
echo ========================================
echo.
echo Admin Portal: http://localhost:3001
echo Backend API:  http://localhost:5000
echo.
echo Login Credentials:
echo   Email:    admin@eximpo.com
echo   Password: admin123
echo.
echo Opening admin portal in browser...
start http://localhost:3001
echo.
echo Press any key to view logs (Ctrl+C to stop)...
pause > nul

docker-compose -f docker-compose.admin.yml logs -f
