# Risk-Based Governance Scaling

Story #747 · Parent #713 · Sprint 14

Use assessed exposure to tailor the evidence and oversight required by the [adaptive governance model](governance-decision-matrix.md). This framework recommends controls; the sponsor and relevant control owners approve them. It does not replace risk analysis or determine legal obligations. Where governance is fixed, retain that baseline and use the assessment to identify additional controls.

## Assess five dimensions

Agree the assessment horizon, objectives, risk appetite and local escalation thresholds before rating. The definitions below are governance decision criteria, not universal financial or probability limits. For each dimension record risk IDs, dated evidence, assumptions, current controls, residual exposure, an accountable owner and next review date.

| Dimension | Low | Medium | High | Evidence and owner |
|---|---|---|---|---|
| Technical | Proven solution; interfaces tested; recovery demonstrated within tolerance. | Unproven component or dependency with a feasible, funded test/fallback plan. | Critical integration, reliability, security or recovery uncertainty threatens an objective beyond approved tolerance. | Test results, architecture/dependency review, recovery evidence; technical lead. |
| Schedule | Credible plan with demonstrated capacity and adequate contingency for known dependencies. | Material dependency or limited contingency needs active coordination to protect commitments. | Critical-path exposure threatens a non-negotiable milestone beyond tolerance; recovery is unproven. | Dependency map, critical path, capacity and forecast evidence; delivery lead. |
| Budget | Forecast and contingency cover assessed exposure within delegated tolerances. | Cost uncertainty or reserve consumption needs sponsor oversight but a funded response is feasible. | Unfunded exposure, unreliable estimate or forecast breach threatens an approved financial objective. | Cost forecast, assumptions, funding and contingency evidence; budget owner. |
| Organizational | Decision rights, skills, capacity and adoption responsibilities are clear and demonstrated. | Cross-team dependencies, capacity constraints or adoption concerns require coordinated action. | Missing accountable authority, critical capability or stakeholder alignment threatens delivery or acceptance. | Authority matrix, resource commitments, adoption evidence; sponsor/change lead. |
| Compliance | Applicable controls and owners are identified, with evidence of effectiveness and no material unresolved gaps. | Identified evidence/control gaps have an owned remediation plan before the affected gate. | A material obligation/control gap or ineffective mandatory control threatens an affected commitment or release. | Obligation/control register and owner assessment; accountable control owner. |

Use **unknown** when evidence cannot support a rating, including unresolved applicability. Do not substitute low, zero or N/A. A control owner may justify low exposure for an inapplicable dimension, with a documented rationale. Confirmed regulatory context remains `regulatory` even when compliance exposure is assessed low.

Assess current exposure using only controls demonstrated to work. Record inherent exposure and proposed residual exposure separately. Planned mitigation, accepted risk or an opportunity benefit does not by itself reduce the rating. Reassess interactions: several medium risks with a shared dependency may warrant high exposure; document the override in the relevant dimension.

## Selection and safeguards

1. Record all five dimensions as `low`, `medium`, `high` or `unknown`. Retain the source evidence in the assessment/register.
2. Take the highest dimension rating; do not average or sum unlike scoring systems. Any unknown uses **provisional high** oversight until the evidence gap is resolved, with an owner and due date.
3. Use the higher of that result and the existing decision-engine `risk_profile`. Preserve `regulatory`. Apply the existing project-size, team-size and organizational policy floors through #746's selector.
4. Select the effective tier's baseline and the artifact scaling below. A large, low-risk project can still require Rigorous governance. Lower risk never removes a higher tier's artifacts, authorities, gates or reporting frequency.
5. Record sponsor/control-owner approval, changes, owners, effective date and next review. Missing or invalid input produces no recommendation; retain current controls until corrected. For an explicit unknown, use the provisional higher controls and resolve the uncertainty before the affected gate.

To relax controls, demonstrate lower residual exposure and response effectiveness, resolve unknowns, and obtain the sponsor and affected control owners' approval under the [tier transition process](governance-decision-matrix.md#changing-tiers). Keep current controls until approval. Update the context profile only through that recorded reassessment; the helper never automatically lowers an existing high/regulatory context. Mandatory controls and retention requirements remain in force.

## Scale each governance artifact

Use the column matching assessed risk; then retain any stricter requirement in the effective tier or approved charter. These are minimum working cadences for the proposed model, subject to stricter organizational requirements. Combine evidence in existing tools instead of creating duplicate documents.

