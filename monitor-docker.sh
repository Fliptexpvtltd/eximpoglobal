#!/bin/bash
# 24/7 Docker Container Monitoring Script
# Place this on VPS at: /opt/eximpo/monitor-docker.sh

COMPOSE_FILE="/opt/eximpo/docker-compose.production.yml"
LOG_FILE="/var/log/eximpo-monitor.log"
EMAIL="your-email@example.com"  # Change this

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to send alert (requires mail command or curl for webhooks)
send_alert() {
    local message=$1
    log_message "ALERT: $message"
    
    # Option 1: Email alert (requires mailutils)
    # echo "$message" | mail -s "Eximpo Docker Alert" "$EMAIL"
    
    # Option 2: Slack webhook (uncomment and add your webhook URL)
    # curl -X POST -H 'Content-type: application/json' \
    #   --data "{\"text\":\"$message\"}" \
    #   https://hooks.slack.com/services/YOUR/WEBHOOK/URL
}

# Check if container is running
check_container() {
    local container_name=$1
    local port=$2
    
    if ! docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
        log_message "Container $container_name is not running!"
        send_alert "Container $container_name is DOWN on app.eximpoglobal.net"
        
        # Try to restart
        cd /opt/eximpo
        docker-compose -f "$COMPOSE_FILE" up -d "$container_name"
        sleep 10
        
        if docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
            log_message "Successfully restarted $container_name"
            send_alert "Container $container_name has been restarted"
        else
            log_message "Failed to restart $container_name"
            send_alert "CRITICAL: Failed to restart $container_name"
        fi
        return 1
    fi
    
    # Check if port is responding
    if [ -n "$port" ]; then
        if ! curl -sf -m 5 "http://127.0.0.1:${port}/health" > /dev/null 2>&1 && \
           ! curl -sf -m 5 "http://127.0.0.1:${port}" > /dev/null 2>&1; then
            log_message "Container $container_name is running but not responding on port $port"
            send_alert "Container $container_name is unresponsive on app.eximpoglobal.net"
            
            # Restart unresponsive container
            cd /opt/eximpo
            docker-compose -f "$COMPOSE_FILE" restart "$container_name"
            log_message "Restarted unresponsive container $container_name"
            return 1
        fi
    fi
    
    return 0
}

# Main monitoring loop
log_message "Starting Docker monitoring..."

# Check all containers
check_container "eximpo-backend-prod" "5000"
check_container "eximpo-frontend-prod" "3000"
check_container "eximpo-admin-prod" "3001"

# Check disk space
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 85 ]; then
    log_message "Disk usage is at ${DISK_USAGE}%"
    send_alert "WARNING: Disk usage is at ${DISK_USAGE}% on app.eximpoglobal.net"
fi

# Check memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
if [ "$MEMORY_USAGE" -gt 90 ]; then
    log_message "Memory usage is at ${MEMORY_USAGE}%"
    send_alert "WARNING: Memory usage is at ${MEMORY_USAGE}% on app.eximpoglobal.net"
fi

# Check if nginx is running
if ! systemctl is-active --quiet nginx; then
    log_message "Nginx is not running!"
    send_alert "CRITICAL: Nginx is DOWN on app.eximpoglobal.net"
    systemctl start nginx
fi

log_message "Monitoring check completed"
