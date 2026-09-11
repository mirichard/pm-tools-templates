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
confidence-based review gates are #1111. Both remain follow-ups. The exact
versioned output contract for #1109 will be documented here alongside the
implementation before this PR is ready.
