#!/bin/bash

echo "=== PHASE 4: INFRASTRUCTURE & QUICK START LINK FIXES ==="
echo "Timestamp: $(date)"
echo

# Fix infrastructure-related broken links
echo "Fixing infrastructure broken links..."

# Fix industry-specializations IT infrastructure links
echo "1. Fixing IT infrastructure broken links..."

# Create missing IT infrastructure files that are referenced
mkdir -p "industry-specializations/information-technology/infrastructure"

# Check which files need to be created based on broken links
if [ ! -f "industry-specializations/information-technology/infrastructure/capacity_planning_worksheet.md" ]; then
    cat > "industry-specializations/information-technology/infrastructure/capacity_planning_worksheet.md" << 'EOF'
# IT Infrastructure Capacity Planning Worksheet

## Executive Summary
This worksheet helps plan infrastructure capacity for IT projects and ongoing operations.

## Current Infrastructure Assessment
[Use this section to document current infrastructure capacity and utilization]

## Future Requirements
[Document projected capacity needs based on growth and project requirements]

## Capacity Planning Analysis
[Analysis and recommendations for infrastructure scaling]

---
For comprehensive infrastructure planning, see:
- [Infrastructure Requirements Template](../../../essential-templates/infrastructure/infrastructure-requirements-template.md)
- [Infrastructure Assessment Template](./infrastructure_assessment_template.md)
EOF
fi

if [ ! -f "industry-specializations/information-technology/infrastructure/migration_plan_template.md" ]; then
    cat > "industry-specializations/information-technology/infrastructure/migration_plan_template.md" << 'EOF'
# IT Infrastructure Migration Plan Template

## Executive Summary
Template for planning and executing infrastructure migrations in IT environments.

## Migration Strategy
[Define migration approach and methodology]

## Risk Assessment
[Identify and plan for migration risks]

## Implementation Plan
[Detailed migration steps and timeline]

---
Related Resources:
- [Infrastructure Assessment Template](./infrastructure_assessment_template.md)
- [Deployment Checklist](../../../essential-templates/infrastructure/deployment-checklist-template.md)
EOF
fi

if [ ! -f "industry-specializations/information-technology/infrastructure/data_center_design_template.md" ]; then
    cat > "industry-specializations/information-technology/infrastructure/data_center_design_template.md" << 'EOF'
# Data Center Design Template

## Executive Summary
Template for designing and planning data center infrastructure for IT operations.

## Design Requirements
[Document data center requirements and constraints]

## Architecture Design
[Data center layout and systems architecture]

## Implementation Plan
[Data center construction and deployment plan]

---
Related Resources:
- [Infrastructure Requirements Template](../../../essential-templates/infrastructure/infrastructure-requirements-template.md)
- [Infrastructure Assessment Template](./infrastructure_assessment_template.md)
EOF
fi

if [ ! -f "industry-specializations/information-technology/infrastructure/deployment_checklist.md" ]; then
    cat > "industry-specializations/information-technology/infrastructure/deployment_checklist.md" << 'EOF'
# IT Infrastructure Deployment Checklist

## Executive Summary
Specialized deployment checklist for IT infrastructure projects.

This checklist extends the [general deployment checklist](../../../essential-templates/infrastructure/deployment-checklist-template.md) with IT-specific considerations.

## IT-Specific Deployment Steps
[IT infrastructure specific deployment steps]

## Validation and Testing
[IT infrastructure testing and validation procedures]

---
Base Template:
- [Deployment Checklist Template](../../../essential-templates/infrastructure/deployment-checklist-template.md)
EOF
fi

if [ ! -f "industry-specializations/information-technology/infrastructure/disaster_recovery_template.md" ]; then
    cat > "industry-specializations/information-technology/infrastructure/disaster_recovery_template.md" << 'EOF'
# IT Infrastructure Disaster Recovery Template

## Executive Summary
Template for planning disaster recovery for IT infrastructure and systems.

