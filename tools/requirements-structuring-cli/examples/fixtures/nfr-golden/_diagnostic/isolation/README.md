# Temporary isolation-experiment evidence

This directory holds temporary isolation-experiment evidence for issue #1116.
It is NOT part of the golden fixture. Delete this entire directory in a later
cleanup task before PR #1128 merges.

The A/B experiment is complete: four committed classification runs, 36 actual
live calls. See [findings.md](findings.md) for the bidirectional verdict and
limitations, [summary.json](summary.json) for individual measured sets and
counts, and [call-ledger.json](call-ledger.json) for actual invocations.

[hybrid-notes.md](hybrid-notes.md) records the owner-approved synthetic mapping;
hybrid-A/B-diff.json record every input change. Each hybrid was pushed before
use; each full result was pushed before analysis.

feasibility.md and mapping-discovery.md preserve historical blockers. C/D were
cancelled; the owner resolved the ambiguous B step by assigning FR4, with the
verbatim caveat in hybrid-notes.md. No C/D inputs or runs were created.
