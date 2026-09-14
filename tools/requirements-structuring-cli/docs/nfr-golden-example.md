# NFR evaluation and documentation anchor (#1116)

Use [the golden password-reset example](../examples/fixtures/nfr-golden/README.md)
as the designated recorded reference for #1113 evaluation and #1114's worked
example. It contains the source, neutral output, PCI-DSS output, provenance,
live recapture commands and a deterministic regeneration check.

For #1113, join each variant's classification JSON to its own UCS JSON by source
path, not just step ID. Confidence values are uncalibrated model estimates;
these captures are inputs for evaluation, not independently reviewed labels.

For #1114, explain that the neutral and PCI-DSS captures are independent live
runs. A raw side-by-side report diff conflates model variation with the overlay's
contribution. The same-handoff comparison—rendering the PCI-DSS run's own
classifications through both the neutral and PCI-DSS libraries—isolates the
actual overlay addition: 73 candidates without the overlay versus 78 with it.
The five added candidates use `pci-dss.confidentiality` at `/basicFlow/steps/1`,
`/basicFlow/steps/2`, `/basicFlow/steps/4`, `/basicFlow/steps/5`, and
`/alternativeFlows/0/steps/0`. Core candidates are retained.

Every unbound parameter remains a visible NEEDS INPUT placeholder, not an
approved numeric target or compliance claim. The PCI-DSS pattern demonstrates
library selection; this password-reset example does not establish PCI scope
or compliance, or resolve the separate accountability investigation linked in
the fixture README.

Recorded-handoff regeneration is the reproducibility gate: live LLM output is
inherently nondeterministic, even at temperature 0. Post-generation feedback was
declined, so later aggregate reports are not captured. The complete capture
scope is the eight files per variant through NFR generation.
