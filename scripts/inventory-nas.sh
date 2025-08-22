#!/bin/bash

# inventory-nas.sh
# Comprehensive inventory and cataloging of NAS templates
# Part of NAS integration for pm-tools-templates

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
NAS_PATH="/Volumes/michael_share/Career/Tools and Templates"
OUTPUT_DIR="${REPO_ROOT}/meta/nas-inventory"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Output files
INVENTORY_CSV="${OUTPUT_DIR}/nas-inventory-${TIMESTAMP}.csv"
INVENTORY_MD="${OUTPUT_DIR}/nas-inventory-${TIMESTAMP}.md"
ANALYSIS_REPORT="${OUTPUT_DIR}/nas-analysis-${TIMESTAMP}.md"

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}INFO:${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}WARN:${NC} $1"
}

log_error() {
    echo -e "${RED}ERROR:${NC} $1"
}

log_success() {
    echo -e "${GREEN}SUCCESS:${NC} $1"
}

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Check if NAS is accessible
check_nas_access() {
    if [[ ! -d "$NAS_PATH" ]]; then
        log_error "NAS directory not accessible: $NAS_PATH"
        log_info "Please ensure NAS is mounted at: /Volumes/michael_share"
        exit 1
    fi
    
    log_success "NAS directory accessible: $NAS_PATH"
}

# Get file type classification
classify_file_type() {
    local file="$1"
    local extension="${file##*.}"
    local basename=$(basename "$file")
    
    # Convert to lowercase for comparison
    extension=$(echo "$extension" | tr '[:upper:]' '[:lower:]')
    
    case "$extension" in
        md|markdown|txt)
            echo "Document"
            ;;
        doc|docx)
            echo "Word Document"
            ;;
        xls|xlsx|xlsm)
            echo "Excel Spreadsheet"
            ;;
        ppt|pptx)
            echo "PowerPoint Presentation"
            ;;
        pdf)
            echo "PDF Document"
            ;;
        vsd|vsdx)
            echo "Visio Diagram"
            ;;
        mpp)
            echo "Microsoft Project"
            ;;
        png|jpg|jpeg|gif|bmp)
            echo "Image"
            ;;
        zip|rar|7z)
            echo "Archive"
            ;;
        *)
            if [[ "$basename" =~ ^\._.*$ ]]; then
                echo "System File"
            elif [[ "$basename" =~ ^~\$.*$ ]]; then
                echo "Temp File"
            elif [[ "$basename" == "Thumbs.db" ]]; then
                echo "System File"
            else
                echo "Other"
            fi
            ;;
    esac
}

# Assess relevance for PM tools
assess_pm_relevance() {
    local file="$1"
    local basename=$(basename "$file" | tr '[:upper:]' '[:lower:]')
    
    # High relevance indicators
    if [[ "$basename" =~ (project|template|checklist|plan|process|guide|toolkit|matrix|register|charter|scope|risk|quality|test|release|requirement|business.case|stakeholder|communication|status|report|dashboard|estimation|metric|kpi) ]]; then
        echo "High"
        return
    fi
    
    # Medium relevance indicators  
    if [[ "$basename" =~ (management|planning|tracking|workflow|deliverable|methodology|framework|assessment|analysis|review|evaluation) ]]; then
        echo "Medium"
        return
    fi
    
    # Low relevance indicators
    if [[ "$basename" =~ (personal|career|interview|networking|accounting|industry|whitepaper|cookbook|lean) ]]; then
        echo "Low"
        return
    fi
    
    # Unknown/needs review
    echo "Review"
}

# Extract key metadata
extract_metadata() {
    local file="$1"
    local metadata=""
    
    # Try to extract title/subject from various file types
    case "${file##*.}" in
        xlsx|xls|docx|doc|pptx|ppt|pdf)
            if command -v exiftool >/dev/null 2>&1; then
                local title=$(exiftool "$file" 2>/dev/null | grep -i "^Title" | head -1 | cut -d: -f2- | xargs || echo "")
                local subject=$(exiftool "$file" 2>/dev/null | grep -i "^Subject" | head -1 | cut -d: -f2- | xargs || echo "")
                local author=$(exiftool "$file" 2>/dev/null | grep -i "^Author" | head -1 | cut -d: -f2- | xargs || echo "")
                
                if [[ -n "$title" ]]; then
                    metadata="Title: $title"
                fi
                if [[ -n "$subject" ]]; then
                    metadata="${metadata}${metadata:+; }Subject: $subject"
                fi
                if [[ -n "$author" ]]; then
                    metadata="${metadata}${metadata:+; }Author: $author"
                fi
            fi
            ;;
    esac
    
    echo "$metadata"
}

