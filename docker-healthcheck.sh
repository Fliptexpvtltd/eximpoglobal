#!/bin/bash
# Quick Docker health check script
# Usage: ./docker-healthcheck.sh

echo "=== Docker Container Health Check ==="
echo ""

# Container status
echo "📦 Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep eximpo

echo ""
echo "💾 Resource Usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | grep eximpo

echo ""
echo "🌐 Service Health:"
echo -n "Backend (5000): "
if curl -sf -m 5 http://127.0.0.1:5000/health > /dev/null; then
    echo "✅ OK"
else
    echo "❌ FAILED"
fi

echo -n "Frontend (3000): "
if curl -sf -m 5 http://127.0.0.1:3000 > /dev/null; then
    echo "✅ OK"
else
    echo "❌ FAILED"
fi

echo -n "Admin (3001): "
if curl -sf -m 5 http://127.0.0.1:3001 > /dev/null; then
    echo "✅ OK"
else
    echo "❌ FAILED"
fi

echo -n "Website (HTTPS): "
if curl -sf -m 5 https://app.eximpoglobal.net > /dev/null; then
    echo "✅ OK"
else
    echo "❌ FAILED"
fi

echo ""
echo "🔍 System Resources:"
echo -n "Disk Usage: "
df -h / | awk 'NR==2 {print $5 " used of " $2}'

echo -n "Memory Usage: "
free -h | grep Mem | awk '{print $3 " used of " $2}'

echo -n "CPU Load: "
uptime | awk '{print $(NF-2) $(NF-1) $NF}'

echo ""
echo "📝 Recent Logs (last 10 lines):"
echo "--- Backend ---"
docker logs --tail 10 eximpo-backend-prod 2>&1 | tail -5

echo ""
echo "--- Frontend ---"
docker logs --tail 10 eximpo-frontend-prod 2>&1 | tail -5
