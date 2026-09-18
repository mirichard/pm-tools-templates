# Governance Compliance Integration Framework

**Version**: Sprint 13 Draft  
**Status**: ✅ Design Phase Complete — Ready for Gate 2 Validation (Sep 25)  
**Related Issues**: #750 (Compliance Integration), #713 (Epic 6: Governance Modernization), #339 (Enterprise Compliance Context)

---

## Overview

This compliance integration framework maps governance artifacts to common regulatory frameworks, enabling organizations in regulated industries to align governance with compliance obligations.

**Frameworks Covered** (Top 5):
1. **GDPR** (General Data Protection Regulation) — EU data privacy
2. **HIPAA** (Health Insurance Portability & Accountability Act) — Healthcare data & privacy
3. **SOX** (Sarbanes-Oxley) — Financial reporting & internal controls
4. **ISO 27001** (Information Security Management) — Information security standards
5. **NIST** (National Institute of Standards & Technology) — Cybersecurity framework (US federal)

---

## Integration Model

### Key Principle: Annotate, Don't Duplicate

**Compliance integration ANNOTATES existing governance templates with regulatory requirements**, rather than creating parallel governance structures.

**Pattern**:
```
Governance Template (E.g., "Risk Register Template")
  ├─ Core artifact: Risk identification, assessment, mitigation
  └─ Compliance Annotations (per framework):
      ├─ GDPR: Data protection impact assessment (DPIA) mapping
      ├─ HIPAA: Privacy impact assessment (PIA) mapping
      ├─ SOX: Control documentation requirements
      ├─ ISO 27001: Risk treatment plan mapping
      └─ NIST: Cybersecurity risk profile mapping
```

**Benefit**: Single source of truth for governance, with regulatory context layered on top.

---

## Regulatory Framework Mappings

### 1. GDPR (General Data Protection Regulation)

**Scope**: Any organization processing personal data of EU residents  
**Key Obligations**: Data protection, privacy by design, transparency, individual rights  
**Enforcement**: National data protection authorities, fines up to 4% of annual revenue

#### Governance Artifacts → GDPR Compliance Mapping

| Governance Artifact | GDPR Requirement | Evidence | Responsible Role |
|---------------------|-----------------|----------|------------------|
| **Stakeholder Register** | Identify data subjects, affected parties | Data subject contact list | DPO (Data Protection Officer) |
| **Risk Register** | Data Protection Impact Assessment (DPIA) | DPIA completion certificate | DPO + Technical Lead |
| **Scope Definition** | Lawful Basis determination | Lawful basis documentation | Legal + Product Owner |
| **Data Flow Diagram** | Processing mapping, processor contracts | System diagram + processor agreements | Architecture + Legal |
| **Change Control Process** | Assess privacy impact of changes | Privacy checklist in change request | DPO + Change Advisory Board |
| **Incident Response Plan** | 72-hour breach notification process | Incident escalation procedure | DPO + Security Lead |
| **Access Control Matrix** | Data access governance, role-based access | Access control documentation | Security Lead + Audit |
| **Data Retention Policy** | Minimum necessary, timely deletion | Retention schedule | Data Steward |
| **Vendor Management** | Processor contracts, DPA addendums | Data Processing Agreements (DPA) | Procurement + Legal |

#### GDPR Compliance Overlay

**Artifact Template: GDPR Data Protection Impact Assessment (DPIA)**

Required for: Processing likely to result in high risk to individual rights

```markdown
## Data Protection Impact Assessment (DPIA)

### 1. Description of Processing
- Data categories: [personal data types]
- Purposes: [lawful basis]
- Data subjects: [EU residents affected]
- Processing locations: [geographic scope]

### 2. Necessity & Proportionality
- Is processing necessary for the purpose?
- Are there alternatives with lower privacy impact?

### 3. Risk Assessment
- Risks to data subject rights/freedoms: [enumerate]
- Likelihood & severity: [matrix: probability × impact]
- Existing safeguards: [controls in place]
- Residual risk: [unmitigated risk]

### 4. Mitigating Measures
- Technical measures: [encryption, anonymization, pseudonymization]
- Organizational measures: [access controls, training, monitoring]
- Monitoring & review frequency: [cadence]

### 5. Consultation
- DPO review: [date, findings]
- Supervisory authority consultation (if high risk): [date, outcome]

### 6. Sign-Off
- DPO Approval: [yes/no, conditions]
- Risk Owner Acknowledgment: [yes/no, remediation plan if no]
```

