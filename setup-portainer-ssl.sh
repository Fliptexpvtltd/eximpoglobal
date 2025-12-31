#!/bin/bash
# Setup Portainer with proper SSL using nginx reverse proxy
# Run this on VPS to setup portainer.eximpoglobal.net

echo "=== Setting up Portainer with SSL ==="

# 1. Create nginx config for Portainer
cat > /etc/nginx/sites-available/portainer << 'EOF'
server {
    listen 80;
    server_name portainer.eximpoglobal.net;

    location / {
        proxy_pass https://127.0.0.1:9443;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # SSL verification settings for self-signed cert
        proxy_ssl_verify off;
    }
}
EOF

# 2. Enable the site
ln -s /etc/nginx/sites-available/portainer /etc/nginx/sites-enabled/

# 3. Test and reload nginx
nginx -t && systemctl reload nginx

echo ""
echo "✅ Nginx configured!"
echo ""
echo "Next steps:"
echo "1. Add DNS A record: portainer.eximpoglobal.net -> 217.217.250.49"
echo "2. Wait 5-10 minutes for DNS propagation"
echo "3. Run: certbot --nginx -d portainer.eximpoglobal.net"
echo ""
echo "Then access: https://portainer.eximpoglobal.net"
