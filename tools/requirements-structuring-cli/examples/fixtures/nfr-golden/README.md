# Golden NFR reference example (#1116)

The active source is `password-reset-input.md`, the owner's six functional
requirements for a single password-reset feature. It follows the section format
of the existing `examples/web-store-input.md` sample but uses a documented new
scenario. The earlier laboratory-order source was removed from this directory;
its history remains in Git and it is no longer used for fixture generation.

The source preserves the owner's 30-minute reset-link validity and 12-character
password rule. These are supplied functional requirements, not invented NFR
bindings. Generated NFR targets and measurement conditions must remain exactly
as the generator's NEEDS INPUT placeholders.

## Neutral capture

`neutral/` preserves the eight artifacts emitted by the live default run,
unchanged. Source commit: e1780547e007e2fd37461dfcc54fee9379bce536.
Provider: Gemini; model: gemini-2.5-flash; structure and creative temperatures: 0;
traces disabled. Phase 0 was READY (0 blockers, 1 password-rule warning).
The owner confirmed the six FRs are the entire functional scope and approved
proceeding past UI-only warnings. No additional source rules were invented.

The run produced 75 classifications/candidates across eight characteristics,
with 300 unbound placeholder bindings. Safety is uncovered. The post-generation
feedback gate was declined as directed: no interactive refinement was performed.
Consequently the CLI's later aggregate Markdown reports were not emitted; the
NFR Markdown, structured/UCS/test JSON and Gherkin are included as produced.
No generated content has been manually edited.

Overlay comparison and regeneration verification are pending.

## FDA capture and controlled overlay comparison

`fda-21-cfr-11/` preserves the eight artifacts of the second real pipeline run
with `--profile fda-21-cfr-11`. Phase 0 had zero blockers and five owner-approved
UI-only warnings; the warning gate was accepted and post-generation feedback
was declined. Both runs cover the same eight characteristics; Safety is absent.
FDA produced 72 assignments, 73 candidates and 292 placeholder bindings,
versus neutral's 75 assignments, 75 candidates and 300 bindings.

The differing assignment counts are live model variation, not overlay removal.
Rendering the FDA classification handoff with and without the overlay isolates
one addition: `fda-21-cfr-11.accountability` for `/basicFlow/steps/0`.
It adds a time-stamped, attributable record-change audit-trail coverage statement
with FDA framework provenance. Core patterns are retained, not overridden.
The target, scope, system and conditions remain explicit NEEDS INPUT bindings.
Library measurement guidance is not a supplied project threshold or a compliance
claim. All 292 FDA bindings remain placeholders.

## Regeneration and its limits

From `tools/requirements-structuring-cli`, run:

```sh
node examples/fixtures/nfr-golden/verify-regeneration.cjs
```

This makes fresh temporary output directories, invokes the unchanged test,
Gherkin and NFR renderers on the recorded UCS/classification handoffs, and
compares all six derived files byte-for-byte with the captures. All six passed.
It also verifies that every candidate binding remains an explicit placeholder.
It does not call or replace a provider, regenerate classifications from source,
or copy captured output files and call that regeneration. The five remaining
files per variant are recorded live-provider artifacts (ambiguity JSON/report,
structured JSON, UCS JSON, classification JSON), not independently regenerated
by this check. Thus deterministic downstream regeneration is proven, but the
original full-source reproducibility criterion is still unproven.

To make new live captures from the source (requires configured Gemini credentials):

```sh
capture_root=$(mktemp -d /tmp/nfr-golden-live-XXXXXX)
export SAVE_LLM_TRACES=false LLM_TEMPERATURE_STRUCTURE=0 LLM_TEMPERATURE_CREATIVE=0
node src/index.js pipeline examples/fixtures/nfr-golden/password-reset-input.md --provider gemini --model gemini-2.5-flash -o "$capture_root/neutral"
node src/index.js pipeline examples/fixtures/nfr-golden/password-reset-input.md --provider gemini --model gemini-2.5-flash --profile fda-21-cfr-11 -o "$capture_root/fda-21-cfr-11"
diff -ru examples/fixtures/nfr-golden/neutral "$capture_root/neutral"
diff -ru examples/fixtures/nfr-golden/fda-21-cfr-11 "$capture_root/fda-21-cfr-11"
```

Accept the approved UI-only warning gate if presented, accept Phase 2, and decline
Phase 3 feedback. Stop for new functional blockers. Never overwrite the committed
captures automatically. Live model responses can differ despite temperature 0:
these two runs already produced different warnings and assignment counts. Such
differences require review; they are not silently stripped from comparisons.
A repeatable live-from-source output or an explicitly agreed recorded-handoff
reproducibility criterion is still needed for the original Step 6 gate.