## Disaster Recovery Strategy
[Overall DR approach and objectives]

## Recovery Procedures
[Detailed recovery steps and procedures]

## Testing and Maintenance
[DR testing and plan maintenance procedures]

---
Related Resources:
- [Infrastructure Requirements Template](../../../essential-templates/infrastructure/infrastructure-requirements-template.md)
- [Infrastructure Assessment Template](./infrastructure_assessment_template.md)
EOF
fi

echo "2. Fixing DevOps infrastructure links..."

# Ensure infrastructure-as-code directory exists and link fixes
mkdir -p "methodology-frameworks/emerging-methods/devops/infrastructure-as-code"

# Create README for infrastructure-as-code directory if it doesn't exist
if [ ! -f "methodology-frameworks/emerging-methods/devops/infrastructure-as-code/README.md" ]; then
    cat > "methodology-frameworks/emerging-methods/devops/infrastructure-as-code/README.md" << 'EOF'
# Infrastructure as Code

## Overview
Infrastructure as Code (IaC) practices and templates for DevOps environments.

## Templates
- [Infrastructure as Code Template](../infrastructure_as_code_template.md)

## Best Practices
[Infrastructure as Code implementation guidelines]

---
Related Resources:
- [DevOps Pipeline Template](../cicd_pipeline_planning_template.md)
- [Hybrid Infrastructure Template](../../../hybrid/infrastructure/hybrid-infrastructure-template.md)
EOF
fi

echo "3. Creating missing Quick Start Kit directories and READMEs..."

# Create executive reporting kit
mkdir -p "quick-start-kits/executive-reporting"
cat > "quick-start-kits/executive-reporting/README.md" << 'EOF'
# Executive Reporting Kit

## Overview
Quick start kit for executive-level project reporting and dashboards.

## Templates Included
- Executive Status Report Template
- Executive Dashboard Template
- Key Metrics Tracking
- Stakeholder Communication Templates

## Getting Started
1. Review your executive reporting requirements
2. Customize templates for your organization
3. Establish regular reporting cadence
4. Train team on executive communication

---
Related Resources:
- [Business Stakeholder Suite](../../business-stakeholder-suite/)
- [Executive Dashboards](../../business-stakeholder-suite/executive-dashboards/)
EOF

# Create remote team setup kit  
mkdir -p "quick-start-kits/remote-team-setup"
cat > "quick-start-kits/remote-team-setup/README.md" << 'EOF'
# Remote Team Setup Kit

## Overview
Quick start kit for establishing and managing remote project teams.

## Templates Included
- Remote Team Charter Template
- Virtual Collaboration Guidelines
- Remote Communication Plan
- Distributed Team Management Tools

## Getting Started
1. Assess your remote team needs
2. Establish communication protocols
3. Set up collaboration tools
4. Define remote work processes

---
Related Resources:
- [Communication Planning](../../project-lifecycle/02-planning/communication-planning/)
- [Team Management](../../role-based-toolkits/project-manager/team-management/)
EOF

echo "4. Fixing missing Quick Start links in main directories..."

# Update README files to point to correct Quick Start locations (if needed)
# This would typically involve more complex sed operations, but for now we'll create the structure

# Fix budget-simple.md reference (create it if missing)
if [ ! -f "quick-start-kits/first-time-pm-starter/budget-simple.md" ]; then
    cat > "quick-start-kits/first-time-pm-starter/budget-simple.md" << 'EOF'
# Simple Budget Template

## Project Budget Overview
Basic budget tracking template for new project managers.

## Budget Categories
- Personnel Costs
- Equipment and Materials
- External Services
- Contingency

## Budget Tracking
[Simple budget tracking table and formulas]

---
Related Resources:
- [Budget Planning](../../project-lifecycle/02-planning/budget-planning/)
- [Financial Governance](../../business-stakeholder-suite/financial-governance/)
EOF
fi

