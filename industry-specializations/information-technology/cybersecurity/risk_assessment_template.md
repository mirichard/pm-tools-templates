# Cybersecurity Risk Assessment Template

**Version:** 1.0  
**Last Updated:** [Date]  
**Document Owner:** [Security Manager/CISO]  
**Approved By:** [Name], [Title]

---

## Executive Summary

This cybersecurity risk assessment template provides a systematic approach to identifying, analyzing, and evaluating cybersecurity risks within IT projects and infrastructure. It aligns with industry frameworks including NIST Cybersecurity Framework, ISO 27001, and CIS Controls.

---

## Assessment Overview

### Assessment Scope
**Project/System Name:** [Name]  
**Assessment Date:** [Date]  
**Assessment Period:** [Start Date] to [End Date]  
**Assessment Team:** [Team Members and Roles]  
**Assessment Framework:** [NIST CSF / ISO 27001 / Custom]

### Business Context
**Business Criticality:** [Critical/High/Medium/Low]  
**Regulatory Requirements:** [SOX, HIPAA, PCI-DSS, GDPR, etc.]  
**Data Classification:** [Public/Internal/Confidential/Restricted]  
**System Dependencies:** [Critical dependencies]

---

## Asset Inventory and Classification

### Information Assets
| Asset Type | Description | Classification | Owner | Location |
|------------|-------------|----------------|-------|----------|
| Customer Data | [Description] | Restricted | [Owner] | [Location] |
| Financial Records | [Description] | Confidential | [Owner] | [Location] |
| Intellectual Property | [Description] | Confidential | [Owner] | [Location] |
| Employee Data | [Description] | Confidential | [Owner] | [Location] |
| System Configurations | [Description] | Internal | [Owner] | [Location] |

### Technical Assets
| Asset Type | Description | Criticality | Owner | Network Zone |
|------------|-------------|-------------|-------|--------------|
| Web Servers | [Description] | High | [Owner] | DMZ |
| Database Servers | [Description] | Critical | [Owner] | Internal |
| Application Servers | [Description] | High | [Owner] | Internal |
| Network Equipment | [Description] | Critical | [Owner] | Infrastructure |
| Security Tools | [Description] | Critical | [Owner] | Security |

### Third-Party Assets
| Vendor | Service/Product | Data Access | Risk Level | Contract Terms |
|--------|-----------------|-------------|------------|----------------|
| [Vendor] | [Service] | [Data Types] | [High/Med/Low] | [Key Terms] |

---

## Threat Landscape Analysis

### External Threats
| Threat Actor | Motivation | Capability | Likelihood | Target Assets |
|--------------|------------|------------|------------|---------------|
| Cybercriminals | Financial | High | High | Financial data, PII |
| Nation-State | Espionage | Very High | Medium | IP, Strategic data |
| Hacktivists | Ideological | Medium | Low | Public systems |
| Competitors | Competitive | Medium | Medium | Trade secrets |

### Internal Threats
| Threat Source | Risk Type | Likelihood | Impact | Mitigation Priority |
|---------------|-----------|------------|--------|-------------------|
| Privileged Users | Malicious | Low | High | High |
| Employees | Negligent | Medium | Medium | Medium |
| Contractors | Malicious/Negligent | Medium | Medium | High |
| Third Parties | Data breach | Medium | High | High |

### Technical Threats
| Threat Vector | Description | Likelihood | Impact | Current Controls |
|---------------|-------------|------------|--------|------------------|
| Malware | Ransomware, viruses | High | High | Antivirus, EDR |
| Phishing | Email-based attacks | High | Medium | Email security, training |
| DDoS | Service disruption | Medium | Medium | DDoS protection |
| Insider Threat | Privileged access abuse | Low | High | Access controls, monitoring |
| Supply Chain | Third-party compromise | Medium | High | Vendor assessments |

---

## Vulnerability Assessment

### Technical Vulnerabilities
| Vulnerability | Severity | CVSS Score | Affected Systems | Exploitation Likelihood |
|---------------|----------|------------|------------------|----------------------|
| [CVE ID] | Critical | 9.8 | [Systems] | High |
| [CVE ID] | High | 8.1 | [Systems] | Medium |
| [Description] | Medium | 6.5 | [Systems] | Low |

