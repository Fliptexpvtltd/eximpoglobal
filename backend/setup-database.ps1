# PostgreSQL Database Setup Script for Eximpo
Write-Host "Eximpo Database Setup" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan

# Check if PostgreSQL is installed
if (!(Get-Command psql -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: PostgreSQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}

Write-Host "PostgreSQL found" -ForegroundColor Green

# Database configuration from .env
$DB_USER = "postgres"
$DB_PASSWORD = "prakash"
$DB_NAME = "eximpo"

Write-Host ""
Write-Host "Database Configuration:" -ForegroundColor Cyan
Write-Host "  User: $DB_USER" -ForegroundColor White
Write-Host "  Database: $DB_NAME" -ForegroundColor White

# Set password for psql
$env:PGPASSWORD = $DB_PASSWORD

# Create database
Write-Host ""
Write-Host "Dropping existing database (if any)..." -ForegroundColor Yellow
psql -U $DB_USER -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>$null

Write-Host "Creating new database..." -ForegroundColor Yellow
psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database created successfully!" -ForegroundColor Green
    
    # Run main schema
    Write-Host ""
    Write-Host "Running main schema (init.sql)..." -ForegroundColor Yellow
    psql -U $DB_USER -d $DB_NAME -f init.sql
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Main schema applied successfully" -ForegroundColor Green
        
        # Run schema updates
        Write-Host ""
        Write-Host "Applying schema updates..." -ForegroundColor Yellow
        psql -U $DB_USER -d $DB_NAME -f schema-updates.sql
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Schema updates applied successfully" -ForegroundColor Green
        } else {
            Write-Host "Some updates may have failed (OK if tables exist)" -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "================================================" -ForegroundColor Cyan
        Write-Host "Database setup complete!" -ForegroundColor Green
        Write-Host "================================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Default admin account:" -ForegroundColor Cyan
        Write-Host "  Email: admin@eximpo.local" -ForegroundColor White
        Write-Host "  Password: admin123" -ForegroundColor White
        Write-Host ""
        Write-Host "Database connection string:" -ForegroundColor Cyan
        $connectionString = "postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}"
        Write-Host "  $connectionString" -ForegroundColor White
        Write-Host ""
        Write-Host "You can now start the backend with: npm run dev" -ForegroundColor Yellow
    } else {
        Write-Host "ERROR: Schema migration failed" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR: Failed to create database" -ForegroundColor Red
    Write-Host "Make sure PostgreSQL service is running and credentials are correct" -ForegroundColor Yellow
}

# Clear password
$env:PGPASSWORD = $null
