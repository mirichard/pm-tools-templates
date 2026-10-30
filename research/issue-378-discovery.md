# Issue #378 — Milestone Calendar Sync Discovery

Research snapshot: 2026-10-30. Repository evidence was inspected at base revision
`8078fdd24db8e9d274a5922c1db00c051f708663`.

## Decision brief

**Recommendation:** Revise the epic around an owner-selected, one-way `.ics` export as the lowest-permission first candidate; defer bidirectional sync and the other historical capabilities until a user outcome, source data, and platform access are established. The repository has a canonical project-schedule template with milestone IDs, planned dates, status, and owner, but no dedicated maintained calendar exporter or integration was found. A file export would provide a portable snapshot, not continuing synchronization: edits require a fresh export, and deleting an item from a later file does not reliably remove an already imported event.

The iCalendar standard provides event identifiers, date/time forms, time-zone definitions, and scheduling/cancellation semantics. Google and Microsoft document provider-specific incremental synchronization mechanisms; those require durable sync state and provider authorization, beyond a static file. Apple documents file import/export separately from calendar subscription. Direct retrieval of the official web pages was blocked in this environment; the official indexed documentation summaries and links were available, so platform-specific details below are intentionally bounded. No calendar write, subscription, invitation, client import, or user validation was performed.

Michael Richard must decide whether to promote the export-only slice, what milestone source and data may be exported, and which clients/versions warrant acceptance. No implementation, release, estimate, or sprint selection is approved by this report.

## Capability, evidence, and gap matrix

Repository paths below refer to the inspected base revision above. “Retain/revise/defer” describes the proposed disposition, not delivered capability.

