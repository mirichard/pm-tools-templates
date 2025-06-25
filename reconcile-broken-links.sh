#!/bin/bash

# reconcile-broken-links.sh
# Analyzes broken links and suggests fixes by finding existing files

set -e

echo "🔍 BROKEN LINK RECONCILIATION ANALYSIS"
echo "======================================"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create working directory
WORK_DIR="link-analysis-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$WORK_DIR"

echo "📊 Step 1: Extracting broken links from analysis..."

# Check if link analysis results exist
if [ ! -f "link-analysis-results.txt" ]; then
    echo "❌ link-analysis-results.txt not found. Running link analysis first..."
    if [ -f "analyze-all-links.sh" ]; then
        ./analyze-all-links.sh > /dev/null 2>&1
    else
        echo "❌ analyze-all-links.sh not found. Please run link analysis first."
        exit 1
    fi
fi

# Extract broken internal links
echo "Extracting broken internal links..."
grep -A 1000 "BROKEN INTERNAL LINKS" link-analysis-results.txt | \
    grep -E "^\s*-\s+" | \
    sed 's/^\s*-\s*//' | \
    grep -v "^$" > "$WORK_DIR/broken-links.txt"

BROKEN_COUNT=$(wc -l < "$WORK_DIR/broken-links.txt")
echo -e "${YELLOW}Found $BROKEN_COUNT broken internal links${NC}"
echo

echo "📁 Step 2: Building file inventory..."

# Create comprehensive file inventory
find . -name "*.md" -type f | grep -v ".git" | sort > "$WORK_DIR/all-files.txt"
ALL_FILES_COUNT=$(wc -l < "$WORK_DIR/all-files.txt")
echo -e "${BLUE}Found $ALL_FILES_COUNT markdown files in repository${NC}"
echo

echo "🔧 Step 3: Analyzing broken links and finding potential matches..."

# Initialize counters
EXACT_MATCHES=0
SIMILAR_MATCHES=0
NO_MATCHES=0

# Results files
echo "# Broken Link Reconciliation Report" > "$WORK_DIR/reconciliation-report.md"
echo "Generated: $(date)" >> "$WORK_DIR/reconciliation-report.md"
echo "" >> "$WORK_DIR/reconciliation-report.md"

# Files for different types of issues
> "$WORK_DIR/exact-matches.txt"
> "$WORK_DIR/similar-matches.txt"
> "$WORK_DIR/no-matches.txt"
> "$WORK_DIR/suggested-fixes.txt"

echo "## Summary" >> "$WORK_DIR/reconciliation-report.md"
echo "" >> "$WORK_DIR/reconciliation-report.md"

# Process each broken link
while IFS= read -r broken_link; do
    # Extract the target file from the broken link
    if [[ "$broken_link" =~ \[(.*)\]\((.*)\) ]]; then
        link_text="${BASH_REMATCH[1]}"
        link_target="${BASH_REMATCH[2]}"
        
        # Get just the filename
        filename=$(basename "$link_target")
        
        echo -n "Checking: $filename ... "
        
        # Check for exact filename matches
        exact_match=$(grep "/$filename$" "$WORK_DIR/all-files.txt" | head -1)
        
        if [ -n "$exact_match" ]; then
            echo -e "${GREEN}EXACT MATCH FOUND${NC}"
            echo "$broken_link -> $exact_match" >> "$WORK_DIR/exact-matches.txt"
            ((EXACT_MATCHES++))
            
        else
            # Check for similar filenames (remove extensions, check partial matches)
            base_name=$(echo "$filename" | sed 's/\.[^.]*$//')
            similar_matches=$(grep -i "$base_name" "$WORK_DIR/all-files.txt" || true)
            
            if [ -n "$similar_matches" ]; then
                echo -e "${YELLOW}SIMILAR MATCHES FOUND${NC}"
                echo "$broken_link" >> "$WORK_DIR/similar-matches.txt"
                echo "$similar_matches" | sed 's/^/  -> /' >> "$WORK_DIR/similar-matches.txt"
                echo "" >> "$WORK_DIR/similar-matches.txt"
                ((SIMILAR_MATCHES++))
            else
                echo -e "${RED}NO MATCHES${NC}"
                echo "$broken_link" >> "$WORK_DIR/no-matches.txt"
                ((NO_MATCHES++))
            fi
        fi
    else
        echo -e "${RED}INVALID LINK FORMAT${NC}"
        echo "$broken_link" >> "$WORK_DIR/no-matches.txt"
        ((NO_MATCHES++))
    fi
