# Computer System Change Control Procedure

**Document Number:** CSCC-PROC-[SYSTEM-ID]-[VERSION]  
**Effective Date:** [EFFECTIVE DATE]  
**Version:** [VERSION NUMBER]  
**Supersedes:** [PREVIOUS VERSION, IF APPLICABLE]  

---

## Document Control

| Role | Name | Title | Signature | Date |
|------|------|-------|-----------|------|
| Author | [NAME] | [TITLE] | _____________ | __________ |
| Reviewer | [NAME] | [TITLE] | _____________ | __________ |
| QA Approval | [NAME] | [TITLE] | _____________ | __________ |
| IT Approval | [NAME] | [TITLE] | _____________ | __________ |
| System Owner | [NAME] | [TITLE] | _____________ | __________ |

### Revision History

| Version | Date | Author | Description of Change |
|---------|------|--------|----------------------|
| 0.1 | [DATE] | [AUTHOR] | Initial draft |
| 1.0 | [DATE] | [AUTHOR] | Released for implementation |

### Distribution List

| Name | Department | Role |
|------|------------|------|
| [NAME] | [DEPARTMENT] | [ROLE] |
| [NAME] | [DEPARTMENT] | [ROLE] |
| [NAME] | [DEPARTMENT] | [ROLE] |

---

## 1. Introduction

### 1.1 Purpose

This procedure defines the processes and responsibilities for managing changes to computerized systems in a controlled manner to ensure:
- System integrity is maintained
- Changes are properly evaluated, documented, tested, and approved
- Data integrity is protected throughout the change process
- Continued compliance with regulatory requirements
- System availability and performance meet business requirements

### 1.2 Scope

This procedure applies to all changes to validated computerized systems used in GxP-regulated activities, including:

- Hardware changes
- Software changes (including upgrades, patches, and configuration changes)
- Infrastructure changes (network, servers, etc.)
- Interface changes with other systems
- Data migration activities
- Security-related changes
- Documentation changes

**System Boundaries:**
- In Scope: [LIST IN-SCOPE SYSTEMS]
- Out of Scope: [LIST OUT-OF-SCOPE SYSTEMS]

### 1.3 Regulatory Framework

This procedure is designed to ensure compliance with the following regulatory requirements:

#### 1.3.1 21 CFR Part 11 (Electronic Records/Electronic Signatures)

Specifically addressing:
- Section 11.10(a): Validation of systems to ensure accuracy, reliability, consistent intended performance
- Section 11.10(b): Ability to generate accurate and complete copies of records
- Section 11.10(k): Appropriate controls over systems documentation

#### 1.3.2 EU Annex 11 (Computerized Systems)

Specifically addressing:
- Section 1: Risk Management
- Section 9: Change Control
- Section 10: Periodic Evaluation
- Section 11: Security

#### 1.3.3 GAMP 5 Guidance

Following Good Automated Manufacturing Practice (GAMP) 5 principles for:
- Risk-based approach to computerized system compliance and validation
- Change management principles
- Configuration management
- Supplier management

#### 1.3.4 Other Applicable Regulations and Standards

- [LIST OTHER APPLICABLE REGULATIONS]
- [COMPANY-SPECIFIC POLICIES]

---

## 2. Roles and Responsibilities

### 2.1 Role Definitions

| Role | Responsibilities |
|------|------------------|
| Change Requester | - Initiates change request<br>- Provides business justification<br>- Provides detailed description of the requested change |
| System Owner | - Evaluates business impact of change<br>- Approves or rejects change request<br>- Ensures appropriate testing and validation<br>- Ensures user training as required |
| IT/Technical Support | - Evaluates technical impact of change<br>- Develops technical implementation plan<br>- Implements approved changes<br>- Conducts technical testing |
| Quality Assurance | - Reviews change requests for compliance impact<br>- Ensures appropriate validation documentation<br>- Approves or rejects changes based on compliance requirements<br>- Conducts periodic audits of change management process |
| Change Control Board (CCB) | - Reviews complex or high-risk changes<br>- Makes final approval decisions for significant changes<br>- Ensures cross-functional evaluation of changes |
| Validation Team | - Develops validation strategy for changes<br>- Executes validation activities<br>- Documents validation results |
| End Users | - Provides input on user requirements<br>- Participates in user acceptance testing<br>- Completes training on implemented changes |