### Process Vulnerabilities
| Process Gap | Risk Area | Impact | Likelihood | Remediation Effort |
|-------------|-----------|--------|------------|-------------------|
| Weak password policy | Authentication | High | High | Low |
| No security training | Human factor | Medium | High | Medium |
| Inadequate backup | Business continuity | High | Medium | High |
| Missing encryption | Data protection | High | Low | Medium |

### Architectural Vulnerabilities
| Security Gap | Description | Risk Level | Affected Components | Remediation Priority |
|--------------|-------------|------------|-------------------|-------------------|
| Network segmentation | Flat network topology | High | All systems | High |
| Privileged access | Over-privileged accounts | Medium | Admin systems | Medium |
| Monitoring gaps | Limited visibility | Medium | Critical systems | High |

---

## Risk Analysis and Evaluation

### Risk Calculation Matrix
**Risk = Threat Likelihood × Vulnerability × Impact**

| Risk Level | Score Range | Description | Response Required |
|------------|-------------|-------------|-------------------|
| Critical | 81-100 | Immediate threat to business | Immediate action |
| High | 61-80 | Significant business impact | Action within 30 days |
| Medium | 31-60 | Moderate business impact | Action within 90 days |
| Low | 1-30 | Minimal business impact | Monitor and review |

### Identified Risks
| Risk ID | Risk Description | Threat | Vulnerability | Impact | Likelihood | Risk Score | Risk Level |
|---------|------------------|--------|---------------|--------|------------|------------|------------|
| CR-001 | Data breach via SQL injection | Cybercriminals | Unpatched web app | High (8) | Medium (6) | 48 | Medium |
| CR-002 | Ransomware attack | Cybercriminals | Email phishing | Critical (10) | High (8) | 80 | High |
| CR-003 | Insider data theft | Malicious insider | Excessive privileges | High (8) | Low (3) | 24 | Low |
| CR-004 | DDoS service disruption | Competitors | No DDoS protection | Medium (6) | Medium (5) | 30 | Medium |

### Risk Heat Map
```
         IMPACT
    Low  Med  High Critical
L  │ Low │ Low │ Med │ High │
i  │ Low │ Med │ Med │ High │
k  │ Med │ Med │High │Crit  │
e  │ Med │High │High │Crit  │
l  │High │High │Crit │Crit  │
i
h
o
o
d
```

---

## Risk Treatment Options

### Risk Treatment Strategies
1. **Accept** - Risk within tolerance level
2. **Avoid** - Eliminate the risk source
3. **Mitigate** - Reduce likelihood or impact
4. **Transfer** - Share or shift risk (insurance, outsourcing)

### Risk Treatment Plan
| Risk ID | Treatment Strategy | Recommended Controls | Owner | Timeline | Cost Estimate |
|---------|-------------------|---------------------|-------|----------|---------------|
| CR-001 | Mitigate | Web application firewall, code review | Dev Team | 30 days | $15K |
| CR-002 | Mitigate | Email security, user training, backup | IT Security | 60 days | $25K |
| CR-003 | Mitigate | PAM solution, access review | IT Admin | 90 days | $40K |
| CR-004 | Transfer/Mitigate | DDoS protection service | Network Team | 15 days | $5K |

---

## Security Controls Assessment

### Current Control Effectiveness
| Control Category | Control Description | Implementation Status | Effectiveness | Gaps Identified |
|------------------|--------------------|--------------------|---------------|----------------|
| Access Control | Multi-factor authentication | Partial | Medium | Not enforced for all users |
| Data Protection | Encryption at rest | Implemented | High | Key management process |
| Network Security | Firewall rules | Implemented | Medium | Rule review needed |
| Monitoring | SIEM deployment | Partial | Low | Limited log sources |
| Incident Response | Response procedures | Documented | Medium | Testing needed |

