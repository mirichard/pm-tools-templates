#!/bin/bash

# reconcile-reporting-links.sh
# Analyze reporting-dashboards broken links and find existing files

set -e

echo "🔍 REPORTING DASHBOARDS RECONCILIATION"
echo "====================================="
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "📊 Step 1: Analyzing reporting-dashboards directory..."

REPORTING_DIR="./role-based-toolkits/project-manager/reporting-dashboards"
ESSENTIAL_DIR="./role-based-toolkits/project-manager/essential-templates"

# Check what files exist
echo "Files in reporting-dashboards:"
ls -la "$REPORTING_DIR"/*.md 2>/dev/null | grep -v "README.md" || echo "  Only README.md exists"

echo
echo "📁 Step 2: Finding dashboard and report files across repository..."

# Search for dashboard-related files
echo "Searching for dashboard files:"
find . -name "*dashboard*" -type f -name "*.md" | grep -v ".git" | head -10

echo
echo "Searching for report files:"
find . -name "*report*" -type f -name "*.md" | grep -v ".git" | head -10

echo
echo "Searching for executive files:"
find . -name "*executive*" -type f -name "*.md" | grep -v ".git" | head -10

echo
echo "Searching for status files:"
find . -name "*status*" -type f -name "*.md" | grep -v ".git" | head -10

echo
echo "🔍 Step 3: Analyzing specific broken links from reporting README..."

# Key broken links from reporting-dashboards README
declare -a BROKEN_REPORTING_LINKS=(
    "executive-status-report.md"
    "portfolio-dashboard.md"
    "steering-committee-report.md"
    "sprint-report.md"
    "milestone-dashboard.md"
    "deliverable-report.md"
    "budget-dashboard.md"
    "cost-performance.md"
    "resource-utilization.md"
    "financial-forecast.md"
    "risk-dashboard.md"
    "issue-tracking.md"
    "quality-dashboard.md"
    "compliance-report.md"
    "stakeholder-update.md"
    "project-newsletter.md"
    "change-impact-report.md"
    "lessons-learned-dashboard.md"
)

echo "🎯 Step 4: Checking for potential matches..."

EXACT_MATCHES=0
SIMILAR_MATCHES=0
NO_MATCHES=0

for broken_file in "${BROKEN_REPORTING_LINKS[@]}"; do
    echo -n "Checking $broken_file: "
    
    # Remove .md extension for broader searching
    base_name=$(echo "$broken_file" | sed 's/\.md$//')
    
    # Look for exact matches
    exact_match=$(find . -name "$broken_file" -type f | grep -v ".git" | head -1)
    
    if [ -n "$exact_match" ]; then
        echo -e "${GREEN}EXACT MATCH: $exact_match${NC}"
        ((EXACT_MATCHES++))
    else
        # Look for similar matches
        similar_matches=$(find . -name "*${base_name}*" -type f -name "*.md" | grep -v ".git" | head -3)
        
        if [ -n "$similar_matches" ]; then
            echo -e "${YELLOW}SIMILAR MATCHES:${NC}"
            echo "$similar_matches" | sed 's/^/    /'
            ((SIMILAR_MATCHES++))
        else
            echo -e "${RED}NO MATCHES${NC}"
            ((NO_MATCHES++))
        fi
    fi
done

echo
echo "📋 Step 5: Checking essential-templates for reporting files..."

# Check if essential-templates has any reporting-related files
echo "Reporting-related files in essential-templates:"
ls -la "$ESSENTIAL_DIR" | grep -E "(status|report|dashboard|performance)" || echo "  No obvious reporting files found"

echo
echo "🎯 Step 6: Summary and recommendations..."

echo -e "${BLUE}REPORTING RECONCILIATION SUMMARY:${NC}"
echo "- Exact matches found: $EXACT_MATCHES"
echo "- Similar matches found: $SIMILAR_MATCHES"  
echo "- No matches found: $NO_MATCHES"

echo
echo -e "${GREEN}HIGH PRIORITY FIXES (if any exact matches found):${NC}"
if [ $EXACT_MATCHES -gt 0 ]; then
    echo "Found exact matches that can be linked with relative path updates"
else
    echo "No exact matches found - files need to be created or matched manually"
fi

echo
echo -e "${YELLOW}POTENTIAL LINK FIXES (based on similar matches):${NC}"
echo "Review similar matches above to determine if any can be linked"

echo
echo "🔧 Step 7: Generate reporting fix script..."

cat > fix-reporting-links.sh << 'EOF'
#!/bin/bash

# fix-reporting-links.sh
# Fix reporting dashboard link issues

set -e

echo "🔧 Fixing reporting dashboard link issues..."

REPORTING_README="./role-based-toolkits/project-manager/reporting-dashboards/README.md"

# Check if status-report exists in essential-templates
if [ -f "./role-based-toolkits/project-manager/essential-templates/status-report.md" ]; then
    echo "1. Checking for status-report link fixes..."
    # This would be updated based on findings
    echo "   Status report found in essential-templates"
fi

# Check if performance-dashboard exists in essential-templates  
if [ -f "./role-based-toolkits/project-manager/essential-templates/performance-dashboard.md" ]; then
    echo "2. Checking for performance-dashboard link fixes..."
    echo "   Performance dashboard found in essential-templates"
fi

echo "🎯 Manual review needed for other reporting template links"
echo "   Run reconcile-reporting-links.sh for detailed analysis"
EOF

chmod +x fix-reporting-links.sh

echo -e "${GREEN}✅ Created fix-reporting-links.sh script${NC}"

echo
echo "🎯 NEXT STEPS:"
echo "1. Review the similar matches above"
echo "2. Identify which files can be linked vs. need to be created"
echo "3. Run './fix-reporting-links.sh' for any automated fixes"
echo "4. Move to stakeholder-engagement analysis"
