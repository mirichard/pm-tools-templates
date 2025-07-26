#!/bin/bash

# Task Verification Enforcement Script
# This script helps ensure the .warp.md verification rules are followed

set -euo pipefail

echo "🔍 Task Verification Enforcement Check"
echo "======================================"

# Check if response contains forbidden completion phrases without evidence
check_forbidden_phrases() {
    local response_text="$1"
    local forbidden_phrases=("Task complete" "Done" "Finished" "Resolved" "✅.*complete")
    local has_evidence=false
    
    # Check for evidence indicators
    if echo "$response_text" | grep -E "(exit code|command executed|test.*pass|workflow run|verification summary)" > /dev/null; then
        has_evidence=true
    fi
    
    for phrase in "${forbidden_phrases[@]}"; do
        if echo "$response_text" | grep -iE "$phrase" > /dev/null; then
            if [ "$has_evidence" = false ]; then
                echo "❌ VERIFICATION VIOLATION: Found '$phrase' without evidence"
                return 1
            fi
        fi
    done
    
    return 0
}

# Check if response has required verification template
check_verification_template() {
    local response_text="$1"
    
    if ! echo "$response_text" | grep -E "TASK VERIFICATION STATUS|VERIFICATION SUMMARY" > /dev/null; then
        echo "❌ MISSING: Required verification template not found"
        return 1
    fi
    
    if ! echo "$response_text" | grep -E "(COMPLETE|INCOMPLETE|PENDING)" > /dev/null; then
        echo "❌ MISSING: Status declaration not found"
        return 1
    fi
    
    return 0
}

# Main verification check
main() {
    if [ $# -eq 0 ]; then
        echo "Usage: $0 <response_text_file>"
        echo "   or: echo 'response' | $0"
        exit 1
    fi
    
    local response_text
    if [ -t 0 ]; then
        # Reading from file
        response_text=$(cat "$1")
    else
        # Reading from stdin
        response_text=$(cat)
    fi
    
    echo "🔍 Checking response for verification compliance..."
    
    local violations=0
    
    if ! check_forbidden_phrases "$response_text"; then
        ((violations++))
    fi
    
    if ! check_verification_template "$response_text"; then
        ((violations++))
    fi
    
    if [ $violations -eq 0 ]; then
        echo "✅ VERIFICATION COMPLIANCE: Response follows .warp.md rules"
        return 0
    else
        echo "❌ VERIFICATION VIOLATIONS: $violations rule(s) broken"
        echo ""
        echo "📋 Required Actions:"
        echo "1. Add verification evidence (commands, exit codes, logs)"
        echo "2. Include TASK VERIFICATION STATUS template"
        echo "3. Use proper status declarations (COMPLETE/INCOMPLETE/PENDING)"
        echo "4. Remove completion claims without evidence"
        return 1
    fi
}

main "$@"
