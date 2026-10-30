# Release versions and history

Verified: 10/30/2026.

The previous repository release is [vNext — Value Delivery System Upgrade](https://github.com/mirichard/pm-tools-templates/releases/tag/vNext), published 09/21/2026 at commit `febdf847cd8842fd3929973360b14d27b4513b81`. The September 24 version reconciliation assigned **v2.3.0** to this baseline, added its numeric alias and corrected the release title/notes while retaining the `vNext` tag, release URL and original publication date. The repository's historical identifiers mix semantic versions, date-based versions, component versions, and a release name; sorting them numerically does not establish release chronology.

The latest repository release is [v2.4.0 — Template workflows, community intake and delivery reliability](https://github.com/mirichard/pm-tools-templates/releases/tag/v2.4.0), published October 30, 2026 at `b82b8eef56ba304ceb54a2fc340de0168f3ebbb3` after explicit owner authorization to release immediately. [Closeout and limitations](releases/v2.4.0-closeout.md). The former November 29 target is superseded.

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
| [`vNext`](https://github.com/mirichard/pm-tools-templates/releases/tag/vNext) | 09/21/2026 | Published value-delivery and migration baseline; assigned `v2.3.0` by the version manifest. The workflow retains `vNext` as its original tag and URL. |
| [`v2.4.0`](https://github.com/mirichard/pm-tools-templates/releases/tag/v2.4.0) | 10/30/2026 | Published template-workflow, sanitized-intake and delivery-reliability release; current repository version. |
| `v0.0.1` | Unpublished | Obsolete automatic draft observed on 09/24/2026. The replacement workflow updates this same draft to the manifest’s next version; it does not publish it. |

[`release.json`](../release.json) is the authoritative version manifest. `current` records the accepted release version, original tag, commit, and title; `nextVersion` records the reviewed target for the next draft. The root [`package.json`](../package.json) and [`package-lock.json`](../package-lock.json) match `current.version`. Package metadata in historical release commits remains unchanged. Component package versions remain independent.

## Numbering going forward

- Use `vMAJOR.MINOR.PATCH` for future repository releases. Choose the increment from the accepted changes: major for incompatible changes, minor for compatible additions, patch for compatible fixes.
- Preserve existing tags and their commits. In particular, do not reuse `v2.2.0` or relabel `vNext` as that version. Existing release and download links must continue to identify their original snapshots.
- `v2.3.0` identifies the historical vNext baseline. `v2.4.0` delivered the accepted Sprint 1–3 scope with already-sanitized files/text-only intake. Restricted-original handling remains deferred to [#1546](https://github.com/mirichard/pm-tools-templates/issues/1546); #1482 validation remains accepted. Owner approval and publication evidence are in [#1393](https://github.com/mirichard/pm-tools-templates/issues/1393).
- `nextVersion` is now `2.4.1`, a patch-draft placeholder with no scope/date commitment. Reassess the increment in a reviewed PR when further work is selected.
- Keep Requirements CLI and other component releases separate. Their release titles and tags must identify the component; their versions do not advance the repository sequence.
- Treat `vNext` as the fixed historical release published on 09/21/2026, not a moving tag for future work. Preserve its legacy-path compatibility commitment through at least the next major release.

## Automated controls

- Required CI's build/test job validates the manifest, root package, and both lockfile version fields and runs release-management regression tests.
- On pushes to `main`, **Update Release Draft** reads the manifest, verifies the accepted tag/commit, adds a missing numeric alias, and updates the existing release title/notes. Existing tags are never moved, and publication dates and original release URLs are retained.
- The workflow replaces the obsolete draft with `nextVersion` and uses an explicit previous tag when generating notes. CLI releases and date-based tags do not determine repository numbering. A marker identifies the managed draft so a reviewed version change updates it instead of creating another draft.
- Colliding tags, conflicting published releases, duplicate repository drafts, version drift, and failed read-back verification stop the workflow. Updates are repeatable after a partial failure. Drafts are never automatically published.
- The former Release Drafter configuration and overlapping tag-triggered workflow are retired. This implements version/draft consistency; broader release-automation scope in [#373](https://github.com/mirichard/pm-tools-templates/issues/373) is not claimed complete.

## Release procedure

1. Select the next version based on accepted scope. Update `nextVersion` in a reviewed PR; inspect **Update Release Draft** after merge. Do not publish a draft while that workflow is failing.
2. Review generated notes and choose the accepted release commit. Preserve existing tag identities and check both tags and published releases for collisions. The next comparison starts at the manifest’s current tag (`v2.4.0` after this closeout), excluding already shipped work.
3. Publish the reviewed draft at the accepted commit. In the release closeout PR, update `current` to the published version, numeric tag, commit, and title; advance `nextVersion`; align root package and lockfile versions; update the changelog, README, and roadmap. A draft updater encountering the newly published next version stops until this closeout merges.
4. Publish a concise notice in GitHub Discussions → Announcements, linking the release, user-facing improvements, getting-started routes, and material limits, following #1268. GitHub release/discussion notifications follow subscriber preferences; publication is not evidence of individual email or push delivery.
5. Verify the workflow's read-back checks, published notes, and tag commit. Component releases follow their own version histories and do not change this manifest.

Local validation: `python3 scripts/release_management.py`. With authenticated GitHub CLI access and `GITHUB_REPOSITORY=mirichard/pm-tools-templates`, add `--remote` for a read-only remote preflight or `--apply` to reconcile and verify release metadata and the draft. **Update Release Draft** also supports manual execution on `main`.

Rollback: revert the automation change to stop subsequent updates. Do not move or delete published tags. Correct metadata through a reviewed manifest change and rerun the workflow. Existing release bodies are preserved except for the version heading and identity note; the generated draft body is regenerated on each run, so finalize editorial changes immediately before publication.

### Recovery when the historical alias cannot be created

The first post-merge run failed at `POST git/refs`, before changing the published release or draft. The original error handler omitted GitHub's response; the specific API rejection was not captured. Subsequent runs report the HTTP diagnostic with token redaction.

GitHub can require workflow-write authorization when a new tag points to a historical commit whose workflow files differ from the default branch. See [GitHub's release API permission guidance](https://docs.github.com/en/rest/releases/releases). Do not move the tag to a newer commit or broaden routine automation permissions to avoid that restriction.

If the diagnostic confirms that restriction, an authorized maintainer can create the one-time alias using an authenticated GitHub CLI session with the necessary repository/workflow permissions:

```bash
gh api --method POST repos/mirichard/pm-tools-templates/git/refs \
  -f ref=refs/tags/v2.3.0 \
  -f sha=febdf847cd8842fd3929973360b14d27b4513b81
```

Then rerun **Update Release Draft**. It validates the existing alias and completes the title/draft corrections. A conflicting existing tag must be investigated, never force-updated. This historical recovery command is specific to vNext; future versions remain governed by the manifest.

For accepted vNext scope and limitations, see the [closeout record](vnext/release-closeout.md) and [final acceptance evidence](https://github.com/mirichard/pm-tools-templates/issues/1266#issuecomment-5755321786).
