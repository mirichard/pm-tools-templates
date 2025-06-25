#!/bin/bash

# Workflow Error Analyzer Script
# Systematically collects and analyzes GitHub workflow failures

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOGS_DIR="$PROJECT_ROOT/workflow-analysis-logs"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ANALYSIS_FILE="$LOGS_DIR/workflow-analysis-$TIMESTAMP.md"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ensure logs directory exists
mkdir -p "$LOGS_DIR"

echo -e "${BLUE}🔍 Starting Workflow Error Analysis${NC}"
echo "Timestamp: $(date)"
echo "Analysis file: $ANALYSIS_FILE"
echo ""

# Initialize analysis file
cat > "$ANALYSIS_FILE" << 'EOF'
# Workflow Error Analysis Report

## Summary
- **Analysis Date**: $(date)
- **Repository**: pm-tools-templates
- **Analyst**: Automated Script

## Workflow Status Overview

EOF

echo -e "${YELLOW}📊 Collecting workflow status...${NC}"

# Get current workflow list and status
echo "### Current Workflows" >> "$ANALYSIS_FILE"
echo '```' >> "$ANALYSIS_FILE"
gh workflow list >> "$ANALYSIS_FILE" 2>&1 || echo "Error getting workflow list" >> "$ANALYSIS_FILE"
echo '```' >> "$ANALYSIS_FILE"
echo "" >> "$ANALYSIS_FILE"

# Get recent runs with details
echo "### Recent Workflow Runs (Last 30)" >> "$ANALYSIS_FILE"
echo '```json' >> "$ANALYSIS_FILE"
gh run list --limit 30 --json status,conclusion,name,createdAt,headBranch,databaseId,url >> "$ANALYSIS_FILE" 2>&1 || echo '{"error": "Failed to get run list"}' >> "$ANALYSIS_FILE"
echo '```' >> "$ANALYSIS_FILE"
echo "" >> "$ANALYSIS_FILE"

# Failed workflows analysis
echo -e "${RED}❌ Analyzing failed workflows...${NC}"

echo "## Failed Workflow Analysis" >> "$ANALYSIS_FILE"
echo "" >> "$ANALYSIS_FILE"

# Get failed runs
FAILED_RUNS=$(gh run list --status failure --limit 10 --json conclusion,name,databaseId,url,createdAt 2>/dev/null | jq -r '.[] | select(.conclusion == "failure") | "\(.databaseId)|\(.name)|\(.url)"' | head -5)

if [ -n "$FAILED_RUNS" ]; then
    echo "$FAILED_RUNS" | while IFS='|' read -r run_id workflow_name run_url; do
        echo -e "${YELLOW}Analyzing: $workflow_name (ID: $run_id)${NC}"
        
        echo "### $workflow_name" >> "$ANALYSIS_FILE"
        echo "- **Run ID**: $run_id" >> "$ANALYSIS_FILE"
        echo "- **URL**: $run_url" >> "$ANALYSIS_FILE"
        echo "" >> "$ANALYSIS_FILE"
        
        echo "#### Error Logs" >> "$ANALYSIS_FILE"
        echo '```' >> "$ANALYSIS_FILE"
        gh run view "$run_id" --log >> "$ANALYSIS_FILE" 2>&1 || echo "Error retrieving logs for run $run_id" >> "$ANALYSIS_FILE"
        echo '```' >> "$ANALYSIS_FILE"
        echo "" >> "$ANALYSIS_FILE"
    done
else
    echo "No recent failed runs found." >> "$ANALYSIS_FILE"
fi

# Startup failure analysis
echo -e "${RED}💥 Analyzing startup failures...${NC}"

echo "## Startup Failure Analysis" >> "$ANALYSIS_FILE"
echo "" >> "$ANALYSIS_FILE"

STARTUP_FAILURES=$(gh run list --status completed --limit 20 --json conclusion,name,databaseId,url,createdAt 2>/dev/null | jq -r '.[] | select(.conclusion == "startup_failure") | "\(.databaseId)|\(.name)|\(.url)"' | head -3)