### NIST CSF Alignment
| Function | Category | Current Maturity | Target Maturity | Gap Analysis |
|----------|----------|------------------|-----------------|--------------|
| Identify | Asset Management | Level 2 | Level 3 | Asset inventory incomplete |
| Protect | Access Control | Level 2 | Level 4 | PAM solution needed |
| Detect | Monitoring | Level 1 | Level 3 | SIEM enhancement required |
| Respond | Response Planning | Level 2 | Level 3 | Automation needed |
| Recover | Recovery Planning | Level 1 | Level 3 | Disaster recovery testing |

---

## Recommendations and Action Plan

### High Priority Actions (0-30 days)
1. **Patch Critical Vulnerabilities**
   - Owner: [IT Team]
   - Timeline: 7 days
   - Cost: $5K

2. **Implement Email Security Controls**
   - Owner: [Security Team]
   - Timeline: 30 days
   - Cost: $15K

3. **Enhance Monitoring Capabilities**
   - Owner: [SOC Team]
   - Timeline: 30 days
   - Cost: $20K

### Medium Priority Actions (30-90 days)
1. **Deploy PAM Solution**
   - Owner: [IT Security]
   - Timeline: 90 days
   - Cost: $40K

2. **Conduct Security Awareness Training**
   - Owner: [HR/Security]
   - Timeline: 60 days
   - Cost: $10K

3. **Implement Network Segmentation**
   - Owner: [Network Team]
   - Timeline: 90 days
   - Cost: $25K

### Long-term Actions (90+ days)
1. **Enhance SIEM Capabilities**
   - Owner: [Security Team]
   - Timeline: 120 days
   - Cost: $50K

2. **Disaster Recovery Testing Program**
   - Owner: [BCP Team]
   - Timeline: 180 days
   - Cost: $15K

---

## Metrics and KPIs

### Security Metrics
- **Risk Reduction:** Target 30% reduction in high/critical risks
- **Vulnerability Management:** 95% of critical vulnerabilities patched within 30 days
- **Incident Response:** Mean time to detection < 4 hours
- **Compliance:** 100% compliance with regulatory requirements
- **Training:** 95% completion rate for security awareness training

### Cost-Benefit Analysis
| Investment Category | Cost | Risk Reduction | ROI |
|-------------------|------|----------------|-----|
| Technical Controls | $75K | 60% | 3:1 |
| Process Improvements | $25K | 25% | 2:1 |
| Training & Awareness | $15K | 15% | 4:1 |
| **Total** | **$115K** | **100%** | **2.8:1** |

---

## Review and Approval

### Assessment Review
- [ ] Technical accuracy reviewed
- [ ] Business impact validated
- [ ] Risk calculations verified
- [ ] Recommendations prioritized
- [ ] Budget estimates confirmed

### Stakeholder Approval
| Role | Name | Signature | Date |
|------|------|-----------|------|
| CISO | [Name] | [Signature] | [Date] |
| IT Director | [Name] | [Signature] | [Date] |
| Business Owner | [Name] | [Signature] | [Date] |
| Risk Manager | [Name] | [Signature] | [Date] |

---

## Appendices

### Appendix A: Detailed Vulnerability Scan Results
[Attach technical scan reports]

### Appendix B: Threat Intelligence Sources
[List of threat intelligence feeds and sources]

### Appendix C: Regulatory Compliance Mapping
[Specific compliance requirements and controls mapping]

### Appendix D: Risk Register Template
[Detailed risk register with all identified risks]

---

## Template Usage Guidelines

### Customization Notes
- **Healthcare:** Add HIPAA-specific controls and risk scenarios
- **Financial:** Include PCI-DSS, SOX compliance requirements
- **Manufacturing:** Consider OT/IoT security risks
- **Government:** Add FedRAMP, FISMA control requirements

### Regular Review Schedule
- **Quarterly:** Risk landscape and threat intelligence updates
- **Semi-annually:** Control effectiveness assessment
- **Annually:** Complete risk assessment refresh
- **Ad-hoc:** After major incidents or changes

---

*This cybersecurity risk assessment should be conducted by qualified security professionals and reviewed regularly to maintain currency with evolving threats and business changes.*