#### GDPR Risk Triggers

| Trigger Event | Compliance Action | Timeline |
|---------------|-------------------|----------|
| New processing activity | Complete DPIA | Before processing starts |
| Technology change (AI, ML, profiling) | Update DPIA + supervisory assessment | 30 days |
| Data breach suspected | Notify DPO + supervisory authority | 72 hours |
| Third-country data transfer | SCCs/adequacy decision review | 15 days |
| Data subject rights request | Fulfill request + document | 30 days |

---

### 2. HIPAA (Health Insurance Portability & Accountability Act)

**Scope**: US healthcare organizations & business associates handling protected health information (PHI)  
**Key Obligations**: Privacy, security, breach notification, audit controls  
**Enforcement**: Department of Health & Human Services (HHS) Office for Civil Rights, fines up to $1.5M per violation category per year

#### Governance Artifacts → HIPAA Compliance Mapping

| Governance Artifact | HIPAA Requirement | Evidence | Responsible Role |
|---------------------|------------------|----------|------------------|
| **Stakeholder Register** | Identify workforce + authorized users | Workforce roster + authorization matrix | Privacy Officer + CISO |
| **Risk Register** | Security Risk Analysis (SRA) | SRA documentation + risk mitigation plan | CISO + Chief Privacy Officer |
| **Access Control Matrix** | HIPAA minimum necessary principle | Role-based access control (RBAC) policy | CISO + Compliance Officer |
| **Data Flow Diagram** | Workflow documentation for audit trail | System diagram + data flow documentation | System Administrator |
| **Incident Response Plan** | Breach notification requirements | Breach response procedure (60-day notification) | Privacy Officer + Legal |
| **Change Control Process** | Impact assessment on security posture | Security impact analysis for changes | CISO + Change Advisory Board |
| **Audit & Monitoring** | Audit controls, access logs, monitoring | Audit logs retention (6 years minimum) | Compliance Officer + IT |
| **Encryption Policy** | Technical safeguard: encryption at rest/transit | Encryption inventory + key management plan | CISO + Data Security Officer |
| **Business Associate Agreements** | BAA execution with vendors | Executed BAA documents | Procurement + Legal |

#### HIPAA Compliance Overlay

**Artifact Template: HIPAA Security Risk Analysis (SRA)**

Required for: All organizations handling PHI

```markdown
## HIPAA Security Risk Analysis (SRA)

### 1. Current Security Posture
- Systems & databases: [list all systems storing/processing PHI]
- Network architecture: [diagram: firewalls, DMZ, access points]
- Workforce access: [authorized users by role]
- Existing security controls: [technical, physical, administrative]

### 2. Risk Assessment
- Vulnerability scan results: [tools: Nessus, OpenVAS, Qualys]
- Threat profile: [external: internet-facing, Internal: workforce)]
- Risk scenarios: [breach vectors, likelihood, impact]
- Risk rating: [High/Medium/Low per scenario]

### 3. Current Safeguards
- Administrative: [policies, training, workforce security]
- Physical: [facility access, device security, workstation use]
- Technical: [access controls, audit logs, transmission security]

### 4. Risk Mitigation Plan
- High-risk gaps: [remediation plan + timeline]
- Medium-risk gaps: [monitoring + future improvement]
- Low-risk gaps: [accepted risk + rationale]

### 5. Audit & Monitoring
- Audit controls: [procedures to record & examine access]
- Log retention: [6-year minimum requirement]
- Monitoring frequency: [quarterly, annual, ongoing]

### 6. Compliance Sign-Off
- CISO Attestation: [date, signature]
- Privacy Officer Review: [date, concerns/approvals]
- Workforce Training: [date, attendees]
```

#### HIPAA Risk Triggers

| Trigger Event | Compliance Action | Timeline |
|---------------|-------------------|----------|
| Suspected breach of PHI | Notify Privacy Officer + investigate | Immediate |
| Confirmed breach | Notify affected individuals + media + HHS | 60 days |
| New system/workflow handling PHI | Update SRA, implement technical safeguards | Before go-live |
| Workforce member access change | Update access control matrix | Immediate |
| Third-party/contractor access to PHI | Execute BAA + HIPAA training | Before access |
| Annual compliance audit | Document findings + remediation plan | Annually |

