# Task #806: Rules Engine Implementation

**Story:** #727 ([Selection] – Rules Engine Core)
**Epic:** #709 (Epic 2: Template Decision Engine)
**Date:** 2026-05-31
**Status:** Complete
**Closes:** #806

---

## Overview

This document implements the Template Decision Engine's rules engine — a filter-and-rank system that matches project context profiles to template recommendations. It builds on the context assessment model (#800/#801) and rules format design (#804/#805).

**Design principle:** Filter-and-rank, not weighted scoring. Users need a short, relevant list — not a ranked score of 137+ templates.

**Input:** A project context profile with 7 dimensions (see [Context Assessment Model](800-801-context-assessment-model.md))
**Output:** A prioritized recommendation card with essential, recommended, and optional templates

---

## Assessment Dimensions

### Dimension 1: Methodology
Determines the primary template pool.

| Value | Description | Template Pool |
|-------|-------------|---------------|
| `traditional` | Waterfall, PMBOK-aligned, sequential | Traditional (23) + Universal (88) |
| `agile` | Scrum, Kanban, iterative delivery | Agile (19) + Universal (88) |
| `hybrid` | Mixed traditional + agile elements | Hybrid (7) + Universal (88) |
| `unsure` | Not yet decided | → Direct to [Methodology Selection Guide](../../quick-start-kits/methodology-selection-guide.md) first |

### Dimension 2: Project Phase
Determines which lifecycle templates are immediately relevant.

| Value | Description | Primary Template Sources |
|-------|-------------|------------------------|
| `starting` | Project initiation, chartering | `project-lifecycle/01-initiation/` |
| `planning` | Detailed planning underway | `project-lifecycle/02-planning/` |
| `in_progress` | Execution and delivery | `project-lifecycle/03-execution/`, `04-monitoring-control/` |
| `closing` | Wrap-up and handover | `project-lifecycle/05-closure/` |

### Dimension 3: Risk Profile
Triggers additional risk/governance templates.

| Value | Description | Supplements Added |
|-------|-------------|-------------------|
| `low` | Minimal risk exposure | Base set only |
| `medium` | Moderate risk, some unknowns | + Risk register, basic risk plan |
| `high` | Significant risk, critical project | + Risk assessment, governance assessment, change control |
| `regulatory` | Compliance/audit requirements | + All high-risk templates + industry compliance templates |

### Dimension 4: Team Size
Affects coordination overhead and template complexity.

| Value | Description | Toolkit Recommendation |
|-------|-------------|----------------------|
| `solo` | Individual contributor | `quick-start-kits/` (lightweight) |
| `small` | 2–9 people | `quick-start-kits/` (lightweight) |
| `medium` | 10–50 people | `role-based-toolkits/` (standard) |
| `large` | 50+ people | `role-based-toolkits/` + `business-stakeholder-suite/` (full governance) |

### Dimension 5: Industry/Domain
Triggers industry-specific template supplements.

| Value | Description | Supplement Source |
|-------|-------------|-------------------|
| `general` | No industry-specific needs | No supplements |
| `it` | Information technology / software | `industry-specializations/information-technology/` |
| `healthcare` | Healthcare / pharmaceutical | `industry-specializations/healthcare-pharmaceutical/` |
| `financial` | Financial services | `industry-specializations/financial-services/` |
| `construction` | Construction / engineering | (no dedicated templates yet — use general + Traditional) |

### Dimension 6: PM Experience
Controls template complexity preference.

| Value | Description | Complexity Filter |
|-------|-------------|-------------------|
| `new` | First-time or junior PM | Prefer starter/simplified templates; recommend `quick-start-kits/first-time-pm-starter/` |
| `intermediate` | Some PM experience | Allow starter + intermediate complexity |
| `advanced` | Senior / certified PM | All complexities; recommend `role-based-toolkits/` |

### Dimension 7: Project Size
Determines governance overhead.