done < "$WORK_DIR/broken-links.txt"

echo
echo "📋 Step 4: Generating reconciliation report..."

# Update summary in report
{
    echo "- Total broken links analyzed: **$BROKEN_COUNT**"
    echo "- Exact matches found: **$EXACT_MATCHES**"
    echo "- Similar matches found: **$SIMILAR_MATCHES**"
    echo "- No matches found: **$NO_MATCHES**"
    echo ""
    echo "## Exact Matches (Can be fixed automatically)"
    echo ""
    if [ $EXACT_MATCHES -gt 0 ]; then
        echo "These broken links point to files that exist in different locations:"
        echo ""
        while IFS= read -r line; do
            echo "- \`$line\`"
        done < "$WORK_DIR/exact-matches.txt"
    else
        echo "No exact matches found."
    fi
    echo ""
    
    echo "## Similar Matches (Need manual review)"
    echo ""
    if [ $SIMILAR_MATCHES -gt 0 ]; then
        echo "These broken links have similar files that might be the intended targets:"
        echo ""
        cat "$WORK_DIR/similar-matches.txt" | sed 's/^//'
    else
        echo "No similar matches found."
    fi
    echo ""
    
    echo "## No Matches (Files need to be created)"
    echo ""
    if [ $NO_MATCHES -gt 0 ]; then
        echo "These broken links point to files that don't exist anywhere:"
        echo ""
        while IFS= read -r line; do
            echo "- \`$line\`"
        done < "$WORK_DIR/no-matches.txt"
    else
        echo "All broken links have potential matches!"
    fi
} >> "$WORK_DIR/reconciliation-report.md"

echo "🎯 Step 5: Generating fix suggestions..."

# Generate specific fix suggestions for exact matches
if [ $EXACT_MATCHES -gt 0 ]; then
    echo "# Automated Fix Script" > "$WORK_DIR/apply-link-fixes.sh"
    echo "#!/bin/bash" >> "$WORK_DIR/apply-link-fixes.sh"
    echo "# Generated fix script for exact matches" >> "$WORK_DIR/apply-link-fixes.sh"
    echo "set -e" >> "$WORK_DIR/apply-link-fixes.sh"
    echo "" >> "$WORK_DIR/apply-link-fixes.sh"
    echo "echo \"Applying automated link fixes...\"" >> "$WORK_DIR/apply-link-fixes.sh"
    echo "" >> "$WORK_DIR/apply-link-fixes.sh"
    
    # This would need more sophisticated logic to generate actual sed commands
    # For now, just document what needs to be done
    echo "# TODO: Add sed commands to fix exact matches" >> "$WORK_DIR/apply-link-fixes.sh"
    echo "# Each broken link should be updated to point to the correct file path" >> "$WORK_DIR/apply-link-fixes.sh"
    
    chmod +x "$WORK_DIR/apply-link-fixes.sh"
fi

echo
echo "✅ RECONCILIATION COMPLETE"
echo "========================="
echo -e "${GREEN}Exact matches that can be auto-fixed: $EXACT_MATCHES${NC}"
echo -e "${YELLOW}Similar matches needing review: $SIMILAR_MATCHES${NC}"
echo -e "${RED}Missing files to create: $NO_MATCHES${NC}"
echo
echo "📂 Results saved to: $WORK_DIR/"
echo "📄 Detailed report: $WORK_DIR/reconciliation-report.md"

if [ $EXACT_MATCHES -gt 0 ]; then
    echo "🔧 Fix script template: $WORK_DIR/apply-link-fixes.sh"
fi

echo
echo "🎯 NEXT STEPS:"
echo "1. Review the reconciliation report: cat $WORK_DIR/reconciliation-report.md"
echo "2. For exact matches: Update README files to point to correct paths"
echo "3. For similar matches: Determine if files should be renamed/moved"
echo "4. For missing files: Create templates or remove broken links"
echo "5. Rerun link analysis to verify fixes"

# Show a sample of exact matches for immediate action
if [ $EXACT_MATCHES -gt 0 ]; then
    echo
    echo "🔍 SAMPLE EXACT MATCHES (first 5):"
    head -5 "$WORK_DIR/exact-matches.txt" | while IFS= read -r line; do
        echo "  $line"
    done
    if [ $EXACT_MATCHES -gt 5 ]; then
        echo "  ... and $((EXACT_MATCHES - 5)) more"
    fi
fi
