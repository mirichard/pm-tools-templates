#!/bin/bash

# fix-governance-links.sh
# Fix specific governance link issues

set -e

echo "🔧 Fixing governance link issues..."

GOVERNANCE_README="./role-based-toolkits/project-manager/governance-tools/README.md"

# Fix decision-log link to point to essential-templates
if [ -f "$GOVERNANCE_README" ]; then
    echo "1. Fixing decision-log.md link..."
    sed -i.bak 's|decision-log\.md|../essential-templates/decision-log.md|g' "$GOVERNANCE_README"
    
    echo "2. Fixing change-request-template.md link..."
    sed -i.bak2 's|change-request-template\.md|../essential-templates/change-request.md|g' "$GOVERNANCE_README"
    
    echo "✅ Link fixes applied to governance-tools/README.md"
    echo "   Backup files created: README.md.bak, README.md.bak2"
else
    echo "❌ Could not find governance README file"
fi

echo "🎯 To verify fixes, run: ./analyze-all-links.sh"
