@echo off
echo ========================================
echo   Stopping Eximpo - Local Development
echo ========================================
echo.

docker-compose -f docker-compose.local.yml down

echo.
echo ========================================
echo   All services stopped!
echo ========================================
echo.
