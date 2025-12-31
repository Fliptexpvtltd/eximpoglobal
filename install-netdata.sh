#!/bin/bash
# Install Netdata monitoring with SSL

echo "=== Installing Netdata Monitoring ==="

# 1. Start Netdata container
cd /opt/eximpo
docker-compose -f docker-compose.netdata.yml up -d

echo "Waiting for Netdata to start..."
sleep 10

# 2. Create nginx config
cat > /etc/nginx/sites-available/netdata << 'EOF'
upstream netdata {
    server 127.0.0.1:19999;
    keepalive 64;
}

server {
    listen 80;
    server_name monitor.eximpoglobal.net;

    location / {
        proxy_pass http://netdata;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
EOF

# 3. Enable site
ln -s /etc/nginx/sites-available/netdata /etc/nginx/sites-enabled/

# 4. Test and reload nginx
nginx -t && systemctl reload nginx

echo ""
echo "✅ Netdata installed and nginx configured!"
echo ""
echo "Next steps:"
echo "1. Add DNS A record: monitor.eximpoglobal.net -> 217.217.250.49"
echo "2. Run: certbot --nginx -d monitor.eximpoglobal.net --non-interactive --agree-tos --register-unsafely-without-email --redirect"
echo ""
echo "Access: http://monitor.eximpoglobal.net (or port 19999 directly)"
