# B1A Migration Execution Record

- Issues: [#1057](https://github.com/mirichard/pm-tools-templates/issues/1057) (parent [#711](https://github.com/mirichard/pm-tools-templates/issues/711))
- Batch: `B1A`
- Asset count: `1`
- Rollback owner: `mirichard`

## Checkpoint A — Baseline

- `pre_batch_sha`: `724a25a2d15c017ac5e6b44365b9467495a8aa3c`
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
node scripts/validate-sprint-10.mjs --require-annotations
node scripts/validate-curated-templates.js
npm run generate-template-index
node scripts/validate-canonical-paths.js --strict
python3 check_anchor_links_filtered.py || python3 scripts/check_anchor_links_filtered.py
npm run test:ci
```

Decision: **PASS — keep B1A committed**.

Rollback command if any exit criterion later fails:

```bash
git revert <B1A-commit-sha>
```
