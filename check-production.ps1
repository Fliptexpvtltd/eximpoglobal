# Production Server Diagnostic Script
# Run this to check app.eximpoglobal.net status

$VPS_IP = "217.217.250.49"
$VPS_USER = "root"

Write-Host "=== Connecting to Production VPS ===" -ForegroundColor Cyan
Write-Host "VPS: $VPS_IP" -ForegroundColor Yellow
Write-Host ""

# Create diagnostic commands
$diagnosticCommands = @"
echo '=== 1. Checking Docker Containers Status ==='
docker ps -a

echo ''
echo '=== 2. Checking Ports in Use ==='
netstat -tulpn | grep -E ':3000|:5000|:5432|:80|:443'

echo ''
echo '=== 3. Testing Backend Health ==='
curl -I http://127.0.0.1:5000/health

echo ''
echo '=== 4. Testing Frontend ==='
curl -I http://127.0.0.1:3000

echo ''
echo '=== 5. Checking Nginx Status ==='
systemctl status nginx

echo ''
echo '=== 6. Testing Nginx Config ==='
nginx -t

echo ''
echo '=== 7. Recent Backend Logs ==='
docker logs --tail=30 eximpo-backend-prod

echo ''
echo '=== 8. Recent Frontend Logs ==='
docker logs --tail=30 eximpo-frontend-prod

echo ''
echo '=== 9. Checking Nginx Error Logs ==='
tail -n 20 /var/log/nginx/error.log

echo ''
echo '=== 10. Disk Space ==='
df -h

echo ''
echo '=== 11. Memory Usage ==='
free -h
"@

# Save commands to temp file
$diagnosticCommands | Out-File -FilePath "$env:TEMP\vps-diagnostic.sh" -Encoding UTF8

Write-Host "Running diagnostics on VPS..." -ForegroundColor Green
Write-Host ""

# SSH and run diagnostics
Get-Content "$env:TEMP\vps-diagnostic.sh" | ssh "${VPS_USER}@${VPS_IP}" "bash -s"

# Clean up
Remove-Item "$env:TEMP\vps-diagnostic.sh" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=== Diagnostic Complete ===" -ForegroundColor Cyan
