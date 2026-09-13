# Source requirement traceability

Flow entries returned by the parser contain `id`, `originalText` (the original
line before prefix stripping, excluding LF/CRLF line delimiters), and normalized `text`. Other parsed lists remain
strings. The full `rawText` input remains unchanged. An explicit leading label such as `FR4:` becomes the ID; unlabeled
basic, alternative, and exception entries use `BF-1`, `AF-1`, and `EF-1`.
Duplicate labels are errors. Positional IDs are stable for unchanged input,
not across insertions or reordering; explicit labels survive reordering.

The structure, business-object correction, and UCS prompts require
`sourceRequirementId` on every generated step when source records are present.
Each prompt now has an explicit 1.0.0 version header and matching exported
constant; these three prompts were previously unversioned.

After each response, `source-traceability.js` resolves that ID against a map
created from the input catalog **before** the call. Code overwrites `sourceText`
and `sourceRequirements` from that map, ignoring any model-authored replacement.
The catalog is persisted in structured JSON so standalone transformation can
carry the original lines without requiring the Markdown file again. Persisted
catalogs are user input, not cryptographically authenticated provenance.

Missing, malformed, or unknown source IDs cause an error identifying the stage,
step, and ID. A wrong-but-valid ID is NOT detectable: citing FR3 for a step
actually derived from FR4 still resolves. Membership also does not prove all
source requirements were covered, or support exact attribution of a step derived
from multiple source requirements. This implementation uses one source ID per
step and permits multiple steps to reference the same source requirement.

UCS JSON retains `sourceRequirementId` and `sourceText`. Generated test JSON
retains them too; terminal test summaries and Gherkin comments show the original
requirement. These references preserve quantified constraints for review without
inventing executable assertions from a potentially conditional source sentence.
They do not automatically implement or verify that sentence in a step definition.
Existing generated step descriptions and expected results remain model-derived.

The new schema properties are optional for legacy files. Fresh structuring is
strict; transformation with a source catalog is strict. Legacy transformation
without a catalog continues without claiming source provenance, and discards any
source metadata the model invents. Legacy UCS files still work in the generators.
External consumers of the parser's flow arrays must use entry.text instead of
assuming each entry is a string. Existing UCS consumers retain their prior shape.

The guarantee ends at the initial UCS and its generated test/Gherkin artifacts.
The later optional feedback/refinement model phase is not covered by this change
and may alter or omit metadata. No fixture regeneration is included.

## Verification

Run `npm test --prefix tools/requirements-structuring-cli` from the repository
root. The source-traceability tests use offline model responses and exercise the
real CLI error path. No API credentials are required for those tests.
