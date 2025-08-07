#!/bin/bash

# Add metadata to remaining template files that don't have it yet
# This script adds YAML frontmatter to template files missing metadata

echo "🚀 Adding metadata to remaining template files..."
echo "📊 Analyzing files without metadata..."

# Find files without metadata
files_without_metadata=$(find . -name "*template*.md" -exec grep -L "^---$|## 📄 Template Details" {} \;)
total_files=$(echo "$files_without_metadata" | wc -l)

echo "📋 Found $total_files files without metadata"
echo "----------------------------------------"

# Counter for processed files
processed=0

# Process each file
while IFS= read -r file; do
    if [[ -z "$file" ]]; then
        continue
    fi
    
    echo "🔄 Processing: $file"
    
    # Extract title from first heading or filename
    title=$(head -20 "$file" | grep -m1 "^# " | sed 's/^# //' | sed 's/["`]//g' || basename "$file" .md)
    if [[ -z "$title" ]]; then
        title=$(basename "$file" .md | tr '-_' ' ' | sed 's/\b\w/\u&/g')
    fi
    
    # Classify based on file path and content
    methodology="universal"
    complexity="intermediate" 
    process_group="universal"
    industry="universal"
    role="universal"
    
    # Methodology classification
    if [[ "$file" == *"agile"* ]] || grep -qi "sprint\|scrum\|backlog" "$file"; then
        methodology="agile"
    elif [[ "$file" == *"traditional"* ]] || grep -qi "charter\|waterfall\|phase" "$file"; then
        methodology="traditional"
    elif [[ "$file" == *"hybrid"* ]] || grep -qi "hybrid\|mixed" "$file"; then
        methodology="hybrid"
    fi
    
    # Process group classification
    if [[ "$file" == *"charter"* ]] || [[ "$file" == *"initiat"* ]]; then
        process_group="initiating"
    elif [[ "$file" == *"plan"* ]] || [[ "$file" == *"resource"* ]] || [[ "$file" == *"risk"* ]]; then
        process_group="planning"
    elif [[ "$file" == *"execut"* ]] || [[ "$file" == *"team"* ]]; then
        process_group="executing"
    elif [[ "$file" == *"monitor"* ]] || [[ "$file" == *"status"* ]] || [[ "$file" == *"dashboard"* ]]; then
        process_group="monitoring"
    elif [[ "$file" == *"clos"* ]] || [[ "$file" == *"handover"* ]]; then
        process_group="closing"
    elif [[ "$file" == *"assess"* ]]; then
        process_group="initiating"
    fi
    
    # Industry classification
    if grep -qi "clinical\|pharmaceutical\|gxp\|fda" "$file"; then
        industry="healthcare"
    elif grep -qi "compliance\|audit\|financial" "$file"; then
        industry="financial"
    elif grep -qi "devops\|software\|api\|cyber" "$file"; then
        industry="technology"
    fi
    
    # Role classification
    if [[ "$file" == *"product"* ]] || grep -qi "product owner\|backlog" "$file"; then
        role="po"
    elif [[ "$file" == *"scrum"* ]] || grep -qi "scrum master" "$file"; then
        role="sm"
    elif [[ "$file" == *"team"* ]] || grep -qi "development team" "$file"; then
        role="team"
    elif [[ "$file" == *"stakeholder"* ]] || grep -qi "stakeholder\|sponsor" "$file"; then
        role="stakeholder"
    else
        role="pm"
    fi
    
    # Complexity assessment
    lines=$(wc -l < "$file")
    sections=$(grep -c "^## " "$file" || echo 0)
    if [[ $lines -gt 500 && $sections -gt 8 ]]; then
        complexity="advanced"
    elif [[ $lines -gt 200 && $sections -gt 4 ]]; then
        complexity="intermediate"
    else
        complexity="basic"
    fi
    
    # Estimate completion time
    case $complexity in
        "advanced") time_estimate="60-90 minutes" ;;
        "intermediate") time_estimate="30-45 minutes" ;;
        "basic") time_estimate="15-30 minutes" ;;
    esac
    
    # Generate tags
    tags=""
    [[ "$methodology" != "universal" ]] && tags="\"$methodology\", "
    [[ "$process_group" != "universal" ]] && tags="$tags\"$process_group\", "
    grep -qi "risk" "$file" && tags="$tags\"risk-management\", "
    grep -qi "stakeholder" "$file" && tags="$tags\"stakeholder-management\", "
    grep -qi "communication" "$file" && tags="$tags\"communication\", "
    grep -qi "planning\|plan" "$file" && tags="$tags\"planning\", "
    grep -qi "quality\|test" "$file" && tags="$tags\"quality\", "
    tags=$(echo "$tags" | sed 's/, $//')
    
    # Create temp file with metadata + original content
    cat > "${file}.tmp" << EOF
---
title: "$title"
methodology: "$methodology"
complexity: "$complexity"
process_group: "$process_group"
industry: "$industry"
role: "$role"
tags: [$tags]
version: "1.0.0"
owner: "mirichard"
updated: "$(date '+%Y-%m-%d')"
estimated_completion_time: "$time_estimate"
---

EOF
    
    # Append original content
    cat "$file" >> "${file}.tmp"
    
    # Replace original with new version
    mv "${file}.tmp" "$file"
    
    processed=$((processed + 1))
    echo "   ✅ Added metadata (method: $methodology, complexity: $complexity, process: $process_group)"

done <<< "$files_without_metadata"

echo "----------------------------------------"
echo "📊 Summary:"
echo "   • Files processed: $processed"
echo "   • Metadata addition complete!"
echo ""
echo "🔍 Verification:"
remaining=$(find . -name "*template*.md" -exec grep -L "^---$|## 📄 Template Details" {} \; | wc -l)
echo "   • Files still without metadata: $remaining"

if [[ $remaining -eq 0 ]]; then
    echo "🎉 SUCCESS: All template files now have metadata!"
else
    echo "⚠️  Some files may still need manual review"
fi