### 2.2 Change Control Board (CCB) Composition

The Change Control Board consists of representatives from:
- IT Department
- Quality Assurance
- Regulatory Affairs
- System Owner/Business Representative
- Validation
- Other stakeholders as appropriate for specific changes

The CCB meets [FREQUENCY, e.g., "weekly"] to review change requests, or more frequently if needed for urgent changes.

### 2.3 Responsibility Matrix

| Activity | Change Requester | System Owner | IT/Technical | QA | CCB | Validation | End Users |
|----------|------------------|--------------|--------------|----|----|-----------|-----------|
| Initiate Change Request | R | C | C | I | I | I | C |
| Change Classification | I | R | C | R | A | C | I |
| Impact Assessment | C | R | R | R | A | R | C |
| Change Approval | I | R | R | R | A | C | I |
| Implementation Planning | I | A | R | C | I | C | I |
| Testing | I | A | R | W | I | R | C |
| Documentation | I | A | C | R | I | R | I |
| Implementation | I | A | R | W | I | C | I |
| Post-Implementation Review | C | R | R | R | A | R | C |

*Legend: R = Responsible, A = Accountable, C = Consulted, I = Informed, W = Witness*

---

## 3. Change Classification and Assessment

### 3.1 Change Types

Changes are categorized by type to determine the appropriate level of review, documentation, and testing:

#### 3.1.1 Hardware Changes

- Server replacements or upgrades
- Storage system changes
- Network infrastructure changes
- Peripheral equipment changes
- Physical location changes

#### 3.1.2 Software Changes

- Operating system upgrades or patches
- Application software upgrades
- Database version upgrades
- Custom code modifications
- Configuration changes
- Report modifications

#### 3.1.3 Infrastructure Changes

- Network topology changes
- Virtualization changes
- Cloud infrastructure changes
- Backup system changes
- Security infrastructure changes

#### 3.1.4 Data-Related Changes

- Database schema changes
- Data migrations
- Data archiving activities
- Data recovery operations

#### 3.1.5 Documentation Changes

- Procedural updates
- User manual updates
- Training material updates
- Validation documentation updates

### 3.2 Change Impact Levels

Changes are classified by impact level to determine the appropriate approval path and validation approach:

#### 3.2.1 Level 1 (Low Impact)

- No impact on regulated data or functionality
- No impact on system validation status
- Examples: Documentation updates, cosmetic changes, adding users with existing roles

#### 3.2.2 Level 2 (Medium Impact)

- Limited impact on regulated data or functionality
- Limited impact on system validation status
- Examples: Minor configuration changes, non-critical patches, report format changes

#### 3.2.3 Level 3 (High Impact)

- Significant impact on regulated data or functionality
- Significant impact on system validation status
- Examples: Major version upgrades, database schema changes, interface modifications

#### 3.2.4 Level 4 (Critical Impact)

- Major impact on regulated data or functionality
- Major impact on system validation status
- Examples: System replacements, major architectural changes, data migrations

### 3.3 Change Risk Assessment

Each change must undergo a risk assessment to evaluate potential impacts on:

#### 3.3.1 Risk Assessment Factors

- Patient Safety
- Product Quality
- Data Integrity
- Regulatory Compliance
- Business Continuity
- System Performance
- System Security
- Integration with Other Systems

#### 3.3.2 Risk Assessment Matrix

