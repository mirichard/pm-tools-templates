# Governance Decision Matrix: Selection Guide

**Version**: Sprint 13 Draft  
**Status**: ✅ Design Phase Complete — Ready for Gate 2 Validation (Sep 25)  
**Related Issues**: #749 (Governance Decision Matrix), #713 (Epic 6: Governance Modernization)

---

## Overview

This governance decision matrix synthesizes all governance options into a unified selection guide that helps organizations choose the right governance approach for their project context.

**The matrix maps**:
- Project characteristics (size, duration, risk, stakeholder complexity)
- → Recommended governance model (adaptive tiers, risk-based scaling, event-driven controls)
- → Specific governance templates and artifacts to use

---

## Governance Models Available

### 1. Adaptive Tier Model (Flexible, Risk-Responsive)
**Characteristics**:
- 4 governance tiers (Minimal, Moderate, Structured, Rigorous)
- Scales governance intensity based on project risk profile
- Flexible tier adjustment throughout project lifecycle
- Best for: Projects with evolving risk, varying team experience, high uncertainty

**When to Use**:
- Agile/iterative projects with emerging requirements
- Cross-functional teams learning new domains
- Innovation/R&D initiatives with discovery phases
- Startups and emerging organizations

**Tier Definitions**:

| Tier | Duration | Team Size | Risk Profile | Reporting | Review Cycle |
|------|----------|-----------|--------------|-----------|--------------|
| **Minimal** | < 3 months | 1-5 | Low | Monthly | Ad-hoc |
| **Moderate** | 3-6 months | 5-15 | Medium | Bi-weekly | Fortnightly |
| **Structured** | 6-12 months | 15-50 | Medium-High | Weekly | Weekly |
| **Rigorous** | 12+ months | 50+ | High/Critical | Daily | Multiple per week |

---

### 2. Risk-Based Scaling (Proportional Oversight)
**Characteristics**:
- Governance intensity scales with measured risk score
- Risk evaluated across: technical complexity, stakeholder criticality, financial exposure, compliance obligations
- Continuous risk reassessment triggers governance adjustments
- Best for: Organizations with mature risk management, changing project portfolios

**When to Use**:
- Large enterprises with portfolio management
- Organizations with significant financial or regulatory exposure
- Projects with quantifiable risk metrics
- Matrix/program management structures

**Risk Scoring Factors**:
1. **Technical Complexity** (0-5 scale)
   - Score: Novelty + architectural risk + technical debt + dependency count

2. **Stakeholder Criticality** (0-5 scale)
   - Score: Executive visibility + customer impact + cross-team dependencies + political sensitivity

3. **Financial Exposure** (0-5 scale)
   - Score: Budget size + profit impact + investment recovery period

4. **Compliance Obligations** (0-5 scale)
   - Score: Regulatory frameworks + audit requirements + audit frequency

**Governance Intensity** = (Technical + Stakeholder + Financial + Compliance) / 20 × 100%

| Risk Score | Governance Intensity | Review Frequency | Approval Authority |
|------------|---------------------|------------------|-------------------|
| 0-25% | Lightweight | Ad-hoc | Team lead |
| 26-50% | Moderate | Bi-weekly | Manager + sponsor |
| 51-75% | Significant | Weekly | Director + PMO |
| 76-100% | Rigorous | Daily | Executive steering committee |

---

### 3. Event-Driven Controls (Trigger-Based Governance)
**Characteristics**:
- Governance activates based on specific project events/triggers
- Triggers are predefined and monitored throughout project
- Escalation and control procedures associated with each trigger
- Best for: Organizations needing flexibility with safety guardrails

**When to Use**:
- Organizations wanting minimal baseline governance + strong safety controls
- Projects where governance burden should only activate when problems emerge
- Highly autonomous teams with strong self-governance culture

**Common Governance Triggers**:

