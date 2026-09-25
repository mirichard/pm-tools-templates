# Schedule and technology risk rules — proposal

09/25/2026 · #1298 / #1329 · Decision status: proposed, not implemented or accepted.
These are transparent planning checks, not a trained classifier or calibrated risk scores.
The existing failing scenarios remain active until an agreed contract is implemented.

## Schedule feasibility

Assessment point: the current approved plan or an explicitly dated replan.
Required new inputs: remaining effort in person-hours; available delivery capacity
in person-hours through the committed date; scope/baseline version; assessment date;
calendar and allocation assumptions; unresolved dependency dates. Capacity must
account for leave, competing work and role constraints, without counting the same
person twice. Duration and team size alone do not supply these facts.

| Condition | Proposed observable result | Recommendation |
| --- | --- | --- |
| Inputs absent, stale or units inconsistent | Not assessed; identify missing evidence | Obtain a current effort/capacity baseline |
| Remaining effort exceeds available capacity | Capacity shortfall, with hours and ratio | Review scope, qualified capacity or delivery date |
| Effort equals capacity | No capacity margin; do not classify as safe | Review uncertainty and contingency |
| Effort below capacity | No aggregate shortfall detected; dependency/role constraints remain separate | Review critical dependencies and constrained skills |
| A prerequisite arrives after the activity needs it | Dependency conflict, identify dates and affected work | Resequence, resolve prerequisite or replan |

The ratio is effort / capacity. Zero capacity with remaining work produces an
explicit shortfall and no finite ratio; zero effort and zero capacity is not
assessed as a useful capacity ratio. Reject negative/nonfinite inputs. A short
calendar duration by itself must never generate Tight Timeline.

Do not automatically recommend a fixed extension. Derive an extension only from
an approved resource calendar and feasible dependency plan. Otherwise offer a
planning review; adding people cannot be assumed to improve throughput linearly.

## Technology delivery exposure

Required new inputs: critical integrations and their readiness evidence; accountable
owner; required skills and confirmed coverage; feasibility evidence for unfamiliar
components; assessment date and applicable baseline. Technology names and stack
length are insufficient. The current technologies array cannot supply these facts.

| Condition | Proposed observable result | Recommendation |
| --- | --- | --- |
| Required evidence missing | Not assessed; list missing evidence | Complete integration/skills assessment |
| Critical integration has a documented unresolved feasibility or compatibility issue | Integration exposure, cite affected interface and issue | Time-box a feasibility test and assign an owner |
| Required skill lacks confirmed delivery coverage | Skills coverage gap | Obtain qualified support, pairing or training with a due date |
| All declared critical checks have supporting evidence | No exposure detected in assessed checks | Reassess when scope, team or dependencies change |

Do not infer risk from unfamiliar brand names or the number of tools. Do not assign
numerical impact or low/medium/high/critical severity until those meanings and
thresholds are agreed. Each result needs rule ID/version, assessment timestamp,
evidence references, reason and status (triggered / not triggered / not assessed).

## Contract and approval needed

This would require a versioned schema extension and display handling for
not-assessed results. Unknown fields are currently stripped by the shared schema;
adding fixture fields alone would not implement these rules. No extension is made
in this proposal. Keep the 11-feature model input unchanged pending model work.

Review decisions: accept the evidence inputs and output statuses; define evidence
freshness per planning cadence; choose whether these checks belong in restoration
scope or a separate enhancement; name the decision owner. Issue assignment is not
acceptance. Approve before replacing existing scenario expectations.

Acceptance examples after approval: insufficient capacity triggers a documented
shortfall; identical duration with sufficient capacity does not; missing capacity
is not assessed; a large stack with verified interfaces does not trigger solely
because of its size; one blocked critical interface does trigger; missing skills
evidence is not equivalent to a confirmed skills gap.

## Recommended decision — 09/25/2026

Status: ready for Michael's product decision; not yet approved. Review based on
`19ef6d507836c94289dcf61845b1f1f8b5f8d8ba` and the controlling #1329 criteria.

Recommend implementing the evidence-based checks above in recovery scope, with
an additive versioned assessment object separate from the trained model's
four-category prediction. Preserve the existing 11-feature model input.
Do not manufacture severity/impact numbers to satisfy legacy assertions.

| Decision | Recommended contract | Effect |
| --- | --- | --- |
| Schedule | Compare remaining person-hours with qualified available person-hours; report dependency conflicts separately | Replaces duration-only Tight Timeline inference and unsupported extension advice |
| Technology | Report documented critical integration issues and confirmed skill gaps | Replaces technology-count inference |
| Missing evidence | Return not assessed with missing fields and a reason; never imply safe | Legacy requests remain usable without invented planning evidence |
| Freshness | Require baseline ID, assessed-at and reviewer-supplied review-due timestamp; baseline mismatch or assessment at/after review-due is not assessed | No arbitrary universal age cutoff; revalidation on baseline/team/dependency changes |
| Outputs | Rule ID/version, status, reason, evidence references and factual measurements; no fabricated calibrated score | Rule results remain distinguishable from unvalidated model predictions |

Timestamp validation must reject invalid dates and review-due not later than
assessed-at. Evaluate freshness at request time; do not serve a cached assessment
past review-due or after its baseline changes. A future assessed-at is invalid.
The caller supplies planning evidence; the service cannot independently verify it.

After approval, implementation sequence:
1. Add shared schema support and a pure rule evaluator; preserve unknown-field
   handling elsewhere and existing partial-request defaults.
2. Carry assessment results through direct/API/dashboard paths; display not
   assessed and evidence references explicitly.
3. Replace the three unsupported rule expectations with approved observable
   outcomes and add negative/boundary cases. Preserve classification, confidence,
   determinism and all unrelated assertions; no skipped tests or waiver changes.
4. Run focused checks, effective lint and complete suites; record remaining model
   failures separately. A rule repair does not establish classifier accuracy.

Required boundary examples: zero capacity with remaining work; zero/zero without
finite ratio; equal effort/capacity; negative/nonfinite inputs; missing evidence;
expired/mismatched baseline; future evidence; one blocked critical interface;
many verified tools; missing skill evidence versus a confirmed coverage gap.

Decision to record: accept this recovery scope, output contract and freshness rule,
or revise the specific row before implementation. Michael is the proposed product
decision owner; no assignment or prior instruction to continue is recorded as
acceptance of these newly specified choices.