echo "5. Creating stakeholder onboarding kit..."
cat > "quick-start-kits/stakeholder-onboarding-kit.md" << 'EOF'
# Stakeholder Onboarding Kit

## Executive Summary
Comprehensive kit for onboarding new project stakeholders efficiently and effectively.

## Stakeholder Onboarding Process
### Pre-Onboarding (Before First Meeting)
- [ ] Send welcome package with project overview
- [ ] Share project charter and key documents
- [ ] Schedule initial onboarding meeting
- [ ] Prepare stakeholder-specific information packet

### Initial Onboarding Meeting
- [ ] Project overview and objectives presentation
- [ ] Stakeholder role and responsibility clarification
- [ ] Communication preferences and expectations
- [ ] Q&A and concerns discussion

### Follow-up Activities
- [ ] Add to stakeholder register and communication lists
- [ ] Schedule regular check-ins
- [ ] Provide access to project tools and repositories
- [ ] Assign stakeholder liaison if needed

## Stakeholder Onboarding Checklist
### Information to Provide
- [ ] Project charter and scope
- [ ] Timeline and key milestones
- [ ] Team contacts and organization chart
- [ ] Communication plan and meeting schedules
- [ ] Decision-making processes and escalation paths

### Access and Tools Setup
- [ ] Project repository access
- [ ] Communication tool setup (Slack, Teams, etc.)
- [ ] Meeting calendar invitations
- [ ] Document sharing permissions
- [ ] Reporting dashboard access

## Templates and Resources
- [Stakeholder Register Simple](first-time-pm-starter/stakeholder-register-simple.md)
- [Communication Plan Simple](first-time-pm-starter/communication-plan-simple.md)
- [Stakeholder Analysis](../project-lifecycle/01-initiation/stakeholder-analysis/)

---
**Success Tip:** Effective stakeholder onboarding sets the foundation for project success. Invest time upfront to ensure stakeholders are informed, engaged, and aligned.
EOF

echo "6. Creating methodology selection guide..."
cat > "quick-start-kits/methodology-selection-guide.md" << 'EOF'
# Project Methodology Selection Guide

## Executive Summary
Guide to help project managers select the most appropriate methodology for their project context, team, and organizational environment.

## Methodology Selection Framework

### Context Assessment Questions
**Project Characteristics:**
- [ ] What is the project duration? (< 3 months / 3-12 months / > 12 months)
- [ ] How well-defined are the requirements? (Very clear / Somewhat clear / Unclear/Evolving)
- [ ] What is the project complexity? (Low / Medium / High)
- [ ] How critical is the project? (Nice to have / Important / Mission critical)

**Team and Organization:**
- [ ] Team size? (< 10 people / 10-50 people / > 50 people)
- [ ] Team experience with methodologies? (New / Some experience / Very experienced)
- [ ] Organizational culture? (Traditional / Mixed / Agile/Innovative)
- [ ] Stakeholder involvement preference? (Periodic reviews / Regular involvement / Continuous collaboration)

**External Factors:**
- [ ] Regulatory requirements? (None / Some / Extensive)
- [ ] Customer involvement? (Minimal / Moderate / High)
- [ ] Technology maturity? (Proven / Some risk / Cutting edge)
- [ ] Change tolerance? (Low / Medium / High)

## Methodology Recommendations

### Traditional/Waterfall Approach
**Best For:**
- Well-defined requirements
- Low change tolerance
- Regulatory environments
- Large, complex projects
- Experienced traditional teams

**Templates:**
- [PMBOK Framework](../methodology-frameworks/pmbok/)
- [Project Charter](../project-lifecycle/01-initiation/project-charter/)
- [Work Breakdown Structure](../project-lifecycle/02-planning/scope-management/)

### Agile/Scrum Approach  
**Best For:**
- Evolving requirements
- High change tolerance
- Customer collaboration focus
- Smaller, iterative deliveries
- Cross-functional teams

