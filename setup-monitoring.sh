#!/bin/bash
# Setup monitoring on production VPS
# Run this once: chmod +x setup-monitoring.sh && ./setup-monitoring.sh

echo "=== Setting up 24/7 Docker Monitoring ==="

# 1. Copy monitoring script to VPS
cp monitor-docker.sh /opt/eximpo/monitor-docker.sh
chmod +x /opt/eximpo/monitor-docker.sh

# 2. Create log directory
mkdir -p /var/log/eximpo
touch /var/log/eximpo-monitor.log
chmod 644 /var/log/eximpo-monitor.log

# 3. Setup cron job (runs every 5 minutes)
CRON_JOB="*/5 * * * * /opt/eximpo/monitor-docker.sh >> /var/log/eximpo-monitor.log 2>&1"
(crontab -l 2>/dev/null | grep -v "monitor-docker.sh"; echo "$CRON_JOB") | crontab -

# 4. Setup systemd service for monitoring (alternative to cron)
cat > /etc/systemd/system/eximpo-monitor.service << 'EOF'
[Unit]
Description=Eximpo Docker Monitor
After=docker.service

[Service]
Type=oneshot
ExecStart=/opt/eximpo/monitor-docker.sh
StandardOutput=append:/var/log/eximpo-monitor.log
StandardError=append:/var/log/eximpo-monitor.log

[Install]
WantedBy=multi-user.target
EOF

# Create timer for the service (runs every 5 minutes)
cat > /etc/systemd/system/eximpo-monitor.timer << 'EOF'
[Unit]
Description=Eximpo Docker Monitor Timer
Requires=eximpo-monitor.service

[Timer]
OnBootSec=5min
OnUnitActiveSec=5min
AccuracySec=1min

[Install]
WantedBy=timers.target
EOF

# 5. Enable and start the timer
systemctl daemon-reload
systemctl enable eximpo-monitor.timer
systemctl start eximpo-monitor.timer

# 6. Setup log rotation
cat > /etc/logrotate.d/eximpo << 'EOF'
/var/log/eximpo-monitor.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
}
EOF

echo ""
echo "✅ Monitoring setup complete!"
echo ""
echo "Monitoring is now running every 5 minutes"
echo "Check status: systemctl status eximpo-monitor.timer"
echo "View logs: tail -f /var/log/eximpo-monitor.log"
echo ""
echo "Manual check: /opt/eximpo/monitor-docker.sh"
