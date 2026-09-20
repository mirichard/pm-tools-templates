# Product Thinking Framework

Story #751 · Epic #714

## When to use

Use when an initiative may require continuing ownership, investment and learning beyond a bounded delivery, or when a project operates inside an existing product. Choose the unit of decision explicitly: a whole product, an individual project, or a release/increment.

## When not to use

Do not relabel a purely bounded project as a product to avoid closure, contractual commitments or governance. For a project-only organization with no continuing product responsibility, retain project mode and identify the receiving operational owner. Product mode is not a synonym for agile, and project mode is not a synonym for waterfall.

## Compare delivery modes

| Dimension | Project mode | Product mode |
|---|---|---|
| Purpose | Deliver a bounded change with agreed acceptance and a defined end. | Sustain and improve outcomes for users over a continuing lifecycle. |
| Accountability | Sponsor and PM authorize and manage delivery; receiving owners accept residual responsibilities. | Product owner/leader holds continuing outcome and prioritization accountability with funded delivery/operational partners. |
| Planning and funding | Baseline scope, schedule, cost and acceptance; manage authorized changes. | Review investment horizons, outcome hypotheses and a changing backlog; decide continue, change or retire. |
| Evidence | Acceptance, delivery performance, handover and later benefits verification. | User feedback, adoption/outcomes, service health and learning, alongside delivery/financial controls. |
| Strength | Clear boundaries, commitments and handover accountability. | Continuous learning and prioritization as user needs change. |
| Limitation | The team may dissolve before outcomes mature unless ownership is transferred explicitly. | Continuing work can lose investment discipline without funding reviews, outcomes and retirement decisions. |

Both modes require risk management, quality, explicit ownership and evidence. A project can iterate; a product can contain fixed dates or regulated gates. Methodology and governance tier remain separate choices.

## Decision guide

1. Identify whether the selected unit has a defined completion/acceptance boundary or continuing user outcomes and evolution.
2. Identify the accountable owner and approved funding after that boundary. Missing ownership/funding is an unresolved readiness gap, not proof that project mode is sufficient.
3. Identify whether a bounded delivery sits within an existing product, or a bounded project is creating a product that must continue after handover.
4. Record the selected mode, rationale, decision authority, evidence, review date and unresolved actions in the existing charter/plan or product vision. Review when scope, ownership, funding or intended lifetime changes.

| Situation | Mode value | Decision and recommended assets |
|---|---|---|
| Bounded delivery with accepted handover/end; no continuing product mandate for this team | `project` | Use normal phase recommendations; record receiving ownership and later benefits review. |
| Continuing outcome responsibility with agreed ownership/investment | `product` | Use product vision, backlog, feedback and value KPIs; retain required controls and review investment. |
| Finite migration/replacement within a continuing product | `project_within_product` | Keep the project's baseline and gates; product owner accepts the increment and retains the longer-term backlog. |
| Time-limited initiative launches a product that will continue | `product_within_project` | Project sponsor authorizes delivery; secure product/operational ownership and funding before project closure. |
| Lifetime, ownership or decision unit is unclear | `unsure` | Use this guide and assign a decision owner/date; do not claim product readiness. Existing phase/risk recommendations remain. |

### Worked mixed-mode contexts

**Project within product:** a customer-service product replaces its billing interface in a six-month project. The PM controls migration scope and acceptance; the product owner sets the outcome hypothesis and prioritizes later improvements. Gate evidence covers migration/rollback and accepted operations. Project completion ends the migration team’s mandate, not the product backlog.

**Product within project:** a time-limited public-service initiative launches a continuing booking service. The sponsor owns the launch commitment; a named service/product owner must accept continuing support, outcome measurement and funded improvement. If that ownership is missing, record and escalate the handover gap rather than treating launch as sufficient closure.

A one-time research report can remain project mode. A recurring non-software service can use product mode if it has continuing outcome ownership and review authority. These examples guide decisions, not automatic industry-based classification.

## Existing artifact adaptations

| Phase | Existing artifact | Product-mode annotation |
|---|---|---|
| Starting | [Charter](../../domains/planning/project-lifecycle/01-initiation/project-charter/traditional-project-charter-template.md#product-mode-applicability) | Bounded authorization, continuing outcome owner and funding authority. |
| Planning | [Management plan](../../domains/delivery/project-lifecycle/02-planning/project-management-plan/traditional-project-management-plan-template.md#product-mode-applicability) | Separate the project baseline from product backlog and investment horizon. |
| In progress | [Status report](../../domains/uncertainty/project-lifecycle/04-monitoring-control/progress-tracking/status-report-template.md#product-mode-applicability) | Delivery commitments plus outcome evidence, feedback and next decisions. |
| Closing | [Closure report](../../domains/delivery/templates/traditional/Traditional/Process_Groups/Closing/project_closure_report_template.md#product-mode-applicability) | Close bounded work; retain accepted support, backlog, funding and benefits ownership. |

Reuse the [product vision](../../role-based-toolkits/product-owner/product-vision-template.md), [product backlog](../../domains/uncertainty/role-based-toolkits/product-owner/backlog-management-template.md), [value KPI mapping](../../project-lifecycle/04-monitoring-control/progress-tracking/kpi-mapping-template.md) and [feedback architecture](feedback-loop-architecture.md). Product mode does not require opening a project for every routine change. The phase artifacts apply when a bounded initiative/increment needs their decisions and approvals.

For handover use [operational continuity](operational-continuity-planning.md); for flow and outcomes use [delivery metrics](delivery-metrics-framework.md). Release pipeline/cadence implementation remains the separate #752 scope.

## Decision-engine integration

The [template decision tree](../decision-engine/template-decision-tree.md#delivery-mode) now includes this optional overlay. The existing [recommender](../../scripts/template-recommender.py) accepts `delivery_mode` inside `project_context` or a flat context object. Its interactive mode asks the original seven questions plus the optional mode question, defaulting to `unsure`.

```json
{
  "profile_version": "1.0",
  "project_context": {
    "size": "small",
    "methodology": "traditional",
    "risk_profile": "regulatory",
    "team_size": "small",
    "industry": "general",
    "phase": "closing",
    "pm_experience": "intermediate",
    "delivery_mode": "product_within_project"
  }
}
```

Run `python scripts/template-recommender.py --json profile.json` from the repository root. Output paths are repository-relative. The selected mode adds rationale and maintained assets; it does not remove phase, risk, industry or experience-based recommendations. Mixed modes add the same supporting assets but explain their different responsibility boundaries. A closing product/mixed-mode profile also recommends the existing operational transition framework.

For compatibility, an older profile without `delivery_mode` retains its previous output. Explicit `project` adds project rationale; explicit `unsure` adds the decision guide without asserting product readiness. An invalid mode is rejected. This is a CLI/documentation extension to the v1 context; it does not claim browser-UI integration or change the governance selector’s seven dimensions.

## Review and acceptance

The comparison and decision table address characteristics, tradeoffs and choice; worked contexts address both mixed arrangements; the CLI and tree supply mode-aware recommendations; four existing lifecycle artifacts carry applicability annotations; use/exclusion guidance is explicit. Verify the implementation and merged tests before marking the six story criteria accepted.
