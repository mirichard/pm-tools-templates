# Tasks #800 & #801: Context Assessment Model Design

**Story:** #726 ([Selection] – Context Assessment Model)
**Epic:** #709 (Epic 2: Template Decision Engine)
**Date:** 2026-04-07
**Status:** Complete

---

## 1. Project Characteristics Research (#800)

### Characteristics That Drive Template Selection

Based on analysis of the existing methodology selection guide, template metadata (137 templates with tags), and PM framework standards, 7 characteristics most strongly predict which templates a project needs:

| # | Characteristic | Why It Matters | Scale |
|---|---------------|---------------|-------|
| 1 | **Project Size** | Determines template complexity and governance overhead | Small / Medium / Large / Enterprise |
| 2 | **Methodology** | Most direct selector — filters to methodology-specific templates | Traditional / Agile / Hybrid / Not Sure |
| 3 | **Risk Profile** | High-risk projects need more risk management and governance templates | Low / Medium / High / Regulatory |
| 4 | **Team Size** | Affects coordination, communication, and ceremony needs | Solo / Small (2-9) / Medium (10-50) / Large (50+) |
| 5 | **Domain/Industry** | Triggers industry-specific template recommendations | General / IT / Healthcare / Financial / Construction |
| 6 | **Project Phase** | Determines which lifecycle templates are immediately needed | Starting / Planning / In Progress / Closing |
| 7 | **PM Experience** | Controls template complexity (simple vs. comprehensive versions) | New PM / Intermediate / Advanced |

### Existing Data Assets That Support Selection
- `templates/templates.json` — 137 templates with methodology, complexity, tags
- `onboarding/template-index.json` — 30 templates with methodology, complexity, team sizes, project types
- `quick-start-kits/methodology-selection-guide.md` — Decision criteria for methodology
- `docs/getting-started/methodology-selector.md` — Additional selection guidance

---

## 2. Assessment Model Schema (#801)

### Context Profile Schema (JSON)

```json
{
  "profile_version": "1.0",
  "project_context": {
    "size": "small | medium | large | enterprise",
    "methodology": "traditional | agile | hybrid | unsure",
    "risk_profile": "low | medium | high | regulatory",
    "team_size": "solo | small | medium | large",
    "industry": "general | it | healthcare | financial | construction",
    "phase": "starting | planning | in_progress | closing",
    "pm_experience": "new | intermediate | advanced"
  },
  "generated_recommendations": {
    "methodology_suggestion": "traditional | agile | hybrid",
    "template_complexity": "starter | intermediate | advanced",
    "recommended_templates": [
      {
        "path": "path/to/template.md",
        "title": "Template Name",
        "reason": "Why this template matches your context",
        "priority": "essential | recommended | optional"
      }
    ],
    "recommended_toolkit": "path/to/toolkit/",
    "recommended_pathway": "path/to/use-case-pathway"
  }
}
```

### Matching Rules

#### Rule 1: Methodology → Template Filter
```
IF methodology = "agile"     → filter templates where methodology IN ("agile", "universal")
IF methodology = "traditional" → filter templates where methodology IN ("traditional", "universal")
IF methodology = "hybrid"    → filter templates where methodology IN ("hybrid", "universal")
IF methodology = "unsure"    → recommend methodology-selection-guide.md first
```

#### Rule 2: PM Experience → Complexity Filter
```
IF pm_experience = "new"          → prefer complexity = "starter"; recommend first-time-pm-starter/
IF pm_experience = "intermediate" → prefer complexity IN ("starter", "intermediate")
IF pm_experience = "advanced"     → all complexities; recommend role-based-toolkits/
```

#### Rule 3: Risk Profile → Template Additions
```
IF risk_profile = "high" OR "regulatory" → ADD risk-management-plan, risk-register, governance-assessment
IF risk_profile = "regulatory"           → ADD compliance templates from industry-specializations/
```

#### Rule 4: Project Phase → Lifecycle Filter
```
IF phase = "starting" → prioritize project-lifecycle/01-initiation/ templates
IF phase = "planning" → prioritize project-lifecycle/02-planning/ templates
IF phase = "in_progress" → prioritize project-lifecycle/03-execution/ + 04-monitoring/ templates
IF phase = "closing"  → prioritize project-lifecycle/05-closure/ templates
```

#### Rule 5: Industry → Specialization Addition
```
IF industry != "general" → ADD industry-specializations/{industry}/ templates
```

#### Rule 6: Team Size → Toolkit Recommendation
```
IF team_size = "solo" OR "small" → recommend quick-start-kits/ (lightweight)
IF team_size = "medium"          → recommend role-based-toolkits/ (standard)
IF team_size = "large"           → recommend role-based-toolkits/ + business-stakeholder-suite/ (full governance)
```

### Output Format

The context assessment produces a **recommendation card**:

```
──────────────────────────────────────────────────
PROJECT CONTEXT: Medium Agile IT Project (High Risk)
──────────────────────────────────────────────────

📋 ESSENTIAL TEMPLATES (start with these):
   1. Project Charter → quick-start-kits/first-time-pm-starter/project-charter-simple.md
   2. Product Backlog → role-based-toolkits/product-owner/backlog-management-template.md
   3. Risk Register  → project-lifecycle/02-planning/risk-management/
   4. Sprint Planning → templates/agile/sprint_planning_template.md

📚 RECOMMENDED TOOLKIT:
   → Scrum Master Toolkit (role-based-toolkits/scrum-master/)

🛤️ USE-CASE PATHWAY:
   → "Starting a New Project" (docs/USE_CASE_PATHWAYS.md)

⚠️ RISK ADD-ONS (high risk profile):
   → Risk Management Assessment (project-assessment-suite/)
   → Governance Assessment (project-assessment-suite/)

🏭 INDUSTRY TEMPLATES:
   → IT Specializations (industry-specializations/information-technology/)
──────────────────────────────────────────────────
```

### Implementation Plan (Sprint 7)
1. Build the rules engine as a Python script (`scripts/template-recommender.py`)
2. Read `templates.json` + `template-index.json` as the template catalog
3. Accept context profile as CLI input (interactive prompts or JSON file)
4. Output recommendation card in markdown format
