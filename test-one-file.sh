#!/bin/bash

# Simple test to check one README file
file="docs/getting-started/README.md"

echo "Checking links in: $file"
echo "========================"

line_num=0
while IFS= read -r line; do
    line_num=$((line_num + 1))
    
    # Find all markdown links in this line
    echo "$line" | grep -oE '\[[^]]*\]\([^)]*\)' 2>/dev/null | while read -r full_link; do
        # Extract the URL part
        link_target=$(echo "$full_link" | sed -n 's/\[.*\](\([^)]*\)).*/\1/p')
        
        echo "Line $line_num: Found link: $link_target"
        
        # Skip external links and anchors
        if [[ "$link_target" =~ ^https?:// ]] || [[ "$link_target" =~ ^mailto: ]] || [[ "$link_target" =~ ^# ]]; then
            echo "  -> Skipping (external/anchor)"
            continue
        fi
        
        # Remove anchor fragments
        clean_link=$(echo "$link_target" | sed 's/#.*$//')
        if [[ -z "$clean_link" ]]; then
            echo "  -> Skipping (empty after removing anchor)"
            continue
        fi
        
        # Construct full path
        if [[ "$clean_link" =~ ^/ ]]; then
            full_path=".$clean_link"
        else
            full_path="docs/getting-started/$clean_link"
        fi
        
        # Check if exists
        if [[ -e "$full_path" ]]; then
            echo "  -> ✅ EXISTS: $full_path"
        else
            echo "  -> ❌ MISSING: $full_path"
        fi
    done
    
done < "$file"

