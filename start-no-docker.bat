@echo off
echo ========================================
echo   Eximpo - Non-Docker Development
echo ========================================
echo.
echo Prerequisites:
echo   - PostgreSQL running on localhost:5432
echo   - Redis running on localhost:6379 (optional for emails)
echo   - Node.js installed
echo.

REM Check if node_modules exist
if not exist "backend\node_modules\" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules\" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

if not exist "admin\node_modules\" (
    echo Installing admin dependencies...
    cd admin
    call npm install
    cd ..
)

echo.
echo ========================================
echo   Starting Services
echo ========================================
echo.

REM Start Backend
echo Starting Backend on http://localhost:5000
start "Backend API" cmd /k "cd backend && npm run dev"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak > nul

REM Start Frontend
echo Starting Frontend on http://localhost:3000
start "Frontend" cmd /k "cd frontend && npm run dev"

REM Start Admin
echo Starting Admin Panel on http://localhost:3001
start "Admin Panel" cmd /k "cd admin && npm run dev"

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo Admin:    http://localhost:3001
echo.
echo Press any key to exit (services will keep running)...
pause > nul
