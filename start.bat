@echo off
echo ========================================
echo   Starting Eximpo - Local Development
echo ========================================
echo.
echo Starting all services:
echo - PostgreSQL Database (port 5432)
echo - Backend API (port 5000)
echo - Frontend (port 3000)
echo - Admin Panel (port 3001)
echo.

docker-compose -f docker-compose.local.yml up -d

echo.
echo ========================================
echo   All services started!
echo ========================================
echo.
echo Access your applications:
echo - Main App:    http://localhost:3000
echo - Admin Panel: http://localhost:3001
echo - Backend API: http://localhost:5000
echo.
echo To stop all services, run: stop.bat
echo To view logs: docker-compose -f docker-compose.local.yml logs -f
echo.
