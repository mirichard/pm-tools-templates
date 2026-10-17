# Community submission handling

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

Treat files as untrusted input. Use an approved transfer provider's published
size and file limits; explain those limits before transfer and arrange a
confirmed restricted alternative if the primary channel cannot carry a file.
Do not invent a repository-wide format allowlist. Validate the actual type,
scan before opening or processing, use isolated storage that is not publicly
served, and do not execute macros or embedded active content. If scanning,
isolation, or secure transfer is unavailable, stop and escalate rather than
process the file.

## Access, retention, and roles

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
publication, or promptly after a submission is declined or withdrawn. If a
submission remains unresolved for 30 days, delete the staged original and
identity mapping, record that action without sensitive details, and request a
fresh transfer only after an approved channel is confirmed. Do not extend
retention without repository-owner approval and a recorded reason. Retain only
the sanitized approved revision, required attribution, and nonsensitive
decision/evidence links in public repository history.

## Route status and decisions

Maintain the issue or pull request as the traceable public record. Keep issue
type separate from workflow state and scheduling. For each route, record
receipt, current state, next responsible role, clarification or revision
requests, duplicate links, decision rationale, and links to resulting work.
Use route-appropriate outcomes: requests may be accepted, deferred, declined,
or marked duplicate; ratings may be acknowledged without entering a publication
lifecycle; content changes require review and publication; problem reports link
to resolution and verification when available.

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
operators, or provider-specific size limits. Public, sanitized submissions and
text-only intake can continue under this guide. Unsanitized originals must
remain on hold until the repository owner records the provider, access roles,
per-transfer limits, and owner/backup coverage. This limitation is not a
request for contributors to convert or silently discard their original files.
