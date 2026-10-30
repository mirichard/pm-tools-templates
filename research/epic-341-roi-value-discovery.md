# Epic #341: ROI & Value Tracking Discovery

**Status:** Research for owner review; no delivery or release commitment  
**Scope:** ROI/value-tracking child outcome of [#320](https://github.com/mirichard/pm-tools-templates/issues/320). Preserve the native parent relationship. [#47](https://github.com/mirichard/pm-tools-templates/issues/47) remains an independent benefits-management epic.

## Decision brief

**Recommendation:** First improve the maintained ROI tracking template with one traceable, period-matched example and calculation fixtures; reuse the current benefits-review process, register and variance template. This is smaller than building an engine and does not duplicate the executive-reporting outcome under active research in #320. Do not build a new dashboard, financial connector, predictive model or KPI platform in this slice.

**Evidence:** The catalog’s maintained ROI template already covers investment costs, forecast and realized benefits, and ROI/NPV/IRR; its September 2026 guidance calls for source, owner, reporting period, one currency and explicit zero-denominator handling. The benefits-review process and variance template already define source validation, approved baselines, missing-data treatment, nonfinancial measures and decision ownership. The material gap is an independently checked ROI example and a concise contract for comparing actual results with the approved case. The VBA automation and sample CSV do not demonstrate a tested or connected calculation service.

**Principal uncertainty:** No user interviews, live financial evidence, adoption data or owner-approved use case establish whether template-only calculation is sufficient. The reported user/decision below is derived from the epic and parent charter, not validated demand. External source retrieval was partly blocked; see Sources.

**Owner decision:** Select template improvement or a deterministic calculator as the first bounded delivery; confirm an accountable owner, source/data validation roles, capacity and sequencing against the two-investigation limit in #1566. Defer executive presentation to #320’s current selection. Do not accept the historic coverage/adoption/ROI-improvement claims as delivery criteria.

## Existing asset inventory

| Capability | Maintained asset and demonstrated content | Gap / boundary | Disposition |
|---|---|---|---|
| ROI calculations | [ROI Tracking Template](../domains/delivery/templates/traditional/Traditional/Knowledge_Areas/Project_Cost_Management/roi_tracking_template.md) (catalog path; updated 2026-09-19) documents simple ROI, NPV and IRR, separate cost/benefit rows, and instructions to retain source, owner, period, baseline and formula. | A document, not a tested calculation service. Its large legacy-style worksheet includes many optional measures and does not provide an independently checked financial example. | **Retain/revise** this maintained template; do not make a second ROI template. |
| Benefits and realization | [Benefits Review Process](../docs/benefits/benefits-review-process.md), [Benefits Review](../templates/universal/benefits-review-template.md), [Benefits Variance Analysis](../templates/universal/benefits-variance-analysis-template.md), and [Benefits Register (Lightweight)](../templates/universal/benefits-register-lightweight.md). The process assigns benefit ownership, requires source validation, and says missing baseline/target/owner/reliable source is `NOT MEASURABLE`; variance rules preserve approved baseline history. | These are process/templates rather than automated financial calculations. The register is intentionally lightweight; use the review process and variance template rather than duplicating their governance. | **Retain/reuse**; add only ROI-specific calculation examples or clarifications. |
| Broad financial benefits | [Benefit Realization Framework](../business-stakeholder-suite/financial-governance/benefit-realization-framework.md) lists financial, operational, strategic and compliance benefits, owners, measurement and governance. | Broad framework with no executable or validated calculation workflow. Its optional NPV/IRR/ROI menu is not a requirement to implement every measure. | **Retain** as context; **defer** a replacement framework. |
| Comparative reporting | [ROI Tracking Dashboard Template](../business-stakeholder-suite/financial-governance/roi-tracking-dashboard.md) has portfolio, project, time-series and benchmark tables. | These are example fields and placeholder values, not an observed comparable dataset or working aggregation. Unlike horizons, currencies, scopes or assumptions cannot be ranked responsibly. | **Retain** as a presentation pattern; **defer** comparative engine and external benchmarks until input comparability is demonstrated. |
| Custom KPI definition | [KPI Mapping Template](../project-lifecycle/04-monitoring-control/progress-tracking/kpi-mapping-template.md) (updated 2026-09-13) maps execution, project, program and strategic metrics and links to benefits assets. | No ROI-specific executable definition/roll-up or tested metric registry. A hierarchical map is not evidence that KPI values are sourced or comparable. | **Retain/reuse** mapping; **defer** a KPI-definition engine. |
| Executive reporting | [Executive Dashboards overview](../business-stakeholder-suite/executive-dashboards/README.md) describes Excel, BI and web approaches. [Web-MVP executive status schema](../schemas/web-mvp/executive_status_report.schema.json) covers reporting period, health, schedule, budget, scope, highlights, risks and next steps, but not benefit/ROI records. | The schema does not model value inputs or ROI. The existing [executive report VBA](../business-stakeholder-suite/executive-dashboards/financial-integration/executive-report-generation.bas) uses placeholder portfolio totals and mock forecast values. #320 has an open WIP research PR, [#1573](https://github.com/mirichard/pm-tools-templates/pull/1573), selecting its reporting outcome; no competing executive proposal is made here. | **Retain** existing report formats; **defer** connection/schema changes to the #320 decision. |
| Illustrative automation/data | [ROI VBA module](../business-stakeholder-suite/executive-dashboards/financial-integration/ROI_Tracking_System.bas), [setup guide](../business-stakeholder-suite/executive-dashboards/financial-integration/ROI_Setup_Guide.md), and [sample CSV](../business-stakeholder-suite/executive-dashboards/financial-integration/ROI_Sample_Data.csv) show proposed macros, formula snippets, placeholder endpoints and sample investment rows. | The code uses placeholder API/database configuration; the CSV has no traceable source evidence; no ROI-specific functional tests were found. Setup instructions describe external financial connections and macro activation that are outside this research scope. These files do not prove a live or supported system. | **Defer** activation/integration; do not use sample values as validated data or delivery evidence. |
| Worked benefit example | [Day-60 synthetic JSON](../examples/benefits-review/service-centre-day-60.json) and [review](../examples/benefits-review/service-centre-day-60-review.md) demonstrate input-to-formula-to-decision traceability for nonfinancial and cost-avoidance benefit variance. | It is not a project ROI example. | **Retain/reuse** its explicit synthetic-data and source-ID pattern. |
| Duplicate, draft and paused paths | The catalog’s ROI record uses the maintained Delivery-domain path above and lists the old `templates/traditional/.../roi_tracking_template.md` as an alternate path. [Domain navigation guidance](../docs/domain-navigation-and-legacy-paths.md) says catalog paths, not directory names or generated copies, establish canonical identity. #1329 remains paused per the [discovery plan](v2.5-discovery-plan.md). | Legacy/catalog aliases and generated site copies are not separate maintained capabilities; paused AI is not an ROI dependency. | **Keep compatibility paths; defer** copies, staging work and paused AI from this scope. |

### Research and delivery context

- #320’s current charter selects practical executive decision support using existing reporting assets; it requires traceable inputs, reproducible calculations and a worked example. Its WIP #1573 asks for the reporting outcome. The PR file/diff read timed out, so unpublished findings could not be verified or reused; this packet stays confined to #341’s ROI child outcome and defers executive presentation to #320.
- #47 is an independent benefits-management epic. Its open WIP [PR #1570](https://github.com/mirichard/pm-tools-templates/pull/1570) is not accepted delivery evidence. This discovery reuses the already maintained benefits guidance and does not redefine #47.
- [Discovery tracker #1566](https://github.com/mirichard/pm-tools-templates/issues/1566) calls for bounded candidates and owner decisions, limits investigations in progress to two, and requires confirmed capacity before selection. The open WIP research PRs #1570 and #1573, together with this #341 WIP #1574, make three visible candidates unless an earlier investigation is no longer active. Confirm sequencing/capacity before promoting work.
- No ROI-specific functional tests or calculator fixtures were found. The `Snowflake Demo` KPI panel is a demo component, not evidence of ROI functionality. Existing benefit-review example tests the value-variance workflow, not financial ROI.

## Measurement problem and decision

The charter implies an executive sponsor, finance/PMO reviewer or business benefits owner deciding whether to continue, correct, extend, reprioritize or accept an initiative’s realization plan when actual results differ from the approved business case. The reporting workflow should use the existing benefit-review checkpoints (mid-project, closure, Day 30/60/90 and event-driven) and produce an evidence-linked result and named action. This user/decision is a **charter-derived hypothesis**, not user research.

Keep three questions separate:

1. **Initiative financial return:** What eligible financial benefits and costs did this initiative record over a declared period?
2. **Business-case realization:** How do actual outcomes and the current forecast compare with the approved business case for the same period, preserving the original baseline and approved changes?
3. **Value attributable to project-management practices:** Did a specified PM practice cause an outcome change? The first two calculations cannot answer this. Attribution requires a credible counterfactual or comparison design, documented intervention/exposure and timing, outcome measures, relevant confounder handling, and independent validation. Without that evidence, report initiative-level results only; do not label them “PM-caused ROI.”

## Measurement contract

This is a proposed minimum contract for owner review. Formula conventions are explicit design choices; local finance policy and the approved business case control where they differ.

| Input / rule | Required record and source | Accountable / validating role |
|---|---|---|
| Identity and approval | Initiative ID; benefit IDs; approved business-case reference/version; original and approved revised baseline; approval/change reference. | Sponsor approves the business case and changes; project manager maintains the trace. |
| Measurement window | Inclusive start/end dates, reporting checkpoint, `as_of` date, and whether values are period or cumulative. Actual costs and benefits must cover the same declared window. | Benefits owner prepares the review; finance/data owner validates source extracts. |
| Financial inputs | Each cost and benefit as a separate line with amount, ISO currency, unit/scale, cash/noncash classification, source/evidence reference, extract/version, source owner, measurement owner and validation date. Record the approved forecast and actual independently. | Benefits owner owns realization; finance/data owner validates amounts, classifications and calculation. Operational owner supplies adoption/operating evidence; PM coordinates records. |
| Cost boundary | State included direct delivery costs (e.g. personnel, implementation, vendor, license, training/change) and recurring/operating costs within the approved horizon. Identify one-time vs recurring. Exclude unrelated or sunk costs only if the approved business case excludes them; document shared-cost allocation once. | Sponsor/finance approve the boundary before comparing actual with forecast. |
| Benefit boundary | Use realized incremental cash savings or contribution margin supported by evidence; separate approved forecast, gross actual benefits, costs and net benefit. Assign a unique benefit ID and count each economic effect once. Do not treat gross revenue as profit or add overlapping cost avoidance and savings. | Named benefit owner validates realization; finance validates material monetary conversions. |
| Units, currency and valuation | Do not aggregate unlike units or currencies. If currency conversion is required, retain original amount/currency plus approved rate, date and source. State nominal/real basis and valuation date; apply one consistent basis to all compared values. | Finance/data owner validates conversion and consistency. |
| Nonfinancial outcomes | Record baseline, target, actual, unit, direction, source and confidence as a separate measure; qualitative benefits use observable evidence and a decision assessment. Do not fabricate money values to force an ROI total. | Benefits/operational owner supplies evidence; sponsor decides its decision relevance. |
| Freshness and uncertainty | Record source timestamp and a freshness tolerance agreed for that source before reporting. Mark stale/unavailable/uncertain inputs and confidence; use scenario ranges when evidence supports a range. Never silently impute zero, extrapolate actuals or hide uncertainty. | Source owner confirms freshness; finance/data owner validates. |

**Minimum reported measures:**

- `Net benefit = eligible gross realized financial benefits − eligible actual costs`.
- `Realized ROI (%) = (eligible gross realized financial benefits − eligible actual costs) / eligible actual costs × 100`, for one matched period/currency and approved cost boundary. This is the chosen simple ROI convention, not a universal definition.
- Show gross benefits and actual costs alongside ROI; separately show the approved forecast for the same checkpoint and the forecast/actual difference. Do not label the ratio of realized to forecast benefits as ROI.

**Formula baseline versus specification choices:** Simple ROI is commonly expressed as `(benefits − costs) / costs`; this packet labels its precise inclusion rules and does not treat the formula as a universal standard. NPV is `Σ CF_t / (1 + r)^t`, with period-zero treatment, cash-flow signs, dates and rate declared. Simple payback is the first period when cumulative undiscounted net cash flow reaches or exceeds zero; discounted payback discounts those flows first. IRR is a rate at which NPV equals zero and may have multiple or no meaningful roots for non-conventional cash flows. These are mathematical definitions; perspective, horizon, included costs/benefits, baseline, source freshness, discount rate, attribution and reporting cadence are policy/design choices. Only simple ROI and net benefit are proposed for Candidate A.

Do not calculate when a required benefit or cost is missing/stale/unvalidated, sources cover different periods, units/currency/valuation basis are incompatible, the approved boundary is unknown, or actual/approved version cannot be traced. Mark `NOT MEASURABLE`, state the missing evidence and owner/action, and optionally disclose known subtotals as incomplete. A zero cost denominator makes ROI undefined, not zero or infinite.

Simple cumulative ROI is suitable only for a named evaluation horizon and is not time-adjusted. Do not rank initiatives with different durations, valuation dates, cost scopes, currencies or maturity as directly comparable. Compare at the same time-since-approval checkpoint and horizon, or agree on date-specific cash flows and a consistent approved discount rate to calculate NPV. Use simple payback only when recovery timing is a decision need and dated cumulative net cash flows are available. Discounted payback/NPV require an approved rate, period convention and complete cash flows; IRR can be ambiguous for non-conventional flows. They are **not** required in the first delivery.

## Synthetic worked example

**All figures below are fabricated for calculation validation; they are not repository/customer/project evidence.** Example initiative `SYN-01`, USD, approved 2025-01-01 to 2025-12-31 evaluation period, reporting as of 2025-12-31. Assume the synthetic sources have been validated by Finance and the Benefit Owner.

| Measure | Approved business case for period | Actual for same period | Synthetic trace |
|---|---:|---:|---|
| One-time implementation cost | $100,000 | $100,000 | Finance extract `SYN-FIN-01`, cost ID `C-01` |
| Recurring operating cost | $30,000 | $20,000 | Finance extract `SYN-FIN-01`, cost ID `C-02` |
| Cost savings | $100,000 | $90,000 | Operations/Finance evidence `SYN-OPS-01`, benefit ID `B-01` |
| Incremental contribution margin (not gross revenue) | $60,000 | $60,000 | Finance evidence `SYN-FIN-02`, benefit ID `B-02` |
| Total eligible costs | $130,000 | $120,000 | `C-01 + C-02`, counted once |
| Gross realized benefits | $160,000 | $150,000 | `B-01 + B-02`, non-overlapping |
| Net benefit | — | $30,000 | $150,000 − $120,000 |
| ROI | 23.08% approved forecast | 25.00% actual | `(benefits − costs) / costs × 100` |
| Actual benefit attainment | — | 93.75% of approved benefit for this period | $150,000 / $160,000; not ROI |

The arithmetic is independently checked: approved net benefit `$160,000 − $130,000 = $30,000`; forecast ROI `$30,000 / $130,000 × 100 = 23.0769…%`, rounded to **23.08%**. Actual net benefit `$150,000 − $120,000 = $30,000`; actual ROI `$30,000 / $120,000 × 100 = 25.00%`. The example establishes only the initiative’s recorded financial result under the stated assumptions; it does not show that project-management practices caused the result.

### Validation fixtures

| Case | Inputs | Independently checked expected result |
|---|---|---|
| Normal | Matched 12-month period; eligible actual benefits $150,000; eligible actual costs $120,000. | Net benefit **$30,000**; ROI **25.00%**. |
| Negative return | Same matched period; eligible actual benefits $90,000; costs $120,000. | Net benefit **−$30,000**; ROI **−25.00%**. Preserve the adverse result; do not clamp to zero. |
| Zero denominator | Matched period; costs $0; benefits $15,000. | ROI **undefined / NOT MEASURABLE** (division by zero); do not report zero, infinity or 100%. The $15,000 benefit may be shown separately with the reason. |
| Missing input | Costs $120,000 are validated, but required benefit source/actual is missing. | **Withhold total ROI and net benefit**; report `NOT MEASURABLE`, missing source and action. Do not treat missing benefits as $0. |
| Mismatched periods | Costs cover 2025-01-01–2025-12-31; benefits cover 2025-07-01–2026-06-30. | **Withhold combined ROI** until period values are aligned/reconstructed and approved. Do not combine merely because both periods are 12 months. |

Also withhold when an input is stale or unvalidated, the approved cost boundary or currency basis is missing, or benefits overlap. Such inputs may be listed as incomplete evidence, never silently normalized to a favorable point estimate.

## Delivery options and candidate issue drafts

Effort ranges below are **rough discovery estimates**, not team estimates or commitments. All options exclude live data connections, telemetry, user-adoption targets, AI restoration and production dashboard changes.

### Options compared

| Option | Value / cost | Decision |
|---|---|---|
| Improve the existing maintained ROI template | Lowest change cost; strengthens its existing source/owner/period and cost-boundary guidance, adds a worked example and expected results without duplicating assets. Arithmetic remains manual and depends on reviewer discipline. | **Recommend first.** Prove the contract and usable artifact before software. |
| Add a deterministic calculator | Stronger repeatability and regression checks, but adds implementation, interface and data-validation decisions before user need for automation is known. | **Alternative follow-on**, only if owner confirms manual recalculation is an evidenced pain point; use the same contract/fixtures. |
| Connect existing executive reporting | Could surface reviewed results to executives, but requires agreement on report fields, cadence, audience and source quality. The existing schema has no benefit fields and #320 is actively selecting the reporting outcome. | **Defer to #320**; no integration is a dependency for first delivery. |

### Candidate A — Revise maintained ROI worksheet (recommended)

**Outcome/scope:** An owner can reproduce one initiative’s realized ROI against its approved business case from dated, owner-validated inputs, while distinguishing financial return, benefit realization and PM-practice attribution. Update only the maintained ROI template, reuse benefits review assets, and add the synthetic fixture above.

**Exclusions:** New calculator/service, enterprise dashboard, portfolio benchmark, business/KPI platform, live finance/API integration, causal PM-value claim, NPV/IRR/discounted-payback implementation, adoption/coverage targets.

**Acceptance criteria:**
- The worksheet records approved business-case reference/version, original and revised baselines, period/as-of date, unit/currency/valuation basis, actual vs forecast, source/evidence, owner and validation date for each included line.
- It separates one-time/recurring costs and gross benefits, identifies the approved cost boundary, prevents duplicate benefit counting, and keeps nonfinancial evidence separate from monetary totals.
- The worked example and all five fixtures above show expected values, rounding and `NOT MEASURABLE` behavior; another reviewer can reproduce each result by hand from the stated inputs.
- It explicitly says initiative ROI does not establish PM-practice causation and names the additional attribution evidence required.
- Links to the existing benefits register, variance template and review process remain valid; no duplicate benefits process or dashboard is introduced.

**Validation fixtures:** Normal `$150k/$120k → 25%`; negative `$90k/$120k → −25%`; zero denominator → undefined; missing benefit input → withhold; mismatched periods → withhold. Add a reviewer check for one-time/recurring totals and non-overlapping IDs.

**Dependencies:** Existing canonical ROI template and benefits assets only; no integration dependency. Confirm the #47 owner’s boundary if its WIP research changes benefits guidance.

**Effort range:** 1–2 person-days, rough content/review estimate; confirm with the named owner before backlog readiness.

**Remaining readiness gates:** Owner confirms manual template is the desired first user outcome; finance/data role and source freshness rule are named for a real use case; actual owner and capacity are confirmed; research WIP limit/sequence is resolved.

### Candidate B — Deterministic ROI calculator (alternative, not selected)

**Outcome/scope:** Given a validated, versioned input record following the same measurement contract, a dependency-free calculator returns net benefit and simple ROI or a precise withheld-result reason, with the fixture cases as automated tests.

**Exclusions:** Data ingestion, financial-system/API access, forecasting, aggregation, dashboard UI, discounting/IRR and causality claims.

**Acceptance criteria:** Same fixture inputs return exact expected numeric results (currency rounded only for display); negative ROI remains negative; zero denominator, missing/stale inputs and mismatched periods return `NOT MEASURABLE` with reason; incompatible units/currencies and duplicate IDs are rejected; output echoes period, currency, source IDs, approved-case version and assumptions; tests run through an existing repository-supported test command without adding a dependency.

**Validation fixtures:** The five table cases above plus duplicate-benefit-ID and currency-mismatch rejection cases.

**Dependencies:** Owner approval of Candidate A’s measurement contract and validation policy; no live-system connection. This does not depend on #320’s reporting technology choice.

**Effort range:** 3–5 person-days for a small tested calculator and documentation, rough estimate only.

**Remaining readiness gates:** Evidence that users need automation rather than the maintained worksheet; select implementation location/runtime; name calculation/data owners and capacity.

### Candidate C — Surface validated results in existing executive reporting (deferred)

**Outcome/scope:** Present approved, as-of-dated ROI and benefit realization status in the existing executive report only after the parent #320 research selects the audience, decision and format.

**Exclusions:** New dashboard platform, live financial integrations, cross-project rankings without comparable periods, generic adoption goals, unsupported PM-causality claims.

**Acceptance criteria:** Each displayed financial measure links to approved business-case version and source/owner evidence; report shows period/as-of date, currency, forecast vs actual, confidence and withheld status; synthetic example reconciles to Candidate A’s fixture; missing/mismatched values are not rendered as zero; the selected #320 decision and existing schema/report boundary are documented.

**Validation fixtures:** Normal and negative result render; zero denominator, missing input, stale source and mismatched period display `NOT MEASURABLE` with reason and never a numeric ROI.

**Dependencies:** #320 owner decision, stable measurement contract and data/report owner. No financial-system integration assumed.

**Effort range:** 2–4 person-days after reporting contract is selected, rough estimate only.

**Remaining readiness gates:** Reuse #320’s final outcome; establish format/schema ownership, review cadence and data permission; do not create a competing #320 proposal.

## Promotion checklist

- **Backlog-ready:** Demonstrated user/problem evidence; complete asset inventory; bounded outcome and exclusions; feasible option selected; testable acceptance/fixtures; dependencies and risks; rough estimate; evidence linked; owner disposition recorded. **Current status: research packet ready for owner disposition; user need and option not yet approved.**
- **Sprint-ready:** Backlog candidate decomposed into leaf work; named accountable owner; exact source/freshness policy and test method; dependency order resolved; estimate confirmed by delivery owner; owner records ready decision. **Not ready.**
- **Selected for delivery:** Sponsor selects candidate for a named sprint only after goal, sequence and team capacity are confirmed. **Not selected; no date or commitment assigned.**
- At closeout, link actual evidence and explicitly defer/retire residual scope. Historical “100% coverage,” “90% adoption” and “ROI improvement” claims require separate operational definitions, denominators, data sources and measurement windows; none is acceptance evidence here.

## Sources and limitations

### Repository evidence reviewed

- [Discovery tracker #1566](https://github.com/mirichard/pm-tools-templates/issues/1566), updated 2026-10-30; [parallel discovery plan](v2.5-discovery-plan.md), especially promotion/capacity rules.
- #341 and #320 current issue charters/parent relationship; #320’s WIP [PR #1573](https://github.com/mirichard/pm-tools-templates/pull/1573) and #47’s WIP [PR #1570](https://github.com/mirichard/pm-tools-templates/pull/1570). Their issue/PR metadata shows WIP; PR file/diff reads timed out, so no unpublished research conclusion is represented here.
- [Benefits Review Process](../docs/benefits/benefits-review-process.md) and [Benefits Variance Analysis](../templates/universal/benefits-variance-analysis-template.md), both marked updated 2026-09-02; [ROI Tracking Template](../domains/delivery/templates/traditional/Traditional/Knowledge_Areas/Project_Cost_Management/roi_tracking_template.md), updated 2026-09-19; [KPI Mapping Template](../project-lifecycle/04-monitoring-control/progress-tracking/kpi-mapping-template.md), updated 2026-09-13.

### External methods and public implementations

**Retrieval limitation:** DNS/web search was unavailable for most external sources in this environment. The links below identify the relevant public editions and implementations, but only the NumPy Financial GitHub page was successfully fetched directly. Verify the current edition/version and detailed conventions before using these as policy or promotion evidence. Access date for this research: 2026-10-30.

**Guidance references:**

- HM Treasury, [The Green Book: appraisal and evaluation in central government](https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government), 2022 edition. Relevant as an appraisal/evaluation framework for costs, benefits, risk, uncertainty and non-monetized impacts; UK public-sector perspective, not a universal corporate ROI rule.
- HM Treasury, [The Magenta Book](https://www.gov.uk/government/publications/the-magenta-book), 2020 edition. Relevant to evaluation design and impact evidence; outcome movement alone is not causal attribution.
- U.S. GAO, [Cost Estimating and Assessment Guide, GAO-20-195G](https://www.gao.gov/products/gao-20-195g), March 2020. Relevant to documented scope, assumptions, data, estimating methods and sensitivity; it does not determine which benefits or causal effects to count.
- UK Government, [GovS 002: Project Delivery](https://www.gov.uk/government/publications/project-delivery-functional-standard), living standard; exact current version should be verified. Relevant to lifecycle benefits governance, not a prescribed ROI formula.
- PMI, [Benefits Realization Management: A Practice Guide](https://www.pmi.org/standards/benefits-realization), 2019. Relevant lifecycle/accountability practice; practice guidance, not a binding formula.

**Public calculation implementations (not end-to-end benefits-management products):**

1. NumPy Financial, [repository](https://github.com/numpy/numpy-financial) and [financial functions documentation](https://numpy.org/numpy-financial/latest/). Public package implements periodic financial functions including NPV/IRR; its repository provides a callable IRR example. It does not validate benefit sources, dates or causal attribution. Repository page fetched successfully; no fixed publication date shown.
2. PyXIRR, [repository](https://github.com/Anexen/pyxirr) and [function documentation](https://anexen.github.io/pyxirr/functions.html). Public dated-cash-flow NPV/XIRR implementation; day-count and multiple-IRR behavior are library conventions, not universal policy. Page retrieval was blocked; version/date and detailed behavior need verification.
3. QuantLib, [repository](https://github.com/lballabio/QuantLib) and [documentation index](https://www.quantlib.org/docs.shtml). Public cash-flow NPV/yield implementation with configurable day count, compounding and frequency; broad quantitative-finance library, not a project-benefits workflow. Page retrieval was blocked; confirm current API/version before relying on details.

The documented formulas in this packet are conventional calculation forms, but the selected cost boundary, horizon, currency basis, source freshness, owner roles, attribution threshold and use of any discount rate are repository-specific proposals requiring owner/finance approval.

## Proposed #341 results comment if direct issue commenting is unavailable

> Research packet: [ROI & Value Tracking Discovery](https://github.com/mirichard/pm-tools-templates/blob/main/research/epic-341-roi-value-discovery.md) in [PR #1574](https://github.com/mirichard/pm-tools-templates/pull/1574). Existing benefits review and variance assets already cover much of realization governance; the maintained ROI worksheet is not a tested calculation engine. Recommended first delivery: revise that worksheet with a traceable, period-matched synthetic example and verified edge-case fixtures, reusing benefits guidance. Defer calculator automation pending evidence of need and executive reporting integration to #320’s active research. Owner decision: choose template revision vs. calculator and confirm owner, data/freshness policy, capacity and sequencing under #1566’s two-investigation limit. This research makes no delivery, coverage, adoption, causal-value or release claim.