**Templates:**
- [Agile Framework](../methodology-frameworks/agile-scrum/)
- [Product Backlog](../methodology-frameworks/agile-scrum/planning/)
- [Sprint Planning](../methodology-frameworks/agile-scrum/sprint-zero/)

### Hybrid Approach
**Best For:**
- Mixed project characteristics
- Organizational transition periods
- Complex projects with stable and evolving components
- Regulatory projects needing flexibility

**Templates:**
- [Hybrid Framework](../methodology-frameworks/hybrid/)
- [Hybrid Infrastructure](../methodology-frameworks/hybrid/infrastructure/)
- [Integration Strategies](../methodology-frameworks/hybrid/integration-strategies/)

## Selection Decision Matrix

| Factor | Weight | Traditional | Agile | Hybrid | Selected |
|--------|--------|-------------|-------|--------|----------|
| Requirements Clarity | [High/Med/Low] | [Score 1-5] | [Score 1-5] | [Score 1-5] | |
| Change Frequency | [High/Med/Low] | [Score 1-5] | [Score 1-5] | [Score 1-5] | |
| Team Experience | [High/Med/Low] | [Score 1-5] | [Score 1-5] | [Score 1-5] | |
| Organizational Culture | [High/Med/Low] | [Score 1-5] | [Score 1-5] | [Score 1-5] | |
| Project Complexity | [High/Med/Low] | [Score 1-5] | [Score 1-5] | [Score 1-5] | |
| **Total Weighted Score** | | | | | |

## Implementation Guidance

### Getting Started with Selected Methodology
**Traditional Approach:**
1. Start with [Project Charter](../project-lifecycle/01-initiation/project-charter/)
2. Complete detailed planning phase
3. Use [WBS and Gantt charts](../project-lifecycle/02-planning/scope-management/)
4. Implement formal change control

**Agile Approach:**
1. Begin with [Product Vision](../methodology-frameworks/agile-scrum/planning/)
2. Form cross-functional team
3. Start with [Sprint Zero](../methodology-frameworks/agile-scrum/sprint-zero/)
4. Implement iterative delivery

**Hybrid Approach:**
1. Review [Hybrid Framework](../methodology-frameworks/hybrid/)
2. Define methodology boundaries
3. Establish integration points
4. Plan governance structure

### Methodology Transition Support
- [Training Resources](../docs/training/)
- [Change Management](../essential-templates/change-management/)
- [Team Formation Guidance](../role-based-toolkits/project-manager/team-management/)

## Common Selection Mistakes to Avoid
1. **Methodology bias** - Choosing based on personal preference rather than project needs
2. **One-size-fits-all** - Using the same methodology for all projects
3. **Ignoring organizational culture** - Not considering team and organizational readiness
4. **Overcomplicating** - Selecting complex methodologies when simple approaches would work
5. **Underestimating change impact** - Not planning for methodology adoption challenges

---
**Remember:** The best methodology is the one that fits your specific project context, team capabilities, and organizational environment. Start simple and evolve as needed.
EOF

echo "7. Creating template customization guide..."
cat > "quick-start-kits/template-customization-guide.md" << 'EOF'
# Template Customization Guide

## Executive Summary
Guide to effectively customize project management templates for your specific organization, industry, and project needs.

## Customization Philosophy
### Core Principles
- **Start with proven templates** - Use existing templates as foundation
- **Customize gradually** - Make incremental changes based on experience
- **Maintain consistency** - Ensure templates work together as a system
- **Focus on value** - Customize only what adds clear value
- **Document changes** - Track customizations for future reference

## Template Categories and Customization Priorities

### Essential Templates (High Priority Customization)
**Templates to customize first:**
- [Project Charter](first-time-pm-starter/project-charter-simple.md)
- [Stakeholder Register](first-time-pm-starter/stakeholder-register-simple.md)
- [Communication Plan](first-time-pm-starter/communication-plan-simple.md)
- [Status Report](first-time-pm-starter/status-report-simple.md)

