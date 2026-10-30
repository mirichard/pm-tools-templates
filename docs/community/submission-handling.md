# Community submission handling

## Approved release boundary — October 30, 2026

The repository owner approved **already-sanitized files and text-only intake for v2.4**. Restricted-original handling is explicitly deferred beyond this release in [#1546](https://github.com/mirichard/pm-tools-templates/issues/1546); its controls remain requirements for future enablement, not v2.4 acceptance gates. No contributor format conversion is required. The completed [#1482](https://github.com/mirichard/pm-tools-templates/issues/1482) walkthrough remains accepted and must not be repeated solely for this scope reconciliation. See [#319](https://github.com/mirichard/pm-tools-templates/issues/319) for retained journey acceptance and [#1393](https://github.com/mirichard/pm-tools-templates/issues/1393) for release readiness.

This guide defines the minimum safe handling for content, corrections, requests,
problem reports, ratings, and general feedback. Public GitHub issues, comments,
pull requests, and their attachments are public. Do not put confidential,
personal, proprietary, or otherwise identifying material in them.

## Intake route and file safety

Use the [issue chooser](https://github.com/mirichard/pm-tools-templates/issues/new/choose)
for text-only requests, corrections, problem reports, ratings, and feedback.
Contributors may submit content in the format they have; they are not expected to
convert it. Sanitized files may be submitted for maintainer assessment through
the public contribution route, with the understanding that the submission and
its history are public.

There is not currently a designated restricted file-transfer channel for
unsanitized originals. Until the repository owner approves and configures one,
do not upload such originals to an issue, discussion, pull request, or public
repository branch. If an original cannot safely be sanitized before submission,
ask for a private transfer arrangement without including the file or sensitive
details. A maintainer must confirm an approved restricted channel before the
file is sent. If no channel is available, pause the file submission; do not
substitute ordinary email or a public link.

Before any public file submission, contributors must be told that the
repository is public, how the file may be assessed or changed, what attribution
may be retained, and that removing a file later cannot guarantee erasure from
Git history. Collect only information needed for the selected route. A text-only
request does not require file processing.

Accept original formats for maintainer assessment, including mixed packages.
Assess actual file type and intended use; retain native formats or convert to
repository conventions as appropriate. Do not require contributor conversion.
For every file, record its type, intended use, retain/convert decision, cleanup
action, and verification result in a per-file manifest. Use maintainer-assisted
assessment when tools cannot process a format. Stop publication for unreadable,
encrypted, unsafe, or fidelity-compromised files until the issue is resolved.
Never silently omit a file or publish an unverified conversion.

Copy this table into the maintainer's review record and add one row per submitted
file. Record only public, sanitized filenames and evidence; do not include
restricted originals or identity mappings:

| Public file or PR path | Actual file type | Intended use | Retain/convert decision and rationale | Cleanup performed | Verification result |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

Treat files as untrusted input. Use an approved transfer provider's published
size and file limits; explain those limits before transfer and arrange a
confirmed restricted alternative if the primary channel cannot carry a file.
Do not invent a repository-wide format allowlist. Validate the actual type,
scan before opening or processing, use isolated storage that is not publicly
served, and do not execute macros or embedded active content. If scanning,
isolation, or secure transfer is unavailable, stop and escalate rather than
process the file.

### If unsafe content is uploaded publicly

If a public issue, pull request, comment, or attachment contains content that
should not be public:

1. Stop ordinary triage and file processing. Do not download, copy, quote,
   reproduce, or link the content elsewhere.
2. Privately alert the repository owner with only the public record URL and a
   brief description of the exposure; do not repeat the exposed content. Use
   the private vulnerability-reporting route in [SECURITY.md](../../SECURITY.md)
   if the exposure is a suspected vulnerability. For other sensitive exposure,
   use the confidential community contact in [CODE_OF_CONDUCT.md](../../CODE_OF_CONDUCT.md#reporting).
3. Use GitHub's report-content mechanism for the affected public material and
   follow the owner's direction on any further action. Do not treat editing or
   deleting a public issue or attachment as guaranteed removal from GitHub
   history, caches, notifications, or copies.
4. Keep the submission on hold. Resume only after the owner confirms the
   exposure has been handled and the remaining material is safe to process.

The contributor-facing forms must tell submitters not to re-upload or quote
unsafe material and how to alert maintainers if it is uploaded accidentally.

## Access, retention, and roles

Restricted-original custodian, transfer and deletion requirements below are retained for deferred #1546. Ordinary sanitized-file assessment, verification, review and publication responsibilities still apply in v2.4.

| Responsibility | Minimum operating rule |
| --- | --- |
| Intake and triage | An assigned maintainer confirms the route, records receipt, identifies the next responsible role, and requests only relevant clarification. |
| Original-file custodian | A maintainer explicitly assigned to the submission controls restricted originals and any identity-to-placeholder mapping. Access is limited to people needed for assessment and cleanup. |
| Cleanup and verification | The assigned maintainer assesses files, maintains the per-file manifest, removes identifying content consistently, preserves functionality and required attribution, and verifies the sanitized output. |
| Review and publication | An authorized reviewer checks rights, usability, cleanup, and applicable validation on the exact revision. A maintainer with repository publication authority merges or publishes only after approval. |
| Escalation | The repository owner resolves missing authority, unavailable channel, access or retention exceptions, and unresolved publication decisions. Suspected vulnerabilities use the private route in [SECURITY.md](../../SECURITY.md); do not report them in public issues. |

These are role assignments, not named staffing commitments. Assign a responsible
maintainer before accepting restricted files. Where feasible, the person who
prepared or cleaned a file should not be its sole approver. If independent
review is unavailable, hold publication and escalate for an approved review
arrangement.

Keep originals and identity mappings only while needed to assess, clean, and
verify a submission. Delete them promptly after verification and before public
publication, or promptly after a submission is declined or withdrawn. The
repository owner must approve and publish a retention schedule before any
restricted originals are accepted; no fixed retention period is currently
approved. Retain only the sanitized approved revision, required attribution,
and nonsensitive decision/evidence links in public repository history.

## Route status and decisions

Maintain the issue or pull request as the traceable public record. Keep issue
type separate from workflow state and scheduling. For each route, record
receipt, current state, next responsible role, clarification or revision
requests, duplicate links, decision rationale, and links to resulting work.

| Route | Statuses and completion evidence |
| --- | --- |
| New contribution or correction | Received → In review → Changes requested or Approved → Published. Approved records identify the exact revision; Published requires a working catalog/download link and version. Declined, duplicate, withdrawn, and failed-publication paths include a reason and next action. |
| Template/capability request | Received → Under consideration → Accepted, Deferred, Declined, or Duplicate. Accepted requests link delivery work but do not imply scheduling. |
| Problem report | Received → Triaged → Routed; link resolution and verification when available. Duplicate, incomplete, and sensitive/security reports receive the appropriate next action. Intake closure does not require fixing the reported problem. |
| Rating or general feedback | Received → Acknowledged → Reviewed or Linked to related work. Ratings do not enter a publication lifecycle or count as verified adoption/quality evidence. |

These are issue-record conventions, not existing GitHub Project fields or
automation. Use comments and links to preserve transitions; do not represent an
unrecorded state as complete.

### Maintainer triage and status update

For every new public intake, a maintainer should:

1. Confirm its route and record receipt. Do not interpret an automated receipt
   as triage or acceptance.
2. Check for required context, likely duplicates, and (for reports) the
   affected component and reproduction evidence. Ask a focused clarification
   question when needed; do not guess missing details.
3. Assign the accountable maintainer when known. If ownership is unclear or
   authority is needed, route the decision to the repository owner and state
   that the item is waiting for that decision.
4. Add or update one maintainer comment with the applicable fields below.
   Keep issue type, GitHub open/closed state, Project scheduling, and route
   disposition distinct.

Use this compact comment structure; omit revision fields for text-only
requests, reports, ratings, and feedback:

```text
Route / current disposition:
Next responsible party:
Next action:
Decision and rationale:
Related duplicate, issue, or PR:
Exact revision reviewed (content only):
Outcome or verification evidence:
```

Keep an item active while clarification, contributor revision, investigation,
or publication recovery is pending. Link duplicates to the canonical item and
communicate the reason. A content decision is not Published until the exact
approved revision is merged or otherwise published and its destination is
verified. A failed publication stays pending with an owner and next action.
Close an issue only after recording and communicating its final route
disposition; closing a request does not schedule accepted work, and closing a
problem report does not imply that the underlying problem was fixed. Reopen or
link a follow-up when new information requires more work.

Do not promise response times or implementation dates unless the repository
owner has approved them. Acceptance of a request is not a schedule commitment.
Withdrawal before publication stops processing and triggers deletion of staged
files. After publication, use the documented correction/removal process; do
not promise erasure from Git history. A failed publication remains pending,
with a recovery owner and next action, and must never be shown as Published.

## Maintainer publication checklist

- [ ] Confirm the route, rights to contribute, public visibility, and agreed attribution.
- [ ] Confirm no restricted original or identity mapping is present in a public issue, PR, branch, preview, or metadata.
- [ ] Record a per-file assessment and cleanup manifest when files are included.
- [ ] Verify sanitized visible and hidden content, metadata, links, formulas, macros, and intended functionality as applicable.
- [ ] Record the exact revision reviewed; request renewed approval after material changes.
- [ ] Verify required repository checks and the published catalog/download result before communicating Published.
- [ ] Delete restricted originals and identity mappings at the defined disposition point; record only nonsensitive evidence of deletion.
- [ ] Give the submitter the disposition, rationale, next owner/action, and resulting change or work link where applicable.

## Current operational limitation

The repository does not yet identify a restricted transfer provider, named
operators, provider-specific size limits, or an approved retention period.
Public, sanitized submissions and text-only intake can continue under this
guide. Unsanitized originals must remain on hold until the repository owner
records the provider, access roles, per-transfer limits, retention schedule, and
owner/backup coverage. This limitation is not a request for contributors to
convert or silently discard their original files.