| Risk Level | Description | Examples | Required Actions |
|------------|-------------|----------|------------------|
| Low | Minimal risk to system, data, compliance | Documentation updates, adding user accounts | - Standard change process<br>- Basic testing<br>- QA review |
| Medium | Moderate risk to system, data, compliance | Minor configuration changes, non-critical patches | - Detailed impact assessment<br>- Functional testing<br>- QA approval |
| High | Significant risk to system, data, compliance | Software upgrades, interface changes | - Comprehensive impact assessment<br>- Extensive testing<br>- Validation update<br>- CCB approval |
| Critical | Major risk to system, data, compliance | System replacement, data migration | - Full risk assessment<br>- Comprehensive validation<br>- Extensive testing<br>- Senior management approval |

#### 3.3.3 Risk Assessment Worksheet

The risk assessment worksheet (see Appendix A) must be completed for all Level 2, 3, and 4 changes and should address:

- Identification of risks
- Evaluation of impact and probability
- Risk mitigation strategies
- Residual risk assessment
- Testing requirements to address risks

---

## 4. Change Request Process

### 4.1 Change Request Initiation

#### 4.1.1 Change Request Form

All changes must be documented using the approved Change Request Form (see Appendix B), which includes:

- Change requester information
- System identification
- Detailed description of the proposed change
- Business justification
- Requested implementation timeline
- Preliminary impact assessment
- Supporting documentation

#### 4.1.2 Emergency Change Request

For emergency situations requiring immediate action:

- The Emergency Change Request form must be used
- Verbal approval from System Owner and QA may be obtained
- Documentation must be completed retrospectively within 24 hours
- Post-implementation review must be conducted

### 4.2 Change Request Submission

Change requests must be submitted to:

- System Owner for initial review
- Change Control Coordinator for logging and tracking
- Quality Assurance for compliance review

### 4.3 Change Request Tracking

All change requests will be:

- Assigned a unique tracking number (format: CR-[SYSTEM]-[YEAR]-[SEQUENTIAL NUMBER])
- Recorded in the Change Control Log
- Tracked through to completion or rejection
- Reported on in regular change management metrics

### 4.4 Change Request States

| State | Description | Next Actions |
|-------|-------------|--------------|
| Draft | Change request in preparation | Complete required fields, submit for review |
| Submitted | Change request formally submitted | Initial review, classification, assignment |
| In Review | Under evaluation by stakeholders | Complete impact assessment, risk analysis |
| Approved | Change approved for implementation | Develop implementation plan, schedule change |
| Rejected | Change not approved | Document rejection reasons, notify requester |
| Implementing | Change being implemented | Complete testing, update documentation |
| Implemented | Change has been completed | Conduct post-implementation review |
| Closed | All activities completed | N/A |
| Cancelled | Change request withdrawn | Document cancellation reasons |

---

## 5. Impact Analysis

### 5.1 Impact Analysis Requirements

A comprehensive impact analysis must be conducted for all changes. The analysis should address:

#### 5.1.1 System Impact

- Hardware components affected
- Software components affected
- Configuration settings affected
- Database structures affected
- Interfaces affected
- Reports affected
- Workflows affected

#### 5.1.2 Validation Impact

- User requirements affected
- Functional specifications affected
- Design specifications affected
- Test scripts affected
- Validation documentation affected
- Revalidation requirements

#### 5.1.3 Regulatory Impact

- Impact on compliance with 21 CFR Part 11
- Impact on compliance with EU Annex 11
- Impact on compliance with other applicable regulations
- Impact on data integrity controls
- Impact on audit trail
- Impact on electronic signatures

#### 5.1.4 Operational Impact

- User training requirements
- Procedural changes required
- Downtime requirements
- Business continuity considerations
- Rollback capabilities

#### 5.1.5 Data Impact

- Data migration requirements
- Data conversion requirements
- Data backup requirements
- Data verification requirements
- Historical data access

### 5.2 Impact Analysis Process

1. **Identify Affected Components**
   - Review system documentation
   - Consult with system administrators
   - Consult with vendor (if applicable)

