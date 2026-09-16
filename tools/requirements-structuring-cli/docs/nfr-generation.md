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
handoff, unchanged), `<base>-nfr-candidates.json` (the rendered
`generation.candidates`, each with its `acceptanceCriterion` scaffold — see
below), and either an appended NFR section in the pipeline's own
`<base>.feature` or, if that file doesn't exist, a standalone
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
run — the existence/type check and the write are the same syscall, so nothing
can change the target in the window between a separate check and a later
write. The one exception is appending the NFR section to an already-existing
`<base>.feature`: that uses `O_APPEND` instead, so it never re-truncates the
file from content read moments earlier and can't discard a concurrent edit.
A failed non-force run rolls back exactly the outputs it created — identified
by the device/inode `writeSafe` captured at write time, not by path, so a file
another process put at one of those paths afterward is never collaterally
deleted — leaving pre-existing files (report, classifications, candidates, or
the standalone `.feature`) untouched.

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
