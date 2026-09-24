# vNext release closeout

Reconciled: 09/24/2026. Status: **accepted and published on 09/21/2026**.

The authoritative acceptance record is [issue #1266](https://github.com/mirichard/pm-tools-templates/issues/1266#issuecomment-5755321786), closed as completed on 09/21/2026. The reviewed implementation baseline is `36cef8c30661fbaf5efd4430ebe1a07c739f0a7f`. PR #1267 integrated the final walkthrough and closeout documentation as `febdf847cd8842fd3929973360b14d27b4513b81`, the commit identified by the published `vNext` tag.

## Scope and evidence

The final review inspected 143 issue/PR records across overall milestone 18 and all 15 sprint milestones. None was open before the closeout tracker was created. All eight original epics (#707–#714) and stories (#715–#755) are closed. Closed PRs do not establish integration: #1188 was closed without merge and is not delivery evidence.

Historical acceptance for the audit, value layer, decision engine, and entry experience is recorded in #779, #708, #709, and #710, respectively. Epics #711–#714 contain later acceptance reconciliation. Early issue bodies retain unchecked boxes; the linked evidence, not closed state alone, determines acceptance.

At the implementation baseline, all 83 focused tests passed. Principles validation covered 139/139 current canonical templates with no exclusions or errors. Freshness checks passed for 137/137 migrated templates with no age warnings; migration post-check reported 137 executed and zero remaining. These counts describe the tested baseline, not a permanent repository-wide template count.

All 15 nonvisual push workflows passed at the implementation baseline. The initially pending [visual regression](https://github.com/mirichard/pm-tools-templates/actions/runs/35544277516) subsequently passed. Final closure evidence records all 17 latest push-triggered workflows passing on the release commit, including [visual regression](https://github.com/mirichard/pm-tools-templates/actions/runs/35547061404), CodeQL, and SAST. This is historical workflow evidence, not a new test run or manual screenshot-baseline approval.

## Acceptance disposition

- The first-template walkthrough and documentation corrections merged through PR #1267; its 18 PR workflows passed, followed by the final release-commit checks above.
- The owner accepted the first-use timing criterion on 09/21/2026. No measured duration or independent novice trial is asserted.
- Acceptance uses the agreed eight-epic scope and cross-cutting requirements. The owner confirmed there were no separate Project #9 release-level acceptance criteria.
- Sprint 15 and the overall vNext milestone are closed. Project #9 board/item status remains unverified; no board-completion claim is made.
- The [vNext release](https://github.com/mirichard/pm-tools-templates/releases/tag/vNext) and [announcement #1268](https://github.com/mirichard/pm-tools-templates/discussions/1268) were published. The automatic `v0.0.1` draft and root package version `2.0.0` do not identify this release. See [release numbering and history](../release-versioning.md) for the earlier `v2.1.0` release, existing `v2.2.0` tag, and separate component versions.

## Published release summary

### vNext — Value Delivery System Upgrade

vNext connects template selection, project execution, governance, and ongoing delivery to measurable outcomes.

**For users:**

- Find relevant assets through six performance domains, role-based navigation, and rules-based recommendations.
- Understand when to use a template, when not to use it, and which principles guide its application.
- Connect outputs to benefits and KPIs; scale governance to risk and context.
- Plan product increments, stakeholder feedback, release readiness, and operational ownership beyond project closure.

**For maintainers:**

- Maintain canonical assets with migration traceability and preserved legacy entry points.
- Validate principle coverage against the live catalog and detect content-review drift without resetting review dates.
- Use repeatable migration, metadata, link, and regression checks to protect the accepted baseline.

**Boundaries:** Legacy migration paths remain supported through vNext and at least the next major release. The catalog does not export all domain classifications; use the reviewed domain mapping where applicable. Release automation (#373), status-generator work (#369), and the separately released Requirements CLI are not claimed as new vNext deliverables. Automated checks do not establish regulatory certification or an independent repository-wide security audit.

The published notes and final acceptance evidence are linked above. This summary retains the accepted scope and boundaries; it does not announce a new release.
