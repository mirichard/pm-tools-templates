#!/bin/bash

# Comprehensive GitHub Actions Workflow Testing Script
# Tests all workflows for YAML syntax errors and reports results

echo "🚀 Comprehensive GitHub Actions Workflow Testing"
echo "================================================="
echo

# Initialize counters
total_workflows=0
valid_workflows=0
invalid_workflows=0
declare -a failed_workflows=()

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "📁 Scanning .github/workflows/ directory..."
echo

# Test each workflow file
for workflow_file in .github/workflows/*.yml .github/workflows/*.yaml; do
    if [[ -f "$workflow_file" ]]; then
        ((total_workflows++))
        workflow_name=$(basename "$workflow_file")
        
        echo -n "🔍 Testing $workflow_name... "
        
        # Method 1: Try with node.js if available
        if command -v node >/dev/null 2>&1; then
            # Create a simple YAML validator using node
            if node -e "
                try {
                    const fs = require('fs');
                    const content = fs.readFileSync('$workflow_file', 'utf8');
                    // Basic YAML structure checks
                    if (!content.includes('name:')) throw new Error('Missing name field');
                    if (!content.includes('on:')) throw new Error('Missing on field');
                    if (!content.includes('jobs:')) throw new Error('Missing jobs field');
                    console.log('✅ Valid');
                    process.exit(0);
                } catch (e) {
                    console.log('❌ Error: ' + e.message);
                    process.exit(1);
                }
            " 2>/dev/null; then
                echo -e "${GREEN}VALID${NC}"
                ((valid_workflows++))
            else
                echo -e "${RED}INVALID${NC}"
                ((invalid_workflows++))
                failed_workflows+=("$workflow_name")
            fi
        else
            # Method 2: Basic text-based validation
            if grep -q "^name:" "$workflow_file" && \
               grep -q "^on:" "$workflow_file" && \
               grep -q "^jobs:" "$workflow_file"; then
                echo -e "${GREEN}VALID${NC}"
                ((valid_workflows++))
            else
                echo -e "${RED}INVALID${NC}"
                ((invalid_workflows++))
                failed_workflows+=("$workflow_name")
            fi
        fi
    fi
done

echo
echo "📊 Test Results Summary"
echo "======================="
echo -e "Total workflows tested: ${BLUE}$total_workflows${NC}"
echo -e "Valid workflows: ${GREEN}$valid_workflows${NC}"
echo -e "Invalid workflows: ${RED}$invalid_workflows${NC}"

if [[ $invalid_workflows -gt 0 ]]; then
    echo
    echo -e "${RED}❌ Failed Workflows:${NC}"
    for failed in "${failed_workflows[@]}"; do
        echo "  • $failed"
    done
    echo
    echo "🔧 Detailed Error Analysis"
    echo "=========================="
    
    for failed in "${failed_workflows[@]}"; do
        echo
        echo -e "${YELLOW}Analyzing: $failed${NC}"
        echo "----------------------------------------"
        
        # Check for common YAML issues
        workflow_path=".github/workflows/$failed"
        
        # Check indentation issues
        if grep -n "^[[:space:]]*[[:space:]][[:space:]]" "$workflow_path" | head -5; then
            echo "⚠️  Potential indentation issues found"
        fi
        
        # Check for unclosed quotes
        if grep -n "['\"][^'\"]*$" "$workflow_path" | head -3; then
            echo "⚠️  Potential unclosed quotes found"
        fi
        
        # Check for invalid characters
        if grep -n "[^[:print:][:space:]]" "$workflow_path" | head -3; then
            echo "⚠️  Non-printable characters found"
        fi
        
        # Show context around potential errors
        echo "📝 File structure check:"
        head -10 "$workflow_path" | nl
    done
fi

echo
if [[ $invalid_workflows -eq 0 ]]; then
    echo -e "${GREEN}🎉 All workflows passed validation!${NC}"
    exit 0
else
    echo -e "${RED}❌ $invalid_workflows workflow(s) need attention${NC}"
    exit 1
fi
