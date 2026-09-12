# NFR evaluation and documentation anchor (#1116)

Use [the golden password-reset example](../examples/fixtures/nfr-golden/README.md)
as the designated recorded reference for #1113 evaluation and #1114's worked
example. It contains the source, neutral output, FDA 21 CFR Part 11 output,
provenance, live recapture commands and a deterministic regeneration check.

For #1113, join each variant's classification JSON to its own UCS JSON by source
path, not just step ID. Confidence values are uncalibrated model estimates;
these captures are inputs for evaluation, not independently reviewed labels.
For #1114, present the NFR Markdown reports side by side: the FDA variant adds
an attributable audit-trail pattern. Every unbound parameter remains a visible
NEEDS INPUT placeholder, not an approved numeric target or compliance claim.

Status: both captures and downstream byte-exact regeneration are available.
The owner accepted recorded-handoff regeneration as the reproducibility gate;
live LLM output is inherently nondeterministic, even at temperature 0. The owner directed
skipping post-generation feedback, so later aggregate reports are not captured.
The complete accepted capture scope is the eight files per variant through NFR
generation, with the subsequent interactive feedback loop intentionally declined.
