# Project Lifecycle Value Stream Map

**End-to-end flow from concept to realized value, linking existing `project-lifecycle/` content at each stage**

This map complements the phase-by-phase [README](README.md) with a single, cross-cutting view of how value flows through the entire lifecycle, where handoffs happen, and where to look for waste. It links to existing templates rather than duplicating them — see each phase's own README for the full template list.

---

## The Value Stream

```
CONCEPT          INITIATION        PLANNING          EXECUTION         DELIVERY          VALUE REALIZATION
(pre-project)    01-initiation/    02-planning/      03-execution/     (execution        05-closure/ +
                                                                        phase 3 +         post-closure
                                                                        05-closure/       assets
                                                                        project-closure)
   │                  │                 │                 │                 │                  │
   │  [Gap — see       │                 │                 │                 │                  │
   │   Concept below]  │                 │                 │                 │                  │
   └───────HR────────►└───────HR───────►└───────HR───────►└───────HR───────►└────────HR────────►

                                    ┌─────────────────────────────────────────────┐
                                    │   MONITORING & CONTROL (parallel lane)       │
                                    │   04-monitoring-control/ — spans Execution   │
                                    │   through Delivery, continuously             │
                                    └─────────────────────────────────────────────┘

HR = Stage Handoff Record — see [stage-handoff-record-template.md](stage-handoff-record-template.md)
```

Monitoring & Control is not a linear stage — it runs in parallel with Execution and Delivery, as [04-monitoring-control/README.md](04-monitoring-control/README.md) itself describes.

---

## Concept

**Concept** (pre-project ideation) is not covered by `project-lifecycle/`. If you haven't chosen a methodology or framed your idea yet, start with the [Methodology Selection Guide](../quick-start-kits/methodology-selection-guide.md), then return here at Initiation.

---

## Stage-by-Stage Integration Points

| Stage | Source | Key Existing Templates | Handoff In | Handoff Out |
|---|---|---|---|---|
| Concept | *(none — see above)* | [Methodology Selection Guide](../quick-start-kits/methodology-selection-guide.md) | — | Informal; no handoff record (pre-project) |
| Initiation | [01-initiation/](01-initiation/) | [Project Charter](01-initiation/project-charter/), [Stakeholder Analysis](01-initiation/stakeholder-analysis/) | — | Handoff Record → Planning |
| Planning | [02-planning/](02-planning/) | [Project Management Plan](02-planning/project-management-plan/), [Resource Planning](02-planning/resource-planning/), [Risk Management](02-planning/risk-management/), [Business Requirements](02-planning/business-requirements/) | Handoff Record | Handoff Record → Execution |
| Execution | [03-execution/](03-execution/) | Canonical execution templates in `templates/traditional/`, `templates/agile/`, `templates/hybrid/`; process framework in [03-execution/README.md](03-execution/README.md) | Handoff Record | Handoff Record → Delivery |
| Delivery | [03-execution/README.md](03-execution/README.md) "Phase 3: Delivery & Handoff"; [05-closure/project-closure/](05-closure/project-closure/) | Closure sign-off content — see canonical closure templates in `templates/` | Handoff Record | Handoff Record → Value Realization |
| Value Realization | [05-closure/](05-closure/) + Value Delivery Layer assets | [Benefits Realization Framework](../business-stakeholder-suite/financial-governance/benefit-realization-framework.md), [Benefits Register (Lightweight)](../templates/universal/benefits-register-lightweight.md), [Post-Implementation Review Template](../templates/universal/post-implementation-review-template.md), [KPI Mapping Template](04-monitoring-control/progress-tracking/kpi-mapping-template.md), [Value Delivery Dashboard](04-monitoring-control/progress-tracking/value-delivery-dashboard.md) | Handoff Record | — (terminal stage) |

---

## Stage Handoffs

Each transition between stages already has a "Phase Transition Criteria" checklist in the outgoing phase's README (e.g. [01-initiation/README.md](01-initiation/README.md#-phase-transition-criteria)). Those checklists describe *what* must be true — but nothing persists *evidence* that it was confirmed, by whom, or what was carried forward.

Use the [Stage Handoff Record](stage-handoff-record-template.md) template at each transition to close that gap. It references the relevant phase's existing checklist rather than repeating it, and adds only a sign-off and an open-items log.

---

## Spotting Non-Value-Adding Activity

A few `project-lifecycle/`-specific patterns worth watching for:
- **Redundant status reports** duplicated across phases instead of one report evolving forward
- **Duplicate stakeholder registers** re-created at each phase instead of the Initiation-phase register being updated
- **Over-approval chains** at phase gates — more sign-offs than the phase's own Transition Criteria actually requires

For a full Lean waste-identification toolkit (the 8 wastes, current/future-state mapping, DMAIC), see [value-stream-analysis.md](../business-stakeholder-suite/financial-governance/value-stream-analysis.md).

---

*Part of Epic 1: Value Delivery Layer. See also the phase-by-phase [project-lifecycle/README.md](README.md).*