# Generate CSV inventory
generate_csv_inventory() {
    log_info "Generating CSV inventory..."
    
    # CSV Header
    cat > "$INVENTORY_CSV" << 'EOF'
path,filename,type,extension,size_bytes,size_human,modified_date,pm_relevance,classification,metadata,notes
EOF
    
    # Process all files
    find "$NAS_PATH" -type f | while IFS= read -r file; do
        # Skip system files we know we don't want
        local basename=$(basename "$file")
        if [[ "$basename" =~ ^\._.*$ ]] || [[ "$basename" =~ ^~\$.*$ ]] || [[ "$basename" == "Thumbs.db" ]]; then
            continue
        fi
        
        local filename=$(basename "$file")
        local extension="${file##*.}"
        local size_bytes=$(stat -f%z "$file" 2>/dev/null || echo "0")
        local size_human=$(ls -lh "$file" | awk '{print $5}')
        local modified_date=$(stat -f%Sm "$file" 2>/dev/null || echo "Unknown")
        local file_type=$(classify_file_type "$file")
        local pm_relevance=$(assess_pm_relevance "$file")
        local metadata=$(extract_metadata "$file")
        local relative_path=${file#$NAS_PATH/}
        
        # Escape commas in fields
        filename=$(echo "$filename" | sed 's/,/;/g')
        metadata=$(echo "$metadata" | sed 's/,/;/g')
        
        # Output CSV row
        echo "\"$relative_path\",\"$filename\",\"$file_type\",\"$extension\",\"$size_bytes\",\"$size_human\",\"$modified_date\",\"$pm_relevance\",\"To Be Classified\",\"$metadata\",\"\"" >> "$INVENTORY_CSV"
    done
    
    log_success "CSV inventory generated: $INVENTORY_CSV"
}

# Generate markdown inventory
generate_markdown_inventory() {
    log_info "Generating Markdown inventory..."
    
    local total_files=$(tail -n +2 "$INVENTORY_CSV" | wc -l | xargs)
    local total_size=$(tail -n +2 "$INVENTORY_CSV" | awk -F',' '{sum += $5} END {print sum}')
    local total_size_human=$(numfmt --to=iec --suffix=B "$total_size" 2>/dev/null || echo "${total_size} bytes")
    
    cat > "$INVENTORY_MD" << EOF
# NAS Inventory Report

**Generated:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")  
**Source:** $NAS_PATH  
**Total Files:** $total_files  
**Total Size:** $total_size_human  

## Summary by File Type

EOF
    
    # File type summary
    echo "| File Type | Count | Total Size |" >> "$INVENTORY_MD"
    echo "|-----------|-------|------------|" >> "$INVENTORY_MD"
    
    tail -n +2 "$INVENTORY_CSV" | awk -F',' '{
        type=$3
        gsub(/"/, "", type)
        size=$5
        gsub(/"/, "", size)
        types[type] += 1
        sizes[type] += size
    }
    END {
        for (type in types) {
            printf "| %s | %d | %s |\n", type, types[type], sizes[type]
        }
    }' | sort >> "$INVENTORY_MD"
    
    cat >> "$INVENTORY_MD" << 'EOF'

## Summary by PM Relevance

| Relevance | Count | Description |
|-----------|-------|-------------|
EOF
    
    # PM relevance summary
    tail -n +2 "$INVENTORY_CSV" | awk -F',' '{
        rel=$8
        gsub(/"/, "", rel)
        rels[rel] += 1
    }
    END {
        for (rel in rels) {
            desc=""
            if (rel == "High") desc="Directly applicable to PM workflows"
            else if (rel == "Medium") desc="Potentially useful with modification"
            else if (rel == "Low") desc="Limited PM applicability"
            else desc="Requires manual review"
            printf "| %s | %d | %s |\n", rel, rels[rel], desc
        }
    }' | sort >> "$INVENTORY_MD"
    
    cat >> "$INVENTORY_MD" << 'EOF'

## High Relevance Files

The following files have been identified as having high PM relevance:

| File | Type | Size | Modified |
|------|------|------|----------|
EOF
    
    # High relevance files
    tail -n +2 "$INVENTORY_CSV" | grep '"High"' | awk -F',' '{
        filename=$2
        type=$3
        size=$6
        modified=$7
        gsub(/"/, "", filename)
        gsub(/"/, "", type)
        gsub(/"/, "", size)
        gsub(/"/, "", modified)
        printf "| %s | %s | %s | %s |\n", filename, type, size, modified
    }' | sort >> "$INVENTORY_MD"
    
    cat >> "$INVENTORY_MD" << 'EOF'

## Files Requiring Review

The following files require manual review to determine their PM applicability:

| File | Type | Size | Metadata |
|------|------|------|----------|
EOF
    
    # Files needing review
    tail -n +2 "$INVENTORY_CSV" | grep '"Review"' | awk -F',' '{
        filename=$2
        type=$3
        size=$6
        metadata=$10
        gsub(/"/, "", filename)
        gsub(/"/, "", type)
        gsub(/"/, "", size)
        gsub(/"/, "", metadata)
        if (length(metadata) > 50) metadata = substr(metadata, 1, 47) "..."
        printf "| %s | %s | %s | %s |\n", filename, type, size, metadata
    }' | sort >> "$INVENTORY_MD"
    
    log_success "Markdown inventory generated: $INVENTORY_MD"
}

# Generate analysis report
generate_analysis_report() {
    log_info "Generating analysis report..."
    
    cat > "$ANALYSIS_REPORT" << 'EOF'
# NAS Content Analysis Report

## Overview

This report provides an analysis of the NAS content for integration into the pm-tools-templates repository.

## Key Findings

### File Age Analysis
EOF
    
    # Analyze file ages
    local old_files=$(tail -n +2 "$INVENTORY_CSV" | awk -F',' '{
        modified=$7
        gsub(/"/, "", modified)
        if (match(modified, /201[0-3]/)) print $0
    }' | wc -l | xargs)
    
    local medium_files=$(tail -n +2 "$INVENTORY_CSV" | awk -F',' '{
        modified=$7
        gsub(/"/, "", modified)
        if (match(modified, /201[4-7]/)) print $0
    }' | wc -l | xargs)
    
    local recent_files=$(tail -n +2 "$INVENTORY_CSV" | awk -F',' '{
        modified=$7
        gsub(/"/, "", modified)
        if (match(modified, /201[8-9]|202[0-9]/)) print $0
    }' | wc -l | xargs)
    
    cat >> "$ANALYSIS_REPORT" << EOF
- **Very Old (2010-2013):** $old_files files - May need significant updates
- **Somewhat Old (2014-2017):** $medium_files files - Likely need review and updates  
- **Recent (2018+):** $recent_files files - More likely to be current

### Integration Recommendations

#### High Priority (Immediate Integration Candidates)
EOF
    
    # Add high-priority recommendations
    tail -n +2 "$INVENTORY_CSV" | grep '"High"' | awk -F',' '{
        filename=$2
        type=$3
        gsub(/"/, "", filename)
        gsub(/"/, "", type)
        print "- **" filename "** (" type ") - Direct PM applicability"
    }' | head -10 >> "$ANALYSIS_REPORT"
    
    cat >> "$ANALYSIS_REPORT" << 'EOF'

#### Medium Priority (Requires Adaptation)
EOF
    
    tail -n +2 "$INVENTORY_CSV" | grep '"Medium"' | awk -F',' '{
        filename=$2
        type=$3
        gsub(/"/, "", filename)
        gsub(/"/, "", type)
        print "- **" filename "** (" type ") - Needs modification for PM use"
    }' | head -10 >> "$ANALYSIS_REPORT"
    
    cat >> "$ANALYSIS_REPORT" << 'EOF'

### Exclude from Integration

The following file types should be excluded:
- System files (._*, ~$*, Thumbs.db)
- Personal career documents
- Industry-specific non-PM content
- Outdated technology-specific content

### Next Steps

1. **Manual Review Required:** Files marked as "Review" need individual assessment
2. **Metadata Sanitization:** All files require PII/sensitive information removal
3. **Content Updates:** Older files need currency and relevance updates
4. **Format Standardization:** Convert all templates to repository standards

EOF
    
    log_success "Analysis report generated: $ANALYSIS_REPORT"
}

# Main inventory function
run_inventory() {
    log_info "Starting NAS inventory process..."
    
    check_nas_access
    generate_csv_inventory
    generate_markdown_inventory
    generate_analysis_report
    
    log_success "✅ NAS inventory completed successfully!"
    log_info "Generated files:"
    log_info "  - CSV Inventory: $INVENTORY_CSV"
    log_info "  - Markdown Report: $INVENTORY_MD"
    log_info "  - Analysis Report: $ANALYSIS_REPORT"
}

# CLI handling
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-inventory}" in
        inventory)
            run_inventory
            ;;
        help|--help|-h)
            echo "Usage: $0 [inventory|help]"
            echo ""
            echo "Commands:"
            echo "  inventory   Generate comprehensive NAS inventory (default)"
            echo "  help        Show this help message"
            echo ""
            echo "Output:"
            echo "  Files will be generated in: $OUTPUT_DIR"
            ;;
        *)
            log_error "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
fi
