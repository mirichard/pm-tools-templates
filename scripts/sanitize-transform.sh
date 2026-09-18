#!/bin/bash

# sanitize-transform.sh
# Sanitizes and transforms NAS templates for repository integration
# Removes PII, converts formats, adds YAML front matter, creates placeholders

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
NAS_PATH="/Volumes/michael_share/Career/Tools and Templates"
OUTPUT_DIR="${REPO_ROOT}/staging/sanitized-templates"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Input from fit-gap analysis
FIT_GAP_DIR="${REPO_ROOT}/meta/fit-gap-analysis"
LATEST_FIT_GAP=$(find "$FIT_GAP_DIR" -name "fit-gap-matrix-*.csv" | sort | tail -1)

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

# Check prerequisites
check_prerequisites() {
    if [[ ! -f "$LATEST_FIT_GAP" ]]; then
        log_error "No fit-gap matrix found. Please run fit-gap-analysis.sh first."
        exit 1
    fi
    
    log_success "Using fit-gap matrix: $LATEST_FIT_GAP"
}

# Extract and convert Excel/Office content to CSV/text
extract_office_content() {
    local source_file="$1"
    local output_dir="$2"
    local basename=$(basename "$source_file" | sed 's/\.[^.]*$//')
    
    case "${source_file##*.}" in
        xlsx|xls)
            log_info "Extracting Excel content from: $(basename "$source_file")"
            # Use Python to extract Excel content if available
            if command -v python3 >/dev/null 2>&1; then
                python3 -c "
import pandas as pd
import sys
import os

try:
    file_path = sys.argv[1]
    output_dir = sys.argv[2]
    basename = sys.argv[3]
    
    # Read all sheets
    xlsx_file = pd.ExcelFile(file_path)
    for sheet_name in xlsx_file.sheet_names:
        df = pd.read_excel(file_path, sheet_name=sheet_name)
        output_file = os.path.join(output_dir, f'{basename}_{sheet_name}.csv')
        df.to_csv(output_file, index=False)
        print(f'Extracted sheet: {sheet_name}')
except Exception as e:
    print(f'Error extracting Excel: {e}', file=sys.stderr)
    sys.exit(1)
                " "$source_file" "$output_dir" "$basename" || {
                    log_warn "Failed to extract Excel content, copying original file"
                    cp "$source_file" "$output_dir/"
                }
            else
                log_warn "Python3 not available, copying Excel file as-is"
                cp "$source_file" "$output_dir/"
            fi
            ;;
        doc|docx)
            log_info "Extracting Word content from: $(basename "$source_file")"
            # Try to extract text using textutil (macOS)
            if command -v textutil >/dev/null 2>&1; then
                textutil -convert txt "$source_file" -output "$output_dir/${basename}.txt" || {
                    log_warn "Failed to extract Word content"
                    cp "$source_file" "$output_dir/"
                }
            else
                log_warn "textutil not available, copying Word file as-is"
                cp "$source_file" "$output_dir/"
            fi
            ;;
        pdf)
            log_info "Extracting PDF content from: $(basename "$source_file")"
            # Try to extract text using textutil or other tools
            if command -v textutil >/dev/null 2>&1; then
                textutil -convert txt "$source_file" -output "$output_dir/${basename}.txt" 2>/dev/null || {
                    log_warn "Failed to extract PDF content"
                    cp "$source_file" "$output_dir/"
                }
            else
                log_warn "PDF extraction not available, copying PDF file as-is"
                cp "$source_file" "$output_dir/"
            fi
            ;;
        ppt|pptx)
            log_info "PowerPoint file detected: $(basename "$source_file")"
            log_warn "PowerPoint content extraction requires manual review"
            cp "$source_file" "$output_dir/"
            ;;
        *)
            log_info "Copying file as-is: $(basename "$source_file")"
            cp "$source_file" "$output_dir/"
            ;;
    esac
}

