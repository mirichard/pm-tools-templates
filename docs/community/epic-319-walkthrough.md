# Epic #319 contributor and maintainer walkthrough

This guide prepares the #1482 walkthrough and owner UAT. It does not claim a
human walkthrough or acceptance has occurred.

## Current evidence and safety

At revision `f73119ef97c5e12fe438a377f81823cd39eda2c2`, the related automated
issue tests passed 44/44. They cover selected form and workflow contracts, not
the end-to-end journeys below. Browser interaction, public issue submission,
maintainer processing, publication, and owner UAT have not been demonstrated.

Use only the fictional files in
[`tests/fixtures/epic-319`](../../tests/fixtures/epic-319/). They are intended
for this walkthrough, not for the production template catalog. GitHub issues,
comments, and attachments are public. Do not upload real project files,
confidential material, or unsanitized originals. The owner must authorize
creation of public synthetic test issues before anyone submits the forms below.
No restricted-file transfer route is configured.

## Links

- [#1482 walkthrough issue](https://github.com/mirichard/pm-tools-templates/issues/1482)
- [Issue chooser](https://github.com/mirichard/pm-tools-templates/issues/new/choose)
- [New contribution form](https://github.com/mirichard/pm-tools-templates/issues/new?template=content_submission.yml)
- [Correction form](https://github.com/mirichard/pm-tools-templates/issues/new?template=template-improvement.yml)
- [Capability request form](https://github.com/mirichard/pm-tools-templates/issues/new?template=template_request.yml)
- [Problem report form](https://github.com/mirichard/pm-tools-templates/issues/new?template=bug_report.yml)
- [Rating form](https://github.com/mirichard/pm-tools-templates/issues/new?template=template-rating.yml)
- [General feedback form](https://github.com/mirichard/pm-tools-templates/issues/new?template=community-feedback.md)

## Shared steps

For each issue created, confirm the public/safety notice before submitting.
Use only the matching synthetic text/file below. After submission, record the
issue link and whether the receipt is clearly distinguished from a decision.
Do not mark a route complete until its next owner, action, rationale, related
work, and outcome are recorded. If the UI differs or asks for real information,
stop and report **I don’t see that option**; do not guess or use real data.

The repository owner can authorize the test by replying on #1482:
“I authorize creation of the fictional public test issues listed in the Epic
#319 walkthrough. Do not publish any fixture to the production catalog.”
Without that authorization, stop before submitting any form.

The maintainer should use the status fields in
[`submission-handling.md`](submission-handling.md). For content files, record
one manifest row per file, assess the actual type, decide retain/convert,
record cleanup and verification, and review the exact revision. The fixtures
have not been processed by the repository’s production cleanup or publication
workflow.

## J1 — New contribution

**Purpose:** Confirm a non-Git contributor can submit fictional content and
understand the public-file and review process.

1. Open the [new contribution form](https://github.com/mirichard/pm-tools-templates/issues/new?template=content_submission.yml).
2. Enter title: `Contribution: Blue Lantern Migration (synthetic UAT)`.
3. Select “New template or content.”
4. In “What does this content help someone do?”, enter: “A fictional project
   team can track milestones, owners, dates, and status.”
5. Attach `11-mixed-synthetic-package.zip` and
   `10-sanitized-legacy.xls`. The package contains fictional Markdown, Word,
   and Excel files; the separate `.xls` covers legacy Excel. Download the
   [mixed package](../../tests/fixtures/epic-319/11-mixed-synthetic-package.zip)
   and [legacy spreadsheet](../../tests/fixtures/epic-319/10-sanitized-legacy.xls).
6. In format notes, enter: “Fictional test files only. The Excel workbook
   contains a simple SUM formula.”
7. Choose “I prefer no personal attribution.” Check the rights and public
   visibility confirmations for these synthetic files.
8. Confirm the issue and attachments will be public. Submit only after the
   owner has authorized public synthetic test issues.
9. On the resulting issue, check for receipt. A receipt is not triage,
   acceptance, or publication.
10. In a nonproduction review record, have a maintainer assess each file,
   record a manifest, and decide whether to retain or convert. Verify any
   converted output and exact revision. Do not publish to the production
   catalog.

**Expected:** The contributor can submit without Git or converting files; the
maintainer can account for every file and record a review decision. **Pass**
only if all steps are evidenced; otherwise **Fail** or **Blocked**.

## J2 — Correction

**Purpose:** Confirm text-only and optional-file corrections identify the
target and revision and require renewed review after material changes.

1. Open the [correction form](https://github.com/mirichard/pm-tools-templates/issues/new?template=template-improvement.yml).
2. Enter title: `Correction: Blue Lantern Migration (synthetic UAT)`.
3. In “Affected template and version,” enter: “Blue Lantern Migration
   template, revision 0.1, section Milestone tracking.”
4. In “What is wrong or missing?”, enter: “The completion field is ambiguous.”
5. In “Proposed correction,” enter: “Rename it Status and document allowed
   values: Planned, Active, Complete.”
6. For the text-only case, leave the optional attachment empty. For the
   attachment case, attach
   [`07-sanitized-correction.docx`](../../tests/fixtures/epic-319/07-sanitized-correction.docx).
   Confirm the rights/public-visibility fields using only the synthetic test
   context.
7. In the review record, exercise a clarification, duplicate/version conflict,
   material revision, renewed approval, and withdrawal using
   [`06-lifecycle-cases.md`](../../tests/fixtures/epic-319/06-lifecycle-cases.md).

**Expected:** Text-only corrections need no file processing; optional files
reuse J1 handling. The final disposition and reviewed revision are traceable.

## J3 — Capability request

**Purpose:** Confirm requests receive a reasoned disposition without an
unsupported delivery-date promise.

1. Open the [capability request form](https://github.com/mirichard/pm-tools-templates/issues/new?template=template_request.yml).
2. In “What need are you trying to meet?”, enter: “A fictional project team
   needs to see milestone dependencies.”
3. In “Who would use this and what would they accomplish?”, enter: “Project
   coordinators would identify predecessor milestones before updating plans.”
4. In “Example outcome,” enter: “A clear dependency view for each milestone.”
5. In “Existing template, workaround, or related request,” enter: “The current
   fictional workaround is to list predecessor IDs in a notes column.”
6. In the review record, link a duplicate if one exists; record any
   clarification, the accepted/deferred/declined outcome, rationale, next
   owner, and related work.

**Expected:** The request is classified and its next step is clear; acceptance
does not promise a delivery date.

## J4 — Problem report

**Purpose:** Confirm reports collect enough safe evidence for routing and
provide a private route for security issues.

1. Open the [problem report form](https://github.com/mirichard/pm-tools-templates/issues/new?template=bug_report.yml).
2. Enter title: `Bug: Blue Lantern Migration synthetic sample`.
3. In “Affected component or URL,” enter: “Blue Lantern Migration sample
   spreadsheet (synthetic fixture; no production URL).”
4. In “Expected and observed behavior,” enter: “Expected: the status total
   updates when a row changes. Observed: the fictional test copy displays a
   stale total.”
5. In “Steps to reproduce,” enter: “Change a status cell in a temporary copy
   and recalculate. No production file is involved.”
6. Do not attach other evidence.
7. In the review record, repeat with an incomplete version and a duplicate;
   record component owner, clarification or duplicate link, investigation,
   verification, and communicated outcome.
8. Confirm a suspected vulnerability is directed to the private route in
   [SECURITY.md](../../SECURITY.md), not posted in a public issue.

**Expected:** Each report has a safe next action and accountable route; closing
intake does not claim the underlying problem is fixed.

## J5 — Rating and general feedback

**Purpose:** Confirm ratings remain feedback, not verified adoption or an
automatic score change.

1. Open the [rating form](https://github.com/mirichard/pm-tools-templates/issues/new?template=template-rating.yml).
2. Enter template: “Blue Lantern Migration (synthetic fixture).” Select
   “Good” and leave feedback empty for the rating-only case.
3. For actionable feedback, enter: “Please explain the allowed status values
   beside the table.” Submit that as a separate rating-form issue or use the [general
   feedback form](https://github.com/mirichard/pm-tools-templates/issues/new?template=community-feedback.md).
4. In the review record, acknowledge receipt, then separately document review,
   disposition, and any related correction/request/defect link.

**Expected:** Receipt is not a disposition; no automatic catalog rating,
analytics, voting, ranking, or contributor score is changed.

## J6 — Status and decisions

**Purpose:** Confirm representative items show state, owner, next action,
rationale, related work, and final disposition.

1. Reuse the J1–J5 test records; do not create extra issues just for this step.
2. Record clarification, duplicate, revision, withdrawal, rejection, and
   failed-publication/recovery cases in the review record. Use
   `06-lifecycle-cases.md` for sample text.
3. For each record, confirm the status comment identifies the current
   disposition, next responsible party, next action, decision rationale,
   related work, and outcome evidence.

**Expected:** A reader can tell who acts next and what happened. A failed
publication remains pending and is not described as published.

## Simple browser and keyboard check

Use the issue chooser on a desktop browser. Move through one form using only
the Tab, Shift+Tab, Space, and Enter keys. Confirm the current field and required
questions are understandable. If an iPad is available, repeat the contribution
form there; otherwise record **Not tested on iPad**. Do not install software or
change device settings. Report **Passed**, **Failed**, **Blocked**, or **Not
tested**, and say what appeared instead if it failed.

## Evidence matrix

The following is the current status before a human walkthrough. Automated tests
and local fixture checks are not owner UAT.

| Journey | Current evidence | Walkthrough | Owner UAT result | Remaining blocker |
| --- | --- | --- | --- | --- |
| J1 — Contribution | 44 related tests passed; synthetic DOCX/XLSX/XLS and mixed-package fixtures validated locally | Not performed | Not tested | Owner authorization for public test issues; maintainer assessment and publication behavior |
| J2 — Correction | Form contract checked; synthetic text and DOCX fixtures prepared | Not performed | Not tested | Public test issue authorization; revision/review/disposition |
| J3 — Request | Request form contract checked | Not performed | Not tested | Public test issue authorization; recorded route decision |
| J4 — Problem report | Problem form and private-report guidance contract checked | Not performed | Not tested | Public test issue authorization; actual routing and verification |
| J5 — Feedback | Receipt behavior simulated in tests; form contracts checked | Not performed | Not tested | Public test issue authorization; actual review and disposition |
| J6 — Decisions/status | Documented status fields checked | Not performed | Not tested | Real issue records covering transitions and final outcomes |

## Owner recording and cleanup

For each journey, reply on [#1482](https://github.com/mirichard/pm-tools-templates/issues/1482)
with **Passed**, **Failed**, **Blocked**, or **I don’t see that option**, plus
the created issue links and any confusion or assistance needed. If something
differs, stop and report the journey ID and what appeared instead; do not
troubleshoot. Do not include private details in public comments. Record actual
owner responses; do not pre-fill acceptance or call agent fixture checks a
human walkthrough. The form submissions and brief status replies should take
about 5–10 minutes per journey, excluding any maintainer review or waiting.

The agent has not created public test issues and cannot clean up records that
do not exist. After an authorized test, keep only the evidence needed for
traceability. Do not promise erasure from GitHub history. No synthetic
content is approved for production publication.
