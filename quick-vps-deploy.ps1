Write-Host "Deploying to VPS 217.217.250.49..." -ForegroundColor Cyan

# Copy docker-compose file
Get-Content docker-compose.vps.yml | ssh root@217.217.250.49 "cat > /opt/eximpo/docker-compose.vps.yml"

# Copy env file  
Get-Content .env.production | ssh root@217.217.250.49 "cat > /opt/eximpo/.env.production"

# Run deployment
ssh root@217.217.250.49 "cd /opt/eximpo && docker-compose -f docker-compose.vps.yml up -d --build"

Write-Host "`nDeployment started! Check status:" -ForegroundColor Green
ssh root@217.217.250.49 "cd /opt/eximpo && docker-compose -f docker-compose.vps.yml ps"