| Event Trigger | Severity | Activation | Control |
|---------------|----------|------------|---------|
| **Scope creep** | > 15% unplanned increase | Immediate | Re-baseline + steering review |
| **Budget overrun** | > 10% variance to forecast | Immediate | Finance review + re-forecast |
| **Schedule slip** | > 2-week cumulative delay | Significant | Sponsor review + recovery plan |
| **Quality defects** | Defect escape rate > baseline × 1.5 | Significant | QA deep-dive + process review |
| **Key person departure** | Critical role vacancy > 1 week | Moderate | Knowledge transfer plan + coverage |
| **Dependency failure** | External blocker > 3 days | Moderate | Escalation + mitigation planning |
| **Stakeholder escalation** | Issue escalated to steering committee | Critical | Executive review + decision gate |
| **Regulatory/compliance finding** | Non-compliance identified | Critical | Compliance review + remediation |

---

## Governance Decision Matrix

### Quick Selection Guide

**Step 1: Assess Your Project Context**

| Question | Answer | Notes |
|----------|--------|-------|
| How many months will this project run? | < 3 / 3-6 / 6-12 / 12+ | Duration |
| What is your team size? | 1-5 / 5-15 / 15-50 / 50+ | Team scope |
| What is the stakeholder complexity? | Low / Medium / High / Very High | Executive visibility, cross-team deps |
| Are there regulatory/compliance obligations? | None / Some / Significant / Critical | Compliance scope |
| What is the technical complexity? | Low / Medium / High / Very High | Novelty, architecture, dependencies |
| How much financial exposure? | < $100K / $100K-$1M / $1M-$10M / > $10M | Budget impact |
| What is your team's governance maturity? | Low / Moderate / High / Very High | Risk tolerance |

**Step 2: Score Your Risk Profile**

Use the Risk-Based Scaling model above to calculate governance intensity (0-100%).

**Step 3: Select Governance Model**

| Profile | Recommended Model | Rationale |
|---------|------------------|-----------|
| **Small, low-risk, co-located team** | Event-Driven | Minimal overhead; safety guardrails for issues |
| **Medium project, emerging requirements** | Adaptive Tiers | Flexible intensity matching project risk evolution |
| **Large, complex, regulated** | Risk-Based Scaling | Proportional governance to measured risk |
| **Hybrid/portfolio context** | Risk-Based Scaling + Event-Driven | Baseline risk-driven + trigger-based escalation |
| **Startup/high-autonomy culture** | Event-Driven + Minimal Adaptive Tier | Minimal baseline + activation on triggers |

---

## Decision Flowchart

```
START: New Project Governance Selection
│
├─► Question 1: Duration + Team Size
│   ├─ Small & Short (< 6 mo, < 15 ppl)  ──► Go to Q3 (Compliance)
│   ├─ Medium (6-12 mo, 15-50 ppl)       ──► Go to Q2 (Stakeholder)
│   └─ Large (12+ mo, 50+ ppl)           ──► Risk-Based Scaling likely
│
├─► Question 2: Stakeholder Complexity + Visibility
│   ├─ Low/Internal  ──► Event-Driven likely
│   ├─ Medium        ──► Adaptive Tiers or Risk-Based
│   └─ High/Executive ──► Risk-Based Scaling required
│
├─► Question 3: Compliance Obligations
│   ├─ None           ──► Event-Driven or Adaptive Tiers
│   ├─ Some           ──► Adaptive Tiers
│   └─ Significant+   ──► Risk-Based Scaling + compliance monitoring
│
├─► Question 4: Financial Exposure
│   ├─ Low            ──► Event-Driven or Adaptive-Minimal
│   ├─ Medium         ──► Adaptive-Moderate
│   └─ High           ──► Risk-Based Scaling
│
└─► RECOMMENDATION: [Model] with intensity [Low/Moderate/High]
    ├─ Start with recommended model
    ├─ Apply adaptive tier/risk scoring for intensity
    ├─ Activate event-driven triggers for safety
    └─ Review + adjust at first project milestone
```

---

## Five Example Organizational Contexts

### Example 1: Startup SaaS (Early-Stage)

**Profile**:
- Duration: 4 months (MVP release)
- Team: 8 people (co-located)
- Stakeholder Complexity: Medium (founders + angel investors)
- Compliance: None
- Technical Complexity: High (new architecture, emerging tech stack)
- Financial Exposure: $500K seed investment