| Artifact family and existing assets | Low exposure | Medium exposure | High or unknown exposure |
|---|---|---|---|
| Charter and governance framework: [project charter](../../role-based-toolkits/project-manager/governance-tools/governance-charter.md), [framework](../../role-based-toolkits/project-manager/governance-tools/governance-framework.md), [program charter](../../role-based-toolkits/program-manager/governance-framework/governance-charter.md) | Concise tier rationale, tolerances and named owners; combine into one record where the tier permits. | Add explicit dimension ratings, cross-team dependencies and funded responses. | Identify each critical/unknown exposure, assurance/control owners, restrictions and evidence required before the affected commitment. |
| Authority and decisions: [project authority](../../role-based-toolkits/project-manager/governance-tools/decision-authority.md), [roles](../../role-based-toolkits/project-manager/governance-tools/governance-roles.md), [decision framework](../../role-based-toolkits/project-manager/governance-tools/decision-framework.md), [escalation](../../role-based-toolkits/project-manager/governance-tools/escalation-matrix.md), [program authority](../../role-based-toolkits/program-manager/governance-framework/decision-authority-matrix.md), [steering charter](../../role-based-toolkits/program-manager/governance-framework/steering-committee-charter.md) | Named decision owner and delegation; log exceptions and approvals. | Document sponsor/steering thresholds, decision deadlines and dependency owners. | Reserve material exposure decisions to sponsor/steering and relevant control owners; record independent challenge and contingency authority. |
| Changes and gates: [change process](../../role-based-toolkits/project-manager/governance-tools/change-control-process.md), [quality gates](../../role-based-toolkits/project-manager/governance-tools/quality-gates.md), [change board](../../role-based-toolkits/program-manager/governance-framework/change-control-board-charter.md) | Short impact note and required tier approvals; retain acceptance/closure evidence. | Assess each affected dimension before approving a material change; verify response readiness at phase/release gates. | Require documented impact analysis, independent assurance where relevant and control-owner evidence before the affected gate; unmet mandatory conditions block approval. |
| Risk assessment and register: [enterprise assessment](../../domains/uncertainty/project-lifecycle/02-planning/risk-management/enterprise-risk-assessment-template.md), [register](../../domains/uncertainty/project-lifecycle/02-planning/risk-management/risk-register-template.md) | Combined record of five ratings, evidence, owners and actions; update at least weekly. | Separate material risks, dependencies, contingencies and residual evidence; weekly owner review. | Weekly formal exposure/control review, plus immediate escalation of material breaches; explicit evidence-gap owners/dates and verified fallback readiness. More frequent monitoring where time-to-impact requires it. |
| Assurance and control evidence: [program quality plan](../../role-based-toolkits/program-manager/governance-framework/program-quality-management-plan.md), [security assessment](../../domains/measurement/industry-specializations/information-technology/cybersecurity/risk_assessment_template.md), [compliance assessment](../../domains/delivery/industry-specializations/healthcare-pharmaceutical/regulatory/compliance_risk_assessment_template.md) | Relevant checks and evidence links; do not import specialist artifacts without applicable exposure. | Targeted specialist review and evidence sampling on exposed areas; track remediation to completion. | Independent assurance of critical areas at applicable gates; traceable control evidence and unresolved findings with accountable sign-off. Specialist scores cannot waive mandatory controls. |
| Reporting and cadence: [portfolio cadence](../../role-based-toolkits/program-manager/portfolio-management/governance-cadence.md) | Weekly working update and at least monthly sponsor review, or the stricter tier cadence. | Weekly risk/status update and at least fortnightly sponsor/steering review. | Weekly formal risk/control report and at least fortnightly steering review; immediate material-breach escalation. Show unknowns, restrictions and decisions required. Portfolio reviews supplement project reviews. |
| Benefits and closure: [benefits governance](../../role-based-toolkits/program-manager/benefits-realization/benefits-governance.md) | Named outcome owner, acceptance evidence and remaining obligations at handover. | Add assumption validation, benefit dependencies and residual-risk ownership at handover. | Independently challenge material benefit assumptions; sponsor accepts residual exposure with accountable operational owners, monitoring and contingency arrangements. |
| Governance effectiveness: [governance assessment](../../domains/measurement/project-assessment-suite/governance-assessment-template.md), [risk-management assessment](../../domains/measurement/project-assessment-suite/risk-management-assessment-template.md) | Check controls are proportionate and working at scheduled reviews. | Sample decision, escalation and mitigation evidence; track improvement actions. | Review control failures, overdue actions and assurance findings at each applicable gate; maturity scores never substitute for exposure analysis. |

