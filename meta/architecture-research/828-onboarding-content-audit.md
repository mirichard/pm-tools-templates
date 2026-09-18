# Task #828: Onboarding Content Audit

**Story:** #733 ([Onboarding] – Getting Started Guide – First-Use Experience)
**Epic:** #710 (Epic 3: README + Entry Experience Redesign)
**Date:** 2026-04-03
**Status:** Complete

---

## 1. Content Inventory

### Location A: `onboarding/` (4 files)
| File | Type | Target Audience | Quality | Notes |
|------|------|----------------|---------|-------|
| README.md | Guide | New users | Medium | Brief intro, links to template-index.json |
| template-index.json | Data | Programmatic | High | 30 templates with methodology, complexity, paths — well-structured |
| interactive-onboarding.js | Code | Developers | Low | JS scaffold, unclear if functional |
| template-selection-wizard.js | Code | Developers | Low | JS scaffold, unclear if functional |

### Location B: `quick-start-kits/` (26 files)
| Sub-area | Files | Target Audience | Quality | Best Content |
|----------|-------|----------------|---------|-------------|
| `first-time-pm-starter/` | 9 | New PMs | **High** | Complete starter kit: charter, risk register, budget, status report — all simplified versions. **Best onboarding content in the repo.** |
| `agile-transformation/` | 5 | Orgs adopting agile | Medium | Readiness assessment, transformation roadmap, success metrics |
| Root guides | 5 | Various | Medium | methodology-selection-guide.md, 30-day-quick-start.md, project-initiation-checklist.md |
| Other kits | 7 | Specialized | Low | LeSS adoption, remote team, startup, executive reporting — mostly READMEs only |

### Location C: `docs/getting-started/` (8 files)
| File | Type | Target Audience | Quality | Notes |
|------|------|----------------|---------|-------|
| README.md | Index | New users | Medium | Links to sub-pages |
| methodology-selector.md | Guide | Decision-makers | Medium | Helps choose agile/traditional/hybrid |
| progressive-complexity.md | Guide | All users | Medium | Explains simple → advanced progression |
| template-selector.md | Guide | Template seekers | Medium | Another selection aid |
| `tutorials/` (4 files) | Walkthroughs | Hands-on learners | **High** | Customize charter, automate emails — practical step-by-step |

### Location D: Root files
| File | Target Audience | Quality | Notes |
|------|----------------|---------|-------|
| README.md (Quick Start section) | All visitors | Medium | 4-step clone→find→customize→CLI. Too terse for new PMs. |
| GUIDE.md | All visitors | High | Comprehensive methodology overview. Too long for onboarding. |
| NAVIGATION_GUIDE.md | Returning users | High | Traffic light system. Good reference, not onboarding. |

---

## 2. Overlap Analysis

| Content Purpose | Locations | Overlap Severity |
|-----------------|-----------|-----------------|
| "What is this repo?" intro | README.md, GUIDE.md, onboarding/README.md | Medium — 3 versions, none ideal |
| Methodology selection | `quick-start-kits/methodology-selection-guide.md`, `docs/getting-started/methodology-selector.md`, GUIDE.md | **High** — 3 overlapping guides |
| First template walkthrough | `quick-start-kits/first-time-pm-starter/`, `docs/getting-started/tutorials/` | Medium — different approaches (starter kit vs. tutorial) |
| Template finding/selection | `docs/getting-started/template-selector.md`, `onboarding/template-selection-wizard.js`, TEMPLATE_INDEX.md | Medium — fragmented across formats |
| Progressive complexity | `docs/getting-started/progressive-complexity.md`, `quick-start-kits/` (implicit in structure) | Low |

---

## 3. Consolidation Recommendations

### Tier 1 — Keep and enhance (canonical sources)
1. **`quick-start-kits/first-time-pm-starter/`** — Best beginner content. Make this the primary "first template walkthrough" in the Getting Started Guide.
2. **`docs/getting-started/tutorials/`** — Good hands-on content. Use as "what next?" progressive paths.
3. **`docs/SYSTEM_ARCHITECTURE.md`** — New from Sprint 3. Use as "how it's organized" reference.

### Tier 2 — Consolidate into Getting Started Guide
4. **`quick-start-kits/methodology-selection-guide.md`** — Absorb key decision criteria into Getting Started Step 3.
5. **`docs/getting-started/methodology-selector.md`** — Merge with above; deprecate standalone version.
6. **`docs/getting-started/progressive-complexity.md`** — Absorb into "what next?" section.

### Tier 3 — Keep as reference (not onboarding)
7. **GUIDE.md** — Too long for onboarding but valuable as deep-dive reference.
8. **NAVIGATION_GUIDE.md** — Useful for returning users, not first-time.
9. **`onboarding/template-index.json`** — Programmatic asset, useful for tooling.

### Tier 4 — Deprecate or archive
10. **`onboarding/interactive-onboarding.js`** — Unclear status, likely non-functional.
11. **`onboarding/template-selection-wizard.js`** — Same as above.
12. **`onboarding/README.md`** — Will be superseded by consolidated Getting Started Guide.