---

### 3. SOX (Sarbanes-Oxley)

**Scope**: Public company internal controls, financial reporting, audit procedures  
**Key Obligations**: Control documentation, testing, audit trail, management attestation  
**Enforcement**: Public Company Accounting Oversight Board (PCAOB), SEC, fines & criminal penalties

#### Governance Artifacts → SOX Compliance Mapping

| Governance Artifact | SOX Requirement | Evidence | Responsible Role |
|---------------------|-----------------|----------|------------------|
| **Control Framework** | COSO Internal Control Framework mapping | Framework documentation + control matrix | Chief Audit Executive (CAE) |
| **Risk Register** | Control risk assessment & testing plan | Risk-control mapping | Internal Audit + Compliance |
| **Change Control Process** | IT General Controls (ITGCs) + approval matrix | Change approval documentation + logs | CIO + Internal Audit |
| **Segregation of Duties** | SoD matrix: authorization, execution, custody | Access control review + exceptions | Control Owner + Auditor |
| **Audit Trail & Logging** | System-generated audit logs, non-repudiation | Audit log retention (7-year min), log review evidence | Information Security |
| **Financial System Access** | User access governance for ERP/financial systems | Access control matrix + periodic review | Finance + IT |
| **Testing & Validation** | Control testing procedures & results | Test plans, test results, exceptions, remediation | Internal Audit |
| **Management Attestation** | CEO/CFO financial reporting certification | Management Assessment of Internal Control | Executive Management |

#### SOX Compliance Overlay

**Artifact Template: SOX Control Documentation & Testing**

Required for: Every control mapped to financial reporting

```markdown
## SOX Control Documentation Template

### Control Identification
- Control ID: [e.g., FIN-101]
- Control Name: [e.g., "Access Control to General Ledger"]
- Process: [Financial close, transaction processing]
- COSO Principle: [Integrity & Ethics, Competence, etc.]

### Control Description
- Objective: [What does this control prevent/detect?]
- Procedure: [Who performs, when, how often]
- Evidence: [What proof of execution exists]
- Frequency: [Daily, weekly, monthly, annually]

### Risk Addressed
- Financial reporting risk: [e.g., unauthorized transactions]
- Risk rating: [High/Medium/Low]
- Impact if failed: [materiality assessment]

### Control Testing
- Planned test date: [audit period]
- Test scope: [sample size, testing method]
- Test results: [passed/failed/exception]
- Remediation plan (if failed): [corrective action + timeline]
- Auditor sign-off: [date, test evidence reference]

### System/Manual
- Is control automated/manual/hybrid?
- System name: [if automated]
- Manual procedures: [if manual]
- Compensating controls: [if system unavailable]

### Maintenance
- Last reviewed: [date]
- Changes since last review: [describe]
- Next review date: [planned]
```

#### SOX Risk Triggers

| Trigger Event | Compliance Action | Timeline |
|---------------|-------------------|----------|
| Control failure identified | Document exception, remediation plan | During quarterly financial close |
| System change (finance-related) | Assess impact on control environment | Before change deployment |
| Workforce change (finance function) | Update SoD analysis, access review | At hire/termination |
| IT infrastructure change | Document impact on control operating effectiveness | Before change |
| Audit finding from previous period | Verify remediation, test control | Ongoing monitoring |

---

### 4. ISO 27001 (Information Security Management)

**Scope**: Information security governance for all organizations  
**Key Obligations**: Risk-based information security program, control implementation, periodic review  
**Enforcement**: Third-party certification (optional but often required by customers); audit by certification bodies

#### Governance Artifacts → ISO 27001 Compliance Mapping

