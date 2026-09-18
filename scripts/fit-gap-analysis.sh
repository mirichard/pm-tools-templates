#!/bin/bash

# fit-gap-analysis.sh  
# Detailed fit-gap analysis for NAS template integration
# Classifies files as include-as-is, rework-and-include, or exclude

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
NAS_PATH="/Volumes/michael_share/Career/Tools and Templates"
OUTPUT_DIR="${REPO_ROOT}/meta/fit-gap-analysis"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Input from previous inventory
INVENTORY_DIR="${REPO_ROOT}/meta/nas-inventory"
LATEST_INVENTORY=$(find "$INVENTORY_DIR" -name "nas-inventory-*.csv" | sort | tail -1)

# Output files
FIT_GAP_CSV="${OUTPUT_DIR}/fit-gap-matrix-${TIMESTAMP}.csv"
FIT_GAP_MD="${OUTPUT_DIR}/fit-gap-analysis-${TIMESTAMP}.md"
INTEGRATION_PLAN="${OUTPUT_DIR}/integration-plan-${TIMESTAMP}.md"

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
    if [[ ! -f "$LATEST_INVENTORY" ]]; then
        log_error "No inventory file found. Please run inventory-nas.sh first."
        exit 1
    fi
    
    log_success "Using inventory file: $LATEST_INVENTORY"
}

# Classify file for integration based on detailed criteria
classify_for_integration() {
    local filepath="$1"
    local filename="$2"
    local filetype="$3"
    local pm_relevance="$4"
    local size_bytes="$5"
    local modified_date="$6"
    
    local filename_lower=$(echo "$filename" | tr '[:upper:]' '[:lower:]')
    local classification=""
    local rationale=""
    local target_path=""
    local priority="Medium"
    
    # First check - exclude categories
    if [[ "$filetype" == "System File" ]] || [[ "$filetype" == "Temp File" ]]; then
        classification="exclude"
        rationale="System/temporary file - not relevant for PM templates"
        echo "$classification|$rationale|$target_path|$priority"
        return
    fi
    
    # Career/personal development files - exclude
    if [[ "$filename_lower" =~ (career|interview|networking|job|search|positioning|marketplace|succeeding) ]]; then
        classification="exclude" 
        rationale="Personal/career development content - outside PM tools scope"
        echo "$classification|$rationale|$target_path|$priority"
        return
    fi
    
    # Industry-specific non-PM content
    if [[ "$filename_lower" =~ (biopharmaceutical|accounting|cars|dictionary|webmethods|cookbook) ]]; then
        classification="exclude"
        rationale="Industry/technology-specific content not suitable for generic PM templates"
        echo "$classification|$rationale|$target_path|$priority"
        return
    fi
    
    # Large binary files that are likely presentations/whitepapers
    if [[ "$size_bytes" -gt 5000000 ]] && [[ "$filetype" =~ (PowerPoint|PDF|Word) ]]; then
        classification="exclude"
        rationale="Large presentation/document - likely contains specific content not suitable for templates"
        echo "$classification|$rationale|$target_path|$priority"
        return
    fi
    
    # Now classify for inclusion based on PM relevance and file characteristics
    case "$pm_relevance" in
        "High")
            # High relevance files - analyze for best integration approach
            if [[ "$filename_lower" =~ (template|checklist|matrix|register) ]]; then
                if [[ "$filetype" =~ (Excel|Word) ]]; then
                    classification="rework-and-include"
                    rationale="PM template/tool - needs format conversion and sanitization"
                    priority="High"
                    
                    # Determine target path based on content type
                    if [[ "$filename_lower" =~ (test|qa|quality) ]]; then
                        target_path="templates/universal/quality-management/"
                    elif [[ "$filename_lower" =~ (risk|defect) ]]; then
                        target_path="templates/universal/risk-management/"
                    elif [[ "$filename_lower" =~ (project|plan|scope|charter) ]]; then
                        target_path="templates/universal/project-planning/"
                    elif [[ "$filename_lower" =~ (release|deployment) ]]; then
                        target_path="templates/universal/deployment-management/"
                    elif [[ "$filename_lower" =~ (requirement|functional) ]]; then
                        target_path="templates/universal/requirements-management/"
                    elif [[ "$filename_lower" =~ (estimation|metric|kpi) ]]; then
                        target_path="templates/universal/metrics-reporting/"
                    else
                        target_path="templates/universal/project-management/"
                    fi
                else
                    classification="rework-and-include"
                    rationale="PM content in presentation format - extract key templates/frameworks"
                    priority="Medium"
                    target_path="docs/frameworks/"
                fi
            elif [[ "$filename_lower" =~ (guide|guidebook|toolkit|playbook) ]]; then
                classification="rework-and-include"
                rationale="PM guide/toolkit - extract reusable templates and processes"
                priority="High"
                target_path="docs/guides/"
            elif [[ "$filename_lower" =~ (dashboard|status|report) ]]; then
                classification="rework-and-include"
                rationale="Reporting template - convert to generic template format"
                priority="Medium"
                target_path="templates/universal/status-reporting/"
            elif [[ "$filename_lower" =~ (business.case|proposal) ]]; then
                classification="rework-and-include" 
                rationale="Business case template - high value for PM workflows"
                priority="High"
                target_path="templates/universal/business-case/"
            else
                classification="rework-and-include"
                rationale="High PM relevance - detailed review needed for best integration approach"
                priority="Medium"
                target_path="templates/universal/project-management/"
            fi
            ;;
        "Medium")
            # Medium relevance - usually needs significant rework
            classification="rework-and-include"
            rationale="Potentially useful content - significant adaptation required"
            priority="Low"
            target_path="templates/universal/specialized/"
            ;;
        "Low")
            classification="exclude"
            rationale="Limited PM applicability - not worth integration effort"
            ;;
        "Review")
            # Need to make educated guesses based on filename
            if [[ "$filename_lower" =~ (evm|earned.value) ]]; then
                classification="rework-and-include"
                rationale="Earned Value Management content - valuable for traditional PM"
                priority="Medium"
                target_path="templates/traditional/earned-value/"
            elif [[ "$filename_lower" =~ (agile|scrum|lifecycle) ]]; then
                classification="rework-and-include"
                rationale="Agile methodology content - extract templates and guides"
                priority="Medium"
                target_path="templates/agile/methodology/"
            elif [[ "$filename_lower" =~ (process|workflow|flow) ]]; then
                classification="rework-and-include"
                rationale="Process documentation - may contain reusable PM processes"
                priority="Low"
                target_path="docs/processes/"
            else
                classification="manual-review"
                rationale="Requires manual inspection to determine PM value and integration approach"
                priority="Low"
                target_path="TBD"
            fi
            ;;
        *)
            classification="manual-review"
            rationale="Unknown PM relevance - manual review required"
            priority="Low"
            target_path="TBD"
            ;;
    esac
    
    echo "$classification|$rationale|$target_path|$priority"
}

