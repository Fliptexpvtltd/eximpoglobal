# Quick Deploy to VPS
$VPS = "217.217.250.49"
$PASSWORD = "7NwxCH000ub"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Quick Deploy to app.eximpoglobal.net" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if plink exists (PuTTY)
if (!(Get-Command plink -ErrorAction SilentlyContinue)) {
    Write-Host "Installing PuTTY tools..." -ForegroundColor Yellow
    winget install -e --id PuTTY.PuTTY --silent
}

Write-Host "Step 1: Uploading files to VPS..." -ForegroundColor Green

# Create a temporary script to upload and run
$script = @"
cd /opt
mkdir -p eximpo
cd eximpo
apt update -qq
apt install -y wget curl

# Download installation script
cat > install-vps.sh << 'EOFINSTALL'
$(Get-Content install-vps.sh -Raw)
EOFINSTALL

chmod +x install-vps.sh
./install-vps.sh
"@

$script | Set-Content -Path "temp-deploy.sh" -Encoding UTF8

Write-Host "Step 2: Uploading install script to VPS..." -ForegroundColor Green

# Use scp to upload the script
$env:SSHPASS = $PASSWORD
scp -o StrictHostKeyChecking=no install-vps.sh root@${VPS}:/root/install-vps.sh

Write-Host "Step 3: Running installation (5-10 minutes)..." -ForegroundColor Green

# Execute the script on VPS
ssh -o StrictHostKeyChecking=no root@$VPS "chmod +x /root/install-vps.sh && /root/install-vps.sh"

Remove-Item temp-deploy.sh -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  Deployment Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Configure DNS and SSL" -ForegroundColor Yellow
Write-Host "1. Point app.eximpoglobal.net to $VPS" -ForegroundColor White
Write-Host "2. SSH: ssh root@$VPS" -ForegroundColor White
Write-Host "3. Run: certbot --nginx -d app.eximpoglobal.net" -ForegroundColor White
Write-Host ""
Write-Host "Login: buyer@eximpo.net / Test@123" -ForegroundColor Cyan
