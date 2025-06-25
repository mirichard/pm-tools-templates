#!/bin/bash

# Comprehensive Link Analysis Script
# Analyzes all README files and provides detailed breakdown

echo "🔍 PM Tools Templates - Comprehensive Link Analysis"
echo "=================================================="

# Find all README files (excluding node_modules)
readme_files=$(find . -name "README.md" -type f -not -path "*/node_modules/*" -not -path "*/.git/*" | sort)
total_files=$(echo "$readme_files" | wc -l)

echo "📂 Found $total_files README files to analyze"
echo ""

# Counters
total_links=0
working_links=0
broken_links=0
anchor_links=0
external_links=0

# Arrays for broken links
declare -a broken_link_details
declare -a missing_files

# Function to check a single link
check_single_link() {
    local readme_file="$1"
    local link_target="$2"
    local line_number="$3"
    
    # Count total links
    total_links=$((total_links + 1))
    
    # Skip external links
    if [[ "$link_target" =~ ^https?:// ]] || [[ "$link_target" =~ ^mailto: ]]; then
        external_links=$((external_links + 1))
        return 0
    fi
    
    # Skip anchor links
    if [[ "$link_target" =~ ^# ]]; then
        anchor_links=$((anchor_links + 1))
        return 0
    fi
    
    # Remove anchor fragments
    clean_link=$(echo "$link_target" | sed 's/#.*$//')
    if [[ -z "$clean_link" ]]; then
        anchor_links=$((anchor_links + 1))
        return 0
    fi
    
    # Get directory of README file
    readme_dir=$(dirname "$readme_file")
    
    # Construct full path
    if [[ "$clean_link" =~ ^/ ]]; then
        full_path=".$clean_link"
    else
        full_path="$readme_dir/$clean_link"
    fi
    
    # Check if exists
    if [[ -e "$full_path" ]]; then
        working_links=$((working_links + 1))
        return 0
    else
        broken_links=$((broken_links + 1))
        broken_link_details+=("$readme_file:$line_number:$link_target:$full_path")
        
        # Check if it's a missing README.md in existing directory
        if [[ "$(basename "$full_path")" == "README.md" && -d "$(dirname "$full_path")" ]]; then
            missing_files+=("$full_path")
        fi
        return 1
    fi
}

# Process all README files
echo "🔍 Analyzing links..."
for readme_file in $readme_files; do
    echo -n "."
    
    line_num=0
    while IFS= read -r line; do
        line_num=$((line_num + 1))
        
        # Find all markdown links in this line using process substitution to avoid subshell
        while read -r full_link; do
            if [[ -n "$full_link" ]]; then
                # Extract the URL part
                link_target=$(echo "$full_link" | sed -n 's/\[.*\](\([^)]*\)).*/\1/p')
                check_single_link "$readme_file" "$link_target" "$line_num"
            fi
        done < <(echo "$line" | grep -oE '\[[^]]*\]\([^)]*\)' 2>/dev/null)
        
    done < "$readme_file"
done

echo ""
echo ""

# Display Summary
echo "📊 LINK ANALYSIS SUMMARY"
echo "========================"
echo "📁 Files processed: $total_files"
echo "🔗 Total links found: $total_links"
echo "✅ Working internal links: $working_links"
echo "❌ Broken internal links: $broken_links"
echo "🔗 Anchor links (skipped): $anchor_links"
echo "🌐 External links (skipped): $external_links"
echo ""

if [[ $broken_links -gt 0 ]]; then
    echo "❌ BROKEN LINKS FOUND"
    echo "====================="
    
    # Group broken links by type
    missing_readmes=0
    missing_dirs=0
    missing_files_count=0
    
    for detail in "${broken_link_details[@]}"; do
        IFS=':' read -r file line link path <<< "$detail"
        
        if [[ "$(basename "$path")" == "README.md" && -d "$(dirname "$path")" ]]; then
            missing_readmes=$((missing_readmes + 1))
        elif [[ ! -d "$(dirname "$path")" ]]; then
            missing_dirs=$((missing_dirs + 1))
        else
            missing_files_count=$((missing_files_count + 1))
        fi
    done
    
    echo "📝 Missing README.md files: $missing_readmes"
    echo "📁 Missing directories: $missing_dirs"
    echo "📄 Other missing files: $missing_files_count"
    echo ""
    
    echo "🔧 SPECIFIC BROKEN LINKS:"
    echo "========================="
    for detail in "${broken_link_details[@]}"; do
        IFS=':' read -r file line link path <<< "$detail"
        echo "❌ $file (line $line): $link"
        echo "   → Resolves to: $path"
        
        if [[ "$(basename "$path")" == "README.md" && -d "$(dirname "$path")" ]]; then
            echo "   💡 RECOMMENDATION: Create README.md in existing directory"
        elif [[ ! -d "$(dirname "$path")" ]]; then
            echo "   💡 RECOMMENDATION: Create directory structure or fix link path"
        else
            echo "   💡 RECOMMENDATION: Create missing file or fix link"
        fi
        echo ""
    done
    
    echo "🎯 TOP PRIORITY FIXES:"
    echo "====================="
    echo "The following README.md files should be created in existing directories:"
    
    for missing_file in "${missing_files[@]}"; do
        echo "📝 CREATE: $missing_file"
    done
    
else
    echo "🎉 All internal links are working correctly!"
fi

# Calculate link health percentage
if [[ $total_links -gt 0 ]]; then
    internal_links=$((working_links + broken_links))
    if [[ $internal_links -gt 0 ]]; then
        health_percentage=$(( (working_links * 100) / internal_links ))
        echo ""
        echo "📈 Link Health Score: $health_percentage% ($working_links/$internal_links internal links working)"
    fi
fi

echo ""
echo "✨ Analysis complete!"