**Recommended Governance**:
- **Primary Model**: Adaptive Tiers (Moderate tier)
- **Intensity**: 35% (emerging risk profile)
- **Rationale**: High technical risk + investor visibility requires structured oversight, but team autonomy is critical for innovation speed
- **Governance Artifacts**:
  - Bi-weekly steering reviews with investor updates
  - Weekly technical architecture reviews
  - Event-driven escalation: scope creep >20%, budget variance >15%, key technical decisions
- **Templates to Use**:
  - Adaptive-Governance/moderate-tier-template.md
  - Stakeholder-Communication-Plan.md
  - Risk-Register (weekly updates)
  - Architecture Decision Record (ADR)

---

### Example 2: Enterprise Bank (Regulated)

**Profile**:
- Duration: 18 months (core platform modernization)
- Team: 120 people (distributed, multiple teams)
- Stakeholder Complexity: Very High (regulatory bodies, executives, legacy users)
- Compliance: Critical (PCI-DSS, SOX, GDPR)
- Technical Complexity: Very High (legacy integration, distributed architecture)
- Financial Exposure: $25M+ budget

**Recommended Governance**:
- **Primary Model**: Risk-Based Scaling
- **Intensity**: 92% (highly complex, highly regulated, massive financial exposure)
- **Rationale**: Enterprise complexity + compliance obligations + financial exposure require rigorous governance with daily executive visibility
- **Governance Artifacts**:
  - Steering Committee (weekly, escalation to board monthly)
  - PMO oversight (daily risk dashboards, weekly status reports)
  - Compliance review board (weekly)
  - Event-driven escalation: regulatory findings (immediate), budget >$1M variance (daily), schedule slip >2 weeks (immediate), defect escape rate anomaly (daily)
  - Formal change control board
- **Templates to Use**:
  - Risk-Based-Scaling/rigorous-tier-template.md
  - Compliance-Monitoring-Framework (GDPR, SOX, PCI-DSS)
  - Executive-Steering-Committee-Charter
  - PMO-Dashboard-Template
  - Formal-Change-Control-Process

---

### Example 3: Healthcare Organization (Mid-Size)

**Profile**:
- Duration: 10 months (EHR workflow redesign)
- Team: 45 people (clinical + IT + operations)
- Stakeholder Complexity: High (clinicians, patients, regulators, executives)
- Compliance: Significant (HIPAA, state licensing)
- Technical Complexity: Medium (integrating existing EHR platform)
- Financial Exposure: $3M budget

**Recommended Governance**:
- **Primary Model**: Adaptive Tiers (Structured tier) + Risk-Based Scaling
- **Intensity**: 68% (significant complexity + healthcare regulations)
- **Rationale**: Clinical safety is paramount; HIPAA compliance required; clinician involvement critical throughout
- **Governance Artifacts**:
  - Clinical Governance Committee (weekly review of clinical impact)
  - Steering Committee (weekly for organizational + compliance oversight)
  - Compliance Review (bi-weekly HIPAA checklist)
  - Event-driven escalation: clinical safety concern (immediate escalation), HIPAA breach risk (immediate), workflow delay >3 days (same-day escalation)
  - User acceptance testing governance (structured sign-off by clinician roles)
- **Templates to Use**:
  - Adaptive-Governance/structured-tier-template.md
  - Clinical-Safety-Review-Process
  - HIPAA-Compliance-Monitoring
  - Stakeholder-EHR-Review-Meeting
  - User-Acceptance-Testing-Governance

---

### Example 4: Digital Agency (Project-Based)

**Profile**:
- Duration: 6 months (web platform redesign for client)
- Team: 20 people (internal agency team + client stakeholders)
- Stakeholder Complexity: High (multiple client decision-makers, end users)
- Compliance: Some (website accessibility, data privacy for user data)
- Technical Complexity: Medium (redesign existing platform)
- Financial Exposure: $800K client contract

**Recommended Governance**:
- **Primary Model**: Event-Driven Controls
- **Intensity**: 45% (moderate — client engagement high, technical complexity moderate)
- **Rationale**: Client satisfaction requires responsiveness to feedback; lightweight baseline governance + escalation on scope/quality issues
- **Governance Artifacts**:
  - Client steering meeting (bi-weekly for status + decision-making)
  - Internal sprint reviews (weekly)
  - Event-driven escalation: client scope change request (approval gate), design QA issues >critical (immediate fix), schedule variance >1 week (client discussion), accessibility audit failure (immediate remediation)
  - Formal sign-off gates at key milestones (discovery, design, development, UAT, launch)