2. **Evaluate Direct Impacts**
   - Immediate effects on system components
   - Required changes to connected systems

3. **Evaluate Indirect Impacts**
   - Downstream effects on other systems
   - Effects on business processes
   - Effects on reporting and analytics

4. **Document Findings**
   - Complete Impact Analysis Form (see Appendix C)
   - Attach supporting documentation
   - Include recommendations for testing scope

---

## 6. Testing Requirements

### 6.1 Test Plan Development

Based on the change classification and impact analysis, a test plan must be developed that includes:

#### 6.1.1 Test Plan Components

- Test objectives
- Test scope
- Test environment requirements
- Test data requirements
- Test cases
- Acceptance criteria
- Roles and responsibilities
- Test schedule
- Documentation requirements

#### 6.1.2 Test Types

Depending on the change, the following types of testing may be required:

| Test Type | Description | When Required |
|-----------|-------------|---------------|
| Unit Testing | Testing of individual components | All software changes |
| Integration Testing | Testing of interfaces between components | Changes affecting multiple components |
| Regression Testing | Testing to ensure existing functionality is not affected | All Level 2, 3, and 4 changes |
| Performance Testing | Testing system performance under load | Changes that may affect system performance |
| Security Testing | Testing security controls | Changes to security controls or authentication |
| User Acceptance Testing | Testing by end users | Changes affecting user functionality |
| Data Migration Testing | Testing data migration processes | Data migration activities |

### 6.2 Test Script Development

Test scripts must be developed to verify that:

- The change has been implemented correctly
- Existing functionality is not adversely affected
- Data integrity is maintained
- Regulatory compliance is maintained

Test scripts should include:

- Test ID and title
- Test objective
- Prerequisites
- Test steps
- Expected results
- Pass/fail criteria
- Actual results
- Tester signature and date
- Reviewer signature and date

### 6.3 Test Execution

Test execution must follow these principles:

- Tests must be executed according to approved test scripts
- Test execution must be documented
- Test evidence must be collected (screenshots, logs, etc.)
- Deviations must be documented and addressed
- Testing must be performed in a qualified test environment
- Test data must be controlled and representative

### 6.4 Test Results Documentation

Test results must be documented in a Test Summary Report that includes:

- Summary of tests executed
- Summary of test results (pass/fail)
- Summary of deviations and resolutions
- Test evidence (or references to evidence)
- Conclusion regarding acceptability of the change
- Recommendations for implementation
- Approvals

---

## 7. Documentation Requirements

### 7.1 Documentation Updates

The following documentation must be updated as applicable to reflect the change:

#### 7.1.1 System Documentation

- System specifications
- Functional specifications
- Design specifications
- Configuration specifications
- Interface specifications
- Network diagrams
- System architecture diagrams

#### 7.1.2 Validation Documentation

- Validation plan
- User requirements specification
- Functional requirements specification
- Design specification
- Traceability matrix
- Test scripts
- Validation summary report

#### 7.1.3 Operational Documentation

- Standard operating procedures
- Work instructions
- User manuals
- Training materials
- Backup and recovery procedures
- Business continuity procedures
- Disaster recovery procedures

### 7.2 Document Control

All documentation updates must follow document control procedures:

- Version control
- Review and approval
- Effective date
- Distribution control
- Archiving of superseded documentation

### 7.3 Documentation Requirements by Change Level

| Change Level | Documentation Requirements |
|--------------|----------------------------|
| Level 1 (Low) | - Change request<br>- Impact assessment<br>- Updated affected documentation<br>- Change implementation record |
| Level 2 (Medium) | - All Level 1 documentation<br>- Risk assessment<br>- Test plan and results<br>- Validation documentation updates |
| Level 3 (High) | - All Level 2 documentation<br>- Comprehensive impact analysis<br>- Detailed test plan and results<br>- Updated validation documentation<br>- Training records |
| Level 4 (Critical) | - All Level 3 documentation<br>- Full validation package updates<br>- Detailed implementation plan<br>- Rollback plan<br>- Post-implementation review report |

