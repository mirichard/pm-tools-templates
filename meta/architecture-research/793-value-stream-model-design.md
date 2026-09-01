# Task #793: Value Stream Model & Integration Points Design

**Story:** #724 ([Value] – Value Stream Integration – End-to-End Flow Alignment)
**Epic:** #708 (Epic 1: Value Delivery Layer)
**Date:** 2026-09-01
**Status:** Complete
**Closes:** #793
**Builds on:** [792-project-lifecycle-value-stream-mapping.md](792-project-lifecycle-value-stream-mapping.md)

---

## 1. Deliverables & File Placement

Two new artifacts, per the "reference, don't duplicate" principle established across Epic 1/2:

| Artifact | Path | Type |
|---|---|---|
| Value Stream Map | `project-lifecycle/value-stream-map.md` | New — cross-cutting doc, sibling to `project-lifecycle/README.md` |
| Stage Handoff Record (template) | `project-lifecycle/stage-handoff-record-template.md` | New — single reusable template, not phase-specific |

Both are markdown-first, GitHub-renderable, tooling-free, consistent with repo conventions. No existing file is duplicated; both link out to existing phase READMEs and Story #721–#723 assets (per §5 below).

`project-lifecycle/README.md` gets one new line under "🔗 Integration with Other Sections" pointing to the value stream map (Implementation task, not a new design decision).

---

## 2. Value Stream Diagram

ASCII flow (matches the style already used in [768-value-delivery-flow-model.md](768-value-delivery-flow-model.md); avoids depending on Mermaid rendering support):

```
CONCEPT          INITIATION        PLANNING          EXECUTION         DELIVERY          VALUE REALIZATION
(pre-project)    01-initiation/    02-planning/      03-execution/     (execution        05-closure/ +
                                                                        phase 3 +         post-closure
                                                                        05-closure/       assets
                                                                        project-closure)
   │                  │                 │                 │                 │                  │
   │  [Gap — see §4]  │                 │                 │                 │                  │
   └───────HR────────►└───────HR───────►└───────HR───────►└───────HR───────►└────────HR────────►

                                    ┌─────────────────────────────────────────────┐
                                    │   MONITORING & CONTROL (parallel lane)       │
                                    │   04-monitoring-control/ — spans Execution   │
                                    │   through Delivery, continuously            │
                                    └─────────────────────────────────────────────┘

HR = Stage Handoff Record (new template, §3)
```

