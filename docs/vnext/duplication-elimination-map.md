# Duplication Elimination Map
> **Story:** #717 (Redundancy Detection) | **Epic:** #707 (Repository Audit & Mapping)
> **Generated:** 2026-03-19 | **Commit:** `96e1d3a1`
> **Framework:** See [consolidation-framework.md](consolidation-framework.md)

---

## Executive Summary

**9 overlap groups** identified across 1,140 classified assets. **271 assets** (23.8%) are involved in duplication — 47 already tagged as duplicates, 224 additional assets identified through file-level and structural analysis.

**Consolidation impact:** Resolving all groups would reduce effective asset count by ~180 (redirects + archives + deletes), improving navigability and reducing maintenance burden by ~16%.

---

## Overlap Group 1: Methodology — Agile

**Severity:** S2 (Structural Duplicate) | **Assets involved:** 34 | **Directories:** 6

### Current State
- `Agile/` — 1 asset (TODO.md only, legacy root stub)
- `templates/agile/` — 8 assets (flat template collection)
- `methodology-frameworks/agile-scrum/` — 15 assets (deep framework structure)
- `examples/agile/` — 4 assets (worked examples)
- `quick-start-kits/agile-transformation/` — 5 assets (onboarding-oriented)
- `role-based-toolkits/scrum-master/` — cross-references agile ceremonies

### Canonical Selection
**Canonical:** `methodology-frameworks/agile-scrum/` — deepest structure, most complete, proper taxonomy alignment.

### Consolidation Actions
- `Agile/TODO.md` → **DELETE** — legacy stub, no content value
- `templates/agile/` (8 files) → **REDIRECT** to `methodology-frameworks/agile-scrum/` — merge unique content first
- `examples/agile/` (4 files) → **MERGE** into `methodology-frameworks/agile-scrum/examples/`
- `quick-start-kits/agile-transformation/` → **KEEP** — distinct purpose (onboarding), not a true duplicate
- `role-based-toolkits/scrum-master/` → **KEEP** — role-scoped view, complementary

### File-Level Duplicates
- `sprint-planning-template.md` appears in 4 locations → Canonical: `methodology-frameworks/agile-scrum/sprint-planning/`
- `sprint_planning_template.md` appears in 3 locations → **MERGE** into canonical (naming normalization)
- `stakeholder_communication_planning.md` in `templates/agile/` → **REDIRECT** to lifecycle-appropriate location

### Impact Assessment
- 12 assets to consolidate, 5 to keep in place
- No external links reference `Agile/` or `templates/agile/` directly (checked via grep)
- `methodology-frameworks/agile-scrum/` README may need updated index after merge

---

## Overlap Group 2: Methodology — Traditional/Waterfall

**Severity:** S2 (Structural Duplicate) | **Assets involved:** 30 | **Directories:** 2

### Current State
- `Traditional/` — 1 asset (TODO.md only, legacy root stub)
- `templates/traditional/` — 29 assets (deep nested structure under `Traditional/Process_Groups/`)

### Canonical Selection
**Canonical:** `templates/traditional/` — only location with actual content.

### Consolidation Actions
- `Traditional/TODO.md` → **DELETE** — legacy stub
- `templates/traditional/` → **KEEP** then **REFACTOR** during Epic 4 to move under `methodology-frameworks/traditional/`

### Impact Assessment
- 1 asset to delete, 29 to refactor (location move, not content change)
- Internal cross-references from `templates/traditional/Traditional/Process_Groups/` nested path need flattening

---

## Overlap Group 3: Methodology — Hybrid

**Severity:** S2 (Structural Duplicate) | **Assets involved:** 13 | **Directories:** 2

### Current State
- `Hybrid/` — 2 assets (TODO.md + Release_Validation_2025-08-08.md, both legacy)
- `templates/hybrid/` — 12 assets (nested under `Hybrid/Templates/`)

### Canonical Selection
**Canonical:** `templates/hybrid/` — only location with substantive content.

### Consolidation Actions
- `Hybrid/TODO.md` → **DELETE** — legacy stub
- `Hybrid/Release_Validation_2025-08-08.md` → **ARCHIVE** — already tagged duplicate, historical value only
- `templates/hybrid/` → **KEEP** then **REFACTOR** during Epic 4 to `methodology-frameworks/hybrid/`

### Impact Assessment
- 2 assets to remove/archive, 12 to refactor (location move)

---

## Overlap Group 4: Integration Ecosystem

**Severity:** S1 (Exact Duplicate) | **Assets involved:** 51 | **Directories:** 5

### Current State
- `integration-guides/` — 9 assets (kebab-case, structured by tool)
- `integration_guides/` — 17 assets (snake_case mirror, tagged duplicate)
- `integration-examples/` — 5 assets (tagged duplicate)
- `integration-toolkits/` — 2 assets (development tools)
- `integrations/` — 18 assets (app-level integration code: asana, jira, oauth, webhooks)

