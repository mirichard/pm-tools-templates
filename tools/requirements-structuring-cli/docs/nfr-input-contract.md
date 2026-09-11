# NFR Input Contract

This document defines the input boundary for `generate-nfr` (#1112), used by
classification (#1108) and generation (#1109). The contract is maintained in
Git with `src/nfr-input.js`; it is not a version field in the input JSON.

## Design decisions

- Reuse the Phase 1 `*-structured.json` and Phase 2 `*-ucs.json` artifacts.
  Validate their fields directly: neither currently carries a version marker,
  and this feature will neither require nor add one.
- UCS `useCaseName` is **not required**. `UCSTemplate.toJSON()` omits it;
  `intent` supplies the context and `useCaseId` supplies identity. Formal
  structure retains its existing required `useCaseName` field.
- Legacy/pre-contract detection will use missing required structural fields,
  not a missing version or an inferred creation date. Complete existing
  artifacts remain valid regardless of age.
- Preserve the existing Commander, dotenv, LLMClient, report writer, phases,
  and interactive gates. Overlay selection uses the #1115 curated review-candidate library;
  neutral remains the default and domain overlays require explicit selection.

## Accepted artifacts and required fields

The standalone command takes **one** JSON artifact, not a directory, raw
requirements Markdown, test-case array, or an invented wrapper. The pipeline
passes Phase 2 `ucs.toJSON()` after test-case/Gherkin generation, before the
Phase 3 feedback gate. Existing Phases 0–5 and their order stay intact.

| Artifact | Required shape |
| --- | --- |
| Phase 1 `*-structured.json` | Object with non-empty string `useCaseId`, non-empty string `useCaseName`, and non-empty `steps` array. |
| Phase 2 `*-ucs.json` | Object with non-empty strings `useCaseId`, `intent`, `role`; `preconditions` and `postconditions` arrays of strings (empty allowed); `basicFlow` object with a non-empty `steps` array. |
| Every step in either artifact | Object with non-empty strings `stepId`, `actor`, `action`, `businessObject`. |
| UCS alternative/exception flow, when supplied | Object with non-empty strings `flowId`, `deviationPoint`, `triggerCondition`, and non-empty `steps` validated as above; optional string `rejoinPoint`. |

UCS is identified by the presence of `basicFlow`, `intent`, or `role`; otherwise
the document is interpreted as formal structure. A document with both UCS
fields and top-level `steps` is rejected as ambiguous.

Optional fields are preserved, not classified or rewritten:

- Both: `businessObjects`, when present, must be an array of strings.
- UCS: `useCaseName`, when present, must be a non-empty string;
  `relatedUseCases` is an optional string array. `alternativeFlows` and
  `exceptionFlows` are optional arrays (empty allowed).
- Steps: `toActor`, `precondition`, `postcondition`, `refUseCaseId`, and
  `description`, when present, must be strings. Formal steps also permit string
  `previousStep`, `deviationPoint`, `rejoinPoint`, and `flowType` restricted to
  `basic`, `alternative`, or `exception`.
- Additional fields are retained subject to the existing JSON safety limits.
  This boundary checks data shape, not 25010 taxonomy, flow semantics, or
  classification/generation correctness.

`useCaseName` is **not required for UCS** because the runtime model intentionally
serializes `intent` instead. Requiring the sample's extra `useCaseName` would
reject actual pipeline output. Formal structure still requires `useCaseName`
as specified by `schemas/formal-structure.schema.json`. These decisions are
part of the contract consumed by #1108/#1109.

## Failure behavior

Missing arguments/files fail with a missing-input message. Unreadable or
malformed JSON fails with a file/JSON message. Unsafe JSON, wrong field types,
empty required strings/step arrays, and ambiguous artifacts fail with an
`Invalid NFR input` message identifying the boundary or field. All failures exit
non-zero, before an NFR report is written. Re-run `structure` and `transform`
(or `pipeline`) from the original requirements and correct upstream fields
if they are still incomplete. No input file is modified.

## Legacy/pre-contract compatibility

There is **no reliable artifact-age signal**: old and current outputs have no
version marker. Complete v1.1.0 artifacts are accepted, including runtime UCS
without `useCaseName`. Do not add a version field to make an input pass.

The concrete legacy/incomplete signals, after JSON safety validation, are:

1. A recognized UCS object (non-empty `useCaseId` and at least one of
   `intent`, `role`, `basicFlow`, without top-level `steps`) is missing
   `basicFlow` or `basicFlow.steps`, or has a bare `basicFlow` array rather
   than `{ "steps": [...] }`.
2. A recognized formal structure (non-empty `useCaseId`, a `useCaseName`
   property, no UCS discriminator) is missing the top-level `steps` property.

These fail distinctly with `Legacy/incomplete NFR input (pre-contract shape)`
and instructions to re-run structuring/transformation. They identify an
incompatible shape, **not proof that a file is old**; a newly incomplete file
can trigger the same message. Present-but-invalid fields (for example
`steps: null`, an empty step array, or a step missing `action`) remain ordinary
contract-validation errors. Missing UCS `useCaseName` never triggers either
error. No legacy input is silently migrated or modified.
