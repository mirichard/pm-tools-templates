# Tasks #812 & #813: Recommendation Output Design

**Story:** #729 ([Selection] – Recommendation Output)
**Epic:** #709 (Epic 2: Template Decision Engine)
**Date:** 2026-06-01
**Status:** Complete
**Closes:** #812, #813

---

## 1. Research: Output Requirements (#812)

### What Users Need in a Recommendation

Based on analysis of the decision tree output ([template-decision-tree.md](../../docs/decision-engine/template-decision-tree.md)), the rules engine validation profiles ([807-rules-engine-validation.md](807-rules-engine-validation.md)), and the existing [TEMPLATE_SELECTION_CHECKLIST.md](../../TEMPLATE_SELECTION_CHECKLIST.md), users need:

1. **Template name and link** — Clickable path to the actual template file
2. **Brief rationale** — Why this template fits their context (1–2 sentences)
3. **Priority tier** — Essential vs. recommended vs. optional
4. **Complementary assets** — Related toolkit, guide, or assessment to pair with
5. **What this does NOT cover** — Explicit scope boundaries to prevent misuse
6. **Estimated setup time** — How long to customize and deploy (based on TEMPLATE_SELECTION_CHECKLIST.md patterns)
7. **Next steps** — Clear action after selecting templates

### Comparable Systems Reviewed

- **TEMPLATE_SELECTION_CHECKLIST.md** — Has "Quick Decision Matrix" with time-to-implement. Good pattern to follow.
- **quick-start-kits/methodology-selection-guide.md** — Has "Best For" sections with clear scenarios. Reusable pattern.
- **TEMPLATE_INDEX.md** — Tags templates by methodology, lifecycle phase, and role. Supports filtering.

### Key Design Decisions

1. **Starter bundles > individual templates** — Users overwhelmed by 137+ templates benefit from pre-curated sets
2. **Dual format (markdown + JSON)** — Markdown for human consumption, JSON for future programmatic use
3. **Bundles are references, not copies** — Each bundle links to templates, never duplicates content
4. **Bundle naming convention** — `{audience}-{methodology}-{scale}-bundle.md` (e.g., `new-pm-agile-small-bundle.md`)

---

## 2. Design: Output Format and Starter Bundles (#813)

### Recommendation Output Format

Each recommendation output (whether from the decision tree or a starter bundle) follows this structure:

```markdown
# [Bundle Name] Starter Bundle

**For:** [Target audience description]
**Methodology:** [Traditional / Agile / Hybrid]
**Scale:** [Small / Medium / Large]
**Risk Level:** [Low / Medium / High / Regulatory]

## Your Template Set

### Essential (start with these)
| # | Template | Purpose | Setup Time |
|---|----------|---------|------------|
| 1 | [Name](link) | Brief rationale | ~X min |

### Recommended (add as needed)
| # | Template | Purpose | Setup Time |
|---|----------|---------|------------|

### Optional Supplements
| # | Template | Purpose | When to Add |
|---|----------|---------|-------------|

## Complementary Resources
- **Toolkit:** [Link to recommended toolkit]
- **Guide:** [Link to relevant guide]
- **Assessment:** [Link to assessment template]

## What This Bundle Does NOT Cover
- [Explicit scope boundary 1]
- [Explicit scope boundary 2]

## Next Steps
1. [Action 1]
2. [Action 2]
3. [Action 3]
```

### JSON Output Format (for programmatic use)

```json
{
  "bundle_version": "1.0",
  "bundle_id": "new-pm-agile-small",
  "metadata": {
    "audience": "New project managers",
    "methodology": "agile",
    "scale": "small",
    "risk_level": "low"
  },
  "templates": {
    "essential": [
      {
        "name": "Template Name",
        "path": "relative/path/to/template.md",
        "rationale": "Why this template",
        "setup_minutes": 30
      }
    ],
    "recommended": [],
    "optional": []
  },
  "complementary": {
    "toolkit": "path/to/toolkit/",
    "guide": "path/to/guide.md",
    "assessment": "path/to/assessment.md"
  },
  "exclusions": ["What this does not cover"],
  "rules_trace": ["R002", "R004", "R011", "R016", "R020", "R023"]
}
```

### Starter Bundle Definitions

Seven bundles covering the most common paths through the decision tree:

| # | Bundle ID | Audience | Methodology | Scale | Risk | Terminal Node |
|---|-----------|----------|-------------|-------|------|---------------|
| 1 | `new-pm-agile-small` | New PMs starting small agile projects | Agile | Small | Low | T1 |
| 2 | `standard-agile-medium` | Experienced agile teams | Agile | Medium | Medium | T2 |
| 3 | `scaled-agile-large` | Large agile organizations (SAFe/LeSS) | Agile | Large | High | T3 |
| 4 | `new-pm-traditional-small` | New PMs on traditional projects | Traditional | Small | Low | T4 |
| 5 | `standard-traditional-medium` | Standard waterfall projects | Traditional | Medium | Medium | T5 |
| 6 | `enterprise-governance` | Enterprise/regulatory programs | Traditional | Large | Regulatory | T6 |
| 7 | `hybrid-balanced` | Mid-size hybrid projects | Hybrid | Medium | Medium | T7 |

### File Locations

- Bundles: `docs/decision-engine/bundles/`
- Bundle index: `docs/decision-engine/bundles/README.md`
- This design doc: `meta/architecture-research/812-813-recommendation-output-design.md`
