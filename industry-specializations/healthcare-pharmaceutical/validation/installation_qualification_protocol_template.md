# Installation Qualification (IQ) Protocol Template

## Document Control

**Document ID:** IQ-PROTO-[SYSTEM_ID]  
**Version:** 1.0  
**Effective Date:** [EFFECTIVE_DATE]  
**Review Date:** [REVIEW_DATE]  
**Supersedes:** N/A (Initial Version)

### Revision History

| Version | Date | Description of Change | Author | Approved By |
|---------|------|------------------------|--------|-------------|
| 1.0 | [DATE] | Initial Release | [NAME] | [NAME] |

### Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Protocol Author | | | |
| Quality Assurance | | | |
| IT/Engineering | | | |
| Validation Lead | | | |
| System Owner | | | |
| Quality Control (if applicable) | | | |

## 1. Introduction and Purpose

### 1.1 Purpose
This Installation Qualification (IQ) Protocol defines the approach, methodology, and acceptance criteria for verifying that the [SYSTEM_NAME] has been properly received, installed, and configured according to manufacturer specifications and regulatory requirements. This protocol is designed to document evidence that all key aspects of the installation comply with approved design specifications and recommendations.

### 1.2 Scope
This protocol covers the installation qualification of [SYSTEM_NAME], including hardware components, software installation, network configuration, security configuration, and backup system configuration. The IQ verifies that the system has been properly delivered, installed, and configured in the intended environment.

### 1.3 Regulatory Framework
This protocol follows:
- FDA 21 CFR Part 11 (Electronic Records and Electronic Signatures)
- FDA 21 CFR Part 210/211 (cGMP for Finished Pharmaceuticals)
- EU GMP Annex 11 (Computerized Systems)
- EU GMP Annex 15 (Qualification and Validation)
- GAMP 5 Guidelines (Good Automated Manufacturing Practice)
- [OTHER APPLICABLE REGULATIONS]

## 2. System Description

### 2.1 System Overview
[Provide a brief description of the system, its intended use, and its components]

### 2.2 System Configuration
- **Hardware Components:** [List all hardware components with model numbers, serial numbers, etc.]
- **Software Components:** [List all software with version numbers]
- **Interfaces:** [List all interfaces with other systems]
- **Operating Environment:** [Describe the operating environment]

### 2.3 System Classification
According to GAMP 5 categorization, this system is classified as Category [X] software.

## 3. Personnel Responsibilities and Qualifications

### 3.1 Roles and Responsibilities

| Role | Responsibilities |
|------|-----------------|
| Validation Lead | Overall responsibility for the validation activities |
| System Owner | Business owner of the system with ultimate responsibility |
| IT/Engineering | Technical installation and configuration |
| Quality Assurance | Review and approval of validation activities |
| Vendor/Supplier (if applicable) | Technical support for installation |

### 3.2 Required Qualifications
[Describe minimum qualifications and training requirements for personnel involved in IQ activities]

## 4. Prerequisites and Installation Conditions

### 4.1 Pre-Installation Requirements
- Approved User Requirements Specification (URS)
- Approved Functional Specification (FS)
- Approved Design Specification (DS)
- Completed Risk Assessment
- Approved Validation Plan
- Completed Site Preparation
- Verification of Environmental Conditions
- [OTHER PREREQUISITES]

### 4.2 Required Documentation
- Vendor manuals and installation guides
- System drawings and schematics
- Manufacturer specifications
- Calibration certificates (if applicable)
- Software licenses
- SOPs for system operation

### 4.3 Environmental and Facility Requirements
- Power requirements
- Temperature and humidity specifications
- Space requirements
- Network requirements
- Physical security requirements

## 5. Installation Verification Requirements

### 5.1 Hardware Installation Verification
- Receipt verification (condition upon arrival)
- Component verification (all required components received)
- Hardware installation verification
- Physical connections verification
- Power supply verification
- Hardware configuration verification
- Serial numbers documentation

#### 5.1.1 Hardware Components Checklist

| Component | Model/Part Number | Serial Number | Condition | Verified By | Date |
|-----------|-------------------|---------------|-----------|------------|------|
| | | | | | |
| | | | | | |

### 5.2 Software Installation Verification
- Installation media verification
- Installation process documentation
- Version verification
- License verification
- Default settings documentation
- Installation logs review
- Software configuration verification

#### 5.2.1 Software Components Checklist

| Software | Version | License Information | Installation Path | Verified By | Date |
|----------|---------|---------------------|------------------|------------|------|
| | | | | | |
| | | | | | |

### 5.3 Network Configuration Verification
- Network connectivity verification
- IP address configuration
- DNS configuration
- Firewall settings
- Network security verification
- Communication with interfaced systems

#### 5.3.1 Network Configuration Details

| Parameter | Expected Value | Actual Value | Verified By | Date |
|-----------|----------------|--------------|------------|------|
| IP Address | | | | |
| Subnet Mask | | | | |
| Gateway | | | | |
| DNS Servers | | | | |
| Hostname | | | | |