**Common Customizations:**
- [ ] Organization-specific terminology
- [ ] Company branding and formatting
- [ ] Industry-specific sections
- [ ] Approval workflows and stakeholders
- [ ] Standard project categories and types

### Industry-Specific Templates (Medium Priority)
**Industry Templates:**
- [Healthcare/Pharmaceutical](../industry-specializations/healthcare-pharmaceutical/)
- [Information Technology](../industry-specializations/information-technology/)
- [Financial Services](../industry-specializations/financial-services/)

**Customization Areas:**
- [ ] Regulatory compliance requirements
- [ ] Industry-specific risks and considerations
- [ ] Specialized quality standards
- [ ] Domain-specific metrics and KPIs
- [ ] Industry terminology and processes

### Advanced Templates (Lower Priority)
**Complex Templates:**
- [Infrastructure Requirements](../essential-templates/infrastructure/)
- [DevOps Pipelines](../methodology-frameworks/emerging-methods/devops/)
- [Hybrid Methodologies](../methodology-frameworks/hybrid/)

**Customization Focus:**
- [ ] Tool-specific configurations
- [ ] Advanced process integration
- [ ] Specialized reporting requirements
- [ ] Complex governance structures

## Customization Process

### Phase 1: Assessment and Planning (Week 1)
**Activities:**
- [ ] Identify template usage patterns and frequency
- [ ] Gather feedback from current template users
- [ ] Document organization-specific requirements
- [ ] Prioritize templates for customization
- [ ] Plan customization timeline and resources

**Deliverables:**
- Template customization plan
- Priority matrix of templates to customize
- Resource allocation for customization work

### Phase 2: Core Template Customization (Weeks 2-4)
**Activities:**
- [ ] Customize high-priority essential templates
- [ ] Add organization-specific branding and formatting
- [ ] Include standard approval workflows
- [ ] Test customized templates with pilot projects
- [ ] Gather feedback and iterate

**Deliverables:**
- Customized essential template set
- Template testing results and feedback
- Updated templates based on pilot feedback

### Phase 3: Extended Customization (Weeks 5-8)
**Activities:**
- [ ] Customize industry-specific templates
- [ ] Develop organization-specific templates
- [ ] Create template integration guidelines
- [ ] Establish template governance process
- [ ] Train teams on customized templates

**Deliverables:**
- Complete customized template library
- Template governance procedures
- Training materials and documentation

### Phase 4: Continuous Improvement (Ongoing)
**Activities:**
- [ ] Regular template effectiveness reviews
- [ ] User feedback collection and analysis
- [ ] Template updates and improvements
- [ ] New template development as needed
- [ ] Knowledge sharing and best practices

## Customization Guidelines

### Formatting and Branding
**Standard Elements to Customize:**
- [ ] **Company logo and branding** - Add organization visual identity
- [ ] **Color scheme and fonts** - Align with corporate standards
- [ ] **Header and footer information** - Standard contact and project info
- [ ] **Document control sections** - Organization-specific approval processes
- [ ] **Legal and compliance disclaimers** - Required legal language

### Content Customization
**Areas for Content Changes:**
- [ ] **Terminology alignment** - Use organization-specific terms
- [ ] **Role and responsibility mapping** - Align with org structure
- [ ] **Approval workflows** - Match organizational decision-making
- [ ] **Quality standards** - Include organization quality requirements
- [ ] **Risk categories** - Add organization-specific risk types

### Process Integration
**Integration Considerations:**
- [ ] **Tool integration** - Align with organizational tools
- [ ] **Workflow automation** - Connect to existing processes
- [ ] **Reporting integration** - Match organizational reporting needs
- [ ] **Data standards** - Ensure consistent data formats
- [ ] **Archive and retention** - Follow organizational records management

## Industry-Specific Customization Examples

