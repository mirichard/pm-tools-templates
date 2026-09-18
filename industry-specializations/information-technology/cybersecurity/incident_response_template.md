# Cybersecurity Incident Response Template

**Version:** 1.0  
**Last Updated:** [Date]  
**Document Owner:** [CISO/Security Manager]  
**Approved By:** [Name], [Title]

---

## Executive Summary

This cybersecurity incident response template provides a structured approach to detecting, analyzing, containing, and recovering from cybersecurity incidents. It aligns with NIST SP 800-61 Computer Security Incident Handling Guide and industry best practices.

---

## Incident Classification

### Incident Severity Levels
| Level | Description | Response Time | Escalation Required |
|-------|-------------|---------------|-------------------|
| **Critical** | Immediate threat to business operations, data breach, ransomware | 15 minutes | CISO, C-Level |
| **High** | Significant security impact, system compromise | 1 hour | Security Manager |
| **Medium** | Moderate security impact, potential threat | 4 hours | Team Lead |
| **Low** | Minor security events, informational | 24 hours | Security Analyst |

### Incident Categories
- **Malware** - Viruses, ransomware, trojans
- **Phishing** - Email-based social engineering attacks
- **Data Breach** - Unauthorized access to sensitive data
- **System Intrusion** - Unauthorized system access
- **Denial of Service** - Service availability attacks
- **Insider Threat** - Malicious or negligent internal actions
- **Physical Security** - Unauthorized physical access
- **Supply Chain** - Third-party security incidents

---

## Incident Response Team (IRT)

### Core Team Roles
| Role | Responsibilities | Primary Contact | Backup Contact |
|------|-----------------|----------------|----------------|
| **Incident Commander** | Overall response coordination | [Name/Phone] | [Name/Phone] |
| **Security Analyst** | Technical investigation | [Name/Phone] | [Name/Phone] |
| **IT Operations** | System restoration | [Name/Phone] | [Name/Phone] |
| **Communications** | Stakeholder updates | [Name/Phone] | [Name/Phone] |
| **Legal Counsel** | Legal and regulatory guidance | [Name/Phone] | [Name/Phone] |
| **HR Representative** | Employee-related incidents | [Name/Phone] | [Name/Phone] |

### Extended Team (as needed)
- **External Forensics** - [Vendor contact]
- **Law Enforcement** - [Local FBI/Police contact]
- **Cyber Insurance** - [Insurance contact]
- **Regulatory Contacts** - [Industry-specific contacts]

---

## Incident Response Process

### Phase 1: Preparation
**Ongoing Activities**
- [ ] Incident response plan updated and tested
- [ ] Team contact information current
- [ ] Tools and technologies operational
- [ ] Staff training completed
- [ ] Communication templates ready

### Phase 2: Detection and Analysis
**Initial Detection (0-15 minutes)**
- [ ] Incident identified through monitoring/reporting
- [ ] Initial assessment of scope and impact
- [ ] Incident severity level assigned
- [ ] Incident response team notified
- [ ] Incident tracking number assigned

**Detailed Analysis (15 minutes - 4 hours)**
- [ ] Evidence collection and preservation
- [ ] Attack vector identification
- [ ] Scope and impact assessment
- [ ] Root cause analysis initiated
- [ ] Timeline reconstruction

### Phase 3: Containment, Eradication, and Recovery
**Short-term Containment (Immediate)**
- [ ] Isolate affected systems
- [ ] Preserve evidence
- [ ] Prevent further damage
- [ ] Maintain business operations

**Long-term Containment (1-24 hours)**
- [ ] Implement temporary fixes
- [ ] System hardening
- [ ] Enhanced monitoring
- [ ] Stakeholder communication

**Eradication (1-7 days)**
- [ ] Remove malware/threats
- [ ] Vulnerability patching
- [ ] System rebuilding if needed
- [ ] Security control enhancement

**Recovery (1-30 days)**
- [ ] System restoration
- [ ] Enhanced monitoring implementation
- [ ] Vulnerability testing
- [ ] Return to normal operations

### Phase 4: Post-Incident Activity
**Lessons Learned (Within 30 days)**
- [ ] Incident report completion
- [ ] Root cause analysis
- [ ] Process improvement recommendations
- [ ] Plan updates
- [ ] Staff debriefing

---

## Incident Response Playbooks

