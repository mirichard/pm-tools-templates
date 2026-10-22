# JOSSE exploratory baseline results

09/25/2026 · #1374 · Conclusion: these baselines do not establish improved estimation.
No production model, risk-class mapping or restoration acceptance is delivered.

Protocol and manifest were committed remotely before real-data score evaluation:
[fbe2d0bfb5edcdfc60bd687f18ed6a3a87f90080](https://github.com/mirichard/pm-tools-templates/commit/fbe2d0bfb5edcdfc60bd687f18ed6a3a87f90080).
See JOSSE-PROTOCOL.md, josse-manifest.json and josse-results.json in this directory.
The results file records protocol, source/manifest identity, fitted parameters,
project-level MAEs and project-bootstrap comparisons. Python standard library;
12 synthetic pipeline/benchmark checks pass. No app runtime was changed.

## Source and eligibility

Pinned database SHA-256:
38f9ed6021889d99a322a62f878d202eed8dad278144807a4cd74ff58943a30f.
Jira numeric time fields are seconds; converted to hours by dividing by 3,600.
Nine raw CSV files provided 850 exact numeric-pair matches and three missing-value
sentinel differences, all already excluded. This is partial source reconciliation.
The paper/archive count difference remains unexplained; this is not a reproduction
of the paper's filtered cohort or reported performance.

Retained 3,914 positive estimate/actual pairs with valid source-host/project keys.
Excluded 18,857 records lacking positive pairs and 415 pairs lacking source hosts.
The frozen project-held-out split is 1,535 training tasks / 114 groups; 1,277
validation tasks / 38 groups; 1,102 test tasks / 39 groups. No dates were inferred.

## Results

MAE means mean absolute error in person-hours. Project-macro MAE averages each
project's MAE equally; task MAE weights every task equally. These answer different
questions because projects vary in size. Lower is better for both.

| Split / baseline | Project-macro MAE | Task MAE | Median absolute error | Mean signed error |
| --- | ---: | ---: | ---: | ---: |
| Validation: original estimate | 18.59 | 8.62 | 1.00 | +3.56 |
| Validation: median-ratio correction | 18.59 | 8.62 | 1.00 | +3.56 |
| Validation: constant median effort | 18.00 | 9.23 | 2.50 | -7.74 |
| Test: original estimate | 10.94 | 5.11 | 1.00 | +2.12 |
| Test: median-ratio correction | 10.94 | 5.11 | 1.00 | +2.12 |
| Test: constant median effort | 7.73 | 6.55 | 2.08 | -4.81 |

Training median(actual / estimate) was exactly 1.0. The correction therefore
made identical predictions to the original estimates, not improved predictions.
Training median actual effort was 3.0 hours. This constant predictor lowered the
sample project-macro MAE, but worsened task-weighted MAE and median absolute error
in both held-out splits. On test projects it improved 7, tied 2 and worsened 30.
The prespecified project-bootstrap difference interval includes zero in both
validation and test: improvement on the primary metric is inconclusive. A few
large project-level errors can dominate the arithmetic mean even while most
projects worsen; do not report the lower sample mean as general improvement.

Signed error is predicted minus actual: positive means overestimation. Logged
actual effort may be incomplete, and positive paired records are a selected
subset. Confidence in transfer beyond this retrospective cohort is low.

## Decision and continuation

Retain the original estimate as the reference baseline. Do not promote the
constant predictor or change app predictions from these results. This experiment
establishes a reproducible comparison, not an accurate replacement model.

The test set is now inspected. Preserve the v1 results and split. Next research
should diagnose coverage and data quality using training/validation only, recover
verified estimate/completion history for a prospective evaluation, and define any
new features/model before reserving a fresh acceptance set. Do not select a new
split, filter out unfavorable outliers or tune model parameters to these results.
The original four-level project-risk target still needs its own representative
labels, agreed calibration/accuracy criteria and reviewer under #1374/#1329.
Runtime/SIT/UAT work can continue independently; PRs #1377/#1378 remain draft.

To reproduce, use the command in JOSSE-PROTOCOL.md with a new output path.
The pinned database is downloaded from the DOI record, not committed here.

Attribution: Alhamed, Mohammed and Storer, Tim (2022), JOSSE version 1.0,
https://doi.org/10.5281/zenodo.7022735, dataset CC BY 4.0
(https://creativecommons.org/licenses/by/4.0/). Changes: eligibility filtering,
seconds-to-hours conversion, project grouping and derived aggregate statistics.
These source-data notices remain separate from the repository's MIT code license.
