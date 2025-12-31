#!/bin/bash
# PostgreSQL Health Check Script
# Usage: ./postgres-healthcheck.sh

echo "=== PostgreSQL Status Check ==="
echo ""

# Service Status
echo "📊 Service Status:"
systemctl status postgresql --no-pager | head -5
echo ""

# Connection Test
echo "🔌 Connection Test:"
if sudo -u postgres psql -c '\conninfo' &>/dev/null; then
    echo "✅ PostgreSQL is accepting connections"
else
    echo "❌ Cannot connect to PostgreSQL"
fi
echo ""

# Database Info
echo "💾 Database Information:"
sudo -u postgres psql -c "SELECT datname as database, pg_size_pretty(pg_database_size(datname)) as size FROM pg_database WHERE datname = 'eximpo';"
echo ""

# Active Connections
echo "👥 Active Connections:"
sudo -u postgres psql -d eximpo -c "SELECT count(*) as connections, usename FROM pg_stat_activity WHERE datname = 'eximpo' GROUP BY usename;"
echo ""

# Table Count
echo "📋 Tables in Database:"
sudo -u postgres psql -d eximpo -c "SELECT schemaname, count(*) as tables FROM pg_tables WHERE schemaname = 'public' GROUP BY schemaname;"
echo ""

# Last Activity
echo "⏱️  Recent Database Activity:"
sudo -u postgres psql -d eximpo -c "SELECT query, state, now() - query_start as duration FROM pg_stat_activity WHERE datname = 'eximpo' AND state != 'idle' ORDER BY query_start DESC LIMIT 5;"
echo ""

# Disk Usage
echo "💿 PostgreSQL Data Directory:"
du -sh /var/lib/postgresql/
echo ""

# Memory Usage
echo "🧠 Memory Usage:"
ps aux | grep postgres | grep -v grep | awk '{sum+=$6} END {print "PostgreSQL RAM: " sum/1024 " MB"}'
echo ""

echo "✅ Health check complete!"
