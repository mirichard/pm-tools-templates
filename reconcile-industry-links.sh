#!/bin/bash

# reconcile-industry-links.sh
# Analyze industry specialization broken links and find existing files

set -e

echo "🔍 INDUSTRY SPECIALIZATIONS RECONCILIATION"
echo "=========================================="
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "📊 Step 1: Analyzing industry specialization directories..."

HEALTHCARE_DIR="./industry-specializations/healthcare-pharmaceutical"
IT_DIR="./industry-specializations/information-technology"

echo "📁 Step 2: Healthcare/Pharmaceutical Analysis..."
echo "Directory structure:"
find "$HEALTHCARE_DIR" -type d | head -10

echo
echo "Existing markdown files:"
find "$HEALTHCARE_DIR" -name "*.md" -type f | head -10

echo
echo "📁 Step 3: Information Technology Analysis..."
echo "Directory structure:"
find "$IT_DIR" -type d | head -10

echo
echo "Existing markdown files:"
find "$IT_DIR" -name "*.md" -type f | head -10

echo
echo "🔍 Step 4: Analyzing specific broken links from industry specializations..."

# Healthcare broken links from link analysis
declare -a HEALTHCARE_BROKEN_LINKS=(
    "lifecycle/healthcare_product_lifecycle.md"
    "lifecycle/medical_device_development_plan.md"
    "lifecycle/pharmaceutical_qbd_template.md"
)

# IT broken links from link analysis
declare -a IT_BROKEN_LINKS=(
    "software-development/user_story_mapping_template.md"
    "software-development/release_management_template.md"
    "software-development/ci_cd_pipeline_guide.md"
    "infrastructure/capacity_planning_worksheet.md"
    "infrastructure/migration_plan_template.md"
    "infrastructure/data_center_design_template.md"
    "infrastructure/deployment_checklist.md"
    "infrastructure/disaster_recovery_template.md"
    "cybersecurity/risk_assessment_template.md"
    "cybersecurity/vulnerability_management_plan.md"
    "cybersecurity/security_implementation_roadmap.md"
    "cybersecurity/security_controls_matrix.md"
    "cybersecurity/incident_response_template.md"
    "cybersecurity/security_awareness_program.md"
    "digital-transformation/transformation_strategy_template.md"
    "digital-transformation/process_digitization_workflow.md"
    "digital-transformation/technology_adoption_roadmap.md"
    "digital-transformation/digital_maturity_assessment.md"
    "digital-transformation/change_management_plan.md"
    "digital-transformation/digital_kpi_dashboard.md"
)

echo "🎯 Step 5: Checking for healthcare template matches..."

HEALTHCARE_EXACT=0
HEALTHCARE_SIMILAR=0
HEALTHCARE_MISSING=0

for broken_file in "${HEALTHCARE_BROKEN_LINKS[@]}"; do
    echo -n "Checking healthcare/$broken_file: "
    
    filename=$(basename "$broken_file")
    base_name=$(echo "$filename" | sed 's/\.md$//')
    
    # Look for exact matches
    exact_match=$(find "$HEALTHCARE_DIR" -name "$filename" -type f | head -1)
    
    if [ -n "$exact_match" ]; then
        echo -e "${GREEN}EXACT MATCH: $exact_match${NC}"
        ((HEALTHCARE_EXACT++))
    else
        # Look for similar matches
        similar_matches=$(find "$HEALTHCARE_DIR" -name "*${base_name}*" -type f -name "*.md" | head -3)
        
        if [ -n "$similar_matches" ]; then
            echo -e "${YELLOW}SIMILAR MATCHES:${NC}"
            echo "$similar_matches" | sed 's/^/    /'
            ((HEALTHCARE_SIMILAR++))
        else
            echo -e "${RED}MISSING${NC}"
            ((HEALTHCARE_MISSING++))
        fi
    fi
done

echo
echo "🎯 Step 6: Checking for IT template matches..."

IT_EXACT=0
IT_SIMILAR=0
IT_MISSING=0