| Value | Description | Governance Level |
|-------|-------------|-----------------|
| `small` | < 3 months, limited scope | Essential templates only |
| `medium` | 3–12 months, moderate scope | Core PM lifecycle templates |
| `large` | 1–2 years, significant scope | Full template suite + governance |
| `enterprise` | 2+ years, program-level | Program management + portfolio + financial governance |

---

## Filter-and-Rank Algorithm

The engine processes dimensions in this order. Each step narrows or supplements the candidate set.

```
Step 1: METHODOLOGY FILTER
   → Keep templates where template.methodology IN (selected, "universal")
   → If "unsure" → output methodology-selection-guide.md link, halt

Step 2: PHASE FILTER
   → Prioritize templates matching the selected lifecycle phase
   → Mark phase-matched templates as "essential"
   → Keep non-phase templates as "recommended" or "optional"

Step 3: EXPERIENCE COMPLEXITY FILTER
   → If new → exclude advanced/comprehensive templates
   → If intermediate → include starter + intermediate
   → If advanced → include all

Step 4: RISK SUPPLEMENTS
   → If high/regulatory → add risk + governance templates
   → If regulatory → also add compliance templates from industry-specializations/

Step 5: INDUSTRY SUPPLEMENTS
   → If industry != general → add industry-specializations/{industry}/ templates

Step 6: SIZE/GOVERNANCE SUPPLEMENTS
   → If large/enterprise → add program management, portfolio, financial governance
   → If enterprise → add benefits realization + ROI tracking

Step 7: TEAM SIZE TOOLKIT
   → Solo/small → recommend quick-start-kits/
   → Medium → recommend role-based-toolkits/
   → Large → recommend role-based-toolkits/ + business-stakeholder-suite/

Step 8: RANK AND OUTPUT
   → "essential" = matches phase + methodology + experience level
   → "recommended" = matches 2 of 3 criteria
   → "optional" = matches 1 criterion or is a supplement
   → Output top 3–5 essential + all supplements
```

---

## Rules Catalog

### R001–R003: Methodology Filter Rules

**R001: Traditional Methodology**
- **Condition:** `methodology = "traditional"`
- **Action:** Include Traditional + Universal templates
- **Essential templates:**
  - [Project Charter Template](../../templates/traditional/Traditional/Process_Groups/Initiating/project_charter_template.md)
  - [Project Management Plan Template](../../templates/traditional/Traditional/Process_Groups/Planning/project_management_plan_template.md)
  - [Work Breakdown Structure Template](../../templates/traditional/Traditional/Process_Groups/Planning/work_breakdown_structure_template.md)
  - [Project Schedule Template](../../templates/traditional/Traditional/Process_Groups/Planning/project_schedule_template.md)
  - [Change Management Plan Template](../../templates/traditional/Traditional/Templates/change_management_plan_template.md)
  - [Communication Plan Template](../../templates/traditional/Traditional/Templates/communication_plan_template.md)
  - [Project Closure Report Template](../../templates/traditional/Traditional/Process_Groups/Closing/project_closure_report_template.md)
- **Why:** These are the core PMBOK-aligned process group templates for sequential delivery
- **Why not Agile:** Agile ceremonies (sprints, standups, retrospectives) don't apply to waterfall

**R002: Agile Methodology**
- **Condition:** `methodology = "agile"`
- **Action:** Include Agile + Universal templates
- **Essential templates:**
  - [Product Backlog Template](../../templates/agile/product_backlog_template.md)
  - [Sprint Planning Template](../../templates/agile/sprint_planning_template.md)
  - [Sprint Review Template](../../templates/agile/sprint_review_template.md)
  - [Sprint Retrospective Template](../../templates/agile/sprint_retrospective_template.md)
  - [Daily Standup Template](../../role-based-toolkits/scrum-master/agile-ceremonies/daily-standup-template.md)
  - [Backlog Refinement Template](../../role-based-toolkits/scrum-master/agile-ceremonies/backlog-refinement-template.md)
