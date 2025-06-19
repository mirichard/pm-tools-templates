#!/bin/bash
# Quick Anchor Link Checker for PM Tools Templates Repository
#
# This script provides rapid identification of potential anchor link problems
# using shell commands. It's designed for quick checks and CI integration.
#
# Usage:
#   ./quick_anchor_check.sh [directory]
#
# Examples:
#   ./quick_anchor_check.sh              # Check current directory
#   ./quick_anchor_check.sh docs/        # Check specific directory

set -e

# Configuration
SEARCH_DIR="${1:-.}"
TEMP_FILE="/tmp/anchor_check_$$"
ERROR_COUNT=0
WARNING_COUNT=0

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🔍 Quick Anchor Link Check"
echo "=========================="
echo "Checking directory: $SEARCH_DIR"
echo ""

# Find all README.md files
README_FILES=$(find "$SEARCH_DIR" -name "README.md" -not -path "*/.*" 2>/dev/null || true)

if [ -z "$README_FILES" ]; then
    echo "❌ No README.md files found in $SEARCH_DIR"
    exit 1
fi

FILE_COUNT=$(echo "$README_FILES" | wc -l | tr -d ' ')
echo "📄 Found $FILE_COUNT README.md files"
echo ""

# Function to check a single file
check_file() {
    local file="$1"
    local file_errors=0
    local file_warnings=0
    
    echo -n "Checking: $file ... "
    
    # Extract anchor links (format: [text](#anchor))
    ANCHOR_LINKS=$(grep -n '\[.*\](#[^)]*)' "$file" 2>/dev/null || true)
    
    # Extract explicit HTML anchors (format: <a id="anchor">)
    HTML_ANCHORS=$(grep -n '<a[^>]*id=["\x27][^"\x27]*["\x27]' "$file" 2>/dev/null || true)
    
    # Extract markdown headers
    HEADERS=$(grep -n '^#\+[[:space:]]' "$file" 2>/dev/null || true)
    
    # Check for problematic characters in headers
    PROBLEMATIC_HEADERS=$(echo "$HEADERS" | grep -E '[📋🚀⚠️💡🔍📄✅❌💰🎯🔄📊&@#$%^*()+=\[\]{}|\\:";'"'"'<>?,./]' 2>/dev/null || true)
    
    if [ -n "$PROBLEMATIC_HEADERS" ]; then
        file_warnings=$((file_warnings + 1))
    fi
    
    # Check for broken anchor patterns
    BROKEN_PATTERNS=$(echo "$ANCHOR_LINKS" | grep -E '#[^)]*--[^)]*|#[^)]*[&@#$%^*()+=\[\]{}|\\:";'"'"'<>?,./][^)]*' 2>/dev/null || true)
    
    if [ -n "$BROKEN_PATTERNS" ]; then
        file_errors=$((file_errors + 1))
    fi
    
    # Simple check: count anchors vs headers with special chars
    ANCHOR_COUNT=$(echo "$HTML_ANCHORS" | wc -l | tr -d ' ')
    PROBLEM_HEADER_COUNT=$(echo "$PROBLEMATIC_HEADERS" | wc -l | tr -d ' ')
    
    if [ "$ANCHOR_COUNT" -eq 0 ] && [ "$PROBLEM_HEADER_COUNT" -gt 0 ]; then
        file_warnings=$((file_warnings + 1))
    fi
    
    # Output results
    if [ $file_errors -gt 0 ]; then
        echo -e "${RED}ERROR${NC}"
        ERROR_COUNT=$((ERROR_COUNT + 1))
    elif [ $file_warnings -gt 0 ]; then
        echo -e "${YELLOW}WARNING${NC}"
        WARNING_COUNT=$((WARNING_COUNT + 1))
    else
        echo -e "${GREEN}OK${NC}"
    fi
    
    # Show details if there are issues
    if [ $file_errors -gt 0 ] || [ $file_warnings -gt 0 ]; then
        if [ -n "$BROKEN_PATTERNS" ]; then
            echo "  ${RED}⚠️  Potential broken anchor patterns:${NC}"
            echo "$BROKEN_PATTERNS" | sed 's/^/    /'
        fi
        
        if [ -n "$PROBLEMATIC_HEADERS" ] && [ "$ANCHOR_COUNT" -eq 0 ]; then
            echo "  ${YELLOW}💡 Headers with special characters (consider explicit anchors):${NC}"
            echo "$PROBLEMATIC_HEADERS" | head -3 | sed 's/^/    /'
            if [ "$PROBLEM_HEADER_COUNT" -gt 3 ]; then
                echo "    ... and $((PROBLEM_HEADER_COUNT - 3)) more"
            fi
        fi
    fi
}

# Check all files
for file in $README_FILES; do
    check_file "$file"
done

echo ""
echo "📊 SUMMARY"
echo "=========="
echo "Files checked: $FILE_COUNT"
echo -e "Files with errors: ${RED}$ERROR_COUNT${NC}"
echo -e "Files with warnings: ${YELLOW}$WARNING_COUNT${NC}"
echo -e "Files OK: ${GREEN}$((FILE_COUNT - ERROR_COUNT - WARNING_COUNT))${NC}"

# Cleanup
rm -f "$TEMP_FILE"

# Recommendations
if [ $ERROR_COUNT -gt 0 ] || [ $WARNING_COUNT -gt 0 ]; then
    echo ""
    echo "🔧 RECOMMENDATIONS"
    echo "=================="
    
    if [ $ERROR_COUNT -gt 0 ]; then
        echo "❌ Critical issues found! Run the full Python checker:"
        echo "   python check_anchor_links.py --auto-fix"
    fi
    
    if [ $WARNING_COUNT -gt 0 ]; then
        echo "💡 Potential improvements available:"
        echo "   python check_anchor_links.py"
    fi
    
    echo ""
    echo "For detailed analysis and auto-fixing:"
    echo "   python check_anchor_links.py --auto-fix --output report.json"
fi

# Exit codes
if [ $ERROR_COUNT -gt 0 ]; then
    exit 1
elif [ $WARNING_COUNT -gt 0 ]; then
    exit 2
else
    echo ""
    echo "✅ All anchor links look good!"
    exit 0
fi

