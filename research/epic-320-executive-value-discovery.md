# Executive value reporting discovery for #320

## Decision brief

**Recommendation:** Select one bounded outcome: help an executive sponsor decide whether to continue, correct, or escalate a benefit-realization plan when a measured benefit is materially behind its approved checkpoint forecast. Use a short executive decision brief backed by the existing universal Benefits Review and Variance Analysis templates and their synthetic, calculation-checked example. Keep the report to one initiative/benefit at a time; do not build a dashboard, ROI platform, or financial-system integration.

**Evidence:** The current templates already define benefit owners, source readiness, baseline/target/actual, forecast, confidence, variance, disbenefits, decision and action records. The review process defines data-owner validation and escalation. A machine-readable example is checked by `scripts/validate-sprint-10.mjs`. The missing bounded slice is a concise executive-facing decision view that brings these inputs together without implying causal proof or portfolio comparability.

**Principal uncertainty:** No demand evidence or owner-approved use case identifies the executive’s preferred checkpoint, materiality threshold, or source system. External benchmark sources could not be retrieved in this environment, so this recommendation relies on repository evidence only.

**Owner decision needed:** @mirichard should confirm that a benefits-shortfall decision is the first outcome, name a benefits/data owner, and approve or revise the candidate scope before backlog promotion. This discovery does not authorize implementation, schedule, staffing, or acceptance.

## Decision options considered

| Decision supported | Decision-maker and question | Evidence and cadence | Action enabled | Assessment |
|---|---|---|---|---|
| Correct a benefit shortfall | Executive sponsor: continue, correct, extend, or stop realization actions? | Benefit owner’s approved baseline, target, expected checkpoint value, validated actual, forecast, source/as-of date, confidence, disbenefits; at the agreed checkpoint and on material adverse triggers | Assign corrective action, resources, or escalation | **Recommended.** Directly supported by the existing review process, variance rules, and example. |
| Continue or reprioritize an initiative | Sponsor/portfolio authority: is the initiative still worth continuing against alternatives? | The above plus approved outcomes, delivery status, complete investment costs, alternatives, constraints, and attributable benefits; decision cadence set by governance | Continue, change scope, or stop | Defer as broader: comparative alternatives and comparable cost/benefit boundaries are not established by the current example. |
| Resolve a funding tradeoff | Portfolio/CFO: which initiative receives constrained funding? | Comparable, source-validated forecasts, full cost boundaries, dependencies, risk, confidence, and strategic constraints for multiple initiatives; portfolio review cadence | Reallocate funding or sequence work | Defer: aggregation/comparability and decision authority are not evidenced; adding a portfolio score would create unsupported precision. |

## Existing asset and capability matrix

“Canonical” means the source to use or update, not proof that all content is validated for a particular organization. Generated files, examples, and draft integrations are not treated as production data.

