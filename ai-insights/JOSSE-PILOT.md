# JOSSE replacement dataset assessment

09/25/2026 · #1374 / PR #1378 · Selected for the separate exploratory effort-overrun
pilot. SiP's maintainer response is no longer a prerequisite for this pilot's
preparation. This selection does not validate the existing four-level risk model.

## Source and permitted use

Alhamed, Mohammed and Storer, Tim (2022), JOSSE: A Software Development Effort
Dataset Annotated with Expert Estimates, version 1.0, published 08/25/2022.
DOI: https://doi.org/10.5281/zenodo.7022735.
Source repository: https://github.com/ml-see/josse.

The Zenodo API metadata at https://zenodo.org/api/records/7022735 explicitly
sets metadata.license.id to cc-by-4.0. The archive and source repository also
contain LICENSE.md, an MIT license with copyright (c) 2021 Mohammed Alhamed
and Tim Storer. Preserve the dataset's CC BY 4.0 attribution and modification
notice; retain MIT notices for any reused upstream software. Our project remains
free and MIT-licensed; do not relabel third-party data as exclusively our MIT work.
No commercial use requirement is being imposed on this pilot.

CC BY 4.0: https://creativecommons.org/licenses/by/4.0/.
Upstream MIT notice: https://github.com/ml-see/josse/blob/main/LICENSE.md.
Data provenance is explicit enough to proceed with research preparation without
waiting for an author response. No upstream code or issue corpus is copied into
this repository, and no model was fitted during this assessment.

## Inspected files and reproducibility

Archive: JOSSE_Dataset.zip, published size 193,085,891 bytes and published MD5
4673967bed8c9b7ab360bbe0e8d97206. The archive transfer was intentionally stopped
once relevant members were available; the full-archive MD5 was NOT verified.
The central directory was read using an HTTP range request. Extracted database,
README, license and conversion-script members passed their ZIP CRC checks;
SQLite PRAGMA integrity_check returned ok. Database SHA-256:
38f9ed6021889d99a322a62f878d202eed8dad278144807a4cd74ff58943a30f.

The pinned profiler opens the database read-only and rejects another source hash:

```sh
python ai-insights/experiments/effort-overrun/profile_josse.py /path/to/JOSSE_18092020.sqlite3
```

Download/extract the named database from the DOI archive; verify the archive MD5
when downloading the full archive. Source files remain outside the app and repo.

| Structural check | Observed result |
| --- | --- |
| Database task rows | 23,186 |
| Positive finite estimate and actual effort pairs | 4,329 |
| Candidate pairs with valid issue key and source host | 3,914 |
| Source-host/project-prefix groups among candidates | 191 |
| Positive pairs lacking source host | 415, quarantined by profiler |
| Other rows without positive paired effort | 18,857 |
| Estimate/start/completion timestamps in SQLite | Absent |

The paper reports 23,184 rows / 4,327 estimates. Preserve the inspected file counts
and reconcile the discrepancy; do not silently force them to match the paper.
Project groups use source host plus issue-key prefix, not developer identity.
Counts are structural eligibility checks, not final training counts or accuracy.

## Target fit and limitations

The source conversion script maps Original Estimate to expert_estimated_effort
and Time Spent to actual_effort. These are issue-level effort observations,
not whole-project risk labels. They support estimate-versus-actual comparison.
Only the paired subset can support an overrun baseline; missing estimates must
not be replaced with actuals or treated as zero estimates.

The database also contains corpus, num_comment and num_activities. Exclude those
from initial predictors: text and activity may reflect post-completion information.
Use estimate alone for the initial baseline; actual effort is an outcome only.
The accompanying paper reports reviewing estimate changes for outcome leakage,
but that does not supply row-level estimate timestamps in the SQLite export.

Before reporting MAE in hours, reconcile numeric storage units against raw CSV
and work logs. The converter copies numeric fields without conversion; paper prose
mentions hours and a table mentions minutes. Do not assume either wording directly
describes the stored numeric scale. Retain original numeric values in profiling.

Use a project-held-out retrospective benchmark if proceeding from SQLite alone.
Do not fabricate dates or pass these records into the existing chronological
prepare() function. Prospective time-based evaluation requires the raw records'
estimation/completion history and label-availability checks. Logged effort is
self-reported and the paired subset is selected; generalization is limited.

## Alternatives screened

| Candidate | Disposition |
| --- | --- |
| JOSSE | Selected: explicit license, estimated/actual effort pairs, inspectable source conversion |
| Itemlet (https://zenodo.org/records/19411554) | CC BY 4.0 alternative; broad issue dataset with multiple effort proxies and derived fields, requiring a separate target/leakage assessment |
| SiP | Keep optional inquiry open; terms remain unconfirmed, not known to prohibit use |
| NASA/Maxwell-style effort datasets | Actual-effort estimation benchmarks alone do not establish a paired original-estimate overrun target |

## Next steps

1. Reconcile stored units, raw-source count differences and missing source hosts;
   retain exclusions and their effect on project coverage.
2. Freeze a project-grouped exploratory protocol with original-estimate and
   training-only median-correction baselines, per-project results and uncertainty.
   Record the split and criteria before inspecting model scores. No production
   promotion threshold is implied by a retrospective benchmark.
3. Add a JOSSE adapter with explicit schema, units and provenance. Do not manufacture
   chronology or treat the existing SiP-oriented importer as a drop-in adapter.
4. Run and report the exploratory baseline, including negative results. Use raw
   dated records for a later temporal evaluation only if semantics are verified.
5. Continue #1374's separate representative-data, target-definition, calibration
   and reviewer prerequisites for the actual risk classifier. No restoration gate
   is closed by this dataset selection.
