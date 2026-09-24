# Roadmap

**Last reviewed:** 09/24/2026

This roadmap summarizes released capabilities, outstanding follow-up, and future candidates for PM Tools & Templates. Release notes describe what shipped; linked issues hold scope and acceptance evidence. An open issue is not, by itself, a delivery commitment.

[Use the library](README.md) · [Release history](https://github.com/mirichard/pm-tools-templates/releases) · [Open work](https://github.com/mirichard/pm-tools-templates/issues?q=is%3Aissue%20is%3Aopen) · [Milestones](https://github.com/mirichard/pm-tools-templates/milestones)

## Released

Repository and component versions follow separate histories. `v2.3.0` is assigned to the latest published repository release, `vNext`; the existing `v2.2.0` tag has no published release entry and cannot be reused. See [release numbering and history](docs/release-versioning.md) for the manifest, automated consistency checks, and release procedure. No next release is scheduled.

| Delivery | What it provides | Record |
| --- | --- | --- |
| v2.3.0 (vNext) — Value Delivery System Upgrade | Benefits and value-delivery guidance; six performance domains; context-sensitive template selection; principles and applicability guidance; adaptive governance; product and continuous-delivery practices | [Published release — 09/21/2026](https://github.com/mirichard/pm-tools-templates/releases/tag/vNext) |
| Requirements CLI v1.2 | Nonfunctional-requirement generation, quality-attribute mapping, acceptance-criteria scaffolding, human-review gates, and classification evaluation | [Published release — 09/18/2026](https://github.com/mirichard/pm-tools-templates/releases/tag/v1.2.0-requirements-cli) |
| README entry-point redesign | Catalog, selection-guide, and beginner-kit routes; explained domains; resource-use instructions; separate software prerequisites | [Merged PR #1269](https://github.com/mirichard/pm-tools-templates/pull/1269) |

vNext's migration establishes canonical locations and cross-references for the migrated collection. Legacy paths remain supported through vNext and at least the next major release under the [compatibility policy](docs/domain-navigation-and-legacy-paths.md).

Release acceptance and closeout are recorded in [#1266](https://github.com/mirichard/pm-tools-templates/issues/1266#issuecomment-5755321786), closed as completed on 09/21/2026 after verification of the release tag, final workflows, and announcement. Project-board status remains explicitly unverified in that record.

## Outstanding follow-up

| Item | Current position | Next decision or action |
| --- | --- | --- |
| Catalog-domain export | Recorded as follow-up in the [domain-refactor reconciliation, #711](https://github.com/mirichard/pm-tools-templates/issues/711); excluded from the vNext delivery claim | Confirm remaining scope and tracking before scheduling; [PR #1188](https://github.com/mirichard/pm-tools-templates/pull/1188) was closed without merge |

At this review, no GitHub milestones are open. The overall vNext and Sprint 15 milestones are closed. Some closed historical milestones still contain open issues, so their old dates should not be read as active commitments. No next-release date is committed in this roadmap.

## Unscheduled candidates

The following research-derived candidates are explicitly deprioritized and unscheduled. Their order does not indicate priority. None has a release commitment.

| Candidate | Intended outcome | Scope reference |
| --- | --- | --- |
| Bidirectional requirements consistency | Propagate test-case edits back to use cases and validate process-state consistency | [#1159](https://github.com/mirichard/pm-tools-templates/issues/1159) |
| Requirements extraction from transcripts | Turn elicitation transcripts into candidate requirements for human review and the existing CLI | [#1160](https://github.com/mirichard/pm-tools-templates/issues/1160) |
| Deterministic risk scoring | Provide a risk taxonomy, template, and explainable scoring rules; no predictive-model claim | [#1161](https://github.com/mirichard/pm-tools-templates/issues/1161) |
| Stakeholder sentiment support | Complement a stakeholder register with optional sentiment and stance signals | [#1162](https://github.com/mirichard/pm-tools-templates/issues/1162) |

Other open proposals include [documentation search](https://github.com/mirichard/pm-tools-templates/issues/104), [Jira/Asana synchronization](https://github.com/mirichard/pm-tools-templates/issues/547), and [release automation](https://github.com/mirichard/pm-tools-templates/issues/373). These are examples from the backlog, not a selected next-release scope. Existing implementations and overlapping proposals need reconciliation before a new commitment is made.

## How to read and maintain this roadmap

- **Released:** linked to a published release or a merged change. Check the linked record for limitations and acceptance evidence.
- **Outstanding follow-up:** a documented gap or reconciliation item; inclusion does not assign a delivery date.
- **Unscheduled candidate:** retained for evaluation, without an approved delivery commitment.
- Record approved scope, acceptance criteria, dependencies, and scheduling in the relevant issue or milestone before presenting a candidate as planned delivery.
- Update this page when a release ships or a scope, priority, or scheduling decision changes. Keep detailed inventories and validation counts in their authoritative records.

## Historical proposals

The [previous roadmap](https://github.com/mirichard/pm-tools-templates/blob/e8c7d6cee508bf612f4e8c71ed8e0ce0ba87269f/ROADMAP.md) remains available as a historical record. Its 2025–2026 phase schedules, speculative architecture, staffing and budgets, adoption and revenue targets, and blockchain/AR/VR proposals are not carried forward as current commitments. This update does not close or cancel the underlying backlog issues.

## Feedback

[Start a discussion](https://github.com/mirichard/pm-tools-templates/discussions) about priorities or [open an issue](https://github.com/mirichard/pm-tools-templates/issues/new/choose) describing the user problem, intended outcome, and evidence that would demonstrate success.
