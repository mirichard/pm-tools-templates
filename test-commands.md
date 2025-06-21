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