| Governance Artifact | ISO 27001 Requirement | Evidence | Responsible Role |
|---------------------|----------------------|----------|------------------|
| **Risk Register** | Information Security Risk Assessment (ISRA) | Risk assessment report + risk treatment plan | CISO + Risk Owner |
| **Scope Definition** | ISMS scope statement | Documented scope + justification for exclusions | CISO + Management |
| **Control Selection** | A.5-A.18 Annex A Control Objectives & Controls | Control selection matrix + justification | CISO + Control Owner |
| **Policy Framework** | Information Security Policy + 14 supporting policies | Approved policy documents + version control | Chief Information Security Officer |
| **Access Control Matrix** | Access control procedures, identity & authentication | User access review, MFA implementation, role definitions | Identity Access Manager |
| **Incident Response Plan** | Incident management procedures | Incident response process + testing/drills | Incident Response Lead |
| **Supplier/Vendor Management** | Third-party risk management, confidentiality agreements | Vendor risk assessment, signed agreements | Procurement + CISO |
| **Change Management** | Change control with security impact assessment | Change log + security review evidence | Change Advisory Board |
| **Audit & Monitoring** | Internal audit program, management review | Audit schedules, test evidence, management review minutes | Internal Audit + Management |

#### ISO 27001 Compliance Overlay

**Artifact Template: Information Security Risk Assessment (ISRA)**

Required for: All organizations implementing ISO 27001

```markdown
## Information Security Risk Assessment (ISRA)

### 1. Asset Identification
- Assets: [systems, data, infrastructure]
- Asset criticality: [High/Medium/Low rating]
- Business impact of loss: [confidentiality, integrity, availability impact]

### 2. Threat & Vulnerability Analysis
- Threats: [malware, unauthorized access, data theft, DDoS, insider threat, etc.]
- Vulnerabilities: [unpatched systems, weak authentication, misconfiguration]
- Threat-Vulnerability combinations: [scenario-based risk]

### 3. Risk Calculation
- Likelihood: [Rare/Unlikely/Possible/Likely/Almost Certain]
- Impact: [Negligible/Minor/Moderate/Major/Catastrophic]
- Risk Level: [Low/Medium/High/Critical] = Likelihood × Impact
- Risk acceptance criteria: [acceptable thresholds]

### 4. Risk Treatment
- Risk avoidance: [eliminate the activity]
- Risk reduction: [implement controls from Annex A]
- Risk sharing: [transfer via insurance/outsourcing]
- Risk acceptance: [live with residual risk + rationale]

### 5. Control Selection
- Selected controls: [A.5-A.18 Annex A controls]
- Justification: [why each control addresses identified risks]
- Implementation timeline: [phase 1, 2, 3]

### 6. Residual Risk Assessment
- After controls implemented: [recalculate risk levels]
- Acceptable risk level achieved: [yes/no, residual risk register]

### 7. Stakeholder Sign-Off
- Risk Owner Approval: [yes/no, acknowledged residual risk]
- Management Review: [date, approval]
```

#### ISO 27001 Risk Triggers

| Trigger Event | Compliance Action | Timeline |
|---------------|-------------------|----------|
| Security incident | Update risk register, adjust controls | Immediate + post-incident review |
| New system/technology | Update ISRA + select applicable controls | Before implementation |
| Threat landscape changes | Review & update threat scenarios | Annually + ad-hoc |
| Control testing finds gap | Remediation plan + root cause analysis | 30 days |
| Management Review meeting | Reassess overall ISMS effectiveness | Annually |

---

### 5. NIST Cybersecurity Framework

**Scope**: US federal agencies, federal contractors, critical infrastructure  
**Key Obligations**: Cybersecurity program aligned to NIST functions (Identify, Protect, Detect, Respond, Recover)  
**Enforcement**: NIST Special Publications (SP 800-53 for controls), agency-specific requirements

#### Governance Artifacts → NIST Compliance Mapping

| Governance Artifact | NIST Function | NIST Requirement | Evidence | Responsible Role |
|---------------------|---------------|-----------------|----------|------------------|
| **Risk Register** | **Identify** | Asset inventory + risk assessment | System Security Plan (SSP), risk register | CISO + System Owner |
| **Control Framework** | **Identify** | Security categorization, FIPS 199 categorization | Categorization assessment | CISO |
| **Control Implementation** | **Protect** | Security controls (SP 800-53) | Control implementation evidence | System Owner + Security |
| **Access Control Matrix** | **Protect** | Identity & access management (IA controls) | Access control documentation | Identity Access Manager |
| **Monitoring & Logging** | **Detect** | Continuous monitoring, logging & auditing | Log management procedure + evidence | Security Operations Center (SOC) |
| **Incident Response Plan** | **Respond** | Incident response procedures (IR controls) | Incident response process + drills | Incident Response Lead |
| **Disaster Recovery Plan** | **Recover** | System recovery procedures (CP controls) | Continuity/contingency plan | Business Continuity Lead |
| **Configuration Management** | **Protect** | System configuration control (CM controls) | Configuration baseline, change log | System Administrator |
| **Continuous Monitoring** | **All** | Continuous monitoring strategy | Monitoring plan + assessment results | CISO + Program Manager |