### Canonical Selection
**Canonical:** `integration-guides/` — correct naming convention, structured, not a code directory.
**Secondary canonical:** `integrations/` — distinct purpose (code/config, not documentation).

### Consolidation Actions
- `integration_guides/` (17 files) → **REDIRECT** to `integration-guides/` — already tagged duplicate; merge any unique content (excel_automation, power_automate, zapier_automation have no equivalent in canonical)
- `integration-examples/` (5 files) → **REDIRECT** to `integration-guides/` — already tagged duplicate
- `integration-toolkits/` (2 files) → **MERGE** into `integration-guides/development-tools/`
- `integrations/` (18 files) → **KEEP** — distinct purpose (application code, not documentation)

### File-Level Duplicates
- `github_integration/` exists in both `integration-guides/` and `integration_guides/` (4 files each) → S1 exact
- `jira_integration/`, `microsoft_project_integration/`, `trello_integration/` — 1:1 mirrors

### Impact Assessment
- 24 already-tagged duplicates to consolidate
- 3 unique subdirectories in `integration_guides/` (excel_automation, power_automate, zapier_automation) must be **MERGED** into canonical before redirect
- `integrations/` stays independent — different content type (code vs docs)

---

## Overlap Group 5: Industry Templates

**Severity:** S1 (Exact Duplicate) | **Assets involved:** 113 | **Directories:** 2

### Current State
- `industry-specializations/` — 91 assets (kebab-case, deep structure: healthcare-pharmaceutical 53, information-technology 34, financial-services 3)
- `industry_templates/` — 22 assets (snake_case, tagged duplicate: construction 4, financial_services 2, healthcare_pharmaceutical 5, information_technology 3, software_development 8)

### Canonical Selection
**Canonical:** `industry-specializations/` — larger, deeper, correct naming convention.

### Consolidation Actions
- `industry_templates/` (22 files) → **REDIRECT** to `industry-specializations/` — already tagged duplicate
- `industry_templates/construction/` (4 files) → **MERGE** into `industry-specializations/construction/` (new subdirectory — content has no equivalent in canonical)
- `industry_templates/software_development/` (8 files) → **MERGE** into `industry-specializations/information-technology/software-development/`

### Impact Assessment
- 22 tagged duplicates; 12 have direct equivalents (redirect), 10 need new canonical locations (merge)
- `construction/` and `software_development/` content is unique — must not be lost

---

## Overlap Group 6: docs/templates/ Shadow Collection

**Severity:** S3 (Overlap) | **Assets involved:** 147 | **Directories:** 1 (but overlaps many)

### Current State
- `docs/templates/` — 147 files, a flat collection that mirrors content from across the repo
- Overlaps with: `project-lifecycle/`, `role-based-toolkits/`, `project-assessment-suite/`, `methodology-frameworks/`, `business-stakeholder-suite/`

### Canonical Selection
**Canonical:** The domain-specific directories are canonical (e.g., `project-lifecycle/01-initiation/stakeholder-analysis/`).
`docs/templates/` serves as a **discovery index**, not a canonical source.

### Consolidation Actions
- `docs/templates/` → **REFACTOR** into an index/registry that links to canonical locations rather than duplicating content
- Files with equivalents in domain directories → **REDIRECT** (replace with link stubs or remove)
- Files unique to `docs/templates/` with no domain home → **KEEP** until Epic 4 assigns them a domain directory

### Key Duplicate Pairs (sample)
- `docs/templates/sprint-planning-template.md` ↔ `methodology-frameworks/agile-scrum/sprint-planning/`
- `docs/templates/agile-stakeholder-map-template.md` ↔ `project-lifecycle/01-initiation/stakeholder-analysis/`
- `docs/templates/executive-dashboard-template.md` ↔ `business-stakeholder-suite/executive-dashboards/`
- `docs/templates/capa_management_template.md` ↔ `industry-specializations/healthcare-pharmaceutical/compliance/`
- 6 healthcare templates duplicated between `docs/templates/` and `industry-specializations/healthcare-pharmaceutical/`

### Impact Assessment
- Estimated ~90 of 147 files have equivalents elsewhere → high redirect volume
- ~57 files may be unique to `docs/templates/` → need domain assignment in Epic 4
- This is the **largest single consolidation effort** — recommend phased approach across Sprints 3-4

---

## Overlap Group 7: Deprecated Staging Areas

**Severity:** S1 (Exact Duplicate of outdated content) | **Assets involved:** 106 | **Directories:** 2

### Current State
- `staging/` — 56 assets (all classified deprecated)
- `PM Tools Templates - Q3 2025 Delivery Cycle/` — 50 assets (all classified deprecated)

