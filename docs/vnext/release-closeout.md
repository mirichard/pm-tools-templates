# vNext release closeout

Review date: 09/20/2026. Status: **acceptance pending; not a release announcement**.

The authoritative gate record is [issue #1266](https://github.com/mirichard/pm-tools-templates/issues/1266). The reviewed implementation baseline is `36cef8c30661fbaf5efd4430ebe1a07c739f0a7f`; documentation changes after that baseline require their own merge verification.

## Scope and evidence

The final review inspected 143 issue/PR records across overall milestone 18 and all 15 sprint milestones. None was open before the closeout tracker was created. All eight original epics (#707–#714) and stories (#715–#755) are closed. Closed PRs do not establish integration: #1188 was closed without merge and is not delivery evidence.

Historical acceptance for the audit, value layer, decision engine, and entry experience is recorded in #779, #708, #709, and #710, respectively. Epics #711–#714 contain later acceptance reconciliation. Early issue bodies retain unchecked boxes; the linked evidence, not closed state alone, determines acceptance.

At the implementation baseline, all 83 focused tests passed. Principles validation covered 139/139 current canonical templates with no exclusions or errors. Freshness checks passed for 137/137 migrated templates with no age warnings; migration post-check reported 137 executed and zero remaining. These counts describe the tested baseline, not a permanent repository-wide template count.

All 15 nonvisual push workflows passed. [Visual regression](https://github.com/mirichard/pm-tools-templates/actions/runs/35544277516) was still capturing screenshots at review time; no visual acceptance is claimed. See #1266 for the latest disposition.

## Remaining acceptance

- Merge and verify the restored first-template walkthrough and these documentation corrections.
- Record an actual first-use trial against that revision: start at the README, follow Getting Started, customize and save a first template. Record elapsed time, device/browser, assistance, and problems. The original criterion is under five minutes; historical link checks do not prove it. Any exception requires explicit owner acceptance.
- Resolve the final visual result or explicitly accept a documented exception.
- Record final release acceptance, then close Sprint 15, the overall milestone, and project board 9. Preserve planned dates and record actual completion separately.
- Choose the release tag and publish reviewed notes. The automatic `v0.0.1` draft, root package version `2.0.0`, and general published release `v0.4.0` are not a consistent release-version decision.

## Release notes prepared for publication

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

Publish this section only after the acceptance gates above have been dispositioned; record the release tag and final commit in #1266.
