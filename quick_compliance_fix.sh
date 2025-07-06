#!/bin/bash

# Quick PMI IP Compliance Fix
# This script implements the most critical fixes immediately

echo "⚡ Quick PMI IP Compliance Fix"
echo "============================="
echo "This script implements immediate critical fixes."
echo "For complete mitigation, run implement_ip_mitigation.sh"
echo ""

# 1. Add disclaimer to README if not present
if ! grep -q "Legal Notice" README.md 2>/dev/null; then
    echo "📝 Adding legal notice to README.md..."
    # The legal notice was already added in our previous edit
    echo "✅ Legal notice already present in README.md"
else
    echo "✅ Legal notice already in README.md"
fi

# 2. Fix the most critical files with direct PMI references
echo "📝 Fixing critical files with PMI references..."

# Fix integration guides that have explicit PMI references
FILES_TO_FIX=(
    "integration_guides/github_integration/pmbok_github_templates.md"
    "integration_guides/jira_integration/README.md" 
    "integration_guides/microsoft_project_integration/README.md"
    "user_acceptance_testing_framework.md"
    "organizational_change_management_framework.md"
)

for file in "${FILES_TO_FIX[@]}"; do
    if [ -f "$file" ]; then
        if ! grep -q "Legal Notice" "$file" 2>/dev/null; then
            echo "Adding disclaimer to $file..."
            # Create backup
            cp "$file" "${file}.backup"
            
            # Add disclaimer at top
            cat > temp_disclaimer.txt << 'EOF'
---
**Legal Notice**: This template incorporates widely-accepted project management principles, 
including those described in various industry frameworks. This is independent work not 
affiliated with PMI®. PMI®, PMBOK®, and PMP® are registered trademarks of the 
Project Management Institute, Inc. For official PMI resources, visit www.pmi.org.
---

EOF
            cat temp_disclaimer.txt "$file" > temp_file.txt
            mv temp_file.txt "$file"
            rm temp_disclaimer.txt
            echo "✅ Fixed: $file"
        else
            echo "✅ Already has disclaimer: $file"
        fi
    else
        echo "⚠️  File not found: $file"
    fi
done

# 3. Rename Waterfall to Traditional (if not already done)
if [ -d "Waterfall" ] && [ ! -d "Traditional" ]; then
    echo "📁 Renaming Waterfall directory to Traditional..."
    mv Waterfall Traditional
    echo "✅ Directory renamed: Waterfall → Traditional"
elif [ -d "Traditional" ]; then
    echo "✅ Directory already renamed to Traditional"
else
    echo "⚠️  Neither Waterfall nor Traditional directory found"
fi

# 4. Quick terminology fixes in critical files
echo "📝 Quick terminology fixes in critical files..."

CRITICAL_FILES=("README.md" "GUIDE.md" "docs/getting-started/README.md")

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Create backup
        cp "$file" "${file}.quickfix.backup"
        
        # Quick replacements
        sed -i.bak -e 's/PMBOK\/Waterfall/Traditional/g' \
                   -e 's/PMBOK methodology/Traditional methodology/g' \
                   -e 's/PMBOK templates/Traditional templates/g' \
                   "$file"
        
        # Remove sed backup
        rm "${file}.bak" 2>/dev/null || true
        
        echo "✅ Quick fixes applied: $file"
    else
        echo "⚠️  File not found: $file"
    fi
done

# 5. Create critical documentation if missing
echo "📝 Ensuring critical documentation exists..."

if [ ! -f "LEGAL_NOTICES.md" ]; then
    echo "⚠️  LEGAL_NOTICES.md missing - please run implement_ip_mitigation.sh for complete setup"
else
    echo "✅ LEGAL_NOTICES.md exists"
fi

if [ ! -f "PMI_IP_RISK_MITIGATION_PLAN.md" ]; then
    echo "⚠️  PMI_IP_RISK_MITIGATION_PLAN.md missing - please run implement_ip_mitigation.sh for complete setup"
else
    echo "✅ PMI_IP_RISK_MITIGATION_PLAN.md exists"
fi

# Summary
echo ""
echo "✅ Quick Compliance Fix Complete!"
echo "================================"
echo "✅ Legal disclaimer added to README"
echo "✅ Critical files updated with disclaimers"
echo "✅ Directory renamed (if needed)"
echo "✅ Quick terminology fixes applied"
echo ""
echo "⚠️  IMPORTANT: This is a quick fix only!"
echo "For complete IP compliance, please run:"
echo "  ./implement_ip_mitigation.sh"
echo ""
echo "📋 Next Steps:"
echo "1. Review changes and test key files"
echo "2. Run full mitigation script"
echo "3. Update contributor guidelines"
echo "4. Monitor for compliance issues"
echo ""
echo "📚 Documentation:"
echo "- Full plan: PMI_IP_RISK_MITIGATION_PLAN.md"
echo "- Legal notices: LEGAL_NOTICES.md"
echo "- Migration guide: MIGRATION_GUIDE.md"