#### NIST Compliance Overlay

**Artifact Template: NIST System Security Plan (SSP)**

Required for: All federal systems, federal contractors (DFARS), critical infrastructure (varies)

```markdown
## NIST System Security Plan (SSP)

### 1. System Identification & Categorization
- System Name & Description: [system purpose, scope, environment]
- Categorization Level: [Low/Moderate/High per FIPS 199: Confidentiality, Integrity, Availability]
- Classification: [Unclassified, CUI, Classified]
- System Owner: [accountability]

### 2. System Environment
- System boundary: [network diagram, data flows, interconnected systems]
- Security zones: [DMZ, internal, isolated]
- Processing locations: [on-premises, cloud, hybrid]

### 3. Security Controls (SP 800-53)
- Applicable control families: [based on categorization]
- Control implementation: [statement of how control is implemented]
- Responsibility: [system owner, application owner, infrastructure owner]
- Status: [Implemented/Planned/Not Applicable]

### 4. Continuous Monitoring
- Monitoring frequency: [annually, semi-annually, monthly, real-time]
- Assessment method: [automated, manual review, testing]
- Tools: [scanning, log analysis, vulnerability assessment]
- Remediation tracking: [findings + remediation timeline]

### 5. Risk Assessment
- Risk assessment results: [NIST SP 800-30 assessment]
- Risk acceptance: [ATO - Authority to Operate authorization]
- Residual risk: [documented]

### 6. Maintenance & Review
- Last updated: [date]
- Next review: [date]
- Changes since last review: [system, controls, risk profile changes]

### 7. Approval & Authorization
- System Owner Sign-Off: [date]
- Authorizing Official Sign-Off: [date] (ATO)
```

#### NIST Risk Triggers

| Trigger Event | Compliance Action | Timeline |
|---------------|-------------------|----------|
| Vulnerability identified | Assess in continuous monitoring, remediate | Per POA&M (Plan of Action & Milestones) |
| System change | Update SSP, control assessment, ATO refresh | Before change deployment |
| Control assessment (annual) | Test controls, document results, findings | Annually (or continuous monitoring update) |
| Security incident | Document in incident log, assess impact on controls | During incident response |
| Risk assessment period | Reassess system categorization, controls, ATO renewal | Typically annual, as needed |

---

## Compliance Integration Checklist

### During Project Initiation

- [ ] Identify applicable regulatory frameworks (GDPR, HIPAA, SOX, ISO 27001, NIST, others)
- [ ] Assign compliance owner (DPO, Chief Privacy Officer, Compliance Officer, CISO)
- [ ] Map project scope to compliance requirements
- [ ] Select governance artifacts from [domains/governance/] that support compliance obligations
- [ ] Create compliance overlay annotations for selected templates

### During Project Planning

- [ ] Complete framework-specific assessments:
  - [ ] DPIA (GDPR) if processing personal data of EU residents
  - [ ] Security Risk Analysis (HIPAA) if handling PHI
  - [ ] Control documentation (SOX) if affecting financial reporting
  - [ ] ISRA (ISO 27001) if under ISO certification scope
  - [ ] SSP (NIST) if federal system or contractor
- [ ] Define compliance review gates and escalation paths
- [ ] Establish compliance sign-off authority (DPO, Privacy Officer, CISO, CAE)

### During Project Execution

- [ ] Maintain compliance documentation (assessments, risk registers, control testing)
- [ ] Review changes against compliance requirements (Change Advisory Board)
- [ ] Track compliance-related incidents & anomalies
- [ ] Conduct periodic compliance reviews (monthly, quarterly, as required)
- [ ] Escalate compliance issues per governance decision matrix

### At Project Closure

