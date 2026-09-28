# Roadmap synchronization

## Ownership

| Information | Authority | Automation treatment |
| --- | --- | --- |
| Scope, acceptance, residual work, parent relationship | GitHub issue and recorded maintainer decisions | Read state, closure reason and native parent; never infer acceptance from closure |
| Outcome, Horizon, Status, Sprint | Product Roadmap #11 and Now Epic Sprints #12 | Copy actual fields, report missing/conflicting values, never modify them |
| Strategy, priority rationale, release claims | Human-reviewed ROADMAP.md and decision register | Preserve outside the generated markers; update when decisions change |
| Current status tables | Generated ROADMAP.md block and backlog/roadmap-status.md | Propose in one PR; no automatic merge |

The alignment register retains dated decisions, not a second live status database. A closed issue may be completed, not planned or otherwise disposed of; the generated table preserves its closure reason. Acceptance evidence remains in the issue.

## Trigger and review cycle

Issue changes and merged PRs trigger reconciliation. User-owned Project field changes do not trigger a repository Actions workflow directly; a six-hour scheduled run is the supported fallback. Manual dispatch is available, and `repository_dispatch` with type `roadmap-project-changed` is an optional hook for a separately configured integration. No webhook integration is assumed to exist.

The workflow reads the complete paginated project inventory and all open repository issues, plus issues retained in either Project or the small historical-retention list. Draft items and foreign-repository items are outside this repository's snapshot. Archived open roadmap items are reported as gaps. Authentication errors, missing projects, truncated field pages and unavailable issues fail the run without publishing partial data.

Only the generated ROADMAP.md block and backlog/roadmap-status.md are written on reserved branch `automation/roadmap-status`. One PR is created or refreshed. Identical snapshots do not create new content or timestamp churn. Concurrent runs are serialized, branch updates are fast-forward only, and unrecognized branch commits require manual reconciliation. Do not edit the automation branch; change source records or the generator in a separate PR.

Drift flags cover missing Outcome/Horizon/type/status, open issues missing from the roadmap, closed issues with non-Done board status, open issues marked Done, and conflicting board statuses. Flags are review findings, not permission to alter a board or close an issue. Parentless items are shown as Standalone; no parent is guessed. Untracked residual scope is a human closeout check because free-text intent cannot reliably establish that relationship.

At closeout:

1. Record acceptance and merged evidence in the issue; link any residual issue and its native parent.
2. Update the issue and Project status. Keep residual work unscheduled unless explicitly selected.
3. Review the generated synchronization PR and resolve drift in source records.
4. Update curated decision/release narrative if the decision changed, then merge the documentation PR and verify the public view.

## Setup and activation

This workflow is not operational until merged and configured. For these user-owned public Projects, provide repository Actions secret `ROADMAP_PROJECT_TOKEN` with a classic personal access token carrying **read:project**. The token is used only for GraphQL reads; repository writes use the workflow's short-lived GITHUB_TOKEN. Do not paste a token into an issue, PR or chat. Scope, expiry and rotation remain under the repository owner's control.

Allow GitHub Actions to create pull requests in repository settings. If organization/repository policy prevents that, the run fails visibly; do not widen credentials or bypass policy automatically. PR-triggered checks created by GITHUB_TOKEN may require approval; inspect and approve required runs before merging. No auto-merge is enabled.

After merge:

1. Configure the secret and PR-creation setting.
2. Manually dispatch **Roadmap synchronization** with preview enabled. Inspect the artifact and drift report; verify Project field names and inventory.
3. Dispatch with preview disabled. Verify one PR, only the two generated targets changed, and source decisions were preserved.
4. Run again without changing source data: no new commit should be created. Change a controlled Project field and confirm it is reflected on the next run, then restore it.
5. Observe one scheduled run before claiming the fallback is operational. Record run/PR evidence in the implementation issue.

Missing credentials produce an explicit failure, not a partial issue-only report. Until activation, use the closeout checklist manually. No project-write access or external webhook is required.

## Verification

`node --test tests/roadmap-sync.test.cjs` covers pagination, incomplete reads, closure distinctions, drift, escaping, marker preservation and publication lifecycle. Pull requests run these tests without secrets or write permissions. Live activation remains a separate acceptance step.

GitHub references: [Projects authentication](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/automating-projects-using-actions), [workflow triggers](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows), [GITHUB_TOKEN behavior](https://docs.github.com/en/actions/concepts/security/github_token).

## Freshness indicators

- **Editorial review date** is maintained by a human reviewing the narrative; synchronization does not change it.
- **Snapshot updated at** is the UTC capture time first recorded for the current source-data fingerprint. It is not a merge/publication time. It changes with source data and is retained for identical data on main or the pending automation branch. Existing snapshots without a timestamp receive one at the next reconciliation; earlier capture times are not guessed.
- **Latest synchronization checks** links to workflow history, where run time, trigger, result and the reconciliation summary establish whether a check found changes. Successful unchanged checks do not create documentation commits. Preview runs do not publish, and a changed snapshot reaches main only after its PR is merged.

The links deliberately show failures and pending runs as well as successes; they are not a claim that the latest check succeeded. Neither freshness indicator establishes acceptance.

## Release and sprint alignment

Projects manage priority, readiness and sprint execution. The issue milestone records the approved release; parent epics may span releases. Use the same issues in the relevant project views, with Milestone, Sprint, Status and linked PRs visible. Keep research and paused work without a release commitment until explicitly selected.

During sprint planning and closeout, reconcile each selected deliverable's milestone. Moving between sprints does not automatically move an issue between releases. Record release additions, removals and deferrals as repo owner decisions. Use one release-readiness issue for validation, approval, publication and post-release checks; do not duplicate these as separate sprint or testing milestones. For v2.4.0, see [milestone 35](https://github.com/mirichard/pm-tools-templates/milestone/35) and [release-readiness issue #1393](https://github.com/mirichard/pm-tools-templates/issues/1393).

The report includes native issue milestone links and flags:
- Non-archived sprint assignments without a milestone.
- Open issues in closed milestones, including legacy assignments that require review.
- Open issues in the sprint project whose open, numeric repository release milestone differs from `release.json`'s `nextVersion`.

Version mismatches are review prompts: an intentionally later release can be valid. Component-specific tags are excluded from the repository-version comparison. The manifest is read from the same immutable default-branch revision as the generated targets; unavailable or invalid data stops synchronization before output or publication. Milestone values and the manifest version participate in the snapshot fingerprint. These checks never assign milestones, move sprints, change priorities or establish acceptance. Milestone completion counts do not measure release readiness, effort or unselected future scope.
