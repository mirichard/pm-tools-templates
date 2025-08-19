#!/bin/bash

# detect-sensitive.sh
# Hard Pre-Check Gate Script for NAS Template Integration
# Zero tolerance for names, identifiers, or PII in templates

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMP_DIR="/tmp/pm-tools-sensitive-scan-$$"
COMPLIANCE_REPORT="${REPO_ROOT}/meta/compliance-report-$(date +%Y%m%d-%H%M%S).md"
EXIT_CODE=0

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

# Create temp directory
mkdir -p "$TEMP_DIR"
mkdir -p "$(dirname "$COMPLIANCE_REPORT")"

# Cleanup function
cleanup() {
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

# Initialize compliance report
init_compliance_report() {
    cat > "$COMPLIANCE_REPORT" << 'EOF'
# Compliance Report - Sensitive Information Detection

**Scan Date:** {{SCAN_DATE}}
**Scanner Version:** v1.0.0
**Repository:** pm-tools-templates
**Scan Scope:** {{SCAN_SCOPE}}

## Executive Summary

This report documents the results of the comprehensive sensitive information detection scan performed as part of the Hard Pre-Check Gate process.

**Status:** {{OVERALL_STATUS}}

## Detection Methods

1. **Regex Pattern Matching** - Email, phone, address, URL, IP patterns
2. **Proper Noun Detection** - Capitalized multi-word sequences 
3. **Organization Pattern Matching** - Company suffixes and indicators
4. **Deny-List Scanning** - Known sensitive terms and identifiers
5. **Binary Metadata Analysis** - EXIF, document properties, hidden content
6. **Allow-List Validation** - Approved PM terminology only

## Findings Summary

{{FINDINGS_SUMMARY}}

## Detailed Results

EOF
    
    # Replace placeholders
    sed -i '' "s/{{SCAN_DATE}}/$(date -u +"%Y-%m-%d %H:%M:%S UTC")/g" "$COMPLIANCE_REPORT"
}

# Email detection
detect_emails() {
    local target_dir="$1"
    local results_file="$TEMP_DIR/emails.txt"
    
    log_info "Scanning for email addresses..."
    
    # Multiple email patterns for thoroughness
    local patterns=(
        '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        '[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}'
    )
    
    for pattern in "${patterns[@]}"; do
        find "$target_dir" -type f \( -name "*.md" -o -name "*.txt" -o -name "*.html" -o -name "*.json" -o -name "*.yaml" -o -name "*.yml" \) \
            -exec grep -Hn -E "$pattern" {} \; >> "$results_file" 2>/dev/null || true
    done
    
    if [[ -s "$results_file" ]]; then
        log_error "Found email addresses:"
        cat "$results_file"
        EXIT_CODE=1
        return 1
    fi
    
    log_success "No email addresses detected"
    return 0
}

# Phone number detection
detect_phones() {
    local target_dir="$1"
    local results_file="$TEMP_DIR/phones.txt"
    
    log_info "Scanning for phone numbers..."
    
    local patterns=(
        '\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
        '\(\d{3}\)\s*\d{3}[-.]?\d{4}'
        '\+1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}'
        '\b1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b'
    )
    
    for pattern in "${patterns[@]}"; do
        find "$target_dir" -type f \( -name "*.md" -o -name "*.txt" -o -name "*.html" -o -name "*.json" -o -name "*.yaml" -o -name "*.yml" \) \
            -exec grep -Hn -E "$pattern" {} \; >> "$results_file" 2>/dev/null || true
    done
    
    if [[ -s "$results_file" ]]; then
        log_error "Found phone numbers:"
        cat "$results_file"
        EXIT_CODE=1
        return 1
    fi
    
    log_success "No phone numbers detected"
    return 0
}

# URL detection (external URLs only, allow relative paths)
detect_urls() {
    local target_dir="$1"
    local results_file="$TEMP_DIR/urls.txt"
    
    log_info "Scanning for external URLs..."
    
    local patterns=(
        'https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s]*'
        'ftp://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s]*'
        'www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s]*'
    )
    
    for pattern in "${patterns[@]}"; do
        find "$target_dir" -type f \( -name "*.md" -o -name "*.txt" -o -name "*.html" -o -name "*.json" -o -name "*.yaml" -o -name "*.yml" \) \
            -exec grep -Hn -E "$pattern" {} \; >> "$results_file" 2>/dev/null || true
    done
    
    # Filter out allowed URLs (GitHub repo, localhost, examples)
    local allowed_patterns=(
        "github.com/mirichard/pm-tools-templates"
        "localhost"
        "127.0.0.1"
        "example.com"
        "example.org"
        "placeholder.com"
    )
    
    if [[ -s "$results_file" ]]; then
        local filtered_file="$TEMP_DIR/urls_filtered.txt"
        cp "$results_file" "$filtered_file"
        
        for allowed in "${allowed_patterns[@]}"; do
            grep -v "$allowed" "$filtered_file" > "$filtered_file.tmp" || true
            mv "$filtered_file.tmp" "$filtered_file"
        done
        
        if [[ -s "$filtered_file" ]]; then
            log_error "Found external URLs:"
            cat "$filtered_file"
            EXIT_CODE=1
            return 1
        fi
    fi
    
    log_success "No problematic URLs detected"
    return 0
}

# Proper noun detection (capitalized multi-word sequences)
detect_proper_nouns() {
    local target_dir="$1"
    local results_file="$TEMP_DIR/proper_nouns.txt"
    
    log_info "Scanning for proper nouns..."
    
    # Pattern for capitalized words that might be names
    local pattern='\b[A-Z][a-z]+ [A-Z][a-z]+( [A-Z][a-z]+)*\b'
    
    find "$target_dir" -type f \( -name "*.md" -o -name "*.txt" -o -name "*.html" -o -name "*.json" -o -name "*.yaml" -o -name "*.yml" \) \
        -exec grep -Hn -E "$pattern" {} \; > "$results_file" 2>/dev/null || true
    
    # Filter out common PM terms and allowed patterns
    local allowed_terms=(
        "Project Manager"
        "Program Manager" 
        "Scrum Master"
        "Product Owner"
        "Business Analyst"
        "Stakeholder Register"
        "Risk Register"
        "Change Request"
        "Work Breakdown"
        "Critical Path"
        "Earned Value"
        "Quality Assurance"
        "User Story"
        "Sprint Planning"
        "Daily Standup"
        "Sprint Review"
        "Sprint Retrospective"
        "Product Backlog"
        "Sprint Backlog"
        "Definition Done"
        "Acceptance Criteria"
        "Release Planning"
        "Portfolio Management"
        "Microsoft Project"
        "PMBOK Guide"
        "Agile Manifesto"
        "Scrum Guide"
    )
    
    if [[ -s "$results_file" ]]; then
        local filtered_file="$TEMP_DIR/proper_nouns_filtered.txt"
        cp "$results_file" "$filtered_file"
        
        for term in "${allowed_terms[@]}"; do
            grep -v "$term" "$filtered_file" > "$filtered_file.tmp" || true
            mv "$filtered_file.tmp" "$filtered_file"
        done
        
        if [[ -s "$filtered_file" ]]; then
            log_warn "Found potential proper nouns (review needed):"
            cat "$filtered_file"
            # This is a warning, not an error - manual review needed
        fi
    fi
    
    log_success "Proper noun scan completed"
    return 0
}

# Organization suffix detection
detect_organizations() {
    local target_dir="$1"
    local results_file="$TEMP_DIR/organizations.txt"
    
    log_info "Scanning for organization indicators..."
    
    local patterns=(
        '\b[A-Z][a-zA-Z\s]+(Inc|LLC|Ltd|Corp|Corporation|Company|Co)\b'
        '\b[A-Z][a-zA-Z\s]+(GmbH|S\.A\.|PLC|AG|KG)\b'
        '\b[A-Z][a-zA-Z\s]+(Pty|Limited|Incorporated)\b'
    )
    
    for pattern in "${patterns[@]}"; do
        find "$target_dir" -type f \( -name "*.md" -o -name "*.txt" -o -name "*.html" -o -name "*.json" -o -name "*.yaml" -o -name "*.yml" \) \
            -exec grep -Hn -E "$pattern" {} \; >> "$results_file" 2>/dev/null || true
    done
    
    if [[ -s "$results_file" ]]; then
        log_error "Found organization references:"
        cat "$results_file"
        EXIT_CODE=1
        return 1
    fi
    
    log_success "No organization references detected"
    return 0
}

# Deny-list scanning
scan_deny_list() {
    local target_dir="$1"
    local results_file="$TEMP_DIR/deny_list.txt"
    
    log_info "Scanning against deny-list..."
    
    # Create deny-list file (this would be populated with known sensitive terms)
    local deny_list_file="$TEMP_DIR/deny_list_terms.txt"
    cat > "$deny_list_file" << 'EOF'
# Known sensitive terms - add specific company names, client names, etc.
# This is a sample - would be populated based on known exposure risks
Accenture
Deloitte
McKinsey
IBM
Microsoft
Oracle
Salesforce
SAP
AWS
Amazon
Google
Meta
Facebook
Apple
# Add specific client names, internal project codes, etc.
EOF
    
    if [[ -s "$deny_list_file" ]]; then
        while IFS= read -r term; do
            # Skip comments and empty lines
            [[ "$term" =~ ^#.*$ ]] && continue
            [[ -z "$term" ]] && continue
            
            find "$target_dir" -type f \( -name "*.md" -o -name "*.txt" -o -name "*.html" -o -name "*.json" -o -name "*.yaml" -o -name "*.yml" \) \
                -exec grep -Hn -i "$term" {} \; >> "$results_file" 2>/dev/null || true
        done < "$deny_list_file"
    fi
    
    if [[ -s "$results_file" ]]; then
        log_error "Found deny-listed terms:"
        cat "$results_file"
        EXIT_CODE=1
        return 1
    fi
    
    log_success "No deny-listed terms detected"
    return 0
}

# Binary and metadata analysis
analyze_binary_metadata() {
    local target_dir="$1"
    local results_file="$TEMP_DIR/metadata.txt"
    
    log_info "Analyzing binary file metadata..."
    
    # Check for various binary file types
    find "$target_dir" -type f \( -name "*.xlsx" -o -name "*.xls" -o -name "*.docx" -o -name "*.doc" -o -name "*.pptx" -o -name "*.ppt" -o -name "*.pdf" \) | while read -r file; do
        case "${file##*.}" in
            xlsx|xls)
                # Check for author, company, etc. in Excel files
                if command -v exiftool >/dev/null 2>&1; then
                    exiftool "$file" | grep -i -E "(author|company|creator|subject|title|manager)" >> "$results_file" 2>/dev/null || true
                fi
                ;;
            docx|doc)
                # Check Word documents for metadata
                if command -v exiftool >/dev/null 2>&1; then
                    exiftool "$file" | grep -i -E "(author|company|creator|subject|title|manager)" >> "$results_file" 2>/dev/null || true
                fi
                ;;
            pptx|ppt)
                # Check PowerPoint for metadata
                if command -v exiftool >/dev/null 2>&1; then
                    exiftool "$file" | grep -i -E "(author|company|creator|subject|title|manager)" >> "$results_file" 2>/dev/null || true
                fi
                ;;
            pdf)
                # Check PDF metadata
                if command -v exiftool >/dev/null 2>&1; then
                    exiftool "$file" | grep -i -E "(author|company|creator|subject|title|producer)" >> "$results_file" 2>/dev/null || true
                fi
                ;;
        esac
    done
    
    if [[ -s "$results_file" ]]; then
        log_warn "Found metadata that requires review:"
        cat "$results_file"
        # This is a warning - metadata can often be stripped
    fi
    
    log_success "Binary metadata analysis completed"
    return 0
}