- **Why:** Core Scrum ceremonies and artifacts for iterative delivery
- **Why not Traditional:** Gantt charts, WBS, and sequential gate reviews conflict with agile values

**R003: Hybrid Methodology**
- **Condition:** `methodology = "hybrid"`
- **Action:** Include Hybrid + Universal templates
- **Essential templates:**
  - [Hybrid Project Charter Template](../../templates/hybrid/Hybrid/Templates/hybrid_project_charter_template.md)
  - [Hybrid Release Planning Template](../../templates/hybrid/Hybrid/Templates/hybrid_release_planning_template.md)
  - [Hybrid Quality Management Template](../../templates/hybrid/Hybrid/Templates/hybrid_quality_management_template.md)
  - [Hybrid Team Management Template](../../templates/hybrid/Hybrid/Templates/hybrid_team_management_template.md)
  - [Integrated Change Strategy Template](../../templates/hybrid/Hybrid/Templates/integrated_change_strategy_template.md)
  - [Hybrid Infrastructure Template](../../methodology-frameworks/hybrid/infrastructure/hybrid-infrastructure-template.md)
- **Why:** Purpose-built for mixed methodology environments with integration points
- **Why not pure Traditional/Agile:** Hybrid templates bridge both worlds; pure methodology templates assume a single approach

### R004–R007: Phase Filter Rules

**R004: Starting Phase**
- **Condition:** `phase = "starting"`
- **Action:** Prioritize initiation templates
- **Essential templates:**
  - [Traditional Project Charter Template](../../project-lifecycle/01-initiation/project-charter/traditional-project-charter-template.md) (traditional)
  - [Agile Team Charter Template](../../project-lifecycle/01-initiation/project-charter/agile-team-charter-template.md) (agile)
  - [Stakeholder Register Template](../../project-lifecycle/01-initiation/stakeholder-analysis/stakeholder-register-template.md)
  - [Business Case Template](../../templates/traditional/Traditional/Templates/business_case_template.md)
- **Why:** Chartering and stakeholder identification are prerequisites for all subsequent work

**R005: Planning Phase**
- **Condition:** `phase = "planning"`
- **Action:** Prioritize planning templates
- **Essential templates:**
  - [Risk Management Plan Template](../../project-lifecycle/02-planning/risk-management/risk-management-plan-template.md)
  - [Risk Register Template](../../project-lifecycle/02-planning/risk-management/risk-register-template.md)
  - [Resource Management Plan Template](../../project-lifecycle/02-planning/resource-planning/resource-management-plan-template.md)
  - [Traditional Project Management Plan Template](../../project-lifecycle/02-planning/project-management-plan/traditional-project-management-plan-template.md) (traditional)
  - [Agile Release Plan Template](../../project-lifecycle/02-planning/project-management-plan/agile-release-plan-template.md) (agile)
- **Why:** Planning artifacts establish baselines for scope, schedule, cost, risk, and resources

**R006: In-Progress Phase**
- **Condition:** `phase = "in_progress"`
- **Action:** Prioritize execution and monitoring templates
- **Essential templates:**
  - [Status Report Template](../../project-lifecycle/04-monitoring-control/progress-tracking/status-report-template.md)
  - [Project Dashboard Template](../../project-lifecycle/04-monitoring-control/progress-tracking/project-dashboard-template.md)
  - [Project Execution Status Report Template](../../templates/traditional/Traditional/Process_Groups/Executing/project_execution_status_report_template.md) (traditional)
  - [Issue Log Template](../../templates/traditional/Traditional/Templates/issue_log_template.md)
  - [Change Request Template](../../templates/traditional/Traditional/Templates/change_request_template.md)
- **Why:** Active projects need tracking, reporting, and change management

**R007: Closing Phase**
- **Condition:** `phase = "closing"`
- **Action:** Prioritize closure templates
- **Essential templates:**
  - [Project Closure Report Template](../../templates/traditional/Traditional/Process_Groups/Closing/project_closure_report_template.md)
  - [Handover Template](../../role-based-toolkits/project-manager/essential-templates/handover-template.md)
  - [Less Retrospective Template](../../methodology-frameworks/agile-scrum/scaling-frameworks/less/less_retrospective_template.md) (agile)
