# NFR Taxonomy and Pattern Curation

Taxonomy structure and sub-characteristic descriptions are reconstructed from secondary/public sources, not the primary ISO/IEC 25010:2023 document (paywalled). REQUIRES human verification against the purchased standard before being treated as authoritative for a released product.

This library is a review candidate for #1115, part of #1107. Classification
(#1108) and generation (#1109) are separate follow-ups. No primary ISO text was
accessed or transcribed. Public descriptions will be paraphrased and cited per
entry, with unresolved coverage marked `UNVERIFIED — needs source`.

Data will use versioned JSON and draft-07 schemas, consistent with this tool.
The neutral core and opt-in overlays remain separate. The existing
`src/nfr-overlays.js` registry and `--profile`/`--overlay`/`--list-overlays`
interface are the integration boundary. Selecting an overlay is not a claim
of regulatory applicability or compliance.