# Generate fit-gap matrix
generate_fit_gap_matrix() {
    log_info "Generating fit-gap analysis matrix..."
    
    # CSV Header
    cat > "$FIT_GAP_CSV" << 'EOF'
source_path,filename,filetype,pm_relevance,size_bytes,modified_date,proposed_action,rationale,target_repo_path,priority,dependencies,notes
EOF
    
    # Process each file from inventory
    tail -n +2 "$LATEST_INVENTORY" | while IFS=',' read -r path filename filetype extension size_bytes size_human modified_date pm_relevance classification metadata notes; do
        # Remove quotes from CSV fields
        path=$(echo "$path" | tr -d '"')
        filename=$(echo "$filename" | tr -d '"') 
        filetype=$(echo "$filetype" | tr -d '"')
        pm_relevance=$(echo "$pm_relevance" | tr -d '"')
        size_bytes=$(echo "$size_bytes" | tr -d '"')
        modified_date=$(echo "$modified_date" | tr -d '"')
        
        # Get classification
        result=$(classify_for_integration "$path" "$filename" "$filetype" "$pm_relevance" "$size_bytes" "$modified_date")
        IFS='|' read -r proposed_action rationale target_path priority <<< "$result"
        
        # Determine dependencies
        dependencies=""
        if [[ "$filetype" =~ (Excel|Word|PowerPoint) ]]; then
            dependencies="Format conversion, Metadata sanitization"
        elif [[ "$filetype" == "PDF Document" ]]; then
            dependencies="Content extraction, Format conversion"
        elif [[ "$filetype" == "Visio Diagram" ]]; then
            dependencies="Diagram conversion or recreation"
        fi
        
        # Add notes based on file age
        file_notes=""
        if [[ "$modified_date" =~ 201[0-3] ]]; then
            file_notes="Very old file - significant updates likely needed"
        elif [[ "$modified_date" =~ 201[4-7] ]]; then
            file_notes="Older file - review for currency"
        fi
        
        # Output CSV row (escape commas in fields)
        filename_escaped=$(echo "$filename" | sed 's/,/;/g')
        rationale_escaped=$(echo "$rationale" | sed 's/,/;/g')
        dependencies_escaped=$(echo "$dependencies" | sed 's/,/;/g')
        notes_escaped=$(echo "$file_notes" | sed 's/,/;/g')
        
        echo "\"$path\",\"$filename_escaped\",\"$filetype\",\"$pm_relevance\",\"$size_bytes\",\"$modified_date\",\"$proposed_action\",\"$rationale_escaped\",\"$target_path\",\"$priority\",\"$dependencies_escaped\",\"$notes_escaped\"" >> "$FIT_GAP_CSV"
    done
    
    log_success "Fit-gap matrix generated: $FIT_GAP_CSV"
}