- **Why:** Formal closure, knowledge transfer, and lessons learned ensure organizational learning

### R008–R011: Risk Supplement Rules

**R008: Medium Risk**
- **Condition:** `risk_profile = "medium"`
- **Action:** Add basic risk templates
- **Supplements:**
  - [Risk Register Template](../../project-lifecycle/02-planning/risk-management/risk-register-template.md)
  - [Risk Management Plan Template](../../project-lifecycle/02-planning/risk-management/risk-management-plan-template.md)
- **Why:** Moderate risk requires structured tracking but not full governance overhead

**R009: High Risk**
- **Condition:** `risk_profile = "high"`
- **Action:** Add comprehensive risk + governance templates
- **Supplements:**
  - [Enterprise Risk Assessment Template](../../project-lifecycle/02-planning/risk-management/enterprise-risk-assessment-template.md)
  - [Governance Assessment Template](../../project-assessment-suite/governance-assessment-template.md)
  - [Risk Management Assessment Template](../../project-assessment-suite/risk-management-assessment-template.md)
  - [Change Management Plan Template](../../templates/traditional/Traditional/Templates/change_management_plan_template.md)
  - [Project Health Assessment Template](../../project-assessment-suite/project-health-assessment-template.md)
- **Why:** High-risk projects need proactive risk identification, governance oversight, and change control

**R010: Regulatory Risk**
- **Condition:** `risk_profile = "regulatory"`
- **Action:** Include all R009 supplements + compliance templates
- **Additional supplements (industry-dependent):**
  - Healthcare: [Compliance Risk Assessment Template](../../industry-specializations/healthcare-pharmaceutical/regulatory/compliance_risk_assessment_template.md), [CAPA Management Template](../../industry-specializations/healthcare-pharmaceutical/compliance/capa_management_template.md)
  - Financial: [Compliance Management Template](../../industry-specializations/financial-services/compliance/compliance-management-template.md)
  - IT: [Cybersecurity Assessment Template](../../industry-specializations/information-technology/security/cybersecurity_assessment_template.md)
- **Why:** Regulatory environments require documented compliance, audit trails, and inspection readiness

**R011: Low Risk**
- **Condition:** `risk_profile = "low"`
- **Action:** No risk supplements added
- **Why:** Low-risk projects don't benefit from governance overhead; keep template set lean

### R012–R015: Industry Supplement Rules

**R012: IT/Software Industry**
- **Condition:** `industry = "it"`
- **Action:** Add IT specialization templates
- **Supplements:**
  - [Requirements Specification Template](../../industry-specializations/information-technology/software-development/requirements_specification_template.md)
  - [Technical Design Document Template](../../industry-specializations/information-technology/software-development/technical_design_document_template.md)
  - [Test Plan Template](../../industry-specializations/information-technology/software-development/test_plan_template.md)
  - [API Documentation Template](../../industry-specializations/information-technology/software-development/api_documentation_template.md)
  - [Digital Transformation Strategy Template](../../industry-specializations/information-technology/digital-transformation/digital_transformation_strategy_template.md) (large/enterprise only)
- **Why:** Software projects need requirements traceability, technical design, and test planning

**R013: Healthcare/Pharmaceutical Industry**
- **Condition:** `industry = "healthcare"`
- **Action:** Add healthcare specialization templates
- **Supplements:**
  - [Validation Master Plan Template](../../industry-specializations/healthcare-pharmaceutical/validation/validation_master_plan_template.md)
  - [Process Validation Protocol Template](../../industry-specializations/healthcare-pharmaceutical/regulatory/process_validation_protocol_template.md)
  - [GxP Training Plan Template](../../industry-specializations/healthcare-pharmaceutical/compliance/gxp_training_plan_template.md)
  - [Quality Management Review Template](../../industry-specializations/healthcare-pharmaceutical/quality/quality_management_review_template.md)
  - [Regulatory Strategy Plan Template](../../industry-specializations/healthcare-pharmaceutical/regulatory/regulatory_strategy_plan_template.md)
