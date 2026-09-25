# Effort-overrun pipeline preparation

Standalone Python standard-library prototype. Not imported by the application.
No SiP files, upstream code, model weights or real-data results are included.
Selected replacement: ../../JOSSE-PILOT.md. The pinned profile_josse.py performs
read-only source checks; the chronological pipeline is not yet a JOSSE adapter.

Optional SiP reuse clarification: https://github.com/Derek-Jones/SiP_dataset/issues/2.
Protocol: ../../SIP-PILOT.md. SiP terms remain unconfirmed; pilot preparation now proceeds using JOSSE.

From repository root:

```sh
python -m unittest discover -s ai-insights/experiments/effort-overrun -v
```

The seven tests create synthetic records. They verify task deduplication without
summing repeated actuals, key-based date joins, conflicting/missing data quarantine,
label-availability cutoffs, finite effort and date checks, zero-actual reporting,
explicit CSV decoding/schema checks, and training-only baseline fitting.
No test establishes predictive validity. These tests supplement, not replace,
the required app Jest suite and are not yet wired to the app CI gate.

Library sequence after prerequisites are met: read_csv (explicit encoding and
source hash), prepare (explicit completed statuses and frozen date cutoffs), then
evaluate. The result retains task IDs and dates for split evidence and reports
exclusions separately. Features contain only estimated hours. evaluate compares
original estimates with a median actual/estimate correction fit only on training.
Signed error means predicted minus actual hours.

Before a real evaluation: confirm original-estimate/status semantics, implement
persisted manifests and provenance, add per-project reporting and a separate
project-held-out evaluation, define model/tuning protocol and uncertainty reporting,
and freeze criteria before opening the test results. There is no production
promotion decision or new risk severity mapping in this prototype.
