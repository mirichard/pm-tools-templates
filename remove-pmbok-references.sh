#!/bin/bash

# Remove Traditional References Script
# This script systematically removes Industry Standard proprietary references from the repository
# and replaces them with generic project management terminology

set -e

echo "🔧 Starting Traditional/Industry Standard Reference Removal Process..."

# Create backup directory
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
echo "📦 Creating backup in ${BACKUP_DIR}..."
mkdir -p "${BACKUP_DIR}"

# Function to backup and replace content in a file
replace_in_file() {
    local file="$1"
    local search="$2"
    local replace="$3"
    local description="$4"
    
    if [[ -f "$file" ]]; then
        # Create backup
        cp "$file" "${BACKUP_DIR}/$(basename $file).bak"
        
        # Perform replacement
        if sed -i.tmp "s/${search}/${replace}/g" "$file" 2>/dev/null; then
            rm "${file}.tmp"
            echo "✅ Updated: $file - $description"
        else
            echo "⚠️  Warning: Could not update $file"
        fi
    fi
}

# Function to process all files in directory
process_directory() {
    local dir="$1"
    echo "📁 Processing directory: $dir"
    
    # Find all markdown files and process them
    find "$dir" -name "*.md" -type f | while read -r file; do
        # Skip backup directory
        if [[ "$file" == *"$BACKUP_DIR"* ]]; then
            continue
        fi
        
        # Traditional replacements
        sed -i.tmp 's/Traditional[®©™]*/Traditional Project Management/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/Project Management Body of Knowledge[®©™]*/Traditional Project Management Framework/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/Industry Standard[®©™]*/Industry Standard/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/Project Management Institute[®©™]*/Project Management Community/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/PMP[®©™]*/Project Management Professional/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        
        # More specific replacements
        sed -i.tmp 's/Industry Standard standards/industry standards/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/Industry Standard-aligned/industry-aligned/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/Industry Standard certification/project management certification/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/Traditional Guide/Traditional PM Framework/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/Traditional-aligned/Traditional-aligned/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/based on Industry Standard standards/following industry standards/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        
        # Knowledge Areas -> Competency Areas
        sed -i.tmp 's/Traditional Knowledge Areas/Project Management Competency Areas/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/10 Traditional Knowledge Areas/Core Project Management Areas/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/Knowledge Areas Coverage/Competency Areas Coverage/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        
        # Process Groups -> Project Phases
        sed -i.tmp 's/5 Process Groups/Project Phases/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/Process Groups/Project Phases/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        
        # Specific Industry Standard references
        sed -i.tmp 's/Industry Standard Practice Standards/Industry Practice Standards/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/PMP® Exam/Project Management Certification Exam/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/PDU earning/continuing education/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        
    done
}

# Main processing
echo "🔄 Processing main directories..."

# Process key directories
if [[ -d "templates" ]]; then
    process_directory "templates"
fi

if [[ -d "project-lifecycle" ]]; then
    process_directory "project-lifecycle"
fi

if [[ -d "role-based-toolkits" ]]; then
    process_directory "role-based-toolkits"
fi

if [[ -d "methodology-frameworks" ]]; then
    process_directory "methodology-frameworks"
fi

if [[ -d "business-stakeholder-suite" ]]; then
    process_directory "business-stakeholder-suite"
fi

if [[ -d "docs" ]]; then
    process_directory "docs"
fi

# Process root files
echo "📄 Processing root documentation files..."
for file in README.md CONTRIBUTING.md GUIDE.md TEMPLATE_INDEX.md README_COMPLIANCE.md MIGRATION_GUIDE.md; do
    if [[ -f "$file" ]]; then
        cp "$file" "${BACKUP_DIR}/${file}.bak"
        
        # Traditional/Industry Standard replacements for root files
        sed -i.tmp 's/Traditional[®©™]*/Traditional Project Management/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/Project Management Body of Knowledge[®©™]*/Traditional Project Management Framework/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/Industry Standard[®©™]*/Industry Standard/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/Project Management Institute[®©™]*/Project Management Community/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        
        echo "✅ Updated: $file"
    fi
done

# Update directory structure references
echo "📂 Updating directory structure references..."

# Update any scripts that reference Traditional
find . -name "*.sh" -o -name "*.py" -o -name "*.js" | while read -r file; do
    if [[ "$file" == *"$BACKUP_DIR"* ]]; then
        continue
    fi
    
    if grep -q "Traditional\|Industry Standard" "$file" 2>/dev/null; then
        cp "$file" "${BACKUP_DIR}/$(basename $file).bak"
        sed -i.tmp 's/Traditional/Traditional/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/Industry Standard/Industry Standard/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        echo "✅ Updated script: $file"
    fi
done

# Update JSON files
find . -name "*.json" | while read -r file; do
    if [[ "$file" == *"$BACKUP_DIR"* ]]; then
        continue
    fi
    
    if grep -q "Traditional\|Industry Standard" "$file" 2>/dev/null; then
        cp "$file" "${BACKUP_DIR}/$(basename $file).bak"
        sed -i.tmp 's/Traditional/Traditional/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        sed -i.tmp 's/Industry Standard/Industry Standard/g' "$file" 2>/dev/null && rm -f "${file}.tmp"
        echo "✅ Updated JSON: $file"
    fi
done

# Clean up any remaining trademark symbols
echo "🧹 Cleaning up trademark symbols..."
find . -name "*.md" -type f | while read -r file; do
    if [[ "$file" == *"$BACKUP_DIR"* ]]; then
        continue
    fi
    
    # Remove stray trademark symbols
    sed -i.tmp 's/[®©™]//g' "$file" 2>/dev/null && rm -f "${file}.tmp"
done

# Verify changes
echo "🔍 Verification Summary..."
echo "Files with remaining Traditional references:"
grep -r "Traditional" . --exclude-dir="$BACKUP_DIR" --exclude-dir=".git" --include="*.md" --include="*.txt" --include="*.json" | head -10

echo "Files with remaining Industry Standard references:"
grep -r "\\bIndustry Standard\\b" . --exclude-dir="$BACKUP_DIR" --exclude-dir=".git" --include="*.md" --include="*.txt" --include="*.json" | head -10

echo ""
echo "✅ Traditional/Industry Standard Reference Removal Complete!"
echo "📦 Backups created in: ${BACKUP_DIR}"
echo "🔧 Please review the changes before committing"
echo ""
echo "Next Steps:"
echo "1. Review key files for accuracy"
echo "2. Test template functionality"
echo "3. Update any remaining references manually"
echo "4. Commit changes with descriptive message"

# Create summary report
cat > "${BACKUP_DIR}/REMOVAL_SUMMARY.md" << EOF
# Traditional/Industry Standard Reference Removal Summary

**Date**: $(date)
**Backup Location**: ${BACKUP_DIR}

## Changes Made

### Systematic Replacements:
- Traditional® → Traditional Project Management
- Project Management Body of Knowledge → Traditional Project Management Framework  
- Industry Standard® → Industry Standard
- Project Management Institute → Project Management Community
- PMP® → Project Management Professional
- Traditional Knowledge Areas → Project Management Competency Areas
- Process Groups → Project Phases
- Industry Standard Standards → Industry Standards

### Files Processed:
- All Markdown files in main directories
- Root documentation files
- Script and JSON files
- Removed trademark symbols

### Manual Review Required:
- Legal references that should remain
- Template functionality verification
- Link validation
- Context-specific terminology

## Backup Files
All original files backed up in: ${BACKUP_DIR}/
EOF

echo "📋 Summary report created: ${BACKUP_DIR}/REMOVAL_SUMMARY.md"
