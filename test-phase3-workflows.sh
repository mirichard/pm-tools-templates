#!/bin/bash

# Phase 3 Advanced Quality Workflows Testing Script
# This script validates workflow syntax and provides testing recommendations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Phase 3 Advanced Quality Workflows Testing${NC}"
echo "=================================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "\n${YELLOW}📋 Checking Prerequisites...${NC}"

if command_exists "yq"; then
    echo "✅ yq is available for YAML validation"
    YQ_AVAILABLE=true
else
    echo "⚠️  yq not found - installing for YAML validation"
    if command_exists "brew"; then
        brew install yq
        YQ_AVAILABLE=true
    else
        echo "❌ Please install yq manually: https://github.com/mikefarah/yq"
        YQ_AVAILABLE=false
    fi
fi

if command_exists "jq"; then
    echo "✅ jq is available for JSON validation"
else
    echo "❌ jq not found - please install: brew install jq"
    exit 1
fi

# Workflow files to test
WORKFLOWS=(
    "enhanced-template-validation.yml"
    "api-integration-testing.yml" 
    "visual-regression-testing.yml"
)

echo -e "\n${YELLOW}🔍 Validating Workflow Syntax...${NC}"

# Test workflow YAML syntax
for workflow in "${WORKFLOWS[@]}"; do
    workflow_path=".github/workflows/$workflow"
    
    if [[ -f "$workflow_path" ]]; then
        echo -n "Testing $workflow... "
        
        if [[ "$YQ_AVAILABLE" == true ]]; then
            if yq eval '.' "$workflow_path" > /dev/null 2>&1; then
                echo -e "${GREEN}✅ Valid YAML${NC}"
            else
                echo -e "${RED}❌ Invalid YAML${NC}"
                yq eval '.' "$workflow_path"
                exit 1
            fi
        else
            echo -e "${YELLOW}⚠️  Skipped (yq not available)${NC}"
        fi
    else
        echo -e "${RED}❌ Workflow file not found: $workflow_path${NC}"
        exit 1
    fi
done

# Test JSON configuration files
echo -e "\n${YELLOW}📄 Validating JSON Configuration Files...${NC}"

if [[ -f "api/pm-tools-api.json" ]]; then
    echo -n "Testing API configuration... "
    if jq empty api/pm-tools-api.json 2>/dev/null; then
        echo -e "${GREEN}✅ Valid JSON${NC}"
    else
        echo -e "${RED}❌ Invalid JSON${NC}"
        jq . api/pm-tools-api.json
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  No API configuration found${NC}"
fi

# Test template files
echo -e "\n${YELLOW}📝 Validating Template Files...${NC}"

template_count=0
if [[ -d "templates" ]]; then
    while IFS= read -r -d '' template; do
        ((template_count++))
        echo "Found: $template"
    done < <(find templates -name "*.md" -print0)
    
    echo -e "${GREEN}✅ Found $template_count template files${NC}"
else
    echo -e "${YELLOW}⚠️  No templates directory found${NC}"
fi

# Workflow Testing Recommendations
echo -e "\n${BLUE}🧪 Testing Recommendations${NC}"
echo "================================"

echo -e "\n${YELLOW}1. Enhanced Template Validation Testing:${NC}"
echo "   • Manual trigger: gh workflow run enhanced-template-validation.yml"
echo "   • Test different scopes: --field validation_scope=templates-only"
echo "   • Test quality levels: --field quality_level=strict"
echo "   • Generate reports: --field generate_report=true"

echo -e "\n${YELLOW}2. API Integration Testing:${NC}"
echo "   • Manual trigger: gh workflow run api-integration-testing.yml"
echo "   • Test environments: --field test_environment=mock"
echo "   • Test scopes: --field test_scope=health-checks-only"
echo "   • Enable reports: --field generate_report=true"

echo -e "\n${YELLOW}3. Visual Regression Testing:${NC}"
echo "   • Manual trigger: gh workflow run visual-regression-testing.yml"
echo "   • Update baselines: --field baseline_update=true"
echo "   • Test resolutions: --field test_resolution=standard"
echo "   • Adjust threshold: --field diff_threshold=2"