---

## 8. Review and Approval Process

### 8.1 Review Requirements

Each change request must undergo appropriate reviews based on the change classification:

#### 8.1.1 Technical Review

- Assessment of technical feasibility
- Assessment of technical risks
- Assessment of implementation approach
- Assessment of testing approach
- Assessment of rollback capabilities

#### 8.1.2 Quality Review

- Assessment of compliance impact
- Assessment of validation impact
- Assessment of documentation requirements
- Assessment of testing requirements
- Assessment of training requirements

#### 8.1.3 Business Review

- Assessment of business benefits
- Assessment of business risks
- Assessment of user impact
- Assessment of process impact
- Assessment of implementation timing

### 8.2 Approval Requirements

Approval requirements vary based on the change impact level:

| Change Level | Required Approvals |
|--------------|-------------------|
| Level 1 (Low) | - System Owner<br>- IT/Technical Support |
| Level 2 (Medium) | - System Owner<br>- IT/Technical Support<br>- Quality Assurance |
| Level 3 (High) | - System Owner<br>- IT/Technical Support<br>- Quality Assurance<br>- Change Control Board |
| Level 4 (Critical) | - System Owner<br>- IT/Technical Support<br>- Quality Assurance<br>- Change Control Board<br>- Senior Management |
| Emergency | - System Owner<br>- Quality Assurance<br>- Post-implementation CCB review |

### 8.3 Approval Process

1. **Initial Review**
   - Review of change request for completeness
   - Classification of change
   - Assignment to reviewers

2. **Stakeholder Reviews**
   - Technical review
   - Quality review
   - Business review
   - Documentation of review results

3. **Approval Decision**
   - Evaluation of review results
   - Decision to approve, reject, or request modifications
   - Documentation of approval decision
   - Communication of decision to stakeholders

4. **Approval Documentation**
   - Signatures on change request form
   - Minutes of CCB meeting (if applicable)
   - Documentation of any approval conditions

---

## 9. Implementation Planning

### 9.1 Implementation Plan Requirements

An implementation plan must be developed for all approved changes, including:

#### 9.1.1 Implementation Plan Components

- Implementation steps
- Implementation schedule
- Resource requirements
- Downtime requirements (if applicable)
- Communication plan
- Rollback plan
- Verification activities
- Success criteria

#### 9.1.2 Implementation Considerations

- System backup requirements
- User notification requirements
- Business impact minimization
- Timing considerations (e.g., off-hours implementation)
- Sequential implementation steps
- Checkpoints and verification steps
- Rollback decision criteria

### 9.2 Implementation Schedule

The implementation schedule should include:

- Preparation activities
- Backup activities
- Implementation activities
- Verification activities
- User notification timeframes
- Contingency timeframes (if rollback is required)

### 9.3 Rollback Plan

A rollback plan must be developed for all Level 2, 3, and 4 changes, including:

- Rollback triggers
- Rollback decision authority
- Rollback procedures
- Rollback verification
- Rollback notification
- Post-rollback actions

### 9.4 Implementation Approval

The implementation plan must be approved by:

- System Owner
- IT/Technical Support
- Quality Assurance (for Level 2, 3, and 4 changes)
- Change Control Board (for Level 3 and 4 changes)

---

## 10. Validation Requirements

### 10.1 Validation Approach

The validation approach for changes depends on the change classification and impact analysis:

#### 10.1.1 Validation Strategy Options

| Strategy | Description | When Applicable |
|----------|-------------|-----------------|
| Leverage Original Validation | Use original validation with specific testing for the change | Minor changes with limited impact |
| Targeted Validation | Validate specific affected components | Moderate changes with defined scope |
| Partial Revalidation | Revalidate affected modules or functions | Significant changes to specific areas |
| Full Revalidation | Complete system revalidation | Major changes with broad impact |

