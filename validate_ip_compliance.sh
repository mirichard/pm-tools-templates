#!/bin/bash

# PMI IP Compliance Validation Script
# This script checks for potential IP compliance issues

echo "🔍 PMI IP Compliance Validation"
echo "=============================="

# Initialize counters
HIGH_RISK=0
MEDIUM_RISK=0
LOW_RISK=0
COMPLIANT=0

# Function to check file for IP issues
check_file() {
    local file="$1"
    local issues=0
    
    echo "Checking: $file"
    
    # Check for high-risk indicators
    if grep -q "PMI.*trademark\|PMI.*registered\|PMBOK.*registered" "$file" 2>/dev/null; then
        echo "  ❌ HIGH RISK: Contains trademark claims"
        ((HIGH_RISK++))
        ((issues++))
    fi
    
    if grep -q "PMBOK.*compliant\|PMI.*certified\|PMI.*approved" "$file" 2>/dev/null; then
        echo "  ❌ HIGH RISK: Claims PMI compliance/approval"
        ((HIGH_RISK++))
        ((issues++))
    fi
    
    # Check for medium-risk indicators
    if grep -q "PMBOK® Guide" "$file" 2>/dev/null && ! grep -q "Legal Notice" "$file" 2>/dev/null; then
        echo "  ⚠️  MEDIUM RISK: References PMBOK® without disclaimer"
        ((MEDIUM_RISK++))
        ((issues++))
    fi
    
    if grep -q "Process Groups.*Initiating.*Planning.*Executing.*Monitoring.*Closing" "$file" 2>/dev/null; then
        echo "  ⚠️  MEDIUM RISK: Uses PMI's 5 process groups structure"
        ((MEDIUM_RISK++))
        ((issues++))
    fi
    
    if grep -q "10 Knowledge Areas\|49 processes" "$file" 2>/dev/null; then
        echo "  ⚠️  MEDIUM RISK: References PMI-specific numbers"
        ((MEDIUM_RISK++))
        ((issues++))
    fi
    
    # Check for low-risk indicators
    if grep -q "PMBOK\|PMI" "$file" 2>/dev/null && grep -q "Legal Notice" "$file" 2>/dev/null; then
        echo "  ✅ LOW RISK: PMI references with legal disclaimer"
        ((LOW_RISK++))
        ((issues++))
    fi
    
    # Check for compliance indicators
    if grep -q "Legal Notice.*independently developed.*not affiliated" "$file" 2>/dev/null; then
        echo "  ✅ COMPLIANT: Contains proper legal disclaimer"
        ((COMPLIANT++))
    fi
    
    if [ $issues -eq 0 ]; then
        echo "  ✅ CLEAN: No IP issues detected"
    fi
    
    echo ""
}

# Check all markdown files
echo "Scanning all .md files for IP compliance issues..."
echo ""

find . -name "*.md" -not -path "./.*" -not -name "*backup*" | while read -r file; do
    check_file "$file"
done

# Summary
echo "=========================================="
echo "📊 IP Compliance Summary"
echo "=========================================="
echo "❌ High Risk Issues: $HIGH_RISK"
echo "⚠️  Medium Risk Issues: $MEDIUM_RISK"
echo "📝 Low Risk (with disclaimers): $LOW_RISK"
echo "✅ Compliant Files: $COMPLIANT"
echo ""

# Risk assessment
if [ $HIGH_RISK -gt 0 ]; then
    echo "🚨 COMPLIANCE STATUS: HIGH RISK"
    echo "Immediate action required - high-risk IP issues detected"
elif [ $MEDIUM_RISK -gt 5 ]; then
    echo "⚠️  COMPLIANCE STATUS: MEDIUM RISK"
    echo "Review and mitigation recommended"
else
    echo "✅ COMPLIANCE STATUS: ACCEPTABLE"
    echo "Minor issues or well-managed risks only"
fi

echo ""
echo "📋 Recommendations:"
if [ $HIGH_RISK -gt 0 ]; then
    echo "1. Immediately review high-risk files"
    echo "2. Remove or disclaim trademark claims"
    echo "3. Add legal disclaimers to all templates"
fi

if [ $MEDIUM_RISK -gt 0 ]; then
    echo "1. Add legal disclaimers to files with PMI references"
    echo "2. Replace PMI-specific terminology with industry-standard terms"
    echo "3. Review structural copying of PMI frameworks"
fi

echo "4. Implement PMI_IP_RISK_MITIGATION_PLAN.md"
echo "5. Regular compliance monitoring"
echo ""
echo "For detailed mitigation steps, see: PMI_IP_RISK_MITIGATION_PLAN.md"

