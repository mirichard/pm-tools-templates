# NFR candidate generation

Generation consumes the unchanged #1108 classification JSON contract and the
read-only #1115 library. It renders candidate statements, not approved or fully
bound acceptance criteria. Targets and measurement conditions are never guessed:
all unsupplied parameters use `[NEEDS INPUT: parameter]`. No binding-input
mechanism is introduced. Humans edit the report today.

Generation uses deterministic template substitution, with renderer version 1.0.0;
no generation LLM call or prompt is necessary. Classification still uses the
existing provider. No #1110 integration or #1111 review gate is implemented.

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

Both entry points append candidate sections to `<base>-nfr-report.md` in `-o`.
The existing `<base>-nfr-classifications.json` handoff remains unchanged.
Generation makes no provider call; classification still requires credentials.
Rendering the same classification/library/overlay produces identical candidates.
A fresh classification can vary with the provider; rendering determinism does not
claim otherwise.

Before classification, existing NFR report or classification output blocks the
run. Copy/archive manual edits or use standalone `generate-nfr --force` to replace
them deliberately. No binding file, binding flag or interactive binding prompt
is added. The pipeline has no force flag: use a fresh output directory to retain
previous outputs. Earlier pipeline stages retain their existing behavior.
Exclusive report creation protects against concurrent non-force runs, and links
or non-regular output files are rejected. Output of the report and classification
JSON is not a multi-file transaction: a later disk-write error can leave a report;
a subsequent run will block on it instead of silently overwriting it.

## Follow-up extension seams

#1110: consume `result.generation.candidates` after `generateCandidates` in
`NFRGenerator.run`. Each candidate exposes `metric`, `unboundParameters`, source
identity and provenance. Add metric scaffolding/Gherkin integration there only
in that story; current code merely carries existing pattern metadata.

#1111: insert the confidence/review decision stage after generation and before
report writing. Stable candidate IDs combine use-case ID, source pointer and
pattern ID. Replace the interim force policy in `src/nfr-output.js` with explicit
review-decision preservation. No confidence gate, approval record, ratification,
or automated binding validation for human report edits exists in this story.

## Validation

Run `npm test` and `npm run validate:nfr-library` from the CLI directory.
The tests use real classification contracts with fixture provider responses;
no live model is needed to validate deterministic rendering.
