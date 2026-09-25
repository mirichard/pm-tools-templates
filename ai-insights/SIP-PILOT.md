# SiP effort-overrun pilot

Checkpoint: 09/25/2026. Related work: #1298, #1374, #1329.
Status: optional candidate; explicit reuse terms unconfirmed. JOSSE is the selected
replacement for pilot preparation; see JOSSE-PILOT.md. Awaiting SiP does not block
that work. Unconfirmed terms are not a finding that research use is prohibited.

## Scope

Evaluate whether task effort estimates can be improved using observed task effort.
This is a separate research baseline, not validation of the existing four-level
project-risk classifier. It does not change restoration acceptance criteria,
production outputs, or the withdrawn status of AI Insights.

## Source and reuse review

Original source: https://github.com/Derek-Jones/SiP_dataset
Inspected commit: `eb5fedc7d57b8520eb83d7db317831e9485e11a4`.
Paper: Jones and Cullum, January 2019,
https://arxiv.org/abs/1901.01621.

The original repository contains no LICENSE file. Its README asks users to notify
the authors if using the data in a paper but supplies no explicit dataset reuse
terms. The code README and analysis script header also provide no license grant.
The paper's license must not be assumed to cover the CSV data.

Only source/schema inspection and structural counts have been performed. No data
or upstream analysis code is included in this repository; no model has been fit.
Before training or distributing derived artifacts, obtain documented terms covering
analysis, model training, publication of aggregate findings and model artifacts,
any redistribution of source data. The intended project is free and MIT-licensed;
commercial use is not a pilot requirement.
Retain the grant, required attribution and permitted uses with the source manifest.
This is an unresolved provenance prerequisite, not a finding that reuse is prohibited.

## Verified source structure

| Check | Result |
| --- | --- |
| Task-file rows | 12,299 |
| Distinct TaskNumber values | 10,266 |
| Tasks with multiple developer rows | 1,384 |
| Project codes | 20 |
| Date-file rows / distinct tasks | 12,299 / 10,266 |
| Conflicting date tuples within a task | 0 |
| Text decoding | UTF-8 decoding fails; Windows-1252 successfully decodes the inspected task file |

The paper reports 10,100 unique task estimates for its analysis. That is not the raw
file's task count. Reconcile the authors' filtering rules before asserting an
analysis sample size; do not force the raw count to match the paper.

Source SHA-256:
- `Sip-task-info.csv`: `28621aa8b0ce05c270085a78e96a4d37f1bb39c1a5d260059ff3c197de961a4a`
- `est-act-dates.csv`: `4d5a5ea633969dd782ab3d6b2b0c6cf2fcc65d9bb1c22f332ac7d9abf5ead1e9`

These counts describe file structure, not eligible training examples or model quality.

## Proposed evaluation protocol

1. **Prediction point and target.** At the original task estimate, predict final
   actual effort in person-hours and report overrun as actual effort minus the
   original estimate. An optional binary diagnostic is actual effort exceeding
   the estimate; it is not a low/medium/high/critical risk label. Confirm whether
   HoursEstimate preserves the original estimate or a later revision. If this
   cannot be established, describe results as retrospective associations rather
   than evidence of prospective prediction.

2. **Unit and eligibility.** Use one record per TaskNumber. Reconcile repeated
   task-level fields before collapsing developer rows; quarantine conflicts.
   Do not sum repeated HoursActual values. Collapse identical date records and
   join explicitly by TaskNumber, validating join cardinality. Exclude cancelled,
   unfinished, invalid-date and nonpositive-estimate tasks from the primary
   completed-task analysis; report counts and resulting selection bias. Confirm
   status semantics before defining completed statuses. Valid zero actual effort
   must be reported separately, not silently removed.

3. **Feature boundary.** Start with HoursEstimate alone. Consider Category,
   SubCategory and Priority only after confirming availability at estimate time.
   Exclude HoursActual, DeveloperHoursActual, TaskPerformance,
   DeveloperPerformance, completion dates and final status from model inputs.
   ProjectCode is initially a grouping key, not a predictor. Exclude free-text
   Summary and person identifiers from the initial model.

4. **Splits.** Construct and freeze task-level manifests before model fitting.
   Use an earlier-period training set, subsequent validation period and latest
   eligible test period. Admit training labels only when CompletedOn precedes
   the next period's prediction cutoff. Keep every row of a task in one split.
   Separately evaluate transfer to held-out projects using project-grouped
   validation; describe this separately from forecasting future tasks in known
   projects. Fit preprocessing and tuning only on training/validation data.
   Choose exact cutoffs after checking eligible date and project coverage;
   record them before inspecting model scores.

5. **Baselines and metrics.** Compare the original estimate with a training-only
   median actual/estimate correction and a simple regularized model.
   Report task-level MAE in hours, median absolute error and signed error,
   alongside per-project results and sample sizes. Avoid percentage-error metrics
   that divide by zero actual effort. If publishing overrun probabilities, compare
   with training prevalence and assess Brier score and calibration. Quantify
   uncertainty accounting for project clustering; 20 project codes do not imply
   broad cross-organization coverage.

6. **Acceptance and reporting.** Freeze preprocessing, splits, metrics and any
   promotion threshold before opening the test results. This exploratory pilot
   has no production-promotion threshold yet. Report negative or inconclusive
   results; do not tune against the reserved test set. Preserve source hashes,
   exclusion counts, split membership, configuration and dependency versions.
   Single-company historical data cannot establish general project-risk accuracy.

## Next executable steps

1. Resolve and record dataset reuse terms with the data owner.
2. Reconcile original-estimate and status semantics with the source documentation.
3. Implement a standalone importer and baseline runner with task deduplication,
   explicit date joins and leakage checks; keep it outside production inference.
4. Freeze the evaluation manifest and run the approved pilot.
5. Review findings before proposing any production scope or acceptance changes.

License clarification requested on 09/25/2026 in
[Derek-Jones/SiP_dataset#2](https://github.com/Derek-Jones/SiP_dataset/issues/2).
The request covers training, commercial reuse, aggregate findings, model/data
redistribution, attribution and restrictions. That original inquiry included
commercial reuse, but our intended work is free, MIT-licensed research/development.
No SiP training has been performed; explicit terms remain unconfirmed. If permission
cannot be established, select an explicitly licensed dataset with observed effort
outcomes; requirements-risk labels are not a substitute for this target.
