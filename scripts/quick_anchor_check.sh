#!/bin/bash
#
# Quick Anchor Link Checker
# 
# Simple shell script to quickly identify potential anchor link issues
# in README.md files across the repository.
#
# Usage: ./scripts/quick_anchor_check.sh [directory]
#

set -e

# Default to current directory if no argument provided
ROOT_DIR="${1:-.}"

echo "🔍 Quick Anchor Link Check"
echo "📁 Searching in: $ROOT_DIR"
echo "================================"

# Find all README.md files, excluding node_modules
README_FILES=$(find "$ROOT_DIR" -name "README.md" -not -path "*/node_modules/*" -not -path "*/.git/*")

if [ -z "$README_FILES" ]; then
    echo "❌ No README.md files found"
    exit 1
fi

README_COUNT=$(echo "$README_FILES" | wc -l | tr -d ' ')
echo "📄 Found $README_COUNT README.md files"
echo ""

TOTAL_ISSUES=0
FILES_WITH_ISSUES=0

for file in $README_FILES; do
    echo "📄 Checking: $file"
    
    # Extract anchor links: [text](#anchor)
    ANCHOR_LINKS=$(grep -n '\[.*\](#[^)]*)' "$file" 2>/dev/null || true)
    
    # Extract headers: ## Header Text
    HEADERS=$(grep -n '^#\+ ' "$file" 2>/dev/null || true)
    
    # Extract HTML anchors: <a id="...">
    HTML_ANCHORS=$(grep -n '<a [^>]*id=' "$file" 2>/dev/null || true)
    
    if [ -n "$ANCHOR_LINKS" ]; then
        LINK_COUNT=$(echo "$ANCHOR_LINKS" | wc -l | tr -d ' ')
        echo "   🔗 Found $LINK_COUNT anchor links"
        
        # Check for common problematic patterns
        ISSUES_FOUND=false
        
        # Check for emoji in headers that have corresponding anchor links
        while IFS= read -r link_line; do
            if [ -n "$link_line" ]; then
                # Extract the anchor from the link
                ANCHOR=$(echo "$link_line" | sed -n 's/.*](#\([^)]*\)).*/\1/p')
                LINE_NUM=$(echo "$link_line" | cut -d: -f1)
                
                if [ -n "$ANCHOR" ]; then
                    # Check if there's a matching header
                    MATCHING_HEADER=$(echo "$HEADERS" | grep -i "$ANCHOR" || true)
                    
                    if [ -z "$MATCHING_HEADER" ]; then
                        # Check if there's an HTML anchor
                        MATCHING_HTML=$(echo "$HTML_ANCHORS" | grep "id=[\"']$ANCHOR[\"']" || true)
                        
                        if [ -z "$MATCHING_HTML" ]; then
                            echo "   ❌ Line $LINE_NUM: Broken anchor link '#$ANCHOR'"
                            ISSUES_FOUND=true
                            ((TOTAL_ISSUES++))
                        fi
                    fi
                fi
            fi
        done <<< "$ANCHOR_LINKS"
        
        # Check for headers with emojis or special characters
        while IFS= read -r header_line; do
            if [ -n "$header_line" ]; then
                HEADER_TEXT=$(echo "$header_line" | cut -d: -f2- | sed 's/^#\+ *//')
                LINE_NUM=$(echo "$header_line" | cut -d: -f1)
                
                # Check if header contains emojis or special characters
                if echo "$HEADER_TEXT" | grep -qE '[^a-zA-Z0-9 \-_]'; then
                    # Check if there's a corresponding HTML anchor
                    PREDICTED_ANCHOR=$(echo "$HEADER_TEXT" | sed 's/[^a-zA-Z0-9 \-_]//g' | tr '[:upper:]' '[:lower:]' | sed 's/ \+/-/g' | sed 's/^-\+\|-\+$//g')
                    
                    HTML_ANCHOR_EXISTS=$(echo "$HTML_ANCHORS" | grep "id=[\"']$PREDICTED_ANCHOR[\"']" || true)
                    
                    if [ -z "$HTML_ANCHOR_EXISTS" ]; then
                        echo "   💡 Line $LINE_NUM: Header with special chars may need explicit anchor: '$HEADER_TEXT'"
                        echo "      Suggested: <a id=\"$PREDICTED_ANCHOR\"></a>"
                        ISSUES_FOUND=true
                    fi
                fi
            fi
        done <<< "$HEADERS"
        
        if [ "$ISSUES_FOUND" = true ]; then
            ((FILES_WITH_ISSUES++))
        fi
    else
        echo "   ✅ No anchor links found"
    fi
    
    echo ""
done

echo "================================"
echo "📊 SUMMARY"
echo "   Files checked: $README_COUNT"
echo "   Files with potential issues: $FILES_WITH_ISSUES"
echo "   Total potential issues: $TOTAL_ISSUES"

if [ $TOTAL_ISSUES -eq 0 ]; then
    echo "✅ No obvious anchor link issues found!"
else
    echo ""
    echo "💡 Recommendations:"
    echo "   1. Run the Python checker for detailed analysis:"
    echo "      python3 scripts/check_anchor_links.py --verbose"
    echo "   2. Add explicit <a id=\"...\"></a> tags for headers with emojis"
    echo "   3. Verify anchor links match their target headers"
fi

exit 0

