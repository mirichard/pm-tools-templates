# Tasks #776 & #777: Consolidation Roadmap

**Story:** #720 ([Consolidation] – Gap & Conflict Analysis – Consolidation Roadmap)
**Epic:** #707 (Epic 0: Repository Audit & Mapping)
**Date:** 2026-04-03
**Status:** Complete

---

## 1. Findings Synthesis (Stories 0.1–0.5)

### Story 0.1 — Inventory
- 137 cataloged templates in `templates.json`; 150+ additional in `docs/templates/`
- 55 content-relevant top-level directories
- `docs/templates/` is a hidden hub with the largest single template collection

### Story 0.2 — Classification
- Templates span refactor, enhance, net-new, duplicate, and deprecated categories
- Methodology-specific tags are unevenly distributed (88 universal, 23 traditional, 19 agile, 7 hybrid)

### Story 0.3 — Redundancy
- 6 confirmed duplication zones (integration dirs, methodology placeholders, industry templates, template stores, dashboards, onboarding)
- Integration directories: 5-way split is the worst overlap

### Story 0.4 — Value Flow Mapping
- Distribution: 18 input-enabler, 60 activity-support, 52 output-generator, 7 outcome-tracker
- OUTCOMES stage is weakest (5.1%) — benefits tracking and post-delivery measurement gaps
- 9 specific gaps identified across 3 scenario walkthroughs

### Story 0.5 — Domain Mapping
- Distribution: 69 Delivery, 27 Measurement, 13 Uncertainty, 11 Stakeholder, 9 Team, 8 Planning
- 10 zero-coverage cells in the domain × methodology matrix
- Team (6.6%) and Planning (5.8%) are the most under-served domains
- Tagging gaps cause methodology-specific templates to appear as universal

---

## 2. Cross-Cutting Patterns

### Pattern A: Duplication zones align with domain gaps
The 6 duplication zones from Story 0.3 map to specific domain restructuring opportunities:
- **Integration 5-way split** → Delivery domain consolidation target
- **Methodology placeholders** → Remove empty shells, redirect to methodology-frameworks/
- **Onboarding scatter** → Stakeholder domain (user onboarding is stakeholder engagement)
- **Dashboard fragmentation** → Measurement domain consolidation target

### Pattern B: Value flow gaps predict Epic priorities
- OUTCOMES gaps (benefits, PIR, ROI) → **Epic 1** (Value Delivery Layer) is correctly prioritized
- ACTIVITIES gaps (stage-gate, governance) → **Epic 6** (Governance Modernization) addresses this
- INPUTS gaps (regulatory, skills matrix) → **Epics 4 & 5** address these

### Pattern C: Tagging is the root cause of domain imbalance
- 88/137 templates (64%) tagged `universal` — most should have methodology-specific tags
- Risk, stakeholder, and planning templates tagged `universal` miss domain-methodology intersections
- **Quick win:** Re-tagging 20-30 templates would fix most zero-coverage cells without creating new content

---

## 3. Consolidation Proposal Format

### Template

```
PROPOSAL ID: CP-[number]
TITLE: [short description]
PRIORITY: P1 (quick win) | P2 (strategic) | P3 (opportunistic) | P4 (defer)

CURRENT STATE:
- Directories: [list affected directories]
- Asset count: [number]
- Classification: [from Story 0.2]
- Issues: [what's wrong]

PROPOSED STATE:
- Target structure: [where things should live]
- Actions: [merge/redirect/archive/delete for each asset]
- New canonical path: [single authoritative location]

EFFORT: S (< 1 day) | M (1-3 days) | L (3-5 days) | XL (5+ days)

RISK:
- Broken links: [HIGH/MEDIUM/LOW]
- Content loss: [HIGH/MEDIUM/LOW]
- User confusion: [HIGH/MEDIUM/LOW]

MAPPED EPIC: [Epic 1-7 that this supports]
DEPENDENCIES: [other proposals that must complete first]
```

### Priority Ranking Criteria

| Priority | Impact | Effort | Action |
|----------|--------|--------|--------|
| **P1** Quick Win | High (reduces confusion, fixes navigation) | Small (S/M) | Do first |
| **P2** Strategic | High (enables Epic 4 restructuring) | Large (L/XL) | Plan carefully |
| **P3** Opportunistic | Low-Medium (nice to have) | Small (S/M) | Do when convenient |
| **P4** Defer | Low (cosmetic or edge case) | Large (L/XL) | Backlog |

---

## 4. Sample Proposals

### CP-01: Integration Directory Consolidation
```
PROPOSAL ID: CP-01
TITLE: Consolidate 5 integration directories into unified structure
PRIORITY: P1 (quick win — highest-severity duplication zone)

CURRENT STATE:
- integration-guides/ (10 files: GitHub, Jira, MS Project, Trello)
- integration_guides/ (18 files: same + Power Automate, Zapier)
- integration-examples/ (5 files: Asana, Jira, MS Project, Smartsheet)
- integration-toolkits/ (2 files: nearly empty placeholder)
- integrations/ (59 files: actual code — Asana connector, Jira sync, webhooks)
- Total: 94 files across 5 directories
- Classification: duplicate (integration-guides vs integration_guides), refactor (others)
- Issues: Users cannot find integration content; underscore vs hyphen naming inconsistency

PROPOSED STATE:
- integrations/ (canonical — already has actual code)
  - integrations/guides/ (merge integration-guides/ + integration_guides/, dedupe)
  - integrations/examples/ (move integration-examples/ content)
  - integrations/connectors/ (existing Asana, Jira-Asana, webhook code)
- Remove: integration-toolkits/ (near-empty, no unique content)
- Redirect: integration-guides/ → integrations/guides/ (symlink or README pointer)
- Redirect: integration_guides/ → integrations/guides/

EFFORT: M (2-3 days — deduplication requires content review)

RISK:
- Broken links: MEDIUM (integration_guides/ referenced in some docs)
- Content loss: LOW (all content preserved, just relocated)
- User confusion: LOW (single location is clearer)

MAPPED EPIC: Epic 4 (Performance-Oriented Domain Refactor)
DEPENDENCIES: None
```

