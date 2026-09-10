# NFR Input Contract

This document defines the input boundary for `generate-nfr` (#1112), used by
classification (#1108) and generation (#1109). Implementation is in progress.

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
  and interactive gates. Overlay content belongs to #1115; only neutral core
  is available in this skeleton.
