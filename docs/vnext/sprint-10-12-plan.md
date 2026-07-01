# vNext Sprint 8-12 Plan

**Generated:** 2026-07-01 | **Last Updated:** 2026-07-01
**Project Board:** [Value Delivery System Upgrade – vNext](https://github.com/users/mirichard/projects/9)
**Sprint cadence:** 2-week sprints, tracked via GitHub milestones

---

## Current State Summary

### Completed Epics
- **Epic 0: Repository Audit & Mapping** (#707) — Done
- **Epic 2: Template Decision Engine** (#709) — Done (PR #941, merged Jun 1)
- **Epic 3: README + Entry Experience Redesign** (#710) — Done

### In-Flight Work
- **Epic 1: Value Delivery Layer** (#708) — Stories #721, #722, #723, #726 complete. Stories #724 and #725 remain (Sprint 9).

### Completed Sprints (this cycle)

**Sprint 7** (Jun 29–Jul 10) — ✅ Complete. 14/15 closed. #722 carried to Sprint 8.

**Sprint 8** (Jul 13–24) — ✅ Complete (delivered Jul 1). All tasks done:
- #722 — KPI Mapping Engine → Done (story + #786 implementation + #787 validation)
- #723 — Outcome Dashboard → Done (#788 research + #789 design + #790 implementation + #791 validation)
- #711 — Moved to Sprint 10 (Epic 4 dependency on Epic 1)

**Deliverables committed to `main`:**
- `project-lifecycle/04-monitoring-control/progress-tracking/kpi-mapping-template.md` — 4-level KPI hierarchy, 30 KPIs, leading/lagging classification
- `project-lifecycle/04-monitoring-control/progress-tracking/value-delivery-dashboard.md` — 5-panel value delivery dashboard with health score formula
- `meta/architecture-research/787-kpi-hierarchy-validation.md`
- `meta/architecture-research/788-789-dashboard-research-design.md`
- `meta/architecture-research/791-dashboard-validation.md`

---

## Velocity Baseline

| Sprint | Period | Closed |
|--------|--------|--------|
| Sprint 1 | Apr 6–17 | 7 |
| Sprint 2 | Apr 20–May 1 | 9 |
| Sprint 3 | May 4–15 | 10 |
| Sprint 4 | May 18–29 | 10 |
| Sprint 5 | Jun 1–12 | 10 |
| Sprint 6 | Jun 15–26 | 13 |
| Sprint 7 | Jun 29–Jul 10 | 14 |
| Sprint 8 | Jul 13–24 | 7 (actual work; 12 including early Epic 2 closures) |

**Average velocity:** 10.4 issues/sprint (Sprints 1–7)
**Planning capacity:** 10 issues/sprint committed target.

---

## Sprint 9 — Complete Epic 1 + Start Domain Taxonomy (Jul 27–Aug 7)

**Status:** 🔵 Planned
**Goal:** Close Epic 1 by completing Stories #724 (Value Stream) and #725 (Benefits Review research/design), then begin Epic 4 with the Domain Taxonomy design.

### Committed (10 issues)

| # | Title | Epic | Status |
|---|-------|------|--------|
| #724 | [Value] – Value Stream Integration | Epic 1 | 🔵 Planned |
| #792 | TASK: [Story #724] Research: Map lifecycle to value stream | Epic 1 | 🔵 Planned |
| #793 | TASK: [Story #724] Design: Define value stream model | Epic 1 | 🔵 Planned |
| #794 | TASK: [Story #724] Implementation: Create value stream map | Epic 1 | 🔵 Planned |
| #795 | TASK: [Story #724] Validation: End-to-end scenario walkthrough | Epic 1 | 🔵 Planned |
| #725 | [Value] – Benefits Review Process | Epic 1 | 🔵 Planned |
| #796 | TASK: [Story #725] Research: Review closure templates | Epic 1 | 🔵 Planned |
| #797 | TASK: [Story #725] Design: Design benefits review process | Epic 1 | 🔵 Planned |
| #736 | [Structure] – Domain Taxonomy Design | Epic 4 | 🔵 Planned |
| #708 | Epic 1: Value Delivery Layer (close tracker) | Epic 1 | 🔵 Planned |

**Capacity:** 10/10 — at target. #736 is relief valve if needed.
**Key dependency:** #725 implementation (#798/#799) trails to Sprint 10.
**Key risk:** #736 has no task breakdown — it's a design spike, not a story with sub-tasks.

---

## Sprint 10 — Epic 4 Domain Refactor + Epic 5 Kickoff (Aug 10–21)

**Status:** 🔵 Planned
**Goal:** Establish domain refactor foundation and close remaining Epic 1 tail work.

### Committed (8 issues, 2 slots reserved)

| # | Title | Epic | Status |
|---|-------|------|--------|
| #798 | TASK: [Story #725] Implementation: Create benefits review artifacts | Epic 1 | 🔵 Planned |
| #799 | TASK: [Story #725] Validation: Process review and integration testing | Epic 1 | 🔵 Planned |
| #711 | Epic 4: Domain Refactor (epic tracker) | Epic 4 | 🔵 Planned |
| #737 | [Structure] – Asset Migration Plan | Epic 4 | 🔵 Planned |
| #738 | [Structure] – Cross-Reference System | Epic 4 | 🔵 Planned |
| #712 | Epic 5: Principles Integration (epic tracker) | Epic 5 | 🔵 Planned |
| #741 | [Principles] – Principle Taxonomy | Epic 5 | 🔵 Planned |
| #742 | [Principles] – Asset Annotation Layer | Epic 5 | 🔵 Planned |

**Capacity:** 8/10 — 2 slots reserved for carryover.
**Key dependency:** #736 (Domain Taxonomy) must complete in Sprint 9 for #737/#738 to proceed.
**Pre-sprint action:** Create task breakdowns for #737, #738, #741, #742 during Sprint 9.

---

## Pre-Sprint Triage

### Milestone Reassignments (done)
- ✅ #711 — Moved from Sprint 8 → Sprint 10

### Missing Task Breakdowns (create during Sprint 9)
- #737, #738, #741, #742 — Need research/design/implementation/validation sub-tasks

### Stale Issue
- #936 — "Contributor fit for the recommendation/feedback work" (Jun 12). Not on board. Triage needed.

---

## Open Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Sprint 9 at capacity (10 issues) | Medium | Sprint 10 slips | #736 defers if Epic 1 runs long |
| No task breakdowns for Epic 4/5 stories | High | Scope ambiguity | Create tasks during Sprint 9 |
| Domain Taxonomy (#736) repo-wide impact | Medium | Rework later | Design spike with stakeholder review |
| Epics 6–7 have zero task breakdowns | Low now | Sprint 11–12 rough | Defer to Sprint 10 |
