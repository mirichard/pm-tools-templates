# Governance Compliance Integration Framework

Story #750 · Epic #713 · Enterprise context: [#339](https://github.com/mirichard/pm-tools-templates/issues/339)

Source review: 09/20/2026. This guide maps five frameworks to existing governance artifacts, accountable evidence and reporting decisions. It supports implementation planning; it does not certify a project or determine legal applicability. The artifact mappings below are repository implementation recommendations, not statements that a regulator requires these particular templates.

## Apply an overlay to existing governance

1. Select the baseline using the [governance decision matrix](governance-decision-matrix.md). Retain the [risk-scaling floors](risk-based-scaling.md) and [scheduled/event controls](event-driven-controls.md).
2. Have the responsible legal, privacy, security or financial-control owner determine applicability by entity, jurisdiction, activity, data, contract and framework edition. Record **applicable**, **not applicable with rationale**, or **unresolved**. An industry label alone does not decide applicability.
3. Add the shared annotation record below to the project's existing charter, risk/control register or change record. Link evidence in its maintained location; do not create parallel DPIA, security-plan or control-testing templates here.
4. Separate legal obligations from certification/contract commitments, internal policy and optional improvements. Record the actual source, effective version, decision authority, reporting recipient, deadline basis and retention rule for each applicable obligation.
5. Validate control evidence before the affected gate. Route failures to E09 and suspected incidents to E10 in the event catalog; its internal response targets never extend a legal or contractual deadline. Unknown applicability remains unresolved, with an owner and due date, rather than silently becoming optional.

For fixed-governance environments, retain the prescribed controls. For projects with no applicable external obligations, record that conclusion and use only relevant policy or voluntary practices. A low residual-risk rating does not remove an obligation.

## Shared compliance annotation record

Append this record to an existing artifact or maintain a linked row in its register. One record may link several frameworks to the same control/evidence without duplicating the control itself.

| Field | Record in the existing artifact |
|---|---|
| Identity and artifact | Overlay ID; project/control ID; link to existing artifact and version. |
| Framework and source | GDPR / HIPAA / SOX / ISO/IEC 27001 / NIST CSF; provision or outcome; authoritative source URL; edition/effective date; date checked. |
| Applicability decision | Entity, jurisdiction, activity/data and scope; applicable/not applicable/unresolved; rationale; qualified reviewer and decision date. |
| Obligation basis | Law/regulation; certification or contract; internal policy; optional improvement. Include the binding instrument where relevant. |
| Control and owner | Existing control, accountable owner, implementation responsibility and required approval authority. |
| Evidence and verification | Required evidence; maintained location; test/review method and date; findings; independent review where required. |
| Reporting and deadlines | Internal and external recipients; report/notification condition; clock start; deadline and source; submission owner; approval and delivery evidence. |
| Retention and access | Record-specific retention basis, duration/start event, access restrictions, legal hold and disposal owner. Do not apply blanket audit-log retention periods. |
| Exceptions and follow-up | Open gap; interim restriction; action/owner/due date; next review; escalation route; accepted residual exposure and authority. |

Do not copy sensitive subject lists, health information or incident details into broadly distributed governance reports. Link access-controlled evidence and give decision makers the minimum necessary context.

## GDPR

**Applicability and basis:** assess material and territorial scope under Articles 2–3, and controller/processor responsibilities. EU residency alone is not the scope test. DPIA requirements depend on Article 35's high-risk-processing conditions; an assessment is not automatically required for every new activity. Use the [GDPR text](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng) for the actual obligations.

| Existing artifact | Overlay and evidence | Owner and reporting |
|---|---|---|
| [Risk register](../../domains/uncertainty/project-lifecycle/02-planning/risk-management/risk-register-template.md) | Link processing scope, applicable Article 35 assessment, safeguards and unresolved risks; retain the assessment itself, not a supposed “DPIA certificate.” | Controller's accountable owner with privacy/DPO advice where applicable; record any Article 36 consultation decision before processing. |
| [Change control](../../role-based-toolkits/project-manager/governance-tools/change-control-process.md) | Record privacy-impact review, lawful-basis/processor-arrangement changes and evidence links. | Privacy/legal owner reviews the affected change before authorization. |
| [Event notifications](event-notifications.md) | Link breach facts, assessment, notification decision and delivery evidence. | Article 33: controller notifies authority without undue delay and, where feasible, within 72 hours of awareness unless unlikely to risk rights/freedoms; processor informs controller without undue delay. Article 34 has a separate high-risk test for individuals. Record the applicable recipient and clock. |

Optional tooling, such as automated privacy metrics, does not replace applicable legal duties. Record lawful basis by processing purpose rather than assuming consent is always required.

## HIPAA

