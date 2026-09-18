---
title: "Operational Qualification Protocol Template"
methodology: "universal"
complexity: "advanced"
owner: "mirichard"
updated: "2025-08-05"
---

# Operational Qualification (OQ) Protocol Template

## Document Control

**Document ID:** OQ-PROTO-[SYSTEM_ID]  
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
This Operational Qualification (OQ) Protocol defines the approach, methodology, and acceptance criteria for verifying that the [SYSTEM_NAME] functions according to its intended operational specifications. This protocol is designed to document evidence that all system functions operate correctly under normal and challenging conditions, meeting user requirements and regulatory expectations.

### 1.2 Scope
This protocol covers the operational qualification of [SYSTEM_NAME], including functional testing, security testing, interface testing, error handling, data integrity verification, and audit trail testing. The OQ verifies that the system operates as specified and is suitable for its intended use in the production environment.

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

### 2.4 Prerequisite Conditions
- Successfully completed Installation Qualification (IQ)
- [OTHER PREREQUISITES]

## 3. Personnel Responsibilities and Qualifications

### 3.1 Roles and Responsibilities

| Role | Responsibilities |
|------|-----------------|
| Validation Lead | Overall responsibility for the validation activities |
| System Owner | Business owner of the system with ultimate responsibility |
| IT/Engineering | Technical support and troubleshooting |
| Quality Assurance | Review and approval of validation activities |
| Test Executor | Execution of test scripts |
| Subject Matter Expert | Provides domain expertise for testing |

### 3.2 Required Qualifications
[Describe minimum qualifications and training requirements for personnel involved in OQ activities]

## 4. Test Strategy

### 4.1 Functional Testing Strategy
Functional testing will verify that all system functions operate as specified in the User Requirements Specification (URS) and Functional Specification (FS). Testing will cover:
- Core business functions
- Workflow processes
- Calculations and algorithms
- Report generation
- Data processing
- User interface functionality

### 4.2 Security Testing Strategy
Security testing will verify that the system implements appropriate security controls:
- User management functionality
- Role-based access controls
- Password policies and enforcement
- Electronic signature functionality (if applicable)
- Account lockout functionality
- Session timeout functionality

### 4.3 Interface Testing Strategy
Interface testing will verify correct communication with other systems:
- Data import/export functionality
- Integration with other systems
- File transfer capabilities
- API functionality (if applicable)
- Communication protocols

### 4.4 Error Handling Testing Strategy
Error handling testing will verify system responses to error conditions:
- Input validation
- Error messages
- System recovery capabilities
- Data integrity during errors
- Exception handling

### 4.5 Data Integrity Testing Strategy
Data integrity testing will verify that data remains accurate and consistent:
- Data entry validation
- Data storage integrity
- Data retrieval accuracy
- Backup and recovery functionality
- Data archiving functionality

### 4.6 Audit Trail Testing Strategy
Audit trail testing will verify the system's ability to track activities:
- User actions logging
- System event logging
- Data changes tracking
- Audit trail review functionality
- Audit trail protection

## 5. Test Cases with Expected Results

### 5.1 Test Case Format
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

### 5.2 Normal Conditions Test Cases
[Include detailed test cases for system functionality under normal operating conditions]

#### 5.2.1 Functional Test Cases

| Test ID | Test Objective | Test Procedure | Expected Results | Acceptance Criteria |
|---------|---------------|----------------|------------------|---------------------|
| OQ-FUNC-001 | | | | |
| OQ-FUNC-002 | | | | |

#### 5.2.2 Security Test Cases

| Test ID | Test Objective | Test Procedure | Expected Results | Acceptance Criteria |
|---------|---------------|----------------|------------------|---------------------|
| OQ-SEC-001 | | | | |
| OQ-SEC-002 | | | | |

#### 5.2.3 Interface Test Cases

| Test ID | Test Objective | Test Procedure | Expected Results | Acceptance Criteria |
|---------|---------------|----------------|------------------|---------------------|
| OQ-INT-001 | | | | |
| OQ-INT-002 | | | | |

#### 5.2.4 Audit Trail Test Cases

| Test ID | Test Objective | Test Procedure | Expected Results | Acceptance Criteria |
|---------|---------------|----------------|------------------|---------------------|
| OQ-AUD-001 | | | | |
| OQ-AUD-002 | | | | |

### 5.3 Boundary Conditions Test Cases
[Include detailed test cases for system functionality at the limits of operational parameters]