| Asset / evidence | Existing support | Gap or limitation for the selected outcome | Dependency / boundary | Disposition |
|---|---|---|---|---|
| [Benefits Review Template](../templates/universal/benefits-review-template.md) | Captures decision owner, benefits owner, source readiness, benefit assessment, confidence, actions and decision (see “Review control” through “Actions and escalation”). | Does not provide a one-page executive synthesis of the decision and evidence. | Uses the variance template and approved benefit/source records. | **Retain; selectively revise** only if the owner confirms the executive view is missing. |
| [Benefits Variance Analysis Template](../templates/universal/benefits-variance-analysis-template.md) | Defines higher/lower-is-better formulas, expected-vs-actual variance, thresholds, missing-data handling, source/as-of date, disbenefits and integrity checks. | No separate tested calculator; zero denominator, incompatible units, or missing evidence must remain not measurable. | Approved expected curve and data-owner validation; preserve original baseline. | **Retain** as the calculation contract; do not create a second formula source. |
| [Benefits Review Process](../docs/benefits/benefits-review-process.md) | Assigns sponsor, benefits, operational and finance/data responsibilities; defines required inputs, review cadence, validation, escalation and history retention. | Organization-specific named owners and reporting frequency remain to be supplied. | Sponsor approval and benefits/data owners; no new systems required. | **Retain** as the operating control. |
| [Day-60 synthetic example](../examples/benefits-review/service-centre-day-60-review.md) and [fixture](../examples/benefits-review/service-centre-day-60.json) | Demonstrates traceable synthetic source labels, two lower-is-better calculations, variance and an escalation decision. | It is explicitly synthetic; it is not operational evidence or demand validation. | `scripts/validate-sprint-10.mjs` checks its calculations/status and the related templates. | **Retain; extend** only for forecast, missing-data and adverse-case coverage if candidate A is approved. |
| [Benefits register](../templates/universal/benefits-register-lightweight.md) and [program benefits plan](../role-based-toolkits/program-manager/benefits-realization/benefits-realization-plan.md) | Record benefit IDs, owners, baseline/target, measurement, data sources, validation and dependencies. | Rich program planning is more than the selected executive decision requires. | Benefit identifiers and approval history feed the review. | **Retain** as upstream guidance; do not duplicate it inside #320. |
| [Executive Report Templates](../domains/stakeholder/business-stakeholder-suite/executive-dashboards/Word/Executive-Report-Templates.md) | Canonical written report guidance asks for reporting period, source, baseline, owner and calculation; unknown values are not zero. | Broad report collection; not specific to a benefit-shortfall decision. Legacy `business-stakeholder-suite/.../Word/Executive-Report-Templates.md` is a navigation pointer. | Use the canonical domain file; generated site downloads are not edit targets. | **Retain; adapt by reference** rather than copy. |
| [KPI Mapping Template](../project-lifecycle/04-monitoring-control/progress-tracking/kpi-mapping-template.md) | Maps strategic/program/project/execution KPI levels and points to benefit assets. | Many possible KPIs; mapping alone does not validate benefit attribution or a decision. | Use only to trace the selected outcome to existing project measures. | **Retain as optional cross-reference; defer broad KPI expansion.** |
| [ROI Tracking Dashboard](../business-stakeholder-suite/financial-governance/roi-tracking-dashboard.md) and [ROI automation setup guide](../business-stakeholder-suite/executive-dashboards/financial-integration/ROI_Setup_Guide.md) | Describe portfolio ROI, forecasts, scenarios, data integration, and executive views. | Imply live finance/ERP/API, macro, alert and deployment assumptions not demonstrated by the selected use case; dashboard contains sample/placeholder benchmarks. | Significant system access, security, finance definitions and support ownership would be required. | **Defer.** Do not revive #339/#340 or treat the historical guide as validated deployment capability. |
| [Power BI sample data and measures](../business-stakeholder-suite/executive-dashboards/powerbi-integration/sample-data-and-measures.md) | Illustrates a static synthetic dashboard workflow and sample measures. | Example data are not current, real or verified; formulas and dashboard health are outside this bounded benefit decision. | Optional future reporting surface only after data ownership and metric contract are agreed. | **Defer** connection or dashboard changes. |
| AI dashboard work (#1329) | None in this discovery scope. | Restoration is explicitly paused. | Requires its separate restoration gates and owner decision. | **Keep paused; exclude.** |
| `docs/site/dist/**`, mirrors and domain-navigation copies | Distribute or navigate to canonical materials. | Copies are not independent maintained sources; editing them would create drift. | Follow catalog/canonical paths and existing generation rules. | **Retain as generated/navigation artifacts; do not edit for this outcome.** |

## Ownership and relationship to #341 and #47

- **#320** remains the parent for practical executive decision support. Its reporting slice presents a decision using existing benefits evidence; it does not own all program management, analytics, or enterprise services.
- **#341** remains the verified child of #320 and owns the ROI/value-tracking investigation. Its current next action—prove traceable inputs and reproducible calculations, then reconcile existing benefits guidance—is the source of the selected measurement contract. This report does not imply the #341 epic is delivered or ready.
- **#47** remains an independent, unscheduled program-management epic. It can inventory program-level benefits assets and uncovered program-user outcomes; it is neither a prerequisite for this one-initiative decision pack nor a second owner for #341’s value-tracking calculation. Reference/related links are preferable to changing hierarchy.
- No new primary parent is proposed. Existing software security and maintenance obligations continue. #339/#340 remain retired; #1329 remains paused.

## Measurement and reporting contract

| Field | Required handling |
|---|---|
| Data and accountable roles | Approved business case/benefit register: Sponsor approves baseline, target, tolerance and expected curve; Benefits Owner maintains the measure and forecast; Operational Owner supplies operating evidence; Finance/data owner validates source, units and calculations; Sponsor or delegated authority makes the decision. Actual names are readiness gates, not assumed. |
| Period, units and refresh | Record comparison period, review checkpoint, evidence “as of” date, source version and refresh date. Compare like-for-like periods and units. For financial measures identify currency, price basis, annualization method, and whether values are nominal or real. Refresh at the organization-approved checkpoint; do not imply live telemetry. |
| Baseline, forecast and actual | Preserve the original approved baseline and any formally approved revised baseline with reference/date. Record the expected value at the review date, actual for that same period, and forecast at the target date separately. Do not silently assume a linear curve. |
| Calculations | For lower-is-better: achievement % = `(baseline − value) / (baseline − target) × 100`. For higher-is-better: `(value − baseline) / (target − baseline) × 100`. Variance points = actual achievement % − approved expected achievement % for that review date. Keep negative achievement when an outcome worsens; do not cap at zero. A zero denominator or incompatible measure is not measurable. |
| Costs and attribution | Do not call outcome movement ROI. Report investment/spend separately unless the approved business case defines a complete, non-overlapping cost boundary and period. Identify overlapping/dependent benefits and count once. Observed change alone cannot establish that project-management practices or a particular intervention caused the change; causal claims require an appropriate evaluation design and evidence. |
| Missing data and uncertainty | Missing/late/unvalidated actuals are `NOT MEASURABLE` (or the approved evidence-quality status), never zero or green. Show source owner, limitation and corrective action; do not include missing values in averages or portfolio totals. Record confidence and sensitivity/range where evidence supports it; otherwise state uncertainty qualitatively rather than fabricate precision. |
| Nonfinancial outcomes and adverse effects | Keep nonfinancial benefits in their own units with an observable indicator, baseline, owner and evidence. Do not monetize without an approved valuation method. Report disbenefits, harm and adverse movement alongside the benefit; no positive metric may offset or conceal them. |
| What the evidence can establish | It can show that a measured outcome differs from an approved baseline/forecast and support a bounded continue/correct/escalate decision. Without causal evidence it cannot establish that the initiative caused the change, predict a realized portfolio ROI, validate market demand, or support revenue/customer-count/certification/SLA claims. |

## Synthetic worked reporting example

> **Entirely synthetic; not customer, finance, or operational data.** Role labels are illustrative, source IDs are invented, and no observed performance or owner approval is claimed.

**Decision:** At a Day-60 checkpoint, should the sponsor continue the realization plan as-is, correct it, or escalate?

| Input | Synthetic value and trace |
|---|---|
| Measure / direction / unit | Annualized avoidable handling cost, lower is better, USD per 12-month equivalent |
| Baseline and baseline period | $500,000; approved hypothetical baseline period Jan–Jun 2026; source `SIM-BCASE-01` |
| Target and target date | $380,000 by 2026-12-31; same scope and annualization basis; `SIM-BCASE-01` |
| Expected checkpoint value | $410,000 at Day 60; hypothetical approved checkpoint curve; `SIM-FORECAST-60` |
| Forecast at target date | $400,000; hypothetical operations/finance forecast at 2026-12-31; `SIM-FORECAST-YE` |
| Actual and reporting period | $440,000 for the synthetic July–August 2026 period; evidence as of / refreshed 2026-08-30; `SIM-FIN-0830` |
| Accountable roles | Benefits Owner: Operations Director (sample); source validation: Finance Controller (sample); decision: Executive Sponsor (sample) |
| Cost boundary | This is an outcome measure, not ROI. Project investment cost is not included or netted. |

**Independent arithmetic check**

- Improvement required from baseline to target: `$500,000 − $380,000 = $120,000`.
- Actual improvement: `$500,000 − $440,000 = $60,000`; actual achievement = `$60,000 / $120,000 × 100 = 50%`.
- Expected checkpoint improvement: `$500,000 − $410,000 = $90,000`; expected achievement = `$90,000 / $120,000 × 100 = 75%`.
- Variance: `50% − 75% = −25 percentage points`; under the repository’s default variance thresholds this is **RED** (< −15 points).
- Target-date forecast achievement: `($500,000 − $400,000) / $120,000 × 100 = 83.33%`; forecast remains `$20,000` above the target cost. This is a forecast, not an actual or a causal claim.

**Decision interpretation:** Escalate to the sponsor under the existing process; ask the Benefits Owner to validate drivers and present a corrective option with owner, cost, risk and due date. Do not approve new funding from this example alone.

**Missing-data case:** If `SIM-FIN-0830` is absent, stale, or not validated, actual achievement and variance are `NOT MEASURABLE`; show the last valid source date, owner and action to obtain evidence. Do not substitute zero, label the benefit green, or include it in a portfolio average.

**Adverse-outcome case:** If actual cost is `$530,000` instead, achievement is `($500,000 − $530,000) / $120,000 × 100 = −25%`; variance against expected 75% is `−100 percentage points`. Preserve the negative result and report it as adverse/RED (or a stricter material-harm trigger); do not clamp it or offset it with another benefit.

The inputs above intentionally have no real source records. A real report must replace every `SIM-*` record with a versioned source and owner validation. No evidence here supports attribution to the project, PM practices, or a particular intervention.

## Delivery candidates (drafts only)

Effort ranges below are rough discovery sizing hypotheses for comparison, **not estimates, confirmed capacity, owner commitments, or schedule**. Confirm scope and estimate with the assigned owner before backlog readiness. Each candidate is independently testable.

### Candidate A — Executive benefits variance decision pack (recommended first)

- **Outcome:** An executive sponsor can decide to continue, correct, or escalate one initiative’s benefit-realization action from traceable, reproducible evidence.
- **Scope:** Adapt the existing Benefits Review/Variance templates and synthetic fixture for a concise decision view; show baseline, expected checkpoint, actual, target-date forecast, source/as-of date, owner, confidence, limitations, adverse outcome, and missing-data behavior.
- **Exclusions:** New dashboard/software, live financial connections, telemetry, portfolio scoring, ROI/causal claims, AI restoration, SSO/certification, deployment/support commitments, release or sprint selection.
- **Acceptance criteria:** Every value has a unit, period, source/version, as-of date and accountable role; formula and threshold match the existing variance contract; synthetic normal, missing, and adverse cases are independently reproducible; decision and corrective action are explicit; no unsupported enterprise success metrics are used.
- **Validation:** Review against the existing calculation validator and documented formulas; recompute fixture by hand or independent calculation; run repository link/author checks; owner reviews decision usefulness and source contract.
- **Dependencies:** Existing #341 benefits/value scope and templates; actual source owner and reporting decision owner must be named before using real data. #47 is related, not a blocking dependency.
- **Indicative effort:** 1–2 person-days, unvalidated.
- **Readiness gates:** Owner confirms this is the selected executive decision; approves report audience/cadence and materiality thresholds; names benefits/data roles; confirms a real use case/source without sharing sensitive data.

### Candidate B — Deterministic benefit calculation fixture

- **Outcome:** A benefits owner can validate supported higher/lower benefit calculations, variance, threshold, and data-quality edge cases consistently.
- **Scope:** Extend the existing synthetic fixture and its current validator for zero denominator, unit mismatch, missing value, and adverse actuals; no user interface or live inputs.
- **Exclusions:** Replacing the canonical templates, adding dependencies, connecting finance systems, or claiming the fixture is a production calculator.
- **Acceptance criteria:** Tests cover both formula directions, negative achievement, missing/zero-denominator handling, and status thresholds; expected outputs are documented and independently recomputable; no missing value is treated as zero.
- **Validation:** Existing `scripts/validate-sprint-10.mjs` plus focused automated cases and manual arithmetic review.
- **Dependencies:** Owner-approved formula/status semantics in the existing variance analysis template; candidate A only if the executive decision contract requires new edge cases.
- **Indicative effort:** 1–3 person-days, unvalidated.
- **Readiness gates:** Confirm the current validator’s uncovered cases cause an actual user problem; agree rounding, threshold and incompatible-unit behavior.

### Candidate C — Source-to-report integration feasibility packet

- **Outcome:** Decide whether one named source can provide a repeatable, owned input to the approved benefits decision pack.
- **Scope:** A non-production mapping of one approved source field to one benefit, owner, period, refresh, validation rule and access boundary; identify manual export as the baseline alternative.
- **Exclusions:** Live connection, credentials, data ingestion, telemetry, dashboard change, production data collection, procurement, uptime or support promise.
- **Acceptance criteria:** Source owner confirms the field definition, extraction method, refresh, access/privacy constraints, validation/reconciliation and failure behavior; a non-sensitive synthetic sample maps end-to-end; manual alternative and go/no-go rationale are recorded.
- **Validation:** Source-owner walkthrough using synthetic data; security/privacy review before any later integration proposal.
- **Dependencies:** Candidate A’s approved measure contract and named source/data owner; security obligations remain applicable.
- **Indicative effort:** 2–5 person-days, unvalidated; actual integration effort is not estimated.
- **Readiness gates:** A genuine need for automation, authorized source access, data minimization, security/privacy review and accountable operational support must be demonstrated.

## Promotion and selection checklist

**Backlog-ready** means a bounded candidate is supportable as future work, not approved for delivery:

- [ ] An evidence-backed user/problem and named decision-maker are recorded.
- [ ] Existing assets and alternatives are mapped; scope, exclusions, dependencies, risks, and non-goals are explicit.
- [ ] Acceptance criteria and validation are independently testable; traceable example and edge cases are specified.
- [ ] Effort is reviewed by an owner and remains a range until confirmed; owner disposition is recorded.

**Sprint-ready** additionally requires:

- [ ] Named accountable owner and leaf-sized tasks.
- [ ] Test data/source access, formula semantics, security/privacy boundaries and dependency sequence are resolved or explicitly planned.
- [ ] Acceptance evidence, test method, estimate, and capacity are confirmed; owner records readiness.

**Selected for delivery** requires a separate authorized decision:

- [ ] Explicit owner/sponsor selection into a named sprint with a goal and confirmed capacity.
- [ ] No inherited dates/estimates from historical proposals; no scope is accepted merely because this discovery or a PR is complete.

Current status: research supports **Candidate A as a backlog candidate only after owner decision**. No candidate is sprint-ready or selected for delivery.

## Benchmark references and research limitations

External research was attempted via web search and direct retrieval of UK government pages, but network name resolution/fetch was blocked in this environment. Therefore these references are **follow-up reading pointers, not sources consulted for this recommendation**, and no external benchmark claim is made:

- HM Treasury, *The Green Book: Appraisal and Evaluation in Central Government* (2022): <https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government/the-green-book-2022>
- HM Treasury, *The Magenta Book: Central Government Guidance on Evaluation* (2020): <https://www.gov.uk/government/publications/the-magenta-book>
- Infrastructure and Projects Authority, *Guide for Effective Benefits Management in Major Projects* (2017): <https://assets.publishing.service.gov.uk/media/5a82f92de5274a2e8ab5949e/Guide_for_Effective_Benefits_Management_in_Major_Projects.pdf>

The requested 3–5 external public examples/tool workflows could not be verified or consulted. For repository-only comparison, the concrete workflows inspected were the benefits review/variance templates plus their validated synthetic example, the canonical executive-report template, the ROI automation setup guide, and the static Power BI sample-data workflow. These show different levels of scope and dependency; they are not independent market benchmarks, operational deployments, or validated demand.

Repository evidence consulted: [#320 charter](https://github.com/mirichard/pm-tools-templates/issues/320), its 2026-09-24 retirement comment; [#341](https://github.com/mirichard/pm-tools-templates/issues/341); [#47](https://github.com/mirichard/pm-tools-templates/issues/47); [#1566](https://github.com/mirichard/pm-tools-templates/issues/1566); [discovery plan](v2.5-discovery-plan.md); [benefit review process](../docs/benefits/benefits-review-process.md); [variance template](../templates/universal/benefits-variance-analysis-template.md); [calculation validator](../scripts/validate-sprint-10.mjs).

## Proposed #320 results comment

The issue-comment write operation is not available in the tools for this task. Proposed concise comment to post when authorized:

> Research packet: [PR #1573](https://github.com/mirichard/pm-tools-templates/pull/1573) and [discovery report](https://github.com/mirichard/pm-tools-templates/blob/copilot/epic-executive-enterprise-platform/research/epic-320-executive-value-discovery.md). Recommendation: a template-first executive benefits-shortfall decision pack using existing #341 assets; no new platform or live integration. Decision required: confirm this bounded outcome and name benefits/data owners before backlog promotion. External benchmarks were unavailable; no schedule, confirmed estimate, or delivery acceptance is claimed.
