#!/bin/bash

# fix-stakeholder-links.sh
# Fix stakeholder engagement link issues

set -e

echo "🔧 Fixing stakeholder engagement link issues..."

STAKEHOLDER_README="./role-based-toolkits/project-manager/stakeholder-engagement/README.md"

# Fix executive-summary link to point to project-assessment-suite
if [ -f "$STAKEHOLDER_README" ]; then
    echo "1. Fixing executive-summary.md link..."
    sed -i.bak 's|executive-summary\.md|../../project-assessment-suite/executive-summary-template.md|g' "$STAKEHOLDER_README"
    
    echo "2. Potential link to meeting-templates in essential-templates..."
    # meeting-agendas.md could potentially link to ../essential-templates/meeting-templates.md
    
    echo "✅ Executive summary link fixed"
    echo "   Backup file created: README.md.bak"
else
    echo "❌ Could not find stakeholder README file"
fi

echo "🎯 Remaining links need manual review or file creation"
echo "   15 stakeholder templates still need to be created or linked"