| Capability / historical claim | Evidence and current state | Gap, dependency, and disposition |
|---|---|---|
| Milestone source and schedule integration | The [canonical Project Schedule Template](../domains/delivery/templates/traditional/Traditional/Process_Groups/Planning/project_schedule_template.md#L152-L159) has a milestone table (ID, name, description, planned/actual date, status, owner). The [template catalog](../templates/templates.json) identifies this canonical path and lists an alternate path. No dedicated calendar exporter/API was found in the repository search. | The table is a human-edited document, not a defined machine input or source-of-truth contract. Agree input, stable identity, date semantics, and applicable schedule/template before implementation. **Retain** schedule context; **revise** integration to an explicit source contract. |
| One-way iCalendar export | [RFC 5545](https://datatracker.ietf.org/doc/html/rfc5545) specifies `UID`, date/date-time values, `TZID`/`VTIMEZONE`, and event properties. Apple’s [Calendar import/export guide](https://support.apple.com/guide/calendar/import-or-export-calendars-icl1023/mac) documents file operations. A downloaded/imported file is not a continuing source connection. | Export is the smallest candidate and needs no calendar write or subscription. Fresh export does not guarantee updating a previously imported copy; users may need to replace/remove events manually. **Retain as a candidate**, not as a selected delivery. |
| Bidirectional sync with Google / Microsoft / Apple | Google documents incremental synchronization with sync tokens and deleted-event handling in its [sync guide](https://developers.google.com/workspace/calendar/api/guides/sync), and event date/date-time fields in its [event resource](https://developers.google.com/workspace/calendar/api/v3/reference/events). Microsoft documents calendar event delta queries in [Microsoft Graph](https://learn.microsoft.com/en-us/graph/api/event-delta?view=graph-rest-1.0). Apple distinguishes file operations from calendar URL subscriptions in its Calendar documentation. | These are provider-specific mechanisms, not interchangeable `.ics` export behavior. Any write-capable integration needs an owner-approved provider, authentication/permission review, durable sync state, operational recovery, and a client/version test plan. Apple integration path was not independently verified. **Defer** pending feasibility and access decisions. |
| Stable identity, edits, deletion, cancellation, idempotency | RFC 5545 defines `UID` and `SEQUENCE`; [RFC 5546](https://datatracker.ietf.org/doc/html/rfc5546) defines scheduling methods including cancellation. Google/Microsoft delta mechanisms distinguish changes and deletions. | Use an immutable opaque source milestone key for a stable UID; never derive identity from mutable title/date. Snapshot removal is not a portable delete instruction. Cancellation delivery and repeated-import behavior depend on client/protocol context and remain untested. Define idempotency as stable event identity/content for a repeated source snapshot; do not claim client-side deduplication. **Revise** acceptance and test per selected path. |
| All-day, time zones, DST | RFC 5545 distinguishes date-only values from date-times and specifies time-zone components. Google’s event resource distinguishes `date` from `dateTime`. | All-day milestones should use date-only values and an exclusive end date, without timezone conversion. Timed events need an explicit timezone policy and DST boundary tests; floating times, UTC instants, and wall-clock times are not equivalent. **Retain** as a test requirement; **revise** to explicit semantics. |
| Conflict detection/resolution; resource scheduling | The schedule template contains dependencies and resource-planning sections, but a milestone snapshot contains no other calendar availability. Google/Microsoft sync APIs concern event changes, not a validated resource-conflict policy. | Conflict detection requires an agreed definition of conflict and access to relevant availability; automatic resolution adds scheduling authority and write effects. **Defer**; do not imply overlap detection solves resource conflicts. |
| Categorization, custom calendars, stakeholder views, notifications | These are historical epic claims only; no matching dedicated maintained capability or acceptance evidence was found in the inspected repository. | Need a concrete user/task, role and privacy rules, data ownership, notification audience/timing, and client scope. **Defer**; replace speculative 99% accuracy/adoption claims with observable, measurable acceptance only after the owner selects a use case. |
| Existing related research and decisions | The [v2.5 discovery plan](v2.5-discovery-plan.md#L17-L20) places #378 in Sprint 6 feasibility/permissions triage, limits active investigations to two, and says availability is unconfirmed. It preserves accepted #1482 validation and #1379 source-sufficiency evidence ([plan](v2.5-discovery-plan.md#L32-L36)). The portfolio synthesis is in [PR #1597](https://github.com/mirichard/pm-tools-templates/pull/1597); this issue’s existing research PR is [#1610](https://github.com/mirichard/pm-tools-templates/pull/1610). | Reuse and link these records; do not repeat #1482 or reopen #1379’s accepted evidence. Historical #367/#371 dependencies in #378’s body are not verified as current delivery prerequisites here. **Retain** portfolio sequencing and accepted evidence; **revise** dependency claims after owner review. |

### Official-source notes

The source links above were identified from official documentation search results on 2026-10-30. Direct page fetches failed because DNS/network retrieval was unavailable. The RFC links are standards references; Google and Microsoft links describe their own APIs, not cross-provider guarantees; Apple’s guide describes Apple Calendar client operations, not a commitment to a specific integration interface. No third-party examples or user claims are used.

## Proposed synthetic validation fixture

**Status: proposed only; no exporter or client test was executed.** This fixture is synthetic and uses no real project or participant data.

Input milestone: immutable key `release-gate`, title `Release readiness`, all-day start `2027-03-14`, exclusive end `2027-03-15`. A minimal expected event is:

```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//PM Tools Templates//Milestone Export//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:project-demo-release-gate@example.invalid
DTSTAMP:20261030T185000Z
DTSTART;VALUE=DATE:20270314
DTEND;VALUE=DATE:20270315
SUMMARY:Release readiness
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR
```

**Proposed checks:** (1) repeat export with the same source key and confirm the same UID and semantic event fields; (2) change only title/date and confirm the UID stays the same; (3) confirm the all-day event remains March 14 with an exclusive March 15 end and no timezone conversion; (4) include two timed 09:00 `America/New_York` milestones on either side of the 2027 spring DST transition and confirm local wall time remains 09:00 while the UTC offset changes; (5) confirm output contains no attendees, private descriptions, or project URLs; (6) document that removing the source row only omits it from the next snapshot and does not claim to delete an already imported copy. These are proposed tests, not standards conformance results.

**Human acceptance still required:** Michael selects the input/source, privacy defaults, target calendar clients and versions, and whether a manual-import snapshot is useful. No participant outreach or user acceptance is claimed.

## Conditional candidate issue draft

**Proposed title:** Export selected project milestones as a downloadable iCalendar file

- **User outcome:** A project manager can produce a portable `.ics` snapshot from explicitly supplied, structured milestone data and manually import it into a chosen calendar client.
- **Scope:** One-way file generation for approved milestone fields; stable UID from an immutable milestone key; date-only all-day events; explicit timezone behavior for timed milestones; documented snapshot/update limitations.
- **Exclusions:** Provider API writes, OAuth/new permissions, URL subscriptions, invitations, automatic delete propagation, conflict resolution, role-based calendars, custom calendar creation, notifications, and integration with unselected schedule systems.
- **Observable acceptance:** A synthetic fixture produces a parseable file with the expected event count and fields; unchanged keys retain UIDs across changed titles/dates; all-day end is exclusive; timed events pass DST boundary cases; repeated input does not create new event identities; output omits unapproved personal/private fields; documentation clearly states that re-import/update/delete behavior is client-dependent.
- **Validation:** Unit/golden-fixture checks and an RFC-aware parser check; after owner selects supported clients, manual import/visual acceptance in those clients without writing to shared calendars. No client test has been run.
- **Dependencies and owner gaps:** Owner must select the source/input contract, permitted fields, target clients, privacy classification, implementation location, and whether a file-only user flow is useful. No existing machine-readable source or delivery owner was identified. Michael Richard remains the accountable decision owner.
- **Effort:** Provisional **3–5 person-days**, analyst planning range only for a small generator plus tests, assuming a supplied structured input with stable IDs and no source adapter, UI, hosting, authentication, provider API, or support work. This is not a measured or confirmed estimate; if these assumptions fail, re-estimate before backlog selection. Capacity is unconfirmed.

No child issue is created by this report. Reuse an existing delivery task if an equivalent scope already exists; otherwise create one only after owner disposition.

## Promotion criteria

- **Backlog-ready:** A specific user outcome and source are selected; export-only versus sync is decided; scope/exclusions and privacy fields are explicit; platform feasibility, dependencies, candidate acceptance and validation are documented; a planning estimate is reviewed; Michael records a proceed/revise/defer/stop decision. This report does not establish those decisions.
- **Sprint-ready:** Work is decomposed into leaf tasks with a named delivery owner, resolved/sequenced dependencies, an implementation target and input fixture, testable acceptance, validated estimate, and confirmed capacity. If bidirectional sync is selected, provider permissions, token expiry/recovery, deletes/conflicts, privacy, and selected-client acceptance must be separately ready.
- **Owner-selected:** Michael explicitly selects the bounded candidate for backlog/sprint consideration. Research assignment, report, or PR is not selection, delivery acceptance, or release approval. No project stage or sprint commitment was changed.

## Four-point owner brief

- **Recommended next step:** Decide whether one-way snapshot export merits a bounded backlog candidate.
- **Research completed:** Compared ICS snapshots with provider sync, mapped repository assets, and proposed a synthetic fixture.
- **Remaining gaps:** No structured source, client/version acceptance, permission design, user validation, or confirmed estimate/capacity.
- **Owner decision required:** Select the outcome, source/fields, client scope, privacy defaults, and proceed/revise/defer disposition.