**Design notes:**
- Monitoring & Control is drawn as a parallel band beneath Execution→Delivery, not a 7th linear box — confirmed in research (#792 §2.2).
- Each `HR` arrow is a Stage Handoff Record checkpoint — the one genuinely new artifact this story introduces.
- Concept has no incoming arrow from a prior stage (pre-project); it is visually marked as a gap with a callout, not silently omitted (per #792 §4.1 and §7.3).

---

## 3. Stage Handoff Record — Field Specification

A single reusable template (not duplicated per-phase). One instance is filled out at each of the 5 transitions.

```markdown
# Stage Handoff Record

**From Stage:** [Concept / Initiation / Planning / Execution / Delivery]
**To Stage:** [Initiation / Planning / Execution / Delivery / Value Realization]
**Date:** [YYYY-MM-DD]
**Prepared By:** [Name/Role]
**Accepted By:** [Name/Role]

## Transition Criteria Confirmed
See the outgoing phase's "Phase Transition Criteria" checklist:
[01-initiation/README.md#-phase-transition-criteria] (or the relevant phase link)

- [ ] All items on the linked checklist confirmed complete
- [ ] Exceptions documented below (if any)

## Exceptions / Partial Completion
| Item | Status | Reason | Follow-up Owner | Target Date |
|------|--------|--------|-----------------|-------------|
| | | | | |

## Open Items Carried Forward
| Item | Owner | Due Date |
|------|-------|----------|
| | | |

## Sign-off
- **Outgoing stage owner:** ___________________ Date: _______
- **Incoming stage owner:** ___________________ Date: _______
```

**Design rationale:** deliberately thin — it references the existing per-phase checklists rather than re-listing them (avoids the duplication the repo's conventions warn against), and only adds the two things that don't already exist anywhere: a persisted confirmation record and an explicit carry-forward log.

---

## 4. Concept Stage — Explicit Gap Treatment

Per #792 §4.1/§7.3, Concept is out of `project-lifecycle/`'s mandate. Design decision: the value stream map's Concept section will read:

> **Concept** (pre-project ideation) is not covered by `project-lifecycle/`. If you haven't chosen a methodology or framed your idea yet, start with the [Methodology Selection Guide](../quick-start-kits/methodology-selection-guide.md), then return here at Initiation.

This is a one-paragraph callout, not a new template — an accepted scope boundary, documented rather than silently skipped.

---

## 5. Stage-by-Stage Integration Point Table (ready for Implementation)

| Stage | `project-lifecycle/` Source | Key Existing Templates (link, don't copy) | Handoff In | Handoff Out |
|---|---|---|---|---|
| Concept | *(none — see §4)* | `quick-start-kits/methodology-selection-guide.md` | — | Informal; no HR record (pre-project) |
| Initiation | `01-initiation/` | project-charter (3 variants), stakeholder-analysis (3 variants) | — | HR #1 → Planning |
| Planning | `02-planning/` | project-management-plan (3 variants), resource-planning, risk-management, business-requirements | HR #1 | HR #2 → Execution |
| Execution | `03-execution/` (canonical templates live in `templates/`, per #792 §3.1) | Canonical `templates/traditional\|agile\|hybrid/` (execution-phase content); `03-execution/README.md` process framework | HR #2 | HR #3 → Delivery |
| Delivery | `03-execution/README.md` Phase 3 "Delivery & Handoff"; `05-closure/project-closure/` | Closure sign-off content (currently placeholder — link to `templates/` canonical closure templates) | HR #3 | HR #4 → Value Realization |
| Value Realization | `05-closure/` + Story #721–#723 assets | `business-stakeholder-suite/financial-governance/benefit-realization-framework.md`; `templates/universal/benefits-register-lightweight.md`; `templates/universal/post-implementation-review-template.md`; `project-lifecycle/04-monitoring-control/progress-tracking/kpi-mapping-template.md`; `.../value-delivery-dashboard.md` | HR #4 | — (terminal stage) |

---

## 6. Waste Identification Section — Design

Per #792 §6, a short (~15-line) subsection in the value stream map, titled "Spotting Non-Value-Adding Activity," scoped to `project-lifecycle/`-specific patterns only:
- Redundant status reports duplicated across phases
- Duplicate stakeholder registers re-created instead of updated
- Over-approval chains at phase gates (more sign-offs than the transition criteria require)

Closes with: *"For a full Lean waste-identification toolkit (8 wastes, current/future-state mapping, DMAIC), see [value-stream-analysis.md](../business-stakeholder-suite/financial-governance/value-stream-analysis.md)."*

---

## 7. Cross-Check Against Published Guidance

`project-lifecycle/README.md`'s existing "Quick Start Workflows" (New PM / Experienced PM / Agile Transformation) were checked against the 6-stage sequence — no conflicts. The value stream map's stage order and phase names match those workflows exactly, so no changes to `README.md`'s existing workflow tables are needed, only the one new cross-reference link noted in §1.

---

## Recommendations for Implementation Task (#794)

1. Create `project-lifecycle/value-stream-map.md` using the diagram (§2), integration table (§5), Concept callout (§4), and waste-identification subsection (§6).
2. Create `project-lifecycle/stage-handoff-record-template.md` using the field spec in §3.
3. Add one cross-reference line in `project-lifecycle/README.md` under "Integration with Other Sections."
4. Verify every linked path resolves (methodology-selection-guide.md, the five Story #721–#723 assets, value-stream-analysis.md) before committing.

**No blockers for Task #794 (Implementation).**
