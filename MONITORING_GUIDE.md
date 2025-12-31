# 24/7 Docker Monitoring Guide

## Overview
This guide provides multiple options for monitoring your production Docker containers on app.eximpoglobal.net.

---

## Option 1: Automated Monitoring Script (Recommended)

### Setup (One-time)
```bash
# SSH to VPS
ssh root@217.217.250.49

# Copy scripts
cd /opt/eximpo
wget https://raw.githubusercontent.com/yourrepo/eximpo/main/monitor-docker.sh
wget https://raw.githubusercontent.com/yourrepo/eximpo/main/setup-monitoring.sh

# Or upload manually
# From local: scp monitor-docker.sh setup-monitoring.sh root@217.217.250.49:/opt/eximpo/

# Run setup
chmod +x setup-monitoring.sh
./setup-monitoring.sh
```

### Features
- ✅ Automatic container restart if down
- ✅ Health check every 5 minutes
- ✅ Disk and memory monitoring
- ✅ Alert notifications (email/Slack)
- ✅ Automatic log rotation

### Check Status
```bash
# View timer status
systemctl status eximpo-monitor.timer

# View recent logs
tail -f /var/log/eximpo-monitor.log

# Manual run
/opt/eximpo/monitor-docker.sh
```

---

## Option 2: Portainer (Visual Dashboard)

### Install
```bash
ssh root@217.217.250.49
cd /opt/eximpo
bash install-portainer.sh
```

### Access
- URL: `https://217.217.250.49:9443`
- First time: Create admin account
- Dashboard shows all containers, logs, stats

### Features
- 🎯 Visual container management
- 📊 Real-time resource usage graphs
- 📝 Live log streaming
- 🔄 One-click restart/stop/start
- 📈 Historical metrics

---

## Option 3: Quick Health Check Script

### Usage
```bash
ssh root@217.217.250.49
cd /opt/eximpo
bash docker-healthcheck.sh
```

### Output
```
📦 Container Status
💾 Resource Usage
🌐 Service Health
🔍 System Resources
📝 Recent Logs
```

---

## Option 4: Built-in Docker Restart Policy

Already configured in your `docker-compose.production.yml`:
```yaml
restart: always
```

This ensures containers auto-restart if they crash.

---

## Option 5: External Monitoring Services

### UptimeRobot (Free)
1. Visit https://uptimerobot.com
2. Add monitor: `https://app.eximpoglobal.net/health`
3. Get alerts via email/SMS when down

### Better Uptime (Free tier)
1. Visit https://betteruptime.com
2. Add monitor for your domain
3. Get detailed incident reports

### Pingdom (Paid)
- Professional monitoring
- Performance metrics
- Global checks

---

## Manual Monitoring Commands

### Check Running Containers
```bash
docker ps
```

### Check Container Logs
```bash
# Backend logs
docker logs -f eximpo-backend-prod

# Frontend logs
docker logs -f eximpo-frontend-prod

# Last 100 lines
docker logs --tail 100 eximpo-backend-prod
```

### Check Resource Usage
```bash
# Real-time stats
docker stats

# Specific container
docker stats eximpo-backend-prod
```

### Check Container Health
```bash
# Health status
docker inspect --format='{{.State.Health.Status}}' eximpo-backend-prod

# Test endpoints
curl http://127.0.0.1:5000/health
curl http://127.0.0.1:3000
curl https://app.eximpoglobal.net
```

### Restart Containers
```bash
cd /opt/eximpo

# Restart specific service
docker-compose -f docker-compose.production.yml restart backend

# Restart all
docker-compose -f docker-compose.production.yml restart

# Stop and start (full restart)
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d
```

---

## Alert Setup

### Email Alerts
1. Install mail utilities:
   ```bash
   apt install mailutils postfix
   ```

2. Configure in `monitor-docker.sh`:
   ```bash
   EMAIL="your-email@example.com"
   ```

### Slack Alerts
1. Create Slack Webhook:
   - Go to Slack App settings
   - Create Incoming Webhook
   - Copy webhook URL

2. Update `monitor-docker.sh`:
   ```bash
   SLACK_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
   ```

### Telegram Alerts
```bash
# Add to monitor-docker.sh
TELEGRAM_BOT_TOKEN="your_bot_token"
TELEGRAM_CHAT_ID="your_chat_id"

send_telegram() {
    curl -s -X POST \
      "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -d chat_id="${TELEGRAM_CHAT_ID}" \
      -d text="$1"
}
```

---

## Log Management

### View All Logs
```bash
# Application logs
tail -f /var/log/eximpo-monitor.log

# Docker logs
journalctl -u docker -f

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Log Rotation
Already configured in setup script. Logs rotate daily, keep 14 days.

---

## Troubleshooting

### Container Keeps Restarting
```bash
# Check why it's failing
docker logs eximpo-backend-prod --tail 50

# Check exit code
docker inspect eximpo-backend-prod | grep -A 10 State
```

### High Memory Usage
```bash
# Check memory per container
docker stats --no-stream

# Restart high-memory container
docker-compose -f docker-compose.production.yml restart backend
```

### High CPU Usage
```bash
# Identify process
docker top eximpo-backend-prod

# Check logs for errors
docker logs eximpo-backend-prod --tail 100
```

---

## Recommended Setup

1. ✅ **Install monitoring script** - Automated recovery
2. ✅ **Install Portainer** - Visual dashboard
3. ✅ **Setup UptimeRobot** - External monitoring
4. ✅ **Configure alerts** - Email or Slack notifications
5. ✅ **Check logs weekly** - Review `/var/log/eximpo-monitor.log`

---

## Monitoring Checklist

Daily (Automatic):
- [ ] Containers are running
- [ ] Services respond to health checks
- [ ] Disk usage < 85%
- [ ] Memory usage < 90%

Weekly (Manual):
- [ ] Review monitoring logs
- [ ] Check for repeated restarts
- [ ] Review error logs
- [ ] Check SSL certificate expiry

Monthly:
- [ ] Update Docker images
- [ ] Clean up old images/volumes
- [ ] Review and optimize resource limits
- [ ] Test backup/restore procedures