- [ ] Final compliance assessment & sign-off
- [ ] Compliance documentation handoff to operations
- [ ] Knowledge transfer on ongoing compliance obligations
- [ ] Audit trail preservation (7-year minimum per SOX; 6-year minimum per HIPAA)

---

## Mandatory vs. Optional Best Practices

### GDPR

**Mandatory** (Regulatory Requirement):
- Lawful basis determination
- DPIA for high-risk processing
- Data subject rights fulfillment
- 72-hour breach notification
- Data Processing Agreements with processors
- Privacy by design principle

**Optional** (Best Practice, but not legally required):
- Privacy impact metrics
- Automated consent management
- Privacy-enhancing technologies beyond minimum
- Privacy certification (e.g., TRUSTe)

### HIPAA

**Mandatory** (Regulatory Requirement):
- Security Risk Analysis
- Business Associate Agreements
- Encryption of PHI in transit
- Audit controls & logging
- Workforce training & NDA
- 60-day breach notification

**Optional** (Best Practice, but not legally required):
- Beyond-minimum encryption (e.g., client-side encryption)
- Advanced threat detection (AI/ML-based)
- Security awareness certification (e.g., HIPAA certification)
- Healthcare-specific security certifications

### SOX

**Mandatory** (Regulatory Requirement):
- COSO Internal Control Framework documentation
- Control testing & remediation
- Management attestation (Section 302)
- Auditor attestation (Section 404)
- IT General Controls (ITGCs)
- Segregation of duties in financial systems

**Optional** (Best Practice, but not legally required):
- Enterprise risk management (ERM) beyond control focus
- Integrated compliance & risk management
- Advanced analytics for control monitoring
- Continuous auditing technologies

### ISO 27001

**Mandatory** (For Certification):
- Information Security Policy
- Risk assessment & treatment (ISRA)
- Control selection from Annex A
- Internal audit program
- Management review
- Compliance audit (by certification body)

**Optional** (Best Practice, but not required for certification):
- Security maturity model progression beyond baseline
- Information security metrics & KPIs beyond compliance
- Security innovation initiatives (e.g., Zero Trust)

### NIST

**Mandatory** (For Federal Systems):
- FIPS 199 categorization
- NIST SP 800-53 control selection
- System Security Plan (SSP)
- Authority to Operate (ATO)
- Continuous monitoring
- Annual assessment

**Optional** (Best Practice, but not federally required):
- NIST Cybersecurity Framework (CSF) adoption
- NIST SP 800-82 guidance (industrial control systems)
- NIST SP 800-161 supply chain security

---

## When NOT to Use This Framework

- Organizations operating in single regulatory jurisdiction with simplified compliance (use jurisdiction-specific template instead)
- Projects with no regulatory obligations (use governance decision matrix)
- Organizations with dedicated compliance/legal team (coordinate with them on templates)

---

## Related Artifacts & Templates

- **Governance Decision Matrix** (Story #749) — Select governance model first, then apply compliance overlays
- **Existing Compliance Assets**: 
  - `.compliance_scripts/` — Example compliance automation scripts
  - `README_COMPLIANCE.md` — Compliance overview (organization-specific)
- **Regulatory Framework Resources**:
  - GDPR: European Commission, ICO (Information Commissioner's Office)
  - HIPAA: HHS Office for Civil Rights, HIPAA Enforcement Portal
  - SOX: SEC, PCAOB
  - ISO 27001: ISO, certification bodies
  - NIST: NIST Computer Security Resource Center (CSRC)

---

## Acceptance Criteria Status

- [x] Top 5 regulatory frameworks mapped (GDPR, HIPAA, SOX, ISO 27001, NIST)
- [x] Each framework: applicable governance artifacts + required evidence + reporting requirements
- [x] Existing compliance-related assets integrated (`.compliance_scripts/`, `README_COMPLIANCE.md`)
- [x] Compliance overlay annotates (does not duplicate) governance templates
- [x] Guidance distinguishes mandatory regulatory requirements from optional best practices
- [x] Related existing issue #339 referenced for enterprise compliance context

**Status**: ✅ COMPLETE — Ready for validation review (Gate 2, Sep 25)

---

**Version**: Sprint 13 Design Phase  
**Status**: Ready for Stakeholder Review  
**Related Issue**: #750  
**Next Gate**: Gate 2 (Sep 25) Validation
