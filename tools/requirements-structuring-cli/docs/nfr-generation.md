# NFR candidate generation

Generation consumes the unchanged #1108 classification JSON contract and the
read-only #1115 library. It renders candidate statements, not approved or fully
bound acceptance criteria. Targets and measurement conditions are never guessed:
all unsupplied parameters use `[NEEDS INPUT: parameter]`. No binding-input
mechanism is introduced. Humans edit the report today.

Generation uses deterministic template substitution, with renderer version 1.0.0;
no generation LLM call or prompt is necessary. Classification still uses the
existing provider. #1110 integration (below) is implemented; #1111's review
gate is not.

## Selection, rendering and evidence

`src/nfr-candidates.js` validates the classification handoff and matches each
FR/sub-characteristic pair. All matching patterns are retained in lexical pattern
ID order, including explicitly selected additive overlay patterns; no core
pattern is replaced. Missing matches and unmapped FRs become report gaps.
Every declared token uses an explicit placeholder, including system and scope
because neither is an approved assessment binding in the classification handoff.
Each statement is associated with the exact use-case/source pointer and step ID.
Targets stay unbound even when an overlay schema constrains the allowable value.
Library measurement guidance and framework references are reproduced as guidance,
not claimed as supplied project conditions or compliance approval.

The report groups candidates by FR and characteristic. Each includes pattern ID,
library/taxonomy revisions, classification confidence, metric type, comparison,
unit and framework edition/section/reference. Coverage lists all nine
characteristics with zero candidates, unmapped FRs, missing matches, and every
candidate's unbound parameters. Having a candidate is not complete coverage or
proof of testability until humans fill and approve its placeholders.

## Output and re-run policy

`NFRGenerator.run` writes four artifacts into `-o`: `<base>-nfr-report.md`
(prose report), `<base>-nfr-classifications.json` (the classifier's raw
handoff, unchanged), `<base>-nfr-candidates.json` (the full `generation`
object returned by `generateCandidates` — renderer metadata and coverage
summary alongside the `candidates` array, each with its `acceptanceCriterion`
scaffold — see below), and either an appended NFR section in the pipeline's
own `<base>.feature` or, if that file doesn't exist, a standalone
`<base>-nfr.feature`. Generation makes no provider call; classification still
requires credentials. Rendering the same classification/library/overlay
produces identical candidates. A fresh classification can vary with the
provider; rendering determinism does not claim otherwise.

Before classification, existing NFR report, classification, candidates, or
(for the standalone-`.feature` case) Gherkin output blocks the run. Copy/archive
manual edits or use standalone `generate-nfr --force` to replace them
deliberately. No binding file, binding flag or interactive binding prompt is
added. The pipeline has no force flag: use a fresh output directory to retain
previous outputs. Earlier pipeline stages retain their existing behavior.

All four outputs share one safe-I/O layer (`src/nfr-output.js`): every write
opens the target with `O_NOFOLLOW` (refuses a symlinked destination) and
`O_NONBLOCK` plus a post-open regular-file check (refuses a FIFO or other
non-regular target rather than hanging or writing through it), and uses
`O_EXCL` (atomic create-or-fail) on a non-force run or `O_TRUNC` on a force
run. The existence/type guarantee and the write both act on the same
already-open file descriptor, with no path relookup in between — not one
single syscall, but no window between a separate check and a later write for
anything to change the target in. The two exceptions are the base
`<base>.feature` append and rebuild branches: `appendSectionIfMissing`
re-checks the section marker on its own freshly-opened descriptor immediately
before an `O_APPEND` write (never re-truncating the file from content read
moments earlier — a concurrent edit to the rest of the file survives), and
`rebuildSectionSafe` (the force+marker-present branch) similarly re-reads and
re-finds the marker on its own descriptor before truncating and rewriting,
rather than reusing a prefix computed from an earlier read. Neither makes the
read-decide-write sequence atomic across two genuinely concurrent process
invocations of this tool — that would need an inter-process lock, which this
redesign deliberately doesn't add (a stale lock left by a crashed process
would block every future run against that output directory, a worse
day-to-day failure mode than the narrow benign-race residual it would close;
the actual threat model here, a malicious symlink or FIFO, is fully closed
regardless of this residual). A failed non-force run rolls back exactly the
outputs it created — identified by the device/inode `writeSafe` captured at
write time, not by path, so a file another process put at one of those paths
afterward is not collaterally deleted in the common case — leaving
pre-existing files (report, classifications, candidates, or the standalone
`.feature`) untouched. A partial write (e.g. `ENOSPC`) is recovered from at
the point of failure: `writeSafe` removes a file it just created before
rethrowing, and `appendSectionIfMissing`/`rebuildSectionSafe` truncate back
to the pre-write length, so a failed write never leaves corrupt partial
content — including a truncated section that could fool a later run's own
marker check — behind.

Residuals this layer does not fully close, documented rather than hidden:
`O_NOFOLLOW` governs only a path's final component, so an ancestor directory
swapped for a symlink between path construction and the write is still
followed (narrowed, not eliminated, by re-deriving each path immediately
before its write); the rollback's own identity check is a
lstat()-then-unlink() pair, not a single atomic operation, so a same-path
replacement that happens to reuse the original file's exact device+inode
within that pair would still be removed; and, as above, two genuinely
concurrent invocations of this tool against the same output directory can
still both pass a marker check before either writes. The first two would
need directory-fd/openat or compare-and-unlink primitives Node's `fs` module
does not expose portably; the third is an accepted tradeoff, not a missing
primitive.

## Follow-up extension seams

#1110 (implemented): `NFRGenerator.run` consumes `result.generation.candidates`
after `generateCandidates`. Each candidate carries `metric`,
`acceptanceCriterion` (`{kind: 'quantifiable', metric, unit, operator,
threshold, measurement}` or `{kind: 'qualitative', criterion}`),
`unboundParameters`, source identity and provenance. `src/gherkin-generator.js`
renders the quantifiable candidates as `Scenario Outline` + `Examples` and the
qualitative ones as a plain `Scenario`/`Then`, wired into `.feature` output as
described above.

#1111: insert the confidence/review decision stage after generation and before
report writing. Stable candidate IDs combine use-case ID, source pointer and
pattern ID. Replace the interim force policy in `src/nfr-output.js` with explicit
review-decision preservation. No confidence gate, approval record, ratification,
or automated binding validation for human report edits exists in this story.

## Validation

Run `npm test` and `npm run validate:nfr-library` from the CLI directory.
The tests use real classification contracts with fixture provider responses;
no live model is needed to validate deterministic rendering.