For technical exposure, intensify integration/recovery and security evidence; for schedule, dependency and recovery-plan review; for budget, estimate/funding and reserve review; for organizational, authority/capacity and adoption checks; for compliance, obligation/control evidence and responsible-owner review. Keep unaffected documentation concise while retaining all effective-tier controls.

## Uncertainty workflow and assessment handoff

The [Uncertainty domain](../../domains/uncertainty/README.md) owns identification, analysis, response and monitoring. This framework translates that evidence into governance decisions; Measurement assesses whether the process works.

1. Record threats, opportunities, assumptions and dependencies in the existing risk register. Move realized events to the issue log while retaining related future exposure.
2. Complete the five-dimension review, linking risk IDs and specialist assessments. Map specialist ordinal scores to the locally approved low/medium/high definitions with a written rationale; do not copy raw RPN, CVSS or maturity scores into the selector.
3. Record the resulting tier and artifact/cadence changes in the charter and decision log, with sponsor/control-owner approval.
4. Monitor action effectiveness at the approved cadence and after material context changes. Return evidence to the register and reassess before relaxing controls.

| Dimension | Rating | Risk IDs / dated evidence / assumptions | Current controls and verified residual exposure | Owner / action / due date / next review |
|---|---|---|---|---|
| Technical | [low/medium/high/unknown] | [References] | [Evidence] | [Details] |
| Schedule | [low/medium/high/unknown] | [References] | [Evidence] | [Details] |
| Budget | [low/medium/high/unknown] | [References] | [Evidence] | [Details] |
| Organizational | [low/medium/high/unknown] | [References] | [Evidence] | [Details] |
| Compliance | [low/medium/high/unknown] | [References] | [Evidence] | [Details] |

**Decision record:** [Assessment date/horizon; assessor; original context risk; assessed risk; effective risk/tier; policy floor; artifacts/cadences changed; retained mandatory controls; sponsor/control-owner approvals; effective date; next review].

## Three worked archetypes

Illustrative profiles below assume a Light policy floor, small project and small team. Ratings are scenario assumptions, not verified assessments. Medium or large scale can raise the resulting tier further.

| Archetype | Technical / Schedule / Budget / Organizational / Compliance | Existing context risk | Result | Concrete scaling |
|---|---|---|---|---|
| Low-risk internal improvement with tested solution and confirmed ownership | low / low / low / low / low | low | **Light** | Combined charter/risk/decision evidence; weekly record updates, monthly sponsor review and acceptance/closure gates. |
| Medium-risk cross-team rollout with a material supplier dependency | low / medium / medium / medium / low | medium | **Standard** | Named dependency owners, cost contingency and change impact records; weekly risk review, fortnightly sponsor review and release gate. |
| High-risk platform cutover with unproven recovery | high / medium / medium / medium / low | low | **Rigorous** | Recovery-test evidence, independent readiness review, funded fallback and sponsor/control-owner release decision; weekly formal reporting. Four lower ratings do not offset technical exposure. |

If recovery evidence is missing, use technical=`unknown`: the same Rigorous recommendation is provisional, with an evidence-gap owner/date. If the project's context is `regulatory`, all-low dimensions still retain Rigorous governance.

## Reproducible recommendation

The [reference helper](../../scripts/scale_governance_risk.py) composes the existing #746 selector. It leaves the context-model schema and original profile unchanged. It checks completeness and rating values, not evidence quality, control applicability or approval validity; those remain human review responsibilities.

```json
{
  "profile": {
    "profile_version": "1.0",
    "project_context": {
      "size": "small", "methodology": "hybrid", "risk_profile": "low",
      "team_size": "small", "industry": "it", "phase": "planning",
      "pm_experience": "intermediate"
    }
  },
  "risk_dimensions": {
    "technical": "high", "schedule": "medium", "budget": "medium",
    "organizational": "medium", "compliance": "low"
  }
}
```

Save as `risk-context.json` and run from the repository root:

```sh
python scripts/scale_governance_risk.py risk-context.json --minimum-tier light
```

This selects Rigorous. All five dimension keys are required; extra/misspelled dimension keys or invalid values fail with exit status 2 and no recommendation. An explicit unknown produces a provisional recommendation; it is not authorization to pass a gate.

The [event-driven controls catalog (#748)](event-driven-controls.md) uses this risk evidence to define triggers, accountable responses and notification patterns. It supplements scheduled reviews. The catalog is configuration guidance; deployment of automated alerting requires integration with the organization's monitoring tools.
