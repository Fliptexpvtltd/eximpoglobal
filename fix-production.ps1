# Production Server Fix Script
# Run this after diagnosing the issue

$VPS_IP = "217.217.250.49"
$VPS_USER = "root"

Write-Host "=== Production Fix Script ===" -ForegroundColor Cyan
Write-Host "VPS: $VPS_IP" -ForegroundColor Yellow
Write-Host ""

$fixCommands = @"
cd /opt/eximpo

echo '=== Step 1: Stopping Services ==='
docker-compose -f docker-compose.production.yml down

echo ''
echo '=== Step 2: Pulling Latest Code ==='
git pull origin main

echo ''
echo '=== Step 3: Rebuilding Containers ==='
docker-compose -f docker-compose.production.yml build --no-cache

echo ''
echo '=== Step 4: Starting Services ==='
docker-compose -f docker-compose.production.yml up -d

echo ''
echo '=== Step 5: Waiting for Services to Start ==='
sleep 15

echo ''
echo '=== Step 6: Checking Container Status ==='
docker-compose -f docker-compose.production.yml ps

echo ''
echo '=== Step 7: Updating Nginx Config ==='
cp nginx-app.conf /etc/nginx/sites-available/eximpoglobal

echo ''
echo '=== Step 8: Testing Nginx Config ==='
nginx -t

echo ''
echo '=== Step 9: Reloading Nginx ==='
systemctl reload nginx

echo ''
echo '=== Step 10: Final Health Check ==='
sleep 5
curl http://127.0.0.1:5000/health
curl -I http://127.0.0.1:3000

echo ''
echo '=== Fix Complete ==='
"@

$fixCommands | Out-File -FilePath "$env:TEMP\vps-fix.sh" -Encoding UTF8

Write-Host "Applying fix to VPS..." -ForegroundColor Green
Write-Host ""

Get-Content "$env:TEMP\vps-fix.sh" | ssh "${VPS_USER}@${VPS_IP}" "bash -s"

Remove-Item "$env:TEMP\vps-fix.sh" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=== Fix Applied ===" -ForegroundColor Cyan
Write-Host "Visit: https://app.eximpoglobal.net" -ForegroundColor Green
