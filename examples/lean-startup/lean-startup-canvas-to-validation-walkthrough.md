# Lean Startup Walkthrough: Canvas to Validation

**Project**: Neighborhood Pickup Grocery (fictional)  
**Example Type**: Documented worked example with illustrative data  
**Prepared By**: Template maintainers  
**Last Updated**: 2026-10-08  
**Related Templates**: [Lean Canvas Template](../../methodology-frameworks/emerging-methods/lean-startup/lean-canvas-template.md), [Hypothesis-Driven Planning Template](../../methodology-frameworks/emerging-methods/lean-startup/hypothesis-driven-planning.md), [MVP Planning Template](../../methodology-frameworks/emerging-methods/lean-startup/mvp-planning-template.md), [Experiment Design Template](../../methodology-frameworks/emerging-methods/lean-startup/experiment-design-template.md), [Customer Validation Framework](../../methodology-frameworks/emerging-methods/lean-startup/customer-validation-framework.md)

> This walkthrough carries a single scenario from canvas assumptions to a customer-validation decision. All names, numbers, and interview quotes are fictional and exist only to demonstrate template flow. See [Limitations](#limitations).

## Scenario

Neighborhood Pickup Grocery is a fictional startup concept: customers order online from local stores and pick up in a consolidated neighborhood point during a two-hour evening window.

The team has three concerns:

- Are convenience-focused shoppers willing to switch from same-day delivery?
- Can one pickup window reduce unit costs enough to support margin?
- Will customers tolerate ordering cutoff times?

## Journey Map to Existing Templates

| Step | Goal | Template used | Primary output |
| --- | --- | --- | --- |
| 1 | Model assumptions | [Lean Canvas Template](../../methodology-frameworks/emerging-methods/lean-startup/lean-canvas-template.md) | Top risks and value assumptions |
| 2 | Prioritize uncertainty | [Hypothesis-Driven Planning Template](../../methodology-frameworks/emerging-methods/lean-startup/hypothesis-driven-planning.md) | Testable hypothesis backlog |
| 3 | Scope first release | [MVP Planning Template](../../methodology-frameworks/emerging-methods/lean-startup/mvp-planning-template.md) | MVP boundary and success criteria |
| 4 | Design test method | [Experiment Design Template](../../methodology-frameworks/emerging-methods/lean-startup/experiment-design-template.md) | Metrics, thresholds, and decision rule |
| 5 | Validate with users | [Customer Validation Framework](../../methodology-frameworks/emerging-methods/lean-startup/customer-validation-framework.md) | Continue/pivot recommendation |

---

## Step 1: Lean Canvas Summary

The team captures an initial business model snapshot:

- **Problem**: Delivery fees are high, and delivery windows are unreliable for evening commuters.
- **Customer segments**: Apartment households within 3 miles of partner stores.
- **Unique value proposition**: Lower fee than delivery, faster pickup than in-store shopping.
- **Channels**: Mobile ads near transit hubs; referral credits.
- **Revenue/cost assumptions**: Small order fee plus retail margin share, constrained by pickup staffing.

**Key risk assumptions identified**:

1. At least 35% of surveyed target customers will choose pickup over delivery when fee savings are shown.
2. Pickup operations can support a 20-minute average order handoff time during peak window.

---

## Step 2: Hypothesis Backlog

Using the hypothesis template, assumptions become testable statements:

### H1: Convenience Preference

- **Hypothesis**: If commuters are offered pickup with a fee at least 40% lower than delivery, at least 35% will choose pickup in a realistic checkout simulation.
- **Evidence type**: Simulated checkout choice test.
- **Risk level**: High.

### H2: Pickup Window Acceptance

- **Hypothesis**: At least 70% of interested users accept a fixed 6-8 PM pickup window.
- **Evidence type**: Interview + mock booking flow.
- **Risk level**: Medium.

### H3: Operational Throughput

- **Hypothesis**: One pickup point can process 18 orders/hour with <= 20-minute wait.
- **Evidence type**: Pilot operations test.
- **Risk level**: High.

**Prioritization decision**: Test H1 and H2 before building advanced logistics features.

---

## Step 3: MVP Scope

The MVP template narrows implementation scope to learning-critical features:

### In Scope

- Basic catalog from one partner store
- Checkout with pickup-slot selection
- SMS confirmation and pickup code
- Manual order packing workflow for operations

### Out of Scope (for MVP)

- Multi-store bundling
- Route optimization
- Loyalty tiers
- Real-time substitutions

### MVP Success Criteria

- >= 35% pickup preference in checkout simulation
- >= 70% acceptance of fixed pickup window
- >= 15 completed pilot orders with average handoff <= 20 minutes

---

## Step 4: Experiment Design

The experiment template defines method and thresholds:

- **Sample**: 40 target users from two apartment complexes
- **Duration**: 2 weeks
- **Experiment types**:
  - Simulated checkout A/B (pickup fee vs delivery fee framing)
  - Structured interviews on pickup window tolerance
  - Operational dry-run with staff and pilot users
- **Decision rule**:
  - Continue if H1 and H2 pass and H3 is within 10% of target
  - Pivot pricing model if H1 fails
  - Pivot operating window or staffing model if H3 fails materially

---

## Step 5: Customer Validation Outcome

Customer validation summary (illustrative):

- **H1 result**: 16/40 users (40%) preferred pickup when shown fee comparison -> pass
- **H2 result**: 30/40 users (75%) accepted fixed 6-8 PM pickup -> pass
- **H3 result**: Pilot averaged 22 minutes handoff -> near miss

### Recommendation

- **Persevere on demand hypothesis** (customer interest is above threshold).
- **Pivot operational model** before scaling (add pre-batched orders and dedicated handoff lane).
- Enter next [Build-Measure-Learn Cycle](../../methodology-frameworks/emerging-methods/lean-startup/build-measure-learn-cycle.md) with throughput as primary learning objective.

---

## Decision Handoff Outputs

This walkthrough produces artifacts that can be carried into governance and planning:

- Canvas snapshot with explicit risk assumptions
- Ranked hypothesis list with pass/fail criteria
- MVP scope boundary with exclusions
- Experiment protocol with thresholds
- Validation summary with continue/pivot rationale

For onboarding context, pair this example with the [Startup Project Kit](../../quick-start-kits/startup-project-kit/README.md).

## Limitations

- All organizations, participants, and metrics are fictional.
- This document demonstrates template navigation and output flow, not market truth.
- One example cannot prove outcome quality across industries or maturity levels.
- Teams should adapt thresholds, risk tolerances, and evidence quality standards to their context.