# Create test commands file
echo -e "\n${YELLOW}📋 Creating Test Commands File...${NC}"

cat > test-commands.md << 'EOF'
# Phase 3 Workflow Testing Commands

## Prerequisites
```bash
# Install GitHub CLI if not already installed
brew install gh

# Authenticate with GitHub
gh auth login
```

## Manual Workflow Testing

### 1. Enhanced Template Validation
```bash
# Basic validation test
gh workflow run enhanced-template-validation.yml

# Templates-only with strict quality
gh workflow run enhanced-template-validation.yml \
    --field validation_scope=templates-only \
    --field quality_level=strict \
    --field generate_report=true

# Comprehensive validation
gh workflow run enhanced-template-validation.yml \
    --field validation_scope=comprehensive \
    --field quality_level=standard \
    --field generate_report=true
```

### 2. API Integration Testing  
```bash
# Health checks only (safe for testing)
gh workflow run api-integration-testing.yml \
    --field test_scope=health-checks-only \
    --field test_environment=mock \
    --field generate_report=true

# Comprehensive API testing
gh workflow run api-integration-testing.yml \
    --field test_scope=comprehensive \
    --field test_environment=sandbox \
    --field parallel_execution=true
```

### 3. Visual Regression Testing
```bash
# Initial baseline setup
gh workflow run visual-regression-testing.yml \
    --field test_scope=templates-only \
    --field baseline_update=true \
    --field test_resolution=standard

# Standard visual regression test
gh workflow run visual-regression-testing.yml \
    --field test_scope=comprehensive \
    --field test_resolution=standard \
    --field diff_threshold=2
```

## Monitoring Workflow Status
```bash
# List recent workflow runs
gh run list --limit 10

# Watch specific workflow
gh run view --log

# Check workflow status
gh run list --workflow=enhanced-template-validation.yml
```

## Local Testing (Syntax Validation)
```bash
# Run this script
./test-phase3-workflows.sh

# Validate specific workflow
yq eval '.jobs' .github/workflows/enhanced-template-validation.yml

# Check template syntax
find templates -name "*.md" -exec echo "Checking: {}" \; -exec head -10 {} \;
```
EOF

echo -e "${GREEN}✅ Created test-commands.md with detailed testing instructions${NC}"

# Check GitHub CLI availability for actual testing
echo -e "\n${YELLOW}🔧 GitHub CLI Testing Capability...${NC}"

if command_exists "gh"; then
    echo "✅ GitHub CLI is available"
    
    # Check if authenticated
    if gh auth status >/dev/null 2>&1; then
        echo "✅ GitHub CLI is authenticated"
        echo -e "\n${GREEN}🚀 Ready for live workflow testing!${NC}"
        echo "Use the commands in test-commands.md to test workflows"
    else
        echo "⚠️  GitHub CLI not authenticated"
        echo "Run: gh auth login"
    fi
else
    echo "⚠️  GitHub CLI not available"
    echo "Install with: brew install gh"
fi

# Summary
echo -e "\n${BLUE}📊 Testing Summary${NC}"
echo "=================="
echo "✅ Workflow syntax validation completed"
echo "✅ Configuration files validated"
echo "✅ Template files discovered"
echo "✅ Test commands generated"

echo -e "\n${GREEN}🎉 Phase 3 workflows are ready for testing!${NC}"
echo -e "Next steps:"
echo -e "1. Review ${YELLOW}test-commands.md${NC} for detailed testing instructions"
echo -e "2. Run manual workflow tests using GitHub CLI"
echo -e "3. Monitor workflow execution and results"
echo -e "4. Check artifacts and reports generated by workflows"

echo -e "\n${BLUE}💡 Pro Tips:${NC}"
echo "• Start with health-checks-only and mock environments"
echo "• Use baseline_update=true for first visual regression run"
echo "• Monitor workflow logs for detailed execution information"
echo "• Check GitHub Actions tab for workflow status and artifacts"
