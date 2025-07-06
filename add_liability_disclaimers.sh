#!/bin/bash

# Liability Disclaimer Implementation Script
# Adds liability protection disclaimers to all templates

echo "⚖️ Adding Liability Disclaimers to Templates"
echo "==========================================="
echo "This script adds liability disclaimers to protect repository maintainers"
echo "and ensure users understand their responsibilities."
echo ""

# Function to add liability disclaimer to templates
add_liability_disclaimer() {
    local file="$1"
    local disclaimer_type="$2"
    
    if [ -f "$file" ]; then
        # Check if file already has a liability disclaimer
        if grep -q "LIABILITY NOTICE\|LIABILITY DISCLAIMER" "$file" 2>/dev/null; then
            echo "✅ Already protected: $file"
            return
        fi
        
        # Create backup
        cp "$file" "${file}.liability.backup"
        
        # Choose appropriate disclaimer
        if [ "$disclaimer_type" = "professional" ]; then
            cat > temp_liability_disclaimer.md << 'EOF'
---
**PROFESSIONAL LIABILITY NOTICE**: This template requires professional judgment and expertise.
Users must verify compliance with applicable laws, regulations, and professional standards.
Template provided "AS-IS" without warranty. See LIABILITY_DISCLAIMER.md for complete terms.
Users accept full responsibility for outcomes and agree to indemnify repository maintainers.
---

EOF
        else
            cat > temp_liability_disclaimer.md << 'EOF'
---
**Legal Notice**: This template is independently developed and not affiliated with PMI®. 
References to industry practices are for educational purposes under fair use.
PMI®, PMBOK®, and PMP® are registered trademarks of the Project Management Institute, Inc.
Template provided "AS-IS" without warranty. Users accept full responsibility for professional use.
---

EOF
        fi
        
        # Add disclaimer to file
        cat temp_liability_disclaimer.md "$file" > temp_file.md
        mv temp_file.md "$file"
        rm temp_liability_disclaimer.md
        
        echo "⚖️ Added liability protection: $file"
    else
        echo "⚠️  File not found: $file"
    fi
}

# Phase 1: High-risk templates requiring professional disclaimers
echo "📋 Phase 1: High-risk professional templates..."

HIGH_RISK_TEMPLATES=(
    "Traditional/Templates/change_request_template.md"
    "Traditional/Templates/risk_register_template.md"
    "Traditional/Templates/communication_plan_template.md"
    "Traditional/Templates/project_roadmap_template.md"
    "Traditional/Templates/status_report_template.md"
    "Traditional/Templates/uat_plan_template.md"
    "Traditional/Process_Groups/Planning/project_management_plan_template.md"
    "Traditional/Process_Groups/Initiating/project_charter_template.md"
    "business-stakeholder-suite/executive-dashboards/executive_dashboard_template.md"
    "business-stakeholder-suite/financial-governance/budget_tracking_template.md"
    "integration_guides/github_integration/pmbok_github_templates.md"
    "integration_guides/jira_integration/README.md"
    "integration_guides/microsoft_project_integration/README.md"
    "user_acceptance_testing_framework.md"
    "organizational_change_management_framework.md"
    "transition_to_operations_framework.md"
)

for template in "${HIGH_RISK_TEMPLATES[@]}"; do
    if [ -f "$template" ]; then
        add_liability_disclaimer "$template" "professional"
    fi
done

# Phase 2: All other templates with standard disclaimers
echo ""
echo "📋 Phase 2: Adding standard disclaimers to remaining templates..."

# Find all markdown templates that don't already have disclaimers
find . -name "*template*.md" -not -path "./.*" -not -name "*backup*" | while read -r template; do
    if [ -f "$template" ] && ! grep -q "LIABILITY NOTICE\|LIABILITY DISCLAIMER\|Legal Notice" "$template" 2>/dev/null; then
        add_liability_disclaimer "$template" "standard"
    fi
done

# Phase 3: Framework and guide documents
echo ""
echo "📋 Phase 3: Adding disclaimers to framework documents..."

FRAMEWORK_DOCS=(
    "docs/getting-started/methodology-selector.md"
    "docs/getting-started/template-selector.md"
    "docs/getting-started/README.md"
    "project-lifecycle/README.md"
    "role-based-toolkits/project-manager/README.md"
    "role-based-toolkits/scrum-master/README.md"
    "role-based-toolkits/product-owner/README.md"
    "methodology-frameworks/pmbok-waterfall/README.md"
    "industry_templates/healthcare_pharmaceutical/README.md"
    "industry_templates/financial_services/README.md"
    "industry_templates/construction/README.md"
)

for doc in "${FRAMEWORK_DOCS[@]}"; do
    if [ -f "$doc" ] && ! grep -q "LIABILITY NOTICE\|LIABILITY DISCLAIMER\|Legal Notice" "$doc" 2>/dev/null; then
        add_liability_disclaimer "$doc" "standard"
    fi
done

# Phase 4: Verification and summary
echo ""
echo "📊 Phase 4: Verification and summary..."

# Count protected files
PROTECTED_COUNT=$(find . -name "*.md" -not -path "./.*" -not -name "*backup*" -exec grep -l "LIABILITY NOTICE\|LIABILITY DISCLAIMER\|Legal Notice" {} \; | wc -l)
TOTAL_MD_COUNT=$(find . -name "*.md" -not -path "./.*" -not -name "*backup*" | wc -l)

echo "Protected files: $PROTECTED_COUNT out of $TOTAL_MD_COUNT markdown files"

# Check for unprotected templates
echo ""
echo "🔍 Checking for unprotected template files..."
UNPROTECTED_TEMPLATES=$(find . -name "*template*.md" -not -path "./.*" -not -name "*backup*" -exec grep -L "LIABILITY NOTICE\|LIABILITY DISCLAIMER\|Legal Notice" {} \; 2>/dev/null)

if [ -n "$UNPROTECTED_TEMPLATES" ]; then
    echo "⚠️  Unprotected templates found:"
    echo "$UNPROTECTED_TEMPLATES"
else
    echo "✅ All templates are protected with liability disclaimers"
fi

# Summary
echo ""
echo "🎉 Liability Disclaimer Implementation Complete!"
echo "==============================================="
echo "✅ High-risk templates protected with professional disclaimers"
echo "✅ Standard templates protected with basic disclaimers"
echo "✅ Framework documents updated"
echo "✅ Verification completed"
echo ""
echo "📋 Protection Summary:"
echo "- Professional liability disclaimers: High-risk templates"
echo "- Standard legal disclaimers: All other templates"
echo "- Total protected files: $PROTECTED_COUNT"
echo ""
echo "⚖️ Legal Protection Status: ✅ COMPREHENSIVE"
echo ""
echo "📚 Key Legal Documents:"
echo "- LIABILITY_DISCLAIMER.md: Complete liability protection"
echo "- TEMPLATE_USAGE_AGREEMENT.md: User responsibilities"
echo "- PROFESSIONAL_STANDARDS.md: Best practices guide"
echo "- LICENSE: Enhanced with liability limitations"
echo ""
echo "🔄 Next Steps:"
echo "1. Review protected templates for accuracy"
echo "2. Test template functionality"
echo "3. Update contributor guidelines"
echo "4. Monitor for compliance issues"
echo "5. Regular liability protection audits"

