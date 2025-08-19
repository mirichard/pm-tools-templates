---
title: "PEPS.MethodScopeTemplate"
version: "v1.0.0"
template_state: "clean"
intended_audience: ["Project Manager","Program Manager"]
domain: "planning"
artifact: "peps-3-2-method-scope-template"
internal_view: true
external_view: true
confidentiality: "public"
tags: ["planning","template","automation","machine-readable"]
description: "Comprehensive template for PEPS.MethodScopeTemplate management and tracking"
last_reviewed: "2025-08-19"
owner_role: "PMO Templates Maintainer"
automation_ready: true
dependencies: []
---

# PEPS.MethodScopeTemplate

## How to Use

This template provides a structured approach for managing PEPS.MethodScopeTemplate activities. Complete all sections with project-specific information and customize based on your organizational requirements and methodology (traditional, agile, or hybrid).

## Overview

**Project:** {{project_name}}  
**Owner:** {{template_owner}}  
**Created:** {{creation_date}}  
**Last Updated:** {{last_updated}}  
**Status:** {{current_status}}  
**Review Cycle:** {{review_cycle}}

## 1. Purpose and Scope

### Objective
{{primary_objective}}

### Scope
**In Scope:**
- {{scope_item_1}}
- {{scope_item_2}}
- {{scope_item_3}}

**Out of Scope:**
- {{out_scope_item_1}}
- {{out_scope_item_2}}
- {{out_scope_item_3}}

### Success Criteria
1. {{success_criteria_1}}
2. {{success_criteria_2}}
3. {{success_criteria_3}}

## 2. Stakeholder Information

| Stakeholder | Role | Responsibility | Contact | Engagement Level |
|-------------|------|----------------|---------|------------------|
| {{stakeholder_1}} | {{role_1}} | {{responsibility_1}} | {{contact_1}} | {{engagement_1}} |
| {{stakeholder_2}} | {{role_2}} | {{responsibility_2}} | {{contact_2}} | {{engagement_2}} |
| {{stakeholder_3}} | {{role_3}} | {{responsibility_3}} | {{contact_3}} | {{engagement_3}} |

## 3. Planning and Approach

### Methodology
{{selected_methodology}}

### Key Activities
| Activity | Duration | Dependencies | Resources | Deliverables |
|----------|----------|--------------|-----------|--------------|
| {{activity_1}} | {{duration_1}} | {{deps_1}} | {{resources_1}} | {{deliverables_1}} |
| {{activity_2}} | {{duration_2}} | {{deps_2}} | {{resources_2}} | {{deliverables_2}} |
| {{activity_3}} | {{duration_3}} | {{deps_3}} | {{resources_3}} | {{deliverables_3}} |

### Timeline
- **Start Date:** {{start_date}}
- **Key Milestones:** {{key_milestones}}
- **End Date:** {{end_date}}
- **Total Duration:** {{total_duration}}

## 4. Risk and Issue Management

### Risk Register
| Risk ID | Description | Probability | Impact | Mitigation Strategy | Owner |
|---------|-------------|-------------|--------|-------------------|-------|
| {{risk_1}} | {{risk_desc_1}} | {{prob_1}} | {{impact_1}} | {{mitigation_1}} | {{risk_owner_1}} |
| {{risk_2}} | {{risk_desc_2}} | {{prob_2}} | {{impact_2}} | {{mitigation_2}} | {{risk_owner_2}} |

### Current Issues
| Issue ID | Description | Priority | Status | Assigned To | Target Resolution |
|----------|-------------|----------|--------|-------------|-------------------|
| {{issue_1}} | {{issue_desc_1}} | {{priority_1}} | {{status_1}} | {{assigned_1}} | {{resolution_1}} |
| {{issue_2}} | {{issue_desc_2}} | {{priority_2}} | {{status_2}} | {{assigned_2}} | {{resolution_2}} |

## 5. Quality and Acceptance

### Quality Standards
- {{quality_standard_1}}
- {{quality_standard_2}}
- {{quality_standard_3}}

### Acceptance Criteria
1. {{acceptance_criteria_1}}
2. {{acceptance_criteria_2}}
3. {{acceptance_criteria_3}}

### Review and Approval Process
| Review Type | Frequency | Participants | Deliverables |
|-------------|-----------|--------------|--------------|
| {{review_type_1}} | {{frequency_1}} | {{participants_1}} | {{deliverables_1}} |
| {{review_type_2}} | {{frequency_2}} | {{participants_2}} | {{deliverables_2}} |

## 6. Communication Plan

### Reporting Schedule
- **Weekly Status:** {{weekly_audience}}
- **Monthly Reviews:** {{monthly_audience}}
- **Milestone Reports:** {{milestone_audience}}
- **Exception Reports:** {{exception_criteria}}

### Communication Channels
| Channel | Purpose | Frequency | Audience |
|---------|---------|-----------|----------|
| {{channel_1}} | {{purpose_1}} | {{freq_1}} | {{audience_1}} |
| {{channel_2}} | {{purpose_2}} | {{freq_2}} | {{audience_2}} |

## 7. Approval and Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Template Owner | {{owner_name}} | ________________ | {{owner_date}} |
| Project Manager | {{pm_name}} | ________________ | {{pm_date}} |
| Business Sponsor | {{sponsor_name}} | ________________ | {{sponsor_date}} |

## Data Fields (machine-readable)

```yaml
template_data:
  metadata:
    template_id: "{{template_id}}"
    version: "{{version}}"
    status: "{{status}}"
    last_updated: "{{last_updated}}"
  project:
    name: "{{project_name}}"
    phase: "{{current_phase}}"
    methodology: "{{methodology}}"
  metrics:
    completion_percentage: {{completion_percentage}}
    schedule_health: "{{schedule_status}}"
    budget_health: "{{budget_status}}"
    quality_score: {{quality_score}}
  stakeholders:
    count: {{stakeholder_count}}
    engagement_score: {{engagement_score}}
```

## Internal vs External Use

### Internal View
- Include detailed technical specifications and internal processes
- Reference internal systems, tools, and organizational structure
- Use internal terminology and abbreviations
- Include sensitive cost and resource information

### External View
- Focus on outcomes, deliverables, and business value
- Use stakeholder-friendly language and terminology
- Emphasize benefits and competitive advantages
- Exclude sensitive internal operational details

## Related Templates

- [Project Charter Template](../planning/project-charter-template.md)
- [Risk Register Template](../risk/risk-register-template.md)
- [Status Report Template](../status/status-report-template.md)
- [Stakeholder Analysis Template](../stakeholders/stakeholder-analysis-template.md)

---

*This template follows PMI standards and supports traditional, agile, and hybrid methodologies with automation-ready data fields.*
