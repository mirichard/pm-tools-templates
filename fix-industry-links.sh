#!/bin/bash

# fix-industry-links.sh
# Fix industry specialization link issues

set -e

echo "🔧 Fixing industry specialization link issues..."

HEALTHCARE_README="./industry-specializations/healthcare-pharmaceutical/README.md"
IT_README="./industry-specializations/information-technology/README.md"

echo "📋 Applying quick wins - linking to existing files..."

# Fix healthcare lifecycle link
if [ -f "$HEALTHCARE_README" ]; then
    echo "1. Fixing healthcare_product_lifecycle.md link..."
    sed -i.bak 's|lifecycle/healthcare_product_lifecycle\.md|lifecycle/healthcare_product_lifecycle_plan.md|g' "$HEALTHCARE_README"
    echo "   ✅ Healthcare lifecycle link updated"
else
    echo "   ❌ Healthcare README not found"
fi

# Fix IT links to existing files
if [ -f "$IT_README" ]; then
    echo "2. Fixing IT change_management_plan.md link..."
    sed -i.bak 's|digital-transformation/change_management_plan\.md|governance/change_management_plan.md|g' "$IT_README"
    
    echo "3. Fixing IT transformation_strategy_template.md link..."
    sed -i.bak2 's|digital-transformation/transformation_strategy_template\.md|digital-transformation/digital_transformation_strategy_template.md|g' "$IT_README"
    
    echo "4. Fixing release_management_template.md link..."
    sed -i.bak3 's|software-development/release_management_template\.md|../../methodology-frameworks/emerging-methods/devops/release_management_template.md|g' "$IT_README"
    
    echo "   ✅ IT links updated - 3 fixes applied"
    echo "   Backup files created: README.md.bak, README.md.bak2, README.md.bak3"
else
    echo "   ❌ IT README not found"
fi

echo "🎯 Summary of fixes applied:"
echo "   Healthcare: 1 link fixed"
echo "   IT: 3 links fixed"
echo "   Total: 4 broken links resolved"
echo "   Remaining: 16 IT templates + 2 healthcare templates need creation"
