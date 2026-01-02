@echo off
echo ========================================
echo   Deploying to VPS (Non-Docker)
echo ========================================
echo.

echo Uploading deployment script to VPS...
scp deploy-vps-no-docker.sh root@217.217.250.49:/tmp/

echo.
echo Connecting to VPS and running deployment...
ssh root@217.217.250.49 "chmod +x /tmp/deploy-vps-no-docker.sh && /tmp/deploy-vps-no-docker.sh"

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Access your application:
echo   Frontend: http://app.eximpoglobal.net
echo   Admin:    http://admin.eximpoglobal.net
echo.
pause
