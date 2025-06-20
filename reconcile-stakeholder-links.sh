#!/bin/bash

# reconcile-stakeholder-links.sh
# Analyze stakeholder-engagement broken links and find existing files

set -e

echo "🔍 STAKEHOLDER ENGAGEMENT RECONCILIATION"
echo "========================================"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "📊 Step 1: Analyzing stakeholder-engagement directory..."

ENGAGEMENT_DIR="./role-based-toolkits/project-manager/stakeholder-engagement"
ESSENTIAL_DIR="./role-based-toolkits/project-manager/essential-templates"

# Check what files exist
echo "Files in stakeholder-engagement:"
ls -la "$ENGAGEMENT_DIR"/*.md 2>/dev/null | grep -v "README.md" || echo "  Only README.md exists"

echo
echo "📁 Step 2: Finding stakeholder and engagement files across repository..."

# Search for stakeholder-related files
echo "Searching for stakeholder files:"
find . -name "*stakeholder*" -type f -name "*.md" | grep -v ".git" | head -10

echo
echo "Searching for engagement files:"
find . -name "*engagement*" -type f -name "*.md" | grep -v ".git" | head -10

echo
echo "Searching for communication files:"
find . -name "*communication*" -type f -name "*.md" | grep -v ".git" | head -10

echo
echo "Searching for meeting files:"
find . -name "*meeting*" -type f -name "*.md" | grep -v ".git" | head -10

echo
echo "🔍 Step 3: Analyzing specific broken links from stakeholder README..."

# Key broken links from stakeholder-engagement README
declare -a BROKEN_STAKEHOLDER_LINKS=(
    "stakeholder-personas.md"
    "engagement-plan.md"
    "communication-calendar.md"
    "message-templates.md"
    "meeting-agendas.md"
    "kickoff-meeting.md"
    "review-meeting.md"
    "decision-meeting.md"
    "feedback-tools.md"
    "stakeholder-surveys.md"
    "conflict-resolution.md"
    "escalation-procedures.md"
    "executive-summary.md"
    "executive-presentation.md"
    "steering-committee.md"
    "business-update.md"
)

echo "🎯 Step 4: Checking for potential matches..."

EXACT_MATCHES=0
SIMILAR_MATCHES=0
NO_MATCHES=0

for broken_file in "${BROKEN_STAKEHOLDER_LINKS[@]}"; do
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
echo "📋 Step 5: Checking essential-templates for stakeholder files..."

# Check if essential-templates has any stakeholder-related files
echo "Stakeholder-related files in essential-templates:"
ls -la "$ESSENTIAL_DIR" | grep -E "(stakeholder|communication|meeting)" || echo "  No obvious stakeholder files found"

echo
echo "🎯 Step 6: Summary and recommendations..."

echo -e "${BLUE}STAKEHOLDER RECONCILIATION SUMMARY:${NC}"
echo "- Exact matches found: $EXACT_MATCHES"
echo "- Similar matches found: $SIMILAR_MATCHES"  
echo "- No matches found: $NO_MATCHES"

echo
echo -e "${GREEN}HIGH PRIORITY FIXES (exact matches):${NC}"
if [ $EXACT_MATCHES -gt 0 ]; then
    echo "Found exact matches that can be linked with relative path updates"
else
    echo "No exact matches found"
fi

echo
echo -e "${YELLOW}POTENTIAL LINK FIXES (based on similar matches):${NC}"
echo "Review similar matches above to determine if any can be linked"

echo
echo "🔧 Step 7: Generate stakeholder fix script..."

cat > fix-stakeholder-links.sh << 'EOF'
#!/bin/bash

# fix-stakeholder-links.sh
# Fix stakeholder engagement link issues

set -e

echo "🔧 Fixing stakeholder engagement link issues..."

STAKEHOLDER_README="./role-based-toolkits/project-manager/stakeholder-engagement/README.md"

# Check for existing stakeholder files in essential-templates
if [ -f "./role-based-toolkits/project-manager/essential-templates/stakeholder-register.md" ]; then
    echo "1. Stakeholder register found in essential-templates"
    # Could potentially link to this
fi

# Check for communication files in essential-templates
if [ -f "./role-based-toolkits/project-manager/essential-templates/communication-plan.md" ]; then
    echo "2. Communication plan found in essential-templates"
    # Could potentially be linked or serve as foundation
fi

# Check for meeting files in essential-templates
if [ -f "./role-based-toolkits/project-manager/essential-templates/meeting-templates.md" ]; then
    echo "3. Meeting templates found in essential-templates"
    # Could potentially be linked for meeting-agendas
fi

echo "🎯 Manual review needed - most stakeholder templates need creation"
echo "   Run reconcile-stakeholder-links.sh for detailed analysis"
EOF

chmod +x fix-stakeholder-links.sh

echo -e "${GREEN}✅ Created fix-stakeholder-links.sh script${NC}"

echo
echo "🎯 NEXT STEPS:"
echo "1. Review the similar matches above"
echo "2. Identify which files can be linked vs. need to be created"
echo "3. Run './fix-stakeholder-links.sh' for any automated fixes"
echo "4. Proceed to link verification and Phase 2 content creation"