# Clean and sanitize extracted content
sanitize_content() {
    local content_file="$1"
    local sanitized_file="${content_file%.txt}_sanitized.txt"
    
    if [[ ! -f "$content_file" ]]; then
        return
    fi
    
    log_info "Sanitizing content: $(basename "$content_file")"
    
    # Create sanitized version with placeholder replacements
    sed -e 's/[a-zA-Z0-9._%+-]\+@[a-zA-Z0-9.-]\+\.[a-zA-Z]\{2,\}/{{contact_email}}/g' \
        -e 's/\b[0-9]\{3\}[-. ]\?[0-9]\{3\}[-. ]\?[0-9]\{4\}\b/{{contact_phone}}/g' \
        -e 's/\b[A-Z][a-z]\+ [A-Z][a-z]\+\b/{{person_name}}/g' \
        -e 's/\b[A-Z][a-zA-Z ]\+ \(Inc\|LLC\|Ltd\|Corp\|Corporation\|Company\)\b/{{company_name}}/g' \
        "$content_file" > "$sanitized_file"
    
    log_success "Content sanitized: $(basename "$sanitized_file")"
}

# Generate YAML front matter based on template type
generate_yaml_frontmatter() {
    local filename="$1"
    local target_path="$2"
    local priority="$3"
    
    local title=$(echo "$filename" | sed 's/[_-]/ /g' | sed 's/\..*$//' | sed 's/.*/\L&/; s/[a-z]*/\u&/g')
    local template_type="template"
    local version="v1.0.0"
    local audience='["PM","Team"]'
    local tags='["project-management"]'
    
    # Customize based on target path
    if [[ "$target_path" =~ quality ]]; then
        tags='["quality-management","testing","checklist"]'
        audience='["PM","QA","Team"]'
    elif [[ "$target_path" =~ risk ]]; then
        tags='["risk-management","tracking","assessment"]'
    elif [[ "$target_path" =~ planning ]]; then
        tags='["project-planning","scope","estimation"]'
    elif [[ "$target_path" =~ requirements ]]; then
        tags='["requirements-management","analysis","documentation"]'
        audience='["PM","BA","Stakeholders"]'
    elif [[ "$target_path" =~ business-case ]]; then
        tags='["business-case","justification","roi"]'
        audience='["PM","Exec","Sponsors"]'
    elif [[ "$target_path" =~ status ]]; then
        tags='["status-reporting","communication","dashboards"]'
        audience='["PM","Stakeholders","Exec"]'
    elif [[ "$target_path" =~ metrics ]]; then
        tags='["metrics-reporting","kpi","measurement"]'
        audience='["PM","Exec","Team"]'
    fi
    
    # Determine if this is primarily internal or external facing
    local internal_view="true"
    local external_view="true"
    if [[ "$filename" =~ (internal|team|development) ]]; then
        external_view="false"
    elif [[ "$filename" =~ (client|customer|stakeholder|executive) ]]; then
        internal_view="false"
        external_view="true"
    fi
    
    cat << EOF
---
title: "$title"
version: "$version"
template_state: "clean"
intended_audience: $audience
internal_view: $internal_view
external_view: $external_view
dependencies: []
tags: $tags
description: "Sanitized template converted from legacy PM tools collection"
source_file: "$filename"
integration_date: "$(date -u +%Y-%m-%d)"
sanitization_level: "full"
---

EOF
}