**Applicability and basis:** determine covered-entity/business-associate status. The Security Rule concerns electronic protected health information (ePHI); handling health-related data alone does not establish applicability. Risk analysis and safeguards follow the applicable rule, not a generic template score. [HHS Security Rule summary](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html).

| Existing artifact | Overlay and evidence | Owner and reporting |
|---|---|---|
| [Cybersecurity assessment](../../domains/measurement/industry-specializations/information-technology/security/cybersecurity_assessment_template.md) | Link ePHI scope, security risk analysis, safeguards and verified remediation. | Security official/control owners; report gaps and required gate evidence through the existing governance route. |
| [Governance charter](../../role-based-toolkits/project-manager/governance-tools/governance-charter.md) | Record privacy/security responsibilities, business-associate arrangements where applicable, and evidence ownership. | Privacy/security and legal owners confirm obligations and review cadence. |
| [Event notifications](event-notifications.md) | Link breach assessment, recipient decisions, submission dates and evidence supporting notification or non-notification. | Follow [HHS breach-notification rules](https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html): individual notice is without unreasonable delay and within 60 days of discovery; HHS reporting varies by breach size, media notice has additional conditions, and business associates notify covered entities. Record each applicable route and deadline. |

Do not label all implementations or training credentials legally mandatory. Record the current provision and applicability decision; voluntary certifications are not proof of compliance. Determine retention for each record category rather than treating all audit logs as subject to one duration.

## SOX