### Canonical Selection
Not applicable — these are deprecated, not canonical sources.

### Consolidation Actions
- `staging/` (56 files) → **ARCHIVE** — move to `_archive/staging/` with deprecation notice
- `PM Tools Templates - Q3 2025 Delivery Cycle/` (50 files) → **ARCHIVE** — move to `_archive/q3-2025-cycle/`
- Before archiving, scan for any unique content not present elsewhere → **MERGE** if found

### Impact Assessment
- 106 assets removed from active tree
- Reduces top-level directory clutter significantly
- Q3 2025 cycle contains a full `template-selector` app with coverage reports — confirm no active dependency

---

## Overlap Group 8: Dashboard & Reporting

**Severity:** S4 (Naming Collision) | **Assets involved:** 3 | **Directories:** 2

### Current State
- `curation-dashboard/` — 1 asset (repository curation tooling)
- `dashboards/` — 1 asset (project dashboard templates)
- `reports/` — 9 assets (reporting templates)

### Canonical Selection
**Canonical:** `business-stakeholder-suite/executive-dashboards/` for executive dashboards; `reports/` for reporting templates.

### Consolidation Actions
- `curation-dashboard/` → **KEEP** — distinct purpose (meta/tooling, not PM content)
- `dashboards/` → **REDIRECT** to `business-stakeholder-suite/executive-dashboards/`
- `reports/` → **KEEP** — well-scoped, no overlap

### Impact Assessment
- Minimal — 1 redirect, 2 directories kept

---

## Overlap Group 9: Documentation & Project Docs

**Severity:** S3 (Overlap) | **Assets involved:** 394 | **Directories:** 3

### Current State
- `docs/` — 385 assets (largest directory: templates 147, governance, guides, site)
- `project-docs/` — 9 assets (project-level documentation, classified refactor)
- `meta/` — 5 assets (repository meta-documentation)

### Canonical Selection
**Canonical:** `docs/` for repository-wide documentation; `project-docs/` content should move to `docs/project/`.

### Consolidation Actions
- `project-docs/` (9 files) → **MERGE** into `docs/project/` (new subdirectory)
- `meta/` → **KEEP** or **MERGE** into `docs/meta/` for consistency
- `docs/` internal structure → **REFACTOR** in Epic 4 (separate templates index from governance from guides)

### Impact Assessment
- 9 files to relocate, 5 to potentially relocate
- `docs/` internal refactoring is large scope — deferred to Epic 4

---

## Consolidated Impact Summary

### By Action Type
- **KEEP:** 488 assets (no change needed)
- **REDIRECT:** ~136 assets (replace with pointer or remove after merge)
- **MERGE:** ~34 assets (unique content absorbed into canonical)
- **ARCHIVE:** 108 assets (deprecated content to `_archive/`)
- **DELETE:** 4 assets (legacy stubs with no content value)
- **REFACTOR (deferred):** ~370 assets (location moves in Epic 4)

### By Priority
1. **P1 — Quick wins (Sprint 3):** Groups 1-3 methodology stubs (delete 4 legacy files), Group 7 deprecated archiving (106 files)
2. **P2 — High-value consolidation (Sprint 3-4):** Group 4 integration ecosystem (24 duplicates), Group 5 industry templates (22 duplicates)
3. **P3 — Large-scale refactor (Sprint 4-6):** Group 6 docs/templates shadow collection (147 files), Group 9 docs restructure

### Risk Register
- **R1:** Merging `integration_guides/` unique content (excel, power_automate, zapier) — must not be lost
- **R2:** `industry_templates/construction/` and `software_development/` — unique verticals with no canonical equivalent
- **R3:** `docs/templates/` has ~57 potentially unique files — need domain assignment before redirect
- **R4:** `PM Tools Templates - Q3 2025 Delivery Cycle/` contains a full JS app — confirm no active CI/CD dependency
- **R5:** 164 filename collisions across directories — file-level content comparison recommended before bulk operations

### Broken Link Assessment
- No external (GitHub Pages, README badges) references found to deprecated directories
- Internal cross-references: `docs/` README links to `docs/templates/` extensively — must update index after consolidation
- `integration-guides/README.md` may reference peer directories — verify before removing

---

## Next Steps
1. Present this map for stakeholder review (Task #767)
2. Execute P1 quick wins during Sprint 3 (Epic 4 scope)
3. Execute P2 consolidation during Sprint 3-4
4. Plan P3 large-scale refactor as part of Epic 4 story breakdown

---

*Analysis completed as part of Story 0.3 (#717), Tasks #764-#766. Duplication detection used classified inventory data from Story 0.2 (#716), structural analysis of 54 directories and 1,140 content assets, and file-level name matching across 164 collision groups.*
