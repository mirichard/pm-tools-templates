#!/bin/bash

# Generate Weekly Project Update
# Usage: ./generate-weekly-update.sh

# Configuration - Update these paths for your environment
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEMPLATE_PATH="$PROJECT_ROOT/weekly-project-update.md"
OUTPUT_DIR="$PROJECT_ROOT/reports/weekly-updates"
DATE_STAMP=$(date +"%Y-%m-%d")
OUTPUT_FILE="$OUTPUT_DIR/Weekly-Update-$DATE_STAMP.md"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Generate the update by evaluating the date command
eval "cat << EOF
$(cat "$TEMPLATE_PATH")
EOF
" > "$OUTPUT_FILE"

echo "📊 Weekly update generated: $OUTPUT_FILE"
echo "📅 Date: $(date +'%B %d, %Y')"

# Optional: Open the file in default editor
if command -v code &> /dev/null; then
    code "$OUTPUT_FILE"
elif command -v vim &> /dev/null; then
    vim "$OUTPUT_FILE"
else
    echo "💡 Edit the file manually: $OUTPUT_FILE"
fi
