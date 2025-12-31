#!/bin/bash
# Install Portainer for visual Docker monitoring
# Portainer provides a web UI to monitor and manage Docker containers

echo "=== Installing Portainer for Docker Monitoring ==="

# Create volume for Portainer data
docker volume create portainer_data

# Run Portainer
docker run -d \
  -p 9000:9000 \
  -p 9443:9443 \
  --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest

echo ""
echo "✅ Portainer installed successfully!"
echo ""
echo "Access Portainer at:"
echo "  HTTP:  http://217.217.250.49:9000"
echo "  HTTPS: https://217.217.250.49:9443"
echo ""
echo "First time setup:"
echo "1. Create an admin account"
echo "2. Select 'Docker' as environment"
echo "3. You'll see all your containers in the dashboard"
echo ""
echo "Remember to open port 9443 in firewall:"
echo "  ufw allow 9443/tcp"
