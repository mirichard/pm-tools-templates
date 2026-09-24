# Release versions and history

Verified: 09/24/2026.

The latest published repository release is [vNext — Value Delivery System Upgrade](https://github.com/mirichard/pm-tools-templates/releases/tag/vNext), published 09/21/2026 at commit `febdf847cd8842fd3929973360b14d27b4513b81`. It has no assigned numeric version. The repository's historical identifiers mix semantic versions, date-based versions, component versions, and a release name; sorting them numerically does not establish release chronology.

## Reconciled identifiers

Dates below are GitHub publication dates, except where explicitly identified as tag dates. Historical feature descriptions apply to their release snapshots, not necessarily to current `main`.

| Identifier | Date | Scope and status |
| --- | --- | --- |
| [`v2025.3.0-rc1`](https://github.com/mirichard/pm-tools-templates/tree/v2025.3.0-rc1) | 07/15/2025 (tag) | Historical release-candidate tag; no published GitHub release. Keep separate from the repository's `2.x` sequence. |
| [`v2.1.0`](https://github.com/mirichard/pm-tools-templates/releases/tag/v2.1.0) | 08/05/2025 | Published template-browser and quality-scoring release; highest published stable repository SemVer in the `2.x` sequence. |
| [`v2.2.0`](https://github.com/mirichard/pm-tools-templates/tree/v2.2.0) | 08/05/2025 (tag) | Existing annotated community-enhancement tag at `2b1e3209280c013e43dfcf7247017a1751afa85a`; no published GitHub release. This version is already used. |
| [`v2025.08.08`](https://github.com/mirichard/pm-tools-templates/releases/tag/v2025.08.08) | 08/08/2025 | Published date-based release covering canonical paths and CI improvements. |
| [`v0.3.0-mvp-288`](https://github.com/mirichard/pm-tools-templates/releases/tag/v0.3.0-mvp-288) | 08/10/2025 | Published Template Customization Web MVP release. Its number describes the historical MVP series. |
| [`v0.4.0`](https://github.com/mirichard/pm-tools-templates/releases/tag/v0.4.0) | 10/05/2025 | Published security/productivity release after `v2.1.0`; the lower number is a historical inconsistency, not evidence of a rollback. |
| [`v1.1.0-requirements-cli`](https://github.com/mirichard/pm-tools-templates/releases/tag/v1.1.0-requirements-cli) | 03/11/2026 | Independently versioned Requirements CLI release. |
| [`v1.2.0-requirements-cli`](https://github.com/mirichard/pm-tools-templates/releases/tag/v1.2.0-requirements-cli) | 09/18/2026 | Latest published Requirements CLI release; not the repository version. |
| [`vNext`](https://github.com/mirichard/pm-tools-templates/releases/tag/vNext) | 09/21/2026 | Latest published repository release; accepted value-delivery and migration baseline. |
| `v0.0.1` | Unpublished | Automatic draft observed on 09/24/2026. Its proposed version is inconsistent with existing repository tags and must be corrected before publication. |

The root [`package.json`](../package.json) and [`package-lock.json`](../package-lock.json) both contain `2.0.0`. This is existing package metadata, not an authoritative identifier for the latest repository release. Other tools and applications have their own package versions; they should not all be changed to match a repository release.

## Numbering going forward

- Use `vMAJOR.MINOR.PATCH` for future repository releases. Choose the increment from the accepted changes: major for incompatible changes, minor for compatible additions, patch for compatible fixes.
- Preserve existing tags and their commits. In particular, do not reuse `v2.2.0` or relabel `vNext` as that version. Existing release and download links must continue to identify their original snapshots.
- Resume the repository's stable `2.x` sequence above the existing `v2.2.0` tag. **`v2.3.0` is the recommended next minor version**, subject to review of the actual release scope; no release date, tag, or publication is established by this document. A fixes-only release could use `v2.2.1`; incompatible changes require a major-version decision.
- Keep Requirements CLI and other component releases separate. Their release titles and tags must identify the component; their versions do not advance the repository sequence.
- Treat `vNext` as the fixed historical release published on 09/21/2026, not a moving tag for future work. Preserve its legacy-path compatibility commitment through at least the next major release.

## Publication checks

1. Review both published releases and existing tags before selecting a version. Tags without GitHub release entries still reserve their identifiers.
2. Record the accepted commit and compare from the previous repository release (`vNext` for the next release). Do not include already shipped vNext work again merely because its tag is nonnumeric.
3. Correct the automatic draft's version, title, and comparison range before publication. The shared Release Drafter configuration currently encounters mixed release identifiers; its generated `v0.0.1` is not an approved version. Automation repair is tracked separately under [#373](https://github.com/mirichard/pm-tools-templates/issues/373).
4. Update release notes, the changelog, and roadmap together. Any root-package version alignment must update both package files in the same release change; do not infer that alignment from an unrelated component release.
5. Verify that the published release's tag resolves to the accepted commit and that its notes describe that snapshot. Keep historical counts and validation results tied to their tested baseline.

For accepted vNext scope and limitations, see the [closeout record](vnext/release-closeout.md) and [final acceptance evidence](https://github.com/mirichard/pm-tools-templates/issues/1266#issuecomment-5755321786).