- **Templates to Use**:
  - Event-Driven-Controls/agency-template.md
  - Client-Steering-Meeting-Charter
  - Design-QA-Checklist
  - Accessibility-Compliance-Checklist
  - Client-Sign-Off-Template

---

### Example 5: Internal IT Operations (Continuous Service)

**Profile**:
- Duration: Ongoing (no fixed end date — infrastructure maintenance & enhancement)
- Team: 12 people (distributed ops team)
- Stakeholder Complexity: Medium (multiple internal departments depend on services)
- Compliance: Some (security standards, audit requirements)
- Technical Complexity: Varies (mix of routine maintenance + innovations)
- Financial Exposure: $2M annual ops budget

**Recommended Governance**:
- **Primary Model**: Event-Driven Controls + Minimal Adaptive Tier
- **Intensity**: 35% (baseline lightweight for routine work; escalation for incidents/changes)
- **Rationale**: Operations need high autonomy for routine work; governance activates for changes, incidents, or issues
- **Governance Artifacts**:
  - Change Advisory Board (CAB) for major changes (infrastructure or cross-team impact)
  - Incident management escalation (severity-based)
  - Event-driven escalation: critical incident (immediate war room), major infrastructure change (CAB review + approval), security vulnerability (emergency response + patch)
  - Service-level agreements (SLA) with escalation triggers
  - Quarterly IT steering for strategic planning
- **Templates to Use**:
  - Event-Driven-Controls/ops-template.md
  - Change-Advisory-Board-Charter
  - Incident-Management-Escalation-Matrix
  - Service-Level-Agreement-Template
  - Security-Vulnerability-Response-Process

---

## Implementation Steps

### At Project Initiation

1. **Complete the Decision Matrix** (30 minutes)
   - Answer 7 assessment questions
   - Calculate risk score (if using risk-based scaling)
   - Identify recommended governance model

2. **Select Governance Model Artifacts** (1-2 hours)
   - Download recommended templates from domains/governance/
   - Adapt examples to your organizational context
   - Establish stakeholder review/approval process

3. **Establish Governance Rhythm** (1 hour)
   - Define meeting cadence (steering committee, reviews, escalations)
   - Identify governance stakeholders (sponsors, PMO, compliance)
   - Set up governance dashboards or tracking mechanisms

4. **Document Triggers & Escalation Paths** (1-2 hours)
   - Select relevant event-driven triggers
   - Define escalation authority for each trigger
   - Communicate trigger definitions to team

### At Project Milestones

- **Review & Adjust Governance**: Every milestone (month 1, 3, 6, etc.)
  - Has project risk profile changed?
  - Is current governance intensity appropriate?
  - Should triggers be adjusted?

---

## When NOT to Use This Guide

- Organizations with pre-defined, non-negotiable governance standards
- Projects operating within strict regulatory frameworks (use compliance-specific governance)
- Organizations where governance decision-making is centralized at executive level (use as input, not as primary decision tool)

---

## Related Templates

- **Adaptive Governance Tier Templates** (domains/governance/adaptive-*)
- **Risk-Based Scaling Framework** (domains/governance/risk-based-*)
- **Event-Driven Controls** (domains/governance/event-driven-*)
- **Compliance Integration Guide** (see Story #750)
- **Executive Steering Committee Charter** (domains/governance/steering-committee-charter.md)
- **Project Initiation Checklist** (domains/planning/project-initiation-checklist.md)

---

## Acceptance Criteria Status

- [x] Decision matrix maps project characteristics → governance approach
- [x] Matrix integrates tier selection + risk scaling + event triggers
- [x] Visual format (matrix + flowchart) enables rapid governance selection
- [x] References specific templates for each governance path
- [x] 5 example organizational contexts provided

**Status**: ✅ COMPLETE — Ready for validation review (Gate 2, Sep 25)

---

**Version**: Sprint 13 Design Phase  
**Status**: Ready for Stakeholder Review  
**Related Issue**: #749  
**Next Gate**: Gate 2 (Sep 25) Validation
