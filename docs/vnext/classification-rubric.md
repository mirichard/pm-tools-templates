# Asset Classification Rubric

> **Epic 0, Story 0.2** (#716) | Task #760
> Part of the Value Delivery System Upgrade – vNext

This rubric defines the criteria and decision logic for classifying every asset in the repository inventory. Each asset receives exactly one primary classification label.

## Classification Labels

### `refactor`
**Definition:** Asset is valuable but needs reorganization, restructuring, or relocation to fit the vNext domain-oriented structure.

**Criteria — assign when ANY of these are true:**
- Asset is in the wrong directory or a duplicate directory structure
- Asset naming is inconsistent with conventions (e.g., underscores vs hyphens)
- Asset content is valid but structure/formatting needs modernization
- Asset needs to be consolidated with related assets in another location
- Asset exists at root level but belongs in a domain directory

**Examples:**
- `integration_guides/` content → should merge into `integration-guides/` (naming inconsistency)
- Root-level `organizational_change_management_framework.md` → should move to `organizational-frameworks/`
- `Agile/TODO.md` → legacy placeholder in a duplicate directory

---

### `enhance`
**Definition:** Asset is correctly placed and structured but needs improvement to meet vNext quality standards (principle annotations, usage guidance, cross-references).

**Criteria — assign when ALL of these are true:**
- Asset is in the correct location (or close to it)
- Content is substantive and not duplicated elsewhere
- Asset would benefit from: usage guidance ("when to use/not use"), principle annotations, cross-references, or modernized content

**Examples:**
- `templates/agile/sprint_planning_template.md` → good template, needs "When to Use/Not Use" section
- `dashboards/project-health-dashboard.md` → needs value delivery metrics extension
- `project-lifecycle/02-planning/` templates → need principle annotations

---

### `net-new`
**Definition:** Asset does not exist in the repository and represents a true gap. Use sparingly — only when no existing asset can be enhanced to fill the need.

**Criteria — assign when ALL of these are true:**
- No existing asset covers this capability (even partially)
- The gap is validated against the vNext epic requirements
- Enhancement of an existing asset cannot fill the gap

**Examples:**
- Benefits realization framework → no existing asset (Epic 1)
- Template decision engine rules → no existing rules-based selection (Epic 2)
- Adaptive governance tiers → no tiered governance model exists (Epic 6)

**Guard rail:** Before tagging `net-new`, search the inventory for partial coverage. If ANY existing asset covers >30% of the need, classify that asset as `enhance` instead.

---

### `duplicate`
**Definition:** Asset is a copy, near-copy, or functional equivalent of another asset in the repository. One must be designated as canonical.

**Criteria — assign when ANY of these are true:**
- File is substantively identical to another file (>80% content overlap)
- File serves the same purpose in the same context as another file
- File exists in a parallel directory structure (e.g., `Agile/` vs `templates/agile/`)
- File is a renamed or slightly modified version of another

**Decision process for duplicates:**
1. Identify the duplicate group (all related assets)
2. Designate the canonical asset based on: completeness > recency > location correctness > naming convention
3. Tag the non-canonical assets as `duplicate`
4. Record `duplicate_of` field pointing to the canonical asset

**Examples:**
- `Agile/TODO.md` → duplicate of `templates/agile/` (templates/agile is canonical — more complete)
- `industry_templates/` → duplicate of `industry-specializations/` (specializations is canonical — larger, better organized)

---

### `deprecated`
**Definition:** Asset is outdated, superseded, no longer relevant, or should be removed.

**Criteria — assign when ANY of these are true:**
- Asset references tools, versions, or practices that are no longer current
- Asset has been superseded by a newer version elsewhere in the repo
- Asset is a placeholder with no substantive content (e.g., empty TODO.md)
- Asset belongs to an abandoned feature or initiative
- Asset is in `staging/` with no clear path to promotion

**Examples:**
- Empty `TODO.md` files in `Agile/`, `Hybrid/`, `Traditional/`
- `staging/` files with no recent updates and no promotion plan
- References to deprecated tools or versions

---

## Decision Flowchart

```
Start: Evaluate asset
  │
  ├── Is this asset a placeholder or empty? → DEPRECATED
  │
  ├── Does a substantially similar asset exist elsewhere?
  │     ├── Yes → Is THIS the most complete/correct version?
  │     │     ├── Yes → Label the OTHER as DUPLICATE
  │     │     └── No → DUPLICATE (record duplicate_of)
  │     └── No → Continue
  │
  ├── Is the asset in the wrong location or poorly structured?
  │     ├── Yes → REFACTOR
  │     └── No → Continue
  │
  ├── Is the content substantive but missing vNext standards?
  │   (usage guidance, principle annotations, cross-references)
  │     ├── Yes → ENHANCE
  │     └── No → Continue
  │
  └── Does the asset represent a gap filled by new content?
        └── Yes → NET-NEW (verify no partial coverage exists)
```

## Classification Workflow

1. **Batch by directory:** Classify one top-level directory at a time
2. **Duplicates first:** Identify duplicate groups before individual classification
3. **Document rationale:** Every classification must include a 1-2 sentence rationale
4. **Peer review:** Each directory batch is reviewed by a second person
5. **Aggregate statistics:** Track distribution after each batch to detect bias

## Expected Distribution (Baseline)

Based on the inventory findings, the expected rough distribution is:
- **refactor**: ~25-35% (significant reorganization needed)
- **enhance**: ~40-50% (largest category — most assets need modernization)
- **duplicate**: ~10-15% (7 known duplication areas)
- **deprecated**: ~5-10% (placeholders, staging, abandoned)
- **net-new**: ~3-5% (minimal — most gaps are addressed by enhancement)

---
*This rubric was created as part of Task #760 (Story 0.2, Epic 0). It will be applied in Tasks #761–#763.*
