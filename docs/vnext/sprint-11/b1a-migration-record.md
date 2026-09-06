# B1A Migration Execution Record

- Issues: [#1057](https://github.com/mirichard/pm-tools-templates/issues/1057) (parent [#711](https://github.com/mirichard/pm-tools-templates/issues/711))
- Batch: `B1A`
- Asset count: `1`
- Rollback owner: `mirichard`
- Status: **PASS (local, pre-integration)**
- Delivery PR: [#1076](https://github.com/mirichard/pm-tools-templates/pull/1076)

## Checkpoint A — Baseline

- `main_base_sha`: `3b3cc916fa1ddd7329c165993ae1c4d98c31d8c2`
- `pre_batch_sha` (empty branch checkpoint based on the main baseline): `724a25a2d15c017ac5e6b44365b9467495a8aa3c`
- `b1a_implementation_sha`: `a254fae57b4fa9a08c30c3dcff5ba6d4969c07bf`
- `integrated_main_sha`: pending merge and post-merge validation
- Legacy source path: `project-lifecycle/01-initiation/stakeholder-analysis/stakeholder-register-template.md`
- Canonical destination path: `domains/stakeholder/project-lifecycle/01-initiation/stakeholder-analysis/stakeholder-register-template.md`
- Recorded pre-move source SHA-256: `64d7a7d1a8096b3d7f3410162abd61e7fc88e953c8ddae1935a47e786c7d3a57`
- Inbound references re-derived to `22` current references (reconciled against the prior 21 inventory-listed references; +1 from this B1A execution record).
- Baseline domain counts: Stakeholder `11`, Team `9`, Delivery `69`, Planning `8`, Uncertainty `13`, Measurement `27`

## Checkpoint B/C — Move and compatibility

- `git mv` executed for the canonical asset.
- Old path recreated as a navigation-only Markdown pointer.
- Pointer target (relative): `../../../domains/stakeholder/project-lifecycle/01-initiation/stakeholder-analysis/stakeholder-register-template.md`
- Destination SHA-256 verified equal to recorded pre-move source SHA-256.

## Checkpoint D — Canonical references

Updated to canonical destination:

- `meta/domain-mapping.json`
- `meta/value-flow-mapping.json`
- `meta/cross-references.json`
- `meta/migration-inventory.json`
- `templates/templates.json`
- `onboarding/template-index.json`
- `docs/getting-started/template-selector.md`
- `docs/templates/stakeholder-register-template.md`

## Checkpoint E/F — Validation and decision

Validation command suite (post-move):

```bash
node scripts/generate-sprint-10-metadata.mjs
git diff --exit-code -- meta/migration-inventory.json meta/cross-references.json
node scripts/validate-sprint-10.mjs --require-annotations
node scripts/validate-curated-templates.js
npm run generate-template-index
node scripts/validate-canonical-paths.js --strict
python3 check_anchor_links_filtered.py || python3 scripts/check_anchor_links_filtered.py
npm run test:ci
```

Decision: **PASS (local, pre-integration) — retain B1A on the PR branch**. Required checks must pass for the latest PR head, followed by the same validation suite and legacy `/blob/main/...` bookmark test on `main`, before B1A is recorded as integrated.

Rollback command if any exit criterion later fails:

```bash
git revert a254fae57b4fa9a08c30c3dcff5ba6d4969c07bf
```

## Integration checkpoint

- Latest-head required checks: pending; the current workflow state requires action before CI evidence can be accepted.
- After merge, record the resulting `main` SHA, required-check links/results, regeneration clean-diff result, and old-path bookmark result here.
- If the PR is squash-merged, use the resulting `main` commit—not the branch implementation SHA—for production rollback.