- **Why:** Healthcare projects must meet GxP, FDA/EMA, and validation requirements

**R014: Financial Services Industry**
- **Condition:** `industry = "financial"`
- **Action:** Add financial specialization templates
- **Supplements:**
  - [Compliance Management Template](../../industry-specializations/financial-services/compliance/compliance-management-template.md)
  - [ROI Tracking Template](../../templates/traditional/Traditional/Knowledge_Areas/Project_Cost_Management/roi_tracking_template.md)
  - [Advanced Business Case Template](../../business-stakeholder-suite/financial-governance/enhanced-business-cases/advanced-business-case-template.md)
  - [EVM Dashboard Template](../../business-stakeholder-suite/financial-governance/enhanced-business-cases/evm-dashboard-template.md)
- **Why:** Financial services require compliance tracking, value demonstration, and earned value management

**R015: General/Construction Industry**
- **Condition:** `industry IN ("general", "construction")`
- **Action:** No industry supplements; rely on base methodology templates
- **Why:** General projects use the universal template set; construction uses Traditional methodology as closest fit

### R016–R019: Project Size Rules

**R016: Small Project**
- **Condition:** `size = "small"`
- **Action:** Limit to essential templates only (3–5 templates)
- **Rationale:** Small projects are harmed by excessive documentation overhead

**R017: Medium Project**
- **Condition:** `size = "medium"`
- **Action:** Include core PM lifecycle templates (5–10 templates)
- **Additional recommendations:**
  - [Budget Template](../../role-based-toolkits/project-manager/essential-templates/budget-template.md)
  - [Meeting Templates](../../role-based-toolkits/project-manager/essential-templates/meeting-templates.md)
- **Rationale:** Medium projects benefit from structured planning without full governance

**R018: Large Project**
- **Condition:** `size = "large"`
- **Action:** Include full template suite + governance templates
- **Additional recommendations:**
  - [Program Charter Template](../../templates/traditional/Traditional/Templates/program_charter_template.md)
  - [Executive Dashboard Template](../../business-stakeholder-suite/executive-dashboards/powerbi-integration/executive-dashboard-template.md)
  - [Budget Dashboard Template](../../business-stakeholder-suite/financial-governance/budget-dashboard-template.md)
  - [Enterprise Stakeholder Analysis Template](../../project-lifecycle/01-initiation/stakeholder-analysis/enterprise-stakeholder-analysis-template.md)
- **Rationale:** Large projects need multi-level governance, executive reporting, and stakeholder management

**R019: Enterprise Project**
- **Condition:** `size = "enterprise"`
- **Action:** Include all R018 templates + program/portfolio management
- **Additional recommendations:**
  - [Program Management Plan Template](../../templates/traditional/Traditional/Templates/program_management_plan_template.md)
  - [ROI Tracking Template](../../templates/traditional/Traditional/Knowledge_Areas/Project_Cost_Management/roi_tracking_template.md)
  - [Executive Report Templates](../../business-stakeholder-suite/executive-dashboards/Word/Executive-Report-Templates.md)
  - [Portfolio Kanban Template](../../methodology-frameworks/agile-scrum/scaling-frameworks/safe/portfolio_kanban_template.md) (agile)
  - [SAFe Program Increment Planning Template](../../methodology-frameworks/agile-scrum/scaling-frameworks/safe/safe_program_increment_planning_template.md) (agile)
- **Rationale:** Enterprise programs require portfolio-level visibility, value tracking, and multi-team coordination

### R020–R022: Team Size Toolkit Rules

