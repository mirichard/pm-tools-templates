# Asset Migration and Cross-Reference Plan

**Issues:** #737, #738
**Status:** Design ready for validation; no physical moves authorized
**Baseline:** `meta/domain-mapping.json` (137 cataloged assets)

## Scope and design decision

This plan covers every asset in the authoritative 137-item domain mapping. The proposed target is a domain navigation layer under `domains/<domain>/...`, retaining the complete original relative path below the domain to prevent filename collisions. The migration inventory is generated at `meta/migration-inventory.json`; it is the source-to-destination register for every proposed move and includes dependencies plus inbound Markdown references found in tracked files.

Physical relocation is deliberately separated from design approval. Until a batch is approved, original paths remain canonical and `meta/cross-references.json` provides non-breaking domain and workflow discovery. No file is moved by this Sprint 10 change.

## Controls applicable to every batch

**Entry criteria**

1. Batch inventory is approved and every source exists.
2. Target paths are collision-free and stay inside the repository.
3. Inbound links and dependent assets are enumerated.
4. A commit/tag identifies the pre-batch state and the rollback owner is named.
5. Link, duplicate, metadata, and cross-reference validators pass before change.

**Execution**

1. Move with version-control-aware operations; do not copy canonical content.
2. Leave a lightweight legacy-path README pointer or repository-supported redirect where the former path is user-facing.
3. Update inbound references in the same commit.
4. Regenerate indexes and cross-references.

**Exit criteria**

- Every planned source has exactly one target and no duplicate canonical copy.
- All tracked relative Markdown links resolve in both forward and backward navigation.
- Legacy entry paths provide a usable pointer to the canonical target.
- Template index, domain map and cross-reference validation pass.
- A sampled user journey can find the asset from legacy, domain, and workflow entry points.

**Rollback**

Revert only the batch commit, restore the generated indexes from the pre-batch commit, and rerun the same validators. Because batches do not delete unique content and legacy pointers are committed with their moves, rollback is atomic and independently testable. Do not start a later batch until the previous batch meets its exit criteria.

## Dependency-ordered batches

| Batch | Scope | Dependency | Risk | Verification | Rollback boundary |
|---|---|---|---|---|---|
| 0 | Generate inventory and cross-reference navigation; no moves | Domain taxonomy and mapping | Low | Generator determinism, schema/path/link checks | Revert generated metadata commit |
| 1 | Planning and Stakeholder assets | Batch 0 | Medium | Validate prerequisites and business-case/charter links | One batch commit |
| 2 | Team and Uncertainty assets | Batch 1 | Medium | Validate risk, stakeholder and team workflow links | One batch commit |
| 3 | Delivery assets | Batches 1–2 | High due to 69 mapped assets | Full link and legacy-path suite; staged subsets ≤20 assets | One commit per subset |
| 4 | Measurement assets | Batch 3 | High due to downstream reporting links | Benefits/KPI/dashboard discovery and calculation regression | One batch commit |
| 5 | Repository-wide reconciliation | Batches 1–4 | Medium | Duplicate scan, indexes, navigation journeys and coverage report | Revert reconciliation only; prior batches remain reversible |

Referenced assets move before referencing assets within a batch. Where two assets are mutually related, move them in the same atomic subset.

## Cross-reference contract and coverage denominator

`meta/cross-references.json` is machine-readable. Every record contains:

- `prerequisites`
- `related_assets`
- `complementary_assets`
- `previous_workflow_step`
- `next_workflow_step`

Coverage denominator is all unique existing paths in `meta/domain-mapping.json` at generation time. An asset is covered only when all five fields exist and at least one field supplies a valid navigational target; empty arrays are valid schema but do not count as covered. The reproducible target is at least 80% (`covered / denominator × 100`). Broken targets, asymmetric `related_assets`, duplicate source records, or absent source files fail validation.

## Backward compatibility and duplicate prevention

- No move is performed without a same-change legacy pointer and inbound-link updates.
- The current template index remains the discovery source until each migration batch passes.
- A canonical source must never coexist with a copied canonical destination; the legacy artifact contains navigation only.
- Content hashes are checked during execution to identify accidental duplicate templates. Same content is allowed only when the inventory explicitly classifies one path as a legacy pointer.

## Approval and residual risks

The domain taxonomy and mapping exist, but this move design requires maintainer approval before physical execution. Main risks are the size of the Delivery batch, links assembled dynamically by applications, and external bookmarks that repository checks cannot observe. Mitigations are small subsets, legacy pointers, telemetry/feedback where available, and independent rollback commits.