# Generate markdown analysis report
generate_analysis_report() {
    log_info "Generating fit-gap analysis report..."
    
    local total_files=$(tail -n +2 "$FIT_GAP_CSV" | wc -l | xargs)
    local include_count=$(tail -n +2 "$FIT_GAP_CSV" | grep '"include-as-is"' | wc -l | xargs)
    local rework_count=$(tail -n +2 "$FIT_GAP_CSV" | grep '"rework-and-include"' | wc -l | xargs)
    local exclude_count=$(tail -n +2 "$FIT_GAP_CSV" | grep '"exclude"' | wc -l | xargs)
    local review_count=$(tail -n +2 "$FIT_GAP_CSV" | grep '"manual-review"' | wc -l | xargs)
    
    cat > "$FIT_GAP_MD" << EOF
# Fit-Gap Analysis Report

**Generated:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")  
**Source Inventory:** $LATEST_INVENTORY  
**Total Files Analyzed:** $total_files  

## Executive Summary

This report provides a comprehensive fit-gap analysis for integrating NAS templates into the pm-tools-templates repository.

### Classification Summary

| Action | Count | Percentage | Description |
|--------|-------|------------|-------------|
| Include As-Is | $include_count | $((include_count * 100 / total_files))% | Ready for integration with minimal changes |
| Rework & Include | $rework_count | $((rework_count * 100 / total_files))% | Valuable content requiring adaptation |
| Exclude | $exclude_count | $((exclude_count * 100 / total_files))% | Not suitable for integration |
| Manual Review | $review_count | $((review_count * 100 / total_files))% | Requires individual assessment |

## High Priority Integration Candidates

The following files have been identified as high-priority for immediate integration:

EOF
    
    # Add high priority items
    tail -n +2 "$FIT_GAP_CSV" | grep '"High"' | awk -F',' '{
        filename=$2
        action=$7
        rationale=$8
        target=$9
        gsub(/"/, "", filename)
        gsub(/"/, "", action)
        gsub(/"/, "", rationale)
        gsub(/"/, "", target)
        printf "### %s\n- **Action:** %s\n- **Target:** %s\n- **Rationale:** %s\n\n", filename, action, target, rationale
    }' >> "$FIT_GAP_MD"
    
    cat >> "$FIT_GAP_MD" << 'EOF'

## Integration Categories

### Templates & Tools (High Value)
EOF
    
    tail -n +2 "$FIT_GAP_CSV" | grep '"rework-and-include"' | grep '"High"' | awk -F',' '{
        filename=$2
        target=$9
        gsub(/"/, "", filename)
        gsub(/"/, "", target)
        printf "- **%s** → %s\n", filename, target
    }' >> "$FIT_GAP_MD"
    
    cat >> "$FIT_GAP_MD" << 'EOF'

### Guides & Documentation (Medium Value)
EOF
    
    tail -n +2 "$FIT_GAP_CSV" | grep '"rework-and-include"' | grep '"Medium"' | awk -F',' '{
        filename=$2
        target=$9
        gsub(/"/, "", filename)
        gsub(/"/, "", target)
        printf "- **%s** → %s\n", filename, target
    }' >> "$FIT_GAP_MD"
    
    cat >> "$FIT_GAP_MD" << 'EOF'

## Exclusion Rationale

The following files are recommended for exclusion:

EOF
    
    tail -n +2 "$FIT_GAP_CSV" | grep '"exclude"' | awk -F',' '{
        filename=$2
        rationale=$8
        gsub(/"/, "", filename)
        gsub(/"/, "", rationale)
        printf "- **%s**: %s\n", filename, rationale
    }' | head -20 >> "$FIT_GAP_MD"
    
    cat >> "$FIT_GAP_MD" << 'EOF'

## Manual Review Required

The following files require manual inspection:

EOF
    
    tail -n +2 "$FIT_GAP_CSV" | grep '"manual-review"' | awk -F',' '{
        filename=$2
        rationale=$8
        gsub(/"/, "", filename)
        gsub(/"/, "", rationale)
        printf "- **%s**: %s\n", filename, rationale
    }' >> "$FIT_GAP_MD"
    
    cat >> "$FIT_GAP_MD" << 'EOF'

## Next Steps

1. **Prioritize High-Value Templates**: Focus on files marked as "High" priority
2. **Sanitization Required**: All included files need PII/sensitive information removal
3. **Format Conversion**: Convert binary formats to Markdown where possible
4. **Manual Reviews**: Schedule review sessions for files requiring individual assessment
5. **Integration Planning**: Create detailed integration timeline based on priorities

## Dependencies & Risks

### Technical Dependencies
- ExifTool for metadata extraction and sanitization
- Format conversion tools for Office documents
- Diagram recreation tools for Visio files

### Risks
- **Content Currency**: Many files are 10+ years old and may need significant updates
- **Format Complexity**: Some Excel templates may lose functionality in conversion
- **Hidden Content**: Office documents may contain embedded sensitive information

EOF
    
    log_success "Fit-gap analysis report generated: $FIT_GAP_MD"
}

# Generate integration plan
generate_integration_plan() {
    log_info "Generating integration plan..."
    
    cat > "$INTEGRATION_PLAN" << 'EOF'
# NAS Integration Implementation Plan

## Phase 1: High Priority Templates (Week 1-2)

### Immediate Integration Candidates
EOF
    
    # Add high priority items with specific actions
    tail -n +2 "$FIT_GAP_CSV" | grep '"rework-and-include"' | grep '"High"' | awk -F',' '{
        filename=$2
        target=$9
        gsub(/"/, "", filename)
        gsub(/"/, "", target)
        printf "- [ ] **%s**\n  - Sanitize and convert format\n  - Map to: %s\n  - Create example usage\n  - Add YAML front matter\n\n", filename, target
    }' >> "$INTEGRATION_PLAN"
    
    cat >> "$INTEGRATION_PLAN" << 'EOF'

## Phase 2: Medium Priority Content (Week 3-4)

### Documentation & Guides
EOF
    
    tail -n +2 "$FIT_GAP_CSV" | grep '"rework-and-include"' | grep '"Medium"' | head -10 | awk -F',' '{
        filename=$2
        target=$9
        gsub(/"/, "", filename)
        gsub(/"/, "", target)
        printf "- [ ] **%s**\n  - Extract key concepts\n  - Target: %s\n  - Create supporting documentation\n\n", filename, target
    }' >> "$INTEGRATION_PLAN"
    
    cat >> "$INTEGRATION_PLAN" << 'EOF'

## Phase 3: Manual Review & Specialized Content (Week 5-6)

### Files Requiring Individual Assessment
EOF
    
    tail -n +2 "$FIT_GAP_CSV" | grep '"manual-review"' | head -10 | awk -F',' '{
        filename=$2
        rationale=$8
        gsub(/"/, "", filename)
        gsub(/"/, "", rationale)
        printf "- [ ] **%s**\n  - Review reason: %s\n  - Determine integration approach\n  - Assign to subject matter expert\n\n", filename, rationale
    }' >> "$INTEGRATION_PLAN"
    
    cat >> "$INTEGRATION_PLAN" << 'EOF'

## Success Criteria

### Phase 1 (High Priority)
- [ ] All high-priority templates sanitized and integrated
- [ ] Zero sensitive information in integrated content
- [ ] All templates follow repository conventions
- [ ] Examples created for each template
- [ ] Documentation updated

### Phase 2 (Medium Priority)  
- [ ] Key guides and frameworks extracted
- [ ] Supporting documentation created
- [ ] Cross-references established

### Phase 3 (Manual Review)
- [ ] All manual review items assessed
- [ ] Integration decisions documented
- [ ] Remaining valuable content integrated

## Quality Gates

### Pre-Integration Checklist (Per File)
- [ ] Hard pre-check gate passed (zero sensitive info)
- [ ] Format converted to repository standards
- [ ] YAML front matter added
- [ ] Placeholders implemented
- [ ] Internal/external views considered
- [ ] Example usage created
- [ ] README updated (minimal)

### Post-Integration Validation
- [ ] All links functional
- [ ] Markdown renders correctly
- [ ] Templates are usable
- [ ] Compliance report clean
- [ ] Peer review completed

EOF
    
    log_success "Integration plan generated: $INTEGRATION_PLAN"
}

# Main analysis function
run_fit_gap_analysis() {
    log_info "Starting comprehensive fit-gap analysis..."
    
    check_prerequisites
    generate_fit_gap_matrix
    generate_analysis_report
    generate_integration_plan
    
    log_success "✅ Fit-gap analysis completed successfully!"
    log_info "Generated files:"
    log_info "  - Fit-Gap Matrix: $FIT_GAP_CSV"
    log_info "  - Analysis Report: $FIT_GAP_MD"
    log_info "  - Integration Plan: $INTEGRATION_PLAN"
}

# CLI handling
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-analyze}" in
        analyze)
            run_fit_gap_analysis
            ;;
        help|--help|-h)
            echo "Usage: $0 [analyze|help]"
            echo ""
            echo "Commands:"
            echo "  analyze     Run comprehensive fit-gap analysis (default)"
            echo "  help        Show this help message"
            echo ""
            echo "Prerequisites:"
            echo "  - inventory-nas.sh must be run first"
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
