---
title: "Tem-WP-DefectTrackingMatrix-v - PHM"
version: "v1.0.0"
template_state: "clean"
intended_audience: ["Project Manager","Program Manager","Business Analyst"]
domain: "risk"
artifact: "tem-wp1369-defecttrackingmatrix-v02-phm"
internal_view: true
external_view: true
confidentiality: "public"
tags: ["risk","matrix","analysis","automation","machine-readable"]
description: "Structured matrix for Tem-WP-DefectTrackingMatrix-v - PHM tracking and analysis"
last_reviewed: "2025-08-19"
owner_role: "PMO Templates Maintainer"
automation_ready: true
dependencies: []
---

# Tem-WP-DefectTrackingMatrix-v - PHM

## How to Use

This matrix provides a structured approach to track, analyze, and manage related items. Use the provided template to ensure comprehensive coverage and maintain clear relationships between elements.

## Matrix Overview

**Project:** {{project_name}}  
**Matrix Owner:** {{matrix_owner}}  
**Last Updated:** {{last_updated}}  
**Version:** {{matrix_version}}  
**Status:** {{matrix_status}}

## Matrix Structure

| ID | Item | Category | Priority | Status | Owner | Due Date | Dependencies | Notes |
|----|------|----------|----------|--------|-------|----------|--------------|-------|
| {{id_1}} | {{item_1}} | {{category_1}} | {{priority_1}} | {{status_1}} | {{owner_1}} | {{due_1}} | {{deps_1}} | {{notes_1}} |
| {{id_2}} | {{item_2}} | {{category_2}} | {{priority_2}} | {{status_2}} | {{owner_2}} | {{due_2}} | {{deps_2}} | {{notes_2}} |
| {{id_3}} | {{item_3}} | {{category_3}} | {{priority_3}} | {{status_3}} | {{owner_3}} | {{due_3}} | {{deps_3}} | {{notes_3}} |

## Analysis Summary

### By Category
| Category | Count | Complete | In Progress | Not Started |
|----------|-------|----------|-------------|-------------|
| {{cat_1}} | {{count_1}} | {{complete_1}} | {{progress_1}} | {{not_started_1}} |
| {{cat_2}} | {{count_2}} | {{complete_2}} | {{progress_2}} | {{not_started_2}} |
| {{cat_3}} | {{count_3}} | {{complete_3}} | {{progress_3}} | {{not_started_3}} |

### By Priority
| Priority | Count | Percentage | Status |
|----------|-------|------------|--------|
| Critical | {{critical_count}} | {{critical_percent}}% | {{critical_status}} |
| High | {{high_count}} | {{high_percent}}% | {{high_status}} |
| Medium | {{medium_count}} | {{medium_percent}}% | {{medium_status}} |
| Low | {{low_count}} | {{low_percent}}% | {{low_status}} |

## Relationships and Dependencies

### Critical Path Items
1. {{critical_path_1}}
2. {{critical_path_2}}
3. {{critical_path_3}}

### Dependency Mapping
- **{{item_a}}** depends on **{{item_b}}** - {{dependency_reason_1}}
- **{{item_c}}** depends on **{{item_d}}** - {{dependency_reason_2}}
- **{{item_e}}** depends on **{{item_f}}** - {{dependency_reason_3}}

## Action Items

### Immediate Actions Required
| Action | Owner | Due Date | Priority | Status |
|--------|-------|----------|----------|--------|
| {{action_1}} | {{action_owner_1}} | {{action_due_1}} | {{action_priority_1}} | {{action_status_1}} |
| {{action_2}} | {{action_owner_2}} | {{action_due_2}} | {{action_priority_2}} | {{action_status_2}} |

### Escalations
| Issue | Impact | Escalation Path | Target Resolution |
|-------|--------|-----------------|-------------------|
| {{escalation_1}} | {{impact_1}} | {{path_1}} | {{resolution_1}} |
| {{escalation_2}} | {{impact_2}} | {{path_2}} | {{resolution_2}} |

## Data Fields (machine-readable)

```yaml
matrix_data:
  summary:
    total_items: {{total_items}}
    completed_items: {{completed_items}}
    completion_percentage: {{completion_percentage}}
    last_updated: "{{last_updated}}"
  status_breakdown:
    not_started: {{not_started_count}}
    in_progress: {{in_progress_count}}
    completed: {{completed_count}}
    blocked: {{blocked_count}}
  priority_distribution:
    critical: {{critical_count}}
    high: {{high_count}}
    medium: {{medium_count}}
    low: {{low_count}}
  health_metrics:
    on_track: {{on_track_percentage}}
    at_risk: {{at_risk_percentage}}
    overdue: {{overdue_percentage}}
```

## Related Templates

- [Dependency Log Template](../monitoring/dependency-log-template.md)
- [Status Report Template](../status/status-report-template.md)
- [Risk Register Template](../risk/risk-register-template.md)

---

*This matrix template supports PMI tracking standards and includes automation hooks for dashboard reporting.*