**Applicability and basis:** the financial-reporting owner determines issuer/filing status, relevant internal control over financial reporting (ICFR) scope and exemptions. Management reporting and auditor attestation are distinct; attestation is not universal. [17 CFR 229.308](https://www.ecfr.gov/current/title-17/chapter-II/part-229/subpart-229.300/section-229.308) specifies management's annual ICFR report, relevant auditor-attestation conditions and disclosure of material ICFR changes.

| Existing artifact | Overlay and evidence | Owner and reporting |
|---|---|---|
| [Compliance management](../../domains/measurement/industry-specializations/financial-services/compliance/compliance-management-template.md) | Link applicable filing requirements, ICFR control inventory, evaluation framework, testing and deficiency disposition. | Financial-control owner and management; prepare evidence for the annual ICFR assessment and applicable auditor attestation. |
| [Change control](../../role-based-toolkits/project-manager/governance-tools/change-control-process.md) | Link financial-system change impacts, authorization, access/segregation review and control retesting. | Finance/IT control owners; route material ICFR changes to the disclosure process for the relevant reporting period. |
| [Status report](../../domains/uncertainty/project-lifecycle/04-monitoring-control/progress-tracking/status-report-template.md) | Summarize unresolved deficiencies, accountable remediation and decisions; link restricted test evidence. | Management/disclosure authority determines required external disclosure; the project report is supporting evidence, not the statutory filing. |

Additional dashboards or continuous-audit tooling are implementation choices. Do not present a particular control framework or blanket seven-year system-log retention as a universal SOX requirement; record the applicable basis separately.

## ISO/IEC 27001

**Applicability and basis:** use the adopted edition and scoped information security management system (ISMS). ISO identifies **ISO/IEC 27001:2022** as the third edition, with a 2024 amendment. Certification is a choice unless a contract or other binding requirement makes it necessary. Consult the licensed standard for clause/control-level conformity; this guide does not reproduce it. [ISO standard overview](https://www.iso.org/standard/27001).

| Existing artifact | Overlay and evidence | Owner and reporting |
|---|---|---|
| [Security risk assessment](../../domains/measurement/industry-specializations/information-technology/cybersecurity/risk_assessment_template.md) | Link ISMS scope, assessed risks, treatment decisions and the organization's documented control-applicability/selection record against its adopted edition. | ISMS/risk owner; submit treatment and unresolved gaps to the approved management-review route. |
| [Governance assessment](../../domains/measurement/project-assessment-suite/governance-assessment-template.md) | Link control-effectiveness evidence, audit findings and corrective actions; this worksheet is not a certification audit. | ISMS management and assurance owners; retain review decisions and improvement actions. |
| [Governance charter](../../role-based-toolkits/project-manager/governance-tools/governance-charter.md) | Identify scoped responsibilities, certification/contract commitments, evidence owners and review arrangements. | Management; report to certification/customer recipients only where required by the chosen arrangement. |

Distinguish requirements for claimed conformity from optional tooling or certification choices. Map controls from the adopted edition; do not reuse the previous draft's obsolete Annex A range or fixed policy count.

## NIST CSF 2.0

**Applicability and basis:** CSF 2.0 supports organizations across sectors. Most use is voluntary, but government requirements or contracts can make adoption binding. It is an outcome framework, not a certification or automatic federal authorization. Record any separate SP 800-53, system-security-plan or authorization requirement under its own authority. [NIST applicability FAQ](https://www.nist.gov/cyberframework/faqs).

All six functions are included, with **Govern** added in CSF 2.0. [NIST release announcement, 02/26/2024](https://www.nist.gov/news-events/news/2024/02/nist-releases-version-20-landmark-cybersecurity-framework).

| Function | Existing artifact | Overlay evidence and reporting owner |
|---|---|---|
| Govern | [Governance charter](../../role-based-toolkits/project-manager/governance-tools/governance-charter.md) | Risk strategy, authority, policy and supplier oversight; management reviews decisions and accountability. |
| Identify | [Enterprise risk assessment](../../domains/uncertainty/project-lifecycle/02-planning/risk-management/enterprise-risk-assessment-template.md) | Scoped assets/dependencies, risks and priorities; risk owner reports exposure and gaps. |
| Protect | [Cybersecurity assessment](../../domains/measurement/industry-specializations/information-technology/security/cybersecurity_assessment_template.md) | Selected safeguard implementation and effectiveness evidence; control owners report exceptions. |
| Detect | [Project dashboard](../../domains/uncertainty/project-lifecycle/04-monitoring-control/progress-tracking/project-dashboard-template.md) | Links to actual security-monitoring sources and findings; security owner reports coverage gaps. The dashboard is not a detection service. |
| Respond | [Event controls](event-driven-controls.md) | Incident-route linkage, authorized decisions and response evidence; incident lead handles required notifications. |
| Recover | [Disaster recovery plan](../../domains/planning/industry-specializations/information-technology/infrastructure/disaster_recovery_template.md) | Recovery plans, exercise/restore results and lessons; recovery owner reports readiness and residual exposure. |

Use these proposed artifact mappings to track current/target outcomes and gaps. Define internal reporting in the charter and external reporting from the applicable authority/contract; CSF adoption alone does not impose a universal notification deadline or annual authorization cycle.

## Integrate the repository compliance assets

These existing assets address **repository intellectual-property (IP) review**, not validation of the five frameworks above. Keep their output in a separate IP-review record linked to the same governance process when repository content is being adopted or redistributed.

| Existing asset | Actual role | Integration and evidence boundary |
|---|---|---|
| [README_COMPLIANCE.md](../../README_COMPLIANCE.md) | Historical PMI/IP mitigation status and pointers. | Repository maintainer verifies applicable content-use concerns and records reviewed findings/decisions. Historical status labels are not current legal assurance or regulatory evidence. |
| [.compliance_scripts/README.md](../../.compliance_scripts/README.md) | Legacy IP-tooling documentation; the directory contains documentation, not the advertised executable suite. | Use the corrected inventory; do not rely on missing scripts or hypothetical regulatory automation. |
| [validate_ip_compliance.sh](../../validate_ip_compliance.sh) | Root-level keyword heuristic for PMI references/disclaimers. | If used, retain the exact script revision, invocation, individual findings and human disposition. Its aggregate counters run across a pipeline/subshell boundary and are not reliable proof of a clean scan. It does not assess GDPR, HIPAA, SOX, ISO or NIST controls. |

No script run, summary score or disclaimer establishes legal compliance. This correction documents the integration boundary; it does not repair or certify the legacy heuristic. Assign substantive IP questions to the appropriate reviewer rather than treating all trademark mentions as violations.

## Worked overlay: change to an in-scope financial system

Illustrative record, not a finding about a real organization:

| Annotation field | Example to complete in the existing change record |
|---|---|
| Identity/artifact | OVL-01 → project change CR-17 in the existing change-control record. |
| Source/basis | SOX-related ICFR; 17 CFR 229.308; legal/regulatory basis confirmed by the financial-reporting owner, including applicable filing status. |
| Applicability | Change affects the scoped financial close interface; record reviewer, actual rationale and decision date. |
| Owner/control | Named finance and IT control owners; existing access/change controls; designated change authority. |
| Evidence | Link impact review, approved test cases, results, exceptions and authorization in the existing evidence store. |
| Reporting | Finance owner assesses material ICFR change reporting for the relevant filing period; record recipient, due date/basis and delivery evidence. Internal review occurs before the affected release. |
| Retention/access | Record-specific approved schedule and restricted access; no assumed blanket duration. |
| Follow-up | Track unresolved defects in the issue log; approval authority confirms disposition before the gate. |

The overlay annotates CR-17 and references existing evidence; it does not create a second change process, risk register or control-testing template. Reuse the same record structure for each applicable framework.

## Review and completion

Before adoption, the compliance owner verifies source currency, applicability, reporting and retention with the responsible specialists. Review when scope, law, contract, framework edition or controls change, and at the scheduled governance reviews. Record required operational ownership at handover.

The [enterprise compliance initiative #339](https://github.com/mirichard/pm-tools-templates/issues/339) is related context, not evidence that its separate scope is delivered. Acceptance of #750 concerns the five-framework mapping, artifact integration and annotation guidance here; it does not certify users' projects or close #339.