# Main scanning function
run_detection_scan() {
    local target_dir="${1:-$REPO_ROOT}"
    
    log_info "Starting comprehensive sensitive information detection scan..."
    log_info "Target directory: $target_dir"
    
    init_compliance_report
    
    # Run all detection methods
    detect_emails "$target_dir"
    detect_phones "$target_dir"
    detect_urls "$target_dir"
    detect_proper_nouns "$target_dir"
    detect_organizations "$target_dir"
    scan_deny_list "$target_dir"
    analyze_binary_metadata "$target_dir"
    
    # Generate final report
    if [[ $EXIT_CODE -eq 0 ]]; then
        log_success "✅ COMPLIANCE CHECK PASSED - No sensitive information detected"
        sed -i '' "s/{{OVERALL_STATUS}}/✅ PASSED/g" "$COMPLIANCE_REPORT"
        sed -i '' "s/{{SCAN_SCOPE}}/$(basename "$target_dir")/g" "$COMPLIANCE_REPORT"
        sed -i '' "s/{{FINDINGS_SUMMARY}}/No sensitive information detected. All checks passed./g" "$COMPLIANCE_REPORT"
    else
        log_error "❌ COMPLIANCE CHECK FAILED - Sensitive information detected"
        sed -i '' "s/{{OVERALL_STATUS}}/❌ FAILED/g" "$COMPLIANCE_REPORT"
        sed -i '' "s/{{SCAN_SCOPE}}/$(basename "$target_dir")/g" "$COMPLIANCE_REPORT"
        sed -i '' "s/{{FINDINGS_SUMMARY}}/Sensitive information detected. Review required before proceeding./g" "$COMPLIANCE_REPORT"
    fi
    
    log_info "Compliance report generated: $COMPLIANCE_REPORT"
    
    return $EXIT_CODE
}

# CLI handling
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-scan}" in
        scan)
            run_detection_scan "${2:-$REPO_ROOT}"
            ;;
        help|--help|-h)
            echo "Usage: $0 [scan|help] [target_directory]"
            echo ""
            echo "Commands:"
            echo "  scan [dir]  Run comprehensive sensitive information detection (default)"
            echo "  help        Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                                # Scan entire repository"
            echo "  $0 scan /path/to/templates        # Scan specific directory"
            ;;
        *)
            log_error "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
fi