#### 10.1.2 Validation Documentation Updates

Based on the validation strategy, the following documentation may require updates:

- Validation plan
- User requirements specification
- Functional requirements specification
- Design specification
- Risk assessment
- Traceability matrix
- Test scripts
- Validation summary report

### 10.2 Validation Execution

Validation activities must be executed according to the validation plan, including:

- Test script execution
- Documentation of test results
- Collection of test evidence
- Documentation of deviations
- Resolution of deviations
- Documentation of validation summary

### 10.3 Validation Approval

Validation results must be reviewed and approved by:

- Validation Lead
- System Owner
- Quality Assurance
- IT/Technical Support (as applicable)
- Change Control Board (for Level 3 and 4 changes)

---

## 11. Post-Implementation Review

### 11.1 Post-Implementation Verification

Following implementation, a verification must be performed to confirm:

- The change was implemented correctly
- No unexpected issues have occurred
- System functionality meets requirements
- Data integrity is maintained
- Regulatory compliance is maintained
- Documentation is complete and accurate

### 11.2 Post-Implementation Review Process

The post-implementation review should include:

1. **Functional Verification**
   - Verification that the change functions as expected
   - Verification that existing functionality is not adversely affected

2. **Technical Verification**
   - Verification that technical implementation is correct
   - Verification that system performance is acceptable
   - Verification that interfaces function correctly

3. **Documentation Verification**
   - Verification that documentation updates are complete
   - Verification that training has been completed (if required)

4. **Compliance Verification**
   - Verification that regulatory compliance is maintained
   - Verification that data integrity is maintained
   - Verification that validation documentation is complete

### 11.3 Post-Implementation Review Report

A post-implementation review report must be prepared that includes:

- Summary of change implementation
- Results of post-implementation verification
- Issues encountered and resolutions
- Lessons learned
- Recommendations for future changes
- Conclusion regarding change success
- Approvals

### 11.4 Change Closure

Once the post-implementation review is complete and approved, the change request can be closed, including:

- Update of change request status to "Closed"
- Update of change control log
- Notification to stakeholders
- Archiving of change documentation

---

## 12. Special Change Types

### 12.1 Emergency Changes

#### 12.1.1 Emergency Change Criteria

Emergency changes are changes that require immediate implementation due to:

- System failure affecting critical business operations
- Security vulnerabilities requiring immediate remediation
- Regulatory issues requiring immediate resolution
- Data integrity issues requiring immediate resolution

#### 12.1.2 Emergency Change Process

1. **Initiation**
   - Complete Emergency Change Request Form
   - Obtain verbal approval from System Owner and Quality Assurance
   - Document verbal approval in the Emergency Change Log

2. **Implementation**
   - Implement the change following abbreviated procedures
   - Document implementation steps
   - Verify functionality
   - Notify stakeholders

3. **Post-Implementation Documentation**
   - Complete full change documentation within 24 hours
   - Submit for formal review and approval
   - Conduct retrospective impact assessment
   - Conduct retrospective risk assessment
   - Update validation documentation as required

4. **Review**
   - Change Control Board review at next scheduled meeting
   - Documentation of lessons learned
   - Identification of preventive actions for similar situations

### 12.2 Configuration Changes

#### 12.2.1 Configuration Change Types

- User access and permissions
- System parameters
- Report parameters
- Workflow configurations
- Interface configurations
- Security configurations

#### 12.2.2 Configuration Change Process

1. **Documentation**
   - Document current configuration
   - Document requested configuration change
   - Document justification for change
   - Document impact assessment

2. **Approval**
   - Obtain appropriate approvals based on configuration type
   - Document approval in Configuration Change Log

3. **Implementation**
   - Implement configuration change
   - Document implementation details
   - Verify configuration change
   - Update configuration documentation

4. **Verification**
   - Verify functionality with new configuration
   - Document verification results

### 12.3 Data Migration Changes

#### 12.3.1 Data Migration Planning

Data migration changes require special planning, including:

