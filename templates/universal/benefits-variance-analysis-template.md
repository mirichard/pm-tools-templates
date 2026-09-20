---
title: "Benefits Variance Analysis Template"
methodology: "universal"
complexity: "intermediate"
owner: "benefits-owner"
updated: "2026-09-02"
domain: "Measurement"
tags: ["benefits-realization", "variance-analysis", "measurement", "governance"]
primary_principles: ["evidence-based-decisions", "value-focus"]
secondary_principles: ["stewardship", "risk-optimization"]
principle_rationale: "Makes benefit variance, confidence, thresholds, and decision evidence explicit."
---

# Benefits Variance Analysis

## When to Use

- At a benefits checkpoint with actual and expected achievement for the same date.
- When measurement owners need to explain variance, confidence, and corrective action.

## When NOT to Use

- To calculate achievement with missing evidence, incompatible units, or a zero denominator; record NOT MEASURABLE instead.
- Do not overwrite the original baseline to remove an unfavorable variance. See [Rebaseline to green](../../docs/principles/anti-patterns.md#baseline-green).

## Pairs Well With

- [Benefits Review Template](../../templates/universal/benefits-review-template.md).
- [Roi Tracking Template](../../domains/delivery/templates/traditional/Traditional/Knowledge_Areas/Project_Cost_Management/roi_tracking_template.md).

Selection context: Measurement domain; universal methodology; intermediate complexity. Match the situations above to project phase, risk, team size, and industry using the [decision-engine context model](../../meta/architecture-research/800-801-context-assessment-model.md).

## Additional use considerations

At every benefits-review checkpoint to compare actual achievement with the approved expected achievement as of the same date.

## Additional exclusions

Do not calculate a percentage when the baseline equals the target, units differ, evidence is unavailable, or the measure is purely qualitative. Mark `NOT MEASURABLE` and record corrective action instead.

## Calculation rules

- Higher is better: `(actual − baseline) ÷ (target − baseline) × 100`
- Lower is better: `(baseline − actual) ÷ (baseline − target) × 100`
- Variance points: `achievement % − expected achievement %`
- Default status: Green ≥ −5; Amber < −5 to −15; Red < −15 percentage points. Critical triggers override arithmetic.
- Preserve original and approved revised baselines separately. Cite the source and as-of date.

## Analysis

| Benefit ID | Measure/unit | Direction | Original baseline | Approved baseline | Target | Actual | Expected achievement % | Actual achievement % | Variance points | Status | Confidence | Evidence/source |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|---|---|
| | | HIGHER / LOWER | | | | | | | | | HIGH / MEDIUM / LOW | |

## Qualitative benefits and disbenefits

| Benefit/disbenefit ID | Approved observable indicator | Current evidence | Assessment | Confidence | Decision impact |
|---|---|---|---|---|---|
| | | | ON TRACK / AT RISK / NOT REALIZED / REALIZED | | |

## Root-cause and forecast

| Benefit ID | Cause supported by evidence | Forecast at target date | Corrective option | Cost/risk | Recommendation |
|---|---|---|---|---|---|
| | | | | | |

## Integrity checks

- [ ] Units, direction, baseline, target and as-of date align.
- [ ] Source owner validated the actual and confidence rating.
- [ ] Dependent benefits and periods are not double-counted.
- [ ] Approved changes retain the original baseline and approval reference.
- [ ] Amber repetition and Critical override rules were applied.
- [ ] Every Amber/Red/Critical result has an owned, dated action or escalation.
