@echo off
echo ========================================
echo   Stopping All Development Servers
echo ========================================
echo.

REM Kill Node.js processes
echo Stopping Node.js servers...
taskkill /F /IM node.exe /T 2>nul

REM Kill Vite processes
echo Stopping Vite servers...
taskkill /F /FI "WINDOWTITLE eq Frontend*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Admin*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Backend*" 2>nul

echo.
echo All development servers stopped!
echo.
pause