- Source data analysis
- Target data structure analysis
- Data mapping
- Data transformation rules
- Data validation rules
- Reconciliation approach
- Rollback strategy

#### 12.3.2 Data Migration Process

1. **Preparation**
   - Create data migration plan
   - Develop data migration scripts/tools
   - Prepare test data
   - Conduct test migration
   - Verify test results
   - Update plan based on test results

2. **Execution**
   - Backup source data
   - Execute data migration
   - Verify data completeness
   - Verify data accuracy
   - Reconcile data
   - Document migration results

3. **Validation**
   - Validate migrated data against source data
   - Validate data integrity
   - Validate system functionality with migrated data
   - Document validation results

4. **Closure**
   - Obtain approval of migration results
   - Update system documentation
   - Update data dictionaries
   - Close data migration change request

---

## 13. Training Requirements

### 13.1 Training Needs Assessment

For each change, a training needs assessment must be conducted to determine:

- Who requires training
- What training is required
- How training will be delivered
- When training will be provided
- How training effectiveness will be evaluated

### 13.2 Training Delivery

Training may be delivered through various methods, including:

- Classroom training
- Online training
- Self-paced training
- On-the-job training
- Documentation updates

### 13.3 Training Documentation

Training must be documented, including:

- Training materials
- Training attendance records
- Training completion records
- Training effectiveness evaluation

### 13.4 Training Verification

Prior to implementing a change in production, verification must be performed to ensure:

- Required training has been developed
- Required training has been delivered
- Training effectiveness has been evaluated
- Training documentation is complete

---

## 14. Change Management Metrics and Continuous Improvement

### 14.1 Change Management Metrics

The following metrics will be tracked to monitor the effectiveness of the change management process:

- Number of changes by type and impact level
- Change success rate
- Change implementation time
- Number of emergency changes
- Number of failed changes requiring rollback
- Number of changes with post-implementation issues
- Change backlog size and age

### 14.2 Periodic Review

The change management process will be reviewed periodically to identify:

- Process strengths
- Process weaknesses
- Improvement opportunities
- Training needs
- Documentation needs

### 14.3 Continuous Improvement

Continuous improvement activities include:

- Regular review of change management metrics
- Feedback collection from stakeholders
- Lessons learned from completed changes
- Process updates based on findings
- Training updates based on findings
- Documentation updates based on findings

---

## Appendices

### Appendix A: Risk Assessment Worksheet

[INCLUDE RISK ASSESSMENT WORKSHEET TEMPLATE]

### Appendix B: Change Request Form

[INCLUDE CHANGE REQUEST FORM TEMPLATE]

### Appendix C: Impact Analysis Form

[INCLUDE IMPACT ANALYSIS FORM TEMPLATE]

### Appendix D: Change Control Board Meeting Template

[INCLUDE CCB MEETING TEMPLATE]

### Appendix E: Emergency Change Request Form

[INCLUDE EMERGENCY CHANGE REQUEST FORM TEMPLATE]

### Appendix F: Post-Implementation Review Template

[INCLUDE POST-IMPLEMENTATION REVIEW TEMPLATE]

### Appendix G: Glossary

| Term | Definition |
|------|------------|
| CCB | Change Control Board |
| GAMP | Good Automated Manufacturing Practice |
| GxP | Good Practice regulations (GMP, GLP, GCP, etc.) |
| IQ | Installation Qualification |
| OQ | Operational Qualification |
| PQ | Performance Qualification |
| UAT | User Acceptance Testing |

### Appendix H: References

1. 21 CFR Part 11 - Electronic Records; Electronic Signatures
2. EU GMP Annex 11 - Computerized Systems
3. GAMP 5 - A Risk-Based Approach to Compliant GxP Computerized Systems
4. ISPE Good Practice Guide: IT Infrastructure Control and Compliance
5. [COMPANY POLICY REFERENCES]

---

*End of Computer System Change Control Procedure*
