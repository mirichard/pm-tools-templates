#!/bin/bash

# TouchBar Deflicker Script for LaunchAgent
# Created: August 2, 2025
# Purpose: Periodically restart TouchBarServer to prevent flickering

LOG_FILE="/Users/michael/pm-tools-templates/touchbar_deflicker.log"
ERROR_FILE="/Users/michael/pm-tools-templates/touchbar_deflicker.error.log"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Function to log errors
log_error() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - ERROR: $1" >> "$ERROR_FILE"
}

# Start logging
log_message "TouchBar deflicker script started"

# Check if TouchBarServer is running
if pgrep -x "TouchBarServer" > /dev/null; then
    log_message "TouchBarServer is running"
    
    # Get system idle time
    idle_time=$(ioreg -c IOHIDSystem | awk '/HIDIdleTime/ {print $NF; exit}')
    log_message "Current idle time: $idle_time"
    
    # Check if system has been idle for more than 74 seconds (7.4E+10 nanoseconds)
    if [ "$idle_time" -gt 74000000000 ]; then
        log_message "System is idle, restarting TouchBarServer"
        
        # Kill TouchBarServer (will auto-restart)
        if sudo -n pkill TouchBarServer 2>/dev/null; then
            log_message "TouchBarServer killed successfully"
        else
            log_error "Failed to kill TouchBarServer - may need sudo privileges"
            # Try alternative method
            if osascript -e 'do shell script "pkill TouchBarServer" with administrator privileges' 2>/dev/null; then
                log_message "TouchBarServer killed via AppleScript"
            else
                log_error "All methods to kill TouchBarServer failed"
            fi
        fi
        
        # Wait a moment for restart
        sleep 2
        
        # Check if it restarted
        if pgrep -x "TouchBarServer" > /dev/null; then
            log_message "TouchBarServer restarted successfully"
        else
            log_error "TouchBarServer did not restart automatically"
        fi
    else
        log_message "System is active, no action needed"
    fi
else
    log_error "TouchBarServer is not running"
fi

log_message "TouchBar deflicker script completed"
echo "" >> "$LOG_FILE"
