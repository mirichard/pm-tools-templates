#!/bin/bash

# PM Tools Templates - Link Checker Script
# Systematically checks all README.md files for broken links and provides recommendations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
total_files=0
total_links=0
broken_links=0
working_links=0

# Arrays to store results
declare -a broken_link_details
declare -a recommendations

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    PM Tools Templates Link Checker    ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to check if a path exists relative to the README file
check_link() {
    local readme_file="$1"
    local link_target="$2"
    local line_number="$3"
    local full_link="$4"
    
    # Get the directory containing the README file
    local readme_dir=$(dirname "$readme_file")
    
    # Handle different types of links
    if [[ "$link_target" =~ ^https?:// ]]; then
        # External link - we'll skip these for now
        return 0
    elif [[ "$link_target" =~ ^mailto: ]]; then
        # Email link - skip
        return 0
    elif [[ "$link_target" =~ ^# ]]; then
        # Anchor link within same document - skip for now
        return 0
    fi
    
    # Remove any anchor fragments (#section) from the link
    local clean_link=$(echo "$link_target" | sed 's/#.*$//')
    
    # Skip empty links
    if [[ -z "$clean_link" ]]; then
        return 0
    fi
    
    # Construct full path
    local full_path
    if [[ "$clean_link" =~ ^/ ]]; then
        # Absolute path from repo root
        full_path=".$clean_link"
    else
        # Relative path
        full_path="$readme_dir/$clean_link"
    fi
    
    # Normalize the path (resolve .. and .)
    full_path=$(cd "$(dirname "$full_path")" 2>/dev/null && pwd)/$(basename "$full_path") 2>/dev/null || echo "$full_path"
    
    total_links=$((total_links + 1))
    
    # Check if file or directory exists
    if [[ -e "$full_path" ]]; then
        working_links=$((working_links + 1))
        echo -e "  ${GREEN}✓${NC} $link_target"
        return 0
    else
        broken_links=$((broken_links + 1))
        echo -e "  ${RED}✗${NC} $link_target (line $line_number)"
        
        # Store details for reporting
        broken_link_details+=("$readme_file:$line_number:$link_target:$full_path")
        
        # Generate recommendations
        generate_recommendation "$full_path" "$link_target" "$readme_file"
        return 1
    fi
}

# Function to generate recommendations for fixing broken links
generate_recommendation() {
    local full_path="$1"
    local link_target="$2"
    local readme_file="$3"
    
    local dir_path=$(dirname "$full_path")
    local file_name=$(basename "$full_path")
    
    # Check if directory exists but file doesn't
    if [[ -d "$dir_path" ]]; then
        if [[ "$file_name" == "README.md" ]]; then
            recommendations+=("CREATE: $full_path - Directory exists, needs README.md file")
        elif [[ "$file_name" =~ \.md$ ]]; then
            recommendations+=("CREATE: $full_path - Directory exists, needs markdown file")
        else
            recommendations+=("CHECK: $full_path - Directory exists, check if file should exist or link is wrong")
        fi
    else
        # Check for similar directory names
        local parent_dir=$(dirname "$dir_path")
        if [[ -d "$parent_dir" ]]; then
            local similar_dirs=$(find "$parent_dir" -maxdepth 1 -type d -name "*$(basename "$dir_path")*" 2>/dev/null | head -3)
            if [[ -n "$similar_dirs" ]]; then
                recommendations+=("FIX_LINK: $link_target in $readme_file - Directory doesn't exist, similar: $(echo $similar_dirs | tr '\n' ' ')")
            else
                recommendations+=("CREATE_DIR: $dir_path - Directory structure doesn't exist")
            fi
        else
            recommendations+=("CREATE_STRUCTURE: $full_path - Full directory structure needs to be created")
        fi
    fi
}

# Function to process a single README file
process_readme() {
    local readme_file="$1"
    
    echo -e "\n${YELLOW}Checking:${NC} $readme_file"
    
    # Extract markdown links using grep and regex
    # This will find [text](link) patterns
    local link_pattern='\[([^\]]*)\]\(([^)]*)\)'
    
    # Process each line to find links
    local line_num=0
    while IFS= read -r line; do
        line_num=$((line_num + 1))
        
        # Find all markdown links in this line
        echo "$line" | grep -oE '\[[^]]*\]\([^)]*\)' 2>/dev/null | while read -r full_link; do
            # Extract the URL part
            local link_target=$(echo "$full_link" | sed -n 's/\[.*\](\([^)]*\)).*/\1/p')
            
            # Check the link
            check_link "$readme_file" "$link_target" "$line_num" "$full_link"
        done
        
    done < "$readme_file"
}

# Find all README.md files, excluding node_modules and .git
echo "Scanning repository for README.md files..."
readme_files=$(find . -name "README.md" -type f -not -path "*/node_modules/*" -not -path "*/.git/*" | sort)

if [[ -z "$readme_files" ]]; then
    echo -e "${RED}No README.md files found!${NC}"
    exit 1
fi

echo -e "Found $(echo "$readme_files" | wc -l) README.md files\n"

# Process each README file
for readme_file in $readme_files; do
    total_files=$((total_files + 1))
    process_readme "$readme_file"
done

# Summary Report
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}              SUMMARY REPORT            ${NC}"
echo -e "${BLUE}========================================${NC}"

echo -e "\n${YELLOW}Statistics:${NC}"
echo "  README files processed: $total_files"
echo "  Total links checked: $total_links"
echo -e "  Working links: ${GREEN}$working_links${NC}"
echo -e "  Broken links: ${RED}$broken_links${NC}"

if [[ $broken_links -gt 0 ]]; then
    echo -e "\n${RED}BROKEN LINKS DETAILS:${NC}"
    echo "====================="
    
    for detail in "${broken_link_details[@]}"; do
        IFS=':' read -r file line link path <<< "$detail"
        echo -e "${RED}✗${NC} File: $file"
        echo "  Line: $line"
        echo "  Link: $link"
        echo "  Resolved to: $path"
        echo ""
    done
    
    echo -e "\n${YELLOW}RECOMMENDATIONS:${NC}"
    echo "================="
    
    # Remove duplicates and sort recommendations
    printf '%s\n' "${recommendations[@]}" | sort -u | while read -r rec; do
        if [[ "$rec" =~ ^CREATE: ]]; then
            echo -e "${GREEN}$rec${NC}"
        elif [[ "$rec" =~ ^FIX_LINK: ]]; then
            echo -e "${YELLOW}$rec${NC}"
        elif [[ "$rec" =~ ^CREATE_DIR: ]]; then
            echo -e "${BLUE}$rec${NC}"
        else
            echo -e "$rec"
        fi
    done
    
    echo -e "\n${YELLOW}NEXT STEPS:${NC}"
    echo "==========="
    echo "1. Review broken links and determine if they should exist"
    echo "2. Create missing README.md files for existing directories"
    echo "3. Fix incorrect link paths in markdown files"
    echo "4. Create missing directory structures if needed"
    echo "5. Re-run this script to verify fixes"
    
else
    echo -e "\n${GREEN}🎉 All links are working correctly!${NC}"
fi

# Generate detailed report file
report_file="link-check-report-$(date +%Y%m%d-%H%M%S).txt"
echo -e "\n${BLUE}Generating detailed report: $report_file${NC}"

cat > "$report_file" << EOF
PM Tools Templates - Link Check Report
Generated: $(date)

SUMMARY:
========
README files processed: $total_files
Total links checked: $total_links
Working links: $working_links
Broken links: $broken_links

BROKEN LINKS:
=============
EOF

for detail in "${broken_link_details[@]}"; do
    IFS=':' read -r file line link path <<< "$detail"
    cat >> "$report_file" << EOF
File: $file
Line: $line
Link: $link
Resolved to: $path

EOF
done

cat >> "$report_file" << EOF

RECOMMENDATIONS:
================
EOF

printf '%s\n' "${recommendations[@]}" | sort -u >> "$report_file"

echo -e "Report saved to: ${GREEN}$report_file${NC}"

# Exit with error code if there are broken links
if [[ $broken_links -gt 0 ]]; then
    exit 1
else
    exit 0
fi

