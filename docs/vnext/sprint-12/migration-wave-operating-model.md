# Migration Wave Operating Model

This operating model reduces the remaining domain migration from one-asset delivery batches to dependency-aware waves without weakening content integrity, compatibility, evidence, or rollback controls.

## Guardrails

- A wave contains 1–15 assets and normally targets one source batch and one primary domain.
- The planner records every source, destination, pre-move SHA-256 hash, dependency disposition, and rollback owner before execution.
- A missing dependency blocks the wave. Dependencies already migrated, included in the same wave, or intentionally deferred at a usable existing path are recorded explicitly.
- The wave is the production rollback boundary. Each asset retains an individual hash and move record for diagnosis.
- Maintained catalogs, mappings, references, legacy pointers, and the version-controlled evidence record change in the same delivery PR.
- Evidence text must be final before reviewed visual baselines are approved.
- The generated manifest starts with `phase: entry`. The migration PR changes it to `phase: executed`; CI then verifies destination hashes, execution batch IDs, and legacy-pointer resolution.

## Validation tiers

1. **Entry:** validate the generated manifest and baseline repository state.
2. **PR affected scope:** run migration validators, curated/canonical path checks, filtered links, focused tests, and affected-file visual regression.
3. **Wave exit:** require all PR checks and reviewed changed-image baselines.
4. **Post-merge:** verify canonical and legacy `/blob/main/...` paths, hashes, CI, and one comprehensive visual run.

The comprehensive visual suite remains mandatory once per merged wave. Evidence-only changes are completed before baseline approval so they do not create a second post-merge baseline cycle.

## Commands

Generate a wave definition:

```bash
node scripts/plan-migration-wave.mjs \
  --wave-id B1F \
  --batch 1 \
  --domain Stakeholder \
  --max-assets 12 \
  --rollback-owner mirichard \
  --output meta/migration-waves/b1f.json
```

Validate it before any move:

```bash
node scripts/validate-migration-wave.mjs --manifest meta/migration-waves/b1f.json
```

During execution, retain the recorded pre-move hashes and change the manifest phase to `executed`. The same validator then checks the post-move state.

Rollback after integration:

```bash
git revert <wave-merge-sha>
```

After rollback, regenerate migration metadata and the template index, rerun the complete validation suite, and record the revert SHA in #1057 and #711.
