# Fast Deploy - Upload ONE compressed file
$VPS = "217.217.250.49"
$PASSWORD = "7NwxCH000ub"

Write-Host "Step 1: Compressing project files..." -ForegroundColor Green

# Compress only essential folders (exclude node_modules, mobile-app)
Compress-Archive -Path backend,frontend,admin,docker-compose.production.yml,.env.production -DestinationPath eximpo-deploy.zip -Force

Write-Host "Step 2: Uploading (one file)..." -ForegroundColor Green
scp -o StrictHostKeyChecking=no eximpo-deploy.zip root@${VPS}:/root/

Write-Host "Step 3: Extracting and deploying on VPS..." -ForegroundColor Green
$sshCommands = "apt install -y unzip; cd /opt/eximpo; unzip -o /root/eximpo-deploy.zip; rm /root/eximpo-deploy.zip; docker compose -f docker-compose.production.yml down; docker compose -f docker-compose.production.yml up -d --build; sleep 20; docker compose -f docker-compose.production.yml ps"
ssh -o StrictHostKeyChecking=no root@$VPS $sshCommands

Remove-Item eximpo-deploy.zip

Write-Host ""
Write-Host "✅ Deployed! Visit: http://217.217.250.49" -ForegroundColor Green
Write-Host "Login: buyer@eximpo.net / Test@123" -ForegroundColor Cyan
