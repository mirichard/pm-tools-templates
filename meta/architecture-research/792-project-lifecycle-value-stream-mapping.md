# Task #792: Project Lifecycle → Value Stream Mapping Research

**Story:** #724 ([Value] – Value Stream Integration – End-to-End Flow Alignment)
**Epic:** #708 (Epic 1: Value Delivery Layer)
**Date:** 2026-07-30
**Status:** Complete
**Closes:** #792

---

## Objective

Analyze the `project-lifecycle/` directory structure, map its existing initiation-through-closure content to value stream stages, and identify handoff gaps between stages — per Story #724's acceptance criteria and in preparation for the Design task (#793).

---

## 1. Reconciling Two Existing Value Models

Two value-flow frameworks already exist in this repository and must be reconciled rather than duplicated:

| Source | Model | Granularity |
|--------|-------|-------------|
| [768-value-delivery-flow-model.md](768-value-delivery-flow-model.md) (Story #718, Epic 0) | INPUTS → ACTIVITIES → OUTPUTS → OUTCOMES | 4-stage, used for repo-wide **asset classification** (every template tagged with one of these 4 categories) |
| Story #724 acceptance criteria | Concept → Initiation → Planning → Execution → Delivery → Value Realization | 6-stage, used for a **narrative/visual value stream** specific to `project-lifecycle/` |

**Reconciliation:** The 6-stage model is a finer-grained, user-facing elaboration of the 4-stage model — it does not replace it. Design (#793) should present the 6-stage flow as the primary visualization (since it matches Story #724's acceptance criteria and speaks the language of `project-lifecycle/`'s own phase names) and annotate each stage with its parent 4-stage category for consistency with the repo's existing asset-classification system.

| 6-Stage (Story #724) | Maps to 4-Stage (#768) | `project-lifecycle/` Source |
|---|---|---|
| Concept | *(pre-Inputs)* | **Gap — not covered** (see §4.1) |
| Initiation | INPUTS | `01-initiation/` |
| Planning | ACTIVITIES (early) | `02-planning/` |
| Execution | ACTIVITIES (main) | `03-execution/` |
| *(Monitoring & Control)* | ACTIVITIES (continuous) | `04-monitoring-control/` — see §2.2, this is a parallel lane, not a linear stage |
| Delivery | OUTPUTS | `03-execution/` (Phase 3: Delivery & Handoff) + `05-closure/project-closure/` |
| Value Realization | OUTCOMES | `05-closure/` + post-closure assets from Stories #721–#723 |

---

## 2. `project-lifecycle/` Directory Inventory

### 2.1 Phase Structure
Five phase directories, each with its own `README.md` describing objectives, a process framework, deliverables, and (critically for this task) an existing **"Phase Transition Criteria"** checklist and **"Integration Touchpoints"** section:

| Phase | Subdirectories | Status |
|---|---|---|
| `01-initiation/` | project-charter, stakeholder-analysis, business-case, feasibility-study | Partially populated (see §3) |
| `02-planning/` | business-requirements, project-management-plan, resource-planning, risk-management, communication-planning, cost-management, quality-management, schedule-planning, scope-management | Partially populated (see §3) |
| `03-execution/` | work-management, team-coordination, quality-assurance, vendor-management | **All placeholder stubs** (see §3) |
| `04-monitoring-control/` | progress-tracking, issue-management, performance-measurement, change-control, decision-making | Mostly populated (see §3) |
| `05-closure/` | project-closure, lessons-learned, knowledge-transfer, transition-to-operations | **All placeholder stubs** (see §3) |

### 2.2 Monitoring & Control Is a Parallel Lane, Not a Stage
`04-monitoring-control/`'s own README states it "runs parallel to execution." It should be visualized in the Design task as a continuous swimlane spanning Execution → Delivery, not as a discrete box in the linear 6-stage flow. Its content (progress tracking, KPI mapping, value delivery dashboard) is also where Stories #722/#723 already delivered outcome-tracking assets — directly relevant to the "Value Realization" stage's inputs.

---

## 3. Template Completeness Findings (Prerequisite to Handoff Mapping)

Before handoff gaps can be meaningfully assessed, template *existence* had to be verified. Findings are more nuanced than expected:

### 3.1 Genuine Placeholder Stubs (15 of 26 subdirectories)
These `README.md` files explicitly state `"# Placeholder directory... This area is currently a placeholder during ongoing reorganization"` and redirect to `templates/` and `NAVIGATION_GUIDE.md`:

`01-initiation/business-case`, `01-initiation/feasibility-study`, `02-planning/communication-planning`, `02-planning/schedule-planning`, `02-planning/scope-management`, `03-execution/work-management`, `03-execution/team-coordination`, `03-execution/quality-assurance`, `03-execution/vendor-management`, `04-monitoring-control/change-control`, `04-monitoring-control/performance-measurement`, `05-closure/project-closure`, `05-closure/lessons-learned`, `05-closure/knowledge-transfer`, `05-closure/transition-to-operations`.

**Note:** the `NAVIGATION_GUIDE.md` these stubs point to is itself stale (last updated June 8, 2025) and incorrectly describes `project-lifecycle/` as "Empty" — it predates the population of `01-initiation/`, `02-planning/`, and `04-monitoring-control/`. This is a broken user journey: a PM hitting one of these 15 stubs mid-project (often at Execution or Closure — two of the highest-traffic stages) gets redirected to a guide that no longer reflects the repository's actual state.

### 3.2 "Phantom Template" READMEs (3 subdirectories)
`02-planning/cost-management`, `02-planning/quality-management`, and `04-monitoring-control/decision-making` are a subtler gap: their READMEs list "Templates Available" (e.g., "Cost Management Plan Template", "Quality Gate Definitions", "Decision Log Templates") by name, implying they exist — but **no actual template files are present**, and unlike §3.1 these READMEs don't even redirect elsewhere. This is more confusing than an honest placeholder.

### 3.3 Populated Subdirectories (8 of 26)
`01-initiation/project-charter` (3 methodology variants), `01-initiation/stakeholder-analysis` (3 variants), `02-planning/business-requirements`, `02-planning/project-management-plan` (3 variants), `02-planning/resource-planning` (3 templates), `02-planning/risk-management` (4 templates), `04-monitoring-control/issue-management`, `04-monitoring-control/progress-tracking` (4 templates, including the recently-added `kpi-mapping-template.md` and `value-delivery-dashboard.md` from Stories #722/#723).

---

## 4. Handoff Point Analysis

Each phase README already documents a **"Phase Transition Criteria"** checklist (e.g., Initiation → Planning requires an approved charter, validated business case, assigned PM) and an **"Integration Touchpoints"** section naming the next phase's relevant templates. This is real, useful content — but it is prose/checklist only. There is no artifact a PM actually fills in and hands forward.

**Core gap:** No structured "handoff record" exists anywhere in `project-lifecycle/`. Every phase transition currently relies on the outgoing phase's checklist being manually verified with no persisted evidence of what was confirmed, by whom, or what was carried forward as an open item.

### 4.1 Stage-by-Stage Gap Summary

| Transition | Existing Documentation | Gap |
|---|---|---|
| *(pre-project)* → Initiation | None | **"Concept" stage has no owning template.** Closest existing assets are `quick-start-kits/methodology-selection-guide.md` and the business-case placeholder (§3.1). Recommend treating this as an accepted, out-of-scope gap for Story #724 — pre-project ideation is outside `project-lifecycle/`'s mandate — but note it in the Design doc rather than silently omitting it. |
| Initiation → Planning | `01-initiation/README.md` "Phase Transition Criteria" (8-item checklist) | No persisted handoff record; checklist is descriptive text only |
| Planning → Execution | `02-planning/README.md` "Phase Transition Criteria" (8-item checklist) | Same as above; also planning itself has 5 placeholder/phantom subdirectories (§3.1, §3.2) that weaken what's actually available to hand off |
| Execution → Monitoring & Control | Implicit (parallel lane per §2.2) | Not a true handoff since it's concurrent; no gap to remediate |
| Execution → Delivery/Closure | `03-execution/README.md` "Phase Transition Criteria" (8-item checklist) | Same handoff-record gap; compounded by **all four** execution subdirectories being placeholder stubs (§3.1) |
| Closure → Value Realization | `05-closure/README.md` "Final Verification Checklist" | Benefits/outcome assets exist (§5) but are not cross-linked from the closure phase's own (stub) subdirectories |

### 4.2 Cross-Reference to Prior Gap Analysis (#771)
The Epic 0 scenario walkthroughs ([771-value-flow-scenario-walkthroughs.md](771-value-flow-scenario-walkthroughs.md)) flagged several gaps relevant to Epic 1. Status check:
- ✅ **"Post-implementation review"** (flagged for Epic 1) — resolved by Story #721's implementation (`templates/universal/post-implementation-review-template.md`)
- ✅ **"Agile benefits tracker"** (flagged for Epic 1) — resolved by Story #721 (`templates/universal/benefits-register-lightweight.md`)
- ⚠️ Remaining gaps from #771 (regulatory checklist, audit log, steering committee ToR/presentation, stage-gate review) belong to Epics 4/5/6 — out of scope for #724/#725.

---

## 5. Value Realization Stage — Existing Assets to Reference (Not Duplicate)

Stories #721–#723 (already closed) built the following, which the Value Realization stage of the new value stream map must **link to, not duplicate**:

| Asset | Path | Story |
|---|---|---|
| Benefits Realization Framework (enterprise) | `business-stakeholder-suite/financial-governance/benefit-realization-framework.md` | #721 |
| Benefits Register (lightweight/agile) | `templates/universal/benefits-register-lightweight.md` | #721 |
| Post-Implementation Review Template | `templates/universal/post-implementation-review-template.md` | #721 |
| KPI Mapping Template (4-level hierarchy) | `project-lifecycle/04-monitoring-control/progress-tracking/kpi-mapping-template.md` | #722 |
| Value Delivery Dashboard | `project-lifecycle/04-monitoring-control/progress-tracking/value-delivery-dashboard.md` | #723 |

---

## 6. Waste Identification — Existing Asset to Reference

Story #724's acceptance criteria require "waste identification guidance." A comprehensive Lean/Six Sigma waste-identification framework already exists at `business-stakeholder-suite/financial-governance/value-stream-analysis.md` (8 wastes, current/future-state mapping, DMAIC). This is generic/cross-industry, not lifecycle-phase-specific.

**Recommendation:** Reference this file for the general Lean toolkit rather than duplicating it. The new value stream document should add only a short, `project-lifecycle/`-specific section (e.g., redundant status reports across phases, duplicate stakeholder registers, over-approval chains at phase gates) and link out to `value-stream-analysis.md` for the full methodology.

---

## 7. Recommendations for Design Task (#793)

1. Visualize the 6-stage flow (Concept → Initiation → Planning → Execution → Delivery → Value Realization) with Monitoring & Control as a parallel swimlane spanning Execution/Delivery, per §2.2.
2. Design a lightweight, new **"Stage Handoff Record"** template — the one genuine structural gap identified (§4) — capturing: from-stage, to-stage, transition-criteria items confirmed, sign-off, date, and open items carried forward. Link it from each phase README's existing "Phase Transition Criteria" section rather than replacing that content.
3. Explicitly mark "Concept" as an out-of-scope/accepted gap in the published value stream doc, pointing to `quick-start-kits/methodology-selection-guide.md` as the closest existing entry point.
4. Do not attempt to fill the 15 placeholder stubs or 3 phantom-template READMEs (§3) — that is Epic 4 (Domain Refactor) territory. Story #724 should map to `project-lifecycle/`'s populated content plus canonical `templates/` locations where a phase subdirectory is a stub, and flag the stub/phantom inconsistency as a note for Epic 4/3 rather than remediating it here.
5. Link the Value Realization stage directly to the five existing Story #721–#723 assets (§5); link waste-identification guidance to `value-stream-analysis.md` (§6) rather than duplicating.
6. Cross-check final stage sequencing against `project-lifecycle/README.md`'s existing "Quick Start Workflows" table to ensure consistency with already-published guidance.

**No blockers for Task #793 (Design).**
