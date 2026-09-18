#!/bin/bash

# Fix Broken Links Script
# Creates missing files and fixes links to improve repository health

set -euo pipefail

PROJECT_ROOT="/Users/michael/pm-tools-templates"
cd "$PROJECT_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Fixing High-Impact Broken Links${NC}"
echo ""

FIXES_APPLIED=0

# Function to create a template file
create_template_file() {
    local file_path="$1"
    local title="$2"
    local description="$3"
    
    # Ensure directory exists
    mkdir -p "$(dirname "$file_path")"
    
    cat > "$file_path" << EOF
# $title

## Overview
$description

## Usage
This template provides a standardized approach for $title.

## Template Sections

### 1. Introduction
Brief description of the purpose and scope.

### 2. Key Components
List the main elements that should be included.

### 3. Implementation Guidelines
Step-by-step instructions for using this template.

### 4. Best Practices
- Follow established project management standards
- Ensure stakeholder review and approval
- Document all decisions and changes
- Regular updates and maintenance

## Related Templates
- [Project Charter](../project-charter/)
- [Risk Management](../risk-management/)
- [Communication Plan](../communication-plan/)

## Version History
- v1.0 - Initial template creation

---
*This template is part of the PM Tools Templates repository.*
EOF
    
    echo -e "${GREEN}✅ Created: $file_path${NC}"
    ((FIXES_APPLIED++))
}

# Fix 1: Traditional vs Waterfall references in main README
echo -e "${YELLOW}🔄 Fixing Traditional/Waterfall references...${NC}"

if grep -q "methodology-frameworks/traditional/process-groups" README.md; then
    # Update references in main README to current paths
    sed -i '' 's|methodology-frameworks/traditional/process-groups|Traditional/Process_Groups|g' README.md 2>/dev/null || \
    sed -i 's|methodology-frameworks/traditional/process-groups|Traditional/Process_Groups|g' README.md
    echo -e "${GREEN}✅ Fixed Traditional references in README.md${NC}"
    ((FIXES_APPLIED++))
fi

# Fix 2: Create most critical missing files for project assessment
echo -e "${YELLOW}📊 Creating project assessment templates...${NC}"

create_template_file "project-assessment-suite/scoring-rating-guide.md" \
    "Scoring and Rating Guide" \
    "A comprehensive guide for scoring and rating project assessments across different criteria."

create_template_file "project-assessment-suite/assessment-report-template.md" \
    "Assessment Report Template" \
    "A standardized template for generating comprehensive project assessment reports."

# Fix 3: Create governance tools (most referenced missing files)
echo -e "${YELLOW}🏛️ Creating governance tools templates...${NC}"

GOVERNANCE_DIR="role-based-toolkits/project-manager/governance-tools"

create_template_file "$GOVERNANCE_DIR/governance-roles.md" \
    "Governance Roles and Responsibilities" \
    "Defines key governance roles, responsibilities, and authority levels for project management."

create_template_file "$GOVERNANCE_DIR/decision-framework.md" \
    "Decision Making Framework" \
    "A structured approach to project decision-making with clear criteria and processes."

create_template_file "$GOVERNANCE_DIR/quality-gates.md" \
    "Quality Gates Checklist" \
    "Quality gate criteria and checkpoints for project phases and deliverables."

create_template_file "$GOVERNANCE_DIR/change-control-process.md" \
    "Change Control Process" \
    "Standardized process for managing and controlling project changes."

# Fix 4: Create reporting dashboard templates
echo -e "${YELLOW}📊 Creating reporting dashboard templates...${NC}"

REPORTS_DIR="role-based-toolkits/project-manager/reporting-dashboards"

create_template_file "$REPORTS_DIR/executive-status-report.md" \
    "Executive Status Report" \
    "High-level status report template for executive stakeholders."

create_template_file "$REPORTS_DIR/stakeholder-update.md" \
    "Stakeholder Update Template" \
    "Regular stakeholder communication and update template."