# Convert template to Markdown format
convert_to_markdown() {
    local source_dir="$1"
    local target_dir="$2"
    local filename="$3"
    local target_path="$4"
    local priority="$5"
    
    local basename=$(basename "$filename" | sed 's/\.[^.]*$//')
    local md_filename="${basename}.md"
    local target_subdir="$(basename "$target_path")"
    local full_target_dir="$target_dir/$target_subdir"
    
    mkdir -p "$full_target_dir"
    
    local output_file="$full_target_dir/$md_filename"
    
    log_info "Converting to Markdown: $md_filename"
    
    # Generate front matter
    generate_yaml_frontmatter "$filename" "$target_path" "$priority" > "$output_file"
    
    # Add template content
    cat >> "$output_file" << 'EOF'
# {{template_title}}

## Purpose

This template provides a structured approach for {{template_purpose}}. It has been sanitized and converted from legacy project management tools to ensure consistency with modern PM practices.

## Instructions

1. Replace all placeholder values marked with {{double_braces}}
2. Customize sections based on your project context
3. Remove sections that don't apply to your specific use case
4. Update stakeholder information as appropriate

## Template Content

> **Note:** This content has been extracted and sanitized from original source files. Review and adapt as needed for your organization's specific requirements.

EOF
    
    # Add extracted content if available
    local sanitized_content=$(find "$source_dir" -name "${basename}*_sanitized.txt" | head -1)
    if [[ -f "$sanitized_content" ]]; then
        echo "" >> "$output_file"
        echo "### Extracted Content" >> "$output_file"
        echo "" >> "$output_file"
        echo '```' >> "$output_file"
        cat "$sanitized_content" >> "$output_file"
        echo '```' >> "$output_file"
    fi
    
    # Add usage instructions
    cat >> "$output_file" << 'EOF'

## Key Placeholders

Replace the following placeholders with your specific information:

- `{{project_name}}` - Name of your project
- `{{project_manager}}` - Project manager name
- `{{organization}}` - Your organization name
- `{{stakeholder_role}}` - Specific stakeholder roles
- `{{contact_email}}` - Relevant contact information
- `{{contact_phone}}` - Phone number if appropriate
- `{{person_name}}` - Individual names as needed
- `{{company_name}}` - Partner/vendor company names
- `{{date_placeholder}}` - Relevant dates
- `{{template_purpose}}` - Specific purpose for this template instance
- `{{template_title}}` - Descriptive title for the template

## Internal vs External Use

### Internal View
- Include technical details and internal processes
- Reference internal systems and tools
- Use internal terminology and abbreviations

### External View  
- Focus on outcomes and deliverables
- Use client/stakeholder-friendly language
- Emphasize business value and benefits

## Related Templates

- See `/templates/universal/` for additional project management templates
- Check `/examples/` for completed template samples
- Reference `/docs/` for detailed usage guides

---

*This template is part of the pm-tools-templates collection. For issues or improvements, please contribute back to the repository.*
EOF
    
    log_success "Markdown template created: $output_file"
    echo "$output_file"
}

# Process a single high-priority template
process_template() {
    local source_path="$1"
    local filename="$2"
    local target_path="$3"
    local priority="$4"
    
    if [[ "$priority" != "High" ]]; then
        log_info "Skipping non-high priority template: $filename"
        return
    fi
    
    local source_file="$NAS_PATH/$source_path"
    
    if [[ ! -f "$source_file" ]]; then
        log_error "Source file not found: $source_file"
        return
    fi
    
    log_info "Processing high-priority template: $filename"
    
    # Create working directory for this template
    local work_dir="$OUTPUT_DIR/working/$(basename "$filename" | sed 's/\.[^.]*$//')"
    mkdir -p "$work_dir"
    
    # Extract content from office files
    extract_office_content "$source_file" "$work_dir"
    
    # Find and sanitize extracted text files
    find "$work_dir" -name "*.txt" | while read -r txt_file; do
        sanitize_content "$txt_file"
    done
    
    # Convert to Markdown template
    local md_file=$(convert_to_markdown "$work_dir" "$OUTPUT_DIR/templates" "$filename" "$target_path" "$priority")
    
    log_success "Template processed: $filename → $(basename "$md_file")"
}

# Main processing function
process_high_priority_templates() {
    log_info "Processing high-priority templates for sanitization..."
    
    check_prerequisites
    
    # Process only high-priority rework-and-include templates
    tail -n +2 "$LATEST_FIT_GAP" | grep '"rework-and-include"' | grep '"High"' | while IFS=',' read -r source_path filename filetype pm_relevance size_bytes modified_date proposed_action rationale target_repo_path priority dependencies notes; do
        # Remove quotes from CSV fields
        source_path=$(echo "$source_path" | tr -d '"')
        filename=$(echo "$filename" | tr -d '"') 
        target_repo_path=$(echo "$target_repo_path" | tr -d '"')
        priority=$(echo "$priority" | tr -d '"')
        
        process_template "$source_path" "$filename" "$target_repo_path" "$priority"
    done
    
    log_success "High-priority template processing completed!"
    log_info "Sanitized templates available in: $OUTPUT_DIR"
}

# CLI handling
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-process}" in
        process)
            process_high_priority_templates
            ;;
        help|--help|-h)
            echo "Usage: $0 [process|help]"
            echo ""
            echo "Commands:"
            echo "  process     Process high-priority templates for sanitization (default)"
            echo "  help        Show this help message"
            echo ""
            echo "Prerequisites:"
            echo "  - fit-gap-analysis.sh must be run first"
            echo "  - NAS directory must be accessible"
            echo ""
            echo "Output:"
            echo "  Sanitized templates will be created in: $OUTPUT_DIR"
            ;;
        *)
            log_error "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
fi
