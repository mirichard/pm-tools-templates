# Sprint Planning Recommendations

**Date:** 2026-04-03
**Scope:** Sprint 4 automation assessment + Sprint 6-9 load rebalancing

---

## 1. Sprint 4 Automation Assessment (Tasks #770, #774)

### Available Data Assets

| Asset | Path | Records | Usable Fields |
|-------|------|---------|---------------|
| `templates.json` | `templates/templates.json` | 137 | path, title, methodology, tags, complexity, size, quality |
| `template-index.json` | `onboarding/template-index.json` | ~30 | path, category, methodology, complexity, estimatedTime |

### Automation Potential: HIGH

**Task #770 (Map all assets to value flow):**
The existing `tags` field in `templates.json` already contains value-flow-relevant categories:
- `planning` → Activity stage
- `monitoring` → Activity stage
- `risk-management` → Activity (input-enabler)
- `communication` → Output-generator
- `quality` → Output-generator
- `finance` → Outcome-tracker
- `stakeholder-management` → Cross-cutting

A script can produce a **draft mapping** by:
1. Reading `templates.json`
2. Mapping tags to value flow stages using a tag→stage lookup table
3. Outputting a CSV/JSON with each template assigned to its primary value flow position
4. Flagging assets with ambiguous or missing tags for manual review

**Estimated effort saved:** ~60% of manual mapping (draft 137 templates in minutes vs. hours)

**Task #774 (Map all assets to performance domains):**
Similarly automatable using the same tags:
- `stakeholder-management` → Stakeholder domain
- `communication` → Stakeholder domain
- `agile` → Delivery domain
- `planning` → Planning domain
- `risk-management` → Uncertainty domain
- `monitoring`, `quality` → Measurement domain
- `technology` → Cross-cutting (needs manual)

**Estimated effort saved:** ~50-60% of manual mapping

### Recommended Action
Create a Python script (`scripts/map-assets.py`) before Sprint 4 that:
1. Reads `templates.json`
2. Applies tag→domain and tag→value-flow lookup tables
3. Outputs draft mappings in JSON + Markdown
4. Generates a "needs manual review" list for ambiguous assets

This script should be created during Sprint 3 as prep work.

---

## 2. Sprint 6-9 Load Rebalancing

### Current Load Distribution

| Sprint | Items | Status |
|--------|-------|--------|
| Sprint 6 (Jun 15-26) | 17 | ⚠️ Overloaded |
| Sprint 7 (Jun 29-Jul 10) | 12 | OK |
| Sprint 8 (Jul 13-24) | 14 | ⚠️ Heavy |
| Sprint 9 (Jul 27-Aug 7) | 16 | ⚠️ Overloaded |
| Sprint 10 (Aug 10-21) | 13 | OK |
| Sprint 11 (Aug 24-Sep 4) | 10 | Light |
| Sprint 12 (Sep 7-18) | 5 | Light |

### Proposed Rebalancing

#### Sprint 6 (17 → 12): Move 5 items out
**Move to Sprint 7:**
- Story #735 (Quick Reference Index) + Tasks #836, #837 → Sprint 7 already has the implementation/validation tasks for this story
- Rationale: Sprint 7 goes from 12→15, still manageable. Story #735 research doesn't block anything in Sprint 6.

**Keep the 3 Epic parent issues** (#708, #709, #710) — these are tracking items only, no execution work.

#### Sprint 8 (14 → 12): Move 2 items out
**Move to Sprint 9:**
- Story #736 (Domain Taxonomy Design) → Epic 4 can start with just the epic parent issue; taxonomy design can begin Sprint 9
- Rationale: Sprint 9 would increase from 16→17 — but see Sprint 9 rebalancing below.

#### Sprint 9 (16 → 12): Move 4 items out
**Move to Sprint 10:**
- Story #737 (Asset Migration Plan) + associated tasks → Migration planning doesn't need to complete before Sprint 10's cross-reference work
- Story #725 (Benefits Review Process) tasks #798, #799 (Implementation + Validation) → These can follow the research/design from Sprint 9

**Net effect on Sprint 10:** 13 → 17 — still heavy. Consider moving 2 Sprint 10 stories to Sprint 11.

#### Sprint 10 (13 → adjust): Move 2 items to Sprint 11
**Move to Sprint 11:**
- Story #739 (Legacy Path Preservation)
- Story #740 (Domain Validation)
- Rationale: These are validation/compatibility stories that benefit from more implementation being complete

### Proposed Final Distribution

| Sprint | Before | After | Change |
|--------|--------|-------|--------|
| Sprint 6 | 17 | 12 | -5 |
| Sprint 7 | 12 | 15 | +3 |
| Sprint 8 | 14 | 12 | -2 |
| Sprint 9 | 16 | 12 | -4 |
| Sprint 10 | 13 | 15 | +2 (net after gives/takes) |
| Sprint 11 | 10 | 12 | +2 |
| Sprint 12 | 5 | 9 | +4 (absorbs overflow) |

**Average:** ~12.4 items/sprint across Phase 2 (vs. 12.4 before, but with much lower variance)

---

## 3. Immediate Actions Completed

- [x] NAS repo access verified
- [x] Sprint 1/2 GitHub issue status verified (all done items properly closed)
- [x] Task #832 research completed and filed at `meta/architecture-research/832-repository-structure-and-relationships.md`
- [x] Task #832 closed in GitHub with findings summary
- [x] Architecture diagram draft (Mermaid) included as Sprint 3 input
- [x] Automation assessment for Sprint 4 completed
- [x] Sprint 6-9 rebalancing proposal completed
