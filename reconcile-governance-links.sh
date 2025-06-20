#!/bin/bash

# reconcile-governance-links.sh
# Direct analysis of governance-related broken links and existing files

set -e

echo "🔍 GOVERNANCE LINKS RECONCILIATION"
echo "=================================="
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "📊 Step 1: Analyzing governance-tools directory..."

GOVERNANCE_DIR="./role-based-toolkits/project-manager/governance-tools"
ESSENTIAL_DIR="./role-based-toolkits/project-manager/essential-templates"

# Check what files exist
echo "Files in governance-tools:"
ls -la "$GOVERNANCE_DIR"/*.md 2>/dev/null | grep -v "README.md" || echo "  Only README.md exists"

echo
echo "Files in essential-templates:"
ls -la "$ESSENTIAL_DIR"/*.md 2>/dev/null || echo "  No markdown files found"

echo
echo "🔍 Step 2: Key broken links analysis..."

# Analyze specific broken governance links from the README
declare -A BROKEN_LINKS=(
    ["decision-log.md"]="governance-tools"
    ["change-request-template.md"]="governance-tools"
    ["decision-authority.md"]="governance-tools"
    ["governance-roles.md"]="governance-tools"
    ["quality-gates.md"]="governance-tools"
    ["escalation-matrix.md"]="governance-tools"
    ["compliance-checklist.md"]="governance-tools"
)

declare -A EXISTING_FILES=(
    ["decision-log.md"]=""
    ["change-request.md"]=""
    ["governance-charter.md"]=""
    ["governance-framework.md"]=""
)

echo "📁 Step 3: Finding existing files..."

# Search for files across the repository
echo "Searching for governance-related files..."
for filename in decision-log change-request governance decision authority quality escalation compliance; do
    echo -n "  $filename: "
    matches=$(find . -name "*${filename}*.md" -type f | grep -v ".git" | head -3)
    if [ -n "$matches" ]; then
        echo -e "${GREEN}FOUND${NC}"
        echo "$matches" | sed 's/^/    /'
    else
        echo -e "${RED}NOT FOUND${NC}"
    fi
done

echo
echo "🎯 Step 4: Specific reconciliation recommendations..."

# Check if decision-log exists in essential-templates
if [ -f "$ESSENTIAL_DIR/decision-log.md" ]; then
    echo -e "${GREEN}✅ decision-log.md exists in essential-templates${NC}"
    echo "   RECOMMENDATION: Update governance-tools/README.md to link to:"
    echo "   ../essential-templates/decision-log.md"
else
    echo -e "${RED}❌ decision-log.md not found${NC}"
fi

# Check if change-request exists in essential-templates
if [ -f "$ESSENTIAL_DIR/change-request.md" ]; then
    echo -e "${GREEN}✅ change-request.md exists in essential-templates${NC}"
    echo "   RECOMMENDATION: Update governance-tools/README.md to link to:"
    echo "   ../essential-templates/change-request.md"
else
    echo -e "${RED}❌ change-request.md not found${NC}"
fi

# Check governance files
if [ -f "$GOVERNANCE_DIR/governance-charter.md" ]; then
    echo -e "${GREEN}✅ governance-charter.md exists in governance-tools${NC}"
else
    echo -e "${RED}❌ governance-charter.md missing${NC}"
fi

if [ -f "$GOVERNANCE_DIR/governance-framework.md" ]; then
    echo -e "${GREEN}✅ governance-framework.md exists in governance-tools${NC}"
else
    echo -e "${RED}❌ governance-framework.md missing${NC}"
fi

echo
echo "📋 Step 5: Priority fix recommendations..."

echo -e "${BLUE}HIGH PRIORITY FIXES (files exist, just need link updates):${NC}"
echo "1. decision-log.md: Link should point to ../essential-templates/decision-log.md"
echo "2. change-request-template.md: Link should point to ../essential-templates/change-request.md"

echo
echo -e "${YELLOW}MEDIUM PRIORITY (files need to be created):${NC}"
echo "1. decision-authority.md"
echo "2. governance-roles.md"
echo "3. quality-gates.md"
echo "4. escalation-matrix.md"
echo "5. compliance-checklist.md"

echo
echo "🔧 Step 6: Generate specific fix commands..."

cat > fix-governance-links.sh << 'EOF'
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
EOF

chmod +x fix-governance-links.sh

echo -e "${GREEN}✅ Created fix-governance-links.sh script${NC}"

echo
echo "🎯 NEXT STEPS:"
echo "1. Run './fix-governance-links.sh' to apply priority fixes"
echo "2. Run './analyze-all-links.sh' to verify the fixes"
echo "3. Create missing template files for medium priority items"
echo "4. Continue with other toolkit directories"