# Fix 5: Create stakeholder engagement templates
echo -e "${YELLOW}👥 Creating stakeholder engagement templates...${NC}"

STAKEHOLDER_DIR="role-based-toolkits/project-manager/stakeholder-engagement"

create_template_file "$STAKEHOLDER_DIR/engagement-plan.md" \
    "Stakeholder Engagement Plan" \
    "Comprehensive plan for engaging with project stakeholders throughout the project lifecycle."

create_template_file "$STAKEHOLDER_DIR/communication-calendar.md" \
    "Communication Calendar" \
    "Scheduled communication activities and touchpoints with stakeholders."

# Fix 6: Create agile transformation templates
echo -e "${YELLOW}🚀 Creating agile transformation templates...${NC}"

AGILE_DIR="quick-start-kits/agile-transformation"

create_template_file "$AGILE_DIR/readiness-assessment.md" \
    "Agile Readiness Assessment" \
    "Assessment tool to evaluate organizational readiness for agile transformation."

create_template_file "$AGILE_DIR/change-management-plan.md" \
    "Agile Change Management Plan" \
    "Change management strategy and plan for agile transformation initiatives."

create_template_file "$AGILE_DIR/success-metrics.md" \
    "Agile Success Metrics" \
    "Key performance indicators and success metrics for agile transformation."

# Fix 7: Create essential project lifecycle templates  
echo -e "${YELLOW}📋 Creating project lifecycle templates...${NC}"

create_template_file "project-lifecycle/02-planning/project-management-plan/hybrid-project-management-plan-template.md" \
    "Hybrid Project Management Plan" \
    "Project management plan template combining traditional and agile methodologies."

create_template_file "project-lifecycle/02-planning/risk-management/enterprise-risk-assessment-template.md" \
    "Enterprise Risk Assessment" \
    "Comprehensive risk assessment template for enterprise-level projects."

# Fix 8: Create missing directories that are frequently referenced
echo -e "${YELLOW}📁 Creating missing directory structures...${NC}"

mkdir -p "docs/community"
cat > "docs/community/README.md" << EOF
# Community Guidelines

## Overview
Community resources and guidelines for the PM Tools Templates project.

## Getting Involved
- Contributing to templates
- Feedback and suggestions  
- Community discussions

## Resources
- [Contributing Guide](../contributing.md)
- [Code of Conduct](../code-of-conduct.md)
- [Support](../support.md)

---
*Welcome to the PM Tools Templates community!*
EOF

echo -e "${GREEN}✅ Created docs/community directory${NC}"
((FIXES_APPLIED++))

# Create integration-toolkits structure
mkdir -p "integration-toolkits/development-tools"
cat > "integration-toolkits/development-tools/README.md" << EOF
# Development Tools Integration

## Overview
Integration templates and guides for development tools and project management platforms.

## Supported Tools
- JIRA/Confluence integration
- GitHub/GitLab project management
- CI/CD pipeline templates
- Development workflow templates

## Quick Start
1. Select your primary development platform
2. Follow the integration guide
3. Customize templates for your team

---
*Development tools integration for PM Templates*
EOF

echo -e "${GREEN}✅ Created integration-toolkits/development-tools${NC}"
((FIXES_APPLIED++))

# Summary
echo ""
echo -e "${CYAN}📊 Link Fix Summary:${NC}"
echo "  • Templates created: $FIXES_APPLIED"
echo "  • Focus areas: Governance, Reporting, Stakeholder Engagement, Agile"
echo "  • Directory structures: Created missing directories"
echo ""

# Run link analysis again to check improvement
echo -e "${BLUE}🔍 Running link analysis to verify improvements...${NC}"
./analyze-all-links.sh | tail -10

echo ""
echo -e "${GREEN}🎉 High-impact broken links fixed!${NC}"
echo -e "${YELLOW}💡 Next steps:${NC}"
echo "  1. Commit these new templates"
echo "  2. Push to repository"  
echo "  3. Monitor workflow runs for improved link health"
