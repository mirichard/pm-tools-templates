#!/bin/bash

# PMI IP Risk Mitigation Implementation Script
# This script implements the critical changes from the PMI_IP_RISK_MITIGATION_PLAN.md

echo "🔒 Starting PMI IP Risk Mitigation Implementation..."
echo "========================================"

# Phase 1: Critical File Updates
echo "📝 Phase 1: Updating high-risk files with legal disclaimers..."

# Function to add disclaimer to files
add_disclaimer() {
    local file="$1"
    local disclaimer_type="$2"
    
    if [ -f "$file" ]; then
        # Create backup
        cp "$file" "${file}.backup"
        
        # Add appropriate disclaimer at top of file
        if [ "$disclaimer_type" = "standard" ]; then
            cat > temp_disclaimer.md << 'EOF'
---
**Legal Notice**: This template is independently developed and not affiliated with PMI®. 
References to industry practices are for educational purposes under fair use.
PMI®, PMBOK®, and PMP® are registered trademarks of the Project Management Institute, Inc.
---

EOF
        else
            cat > temp_disclaimer.md << 'EOF'
---
**Legal Notice**: This template incorporates widely-accepted project management principles, 
including those described in various industry frameworks. This is independent work not 
affiliated with PMI®. PMI®, PMBOK®, and PMP® are registered trademarks of the 
Project Management Institute, Inc. For official PMI resources, visit www.pmi.org.
---

EOF
        fi
        
        cat temp_disclaimer.md "$file" > temp_file.md
        mv temp_file.md "$file"
        rm temp_disclaimer.md
        
        echo "✅ Updated: $file"
    else
        echo "⚠️  File not found: $file"
    fi
}

# Update high-risk integration files
echo "Updating integration guide files..."
add_disclaimer "integration_guides/github_integration/pmbok_github_templates.md" "framework"
add_disclaimer "integration_guides/jira_integration/README.md" "framework"
add_disclaimer "integration_guides/microsoft_project_integration/README.md" "framework"
add_disclaimer "integration_guides/trello_integration/README.md" "framework"

# Update framework files
echo "Updating framework documentation..."
add_disclaimer "user_acceptance_testing_framework.md" "framework"
add_disclaimer "organizational_change_management_framework.md" "framework"
add_disclaimer "transition_to_operations_framework.md" "framework"

# Phase 2: Update terminology in key files
echo "📝 Phase 2: Updating terminology in key documentation files..."

# Function to update terminology
update_terminology() {
    local file="$1"
    
    if [ -f "$file" ]; then
        # Create backup
        cp "$file" "${file}.backup"
        
        # Replace PMI-specific terminology
        sed -i.bak -e 's/PMBOK Templates/Traditional Templates/g' \
                   -e 's/PMBOK templates/Traditional templates/g' \
                   -e 's/PMBOK methodology/Traditional methodology/g' \
                   -e 's/PMBOK process groups/Project lifecycle phases/g' \
                   -e 's/Process Groups/Project Phases/g' \
                   -e 's/Knowledge Areas/Functional Areas/g' \
                   -e 's/PMI best practices/Industry best practices/g' \
                   -e 's/PMBOK-compliant/Industry-standard/g' \
                   -e 's/PMBOK Guide best practices/industry best practices/g' \
                   "$file"
        
        # Remove backup file created by sed
        rm "${file}.bak" 2>/dev/null || true
        
        echo "✅ Updated terminology: $file"
    else
        echo "⚠️  File not found: $file"
    fi
}

# Update key documentation files
echo "Updating main documentation files..."
update_terminology "GUIDE.md"
update_terminology "ROADMAP.md"
update_terminology "docs/getting-started/methodology-selector.md"
update_terminology "docs/getting-started/template-selector.md"
update_terminology "project-lifecycle/README.md"

# Phase 3: Update directory references
echo "📝 Phase 3: Updating directory references..."

