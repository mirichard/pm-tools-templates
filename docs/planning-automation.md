# Backlog, sprint and acceptance preparation

## Interactive planning review

Open [Planning review](https://mirichard.github.io/pm-tools-templates/planning-review/) from the template website or the top of the recurring digest issue. Product owner, project manager and scrum master views emphasize different decisions and follow-ups over the same collected evidence.

The default view leads with relevant findings and recommended actions. Repeated disposition conflicts are grouped. Expand a finding for observed facts and direct issue links. The supporting inventory is collapsed by default. Filters cover focus, work type, sprint, release, discovery stage and issue or keyword. Copy view link preserves the role, filters and selected finding in the URL.

Recommendations come from explicit evidence rules, including documented definition decisions, entry-record gaps, blocked or untriaged issues, superseded policy references and research stages. They do not establish research quality, owner approval, accepted delivery or a release commitment. Research stage counts identify epic/candidate records and can include overlapping parent rollups. Missing structured entry records require reconciliation with existing issue decisions before asking for additional decisions or validation.

Each collection writes `review.json` beside the detailed Markdown and raw snapshot. Only the reduced review model is eligible for website publication. Raw issue bodies, request metadata and credentials are excluded. The initial website edition uses the verified November 5 preview as an explicitly labeled baseline.

The existing Pages workflow refreshes after the three planning entry points complete and on a normal site deployment. A separate publication-data job uses repository Actions read access only on the trusted default branch. It retrieves an eligible artifact, validates its repository, workflow, run ID and revision, and accepts only output marked for publication. Pull-request builds have no cross-run Actions access and use the already public baseline. Preview artifacts cannot replace a published edition. The previous website edition supplies the comparison baseline. No comparison is inferred for the first edition or a discovery stage whose previous coverage was unavailable.

The page shows recorded state, stage, sprint and disposition changes, absence from the current inventory, and findings no longer flagged by their evidence rule. These observations are distinct from acceptance. A site rebuild of the same edition preserves its original comparison baseline. Newer publications cannot be replaced by older runs.

Failed planning attempts are shown alongside the retained successful edition. Failed website preparation or deployment leaves the previous site in place. Its original review time remains visible and a warning appears after 72 hours. The source run and last attempted refresh provide verification paths. The website deployment verifies that the expected edition and page are accessible before reporting publication success.

Website changes run the planning model, filter and publication regression tests plus the existing site build and canonical-content checks. Collection failures remain fail-closed except the existing narrowly reported discovery lookup limitation. No project stages, issue dispositions, priorities or owner decisions are automatically changed.

Three entry points use one deterministic engine, `scripts/planning-automation.cjs`:

| Workflow | Schedule (UTC) | Result |
|---|---|---|
| Acceptance and Status Reconciliation | Weekdays 13:23 | Flags issue/board disagreement and missing issue-specific acceptance records |
| Weekly Triage Automation | Tuesday 14:00 | Reviews new, untriaged and aging active work using full pagination |
| Sprint Management | Monday 09:00 | Checks actual iteration dates, leaf work, dependencies, owner decisions, estimates and capacity |

Manual dispatch defaults to preview. Each run retains the snapshot and Markdown report for 14 days and writes its Actions summary. Scheduled runs update one marked `planning-digest` operational issue, never a new weekly duplicate. A closed digest is not reopened. Missing backlog/delivery access or incomplete collection fails before publication. If Project 13 cannot be resolved, the digest explicitly reports research-stage checks as unavailable while continuing acceptance/backlog/sprint checks. Project reads use a separate client created with `getOctokit(process.env.PROJECT_TOKEN)` and the existing read-only `ROADMAP_PROJECT_TOKEN`; the job's repository client publishes the digest and its label. Setting an authorization header on that repository client's GraphQL defaults does not switch its authentication, because Octokit's authentication hook replaces the header. The project credential requires `read:project` and an account with access to the private discovery project. The standalone diagnostic run and a planning preview establish actual coverage; no project-write scope is required.

## Owner decisions

`.github/planning-policy.json` holds approved calendar/selection references, planning estimates, capacity and review records. Empty readiness/acceptance maps mean unrecorded, not rejected. Existing user approvals are preserved in their source records; adding structured references is a transcription task, not a demand to repeat validation. Do not infer acceptance from arbitrary green CI, commit keywords, issue closure or checklist completion.

A readiness record keyed by issue number contains `owner`, `date` (YYYY-MM-DD), `record` (repository issue/PR decision URL), `decision: ready`, plus explicit `outcome`, `scope`, `acceptance`, and `dependencies` text. Acceptance adds `decision: accepted`, exact 40-character `revision`, and `criteria` entries containing `criterion`, `evidence` URL and `result: pass`. These records require review against the linked evidence; structural validation is not independent proof that the evidence passed. Owner-approved deferrals must be explicit in scope and linked residual issues.

Capacity is null until confirmed. Estimate sums are scenario ranges, not velocity forecasts. The parallel discovery allowance is reserved before any capacity-based sprint commitment. See [the discovery plan](../research/v2.5-discovery-plan.md).

## Project workflow settings

Acceptance must remain deliberate: disable automatic Done-to-issue-close and issue-closed-to-Done rules. Reopened work returns to Todo for review. Merged PR items should enter review rather than imply accepted parent scope. Keep normal item intake, subissue addition and PR-link progress support. The report does not rewrite historical project statuses, close issues, assign priorities, carry work into another sprint or publish releases.

## Validation and operation

Run `node --test tests/planning-automation.test.cjs tests/weekly-triage.test.cjs tests/roadmap-sync.test.cjs`. PR checks run the same rules without project secrets. After merging, dispatch an entry point with preview=true, inspect the artifact for actual access/schema/data issues, then dispatch with preview=false. Rerun publication to verify the same digest is reused. Review warnings as decisions rather than treating a green workflow as release readiness.

The workflows check out the default branch for scheduled/manual execution; unreviewed branch content never receives the project token. No Jira writes, release publication, notifications to participants, analytics activation or AI restoration occur.
