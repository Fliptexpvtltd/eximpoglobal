@echo off
echo Deploying to VPS...
echo.

REM SSH and execute all commands
ssh root@217.217.250.49 "cd /opt/eximpo && git clone https://github.com/Fliptexpvtltd/eximpoglobal.git temp && cp -r temp/* . && rm -rf temp && docker-compose -f docker-compose.vps.yml up -d --build && docker-compose -f docker-compose.vps.yml ps"

echo.
echo Deployment complete!
echo Access: http://app.eximpoglobal.net
echo.
pause
