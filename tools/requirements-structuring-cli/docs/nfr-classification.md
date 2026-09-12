# FR/UCS quality-attribute classification

Issue #1108 consumes the existing [NFR input contract](nfr-input-contract.md)
and the read-only [taxonomy library](nfr-taxonomy.md). Each structured or UCS
step is a functional-requirement classification unit. Its JSON pointer within
the artifact identifies it even when different flows reuse a step ID.

Classification selects sub-characteristic IDs from taxonomy revision `0.1.0`
(ISO/IEC 25010:2023). The taxonomy currently requires human verification;
classification must carry that notice, not imply primary-standard approval.
The existing LLM client, provider configuration, flags and input validation are
consumed without modification.

This story emits attribute mappings only. NFR statement generation is #1109;
confidence-based review gates are #1111. Both remain follow-ups. The versioned output contract for #1109 is specified below.

## Versioned handoff for #1109

`NFRClassifier.classify(input, { attributes })` returns the object described
below. `NFRGenerator.run()` exposes the same object as `result.classifications`
and writes `<base>-nfr-classifications.json` next to `<base>-nfr-report.md` using
the existing contained output-path and safe-write helpers. The JSON object,
not the Markdown table, is the machine-consumption boundary.

| Field | Contract |
| --- | --- |
| `schemaVersion` | Classification contract `1.0.0` |
| `useCaseId`, `inputKind` | Original use-case ID; `structured` or `ucs` |
| `sourceTaxonomyVersion` | Required taxonomy revision `0.1.0` |
| `taxonomySha256` | SHA-256 of the loaded taxonomy file's UTF-8 bytes |
| `standardEdition` | `ISO/IEC 25010:2023` |
| `taxonomyReleaseStatus`, `accuracyNotice` | Unmodified taxonomy review status and accuracy notice |
| `promptVersion` | `1.0.1`, file `prompts/08-classify-quality-attributes-v1.md` |
| `characteristics` | Actual considered top-level IDs, in taxonomy order |
| `requirements` | One result per validated source step, in source traversal order |

Each `requirements` entry contains:

- `source.kind`: `structured` or `ucs`.
- `source.path`: JSON pointer to the exact source step, such as `/steps/0`,
  `/basicFlow/steps/0`, `/alternativeFlows/0/steps/0` or
  `/exceptionFlows/0/steps/0`.
- `source.stepId`: the original step ID. IDs need not be globally unique;
  consumers must join using use-case/artifact identity plus `source.path`.
- `source.flowId`: present only for UCS alternative/exception flows.
- `status`: `classified` when mappings exist, otherwise `unmapped`.
- `attributes`: zero or more objects with exactly `characteristic`,
  `subCharacteristic`, `confidence`, `sourceTaxonomyVersion`.

For example, a login step can have this `attributes` array (illustrative model
scores, not fixed expectations or default confidences):

```json
[
  {
    "characteristic": "interaction-capability",
    "subCharacteristic": "user-error-protection",
    "confidence": 0.72,
    "sourceTaxonomyVersion": "0.1.0"
  },
  {
    "characteristic": "security",
    "subCharacteristic": "authenticity",
    "confidence": 0.94,
    "sourceTaxonomyVersion": "0.1.0"
  }
]
```

Assignments are unique and sorted by taxonomy order. Confidence must be a finite
number in `[0, 1]`; missing, textual, out-of-range or non-finite scores fail.
These are uncalibrated model estimates. Zero and low confidence are retained;
`--confidence-threshold` is recorded without applying #1111's future review gate.
An empty array is an explicit unmapped result, not an invented classification.
No global confidence score or synthetic fallback assignment is emitted.

#1109 must validate this contract and taxonomy revision, retain source identity
and provenance, and select only applicable patterns from #1115. An unmapped FR
is a coverage gap to review, not permission to invent an NFR. This story does
not render patterns, draft NFR text, or determine legal/overlay applicability.
The result notice remains `NFR generation not yet implemented (#1109)`.

## Selection and provider behavior

The existing `--attributes` values are consumed as a list of top-level names or
IDs. Whitespace and case are normalized (`Interaction Capability` becomes
`interaction-capability`); duplicates collapse. Explicit values take precedence
over comma-separated `NFR_ATTRIBUTES` in the existing environment configuration.
When both are empty, all characteristics are considered. Unknown names, empty
list entries and sub-characteristic IDs used as top-level selectors fail before
any model call. Only selected characteristics appear in the prompt; an
out-of-subset response fails instead of being silently dropped.

The classifier loads the fixed prompt through `LLMClient.loadPrompt` and makes
one sequential `chatJSON` call per step with `mode: 'structure'`. Prompt data
includes the step, relevant flow metadata, use-case context and the selected
taxonomy. It contains no pattern or overlay bodies. Existing provider/model,
authentication, trace and retry behavior is inherited unchanged from the client.
Only `assignments` with sub-characteristic IDs and confidence are accepted in the
model response; unknown IDs, duplicate assignments, extra keys/NFR text, or unsafe
JSON fail. A malformed/missing taxonomy or revision mismatch also fails clearly.

Real classification now requires a configured provider and credentials through
the existing client. Help and `--list-overlays` still need neither input nor
credentials. Tests use a test-only provider preload or injected fake client;
production code has no offline fallback or test-mode switch. The pipeline's
existing phase order, early-exit gates and input/legacy validation are unchanged.

No partial classification artifact is written when a model response fails; all
step responses are validated before output creation. Existing output from a
previous successful invocation is not deleted by a later failure. Consumers
must use successful invocation results and retain the corresponding input
artifact; the JSON pointer does not identify a different revision of that input.

## Verification and extensions

From this CLI directory, run `npm ci` and `npm test`. The existing Requirements
CLI workflow runs that same suite on changes anywhere in this subtree. Tests
cover taxonomy errors, fixture mappings, every flow shape, subsets, confidence,
provider responses and the non-generative handoff. They establish boundary and
integration correctness, not statistical classification accuracy on a live model.
No live-provider evaluation was performed in this change.

A changed prompt or output contract requires a new recorded version and tests.
A taxonomy revision change requires an explicit supported-version update after
review; the classifier does not silently consume a newer edition. Taxonomy,
pattern, overlay and schema content remain owned by #1115.

## Response-shape compatibility (#1131)

The classifier requests an object containing only `assignments`. It also accepts
an entire, valid JSON array of assignments and normalizes it to that object.
Both shapes pass the same safe-JSON, taxonomy/subset, exact assignment-field,
confidence and duplicate checks. Empty arrays explicitly mean unmapped; invalid
JSON, unsafe keys, scalar roots and malformed assignments still fail. The shared
LLM client and public classification handoff are unchanged. Prompt patch 1.0.1
clarifies that even an empty response should retain the object wrapper.

A real gemini-2.5-flash reproduction at temperature 0 returned seven complete
assignment objects as a bare array for password-reset UCS `/basicFlow/steps/3`.
The response is preserved in `tests/fixtures/nfr-classification-array.json`.
It has no extra fields, duplicate/unknown IDs or missing/out-of-range confidence.
This establishes structural validity, not independent correctness of model scores.
The regression runs it through the real client JSON parser with only transport
stubbed. Built-in traces intentionally redact responses; a temporary diagnostic
wrapper captured the returned text locally without changing client internals.
No full prompts, credentials or diagnostic trace files are committed.