**R020: Solo/Small Team**
- **Condition:** `team_size IN ("solo", "small")`
- **Action:** Recommend lightweight toolkit
- **Toolkit:** [Quick Start Kits](../../quick-start-kits/) — especially [30-Day Quick Start](../../quick-start-kits/30-day-quick-start.md) and [Project Initiation Checklist](../../quick-start-kits/project-initiation-checklist.md)
- **Rationale:** Small teams need minimal process overhead; quick-start materials provide the fastest path to value

**R021: Medium Team**
- **Condition:** `team_size = "medium"`
- **Action:** Recommend standard toolkits
- **Toolkit:** [Role-Based Toolkits](../../role-based-toolkits/) — select based on user's role (PM, Scrum Master, Product Owner)
- **Rationale:** Medium teams need role clarity and structured ceremonies but not enterprise governance

**R022: Large Team**
- **Condition:** `team_size = "large"`
- **Action:** Recommend full governance suite
- **Toolkit:** [Role-Based Toolkits](../../role-based-toolkits/) + [Business Stakeholder Suite](../../business-stakeholder-suite/)
- **Additional:** [SAFe/LeSS scaling frameworks](../../methodology-frameworks/agile-scrum/scaling-frameworks/) for agile at scale
- **Rationale:** Large teams need executive communication, financial governance, and scaling frameworks

### R023–R025: PM Experience Rules

**R023: New PM**
- **Condition:** `pm_experience = "new"`
- **Action:** Filter to starter-complexity templates; add onboarding
- **Recommendations:**
  - Start with [First-Time PM Starter Kit](../../quick-start-kits/first-time-pm-starter/)
  - Use [Template Customization Guide](../../quick-start-kits/template-customization-guide.md)
  - See [Methodology Selection Guide](../../quick-start-kits/methodology-selection-guide.md) if unsure about approach
- **Rationale:** New PMs need guided, simplified templates — comprehensive versions cause analysis paralysis

**R024: Intermediate PM**
- **Condition:** `pm_experience = "intermediate"`
- **Action:** Allow starter + intermediate complexity templates
- **Recommendations:**
  - Use methodology-specific templates from the selected methodology
  - Add [Project Assessment Suite](../../project-assessment-suite/) for health checks
- **Rationale:** Intermediate PMs can handle standard templates and benefit from assessment tools

**R025: Advanced PM**
- **Condition:** `pm_experience = "advanced"`
- **Action:** All template complexities available
- **Recommendations:**
  - Full [Role-Based Toolkits](../../role-based-toolkits/) access
  - [Process Maturity Assessment Template](../../project-assessment-suite/process-maturity-assessment-template.md) for optimization
- **Rationale:** Advanced PMs can leverage comprehensive templates and tailor them to context

---

## Output Format

The rules engine produces a **Recommendation Card** in markdown. Example:

```
──────────────────────────────────────────────────────────────
PROJECT CONTEXT SUMMARY
  Methodology: Agile | Phase: Planning | Risk: High
  Team: Medium (10-50) | Industry: IT | Experience: Intermediate
  Size: Medium (3-12 months)
──────────────────────────────────────────────────────────────

ESSENTIAL TEMPLATES (start with these):
  1. Product Backlog Template
     → templates/agile/product_backlog_template.md
     Rule: R002 (Agile methodology)
  2. Sprint Planning Template
     → templates/agile/sprint_planning_template.md
     Rule: R002 (Agile methodology)
  3. Agile Release Plan Template
     → project-lifecycle/02-planning/project-management-plan/agile-release-plan-template.md
     Rule: R002 + R005 (Agile + Planning phase)
  4. Risk Register Template
     → project-lifecycle/02-planning/risk-management/risk-register-template.md
     Rule: R005 + R009 (Planning phase + High risk)

RECOMMENDED TEMPLATES:
  5. Sprint Review Template
     → templates/agile/sprint_review_template.md
     Rule: R002 (Agile methodology)
  6. Backlog Refinement Template
     → role-based-toolkits/scrum-master/agile-ceremonies/backlog-refinement-template.md
     Rule: R002 (Agile methodology)

RISK SUPPLEMENTS (high risk profile):
  7. Enterprise Risk Assessment Template
     → project-lifecycle/02-planning/risk-management/enterprise-risk-assessment-template.md
     Rule: R009 (High risk)
  8. Governance Assessment Template
     → project-assessment-suite/governance-assessment-template.md
     Rule: R009 (High risk)
  9. Project Health Assessment Template
     → project-assessment-suite/project-health-assessment-template.md
     Rule: R009 (High risk)

INDUSTRY SUPPLEMENTS (IT):
  10. Requirements Specification Template
      → industry-specializations/information-technology/software-development/requirements_specification_template.md
      Rule: R012 (IT industry)
  11. Test Plan Template
      → industry-specializations/information-technology/software-development/test_plan_template.md
      Rule: R012 (IT industry)

RECOMMENDED TOOLKIT:
  → Role-Based Toolkits (role-based-toolkits/)
  Rule: R021 (Medium team)

CROSS-REFERENCES:
  → Template Selection Checklist: TEMPLATE_SELECTION_CHECKLIST.md
  → Methodology Selection Guide: quick-start-kits/methodology-selection-guide.md
  → Template Index: TEMPLATE_INDEX.md
──────────────────────────────────────────────────────────────
```

