# Deliverables Matrix Generator — issue #380 discovery

- **Research snapshot:** 2026-10-30
- **Repository source snapshot:** [`main` at `8078fdd24db8e9d274a5922c1db00c051f708663`](https://github.com/mirichard/pm-tools-templates/commit/8078fdd24db8e9d274a5922c1db00c051f708663)
- **Accountable decision owner:** Michael Richard
- **Disposition:** Research for owner review only; #380 remains an unscheduled candidate.

## Decision brief

Recommend revising the broad generator proposal to one possible first slice: export a single CSV matrix from explicitly reviewed, normalized deliverable records, with stable row IDs, versioned source locators, acceptance owner/criteria, explicit milestone and dependency references, and unresolved/conflict flags. Do not start implementation until the owner selects this slice and its input contract is verified.

The maintained scope statement already captures deliverable descriptions, due dates, success criteria, owners, interim dependencies, key milestones, and requirement sources. The program and construction WBS assets distinguish deliverables from work packages and activities. They do not establish stable deliverable IDs, source anchors, a shared input schema, inferred schedule logic, status evidence, or automated export. #366’s historical implementation claims are not evidence of integration into this repository; #365 explicitly says not to presume it. The 95% extraction target has no reviewed benchmark set or measurement method in this evidence.

The example and candidate below are proposed fixtures, not executed product tests or user acceptance. The owner must decide whether to pursue this narrow export, identify an input-contract owner, and disposition the remaining extraction, visibility, status, dependency-analysis, categorization, and format scope. This recommendation does not select a sprint, release, or delivery commitment.

## Investigation and evidence

- #380 is open, assigned to Michael Richard and Copilot, has native parent #365, and has no native child issues. Its comments were empty at the research snapshot.
- #365 retains #380 among its 17 verified native children, remains unscheduled, and says #366 is a historical closed predecessor whose cross-repository work is not presumed integrated into `main`.
- The #380 description names #366 and #367 as dependencies; those are description-level claims, not verified native dependency links. #370 is a sibling epic and related view-policy scope, not a verified upstream dependency.
- Active research to coordinate with: [#1566 portfolio synthesis PR #1597](https://github.com/mirichard/pm-tools-templates/pull/1597), [#365 parent research PR #1598](https://github.com/mirichard/pm-tools-templates/pull/1598), [#367 mapping research PR #1599](https://github.com/mirichard/pm-tools-templates/pull/1599), and this focused [#380 research PR #1612](https://github.com/mirichard/pm-tools-templates/pull/1612). PR #1597 records the Sprint 4 discovery checkpoint as a research checkpoint, not a delivery commitment. This report is the only issue-specific artifact proposed here.
- The [v2.5 discovery plan](v2.5-discovery-plan.md) calls for comparing the deterministic deliverables slice with #379 and #381 and reusing #366 input-contract evidence; the checkpoint is not selection or acceptance.
- #1482 is closed with the owner-confirmed contributor/maintainer walkthrough complete; its acceptance is preserved and no repeat is proposed.
- #1379 records owner-confirmed source-sufficiency for `PUB-ALMMSN-01` v0.1 at commit [`0dc4f6b071eaffa46a6458c3ac034acadd857f2a`](https://github.com/mirichard/pm-tools-templates/commit/0dc4f6b071eaffa46a6458c3ac034acadd857f2a). That finding is unrelated to deliverable extraction and is preserved, not requalified or treated as a general product validation.
- Evidence is repository- and issue-based. No product comparisons, user research, live integrations, independent acceptance, or external-method claims were needed or performed.

## Capability, evidence, and gap matrix

The source snapshot is `main` at `8078fdd24db8e9d274a5922c1db00c051f708663`. File blob IDs below identify the exact inspected revisions.

| Capability / claim | Maintained evidence and contract | Gap, dependency, and disposition |
|---|---|---|
| Deliverable record fields | [Project Scope Statement Template](../role-based-toolkits/project-manager/essential-templates/scope-statement.md) (blob `602193c042c40d0405654cb4717101f8261eaff5`) has major deliverable, description, due date, success criteria, owner, interim dependency, key milestone, and requirement-source fields. It also has product acceptance criteria and approval/sign-off roles. | **Retain** these fields as a starting point. **Revise** “owner” into separately named delivery owner and acceptance owner/role; the template does not define a machine-readable record contract or stable deliverable ID. |
| Stable IDs and source anchors | The scope template includes `FR-001`-style requirement IDs and a `Source` column. The WBS guidance in [Construction Project WBS](../industry_templates/construction/construction_wbs.md) (blob `97de477d3b113cf534370c720cfc01b4114aac11`) mentions WBS IDs. | Neither proves stable deliverable IDs or resolvable source anchors. **Revise**: assign/persist a deliverable ID independent of row order or changing text; store source document identity/revision plus a section-and-paragraph locator (and page/paragraph for formats without anchors). Missing/ambiguous locators must remain flagged, not guessed. |
| Deliverables vs. tasks | [Program WBS](../role-based-toolkits/program-manager/program-planning/program-wbs.md) (blob `bb471573e0f00316140bf4f36bd8b32ec1f1a815`) says to keep the WBS deliverable-oriented. The construction WBS distinguishes major deliverables (level 3), work packages (level 4), and optional activities (level 5), and recommends noun-based WBS descriptions. | **Retain** the distinction. **Revise** row qualification so a task/action is not emitted as a deliverable merely because it appears in a source, and keep completion claims separate from deliverable definition and acceptance evidence. The assets give guidance, not an implemented classifier. |
| Milestone mapping | The scope template includes key milestones and dates plus due dates for major/interim deliverables. | **Retain** explicit source-provided milestone/date fields. **Defer** “intelligent” timeline/methodology inference: no schedule model, methodology mapping rules, examples, or validated result is present. |
| Dependency mapping / critical path | The scope template has dependency tables; the program WBS advises tying deliverables to schedule and risk register. | **Retain** explicit dependency references only. **Defer** inferred dependency edges, schedule calculations, and critical-path claims; neither asset implements or validates them. Treat unknown or contradictory links as unresolved. |
| Acceptance owner and completion | The scope template records a deliverable owner, acceptance criteria, approval roles, and sign-off fields. | **Revise** to distinguish responsible producer from authorized acceptance owner and record the acceptance evidence/reference and date. **Defer** real-time status and completion percentages; a task marked done or a historical “✅” is not proof of deliverable acceptance. |
| Extraction and 95% target | #366’s 2025 issue comment claims a separate development-repository parser, tests, and accuracy results. No corresponding parser/input contract or validation evidence was found in the inspected `main` assets; #365 explicitly warns against presuming integration. | **Revise** the claim into an unmeasured business target pending a defined corpus, independently reviewed expected deliverables, denominator, false-positive/missed-item handling, and measurement protocol. **Defer** automated extraction until #366 input/output provenance and integration are verified. No accuracy result is asserted here. |
| Stakeholder views | #380 historically requests internal/client/executive toggles; sibling [#370](https://github.com/mirichard/pm-tools-templates/issues/370) now requires explicit classification, deny-by-default behavior, and leakage tests. | **Defer** audience-specific filtering from the first slice and coordinate its policy with #370. A 95% filter score is not a sensitive-data protection guarantee. No permissions changes or sensitive data are in scope. |
| Categorization and export formats | #380 requests custom categories and Excel/PDF/dashboard widgets. No shared taxonomy or deliverables exporter was found among the inspected maintained assets. | **Defer** custom organizational taxonomies and all but one format. **Retain** the need for an export outcome; propose one plain CSV slice for review, not a committed implementation. |

### Historical target disposition

The “95%+” extraction target, stakeholder-specific visibility, real-time status, broad compliance, and time-saving claims remain historical proposal claims, not accepted evidence. Do not silently delete them or promote them to test criteria. If retained as business targets, the owner must select measurement definitions and evidence before they can become acceptance criteria.

## Proposed synthetic validation fixture — not executed

**Synthetic source:** `SYNTH-SOW-01`, revision `1.0` (invented for this proposal; contains no real project data).

- `§2.1 Outputs ¶1`: “Publish a rollout runbook accepted by the Sponsor.”
- `§2.2 Activities ¶1`: “Draft the runbook, hold a review, and publish it.”
- `§3.1 Milestones ¶1`: “Pilot readiness (M-01) is May 15.”
- `§3.2 Schedule ¶1`: “The runbook is due May 15.”
- `§4.1 Schedule ¶1`: “All final outputs are due May 16.”
- `§5.1 Prerequisites ¶1`: “The test environment must be ready before runbook acceptance.”
- No named Sponsor, individual acceptance delegate, evidence of approval, or separate test-environment deliverable is supplied.

| Proposed ID | Type / source anchor | Acceptance / owner | Milestone / dependency | Proposed export disposition |
|---|---|---|---|---|
| `DM-0001` | Deliverable; `SYNTH-SOW-01@1.0 §2.1 ¶1` | Criterion: Sponsor acceptance. Acceptance owner: role “Sponsor”; named delegate `TBD`; evidence `TBD`. | Candidate mapping `M-01` is explicit, but the due date conflicts between §3.2 and §4.1. Prerequisite is stated; its deliverable identity is not. | Include as a deliverable row with `date_conflict`, `acceptance_owner_unresolved`, and `dependency_unresolved`; do not choose a date, invent a deliverable, or mark accepted. |
| — | Task; `SYNTH-SOW-01@1.0 §2.2 ¶1` | Not applicable as a deliverable acceptance record. | May be related activity, but not a deliverable solely because it is listed. | Exclude from deliverable rows; preserve as a task reference only if a later agreed schema needs it. |

**Proposed checks (not run):** (1) output preserves IDs and exact source revision/locators; (2) task verbs are not silently promoted to deliverables; (3) missing named owner/evidence and conflicting dates are visibly unresolved; (4) milestone/dependency references are explicit or marked unmapped; (5) no “complete” state is inferred from activity completion. Add positive, missing-scope, duplicate-candidate, and contradictory-source fixtures before any extraction accuracy claim.

**Executed checks:** `python3 check_anchor_links_filtered.py` completed successfully; this report had no broken-anchor finding. The repository-wide run reported five broken anchors in the unmodified `docs/principles/anti-patterns.md` and advisory heading-anchor suggestions. `git diff --check` passed, local report links resolved, and the secret scan found no secrets. The checker rewrote its tracked aggregate report, which was restored. No generator, parser, fixture, or implementation test was run. **Human acceptance:** not performed or claimed.

## One bounded candidate issue draft — conditional, not selected

### Candidate: Export a reviewed deliverables matrix as CSV

**User outcome:** A project manager can share one reviewable, source-traceable matrix of deliverables from records already explicitly reviewed by a person.

**Scope:** One CSV export from a named, approved normalized input contract. Each row has a persistent ID; deliverable name/type; source document ID/revision and locator; acceptance criteria; delivery owner; acceptance owner/role; explicit milestone reference/date; explicit dependency IDs; and unresolved/conflict/evidence fields. Unknowns remain visible. Distinguish deliverable rows from tasks and completion evidence.

**Exclusions:** Source-document parsing/extraction; 95% coverage claim; inferred milestones, dependencies, or critical path; status automation or completion percentage; stakeholder-specific views/redaction; custom taxonomies; PDF/Excel/dashboard integrations; external systems, permissions, telemetry, and sensitive/original-file intake.

**Observable acceptance criteria (proposed):**
1. For the approved fixture, CSV columns and row values match the agreed schema and preserve stable IDs and versioned source locators.
2. A task-only item is not silently emitted as a deliverable; an unresolved classification is flagged for review.
3. Missing owners/evidence, absent mappings, and contradictory scope remain explicit; export does not pick a winner or assert acceptance.
4. Every dependency/milestone reference either resolves to an included record or is explicitly flagged unresolved.
5. A task marked complete without acceptance evidence does not produce an accepted deliverable state.

**Validation method:** schema/round-trip tests against synthetic complete, missing, ambiguous, and contradictory fixtures; human review of expected rows and source locators; verify unknown fields survive serialization. These are proposed tests, not currently executed.

**Dependencies and owner gaps:** Michael Richard must select this slice and identify the accountable input-contract/schema owner and acceptance authority. Verify the #366 contract and actual source integration before using it. Coordinate view-policy boundaries with #370; no native dependency is established. Resolve named delivery and acceptance owners when scheduling.

**Initial effort hypothesis:** 2–5 person-days, low confidence and not confirmed or committed. Assumes one developer, an already approved normalized record schema, one CSV output, synthetic tests, and no UI, parser, integrations, access control, or external tool. If the schema/input is absent or must be designed, re-estimate after that decision rather than treating this range as a commitment.

## Promotion criteria and current gaps

- **Backlog-ready candidate:** owner accepts the user outcome and exclusions; user/problem evidence is adequate; #366 input contract and maintained input source are verified; fields/IDs/anchors have a reviewed schema; synthetic fixtures cover missing and contradictory scope; candidate boundaries and dependencies are explicit. None of the selection or owner-disposition conditions is evidenced yet.
- **Sprint-ready:** a leaf-sized issue has a named delivery and acceptance owner, observable acceptance criteria, executable validation plan, resolved or explicitly sequenced dependencies, a re-estimated effort, and a recorded readiness decision. Do not change project stage or sprint commitment in this research.
- **Owner-selected:** Michael Richard explicitly selects a backlog candidate and separately authorizes any sprint/release decision subject to capacity and planning gates. Research, issue assignment, PR creation, or a proposed estimate is not selection or acceptance.

**Missing prerequisites:** verified normalized input contract; user/problem validation for the narrowed outcome; owner-selected schema/ID/anchor policy; accountable delivery and acceptance roles; defensible measurement plan for the 95% business target if retained; owner disposition of residual visibility, status, critical-path, taxonomy, and format scope; confirmed capacity and estimate at scheduling.

## Proposed concise issue comment

> Research report: [#1612](https://github.com/mirichard/pm-tools-templates/pull/1612) adds the #380 discovery matrix, exact source revisions, synthetic missing/conflicting-scope fixture, and a conditional single-CSV candidate. Recommendation: consider a reviewed-record CSV slice only after the #366 input contract and schema owner are verified. Existing scope/WBS templates provide partial fields, not an implemented generator; extraction accuracy and the broader historical targets remain unvalidated. No delivery, sprint, release, or acceptance is selected. Owner decision requested: select/revise/defer this slice and identify the input-contract owner.

Issue/project write access for posting this comment or changing planning fields was not available through the tools used for this research. No issue status, project stage, sprint, milestone, or release was changed.

## Four-point closeout

- **Recommended next step:** Michael Richard reviews the conditional CSV slice and decides select, revise, or defer.
- **Research completed:** issue hierarchy/state, active research coordination, maintained scope/WBS evidence, and a proposed synthetic fixture were checked.
- **Remaining gaps:** verified #366 contract, user evidence, schema/owner assignments, acceptance fixtures, confirmed estimate, and target measurement.
- **Owner decision required:** whether to pursue this bounded slice and who owns its input contract and acceptance.
