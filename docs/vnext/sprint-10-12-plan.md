# vNext Sprint 10-12 Plan

**Generated:** 2026-07-01
**Project Board:** [Value Delivery System Upgrade – vNext](https://github.com/users/mirichard/projects/9)
**Sprint cadence:** 2-week sprints, tracked via GitHub milestones

---

## Current State Summary

### Completed Epics
- **Epic 0: Repository Audit & Mapping** (#707) — Done
- **Epic 2: Template Decision Engine** (#709) — Done (PR #941, merged Jun 1)
- **Epic 3: README + Entry Experience Redesign** (#710) — Done

### In-Flight Work
- **Epic 1: Value Delivery Layer** (#708) — Partially complete. Stories #721 (Benefits Realization) and #726 (Context Assessment) done. Stories #722–#725 have open tasks.

### Board Hygiene (fixed)
- 3 items were stuck as "In Progress" on the board but closed since May 1 (#715, #768, #778). Updated to Done and archived.

### Current Sprint
- **Sprint 7** (Jun 29–Jul 10) — current sprint. 14 of 15 issues closed. 1 carryover:
  - #722 — KPI Mapping Engine (story-level, tasks in Sprint 8)

### Early Completions Misaligned to Milestones
Epic 2 work was completed May 31–Jun 1 but milestone-assigned to Sprints 8–12. 17 already-closed issues inflate those milestone counts. Actual open work per sprint is what matters below.

---

## Velocity Baseline

**Method:** Issue count per completed sprint (no size/points field on the board).

| Sprint | Period | Closed |
|--------|--------|--------|
| Sprint 1 | Apr 6–17 | 7 |
| Sprint 2 | Apr 20–May 1 | 9 |
| Sprint 3 | May 4–15 | 10 |
| Sprint 4 | May 18–29 | 10 |
| Sprint 5 | Jun 1–12 | 10 |
| Sprint 6 | Jun 15–26 | 13 |
| Sprint 7 | Jun 29–Jul 10 | 14 |

**Average velocity:** 10.4 issues/sprint
**Recent trend (Sprints 5–7):** 12.3 issues/sprint (accelerating)
**Planning capacity:** 10 issues/sprint committed target; stretch to 12 if momentum holds.

---

## Dependency and Sequencing Analysis

### Epic 1 → Epics 4–7
Stories #722–#725 complete the Value Layer foundation. Epics 4 (Domain Refactor), 5 (Principles), 6 (Governance), and 7 (Product Layer) reference value delivery concepts established here.

- #722 (KPI Mapping) → #723 (Outcome Dashboard) — dashboard extends KPI templates
- #724 (Value Stream Integration) — independent of #722/#723, can run in parallel
- #725 (Benefits Review) — depends on #721 (done), independent of #722–#724

### Epic 4 → Epic 5
Stories #736–#740 restructure the repo. #736 (Domain Taxonomy) must come first; #737 (Migration Plan) and #738 (Cross-Reference) follow.

### Epic 5 depends on Epic 4 taxonomy
Stories #741–#745 annotate templates with principles. Requires #736 to be settled first.

### Epics 6 and 7 trail everything above
Story-level items only, no task breakdowns. Should not be scheduled until Epics 4–5 are substantially done.

### Overlap Risk
#711 (Epic 4 tracker) is milestone-assigned to Sprint 8 alongside Epic 1 tasks. **Moved to Sprint 10** — Epic 4 work should not start until Epic 1 core stories finish.

---

## Sprint 8 — Finish Epic 1 KPI + Dashboard (Jul 13–24)

**Goal:** Complete Stories #722 (KPI Mapping) and #723 (Outcome Dashboard), landing the quantitative value measurement layer.

### Committed (8 issues)

| # | Title | Epic |
|---|-------|------|
| #722 | [Value] – KPI Mapping Engine (carryover from Sprint 7) | Epic 1 |
| #786 | TASK: [Story #722] Implementation: Create KPI mapping templates | Epic 1 |
| #787 | TASK: [Story #722] Validation: KPI hierarchy completeness review | Epic 1 |
| #723 | [Value] – Outcome Dashboard – Real-Time Value Visibility | Epic 1 |
| #788 | TASK: [Story #723] Research: Analyze existing dashboard template | Epic 1 |
| #789 | TASK: [Story #723] Design: Design value delivery dashboard section | Epic 1 |
| #790 | TASK: [Story #723] Implementation: Extend dashboard with value section | Epic 1 |
| #791 | TASK: [Story #723] Validation: Dashboard usability and completeness | Epic 1 |

**Capacity:** 8 / 10 — within capacity with buffer for carryover.
**Moved out:** #711 (Epic 4 tracker) → Sprint 10.

**Risks:**
- #723 has 4 sequential tasks. If research takes longer than expected, validation may slip to Sprint 9.

---

## Sprint 9 — Complete Epic 1 + Start Domain Taxonomy (Jul 27–Aug 7)

**Goal:** Close Epic 1 by completing Stories #724 (Value Stream) and #725 (Benefits Review), then begin Epic 4 with the Domain Taxonomy design.

### Committed (10 issues)

| # | Title | Epic |
|---|-------|------|
| #724 | [Value] – Value Stream Integration | Epic 1 |
| #792 | TASK: [Story #724] Research: Map lifecycle to value stream stages | Epic 1 |
| #793 | TASK: [Story #724] Design: Define value stream model | Epic 1 |
| #794 | TASK: [Story #724] Implementation: Create value stream map | Epic 1 |
| #795 | TASK: [Story #724] Validation: End-to-end scenario walkthrough | Epic 1 |
| #725 | [Value] – Benefits Review Process | Epic 1 |
| #796 | TASK: [Story #725] Research: Review closure and retrospective templates | Epic 1 |
| #797 | TASK: [Story #725] Design: Design benefits review process | Epic 1 |
| #736 | [Structure] – Domain Taxonomy Design | Epic 4 |
| #708 | Epic 1: Value Delivery Layer (close epic tracker) | Epic 1 |

**Capacity:** 10 / 10 — at capacity.

**Risks:**
- #725 tasks #798/#799 (implementation/validation) intentionally trail into Sprint 10.
- If either Epic 1 story encounters scope creep, #736 slips to Sprint 10.
- #736 has no task breakdown. **Action:** Create tasks before Sprint 9 starts.

---

## Sprint 10 — Epic 4 Domain Refactor + Epic 5 Kickoff (Aug 10–21)

**Goal:** Establish domain refactor foundation (migration plan, cross-references) and close remaining Epic 1 tail work.

### Committed (8 issues, 2 slots reserved)

| # | Title | Epic |
|---|-------|------|
| #798 | TASK: [Story #725] Implementation: Create benefits review artifacts | Epic 1 |
| #799 | TASK: [Story #725] Validation: Process review and integration testing | Epic 1 |
| #711 | Epic 4: Domain Refactor (epic tracker) | Epic 4 |
| #737 | [Structure] – Asset Migration Plan | Epic 4 |
| #738 | [Structure] – Cross-Reference System | Epic 4 |
| #712 | Epic 5: Principles Integration (epic tracker, planning only) | Epic 5 |
| #741 | [Principles] – Principle Taxonomy | Epic 5 |
| #742 | [Principles] – Asset Annotation Layer | Epic 5 |

**Capacity:** 8 / 10 — 2 slots reserved for Sprint 9 carryover and task breakdowns.

**Risks:**
- #736 must complete in Sprint 9 for #737/#738 to proceed.
- #737, #738, #741, #742 need task breakdowns. **Action:** Create before Sprint 10 starts.
- Epic 5 starting here assumes domain taxonomy is settled.

---

## Pre-Sprint Triage List

### Missing Task Breakdowns (create before Sprint 9)
- #736, #737, #738, #741, #742 — No research/design/implementation/validation sub-tasks

### Milestone Reassignment
- #711 — Move from Sprint 8 → Sprint 10 milestone
- #796, #797 — Move from Sprint 10 → Sprint 9 milestone

### Stale Issue
- #936 — "Contributor fit for the recommendation/feedback work" (Jun 12, not on board). Triage: close or add to backlog.

---

## Open Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Sprint 9 at capacity (10 issues, 2 stories + taxonomy) | Medium | Sprint 10 slips | #736 is relief valve — defer if Epic 1 runs long |
| No task breakdowns for Epic 4/5 stories | High | Scope ambiguity | Create tasks during Sprint 8 |
| Domain Taxonomy (#736) has repo-wide impact | Medium | Rework in Sprints 11–12 | Treat as design spike; stakeholder review before migration |
| Epics 6–7 have zero task breakdowns (10+ stories) | Low now | Sprint 11–12 planning rough | Defer task creation to Sprint 10 |
