@echo off
echo ========================================
echo   Starting Localhost Development
echo ========================================
echo.
echo Stopping any running containers...
docker-compose -f docker-compose.production.yml down 2>nul
docker-compose -f docker-compose.vps.yml down 2>nul
docker-compose -f docker-compose.contabo.yml down 2>nul
echo.
echo Starting local development environment...
docker-compose -f docker-compose.local.yml up -d
echo.
echo ========================================
echo   Services Started!
echo ========================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:5000
echo Admin:     http://localhost:3001
echo Database:  localhost:5432
echo.
echo Waiting for services to be ready...
timeout /t 5 /nobreak > nul
echo.
echo Opening services in browser...
start http://localhost:3000
start http://localhost:3001
echo.
echo Done! Press any key to view logs...
pause
docker-compose -f docker-compose.local.yml logs -f
