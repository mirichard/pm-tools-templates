# Golden NFR reference example (#1116)

The active source is `password-reset-input.md`, the owner's six functional
requirements for a single password-reset feature. It follows the section format
of `examples/web-store-input.md` but uses a documented new scenario. The earlier
laboratory-order source is no longer used; its history remains in Git.

The source's 30-minute reset-link validity and 12-character password rule are
supplied functional requirements, not invented NFR bindings. All generated NFR
targets, system names, scopes and measurement conditions remain exactly
`[NEEDS INPUT: <name>]`. No generated content has been manually edited.

## Captures and measured invariants

Both captures were generated on a base including #1137 (terminal flows), #1139
(source traceability), and #1155 (send-side classifier payload filtering), using
Gemini `gemini-2.5-flash`, structure and creative temperatures 0, traces disabled.
Both Phase 0 scans returned NEEDS CLARIFICATION with zero blockers and five
owner-approved UI-only warnings. The warning and Phase 2 gates were accepted;
Phase 3 feedback was declined. Later aggregate Markdown reports are therefore
not emitted. Each directory contains all eight artifacts through NFR generation:
ambiguity JSON/report, structured JSON, UCS JSON, tests JSON, Gherkin,
classification JSON, and the NFR Markdown report with coverage/missing-input gaps.

| Recorded measure | `neutral/` | `pci-dss/` |
|---|---:|---:|
| UCS steps / classified sources | 10 | 10 |
| Classification assignments | 70 | 73 |
| Covered characteristics | 6 | 5 |
| Generated candidates | 70 | 78 |
| Unbound placeholder bindings | 280 | 312 |

Neutral covers compatibility, functional suitability, interaction capability,
performance efficiency, reliability and security. It leaves maintainability,
flexibility and safety uncovered.

PCI-DSS covers compatibility, functional suitability, interaction capability,
reliability and security. It leaves performance efficiency, maintainability,
flexibility and safety uncovered. Neither capture contains accountability.

The unmatched-email alternative terminates after generic confirmation; it does
not proceed to reset-link access or password change. UCS steps and generated
tests/Gherkin retain the exact FR4 source reference, including “12 characters”,
“one letter”, and “one number”.

## Controlled PCI-DSS overlay comparison

These are independent live captures. A raw side-by-side report diff conflates
model variation with the overlay's contribution. Render the PCI-DSS run's own
classification handoff with both libraries to isolate the overlay: 73 neutral
candidates become 78 PCI-DSS candidates, retaining every core candidate.

All five additions use `pci-dss.confidentiality`, at:

- `/basicFlow/steps/1`
- `/basicFlow/steps/2`
- `/basicFlow/steps/4`
- `/basicFlow/steps/5`
- `/alternativeFlows/0/steps/0`

The pattern concerns post-authorization retention of sensitive authentication
data. This demonstrates overlay selection and provenance, not applicability to
a password-reset system or PCI DSS compliance. The library's measurement guidance
is not a supplied project threshold; all 312 bindings remain placeholders.

The previous `fda-21-cfr-11` demonstration was replaced because its sole pattern
keys on accountability, which this fixture does not currently produce. This
switch does not resolve whether the FDA/HIPAA overlays work for explicitly
auditable requirements. See the unresolved [accountability investigation #1163](https://github.com/mirichard/pm-tools-templates/issues/1163).

## Source integrity and evaluation use

The source SHA-256 is
`f722b387b595bcbf34d5e344f853ba4086d1ee6e92e7ea7ea3e1cdabf42c3f3d`.
The golden tests check the complete source hash and compare parser-owned source
catalogs with both structured/UCS handoffs, as well as exact coverage, counts,
placeholder values and overlay source paths. These are recorded fixture
invariants, not expectations that every live run must reproduce the same labels.
Use the [anchor guide](../../../docs/nfr-golden-example.md) for #1113's eval
inputs and #1114's worked example. Captured classifications are not expert labels.

## Business object scope: "Password" is not a separate business object

`password-reset-input.md`'s own `## Business Objects` list names `Password` as
a fourth entry, alongside `Account`, `Password Reset Link`, and `Login Session`.
The captured `structured.json`/`ucs.json` only carry the latter three — a
Copilot review flagged this as a possible stale/incomplete capture. It is not:
a second, fully independent live capture (fresh credentials, same source,
same `gemini-2.5-flash` at temperature 0) reproduced the identical
three-entry `businessObjects` array. Across two independent live runs, the
model consistently declines to promote `Password` to a top-level business
object, treating it instead as an attribute of `Account` — consistent with
the formal-structure schema's own guidance that `businessObject` names "the
real-world business entity being acted upon... NOT attributes like 'buyer
name'". This is accepted, reproducible model behavior, not a capture defect;
re-running live will not add it, and this fixture's own "no manual edits"
rule means the array is not hand-corrected to match the source's informal
list.

## Regeneration and its limits

From `tools/requirements-structuring-cli`, run:

```sh
node examples/fixtures/nfr-golden/verify-regeneration.cjs
```

This creates fresh temporary outputs from the recorded UCS/classification
handoffs using the unchanged test, Gherkin and NFR renderers. It compares six
derived files byte-for-byte (tests JSON, Gherkin, NFR Markdown in each variant)
and checks placeholder bindings. It makes no provider calls. The other five
files per variant are recorded provider artifacts, not independently regenerated
by this check. Live source-to-classification determinism is not claimed, even
at temperature 0; recorded-handoff replay is the accepted reproducibility scope.

To make new live captures with configured Gemini credentials:

```sh
capture_root=$(mktemp -d /tmp/nfr-golden-live-XXXXXX)
export SAVE_LLM_TRACES=false LLM_TEMPERATURE_STRUCTURE=0 LLM_TEMPERATURE_CREATIVE=0
node src/index.js pipeline examples/fixtures/nfr-golden/password-reset-input.md --provider gemini --model gemini-2.5-flash -o "$capture_root/neutral"
node src/index.js pipeline examples/fixtures/nfr-golden/password-reset-input.md --provider gemini --model gemini-2.5-flash --profile pci-dss -o "$capture_root/pci-dss"
diff -ru examples/fixtures/nfr-golden/neutral "$capture_root/neutral"
diff -ru examples/fixtures/nfr-golden/pci-dss "$capture_root/pci-dss"
```

Accept approved UI-only warnings, accept Phase 2, and decline Phase 3 feedback.
Stop for new functional blockers. Review all live differences before replacing
captures; do not silently normalize them or expect byte-identical live results.