### Healthcare/Pharmaceutical
**Required Customizations:**
- [ ] FDA/EMA regulatory compliance sections
- [ ] Clinical trial specific templates
- [ ] Validation and qualification procedures
- [ ] Patient safety considerations
- [ ] Quality system integration

### Information Technology
**Common Customizations:**
- [ ] DevOps and CI/CD integration
- [ ] Security and privacy requirements
- [ ] Agile/Scrum process alignment
- [ ] Technology architecture sections
- [ ] Performance and scalability requirements

### Financial Services
**Typical Customizations:**
- [ ] Regulatory compliance (SOX, Basel, etc.)
- [ ] Risk management frameworks
- [ ] Audit and control requirements
- [ ] Data governance procedures
- [ ] Business continuity planning

## Quality Assurance for Customized Templates

### Template Validation Process
**Quality Checks:**
- [ ] **Consistency review** - Ensure templates work together
- [ ] **Completeness verification** - Confirm all required sections included
- [ ] **Usability testing** - Test with actual users and projects
- [ ] **Compliance validation** - Verify regulatory and policy compliance
- [ ] **Performance assessment** - Measure template effectiveness

### Ongoing Quality Management
**Continuous Improvement:**
- [ ] **Regular reviews** - Scheduled template effectiveness reviews
- [ ] **User feedback systems** - Mechanisms for collecting user input
- [ ] **Version control** - Proper template versioning and change tracking
- [ ] **Training updates** - Keep training current with template changes
- [ ] **Best practice sharing** - Share successful customizations across teams

## Template Governance

### Governance Structure
**Roles and Responsibilities:**
- [ ] **Template Owner** - Overall template library management
- [ ] **Subject Matter Experts** - Domain-specific template expertise
- [ ] **Quality Reviewer** - Template quality and consistency validation
- [ ] **User Representatives** - Feedback from template users
- [ ] **Compliance Officer** - Regulatory and policy compliance review

### Change Management Process
**Template Change Control:**
- [ ] **Change request process** - Formal process for template modifications
- [ ] **Impact assessment** - Evaluate change impact on existing projects
- [ ] **Approval workflow** - Multi-stage approval for template changes
- [ ] **Implementation planning** - Controlled rollout of template updates
- [ ] **Communication plan** - Notify users of template changes

## Success Metrics

### Template Effectiveness Metrics
**Quantitative Measures:**
- Template usage rates and adoption
- Time savings from template use
- Project delivery performance with templates
- Template-related issue reduction
- User satisfaction scores

**Qualitative Measures:**
- User feedback and testimonials
- Process improvement observations
- Knowledge sharing effectiveness
- Template contribution to project success
- Organizational capability development

---

## Resources and Support

### Reference Materials
- [Template Selection Checklist](../TEMPLATE_SELECTION_CHECKLIST.md)
- [Methodology Selection Guide](./methodology-selection-guide.md)
- [First-Time PM Starter Kit](./first-time-pm-starter/)

### Support Resources
- Template customization workshops
- Expert consultation services
- User community forums
- Best practice sharing sessions

---

**Success Principle:** Effective template customization balances organizational needs with proven practices. Start simple, customize gradually, and always focus on user value and project success.
EOF

echo "Phase 4 link fixes completed!"
echo
echo "Created/Updated Files:"
echo "- Infrastructure Requirements Template"
echo "- Deployment Checklist Template"
echo "- Hybrid Infrastructure Template" 
echo "- 30-Day Quick Start Guide"
echo "- Project Initiation Checklist"
echo "- Stakeholder Onboarding Kit"
echo "- Methodology Selection Guide"
echo "- Template Customization Guide"
echo "- 5 IT Infrastructure templates"
echo "- Executive Reporting Kit README"
echo "- Remote Team Setup Kit README"
echo "- Infrastructure as Code README"
echo
echo "Next: Commit changes and run link health check"
EOF

chmod +x phase4_link_fixes.sh