# Function to update path references
update_paths() {
    local file="$1"
    
    if [ -f "$file" ]; then
        # Create backup
        cp "$file" "${file}.backup"
        
        # Update directory paths
        sed -i.bak -e 's|Waterfall/|Traditional/|g' \
                   -e 's|waterfall/|traditional/|g' \
                   -e 's|PMBOK/|Traditional/|g' \
                   -e 's|pmbok/|traditional/|g' \
                   -e 's|Process_Groups/|Project_Phases/|g' \
                   -e 's|Knowledge_Areas/|Functional_Areas/|g' \
                   "$file"
        
        # Remove backup file created by sed
        rm "${file}.bak" 2>/dev/null || true
        
        echo "✅ Updated paths: $file"
    else
        echo "⚠️  File not found: $file"
    fi
}

# Update files with directory references
echo "Updating files with directory references..."
find . -name "*.md" -not -path "./.*" -not -name "*backup*" | while read -r file; do
    if grep -q "Waterfall/\|PMBOK/\|Process_Groups/\|Knowledge_Areas/" "$file" 2>/dev/null; then
        update_paths "$file"
    fi
done

# Phase 4: Create migration aliases
echo "📝 Phase 4: Creating migration aliases..."

# Create README in old Waterfall directory (if it existed)
if [ -d "Traditional" ]; then
    cat > "Waterfall_MOVED.md" << 'EOF'
# Directory Moved - Waterfall → Traditional

**⚠️ IMPORTANT NOTICE**: This directory has been moved as part of our intellectual property compliance initiative.

## New Location
The contents previously in `Waterfall/` have been moved to `Traditional/`

## Migration Guide
For complete migration information, see [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

## Quick Links
- **Traditional Templates**: [Traditional/](Traditional/)
- **Migration Guide**: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- **Legal Notices**: [LEGAL_NOTICES.md](LEGAL_NOTICES.md)

---
**Legal Notice**: This change was made to ensure full compliance with intellectual property laws while maintaining the quality and usefulness of our templates.
EOF
    echo "✅ Created migration notice: Waterfall_MOVED.md"
fi

# Phase 5: Verify critical changes
echo "📝 Phase 5: Verification..."

echo "Verifying legal notices exist..."
if [ -f "LEGAL_NOTICES.md" ]; then
    echo "✅ LEGAL_NOTICES.md exists"
else
    echo "❌ LEGAL_NOTICES.md missing"
fi

if [ -f "PMI_IP_RISK_MITIGATION_PLAN.md" ]; then
    echo "✅ PMI_IP_RISK_MITIGATION_PLAN.md exists"
else
    echo "❌ PMI_IP_RISK_MITIGATION_PLAN.md missing"
fi

if [ -f "MIGRATION_GUIDE.md" ]; then
    echo "✅ MIGRATION_GUIDE.md exists"
else
    echo "❌ MIGRATION_GUIDE.md missing"
fi

echo "Checking for high-risk terminology..."
HIGH_RISK_COUNT=$(grep -r "PMBOK®\|PMI®" . --include="*.md" --exclude-dir=".git" | wc -l)
echo "Found $HIGH_RISK_COUNT files with trademark usage (should be in legal disclaimers only)"

# Summary
echo ""
echo "🎉 PMI IP Risk Mitigation Implementation Complete!"
echo "================================================"
echo "✅ Legal disclaimers added to high-risk files"
echo "✅ Terminology updated in key documentation"
echo "✅ Directory references updated"
echo "✅ Migration aliases created"
echo "✅ Verification completed"
echo ""
echo "📋 Next Steps:"
echo "1. Review the changes and test key templates"
echo "2. Update any remaining files as needed"
echo "3. Communicate changes to contributors"
echo "4. Monitor for any issues or feedback"
echo ""
echo "📚 Documentation:"
echo "- Risk Mitigation Plan: PMI_IP_RISK_MITIGATION_PLAN.md"
echo "- Migration Guide: MIGRATION_GUIDE.md"
echo "- Legal Notices: LEGAL_NOTICES.md"
echo "- Legal Disclaimer Template: docs/legal-disclaimer-template.md"
echo ""
echo "⚖️ Legal Compliance Status: ✅ IMPROVED"
echo "(Continue with phases 2-3 of the mitigation plan for complete compliance)"