### Ransomware Response Playbook
**Immediate Actions (0-30 minutes)**
1. **ISOLATE** - Disconnect infected systems from network
2. **ASSESS** - Determine scope of encryption
3. **PRESERVE** - Secure backup systems
4. **NOTIFY** - Alert incident response team
5. **DOCUMENT** - Record all actions taken

**Investigation Actions (30 minutes - 4 hours)**
1. Identify ransomware variant
2. Assess data impact and encryption scope
3. Evaluate backup integrity
4. Determine attack vector
5. Notify law enforcement if required

**Recovery Actions (4+ hours)**
1. Evaluate ransom payment decision
2. Begin system restoration from backups
3. Patch vulnerabilities used in attack
4. Enhance monitoring and detection
5. Communicate with stakeholders

### Data Breach Response Playbook
**Immediate Actions (0-1 hour)**
1. **SECURE** - Stop ongoing data access
2. **ASSESS** - Determine data types affected
3. **PRESERVE** - Secure evidence
4. **NOTIFY** - Alert legal and privacy teams
5. **DOCUMENT** - Begin incident documentation

**Investigation Actions (1-24 hours)**
1. Determine breach scope and timeline
2. Identify affected data subjects
3. Assess regulatory notification requirements
4. Evaluate containment options
5. Prepare preliminary impact assessment

**Notification Actions (24-72 hours)**
1. Notify regulatory authorities (if required)
2. Prepare customer/public notifications
3. Coordinate with legal counsel
4. Implement credit monitoring (if applicable)
5. Document compliance activities

### Phishing Response Playbook
**Immediate Actions (0-30 minutes)**
1. **VERIFY** - Confirm phishing attempt
2. **BLOCK** - Block malicious emails/URLs
3. **IDENTIFY** - Find affected users
4. **QUARANTINE** - Isolate compromised accounts
5. **ALERT** - Warn other users

**Investigation Actions (30 minutes - 2 hours)**
1. Analyze phishing email/website
2. Identify compromised credentials
3. Check for lateral movement
4. Assess data access
5. Implement additional blocking

**Recovery Actions (2+ hours)**
1. Reset compromised passwords
2. Review account activities
3. Enhance email security controls
4. Conduct user awareness training
5. Update phishing protection

---

## Communication Templates

### Initial Incident Alert
**TO:** Incident Response Team  
**SUBJECT:** INCIDENT ALERT - [Severity] - [Incident ID]  
**PRIORITY:** [High/Critical]

**INCIDENT SUMMARY:**
- Incident ID: [ID]
- Detection Time: [Time]
- Incident Type: [Category]
- Severity: [Level]
- Affected Systems: [Systems]
- Initial Impact: [Description]

**IMMEDIATE ACTIONS REQUIRED:**
- [Action 1]
- [Action 2]
- [Action 3]

**INCIDENT COMMANDER:** [Name/Contact]
**NEXT UPDATE:** [Time]

### Executive Status Update
**TO:** Executive Team  
**SUBJECT:** Security Incident Status Update - [Incident ID]

**EXECUTIVE SUMMARY:**
[Brief description of incident and current status]

**IMPACT ASSESSMENT:**
- Business Operations: [Impact]
- Data/Systems: [Impact]
- Customers: [Impact]
- Financial: [Estimated cost]

**CURRENT STATUS:**
- Containment: [Status]
- Investigation: [Status]
- Recovery: [Status]

**NEXT STEPS:**
- [Action 1] - [Timeline]
- [Action 2] - [Timeline]

**ESTIMATED RESOLUTION:** [Time]

### External Communication Template
**FOR:** Customers/Public  
**RE:** Security Incident Notification

We are writing to inform you of a security incident that may have affected your information. We take this matter very seriously and want to provide you with details about what happened and what we are doing about it.

**WHAT HAPPENED:**
[Brief description of incident]

**INFORMATION INVOLVED:**
[Types of data that may have been accessed]

**WHAT WE ARE DOING:**
[Steps taken to investigate and address the incident]

**WHAT YOU CAN DO:**
[Recommended actions for affected parties]

**CONTACT INFORMATION:**
[How to get more information or ask questions]

---

## Evidence Collection and Preservation

### Digital Evidence Handling
**Chain of Custody Requirements**
- [ ] Evidence properly labeled and documented
- [ ] Handling personnel identified
- [ ] Transfer logs maintained
- [ ] Storage security ensured
- [ ] Access controls implemented