if [ -n "$STARTUP_FAILURES" ]; then
    echo "$STARTUP_FAILURES" | while IFS='|' read -r run_id workflow_name run_url; do
        echo -e "${RED}Critical: $workflow_name (ID: $run_id)${NC}"
        
        echo "### $workflow_name (STARTUP FAILURE)" >> "$ANALYSIS_FILE"
        echo "- **Run ID**: $run_id" >> "$ANALYSIS_FILE"
        echo "- **URL**: $run_url" >> "$ANALYSIS_FILE"
        echo "- **Severity**: CRITICAL - Workflow cannot start" >> "$ANALYSIS_FILE"
        echo "" >> "$ANALYSIS_FILE"
        
        echo "#### Startup Error Logs" >> "$ANALYSIS_FILE"
        echo '```' >> "$ANALYSIS_FILE"
        gh run view "$run_id" --log >> "$ANALYSIS_FILE" 2>&1 || echo "Error retrieving startup failure logs for run $run_id" >> "$ANALYSIS_FILE"
        echo '```' >> "$ANALYSIS_FILE"
        echo "" >> "$ANALYSIS_FILE"
    done
else
    echo "No startup failures found." >> "$ANALYSIS_FILE"
fi

# YAML validation
echo -e "${BLUE}📝 Validating workflow YAML files...${NC}"

echo "## Workflow YAML Validation" >> "$ANALYSIS_FILE"
echo "" >> "$ANALYSIS_FILE"

