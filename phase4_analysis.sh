#!/bin/bash

echo "=== PHASE 4: QUICK START KITS & INFRASTRUCTURE ANALYSIS ==="
echo "Timestamp: $(date)"
echo

# Define target directories for Phase 4
PHASE4_DIRS=(
    "quick-start-kits"
    "industry-specializations/information-technology/infrastructure"
    "methodology-frameworks/emerging-methods/devops"
    "methodology-frameworks/hybrid/infrastructure"
    "essential-templates/infrastructure"
)

echo "=== ANALYZING QUICK START KITS & INFRASTRUCTURE DIRECTORIES ==="
for dir in "${PHASE4_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "✓ Found: $dir"
        find "$dir" -name "*.md" | wc -l | xargs echo "  README/MD files:"
    else
        echo "✗ Missing: $dir"
    fi
done
echo

echo "=== BROKEN LINKS IN PHASE 4 AREAS ==="
# Use our existing broken links data but filter for Phase 4 relevant paths
if [ -f "phase3_broken_links.txt" ]; then
    echo "Filtering broken links for Phase 4 areas..."
    grep -E "(quick-start|infrastructure|devops|hybrid)" phase3_broken_links.txt > phase4_broken_links.txt || echo "No Phase 4 broken links found in existing data"
fi

# Search for broken links specifically mentioning quick start or infrastructure terms
echo "Searching for links mentioning quick-start, infrastructure, devops..."
grep -r "](.*quick.*start" --include="*.md" . > phase4_quickstart_links.txt 2>/dev/null || echo "No quick-start links found"
grep -r "](.*infrastructure" --include="*.md" . > phase4_infrastructure_links.txt 2>/dev/null || echo "No infrastructure links found"
grep -r "](.*devops" --include="*.md" . > phase4_devops_links.txt 2>/dev/null || echo "No devops links found"

echo "=== QUICK START KITS CONTENT ANALYSIS ==="
if [ -d "quick-start-kits" ]; then
    echo "Quick Start Kits directory structure:"
    find quick-start-kits -type f -name "*.md" | while read file; do
        echo "  File: $file"
        echo "    Lines: $(wc -l < "$file")"
        echo "    Links: $(grep -c "](.*)" "$file" 2>/dev/null || echo 0)"
    done
else
    echo "Quick Start Kits directory needs to be created"
fi
echo

echo "=== INFRASTRUCTURE TEMPLATES ANALYSIS ==="
find . -path "*/infrastructure/*" -name "*.md" | while read file; do
    echo "Infrastructure file: $file"
    echo "  Size: $(wc -l < "$file") lines"
    echo "  Links: $(grep -c "](.*)" "$file" 2>/dev/null || echo 0)"
    echo "  Last modified: $(stat -f "%Sm" "$file" 2>/dev/null || echo "unknown")"
done
echo

echo "=== MISSING QUICK START TEMPLATES ==="
# Common quick start templates that should exist
EXPECTED_QUICKSTART=(
    "quick-start-kits/30-day-quick-start.md"
    "quick-start-kits/project-initiation-checklist.md"
    "quick-start-kits/stakeholder-onboarding-kit.md"
    "quick-start-kits/methodology-selection-guide.md"
    "quick-start-kits/template-customization-guide.md"
)

for template in "${EXPECTED_QUICKSTART[@]}"; do
    if [ -f "$template" ]; then
        echo "✓ Exists: $template"
    else
        echo "✗ Missing: $template"
    fi
done
echo

echo "=== INFRASTRUCTURE TEMPLATE GAPS ==="
EXPECTED_INFRASTRUCTURE=(
    "methodology-frameworks/hybrid/infrastructure/hybrid-infrastructure-template.md"
    "essential-templates/infrastructure/infrastructure-requirements-template.md"
    "essential-templates/infrastructure/deployment-checklist-template.md"
)

for template in "${EXPECTED_INFRASTRUCTURE[@]}"; do
    if [ -f "$template" ]; then
        echo "✓ Exists: $template"
    else
        echo "✗ Missing: $template"
    fi
done

echo
echo "=== PHASE 4 SUMMARY ==="
echo "Analysis complete. Check the following files for detailed results:"
echo "- phase4_broken_links.txt"
echo "- phase4_quickstart_links.txt" 
echo "- phase4_infrastructure_links.txt"
echo "- phase4_devops_links.txt"
echo
echo "Ready for Phase 4 execution: Quick Start Kits creation and infrastructure template completion"
