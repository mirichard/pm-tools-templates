#!/bin/bash

# fix-reporting-links.sh
# Fix reporting dashboard link issues

set -e

echo "🔧 Fixing reporting dashboard link issues..."

REPORTING_README="./role-based-toolkits/project-manager/reporting-dashboards/README.md"

# Fix budget-dashboard link to point to business-stakeholder-suite
if [ -f "$REPORTING_README" ]; then
    echo "1. Fixing budget-dashboard.md link..."
    sed -i.bak 's|budget-dashboard\.md|../../business-stakeholder-suite/financial-governance/budget-dashboard-template.md|g' "$REPORTING_README"
    
    echo "2. Check if we should link executive-dashboard to existing file..."
    # executive-dashboard.md already exists in this directory
    
    echo "3. Check if we should link team-dashboard to existing file..."
    # team-dashboard.md already exists in this directory
    
    echo "✅ Budget dashboard link fixed"
    echo "   Backup file created: README.md.bak"
else
    echo "❌ Could not find reporting README file"
fi

echo "🎯 Remaining links need manual review or file creation"
echo "   17 templates still need to be created or linked"
