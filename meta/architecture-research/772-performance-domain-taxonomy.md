# Task #772: Performance Domain Taxonomy

**Story:** #719 ([Mapping] – Domain Alignment – Performance Domain Classification)
**Epic:** #707 (Epic 0: Repository Audit & Mapping)
**Date:** 2026-04-03
**Status:** Complete

---

## 1. PMBOK 7 Alignment

PMBOK 7th Edition defines **8 performance domains**:
1. Stakeholders
2. Team
3. Development Approach and Life Cycle
4. Planning
5. Project Work
6. Delivery
7. Measurement
8. Uncertainty

### Consolidation to vNext 6-Domain Model

| PMBOK 7 Domain | vNext Domain | Rationale |
|----------------|-------------|-----------|
| Stakeholders | **Stakeholder** | Direct 1:1 mapping |
| Team | **Team** | Direct 1:1 mapping |
| Development Approach and Life Cycle | **Delivery** | Merged — approach selection is part of how delivery happens |
| Project Work | **Delivery** | Merged — coordinating and performing work is delivery execution |
| Delivery | **Delivery** | Merged — the three PMBOK domains cover different aspects of the same thing: how work gets done and delivered |
| Planning | **Planning** | Direct 1:1 mapping |
| Measurement | **Measurement** | Direct 1:1 mapping |
| Uncertainty | **Uncertainty** | Direct 1:1 mapping |

**Why 6 instead of 8?** PMBOK 7 separates "Development Approach," "Project Work," and "Delivery" into three domains because they serve different conceptual purposes in the standard. For a template repository organized around practitioner needs, these are a single concern: *how does work get done?* A PM selecting templates doesn't distinguish between choosing a methodology, coordinating work, and delivering results — they're all part of the same execution flow.

---

## 2. Domain Definitions

### Domain 1: STAKEHOLDER
**Scope:** Identification, analysis, engagement, and communication with people and groups who affect or are affected by the project.

**Includes:**
- Stakeholder identification and analysis
- Engagement strategy and planning
- Communication planning and execution
- Expectation management
- Stakeholder satisfaction measurement

**Excludes:**
- Team management (→ Team domain)
- Status reporting mechanics (→ Measurement domain)
- Executive decision-making frameworks (→ Planning domain, unless stakeholder-specific)

**Boundary rule:** If the asset's primary purpose is understanding or influencing people *outside the project team*, it belongs here.

**Tag indicators:** `stakeholder-management`, `communication` (when audience-focused)