**Evidence Types**
- **System Logs** - Security, application, network logs
- **Memory Dumps** - RAM contents at time of incident
- **Disk Images** - Complete forensic copies
- **Network Captures** - Packet-level network data
- **Communications** - Email, chat, phone records

### Forensic Tools and Techniques
| Tool Category | Examples | Use Case |
|---------------|----------|----------|
| Memory Analysis | Volatility, Rekall | Live memory investigation |
| Disk Forensics | EnCase, FTK, Autopsy | File system analysis |
| Network Analysis | Wireshark, tcpdump | Network traffic analysis |
| Malware Analysis | IDA Pro, Ghidra | Reverse engineering |
| Timeline Analysis | Plaso, log2timeline | Event correlation |

---

## Legal and Regulatory Considerations

### Notification Requirements
| Regulation | Notification Timeline | Regulatory Body | Contact Information |
|------------|---------------------|-----------------|-------------------|
| GDPR | 72 hours | Data Protection Authority | [Contact] |
| HIPAA | 60 days | HHS OCR | [Contact] |
| PCI DSS | Immediately | Card Brands | [Contact] |
| SOX | Immediately | SEC | [Contact] |
| State Laws | Varies | State AG Office | [Contact] |

### Legal Considerations Checklist
- [ ] Attorney-client privilege maintained
- [ ] Evidence preservation requirements met
- [ ] Regulatory notification obligations assessed
- [ ] Contract breach implications evaluated
- [ ] Insurance coverage notification completed
- [ ] Law enforcement reporting considered

---

## Metrics and Reporting

### Key Performance Indicators
| Metric | Target | Current | Trend |
|--------|--------|---------|-------|
| Mean Time to Detection (MTTD) | < 4 hours | [Current] | [Trend] |
| Mean Time to Containment (MTTC) | < 2 hours | [Current] | [Trend] |
| Mean Time to Recovery (MTTR) | < 24 hours | [Current] | [Trend] |
| False Positive Rate | < 10% | [Current] | [Trend] |
| Incident Recurrence Rate | < 5% | [Current] | [Trend] |

### Incident Report Template
**INCIDENT SUMMARY REPORT**

**Incident ID:** [ID]  
**Date Range:** [Start] to [End]  
**Incident Commander:** [Name]

**EXECUTIVE SUMMARY:**
[High-level description of incident and response]

**TIMELINE:**
- [Time] - Initial detection
- [Time] - Response team activated
- [Time] - Containment achieved
- [Time] - Recovery completed

**ROOT CAUSE:**
[Technical and process factors that led to incident]

**IMPACT ASSESSMENT:**
- Systems affected: [List]
- Data compromised: [Description]
- Business impact: [Duration/Cost]
- Customer impact: [Number affected]

**RESPONSE EFFECTIVENESS:**
- What worked well: [Successes]
- Areas for improvement: [Gaps]
- Lessons learned: [Key takeaways]

**RECOMMENDATIONS:**
1. [Recommendation 1] - [Priority] - [Owner] - [Timeline]
2. [Recommendation 2] - [Priority] - [Owner] - [Timeline]
3. [Recommendation 3] - [Priority] - [Owner] - [Timeline]

---

## Plan Maintenance and Testing

### Plan Review Schedule
- **Monthly:** Contact information updates
- **Quarterly:** Process and procedure review
- **Semi-annually:** Full plan review and updates
- **Annually:** Comprehensive plan overhaul

### Testing and Exercises
| Exercise Type | Frequency | Participants | Objectives |
|---------------|-----------|--------------|------------|
| Tabletop Exercise | Quarterly | Core IRT | Process validation |
| Simulation Exercise | Semi-annually | Extended team | Coordination testing |
| Red Team Exercise | Annually | Full organization | Detection capabilities |
| Recovery Testing | Annually | IT Operations | Recovery procedures |

### Training Requirements
- **All Staff:** Annual security awareness training
- **IRT Members:** Quarterly incident response training
- **Technical Staff:** Specialized forensics and analysis training
- **Management:** Executive briefings on incident response

---

## Appendices

### Appendix A: Emergency Contact List
[Complete contact information for all team members and external resources]

### Appendix B: Technical Response Procedures
[Detailed technical steps for common incident types]

### Appendix C: Communication Templates
[Additional templates for various communication scenarios]

### Appendix D: Legal and Regulatory Reference
[Specific requirements for applicable regulations]

---

*This incident response plan should be tested regularly and updated based on lessons learned from exercises and actual incidents. All team members should be familiar with their roles and responsibilities.*
