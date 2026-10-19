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
confidential material, or unsanitized originals. Do not submit the forms below
until the repository owner authorizes creation of public synthetic test issues.
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
2. Use `01-new-contribution.md` for the fictional content and
   `09-sanitized-tracker.xlsx` for the spreadsheet example. For a mixed package,
   use `11-mixed-synthetic-package.zip`.
3. Use this intended-use text: “A fictional project team can track milestones,
   owners, dates, and status.”
4. Select the attribution choice “I prefer no personal attribution” if the
   form offers it; complete the rights and public-visibility confirmations
   truthfully for these synthetic files.
5. Before submitting, confirm the issue and attachments will be public. Submit
   only if public synthetic test issues have been authorized.
6. On the resulting issue, check for receipt. A receipt is not triage,
   acceptance, or publication.
7. In a nonproduction review record, have a maintainer assess each file,
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
2. For the text-only case, identify “Blue Lantern Migration template,
   revision 0.1, section Milestone tracking.” Use the observed and proposed
   change in `02-text-correction.md`; leave the optional file empty.
3. For the attachment case, use the same target and attach
   `07-sanitized-correction.docx`. Complete the rights/public visibility and
   attribution fields using only the synthetic test context.
4. In the review record, exercise a clarification, duplicate/version conflict,
   material revision, renewed approval, and withdrawal using
   `06-lifecycle-cases.md`.

**Expected:** Text-only corrections need no file processing; optional files
reuse J1 handling. The final disposition and reviewed revision are traceable.

## J3 — Capability request

**Purpose:** Confirm requests receive a reasoned disposition without an
unsupported delivery-date promise.

1. Open the [capability request form](https://github.com/mirichard/pm-tools-templates/issues/new?template=template_request.yml).
2. Paste the request from `03-capability-request.md` into the relevant fields.
3. In the review record, link a duplicate if one exists; record any
   clarification, the accepted/deferred/declined outcome, rationale, next
   owner, and related work.

**Expected:** The request is classified and its next step is clear; acceptance
does not promise a delivery date.

## J4 — Problem report

**Purpose:** Confirm reports collect enough safe evidence for routing and
provide a private route for security issues.

1. Open the [problem report form](https://github.com/mirichard/pm-tools-templates/issues/new?template=bug_report.yml).
2. Use `04-problem-report.md` as the fictional report. Do not attach other
   evidence.
3. In the review record, repeat with an incomplete version and a duplicate;
   record component owner, clarification or duplicate link, investigation,
   verification, and communicated outcome.
4. Confirm a suspected vulnerability is directed to the private route in
   [SECURITY.md](../../SECURITY.md), not posted in a public issue.

**Expected:** Each report has a safe next action and accountable route; closing
intake does not claim the underlying problem is fixed.

## J5 — Rating and general feedback

**Purpose:** Confirm ratings remain feedback, not verified adoption or an
automatic score change.

1. Open the [rating form](https://github.com/mirichard/pm-tools-templates/issues/new?template=template-rating.yml).
2. Submit the rating-only example in `05-rating-and-actionable-feedback.md`.
3. Submit the actionable-feedback example separately, or use the [general
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

## Owner recording and cleanup

For each journey, reply on [#1482](https://github.com/mirichard/pm-tools-templates/issues/1482)
with **Passed**, **Failed**, **Blocked**, or **I don’t see that option**, plus
the created issue links and any confusion or assistance needed. Do not include
private details in public comments. Record actual owner responses; do not
pre-fill acceptance or call agent fixture checks a human walkthrough.

The agent has not created public test issues and cannot clean up records that
do not exist. After an authorized test, keep only the evidence needed for
traceability. Do not promise erasure from GitHub history. No synthetic
content is approved for production publication.
