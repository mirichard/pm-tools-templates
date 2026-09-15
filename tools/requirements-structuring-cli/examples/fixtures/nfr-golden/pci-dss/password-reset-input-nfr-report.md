# NFR Report: UC-PASSWORD-RESET

**Status: Classification and candidate generation complete; human input required**

NFR candidates generated; human input required for all unbound parameters.

NFR candidates follow below; placeholders are not approved acceptance criteria.

## Input

- Artifact: ucs
- Use case: Allows a user to reset their forgotten password and regain access to their account.

## Requested Options

- Provider: gemini
- Model: gemini-2.5-flash
- Attributes: functional-suitability, performance-efficiency, compatibility, interaction-capability, reliability, security, maintainability, flexibility, safety
- Confidence threshold: unspecified
- Overlay: pci-dss (explicit selection; additive patterns)

Metric/Gherkin integration (#1110) and the confidence review gate (#1111) remain follow-ups.
Confidence values are model estimates, not calibrated probabilities; no threshold gate was applied.

## Attribute Classifications

- Taxonomy revision: 0.1.0
- Taxonomy SHA-256: 47de9aab009cb305c8aa78df18b3b6455bc891b153058e2aa477d678112ef104
- Prompt version: 1.0.1
- Considered characteristics: functional-suitability, performance-efficiency, compatibility, interaction-capability, reliability, security, maintainability, flexibility, safety

| FR path | Characteristic | Sub-characteristic | Confidence |
| --- | --- | --- | --- |
| /basicFlow/steps/0 | functional-suitability | functional-completeness | 0.9 |
| /basicFlow/steps/0 | functional-suitability | functional-appropriateness | 0.9 |
| /basicFlow/steps/0 | security | authenticity | 0.85 |
| /basicFlow/steps/0 | security | resistance | 0.8 |
| /basicFlow/steps/1 | functional-suitability | functional-completeness | 0.95 |
| /basicFlow/steps/1 | functional-suitability | functional-correctness | 0.95 |
| /basicFlow/steps/1 | functional-suitability | functional-appropriateness | 0.9 |
| /basicFlow/steps/1 | compatibility | interoperability | 0.9 |
| /basicFlow/steps/1 | reliability | faultlessness | 0.85 |
| /basicFlow/steps/1 | reliability | availability | 0.8 |
| /basicFlow/steps/1 | security | confidentiality | 0.95 |
| /basicFlow/steps/1 | security | integrity | 0.9 |
| /basicFlow/steps/2 | functional-suitability | functional-completeness | 0.95 |
| /basicFlow/steps/2 | functional-suitability | functional-correctness | 0.95 |
| /basicFlow/steps/2 | functional-suitability | functional-appropriateness | 0.9 |
| /basicFlow/steps/2 | interaction-capability | appropriateness-recognizability | 0.7 |
| /basicFlow/steps/2 | interaction-capability | operability | 0.75 |
| /basicFlow/steps/2 | interaction-capability | self-descriptiveness | 0.7 |
| /basicFlow/steps/2 | reliability | faultlessness | 0.6 |
| /basicFlow/steps/2 | reliability | availability | 0.6 |
| /basicFlow/steps/2 | security | confidentiality | 0.85 |
| /basicFlow/steps/2 | security | integrity | 0.7 |
| /basicFlow/steps/2 | security | authenticity | 0.9 |
| /basicFlow/steps/2 | security | resistance | 0.7 |
| /basicFlow/steps/3 | functional-suitability | functional-completeness | 0.95 |
| /basicFlow/steps/3 | functional-suitability | functional-correctness | 0.95 |
| /basicFlow/steps/3 | functional-suitability | functional-appropriateness | 0.9 |
| /basicFlow/steps/3 | interaction-capability | user-error-protection | 0.9 |
| /basicFlow/steps/3 | security | integrity | 0.9 |
| /basicFlow/steps/3 | security | authenticity | 0.85 |
| /basicFlow/steps/3 | security | resistance | 0.85 |
| /basicFlow/steps/4 | functional-suitability | functional-completeness | 0.9 |
| /basicFlow/steps/4 | functional-suitability | functional-correctness | 1 |
| /basicFlow/steps/4 | functional-suitability | functional-appropriateness | 0.8 |
| /basicFlow/steps/4 | reliability | faultlessness | 0.9 |
| /basicFlow/steps/4 | security | confidentiality | 0.9 |
| /basicFlow/steps/4 | security | integrity | 0.9 |
| /basicFlow/steps/4 | security | resistance | 0.9 |
| /basicFlow/steps/5 | functional-suitability | functional-completeness | 0.9 |
| /basicFlow/steps/5 | functional-suitability | functional-correctness | 0.9 |
| /basicFlow/steps/5 | functional-suitability | functional-appropriateness | 0.9 |
| /basicFlow/steps/5 | security | confidentiality | 0.9 |
| /basicFlow/steps/5 | security | integrity | 0.9 |
| /basicFlow/steps/5 | security | resistance | 0.95 |
| /basicFlow/steps/6 | functional-suitability | functional-completeness | 0.9 |
| /basicFlow/steps/6 | functional-suitability | functional-correctness | 0.95 |
| /basicFlow/steps/6 | functional-suitability | functional-appropriateness | 0.95 |
| /basicFlow/steps/6 | interaction-capability | operability | 0.9 |
| /basicFlow/steps/6 | interaction-capability | user-assistance | 0.95 |
| /basicFlow/steps/6 | interaction-capability | self-descriptiveness | 0.9 |
| /alternativeFlows/0/steps/0 | security | confidentiality | 0.95 |
| /alternativeFlows/0/steps/0 | security | resistance | 0.9 |
| /alternativeFlows/1/steps/0 | functional-suitability | functional-completeness | 0.9 |
| /alternativeFlows/1/steps/0 | functional-suitability | functional-correctness | 0.95 |
| /alternativeFlows/1/steps/0 | functional-suitability | functional-appropriateness | 0.9 |
| /alternativeFlows/1/steps/0 | interaction-capability | appropriateness-recognizability | 0.9 |
| /alternativeFlows/1/steps/0 | interaction-capability | learnability | 0.85 |
| /alternativeFlows/1/steps/0 | interaction-capability | operability | 0.9 |
| /alternativeFlows/1/steps/0 | interaction-capability | user-error-protection | 0.95 |
| /alternativeFlows/1/steps/0 | interaction-capability | user-assistance | 0.9 |
| /alternativeFlows/1/steps/0 | interaction-capability | self-descriptiveness | 0.9 |
| /alternativeFlows/1/steps/0 | reliability | faultlessness | 0.8 |
| /alternativeFlows/1/steps/0 | security | integrity | 0.85 |
| /alternativeFlows/1/steps/0 | security | resistance | 0.8 |
| /exceptionFlows/0/steps/0 | functional-suitability | functional-completeness | 0.9 |
| /exceptionFlows/0/steps/0 | functional-suitability | functional-correctness | 0.95 |
| /exceptionFlows/0/steps/0 | functional-suitability | functional-appropriateness | 0.9 |
| /exceptionFlows/0/steps/0 | interaction-capability | operability | 0.85 |
| /exceptionFlows/0/steps/0 | interaction-capability | user-error-protection | 0.9 |
| /exceptionFlows/0/steps/0 | interaction-capability | user-assistance | 0.9 |
| /exceptionFlows/0/steps/0 | interaction-capability | self-descriptiveness | 0.9 |
| /exceptionFlows/0/steps/0 | reliability | fault-tolerance | 0.8 |
| /exceptionFlows/0/steps/0 | reliability | recoverability | 0.9 |

The bundled library (#1115) is a review candidate requiring human verification
against ISO/IEC 25010:2023; overlay selection does not establish compliance.

## Generated NFR Candidates

Candidates need human input before they are testable acceptance criteria. No targets or measurement conditions were inferred.

Renderer: 1.0.0; selected overlay: pci-dss.

Taxonomy structure and sub-characteristic descriptions are reconstructed from secondary/public sources, not the primary ISO/IEC 25010:2023 document (paywalled). REQUIRES human verification against the purchased standard before being treated as authoritative for a released product.

### FR /basicFlow/steps/0

#### functional-suitability

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/0:core.functional-completeness

\[NEEDS INPUT: system\] shall provide implemented functions for at least \[NEEDS INPUT: target\] percent of the required tasks in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 1; sub-characteristic: functional-completeness; confidence: 0.9.
Pattern: core.functional-completeness; library: 0.1.0; taxonomy: 0.1.0.
Metric: coverage; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Count tasks with an implemented function divided by all required tasks; freeze the task inventory before assessment.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 5.3.1 Metrics Used in Testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/0:core.functional-appropriateness

\[NEEDS INPUT: system\] shall enable completion of \[NEEDS INPUT: scope\] in at most \[NEEDS INPUT: target\] user actions per task under \[NEEDS INPUT: conditions\].

Source step: 1; sub-characteristic: functional-appropriateness; confidence: 0.9.
Pattern: core.functional-appropriateness; library: 0.1.0; taxonomy: 0.1.0.
Metric: count; unit: actions; comparison: &lt;=.
Measurement guidance (not supplied project conditions): Count actions from task start to successful goal; report the maximum across the predefined task set.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 2.2.2 Test Types; non-functional testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### security

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/0:core.authenticity

\[NEEDS INPUT: system\] shall reject at least \[NEEDS INPUT: target\] percent of the impersonation attempts in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 1; sub-characteristic: authenticity; confidence: 0.85.
Pattern: core.authenticity; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use a declared authentication threat corpus and expected identities; count all attempts.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V6 Authentication; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/0:core.resistance

\[NEEDS INPUT: system\] shall block at least \[NEEDS INPUT: target\] percent of the attack cases in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 1; sub-characteristic: resistance; confidence: 0.8.
Pattern: core.resistance; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Freeze the attack corpus and success oracle; passing does not imply protection from untested attacks.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V1 Encoding and Sanitization; V2 Validation and Business Logic; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

### FR /basicFlow/steps/1

#### functional-suitability

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/1:core.functional-completeness

\[NEEDS INPUT: system\] shall provide implemented functions for at least \[NEEDS INPUT: target\] percent of the required tasks in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 2; sub-characteristic: functional-completeness; confidence: 0.95.
Pattern: core.functional-completeness; library: 0.1.0; taxonomy: 0.1.0.
Metric: coverage; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Count tasks with an implemented function divided by all required tasks; freeze the task inventory before assessment.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 5.3.1 Metrics Used in Testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/1:core.functional-correctness

\[NEEDS INPUT: system\] shall produce the expected result in at least \[NEEDS INPUT: target\] percent of the oracle-backed cases in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 2; sub-characteristic: functional-correctness; confidence: 0.95.
Pattern: core.functional-correctness; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Compare actual results with independently approved expected results; denominator includes every executed case.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 5.3.1 Metrics Used in Testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/1:core.functional-appropriateness

\[NEEDS INPUT: system\] shall enable completion of \[NEEDS INPUT: scope\] in at most \[NEEDS INPUT: target\] user actions per task under \[NEEDS INPUT: conditions\].

Source step: 2; sub-characteristic: functional-appropriateness; confidence: 0.9.
Pattern: core.functional-appropriateness; library: 0.1.0; taxonomy: 0.1.0.
Metric: count; unit: actions; comparison: &lt;=.
Measurement guidance (not supplied project conditions): Count actions from task start to successful goal; report the maximum across the predefined task set.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 2.2.2 Test Types; non-functional testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### compatibility

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/1:core.interoperability

\[NEEDS INPUT: system\] shall exchange and correctly interpret at least \[NEEDS INPUT: target\] percent of the interface cases in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 2; sub-characteristic: interoperability; confidence: 0.9.
Pattern: core.interoperability; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use independently specified peer/version combinations and semantic expectations; failed exchanges remain in the denominator.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 2.2.1 Test Levels; system integration testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### reliability

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/1:core.faultlessness

\[NEEDS INPUT: system\] shall complete at least \[NEEDS INPUT: target\] percent of the operations in \[NEEDS INPUT: scope\] without a defined failure under \[NEEDS INPUT: conditions\].

Source step: 2; sub-characteristic: faultlessness; confidence: 0.85.
Pattern: core.faultlessness; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Freeze failure criteria and observation window; denominator includes timeouts and failed operations.

Framework: Google Site Reliability Engineering: Service Level Objectives; edition: 2016, chapter 4; section: Indicators; error rate; reference: https://sre.google/sre-book/service-level-objectives/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/1:core.availability

\[NEEDS INPUT: system\] shall remain ready for \[NEEDS INPUT: scope\] for at least \[NEEDS INPUT: target\] percent of the observation time under \[NEEDS INPUT: conditions\].

Source step: 2; sub-characteristic: availability; confidence: 0.8.
Pattern: core.availability; library: 0.1.0; taxonomy: 0.1.0.
Metric: availability; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Divide ready time by total in-scope time using fixed probes and interval; disclose maintenance and exclusions.

Framework: Google Site Reliability Engineering: Service Level Objectives; edition: 2016, chapter 4; section: Indicators; availability; reference: https://sre.google/sre-book/service-level-objectives/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### security

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/1:core.confidentiality

\[NEEDS INPUT: system\] shall reject at least \[NEEDS INPUT: target\] percent of unauthorized disclosure attempts against \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 2; sub-characteristic: confidentiality; confidence: 0.95.
Pattern: core.confidentiality; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use an approved access matrix and negative tests; this finite test metric is not a claim of universal protection.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V8 Authorization; V14 Data Protection; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/1:pci-dss.confidentiality

\[NEEDS INPUT: system\] shall retain at most \[NEEDS INPUT: target\] sensitive-authentication-data records in \[NEEDS INPUT: scope\] after authorization under \[NEEDS INPUT: conditions\].

Source step: 2; sub-characteristic: confidentiality; confidence: 0.95.
Pattern: pci-dss.confidentiality; library: 0.1.0; taxonomy: 0.1.0.
Metric: count; unit: records; comparison: &lt;=.
Measurement guidance (not supplied project conditions): Inspect persistent stores, logs and backups after authorization; the referenced prohibition requires target 0, not an adjustable tolerance.

Framework: PCI SSC FAQ 1154: account-data retention; edition: PCI DSS requirement 3.3.1, FAQ accessed 2026-09-11; section: FAQ 1154; requirement 3.3.1; reference: https://www.pcisecuritystandards.org/faqs/1154/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/1:core.integrity

\[NEEDS INPUT: system\] shall detect at least \[NEEDS INPUT: target\] percent of unauthorized modifications to \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 2; sub-characteristic: integrity; confidence: 0.9.
Pattern: core.integrity; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Apply a declared tampering corpus and verify detection with an independent oracle.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V11 Cryptography; V14 Data Protection; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

### FR /basicFlow/steps/2

#### functional-suitability

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/2:core.functional-completeness

\[NEEDS INPUT: system\] shall provide implemented functions for at least \[NEEDS INPUT: target\] percent of the required tasks in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 3; sub-characteristic: functional-completeness; confidence: 0.95.
Pattern: core.functional-completeness; library: 0.1.0; taxonomy: 0.1.0.
Metric: coverage; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Count tasks with an implemented function divided by all required tasks; freeze the task inventory before assessment.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 5.3.1 Metrics Used in Testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/2:core.functional-correctness

\[NEEDS INPUT: system\] shall produce the expected result in at least \[NEEDS INPUT: target\] percent of the oracle-backed cases in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 3; sub-characteristic: functional-correctness; confidence: 0.95.
Pattern: core.functional-correctness; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Compare actual results with independently approved expected results; denominator includes every executed case.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 5.3.1 Metrics Used in Testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/2:core.functional-appropriateness

\[NEEDS INPUT: system\] shall enable completion of \[NEEDS INPUT: scope\] in at most \[NEEDS INPUT: target\] user actions per task under \[NEEDS INPUT: conditions\].

Source step: 3; sub-characteristic: functional-appropriateness; confidence: 0.9.
Pattern: core.functional-appropriateness; library: 0.1.0; taxonomy: 0.1.0.
Metric: count; unit: actions; comparison: &lt;=.
Measurement guidance (not supplied project conditions): Count actions from task start to successful goal; report the maximum across the predefined task set.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 2.2.2 Test Types; non-functional testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### interaction-capability

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/2:core.appropriateness-recognizability

\[NEEDS INPUT: system\] shall enable at least \[NEEDS INPUT: target\] percent of participants to identify its suitability for \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 3; sub-characteristic: appropriateness-recognizability; confidence: 0.7.
Pattern: core.appropriateness-recognizability; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use unprompted suitability decisions against an agreed task rubric and a predefined participant cohort.

Framework: Web Content Accessibility Guidelines; edition: 2.2 Recommendation 2024-12-12; section: 2.4.6 Headings and Labels; curator-derived usability study; reference: https://www.w3.org/TR/2024/REC-WCAG22-20241212/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/2:core.operability

\[NEEDS INPUT: system\] shall enable at least \[NEEDS INPUT: target\] percent of participants to complete \[NEEDS INPUT: scope\] without operator assistance under \[NEEDS INPUT: conditions\].

Source step: 3; sub-characteristic: operability; confidence: 0.75.
Pattern: core.operability; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use a declared task-success rubric; denominator includes all enrolled participants who attempt the task.

Framework: Web Content Accessibility Guidelines; edition: 2.2 Recommendation 2024-12-12; section: 2.1.1 Keyboard; curator-derived operation measure; reference: https://www.w3.org/TR/2024/REC-WCAG22-20241212/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/2:core.self-descriptiveness

\[NEEDS INPUT: system\] shall enable at least \[NEEDS INPUT: target\] percent of participants to explain the current state and next valid action for \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 3; sub-characteristic: self-descriptiveness; confidence: 0.7.
Pattern: core.self-descriptiveness; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Score explanations using an independent state/action rubric without external instructions.

Framework: Web Content Accessibility Guidelines; edition: 2.2 Recommendation 2024-12-12; section: 4.1.3 Status Messages; curator-derived comprehension measure; reference: https://www.w3.org/TR/2024/REC-WCAG22-20241212/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### reliability

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/2:core.faultlessness

\[NEEDS INPUT: system\] shall complete at least \[NEEDS INPUT: target\] percent of the operations in \[NEEDS INPUT: scope\] without a defined failure under \[NEEDS INPUT: conditions\].

Source step: 3; sub-characteristic: faultlessness; confidence: 0.6.
Pattern: core.faultlessness; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Freeze failure criteria and observation window; denominator includes timeouts and failed operations.

Framework: Google Site Reliability Engineering: Service Level Objectives; edition: 2016, chapter 4; section: Indicators; error rate; reference: https://sre.google/sre-book/service-level-objectives/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/2:core.availability

\[NEEDS INPUT: system\] shall remain ready for \[NEEDS INPUT: scope\] for at least \[NEEDS INPUT: target\] percent of the observation time under \[NEEDS INPUT: conditions\].

Source step: 3; sub-characteristic: availability; confidence: 0.6.
Pattern: core.availability; library: 0.1.0; taxonomy: 0.1.0.
Metric: availability; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Divide ready time by total in-scope time using fixed probes and interval; disclose maintenance and exclusions.

Framework: Google Site Reliability Engineering: Service Level Objectives; edition: 2016, chapter 4; section: Indicators; availability; reference: https://sre.google/sre-book/service-level-objectives/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### security

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/2:core.confidentiality

\[NEEDS INPUT: system\] shall reject at least \[NEEDS INPUT: target\] percent of unauthorized disclosure attempts against \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 3; sub-characteristic: confidentiality; confidence: 0.85.
Pattern: core.confidentiality; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use an approved access matrix and negative tests; this finite test metric is not a claim of universal protection.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V8 Authorization; V14 Data Protection; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/2:pci-dss.confidentiality

\[NEEDS INPUT: system\] shall retain at most \[NEEDS INPUT: target\] sensitive-authentication-data records in \[NEEDS INPUT: scope\] after authorization under \[NEEDS INPUT: conditions\].

Source step: 3; sub-characteristic: confidentiality; confidence: 0.85.
Pattern: pci-dss.confidentiality; library: 0.1.0; taxonomy: 0.1.0.
Metric: count; unit: records; comparison: &lt;=.
Measurement guidance (not supplied project conditions): Inspect persistent stores, logs and backups after authorization; the referenced prohibition requires target 0, not an adjustable tolerance.

Framework: PCI SSC FAQ 1154: account-data retention; edition: PCI DSS requirement 3.3.1, FAQ accessed 2026-09-11; section: FAQ 1154; requirement 3.3.1; reference: https://www.pcisecuritystandards.org/faqs/1154/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/2:core.integrity

\[NEEDS INPUT: system\] shall detect at least \[NEEDS INPUT: target\] percent of unauthorized modifications to \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 3; sub-characteristic: integrity; confidence: 0.7.
Pattern: core.integrity; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Apply a declared tampering corpus and verify detection with an independent oracle.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V11 Cryptography; V14 Data Protection; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/2:core.authenticity

\[NEEDS INPUT: system\] shall reject at least \[NEEDS INPUT: target\] percent of the impersonation attempts in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 3; sub-characteristic: authenticity; confidence: 0.9.
Pattern: core.authenticity; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use a declared authentication threat corpus and expected identities; count all attempts.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V6 Authentication; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/2:core.resistance

\[NEEDS INPUT: system\] shall block at least \[NEEDS INPUT: target\] percent of the attack cases in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 3; sub-characteristic: resistance; confidence: 0.7.
Pattern: core.resistance; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Freeze the attack corpus and success oracle; passing does not imply protection from untested attacks.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V1 Encoding and Sanitization; V2 Validation and Business Logic; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

### FR /basicFlow/steps/3

#### functional-suitability

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/3:core.functional-completeness

\[NEEDS INPUT: system\] shall provide implemented functions for at least \[NEEDS INPUT: target\] percent of the required tasks in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 4; sub-characteristic: functional-completeness; confidence: 0.95.
Pattern: core.functional-completeness; library: 0.1.0; taxonomy: 0.1.0.
Metric: coverage; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Count tasks with an implemented function divided by all required tasks; freeze the task inventory before assessment.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 5.3.1 Metrics Used in Testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/3:core.functional-correctness

\[NEEDS INPUT: system\] shall produce the expected result in at least \[NEEDS INPUT: target\] percent of the oracle-backed cases in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 4; sub-characteristic: functional-correctness; confidence: 0.95.
Pattern: core.functional-correctness; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Compare actual results with independently approved expected results; denominator includes every executed case.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 5.3.1 Metrics Used in Testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/3:core.functional-appropriateness

\[NEEDS INPUT: system\] shall enable completion of \[NEEDS INPUT: scope\] in at most \[NEEDS INPUT: target\] user actions per task under \[NEEDS INPUT: conditions\].

Source step: 4; sub-characteristic: functional-appropriateness; confidence: 0.9.
Pattern: core.functional-appropriateness; library: 0.1.0; taxonomy: 0.1.0.
Metric: count; unit: actions; comparison: &lt;=.
Measurement guidance (not supplied project conditions): Count actions from task start to successful goal; report the maximum across the predefined task set.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 2.2.2 Test Types; non-functional testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### interaction-capability

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/3:core.user-error-protection

\[NEEDS INPUT: system\] shall prevent at least \[NEEDS INPUT: target\] percent of the erroneous actions in \[NEEDS INPUT: scope\] from causing the defined unwanted outcome under \[NEEDS INPUT: conditions\].

Source step: 4; sub-characteristic: user-error-protection; confidence: 0.9.
Pattern: core.user-error-protection; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Inject the frozen error catalogue; count blocked or safely corrected outcomes over all injected errors.

Framework: Web Content Accessibility Guidelines; edition: 2.2 Recommendation 2024-12-12; section: 3.3.6 Error Prevention (All); curator-derived error measure; reference: https://www.w3.org/TR/2024/REC-WCAG22-20241212/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### security

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/3:core.integrity

\[NEEDS INPUT: system\] shall detect at least \[NEEDS INPUT: target\] percent of unauthorized modifications to \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 4; sub-characteristic: integrity; confidence: 0.9.
Pattern: core.integrity; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Apply a declared tampering corpus and verify detection with an independent oracle.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V11 Cryptography; V14 Data Protection; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/3:core.authenticity

\[NEEDS INPUT: system\] shall reject at least \[NEEDS INPUT: target\] percent of the impersonation attempts in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 4; sub-characteristic: authenticity; confidence: 0.85.
Pattern: core.authenticity; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use a declared authentication threat corpus and expected identities; count all attempts.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V6 Authentication; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/3:core.resistance

\[NEEDS INPUT: system\] shall block at least \[NEEDS INPUT: target\] percent of the attack cases in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 4; sub-characteristic: resistance; confidence: 0.85.
Pattern: core.resistance; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Freeze the attack corpus and success oracle; passing does not imply protection from untested attacks.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V1 Encoding and Sanitization; V2 Validation and Business Logic; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

### FR /basicFlow/steps/4

#### functional-suitability

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/4:core.functional-completeness

\[NEEDS INPUT: system\] shall provide implemented functions for at least \[NEEDS INPUT: target\] percent of the required tasks in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 5; sub-characteristic: functional-completeness; confidence: 0.9.
Pattern: core.functional-completeness; library: 0.1.0; taxonomy: 0.1.0.
Metric: coverage; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Count tasks with an implemented function divided by all required tasks; freeze the task inventory before assessment.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 5.3.1 Metrics Used in Testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/4:core.functional-correctness

\[NEEDS INPUT: system\] shall produce the expected result in at least \[NEEDS INPUT: target\] percent of the oracle-backed cases in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 5; sub-characteristic: functional-correctness; confidence: 1.
Pattern: core.functional-correctness; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Compare actual results with independently approved expected results; denominator includes every executed case.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 5.3.1 Metrics Used in Testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/4:core.functional-appropriateness

\[NEEDS INPUT: system\] shall enable completion of \[NEEDS INPUT: scope\] in at most \[NEEDS INPUT: target\] user actions per task under \[NEEDS INPUT: conditions\].

Source step: 5; sub-characteristic: functional-appropriateness; confidence: 0.8.
Pattern: core.functional-appropriateness; library: 0.1.0; taxonomy: 0.1.0.
Metric: count; unit: actions; comparison: &lt;=.
Measurement guidance (not supplied project conditions): Count actions from task start to successful goal; report the maximum across the predefined task set.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 2.2.2 Test Types; non-functional testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### reliability

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/4:core.faultlessness

\[NEEDS INPUT: system\] shall complete at least \[NEEDS INPUT: target\] percent of the operations in \[NEEDS INPUT: scope\] without a defined failure under \[NEEDS INPUT: conditions\].

Source step: 5; sub-characteristic: faultlessness; confidence: 0.9.
Pattern: core.faultlessness; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Freeze failure criteria and observation window; denominator includes timeouts and failed operations.

Framework: Google Site Reliability Engineering: Service Level Objectives; edition: 2016, chapter 4; section: Indicators; error rate; reference: https://sre.google/sre-book/service-level-objectives/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### security

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/4:core.confidentiality

\[NEEDS INPUT: system\] shall reject at least \[NEEDS INPUT: target\] percent of unauthorized disclosure attempts against \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 5; sub-characteristic: confidentiality; confidence: 0.9.
Pattern: core.confidentiality; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use an approved access matrix and negative tests; this finite test metric is not a claim of universal protection.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V8 Authorization; V14 Data Protection; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/4:pci-dss.confidentiality

\[NEEDS INPUT: system\] shall retain at most \[NEEDS INPUT: target\] sensitive-authentication-data records in \[NEEDS INPUT: scope\] after authorization under \[NEEDS INPUT: conditions\].

Source step: 5; sub-characteristic: confidentiality; confidence: 0.9.
Pattern: pci-dss.confidentiality; library: 0.1.0; taxonomy: 0.1.0.
Metric: count; unit: records; comparison: &lt;=.
Measurement guidance (not supplied project conditions): Inspect persistent stores, logs and backups after authorization; the referenced prohibition requires target 0, not an adjustable tolerance.

Framework: PCI SSC FAQ 1154: account-data retention; edition: PCI DSS requirement 3.3.1, FAQ accessed 2026-09-11; section: FAQ 1154; requirement 3.3.1; reference: https://www.pcisecuritystandards.org/faqs/1154/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/4:core.integrity

\[NEEDS INPUT: system\] shall detect at least \[NEEDS INPUT: target\] percent of unauthorized modifications to \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 5; sub-characteristic: integrity; confidence: 0.9.
Pattern: core.integrity; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Apply a declared tampering corpus and verify detection with an independent oracle.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V11 Cryptography; V14 Data Protection; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/4:core.resistance

\[NEEDS INPUT: system\] shall block at least \[NEEDS INPUT: target\] percent of the attack cases in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 5; sub-characteristic: resistance; confidence: 0.9.
Pattern: core.resistance; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Freeze the attack corpus and success oracle; passing does not imply protection from untested attacks.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V1 Encoding and Sanitization; V2 Validation and Business Logic; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

### FR /basicFlow/steps/5

#### functional-suitability

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/5:core.functional-completeness

\[NEEDS INPUT: system\] shall provide implemented functions for at least \[NEEDS INPUT: target\] percent of the required tasks in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 5.1; sub-characteristic: functional-completeness; confidence: 0.9.
Pattern: core.functional-completeness; library: 0.1.0; taxonomy: 0.1.0.
Metric: coverage; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Count tasks with an implemented function divided by all required tasks; freeze the task inventory before assessment.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 5.3.1 Metrics Used in Testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/5:core.functional-correctness

\[NEEDS INPUT: system\] shall produce the expected result in at least \[NEEDS INPUT: target\] percent of the oracle-backed cases in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 5.1; sub-characteristic: functional-correctness; confidence: 0.9.
Pattern: core.functional-correctness; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Compare actual results with independently approved expected results; denominator includes every executed case.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 5.3.1 Metrics Used in Testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/5:core.functional-appropriateness

\[NEEDS INPUT: system\] shall enable completion of \[NEEDS INPUT: scope\] in at most \[NEEDS INPUT: target\] user actions per task under \[NEEDS INPUT: conditions\].

Source step: 5.1; sub-characteristic: functional-appropriateness; confidence: 0.9.
Pattern: core.functional-appropriateness; library: 0.1.0; taxonomy: 0.1.0.
Metric: count; unit: actions; comparison: &lt;=.
Measurement guidance (not supplied project conditions): Count actions from task start to successful goal; report the maximum across the predefined task set.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 2.2.2 Test Types; non-functional testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### security

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/5:core.confidentiality

\[NEEDS INPUT: system\] shall reject at least \[NEEDS INPUT: target\] percent of unauthorized disclosure attempts against \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 5.1; sub-characteristic: confidentiality; confidence: 0.9.
Pattern: core.confidentiality; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use an approved access matrix and negative tests; this finite test metric is not a claim of universal protection.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V8 Authorization; V14 Data Protection; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/5:pci-dss.confidentiality

\[NEEDS INPUT: system\] shall retain at most \[NEEDS INPUT: target\] sensitive-authentication-data records in \[NEEDS INPUT: scope\] after authorization under \[NEEDS INPUT: conditions\].

Source step: 5.1; sub-characteristic: confidentiality; confidence: 0.9.
Pattern: pci-dss.confidentiality; library: 0.1.0; taxonomy: 0.1.0.
Metric: count; unit: records; comparison: &lt;=.
Measurement guidance (not supplied project conditions): Inspect persistent stores, logs and backups after authorization; the referenced prohibition requires target 0, not an adjustable tolerance.

Framework: PCI SSC FAQ 1154: account-data retention; edition: PCI DSS requirement 3.3.1, FAQ accessed 2026-09-11; section: FAQ 1154; requirement 3.3.1; reference: https://www.pcisecuritystandards.org/faqs/1154/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/5:core.integrity

\[NEEDS INPUT: system\] shall detect at least \[NEEDS INPUT: target\] percent of unauthorized modifications to \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 5.1; sub-characteristic: integrity; confidence: 0.9.
Pattern: core.integrity; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Apply a declared tampering corpus and verify detection with an independent oracle.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V11 Cryptography; V14 Data Protection; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/5:core.resistance

\[NEEDS INPUT: system\] shall block at least \[NEEDS INPUT: target\] percent of the attack cases in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 5.1; sub-characteristic: resistance; confidence: 0.95.
Pattern: core.resistance; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Freeze the attack corpus and success oracle; passing does not imply protection from untested attacks.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V1 Encoding and Sanitization; V2 Validation and Business Logic; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

### FR /basicFlow/steps/6

#### functional-suitability

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/6:core.functional-completeness

\[NEEDS INPUT: system\] shall provide implemented functions for at least \[NEEDS INPUT: target\] percent of the required tasks in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 5.2; sub-characteristic: functional-completeness; confidence: 0.9.
Pattern: core.functional-completeness; library: 0.1.0; taxonomy: 0.1.0.
Metric: coverage; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Count tasks with an implemented function divided by all required tasks; freeze the task inventory before assessment.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 5.3.1 Metrics Used in Testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/6:core.functional-correctness

\[NEEDS INPUT: system\] shall produce the expected result in at least \[NEEDS INPUT: target\] percent of the oracle-backed cases in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 5.2; sub-characteristic: functional-correctness; confidence: 0.95.
Pattern: core.functional-correctness; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Compare actual results with independently approved expected results; denominator includes every executed case.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 5.3.1 Metrics Used in Testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/6:core.functional-appropriateness

\[NEEDS INPUT: system\] shall enable completion of \[NEEDS INPUT: scope\] in at most \[NEEDS INPUT: target\] user actions per task under \[NEEDS INPUT: conditions\].

Source step: 5.2; sub-characteristic: functional-appropriateness; confidence: 0.95.
Pattern: core.functional-appropriateness; library: 0.1.0; taxonomy: 0.1.0.
Metric: count; unit: actions; comparison: &lt;=.
Measurement guidance (not supplied project conditions): Count actions from task start to successful goal; report the maximum across the predefined task set.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 2.2.2 Test Types; non-functional testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### interaction-capability

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/6:core.operability

\[NEEDS INPUT: system\] shall enable at least \[NEEDS INPUT: target\] percent of participants to complete \[NEEDS INPUT: scope\] without operator assistance under \[NEEDS INPUT: conditions\].

Source step: 5.2; sub-characteristic: operability; confidence: 0.9.
Pattern: core.operability; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use a declared task-success rubric; denominator includes all enrolled participants who attempt the task.

Framework: Web Content Accessibility Guidelines; edition: 2.2 Recommendation 2024-12-12; section: 2.1.1 Keyboard; curator-derived operation measure; reference: https://www.w3.org/TR/2024/REC-WCAG22-20241212/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/6:core.user-assistance

\[NEEDS INPUT: system\] shall enable at least \[NEEDS INPUT: target\] percent of participants to resolve \[NEEDS INPUT: scope\] using the provided help under \[NEEDS INPUT: conditions\].

Source step: 5.2; sub-characteristic: user-assistance; confidence: 0.95.
Pattern: core.user-assistance; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use a fixed problem set and success rubric; include unsuccessful help searches in the denominator.

Framework: Web Content Accessibility Guidelines; edition: 2.2 Recommendation 2024-12-12; section: 3.2.6 Consistent Help; curator-derived assistance measure; reference: https://www.w3.org/TR/2024/REC-WCAG22-20241212/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/basicFlow/steps/6:core.self-descriptiveness

\[NEEDS INPUT: system\] shall enable at least \[NEEDS INPUT: target\] percent of participants to explain the current state and next valid action for \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 5.2; sub-characteristic: self-descriptiveness; confidence: 0.9.
Pattern: core.self-descriptiveness; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Score explanations using an independent state/action rubric without external instructions.

Framework: Web Content Accessibility Guidelines; edition: 2.2 Recommendation 2024-12-12; section: 4.1.3 Status Messages; curator-derived comprehension measure; reference: https://www.w3.org/TR/2024/REC-WCAG22-20241212/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

### FR /alternativeFlows/0/steps/0

#### security

Candidate: UC-PASSWORD-RESET:/alternativeFlows/0/steps/0:core.confidentiality

\[NEEDS INPUT: system\] shall reject at least \[NEEDS INPUT: target\] percent of unauthorized disclosure attempts against \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 2a1; sub-characteristic: confidentiality; confidence: 0.95.
Pattern: core.confidentiality; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use an approved access matrix and negative tests; this finite test metric is not a claim of universal protection.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V8 Authorization; V14 Data Protection; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/alternativeFlows/0/steps/0:pci-dss.confidentiality

\[NEEDS INPUT: system\] shall retain at most \[NEEDS INPUT: target\] sensitive-authentication-data records in \[NEEDS INPUT: scope\] after authorization under \[NEEDS INPUT: conditions\].

Source step: 2a1; sub-characteristic: confidentiality; confidence: 0.95.
Pattern: pci-dss.confidentiality; library: 0.1.0; taxonomy: 0.1.0.
Metric: count; unit: records; comparison: &lt;=.
Measurement guidance (not supplied project conditions): Inspect persistent stores, logs and backups after authorization; the referenced prohibition requires target 0, not an adjustable tolerance.

Framework: PCI SSC FAQ 1154: account-data retention; edition: PCI DSS requirement 3.3.1, FAQ accessed 2026-09-11; section: FAQ 1154; requirement 3.3.1; reference: https://www.pcisecuritystandards.org/faqs/1154/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/alternativeFlows/0/steps/0:core.resistance

\[NEEDS INPUT: system\] shall block at least \[NEEDS INPUT: target\] percent of the attack cases in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 2a1; sub-characteristic: resistance; confidence: 0.9.
Pattern: core.resistance; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Freeze the attack corpus and success oracle; passing does not imply protection from untested attacks.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V1 Encoding and Sanitization; V2 Validation and Business Logic; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

### FR /alternativeFlows/1/steps/0

#### functional-suitability

Candidate: UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.functional-completeness

\[NEEDS INPUT: system\] shall provide implemented functions for at least \[NEEDS INPUT: target\] percent of the required tasks in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 4a1; sub-characteristic: functional-completeness; confidence: 0.9.
Pattern: core.functional-completeness; library: 0.1.0; taxonomy: 0.1.0.
Metric: coverage; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Count tasks with an implemented function divided by all required tasks; freeze the task inventory before assessment.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 5.3.1 Metrics Used in Testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.functional-correctness

\[NEEDS INPUT: system\] shall produce the expected result in at least \[NEEDS INPUT: target\] percent of the oracle-backed cases in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 4a1; sub-characteristic: functional-correctness; confidence: 0.95.
Pattern: core.functional-correctness; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Compare actual results with independently approved expected results; denominator includes every executed case.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 5.3.1 Metrics Used in Testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.functional-appropriateness

\[NEEDS INPUT: system\] shall enable completion of \[NEEDS INPUT: scope\] in at most \[NEEDS INPUT: target\] user actions per task under \[NEEDS INPUT: conditions\].

Source step: 4a1; sub-characteristic: functional-appropriateness; confidence: 0.9.
Pattern: core.functional-appropriateness; library: 0.1.0; taxonomy: 0.1.0.
Metric: count; unit: actions; comparison: &lt;=.
Measurement guidance (not supplied project conditions): Count actions from task start to successful goal; report the maximum across the predefined task set.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 2.2.2 Test Types; non-functional testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### interaction-capability

Candidate: UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.appropriateness-recognizability

\[NEEDS INPUT: system\] shall enable at least \[NEEDS INPUT: target\] percent of participants to identify its suitability for \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 4a1; sub-characteristic: appropriateness-recognizability; confidence: 0.9.
Pattern: core.appropriateness-recognizability; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use unprompted suitability decisions against an agreed task rubric and a predefined participant cohort.

Framework: Web Content Accessibility Guidelines; edition: 2.2 Recommendation 2024-12-12; section: 2.4.6 Headings and Labels; curator-derived usability study; reference: https://www.w3.org/TR/2024/REC-WCAG22-20241212/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.learnability

\[NEEDS INPUT: system\] shall enable first-time users to learn \[NEEDS INPUT: scope\] in at most \[NEEDS INPUT: target\] minutes under \[NEEDS INPUT: conditions\].

Source step: 4a1; sub-characteristic: learnability; confidence: 0.85.
Pattern: core.learnability; library: 0.1.0; taxonomy: 0.1.0.
Metric: duration; unit: minutes; comparison: &lt;=.
Measurement guidance (not supplied project conditions): Measure elapsed training time until independent task success; conditions specify cohort, success rubric and aggregation.

Framework: Web Content Accessibility Guidelines; edition: 2.2 Recommendation 2024-12-12; section: 3.3.2 Labels or Instructions; curator-derived learning measure; reference: https://www.w3.org/TR/2024/REC-WCAG22-20241212/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.operability

\[NEEDS INPUT: system\] shall enable at least \[NEEDS INPUT: target\] percent of participants to complete \[NEEDS INPUT: scope\] without operator assistance under \[NEEDS INPUT: conditions\].

Source step: 4a1; sub-characteristic: operability; confidence: 0.9.
Pattern: core.operability; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use a declared task-success rubric; denominator includes all enrolled participants who attempt the task.

Framework: Web Content Accessibility Guidelines; edition: 2.2 Recommendation 2024-12-12; section: 2.1.1 Keyboard; curator-derived operation measure; reference: https://www.w3.org/TR/2024/REC-WCAG22-20241212/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.user-error-protection

\[NEEDS INPUT: system\] shall prevent at least \[NEEDS INPUT: target\] percent of the erroneous actions in \[NEEDS INPUT: scope\] from causing the defined unwanted outcome under \[NEEDS INPUT: conditions\].

Source step: 4a1; sub-characteristic: user-error-protection; confidence: 0.95.
Pattern: core.user-error-protection; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Inject the frozen error catalogue; count blocked or safely corrected outcomes over all injected errors.

Framework: Web Content Accessibility Guidelines; edition: 2.2 Recommendation 2024-12-12; section: 3.3.6 Error Prevention (All); curator-derived error measure; reference: https://www.w3.org/TR/2024/REC-WCAG22-20241212/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.user-assistance

\[NEEDS INPUT: system\] shall enable at least \[NEEDS INPUT: target\] percent of participants to resolve \[NEEDS INPUT: scope\] using the provided help under \[NEEDS INPUT: conditions\].

Source step: 4a1; sub-characteristic: user-assistance; confidence: 0.9.
Pattern: core.user-assistance; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use a fixed problem set and success rubric; include unsuccessful help searches in the denominator.

Framework: Web Content Accessibility Guidelines; edition: 2.2 Recommendation 2024-12-12; section: 3.2.6 Consistent Help; curator-derived assistance measure; reference: https://www.w3.org/TR/2024/REC-WCAG22-20241212/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.self-descriptiveness

\[NEEDS INPUT: system\] shall enable at least \[NEEDS INPUT: target\] percent of participants to explain the current state and next valid action for \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 4a1; sub-characteristic: self-descriptiveness; confidence: 0.9.
Pattern: core.self-descriptiveness; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Score explanations using an independent state/action rubric without external instructions.

Framework: Web Content Accessibility Guidelines; edition: 2.2 Recommendation 2024-12-12; section: 4.1.3 Status Messages; curator-derived comprehension measure; reference: https://www.w3.org/TR/2024/REC-WCAG22-20241212/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### reliability

Candidate: UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.faultlessness

\[NEEDS INPUT: system\] shall complete at least \[NEEDS INPUT: target\] percent of the operations in \[NEEDS INPUT: scope\] without a defined failure under \[NEEDS INPUT: conditions\].

Source step: 4a1; sub-characteristic: faultlessness; confidence: 0.8.
Pattern: core.faultlessness; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Freeze failure criteria and observation window; denominator includes timeouts and failed operations.

Framework: Google Site Reliability Engineering: Service Level Objectives; edition: 2016, chapter 4; section: Indicators; error rate; reference: https://sre.google/sre-book/service-level-objectives/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### security

Candidate: UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.integrity

\[NEEDS INPUT: system\] shall detect at least \[NEEDS INPUT: target\] percent of unauthorized modifications to \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 4a1; sub-characteristic: integrity; confidence: 0.85.
Pattern: core.integrity; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Apply a declared tampering corpus and verify detection with an independent oracle.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V11 Cryptography; V14 Data Protection; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.resistance

\[NEEDS INPUT: system\] shall block at least \[NEEDS INPUT: target\] percent of the attack cases in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 4a1; sub-characteristic: resistance; confidence: 0.8.
Pattern: core.resistance; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Freeze the attack corpus and success oracle; passing does not imply protection from untested attacks.

Framework: OWASP Application Security Verification Standard; edition: 5.0.0; section: V1 Encoding and Sanitization; V2 Validation and Business Logic; reference: https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

### FR /exceptionFlows/0/steps/0

#### functional-suitability

Candidate: UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.functional-completeness

\[NEEDS INPUT: system\] shall provide implemented functions for at least \[NEEDS INPUT: target\] percent of the required tasks in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 3b1; sub-characteristic: functional-completeness; confidence: 0.9.
Pattern: core.functional-completeness; library: 0.1.0; taxonomy: 0.1.0.
Metric: coverage; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Count tasks with an implemented function divided by all required tasks; freeze the task inventory before assessment.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 5.3.1 Metrics Used in Testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.functional-correctness

\[NEEDS INPUT: system\] shall produce the expected result in at least \[NEEDS INPUT: target\] percent of the oracle-backed cases in \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 3b1; sub-characteristic: functional-correctness; confidence: 0.95.
Pattern: core.functional-correctness; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Compare actual results with independently approved expected results; denominator includes every executed case.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 5.3.1 Metrics Used in Testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.functional-appropriateness

\[NEEDS INPUT: system\] shall enable completion of \[NEEDS INPUT: scope\] in at most \[NEEDS INPUT: target\] user actions per task under \[NEEDS INPUT: conditions\].

Source step: 3b1; sub-characteristic: functional-appropriateness; confidence: 0.9.
Pattern: core.functional-appropriateness; library: 0.1.0; taxonomy: 0.1.0.
Metric: count; unit: actions; comparison: &lt;=.
Measurement guidance (not supplied project conditions): Count actions from task start to successful goal; report the maximum across the predefined task set.

Framework: ISTQB Certified Tester Foundation Level; edition: 4.0.1 (2024-09-15); section: 2.2.2 Test Types; non-functional testing; reference: https://istqb.org/wp-content/uploads/2024/11/ISTQB\_CTFL\_Syllabus\_v4.0.1.pdf

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### interaction-capability

Candidate: UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.operability

\[NEEDS INPUT: system\] shall enable at least \[NEEDS INPUT: target\] percent of participants to complete \[NEEDS INPUT: scope\] without operator assistance under \[NEEDS INPUT: conditions\].

Source step: 3b1; sub-characteristic: operability; confidence: 0.85.
Pattern: core.operability; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use a declared task-success rubric; denominator includes all enrolled participants who attempt the task.

Framework: Web Content Accessibility Guidelines; edition: 2.2 Recommendation 2024-12-12; section: 2.1.1 Keyboard; curator-derived operation measure; reference: https://www.w3.org/TR/2024/REC-WCAG22-20241212/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.user-error-protection

\[NEEDS INPUT: system\] shall prevent at least \[NEEDS INPUT: target\] percent of the erroneous actions in \[NEEDS INPUT: scope\] from causing the defined unwanted outcome under \[NEEDS INPUT: conditions\].

Source step: 3b1; sub-characteristic: user-error-protection; confidence: 0.9.
Pattern: core.user-error-protection; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Inject the frozen error catalogue; count blocked or safely corrected outcomes over all injected errors.

Framework: Web Content Accessibility Guidelines; edition: 2.2 Recommendation 2024-12-12; section: 3.3.6 Error Prevention (All); curator-derived error measure; reference: https://www.w3.org/TR/2024/REC-WCAG22-20241212/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.user-assistance

\[NEEDS INPUT: system\] shall enable at least \[NEEDS INPUT: target\] percent of participants to resolve \[NEEDS INPUT: scope\] using the provided help under \[NEEDS INPUT: conditions\].

Source step: 3b1; sub-characteristic: user-assistance; confidence: 0.9.
Pattern: core.user-assistance; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Use a fixed problem set and success rubric; include unsuccessful help searches in the denominator.

Framework: Web Content Accessibility Guidelines; edition: 2.2 Recommendation 2024-12-12; section: 3.2.6 Consistent Help; curator-derived assistance measure; reference: https://www.w3.org/TR/2024/REC-WCAG22-20241212/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.self-descriptiveness

\[NEEDS INPUT: system\] shall enable at least \[NEEDS INPUT: target\] percent of participants to explain the current state and next valid action for \[NEEDS INPUT: scope\] under \[NEEDS INPUT: conditions\].

Source step: 3b1; sub-characteristic: self-descriptiveness; confidence: 0.9.
Pattern: core.self-descriptiveness; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Score explanations using an independent state/action rubric without external instructions.

Framework: Web Content Accessibility Guidelines; edition: 2.2 Recommendation 2024-12-12; section: 4.1.3 Status Messages; curator-derived comprehension measure; reference: https://www.w3.org/TR/2024/REC-WCAG22-20241212/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

#### reliability

Candidate: UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.fault-tolerance

\[NEEDS INPUT: system\] shall complete at least \[NEEDS INPUT: target\] percent of the operations in \[NEEDS INPUT: scope\] during injected faults under \[NEEDS INPUT: conditions\].

Source step: 3b1; sub-characteristic: fault-tolerance; confidence: 0.8.
Pattern: core.fault-tolerance; library: 0.1.0; taxonomy: 0.1.0.
Metric: success-rate; unit: percent; comparison: &gt;=.
Measurement guidance (not supplied project conditions): Specify fault catalogue, injection timing and accepted degraded behavior; count failed operations.

Framework: Google Site Reliability Engineering: Testing for Reliability; edition: 2016, chapter 17; section: Testing at Scale; testing failure behavior; reference: https://sre.google/sre-book/testing-reliability/

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

Candidate: UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.recoverability

\[NEEDS INPUT: system\] shall restore \[NEEDS INPUT: scope\] within \[NEEDS INPUT: target\] minutes after the declared disruption under \[NEEDS INPUT: conditions\].

Source step: 3b1; sub-characteristic: recoverability; confidence: 0.9.
Pattern: core.recoverability; library: 0.1.0; taxonomy: 0.1.0.
Metric: duration; unit: minutes; comparison: &lt;=.
Measurement guidance (not supplied project conditions): Time from disruption to verified service restoration across every scenario; review data-loss/RPO constraints separately.

Framework: NIST Contingency Planning Guide for Federal Information Systems; edition: SP 800-34 Revision 1 (2010); section: 3.2 Business Impact Analysis; recovery time objective; reference: https://csrc.nist.gov/pubs/sp/800/34/r1/final

Applicability needs review: Opt in only after PCI scope and any issuer-specific provisions are reviewed; this checks post-authorization storage of sensitive authentication data, not full PCI DSS compliance.

## Coverage Gaps and Missing Inputs

Gaps require human confirmation; a generated placeholder candidate is not completed coverage.

### Characteristics with zero candidates

- performance-efficiency
- maintainability
- flexibility
- safety

### Unbound parameters per candidate

- UC-PASSWORD-RESET:/basicFlow/steps/0:core.functional-completeness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/0:core.functional-appropriateness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/0:core.authenticity: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/0:core.resistance: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/1:core.functional-completeness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/1:core.functional-correctness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/1:core.functional-appropriateness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/1:core.interoperability: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/1:core.faultlessness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/1:core.availability: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/1:core.confidentiality: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/1:pci-dss.confidentiality: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/1:core.integrity: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/2:core.functional-completeness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/2:core.functional-correctness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/2:core.functional-appropriateness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/2:core.appropriateness-recognizability: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/2:core.operability: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/2:core.self-descriptiveness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/2:core.faultlessness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/2:core.availability: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/2:core.confidentiality: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/2:pci-dss.confidentiality: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/2:core.integrity: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/2:core.authenticity: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/2:core.resistance: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/3:core.functional-completeness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/3:core.functional-correctness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/3:core.functional-appropriateness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/3:core.user-error-protection: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/3:core.integrity: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/3:core.authenticity: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/3:core.resistance: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/4:core.functional-completeness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/4:core.functional-correctness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/4:core.functional-appropriateness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/4:core.faultlessness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/4:core.confidentiality: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/4:pci-dss.confidentiality: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/4:core.integrity: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/4:core.resistance: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/5:core.functional-completeness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/5:core.functional-correctness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/5:core.functional-appropriateness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/5:core.confidentiality: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/5:pci-dss.confidentiality: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/5:core.integrity: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/5:core.resistance: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/6:core.functional-completeness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/6:core.functional-correctness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/6:core.functional-appropriateness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/6:core.operability: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/6:core.user-assistance: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/basicFlow/steps/6:core.self-descriptiveness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/alternativeFlows/0/steps/0:core.confidentiality: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/alternativeFlows/0/steps/0:pci-dss.confidentiality: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/alternativeFlows/0/steps/0:core.resistance: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.functional-completeness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.functional-correctness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.functional-appropriateness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.appropriateness-recognizability: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.learnability: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.operability: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.user-error-protection: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.user-assistance: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.self-descriptiveness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.faultlessness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.integrity: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/alternativeFlows/1/steps/0:core.resistance: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.functional-completeness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.functional-correctness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.functional-appropriateness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.operability: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.user-error-protection: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.user-assistance: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.self-descriptiveness: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.fault-tolerance: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]
- UC-PASSWORD-RESET:/exceptionFlows/0/steps/0:core.recoverability: \[NEEDS INPUT: system\], \[NEEDS INPUT: scope\], \[NEEDS INPUT: conditions\], \[NEEDS INPUT: target\]

### Unmapped FRs and missing patterns

