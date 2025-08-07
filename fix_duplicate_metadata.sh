#!/bin/bash

# Fix duplicate YAML frontmatter in template files
echo "🔧 Fixing duplicate YAML frontmatter..."

# Find files with multiple YAML sections
files_with_duplicates=$(grep -l "^---$" $(find . -name "*template*.md") | xargs -I {} sh -c 'count=$(grep -c "^---$" "{}"); if [ $count -gt 2 ]; then echo "{}"; fi')

echo "📋 Found files with duplicate frontmatter:"
echo "$files_with_duplicates"

for file in $files_with_duplicates; do
    if [[ -n "$file" ]]; then
        echo "🔄 Processing: $file"
        
        # Create backup
        cp "$file" "${file}.backup"
        
        # Extract first YAML frontmatter and content after all YAML blocks
        awk '
        BEGIN { yaml_count = 0; in_yaml = 0; first_yaml = ""; content = "" }
        /^---$/ { 
            yaml_count++
            if (yaml_count == 1) { in_yaml = 1; first_yaml = first_yaml $0 "\n"; next }
            if (yaml_count == 2 && in_yaml == 1) { first_yaml = first_yaml $0 "\n"; in_yaml = 0; next }
            if (yaml_count > 2) { next }
        }
        in_yaml == 1 { first_yaml = first_yaml $0 "\n"; next }
        yaml_count >= 2 && in_yaml == 0 { content = content $0 "\n" }
        END { printf "%s\n%s", first_yaml, content }
        ' "$file" > "${file}.fixed"
        
        # Replace original with fixed version
        mv "${file}.fixed" "$file"
        
        echo "   ✅ Fixed duplicate frontmatter"
    fi
done

echo "📊 Cleanup complete!"

# Verify no remaining duplicates
remaining=$(grep -l "^---$" $(find . -name "*template*.md") | xargs -I {} sh -c 'count=$(grep -c "^---$" "{}"); if [ $count -gt 2 ]; then echo "{}"; fi' | wc -l)
echo "   • Files with remaining duplicates: $remaining"

if [[ $remaining -eq 0 ]]; then
    echo "🎉 All duplicate frontmatter fixed!"
else
    echo "⚠️  Some files may need manual review"
fi
