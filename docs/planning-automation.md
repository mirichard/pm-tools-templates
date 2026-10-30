# Backlog, sprint and acceptance preparation

Three entry points use one deterministic engine, `scripts/planning-automation.cjs`:

| Workflow | Schedule (UTC) | Result |
|---|---|---|
| Acceptance and Status Reconciliation | Weekdays 13:23 | Flags issue/board disagreement and missing issue-specific acceptance records |
| Weekly Triage Automation | Tuesday 14:00 | Reviews new, untriaged and aging active work using full pagination |
| Sprint Management | Monday 09:00 | Checks actual iteration dates, leaf work, dependencies, owner decisions, estimates and capacity |

Manual dispatch defaults to preview. Each run retains the snapshot and Markdown report for 14 days and writes its Actions summary. Scheduled runs update one marked `planning-digest` operational issue, never a new weekly duplicate. A closed digest is not reopened. Missing backlog/delivery access or incomplete collection fails before publication. If Project 13 cannot be resolved, the digest explicitly reports research-stage checks as unavailable while continuing acceptance/backlog/sprint checks. The existing `ROADMAP_PROJECT_TOKEN` currently reads Projects 11–12 but cannot resolve Project 13; the job's repository token writes only the digest and its label. Live discovery-stage checks require separate resolution of that access limitation; no new access is granted by this implementation.

## Owner decisions

`.github/planning-policy.json` holds approved calendar/selection references, planning estimates, capacity and review records. Empty readiness/acceptance maps mean unrecorded, not rejected. Existing user approvals are preserved in their source records; adding structured references is a transcription task, not a demand to repeat validation. Do not infer acceptance from arbitrary green CI, commit keywords, issue closure or checklist completion.

A readiness record keyed by issue number contains `owner`, `date` (YYYY-MM-DD), `record` (repository issue/PR decision URL), `decision: ready`, plus explicit `outcome`, `scope`, `acceptance`, and `dependencies` text. Acceptance adds `decision: accepted`, exact 40-character `revision`, and `criteria` entries containing `criterion`, `evidence` URL and `result: pass`. These records require review against the linked evidence; structural validation is not independent proof that the evidence passed. Owner-approved deferrals must be explicit in scope and linked residual issues.

Capacity is null until confirmed. Estimate sums are scenario ranges, not velocity forecasts. The parallel discovery allowance is reserved before any capacity-based sprint commitment. See [the discovery plan](../research/v2.5-discovery-plan.md).

## Project workflow settings

Acceptance must remain deliberate: disable automatic Done-to-issue-close and issue-closed-to-Done rules. Reopened work returns to Todo for review. Merged PR items should enter review rather than imply accepted parent scope. Keep normal item intake, subissue addition and PR-link progress support. The report does not rewrite historical project statuses, close issues, assign priorities, carry work into another sprint or publish releases.

## Validation and operation

Run `node --test tests/planning-automation.test.cjs tests/weekly-triage.test.cjs tests/roadmap-sync.test.cjs`. PR checks run the same rules without project secrets. After merging, dispatch an entry point with preview=true, inspect the artifact for actual access/schema/data issues, then dispatch with preview=false. Rerun publication to verify the same digest is reused. Review warnings as decisions rather than treating a green workflow as release readiness.

The workflows check out the default branch for scheduled/manual execution; unreviewed branch content never receives the project token. No Jira writes, release publication, notifications to participants, analytics activation or AI restoration occur.
