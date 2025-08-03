#!/bin/bash

echo "=== TouchBar Deflicker Diagnostic Script ==="
echo "Date: $(date)"
echo ""

echo "1. Checking if TouchBarServer is running:"
ps aux | grep TouchBarServer | grep -v grep
echo ""

echo "2. Checking HID idle time:"
idle_time=$(ioreg -c IOHIDSystem | awk '/HIDIdleTime/ {print $NF; exit}')
echo "Current idle time: $idle_time"
echo "Threshold is: 7.4E+10 (74000000000)"
echo ""

echo "3. Checking current user:"
echo "Current user: $(whoami)"
echo "User from script: Michael"
echo ""

echo "4. Testing TouchBarServer kill command (requires sudo):"
echo "This would normally run: pkill TouchBarServer"
echo "Note: Script is hardcoded for user 'Michael' but current user is '$(whoami)'"
echo ""

echo "5. Checking app permissions:"
echo "TCC permissions for touchbar-deflicker:"
sudo sqlite3 /Library/Application\ Support/com.apple.TCC/TCC.db "SELECT service, client, auth_value FROM access WHERE client LIKE '%touchbar%';" 2>/dev/null
echo ""

echo "6. Checking if app is currently running:"
ps aux | grep touchbar_deflicker | grep -v grep
echo ""

echo "=== Analysis ==="
if [ "$idle_time" -gt 74000000000 ]; then
    echo "Computer appears to be idle (idle time > threshold)"
else
    echo "Computer appears to be active (idle time < threshold)"
fi

echo ""
echo "Potential issues identified:"
echo "- Script is hardcoded for username 'Michael' but current user is '$(whoami)'"
echo "- App may need additional permissions (currently denied for SystemPolicyAllFiles)"
echo "- Password is hardcoded in the script (security risk)"