---

## Rule Interaction Matrix

When multiple rules apply, they interact as follows:

| Combination | Behavior |
|-------------|----------|
| Methodology + Phase | Phase filters within methodology pool; both contribute to "essential" ranking |
| Risk + Industry | Regulatory risk triggers industry-specific compliance templates (R010 selects from R012–R014) |
| Size + Team Size | These are independent dimensions; size controls governance overhead, team controls toolkit |
| Experience + Size | New PM + Enterprise is a conflict → recommend mentoring + simplified versions of governance templates |
| Phase + Risk | High-risk projects in starting phase get risk templates promoted to "essential" instead of "supplement" |

### Conflict Resolution
1. **Methodology always wins** — if a template doesn't match the selected methodology or "universal", it's excluded regardless of other rules
2. **Phase prioritizes** — phase-matched templates rank higher than non-phase templates
3. **Risk supplements are additive** — they never replace base templates, only add to them
4. **Experience filters last** — after all other rules, experience filters remove templates that are too complex for the user's level

---

## Edge Cases and Limitations

1. **"Unsure" methodology** — The engine cannot produce template recommendations without a methodology. Users are directed to the [Methodology Selection Guide](../../quick-start-kits/methodology-selection-guide.md) first.
2. **Construction industry** — No dedicated industry templates exist. The engine recommends Traditional methodology templates as the closest fit and notes this gap.
3. **New PM + Enterprise** — This combination is unusual and may indicate the user needs organizational support. The engine recommends simplified templates with a note to seek mentoring.
4. **Multiple industries** — The current schema supports only one industry. Cross-industry projects should select the industry with the strongest compliance requirements.
5. **Mid-project methodology change** — If a project switches methodology mid-stream, re-run the engine with updated methodology and `in_progress` phase.

---

## Integration Points

