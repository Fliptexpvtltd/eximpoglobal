@echo off
echo Creating Eximpo database...

REM Create database (you'll be prompted for postgres password)
psql -U postgres -c "CREATE DATABASE eximpo;"

echo Database created!
echo.
echo Running migrations...

REM Run the schema migration
psql -U postgres -d eximpo -f init.sql

echo.
echo Database setup complete!
echo Default admin account: admin@eximpo.local / admin123
pause