**Current repo coverage (from #832):**
- `role-based-toolkits/*/stakeholder-*`
- `project-lifecycle/01-initiation/stakeholder-analysis/`
- `business-stakeholder-suite/` (communication, executive dashboards)
- `project-assessment-suite/stakeholder-engagement-assessment-template.md`

### Domain 2: TEAM
**Scope:** Building, developing, leading, and sustaining the project team — including structures, performance, culture, and collaboration.

**Includes:**
- Team formation and chartering
- Role definitions and skills assessment
- Team ceremonies and collaboration practices
- Performance management and feedback
- Conflict resolution and team dynamics
- Onboarding and knowledge transfer

**Excludes:**
- Stakeholder engagement outside the team (→ Stakeholder domain)
- Process/methodology selection (→ Delivery domain)
- Resource allocation at portfolio level (→ Planning domain)

**Boundary rule:** If the asset's primary purpose is enabling *the people doing the work* to be effective together, it belongs here.

**Tag indicators:** `agile` + `scrum` (ceremony-focused), `communication` (when team-internal)

**Current repo coverage:**
- `role-based-toolkits/scrum-master/` (team facilitation, agile ceremonies)
- `role-based-toolkits/product-owner/` (collaboration frameworks)
- `project-lifecycle/03-execution/team-coordination/`
- Team charter, daily standup, retrospective templates

### Domain 3: DELIVERY
**Scope:** Selecting the delivery approach, coordinating work execution, and producing project deliverables — the "how" of getting work done across any methodology.

**Includes:**
- Methodology selection and adaptation (agile, traditional, hybrid)
- Work decomposition (WBS, backlog management)
- Sprint/iteration/phase execution
- Change management and control
- Quality assurance during execution
- Vendor/procurement management
- Integration and tool setup

**Excludes:**
- Strategic planning and business case (→ Planning domain)
- Reporting on progress (→ Measurement domain)
- Risk identification and response (→ Uncertainty domain)

**Boundary rule:** If the asset's primary purpose is *structuring or performing the work itself*, it belongs here.

**Tag indicators:** `agile`, `scrum`, `kanban`, `traditional`, `hybrid`, `technology` (when tool/execution-focused)

**Current repo coverage:**
- `project-lifecycle/03-execution/`
- `methodology-frameworks/` (agile-scrum, hybrid approaches)
- `templates/agile/`, `templates/traditional/`
- `integration-guides/`, `integrations/`
- `quick-start-kits/` (methodology selection, transformation)

### Domain 4: PLANNING
**Scope:** Establishing the strategy, scope, schedule, budget, and approach for project work — the "what," "when," and "how much."

**Includes:**
- Business case development and feasibility
- Project chartering and scope definition
- Schedule and resource planning
- Budget and cost management
- Procurement planning
- Strategic alignment and portfolio planning

**Excludes:**
- Sprint/iteration planning (→ Delivery domain, execution-level planning)
- Risk planning (→ Uncertainty domain)
- Communication planning (→ Stakeholder domain)
- Ongoing monitoring (→ Measurement domain)

**Boundary rule:** If the asset's primary purpose is *deciding what to do and how to resource it* at the project or program level, it belongs here. Iteration-level planning belongs in Delivery.

**Tag indicators:** `planning` (when scope/schedule/budget-focused), `finance`

**Current repo coverage:**
- `project-lifecycle/01-initiation/` (charter, business case, feasibility)
- `project-lifecycle/02-planning/` (PM plan, scope, schedule, resource)
- `business-stakeholder-suite/financial-governance/`
- `backlog/` (roadmap, team assignments)

### Domain 5: UNCERTAINTY
**Scope:** Identifying, analyzing, responding to, and monitoring risks and opportunities — managing what we don't know.

**Includes:**
- Risk identification and assessment
- Risk response planning and mitigation
- Opportunity management
- Issue identification and resolution
- Contingency and fallback planning
- Risk-based decision frameworks

**Excludes:**
- Quality assurance (→ Delivery domain, unless risk-specific)
- Financial risk in budget context (→ Planning domain)
- Change requests (→ Delivery domain)

**Boundary rule:** If the asset's primary purpose is *dealing with what might go wrong (or right) unexpectedly*, it belongs here.

**Tag indicators:** `risk-management`

**Current repo coverage:**
- `project-lifecycle/02-planning/risk-management/`
- `project-lifecycle/04-monitoring-control/issue-management/`
- `project-assessment-suite/risk-management-assessment-template.md`
- `metrics/risk-data/` (risk trend tracking)
- `docs/risk-management/`

### Domain 6: MEASUREMENT
**Scope:** Tracking progress, assessing performance, reporting status, and evaluating outcomes — the evidence of how things are going.

**Includes:**
- Progress tracking and earned value
- KPI definition and monitoring
- Status reporting (weekly, monthly, executive)
- Dashboard creation and maintenance
- Project health assessment
- Benefits realization measurement
- Process maturity evaluation

**Excludes:**
- Risk metrics (→ Uncertainty domain, unless part of a broader dashboard)
- Team performance coaching (→ Team domain)
- Financial planning (→ Planning domain)

**Boundary rule:** If the asset's primary purpose is *measuring, reporting, or assessing* how things are going, it belongs here.

**Tag indicators:** `monitoring`, `quality` (when assessment-focused)

**Current repo coverage:**
- `metrics/` (risk-data, status-data)
- `reports/` (weekly, monthly status)
- `dashboards/`, `dashboard-mvp/`
- `business-stakeholder-suite/executive-dashboards/`
- `project-assessment-suite/` (health, maturity, governance assessments)
- `project-lifecycle/04-monitoring-control/`

---

## 3. Tag-to-Domain Mapping Rules

For automated mapping via `templates.json`:

```
PRIMARY MAPPINGS (first match wins):
  finance                              → Planning
  healthcare                           → Delivery (industry-specific execution)
  agile, scrum, kanban                 → Delivery
  traditional, hybrid                  → Delivery
  monitoring                           → Measurement

SECONDARY/CONTEXT MAPPINGS:
  risk-management (dominant tag)       → Uncertainty
  stakeholder-management + communication (no execution tags) → Stakeholder
  planning + no methodology tags       → Planning
  planning + methodology tags          → Delivery
  quality + monitoring                 → Measurement
  quality + no monitoring              → Delivery (QA during execution)
  communication + stakeholder-mgmt     → Stakeholder
  communication + planning             → Delivery (process communication)
  technology (alone or dominant)       → Delivery

DEFAULT:
  If no clear match                    → Delivery (largest category)
```

---

## 4. Cross-Domain Handling

Many assets serve multiple domains. Assignment rules:

1. **Primary domain:** The domain that best answers "why would someone use this template?"
2. **Secondary domains (max 2):** Domains the asset significantly contributes to
3. **Cross-domain indicators:** Assets with 4+ diverse tags likely span domains

### Common Cross-Domain Patterns

| Pattern | Primary | Secondary | Example |
|---------|---------|-----------|---------|
| risk + stakeholder + communication | Uncertainty | Stakeholder | Risk communication plan |
| planning + risk + quality | Planning | Uncertainty | Project charter (includes risk section) |
| agile + stakeholder + quality | Delivery | Stakeholder | Sprint review (stakeholder demo) |
| monitoring + stakeholder + communication | Measurement | Stakeholder | Executive dashboard |
| quality + planning + monitoring | Measurement | Planning | Project health assessment |

---

## 5. Expected Distribution

Based on tag analysis of 137 templates:

| Domain | Estimated Primary Count | Confidence |
|--------|------------------------|------------|
| Delivery | ~45-55 (33-40%) | High — methodology tags are common |
| Planning | ~20-25 (15-18%) | Medium — `planning` tag is broad |
| Measurement | ~20-25 (15-18%) | High — `monitoring` is clear signal |
| Uncertainty | ~15-20 (11-15%) | High — `risk-management` is unambiguous |
| Stakeholder | ~15-20 (11-15%) | Medium — overlaps with communication |
| Team | ~5-10 (4-7%) | Medium — fewest dedicated templates |

**Note:** Team domain has the lowest coverage. This aligns with the #832 finding that team-focused templates (beyond ceremonies) are relatively sparse.
