# Tasks #816 & #817: Feedback Loop Design

**Story:** #730 ([Selection] – Feedback Loop)
**Epic:** #709 (Epic 2: Template Decision Engine)
**Date:** 2026-06-01
**Status:** Complete
**Closes:** #816, #817

---

## 1. Research: Feedback Collection Requirements (#816)

### What Feedback Data Is Needed

To improve the rules engine over time, we need to capture:

1. **Which bundle/path was used** — Maps feedback to specific rules
2. **Which templates were actually adopted** — Reveals which recommendations users valued
3. **Which templates were skipped and why** — Identifies over-recommendations
4. **Satisfaction rating** — Quantitative signal for aggregation
5. **What worked well** — Positive patterns to preserve
6. **What didn't work** — Mismatches to investigate
7. **Missing templates** — Gaps in coverage
8. **Improvement suggestions** — Open-ended input

### Privacy Constraints

The feedback form must NOT collect:
- Project names or identifiers
- Personal names or contact information
- Customer or client names
- Financial data, budgets, or revenue figures
- Proprietary business information
- Organization names (optional — user can choose to share)

The form SHOULD collect:
- Bundle ID (which bundle was used)
- Methodology, scale, risk level, industry (already in bundle metadata — no new PII)
- Template adoption status (used / skipped / modified)
- Satisfaction (1–5 numeric scale)
- Free-text comments (user controls what they share)

### Lightweight Design Principles

- **Under 2 minutes** to complete — 6 sections, mostly checkboxes
- **Markdown-native** — works as a GitHub issue template or standalone form
- **No tooling required** — copy, fill out, submit via GitHub issue or email
- **Optional sections** — only bundle ID and satisfaction are required

---

## 2. Design: Feedback Template and Aggregation Model (#817)

### Feedback Data Model

```json
{
  "feedback_version": "1.0",
  "bundle_id": "standard-agile-medium",
  "project_context": {
    "methodology": "agile",
    "scale": "medium",
    "risk_level": "medium",
    "industry": "it"
  },
  "template_adoption": [
    {"template": "product_backlog_template.md", "status": "used", "rating": 4},
    {"template": "sprint_planning_template.md", "status": "used", "rating": 5},
    {"template": "risk_register_template.md", "status": "skipped", "reason": "Not needed yet"}
  ],
  "overall_satisfaction": 4,
  "what_worked": "Sprint ceremony templates were well-structured",
  "what_didnt_work": "Release plan was too detailed for our 3-month project",
  "missing_templates": "Team onboarding checklist",
  "suggestions": "Add a simplified release plan option for shorter projects",
  "submitted_at": "2026-06-01"
}
```

### Aggregation Model

Feedback is aggregated quarterly into a review report. Key metrics:

**Quantitative:**
- Response count per bundle
- Average satisfaction per bundle (1–5)
- Template adoption rate (% of essential templates actually used)
- Skip rate by template (% of times a template was skipped)
- Net Promoter-style score: % rating 4–5 minus % rating 1–2

**Qualitative:**
- Common themes in "what worked" (grouped by bundle)
- Common themes in "what didn't work" (grouped by bundle)
- Most-requested missing templates
- Recurring suggestions

### Maintenance Loop

Feedback connects to rules engine maintenance through this cycle:

```
Collect feedback (ongoing)
    ↓
Aggregate quarterly (quarterly-review-template.md)
    ↓
Identify action items:
  - Templates with >30% skip rate → investigate over-recommendation
  - Bundles with avg satisfaction <3.0 → review rule assignments
  - Missing templates requested 3+ times → add to backlog
  - Recurring "didn't work" themes → adjust rules or rationale
    ↓
Update rules engine (806-rules-engine-implementation.md)
    ↓
Update affected bundles and decision tree
    ↓
Next quarter: measure improvement
```

### File Locations

- Feedback form: `docs/decision-engine/feedback-form.md`
- Quarterly review template: `docs/decision-engine/quarterly-review-template.md`
- This design doc: `meta/architecture-research/816-817-feedback-loop-design.md`