#### 5.3.1 Maximum Load Test Cases

| Test ID | Test Objective | Test Procedure | Expected Results | Acceptance Criteria |
|---------|---------------|----------------|------------------|---------------------|
| OQ-BND-001 | | | | |
| OQ-BND-002 | | | | |

#### 5.3.2 Minimum/Maximum Input Value Test Cases

| Test ID | Test Objective | Test Procedure | Expected Results | Acceptance Criteria |
|---------|---------------|----------------|------------------|---------------------|
| OQ-BND-003 | | | | |
| OQ-BND-004 | | | | |

### 5.4 Error Conditions Test Cases
[Include detailed test cases for system functionality under error conditions]

#### 5.4.1 Input Error Test Cases

| Test ID | Test Objective | Test Procedure | Expected Results | Acceptance Criteria |
|---------|---------------|----------------|------------------|---------------------|
| OQ-ERR-001 | | | | |
| OQ-ERR-002 | | | | |

#### 5.4.2 System Error Test Cases

| Test ID | Test Objective | Test Procedure | Expected Results | Acceptance Criteria |
|---------|---------------|----------------|------------------|---------------------|
| OQ-ERR-003 | | | | |
| OQ-ERR-004 | | | | |

### 5.5 Data Integrity Test Cases

| Test ID | Test Objective | Test Procedure | Expected Results | Acceptance Criteria |
|---------|---------------|----------------|------------------|---------------------|
| OQ-DAT-001 | | | | |
| OQ-DAT-002 | | | | |

## 6. Acceptance Criteria

### 6.1 General Acceptance Criteria
- All test cases must be executed
- All critical and major test cases must pass
- Any test failures must be documented, investigated, and resolved
- All deviations must be documented and addressed

### 6.2 Function-Specific Acceptance Criteria
[Define specific acceptance criteria for key system functions]

### 6.3 Performance Acceptance Criteria
[Define performance-related acceptance criteria]

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

## 9. Results Documentation

### 9.1 Required Documentation
The following documentation must be included or referenced as attachments to this protocol:
- Test result records
- Screenshots of critical functions
- System logs
- Audit trail reports
- Error logs
- Performance data
- Deviation reports (if applicable)

### 9.2 Documentation Control
All documentation generated during OQ execution must be controlled according to the organization's document control procedures.

## 10. Approval and Reporting

### 10.1 Operational Qualification Summary
[Provide space for summary of OQ execution]

### 10.2 Conclusion Statement
[Provide space for conclusion statement regarding OQ results]

### 10.3 Final Approval
Based on the results documented in this protocol, the operational qualification of [SYSTEM_NAME] is:
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

### Appendix B: Test Case Examples

#### Example Functional Test Case
**Test ID:** OQ-FUNC-001  
**Test Objective:** To verify that the system allows users to create a new record with valid data  
**Prerequisites:**
- System access with appropriate permissions
- Test data available

**Test Procedure:**
1. Log in to the system with valid credentials
2. Navigate to the record creation screen
3. Enter valid data in all required fields
4. Click the 'Save' button
5. Verify the record is saved
6. Verify all entered data is correctly stored

**Expected Results:**
- System accepts all valid data
- Record is successfully created
- Confirmation message is displayed
- Record appears in the database with correct data

**Actual Results:** [To be completed during testing]  
**Pass/Fail:** [To be completed during testing]  
**Comments:** [To be completed during testing]

#### Example Error Handling Test Case
**Test ID:** OQ-ERR-001  
**Test Objective:** To verify that the system properly validates required fields  
**Prerequisites:**
- System access with appropriate permissions

**Test Procedure:**
1. Log in to the system with valid credentials
2. Navigate to the record creation screen
3. Leave required fields blank
4. Click the 'Save' button
5. Observe system response

**Expected Results:**
- System prevents record creation
- Error messages identify missing required fields
- Data entered in other fields is retained
- No partial/incomplete record is saved

**Actual Results:** [To be completed during testing]  
**Pass/Fail:** [To be completed during testing]  
**Comments:** [To be completed during testing]

### Appendix C: Glossary
[Include definitions of key terms used in the protocol]

### Appendix D: References
- FDA 21 CFR Part 11
- FDA 21 CFR Part 210/211
- EU GMP Annex 11
- EU GMP Annex 15
- GAMP 5 Guidelines
- [OTHER REFERENCES]