WORKFLOW_DIR="$PROJECT_ROOT/.github/workflows"
if [ -d "$WORKFLOW_DIR" ]; then
    echo "Validating YAML files in $WORKFLOW_DIR" >> "$ANALYSIS_FILE"
    echo "" >> "$ANALYSIS_FILE"
    
    for workflow_file in "$WORKFLOW_DIR"/*.yml "$WORKFLOW_DIR"/*.yaml; do
        if [ -f "$workflow_file" ]; then
            filename=$(basename "$workflow_file")
            echo -e "${BLUE}Validating: $filename${NC}"
            
            echo "### $filename" >> "$ANALYSIS_FILE"
            
            # Basic YAML syntax check
            if python3 -c "import yaml; yaml.safe_load(open('$workflow_file'))" 2>/dev/null; then
                echo "- ✅ YAML syntax: Valid" >> "$ANALYSIS_FILE"
            else
                echo "- ❌ YAML syntax: Invalid" >> "$ANALYSIS_FILE"
                echo "```" >> "$ANALYSIS_FILE"
                python3 -c "import yaml; yaml.safe_load(open('$workflow_file'))" 2>&1 >> "$ANALYSIS_FILE" || true
                echo "```" >> "$ANALYSIS_FILE"
            fi
            
            # Check for common issues
            if grep -q "matrix:" "$workflow_file"; then
                if grep -A 10 "matrix:" "$workflow_file" | grep -q "\[\]"; then
                    echo "- ⚠️  Empty matrix array detected" >> "$ANALYSIS_FILE"
                else
                    echo "- ✅ Matrix configuration: Present" >> "$ANALYSIS_FILE"
                fi
            fi
            
            echo "" >> "$ANALYSIS_FILE"
        fi
    done
else
    echo "Workflow directory not found: $WORKFLOW_DIR" >> "$ANALYSIS_FILE"
fi

# Environment and dependency checks
echo -e "${GREEN}🔧 Checking dependencies and environment...${NC}"

echo "## Environment Analysis" >> "$ANALYSIS_FILE"
echo "" >> "$ANALYSIS_FILE"

echo "### Required Tools Status" >> "$ANALYSIS_FILE"
echo '```' >> "$ANALYSIS_FILE"

# Check for required tools
for tool in gh python3 node npm jq curl; do
    if command -v "$tool" >/dev/null 2>&1; then
        echo "✅ $tool: $(command -v $tool)" >> "$ANALYSIS_FILE"
    else
        echo "❌ $tool: Not found" >> "$ANALYSIS_FILE"
    fi
done

echo '```' >> "$ANALYSIS_FILE"
echo "" >> "$ANALYSIS_FILE"

# Check for required files
echo "### Required Files Check" >> "$ANALYSIS_FILE"
echo '```' >> "$ANALYSIS_FILE"

required_files=(
    "package.json"
    "ecosystem-gateway.js"
    "tests/test-runner.js"
    "scripts/check_anchor_links_filtered.py"
    ".github/workflows"
)

for file in "${required_files[@]}"; do
    if [ -e "$PROJECT_ROOT/$file" ]; then
        echo "✅ $file: Exists" >> "$ANALYSIS_FILE"
    else
        echo "❌ $file: Missing" >> "$ANALYSIS_FILE"
    fi
done

echo '```' >> "$ANALYSIS_FILE"
echo "" >> "$ANALYSIS_FILE"

# Generate recommendations
echo -e "${GREEN}💡 Generating recommendations...${NC}"

echo "## Recommendations" >> "$ANALYSIS_FILE"
echo "" >> "$ANALYSIS_FILE"

echo "### Immediate Actions Required" >> "$ANALYSIS_FILE"
echo "" >> "$ANALYSIS_FILE"

# Check if we found critical issues
if grep -q "startup_failure" "$ANALYSIS_FILE"; then
    echo "1. **🚨 CRITICAL**: Fix startup failures immediately - workflows cannot execute" >> "$ANALYSIS_FILE"
fi

if grep -q "❌.*YAML syntax" "$ANALYSIS_FILE"; then
    echo "2. **🔧 HIGH**: Fix YAML syntax errors in workflow files" >> "$ANALYSIS_FILE"
fi

if grep -q "Empty matrix array" "$ANALYSIS_FILE"; then
    echo "3. **⚠️  MEDIUM**: Fix empty matrix arrays in workflows" >> "$ANALYSIS_FILE"
fi

echo "" >> "$ANALYSIS_FILE"
echo "### Next Steps" >> "$ANALYSIS_FILE"
echo "1. Review detailed error logs above" >> "$ANALYSIS_FILE"
echo "2. Fix critical startup failures first" >> "$ANALYSIS_FILE"
echo "3. Address YAML syntax issues" >> "$ANALYSIS_FILE"
echo "4. Test fixes incrementally" >> "$ANALYSIS_FILE"
echo "5. Monitor workflow success rates" >> "$ANALYSIS_FILE"
echo "" >> "$ANALYSIS_FILE"

echo "---" >> "$ANALYSIS_FILE"
echo "*Analysis completed: $(date)*" >> "$ANALYSIS_FILE"
echo "*Next analysis recommended: $(date -d '+1 hour')*" >> "$ANALYSIS_FILE"

echo ""
echo -e "${GREEN}✅ Analysis complete!${NC}"
echo -e "${BLUE}📄 Report saved to: $ANALYSIS_FILE${NC}"
echo ""
echo -e "${YELLOW}📋 Summary:${NC}"

# Quick summary
echo "Workflow Analysis Summary:" 
echo "- Analysis file: $(basename "$ANALYSIS_FILE")"
echo "- Timestamp: $TIMESTAMP"

if [ -f "$ANALYSIS_FILE" ]; then
    echo "- File size: $(wc -l < "$ANALYSIS_FILE") lines"
    
    # Count issues
    startup_failures=$(grep -c "startup_failure" "$ANALYSIS_FILE" 2>/dev/null || echo "0")
    yaml_errors=$(grep -c "❌.*YAML syntax" "$ANALYSIS_FILE" 2>/dev/null || echo "0")
    
    echo "- Startup failures: $startup_failures"
    echo "- YAML errors: $yaml_errors"
fi

echo ""
echo -e "${BLUE}🔍 To view the full analysis:${NC}"
echo "cat '$ANALYSIS_FILE'"
echo ""
echo -e "${GREEN}🚀 Ready to proceed with fixes based on analysis results!${NC}"