for broken_file in "${IT_BROKEN_LINKS[@]}"; do
    echo -n "Checking IT/$broken_file: "
    
    filename=$(basename "$broken_file")
    base_name=$(echo "$filename" | sed 's/\.md$//')
    
    # Look for exact matches
    exact_match=$(find "$IT_DIR" -name "$filename" -type f | head -1)
    
    if [ -n "$exact_match" ]; then
        echo -e "${GREEN}EXACT MATCH: $exact_match${NC}"
        ((IT_EXACT++))
    else
        # Look for similar matches in IT directory
        similar_matches=$(find "$IT_DIR" -name "*${base_name}*" -type f -name "*.md" | head -3)
        
        # Also search broader repository for similar files
        if [ -z "$similar_matches" ]; then
            similar_matches=$(find . -name "*${base_name}*" -type f -name "*.md" | grep -v ".git" | grep -v "$IT_DIR" | head -3)
        fi
        
        if [ -n "$similar_matches" ]; then
            echo -e "${YELLOW}SIMILAR MATCHES:${NC}"
            echo "$similar_matches" | sed 's/^/    /'
            ((IT_SIMILAR++))
        else
            echo -e "${RED}MISSING${NC}"
            ((IT_MISSING++))
        fi
    fi
done

echo
echo "📋 Step 7: Cross-repository search for common patterns..."

# Search for common software development templates across repository
echo "Software development related files:"
find . -name "*software*" -o -name "*development*" -o -name "*deploy*" | grep "\.md$" | head -5

echo
echo "Infrastructure related files:"
find . -name "*infrastructure*" -o -name "*capacity*" -o -name "*migration*" | grep "\.md$" | head -5

echo
echo "Security related files:"
find . -name "*security*" -o -name "*cyber*" -o -name "*risk*" | grep "\.md$" | head -5

echo
echo "🎯 Step 8: Summary and recommendations..."

echo -e "${BLUE}HEALTHCARE RECONCILIATION SUMMARY:${NC}"
echo "- Exact matches found: $HEALTHCARE_EXACT"
echo "- Similar matches found: $HEALTHCARE_SIMILAR"  
echo "- Missing files: $HEALTHCARE_MISSING"

echo
echo -e "${BLUE}IT RECONCILIATION SUMMARY:${NC}"
echo "- Exact matches found: $IT_EXACT"
echo "- Similar matches found: $IT_SIMILAR"  
echo "- Missing files: $IT_MISSING"

echo
echo "🔧 Step 9: Generate industry fix script..."

cat > fix-industry-links.sh << 'EOF'
#!/bin/bash

# fix-industry-links.sh
# Fix industry specialization link issues

set -e

echo "🔧 Fixing industry specialization link issues..."

HEALTHCARE_README="./industry-specializations/healthcare-pharmaceutical/README.md"
IT_README="./industry-specializations/information-technology/README.md"

echo "📋 Healthcare fixes needed:"
if [ -f "$HEALTHCARE_README" ]; then
    echo "   Healthcare README found - ready for link updates"
    # Links will be updated based on analysis findings
else
    echo "   ❌ Healthcare README not found"
fi

echo "📋 IT fixes needed:"
if [ -f "$IT_README" ]; then
    echo "   IT README found - ready for link updates"
    # Links will be updated based on analysis findings
else
    echo "   ❌ IT README not found"
fi

echo "🎯 Manual template creation needed for missing files"
echo "   Based on reconciliation analysis results"
EOF

chmod +x fix-industry-links.sh

echo -e "${GREEN}✅ Created fix-industry-links.sh script${NC}"

echo
echo "🎯 NEXT STEPS:"
echo "1. Review the matches found above"
echo "2. Identify priority templates to create vs. link"
echo "3. Create missing directory structures if needed"
echo "4. Run './fix-industry-links.sh' for any automated fixes"
echo "5. Begin template creation for highest-impact missing files"

echo
echo -e "${YELLOW}PRIORITY RECOMMENDATIONS:${NC}"
echo "1. Create cybersecurity templates (high business value)"
echo "2. Create software development lifecycle templates"
echo "3. Create infrastructure management templates"
echo "4. Link to existing templates where possible"
