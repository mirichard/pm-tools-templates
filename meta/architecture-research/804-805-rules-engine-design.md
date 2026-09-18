# Tasks #804 & #805: Rules Engine Core Design

**Story:** #727 ([Selection] – Rules Engine Core)
**Epic:** #709 (Epic 2: Template Decision Engine)
**Date:** 2026-05-01
**Status:** Complete

---

## 1. Template Context Catalog (#804)

Analysis of 137 templates from `templates.json` mapped to applicable contexts:

### By Applicable Project Size
| Size | Template Count | Notes |
|------|---------------|-------|
| Small | 137 (all) | All templates are usable for small projects; simplified versions available for 9 |
| Medium | 137 (all) | Full versions appropriate |
| Large | ~100 | Exclude beginner/simplified templates |
| Enterprise | ~60 | Only comprehensive governance + financial + program templates |

### By Applicable Risk Profile
| Risk | Additional Templates Triggered |
|------|-------------------------------|
| Low | Base set only |
| Medium | + Risk register, basic risk management plan |
| High | + Risk assessment, governance assessment, change control |
| Regulatory | + Compliance templates from industry-specializations/, audit log |

### By Applicable Phase
| Phase | Primary Templates | Count |
|-------|-------------------|-------|
| Starting | Charter, stakeholder, business case, feasibility | ~18 |
| Planning | PM plan, risk plan, schedule, resource, communication, WBS | ~35 |
| In Progress | Sprint templates, status reports, issue logs, change control | ~50 |
| Closing | Closure, lessons learned, knowledge transfer, PIR | ~15 |

---

## 2. Rules Format and Matching Algorithm (#805)

### Approach: Filter-and-Rank (not weighted scoring)

**Rationale:** Weighted scoring is more complex but doesn't add value for our use case. Users need a short, relevant list — not a ranked score of 137 templates. Filter-and-rank produces better UX.

### Algorithm

```
1. FILTER by methodology
   → Keep templates where template.methodology IN (selected, "universal")

2. FILTER by phase
   → Keep templates matching selected lifecycle phase (using title/path keywords)

3. FILTER by complexity
   → IF pm_experience = "new" → prefer complexity = "starter"
   → IF pm_experience = "intermediate" → allow "starter" + "intermediate"
   → IF pm_experience = "advanced" → allow all

4. ADD risk supplements
   → IF risk_profile IN ("high", "regulatory") → add risk/governance templates

5. ADD industry supplements
   → IF industry != "general" → add industry-specializations/{industry}/ templates

6. ADD value tracking
   → IF size IN ("large", "enterprise") → add benefits register + ROI dashboard

7. RANK by priority
   → "essential" = matches phase + methodology + experience
   → "recommended" = matches 2 of 3 criteria
   → "optional" = matches 1 criterion or is a supplement

8. OUTPUT top 3-5 essential + supplements
```

### Rules JSON Format (for future extensibility)

```json
{
  "rules": [
    {
      "id": "R001",
      "name": "Agile methodology filter",
      "condition": {"methodology": "agile"},
      "action": "include",
      "templates": ["templates/agile/*", "methodology-frameworks/agile-scrum/*"],
      "priority": "essential"
    },
    {
      "id": "R002",
      "name": "High risk supplement",
      "condition": {"risk_profile": ["high", "regulatory"]},
      "action": "add",
      "templates": ["project-assessment-suite/risk-*", "project-assessment-suite/governance-*"],
      "priority": "recommended"
    }
  ]
}
```

### Current Implementation
The `scripts/template-recommender.py` implements this algorithm using hardcoded rules (sufficient for MVP). The JSON rules format above is designed for Sprint 8's implementation (#806/#807) when the rules engine becomes data-driven.

### Validation Results
Tested with 5 profiles:
1. **Small Agile IT (new PM)** → Recommended starter kit + agile templates ✅
2. **Large Traditional (high risk)** → Recommended full PM toolkit + risk/governance extras ✅
3. **Medium Hybrid (intermediate)** → Recommended PM toolkit + balanced set ✅
4. **Enterprise Regulatory Healthcare** → Recommended full governance + industry + value tracking ✅
5. **Solo Agile (advanced)** → Recommended scrum toolkit + agile templates ✅
