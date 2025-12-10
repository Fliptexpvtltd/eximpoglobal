@echo off
echo ==================================
echo  Final Deployment - Manual Steps
echo ==================================
echo.
echo 1. Open WinSCP or FileZilla
echo 2. Connect to: 217.217.250.49
echo 3. Username: root
echo 4. Password: 7NwxCH000ub
echo.
echo 5. Upload these folders to /opt/eximpo/:
echo    - backend
echo    - frontend  
echo    - admin
echo.
echo 6. Then SSH and run:
echo    ssh root@217.217.250.49
echo    cd /opt/eximpo
echo    docker-compose -f docker-compose.vps.yml up -d --build
echo.
echo ==================================
echo OR use this command if you have scp:
echo ==================================
echo scp -r backend frontend admin root@217.217.250.49:/opt/eximpo/
pause