### CP-02: Remove Empty Methodology Placeholders
```
PROPOSAL ID: CP-02
TITLE: Remove empty Agile/, Traditional/, Hybrid/, Waterfall/ top-level directories
PRIORITY: P1 (quick win — reduces top-level clutter)

CURRENT STATE:
- Agile/ (2 files: TODO.md only)
- Traditional/ (1 file: TODO.md only)
- Hybrid/ (6 files: TODO.md + release validation doc)
- Waterfall/ (2 files: no content)
- Total: 11 files, all placeholders or empty
- Classification: deprecated
- Issues: Confuses users who expect content here; real content is in templates/, methodology-frameworks/, project-lifecycle/

PROPOSED STATE:
- Delete: Agile/, Traditional/, Waterfall/
- Archive: Hybrid/Release_Validation_2025-08-08.md → docs/archive/
- Add: README note or NAVIGATION_GUIDE update pointing to actual content locations

EFFORT: S (< 1 day)

RISK:
- Broken links: LOW (these dirs are rarely linked to)
- Content loss: NONE (no real content)
- User confusion: LOW (improves clarity)

MAPPED EPIC: Epic 4 (Performance-Oriented Domain Refactor)
DEPENDENCIES: None
```

### CP-03: Onboarding Content Consolidation
```
PROPOSAL ID: CP-03
TITLE: Consolidate 4 onboarding locations into unified Getting Started Guide
PRIORITY: P2 (strategic — enables Epic 3 Getting Started Guide)

CURRENT STATE:
- onboarding/ (4 files: README, template-index.json, 2 JS scaffolds)
- quick-start-kits/ (26 files: first-time PM starter, agile transformation, etc.)
- docs/getting-started/ (8 files: methodology selector, tutorials, progressive complexity)
- README.md Quick Start section (4 steps, too terse)
- Total: ~42 files across 4 locations
- Classification: refactor
- Issues: 3 overlapping methodology selection guides; fragmented first-use experience

PROPOSED STATE:
- docs/getting-started/ (canonical for all onboarding)
  - docs/getting-started/README.md → New unified Getting Started Guide
  - docs/getting-started/first-project/ (absorb quick-start-kits/first-time-pm-starter/)
  - docs/getting-started/tutorials/ (keep existing)
  - docs/getting-started/methodology-guide.md (merge 3 selection guides)
- Keep: quick-start-kits/ for specialized kits (agile transformation, remote team, etc.)
- Deprecate: onboarding/ (JS scaffolds non-functional; template-index.json useful for tooling, move to schemas/)
- Update: README.md Quick Start → link to docs/getting-started/

EFFORT: L (3-5 days — content merge + link updates)

RISK:
- Broken links: MEDIUM (multiple docs reference quick-start-kits/)
- Content loss: LOW (consolidating, not deleting)
- User confusion: LOW during transition (redirect links)

MAPPED EPIC: Epic 3 (README + Entry Experience Redesign)
DEPENDENCIES: CP-02 (clean top-level first)
```

---

## 5. Full Consolidation Opportunity List (Priority Ranked)

| ID | Title | Priority | Effort | Epic |
|----|-------|----------|--------|------|
| CP-01 | Integration directory consolidation | P1 | M | Epic 4 |
| CP-02 | Remove empty methodology placeholders | P1 | S | Epic 4 |
| CP-03 | Onboarding content consolidation | P2 | L | Epic 3 |
| CP-04 | Template store unification (`templates/` + `docs/templates/` + `staging/`) | P2 | XL | Epic 4 |
| CP-05 | Industry template merge (`industry_templates/` + `industry-specializations/`) | P2 | M | Epic 4 |
| CP-06 | Dashboard directory consolidation | P3 | M | Epic 4 |
| CP-07 | Re-tag 20-30 universal templates with methodology-specific tags | P1 | M | Epic 4 |
| CP-08 | Navigation guide consolidation (GUIDE.md + NAVIGATION_GUIDE.md → architecture) | P3 | S | Epic 3 |
| CP-09 | Create missing Team domain templates (skills matrix, team health) | P2 | L | Epic 4 |

---

## 6. Stakeholder Summary

**Key findings for leadership review:**
1. The repository has strong execution template coverage but weak outcome measurement and governance tracking
2. 6 duplication zones can be resolved through 9 consolidation proposals (2 quick wins, 4 strategic, 3 opportunistic)
3. Re-tagging ~30 templates (CP-07) is the highest-ROI action — it fixes most domain coverage gaps without creating new content
4. The OUTCOMES value flow stage and Team performance domain are the biggest content gaps, directly addressed by Epics 1 and 4