### 5.4 Security Configuration Verification
- User account setup
- Password policies
- Access controls
- Authentication mechanisms
- Audit trail configuration
- Security patches/updates verification

#### 5.4.1 Security Settings Checklist

| Security Parameter | Expected Configuration | Actual Configuration | Verified By | Date |
|-------------------|------------------------|----------------------|------------|------|
| Password Complexity | | | | |
| Account Lockout | | | | |
| Session Timeout | | | | |
| Audit Trail Settings | | | | |

### 5.5 Backup System Configuration
- Backup software installation
- Backup schedule configuration
- Backup storage location
- Backup access controls
- Restoration procedure verification

#### 5.5.1 Backup Configuration Details

| Backup Parameter | Configuration | Verified By | Date |
|-----------------|---------------|------------|------|
| Backup Schedule | | | |
| Backup Location | | | |
| Retention Period | | | |
| Responsible Person | | | |

## 6. Test Cases with Pass/Fail Criteria

### 6.1 Test Case Format
Each test case includes:
- Unique test case ID
- Test objective
- Prerequisites
- Test procedure
- Expected results
- Actual results
- Pass/fail determination
- Comments/observations
- Tester signature and date
- Reviewer signature and date

### 6.2 Hardware Installation Test Cases
[Include detailed test cases for hardware installation verification]

### 6.3 Software Installation Test Cases
[Include detailed test cases for software installation verification]

### 6.4 Network Configuration Test Cases
[Include detailed test cases for network configuration verification]

### 6.5 Security Configuration Test Cases
[Include detailed test cases for security configuration verification]

### 6.6 Backup Configuration Test Cases
[Include detailed test cases for backup configuration verification]

## 7. Test Execution

### 7.1 Test Summary Table

| Test ID | Test Description | Status (Pass/Fail) | Executed By | Date | Comments |
|---------|------------------|-------------------|------------|------|----------|
| | | | | | |
| | | | | | |

### 7.2 Test Case Detail Sheets
[Provide space for test execution documentation]

## 8. Deviation Management

### 8.1 Deviation Recording
All deviations encountered during execution of this protocol must be documented using the Deviation Form included in Appendix A.

### 8.2 Deviation Classification
- Critical: Directly impacts system functionality or regulatory compliance
- Major: Impacts system performance but not critical functionality
- Minor: No significant impact on system functionality or compliance

### 8.3 Deviation Resolution
All deviations must be investigated, and appropriate corrective and preventive actions must be implemented before final approval of this protocol.

### 8.4 Deviation Log

| Deviation ID | Description | Classification | Impact Assessment | Resolution | Status | Closed By | Date |
|--------------|-------------|----------------|-------------------|------------|--------|-----------|------|
| | | | | | | | |

## 9. Documentation Requirements

### 9.1 Required Documentation
The following documentation must be included or referenced as attachments to this protocol:
- Vendor installation records
- Configuration worksheets
- Calibration certificates (if applicable)
- Network diagrams
- System architecture diagrams
- Installation checklists
- Screenshots of critical configurations
- Test result documentation
- Deviation reports (if applicable)

### 9.2 Documentation Control
All documentation generated during IQ execution must be controlled according to the organization's document control procedures.

## 10. Approval and Reporting

### 10.1 Installation Qualification Summary
[Provide space for summary of IQ execution]

### 10.2 Conclusion Statement
[Provide space for conclusion statement regarding IQ results]

### 10.3 Final Approval
Based on the results documented in this protocol, the installation qualification of [SYSTEM_NAME] is:
- [ ] Approved
- [ ] Approved with conditions (see attached)
- [ ] Rejected

### 10.4 Approval Signatures

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Validation Lead | | | |
| System Owner | | | |
| Quality Assurance | | | |
| IT/Engineering | | | |

## Appendices

### Appendix A: Deviation Form Template

**Deviation ID:** [DEVIATION_ID]  
**Protocol/Test Case Reference:** [REFERENCE]  
**Date Observed:** [DATE]  
**Observed By:** [NAME]

**Description of Deviation:**  
[Provide detailed description]

**Classification:**  
- [ ] Critical
- [ ] Major
- [ ] Minor

**Impact Assessment:**  
[Describe impact on system, process, product, validation]

**Root Cause Analysis:**  
[Describe root cause]

**Corrective Action:**  
[Describe corrective action]

**Preventive Action:**  
[Describe preventive action]

**Resolution:**  
[Describe resolution]

**Verification of Effectiveness:**  
[Describe verification of effectiveness]

**Approval of Resolution:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Validation Lead | | | |
| System Owner | | | |
| Quality Assurance | | | |

### Appendix B: IQ Checklist Template
[Include a comprehensive checklist for IQ activities]

### Appendix C: Glossary
[Include definitions of key terms used in the protocol]

### Appendix D: References
- FDA 21 CFR Part 11
- FDA 21 CFR Part 210/211
- EU GMP Annex 11
- EU GMP Annex 15
- GAMP 5 Guidelines
- [OTHER REFERENCES]