- **Existing assets:** This rules engine references the same template paths used in [TEMPLATE_INDEX.md](../../TEMPLATE_INDEX.md) and [TEMPLATE_SELECTION_CHECKLIST.md](../../TEMPLATE_SELECTION_CHECKLIST.md)
- **Methodology Selection Guide:** Users who select `methodology = "unsure"` are routed to [quick-start-kits/methodology-selection-guide.md](../../quick-start-kits/methodology-selection-guide.md) before the rules engine runs
- **Context Assessment Model:** Input schema defined in [800-801-context-assessment-model.md](800-801-context-assessment-model.md)
- **Rules Format Design:** Algorithm and JSON format defined in [804-805-rules-engine-design.md](804-805-rules-engine-design.md)
- **Decision Tree (Story #728):** The rules engine output feeds into the decision tree designed in #808/#809

---

## JSON Rules (Machine-Parseable)

For future programmatic consumption, the rules above are also expressible in JSON:

```json
{
  "engine_version": "1.0",
  "rules": [
    {"id": "R001", "dimension": "methodology", "condition": {"methodology": "traditional"}, "action": "include", "pool": ["traditional", "universal"], "priority": "essential"},
    {"id": "R002", "dimension": "methodology", "condition": {"methodology": "agile"}, "action": "include", "pool": ["agile", "universal"], "priority": "essential"},
    {"id": "R003", "dimension": "methodology", "condition": {"methodology": "hybrid"}, "action": "include", "pool": ["hybrid", "universal"], "priority": "essential"},
    {"id": "R004", "dimension": "phase", "condition": {"phase": "starting"}, "action": "prioritize", "source": "project-lifecycle/01-initiation/", "priority": "essential"},
    {"id": "R005", "dimension": "phase", "condition": {"phase": "planning"}, "action": "prioritize", "source": "project-lifecycle/02-planning/", "priority": "essential"},
    {"id": "R006", "dimension": "phase", "condition": {"phase": "in_progress"}, "action": "prioritize", "source": "project-lifecycle/03-execution/ + 04-monitoring-control/", "priority": "essential"},
    {"id": "R007", "dimension": "phase", "condition": {"phase": "closing"}, "action": "prioritize", "source": "project-lifecycle/05-closure/", "priority": "essential"},
    {"id": "R008", "dimension": "risk", "condition": {"risk_profile": "medium"}, "action": "add", "priority": "recommended"},
    {"id": "R009", "dimension": "risk", "condition": {"risk_profile": "high"}, "action": "add", "priority": "recommended"},
    {"id": "R010", "dimension": "risk", "condition": {"risk_profile": "regulatory"}, "action": "add", "priority": "essential"},
    {"id": "R011", "dimension": "risk", "condition": {"risk_profile": "low"}, "action": "none"},
    {"id": "R012", "dimension": "industry", "condition": {"industry": "it"}, "action": "add", "source": "industry-specializations/information-technology/", "priority": "recommended"},
    {"id": "R013", "dimension": "industry", "condition": {"industry": "healthcare"}, "action": "add", "source": "industry-specializations/healthcare-pharmaceutical/", "priority": "recommended"},
    {"id": "R014", "dimension": "industry", "condition": {"industry": "financial"}, "action": "add", "source": "industry-specializations/financial-services/", "priority": "recommended"},
    {"id": "R015", "dimension": "industry", "condition": {"industry": ["general", "construction"]}, "action": "none"},
    {"id": "R016", "dimension": "size", "condition": {"size": "small"}, "action": "limit", "max_templates": 5},
    {"id": "R017", "dimension": "size", "condition": {"size": "medium"}, "action": "standard", "max_templates": 10},
    {"id": "R018", "dimension": "size", "condition": {"size": "large"}, "action": "full", "add_governance": true},
    {"id": "R019", "dimension": "size", "condition": {"size": "enterprise"}, "action": "full", "add_governance": true, "add_portfolio": true},
    {"id": "R020", "dimension": "team_size", "condition": {"team_size": ["solo", "small"]}, "action": "toolkit", "toolkit": "quick-start-kits/"},
    {"id": "R021", "dimension": "team_size", "condition": {"team_size": "medium"}, "action": "toolkit", "toolkit": "role-based-toolkits/"},
    {"id": "R022", "dimension": "team_size", "condition": {"team_size": "large"}, "action": "toolkit", "toolkit": "role-based-toolkits/ + business-stakeholder-suite/"},
    {"id": "R023", "dimension": "experience", "condition": {"pm_experience": "new"}, "action": "filter", "complexity": "starter"},
    {"id": "R024", "dimension": "experience", "condition": {"pm_experience": "intermediate"}, "action": "filter", "complexity": ["starter", "intermediate"]},
    {"id": "R025", "dimension": "experience", "condition": {"pm_experience": "advanced"}, "action": "allow_all"}
  ]
}
```
