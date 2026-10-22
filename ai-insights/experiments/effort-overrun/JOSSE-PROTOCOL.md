# Frozen exploratory protocol: josse-retrospective-v1

09/25/2026. Prepared before evaluating real validation/test scores. This is an
exploratory benchmark, not an approved production acceptance threshold or a
replacement for #1374's representative four-level risk-model evaluation.

## Units and eligible records

Use the pinned database SHA-256 in profile_josse.py. Its converter directly maps
Original Estimate and Time Spent CSV numbers without scaling. Jira's documentation
specifies seconds for both fields (including the historical Server 7.2 manual).
Convert each to person-hours by dividing by 3,600; do not convert calendar days
using an assumed workday length.

Sources:
- https://product-downloads.atlassian.com/software/jira/downloads/documentation/AdminJIRAServer072-170816.pdf
- https://support.atlassian.com/jira/kb/understand-how-the-original-estimate-field-value-is-calculated-when-viewing-the-data-export-in-jira-cloud/
- https://github.com/ml-see/josse/blob/main/dataset_replication/csv_2_sqlite.py

Nine available raw archive CSV members were inspected: 850 nonempty numeric
estimate/actual pair occurrences matched the database exactly. Three differed
only as Original Estimate 0 in CSV versus -1 in SQLite (JBPM-2571, JBPM-2031,
JBCACHE-433); all three are excluded by the positive-estimate rule. This is a
sample reconciliation, not verification of every row. No eligible-pair conflict
was found in this sample. Paper counts differ by two rows/pairs from the pinned
archive; the cause remains unverified. The benchmark uses the inspected snapshot,
not claimed replication of the paper's filtered dataset.

Include finite positive estimates and recorded actual effort, valid issue IDs,
and a source-host reference. Retain 3,914 rows; quarantine 415 positive pairs
without source host. Other 18,857 rows lack positive paired effort. No outlier
trimming, winsorizing or label-driven exclusion. Because zero actual is not
eligible here, results apply only to positive recorded effort, not all tasks.
Use estimated effort as the sole predictor; actual effort is only an outcome.
No issue text, comment counts, activity counts or date proxies are predictors.

## Frozen split

Group by source host and issue-key project prefix. Rank the 191 groups by SHA-256
of 'pm-tools-josse-v1-2026-09-25:' plus group key. First floor(0.6 * 191) groups
train; next floor(0.2 * 191) validate; remaining groups test. This yields 114 / 38 /
39 projects and 1,535 / 1,277 / 1,102 tasks. All rows of a project stay in one split.
There is no outcome-based balancing or rerolling to improve scores.

josse-manifest.json fixes group assignments, task-count and membership digests,
source hash, exclusions and protocol. The source hash plus deterministic group
map reproduces exact task membership without publishing raw issue text.
SQLite contains no timestamps; this split measures retrospective cross-project
transfer and cannot establish forecasting performance or label availability in time.

## Models and reporting

Compare three fixed baselines with no tuning:
1. Original task estimate.
2. Original estimate multiplied by training median(actual / estimate).
3. Constant training median(actual effort).

Fit parameters only on training. Report both validation and test once with no
model-selection step. Primary metric: mean of project MAEs, each project equally
weighted. Secondary: task-weighted MAE, median absolute error and signed error
(predicted minus actual), all in hours. Include project-level MAEs and counts.
Keep extreme errors visible. Report project wins/losses/ties versus original and
paired project-resampling percentile intervals for the macro-MAE difference,
2,000 draws, fixed seed 20260925. Intervals describe project-sample variability,
not a production confidence guarantee; tiny project groups and selection bias
limit interpretation. Negative difference favors the candidate.

No production promotion threshold is defined. A lower sample score does not
establish general reliability, temporal performance or risk-classifier accuracy.
Record unfavorable findings without altering this split. Changes to eligibility
or methodology require a new protocol version and acknowledgment that these
holdout outcomes are already inspected.

## Reproduce

From repository root with Python 3 standard library and the pinned local database:

```sh
python -m unittest discover -s ai-insights/experiments/effort-overrun -v
python ai-insights/experiments/effort-overrun/josse_benchmark.py evaluate /path/to/JOSSE_18092020.sqlite3 ai-insights/experiments/effort-overrun/josse-manifest.json --output /path/to/new-results.json
```

The runner refuses an unreviewed database, changed manifest, duplicate IDs and
existing result file. To reproduce manifest construction, use prepare mode with
a new manifest path and compare its JSON with the committed manifest. Do not
replace the frozen manifest after examining performance.

Attribution: Alhamed, Mohammed and Storer, Tim (2022), JOSSE, version 1.0,
https://doi.org/10.5281/zenodo.7022735, dataset CC BY 4.0. Derived processing here
filters records, groups projects and converts seconds to hours. Upstream software
also carries MIT copyright (c) 2021 Mohammed Alhamed and Tim Storer; no upstream
implementation is copied. Data notices remain separate from our MIT code.
