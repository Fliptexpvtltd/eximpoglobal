# PostgreSQL Monitoring Commands

Quick reference for monitoring your VPS PostgreSQL database.

## 🚀 Quick Health Check

```bash
# Upload and run health check script
scp postgres-healthcheck.sh root@217.217.250.49:/opt/eximpo/
ssh root@217.217.250.49 "chmod +x /opt/eximpo/postgres-healthcheck.sh && /opt/eximpo/postgres-healthcheck.sh"
```

---

## 📊 Individual Commands

### Service Status
```bash
# Check if PostgreSQL is running
ssh root@217.217.250.49 "systemctl status postgresql"

# Start/Stop/Restart
ssh root@217.217.250.49 "systemctl restart postgresql"
ssh root@217.217.250.49 "systemctl stop postgresql"
ssh root@217.217.250.49 "systemctl start postgresql"
```

### Database Info
```bash
# List all databases with sizes
ssh root@217.217.250.49 "sudo -u postgres psql -c '\l+'"

# Check eximpo database size
ssh root@217.217.250.49 "sudo -u postgres psql -c \"SELECT pg_size_pretty(pg_database_size('eximpo'));\""

# List all tables in eximpo
ssh root@217.217.250.49 "sudo -u postgres psql -d eximpo -c '\dt'"
```

### Active Connections
```bash
# See who's connected
ssh root@217.217.250.49 "sudo -u postgres psql -d eximpo -c 'SELECT * FROM pg_stat_activity;'"

# Count connections
ssh root@217.217.250.49 "sudo -u postgres psql -d eximpo -c 'SELECT count(*) FROM pg_stat_activity;'"
```

### Table Row Counts
```bash
# Count rows in users table
ssh root@217.217.250.49 "sudo -u postgres psql -d eximpo -c 'SELECT count(*) FROM users;'"

# Count rows in all tables
ssh root@217.217.250.49 "sudo -u postgres psql -d eximpo -c \"SELECT schemaname,relname,n_live_tup FROM pg_stat_user_tables ORDER BY n_live_tup DESC;\""
```

### Performance Stats
```bash
# Check cache hit ratio (should be >90%)
ssh root@217.217.250.49 "sudo -u postgres psql -d eximpo -c 'SELECT sum(heap_blks_read) as heap_read, sum(heap_blks_hit) as heap_hit, sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio FROM pg_statio_user_tables;'"

# Check slow queries
ssh root@217.217.250.49 "sudo -u postgres psql -d eximpo -c 'SELECT query, calls, total_time, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;'"
```

### Disk Usage
```bash
# PostgreSQL data directory size
ssh root@217.217.250.49 "du -sh /var/lib/postgresql/"

# Largest tables
ssh root@217.217.250.49 "sudo -u postgres psql -d eximpo -c 'SELECT relname, pg_size_pretty(pg_total_relation_size(relid)) FROM pg_catalog.pg_statio_user_tables ORDER BY pg_total_relation_size(relid) DESC;'"
```

### Backup Database
```bash
# Create backup
ssh root@217.217.250.49 "sudo -u postgres pg_dump eximpo > /tmp/eximpo_backup_$(date +%Y%m%d).sql"

# Download backup to local
scp root@217.217.250.49:/tmp/eximpo_backup_*.sql ./backups/

# Restore backup
ssh root@217.217.250.49 "sudo -u postgres psql eximpo < /tmp/eximpo_backup_20251213.sql"
```

### User Management
```bash
# List users
ssh root@217.217.250.49 "sudo -u postgres psql -c '\du'"

# Create new user
ssh root@217.217.250.49 "sudo -u postgres psql -c \"CREATE USER newuser WITH PASSWORD 'password';\""

# Grant permissions
ssh root@217.217.250.49 "sudo -u postgres psql -d eximpo -c 'GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO newuser;'"
```

### Logs
```bash
# View PostgreSQL logs
ssh root@217.217.250.49 "tail -f /var/log/postgresql/postgresql-*.log"

# Recent errors
ssh root@217.217.250.49 "grep ERROR /var/log/postgresql/postgresql-*.log | tail -20"
```

---

## 🔍 Monitoring in Portainer

While PostgreSQL itself won't show in Portainer, you can see:
- **Backend container** database connection status
- Backend logs showing database queries
- Resource usage of backend (which connects to PostgreSQL)

---

## 📈 Setup Automated Monitoring

Add to your `monitor-docker.sh` script to also check PostgreSQL:

```bash
# Check PostgreSQL status
if ! systemctl is-active --quiet postgresql; then
    log_message "PostgreSQL is not running!"
    send_alert "CRITICAL: PostgreSQL is DOWN on app.eximpoglobal.net"
    systemctl start postgresql
fi

# Check database connections
DB_CONNECTIONS=$(sudo -u postgres psql -t -c "SELECT count(*) FROM pg_stat_activity WHERE datname = 'eximpo';" 2>/dev/null)
if [ "$DB_CONNECTIONS" -gt 50 ]; then
    log_message "High database connections: $DB_CONNECTIONS"
    send_alert "WARNING: High database connections ($DB_CONNECTIONS) on app.eximpoglobal.net"
fi
```
