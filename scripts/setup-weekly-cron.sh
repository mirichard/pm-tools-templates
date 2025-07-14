#!/bin/bash

# Setup Weekly Project Update Cron Job
# Runs every Monday at 7:00 AM Eastern

# Get the absolute path to the generation script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT_PATH="$SCRIPT_DIR/generate-weekly-update.sh"
CRON_ENTRY="0 7 * * 1 $SCRIPT_PATH"

echo "Setting up weekly project update automation..."
echo "Schedule: Every Monday at 7:00 AM Eastern"
echo "Script: $SCRIPT_PATH"

# Add to crontab
(crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -

echo "✅ Cron job installed successfully!"
echo ""
echo "To verify the installation:"
echo "  crontab -l"
echo ""
echo "To remove the job later:"
echo "  crontab -e  # and delete the line"
echo ""
echo "Note: Make sure your system timezone is set to Eastern for 7AM Eastern execution"
