# Clinical Data Management Plan Template

## Document Control Information

| Document Information | Details |
|---------------------|---------|
| Document Title | Clinical Data Management Plan |
| Version | 1.0 |
| Document ID | CDMP-[Study ID]-v1.0 |
| Effective Date | [Date] |
| Next Review Date | [Date] |

### Approval Signatures

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Clinical Data Manager | | | |
| Project Manager | | | |
| Biostatistician | | | |
| Medical Monitor | | | |
| Quality Assurance | | | |

### Revision History

| Version | Date | Author | Description of Changes |
|---------|------|--------|------------------------|
| 0.1 | [Date] | [Name] | Initial draft |
| 1.0 | [Date] | [Name] | Approved version |

## 1. Introduction and Purpose

### 1.1 Purpose of the Document
This Clinical Data Management Plan (CDMP) describes the procedures, processes, and systems to be used for the collection, tracking, management, and quality control of data for clinical study [Study ID]. The plan defines the standards and procedures to ensure that high-quality, reliable data are produced in compliance with ICH GCP, FDA, and EMA guidelines.

### 1.2 Scope
This CDMP applies to all data management activities conducted for [Study Name], Protocol [Protocol Number], from database setup through database lock and archiving.

### 1.3 Referenced Documents
- Study Protocol [Protocol Number], Version [X.X]
- Case Report Form (CRF) Completion Guidelines
- Data Validation Plan
- Statistical Analysis Plan
- ICH E6(R2) Good Clinical Practice
- FDA 21 CFR Part 11
- EMA/INS/GCP/454280/2010 GCP Compliance

## 2. Project Overview

### 2.1 Study Description

| Study Element | Description |
|---------------|-------------|
| Study Title | [Full Study Title] |
| Protocol Number | [Protocol Number] |
| Study Phase | [I, II, III, IV] |
| Study Design | [Design description: randomized, double-blind, etc.] |
| Number of Sites | [X] sites in [Y] countries |
| Estimated Number of Subjects | [Number] |
| Treatment Duration | [Duration] |
| Follow-up Period | [Duration] |
| Primary Endpoint(s) | [Description] |
| Secondary Endpoint(s) | [Description] |

### 2.2 Timeline

| Milestone | Planned Date | Actual Date | Status |
|-----------|--------------|-------------|--------|
| Protocol Finalization | [Date] | | |
| CRF Finalization | [Date] | | |
| Database Design | [Date] | | |
| Database Build | [Date] | | |
| First Patient First Visit | [Date] | | |
| Interim Analysis | [Date] | | |
| Last Patient Last Visit | [Date] | | |
| Database Lock | [Date] | | |
| Final Analysis | [Date] | | |

### 2.3 Team Organization and Responsibilities

| Role | Name | Responsibilities |
|------|------|------------------|
| Clinical Data Manager | [Name] | Overall data management activities, coordinating with other teams, ensuring data quality and integrity |
| Data Management Lead | [Name] | Day-to-day data management operations, query management, database maintenance |
| Database Programmer | [Name] | Database design, programming edit checks, generating reports |
| Clinical Programmer | [Name] | Programming datasets, developing and validating data transfers |
| Data Entry Personnel | [Name(s)] | Data entry (if applicable), query resolution support |
| Medical Coder | [Name] | Medical and medication coding activities |
| Biostatistician | [Name] | Statistical oversight, dataset specifications, data review |
| Project Manager | [Name] | Overall project oversight and coordination |

## 3. Data Management Systems and Tools

### 3.1 EDC System

| Element | Description |
|---------|-------------|
| EDC System Name | [e.g., Medidata Rave, Oracle Clinical, Veeva Vault EDC] |
| Version | [Version number] |
| Vendor | [Vendor name] |
| Validation Status | [Validated/In process] |
| System Administrator | [Name and contact information] |
| Access Control Administrator | [Name and contact information] |
| System Location | [Physical/cloud location of servers] |
| Backup Frequency | [Frequency] |
| Contingency Plan | [Reference to contingency plan document] |

#### 3.1.1 System Validation

Brief description of the validation approach for the EDC system. Reference to validation documentation.

Example:
```
The EDC system has been validated according to GAMP 5 guidelines and 21 CFR Part 11 requirements. The validation includes Installation Qualification (IQ), Operational Qualification (OQ), and Performance Qualification (PQ). Validation documentation is stored in [location].
```

### 3.2 Clinical Data Management System (CDMS)

| Element | Description |
|---------|-------------|
| CDMS Name | [e.g., Oracle Clinical, Clintrial] |
| Version | [Version number] |
| Vendor | [Vendor name] |
| Primary Functions | [List of functions: data review, query management, etc.] |
| Validation Status | [Validated/In process] |
| System Administrator | [Name and contact information] |

### 3.3 Data Integration Tools

| Tool Name | Purpose | Integration Points | Format |
|-----------|---------|-------------------|--------|
| [Tool 1] | [e.g., Lab data integration] | [From lab system to EDC] | [XML, CSV, etc.] |
| [Tool 2] | [e.g., ePRO data integration] | [From ePRO system to EDC] | [XML, CSV, etc.] |
| [Tool 3] | [e.g., IWRS data integration] | [From IWRS to EDC] | [XML, CSV, etc.] |

#### 3.3.1 Integration Validation

Approach for validating data integrations, including test plans and documentation.

Example:
```
Each data integration will be validated by:
1. Developing detailed specifications for each integration point
2. Creating test data sets and expected results
3. Executing test cases with test data
4. Comparing actual results with expected results
5. Documenting any discrepancies and their resolution
6. Formal sign-off on the validation testing
```

## 4. Data Collection and Entry

### 4.1 CRF Design

| CRF Element | Description |
|-------------|-------------|
| CRF Format | [Electronic/Paper/Hybrid] |
| CRF Developer | [Name/Role] |
| CRF Reviewer(s) | [Names/Roles] |
| CRF Approval Date | [Date] |
| CRF Modules | [List of CRF modules/forms] |
| CRF Completion Guidelines | [Reference to guidelines document] |

#### 4.1.1 CRF Design Process

Outline of the CRF design process, including review cycles and approval workflow.

Example:
```
The CRF design process follows these steps:
1. Initial draft based on protocol requirements
2. Review by biostatistician for statistical needs
3. Review by medical monitor for clinical relevance
4. Review by data management for operational feasibility
5. UAT with site representatives
6. Final approval by [roles]
7. Implementation in EDC system
```

#### 4.1.2 CRF Standards

Standards used in CRF design (e.g., CDASH, sponsor-specific standards).

### 4.2 Data Entry Guidelines

#### 4.2.1 Data Entry Conventions

| Convention | Standard |
|------------|----------|
| Dates | [Format, e.g., DD-MMM-YYYY] |
| Partial Dates | [Handling convention] |
| Times | [Format, e.g., 24-hour clock] |
| Unknown Data | [Coding convention, e.g., UNK, NK] |
| Not Applicable Data | [Coding convention, e.g., NA, N/A] |
| Missing Data | [Handling convention] |
| Text Fields | [Character limitations, special character handling] |
| Units | [Standard units used, conversion methods] |

#### 4.2.2 Data Entry Process

For paper CRFs (if applicable):
- Data entry methodology (single/double entry)
- Timeframes for data entry after receipt
- Discrepancy handling process

For electronic CRFs:
- Timeframes for data entry after patient visit
- Guidance on real-time entry vs. transcription
- Use of electronic signatures

Example:
```
For electronic data capture:
• Sites must enter data within 5 business days of the subject visit
• Source data verification will be performed according to the monitoring plan
• Electronic signatures will be applied by the investigator to signify review and approval of the data
```

### 4.3 Source Data Verification

| SDV Element | Approach |
|-------------|----------|
| SDV Level | [100%, Risk-based, Targeted] |
| SDV Strategy | [Description of approach] |
| Critical Data Points | [List of data points requiring 100% SDV] |
| SDV Documentation | [Process for documenting SDV] |

#### 4.3.1 Remote SDV/SDR Procedures

Procedures for remote source data verification/review, if applicable.

## 5. Data Quality Procedures

### 5.1 Edit Checks

| Edit Check Type | Purpose | Implementation Timing |
|-----------------|---------|------------------------|
| Range Checks | Ensure values fall within predefined ranges | [During entry/Batch] |
| Logic Checks | Ensure logical consistency between related data points | [During entry/Batch] |
| Missing Data Checks | Identify required data that is missing | [During entry/Batch] |
| Consistency Checks | Cross-form validation to ensure data consistency | [Batch processing] |
| Visit Schedule Checks | Ensure visits occur within protocol windows | [Batch processing] |

#### 5.1.1 Edit Check Specifications

Process for developing, documenting, testing, and implementing edit checks.

Example:
```
Edit check specifications will be documented in the Data Validation Plan and will include:
• Check ID
• Description
• Associated CRF field(s)
• Check logic
• Error message
• Query text
• Priority/severity
```

#### 5.1.2 Edit Check Testing

Methodology for testing edit checks before implementation.

### 5.2 Data Validation Plan

| Validation Element | Description |
|---------------------|-------------|
| Validation Plan Location | [File location/document reference] |
| Validation Frequency | [e.g., Daily, Weekly] |
| Validation Documentation | [Process for documenting validation results] |

#### 5.2.1 Manual Review Procedures

Procedures for manual review of data, including:
- Listings review
- Patient profile review
- Review of external data

#### 5.2.2 Self-Evident Corrections

Policy and procedures for implementing self-evident corrections (if applicable).

Example:
```
Self-evident corrections may be applied to the following data points without site confirmation:
• Obvious spelling errors in free text fields that do not change the medical meaning
• Format corrections for dates and times that do not change the actual date/time
• All self-evident corrections will be documented in [location] and will include the original value, corrected value, justification, and person making the correction
```

### 5.3 Query Management

| Query Element | Process |
|---------------|---------|
| Query Generation | [Automatic/Manual/Both] |
| Query Prioritization | [Process for prioritizing queries] |
| Query Assignment | [Process for assigning queries to sites/team members] |
| Response Timeframes | [Expected timeframes for query resolution] |
| Escalation Process | [Process for escalating unresolved queries] |

#### 5.3.1 Query Lifecycle

Detailed description of the query lifecycle from generation to resolution.

Example:
```
The query lifecycle includes the following states:
1. OPEN - Initial query state when generated
2. ANSWERED - Site has provided a response but not yet reviewed by DM
3. RESOLVED - Response accepted and query closed
4. CANCELLED - Query determined to be invalid
5. REISSUED - Response not accepted, query sent back to site

All query state changes are tracked with user and timestamp.
```

#### 5.3.2 Query Tracking and Metrics

Process for tracking queries and calculating metrics.

Example metrics:
- Number of queries generated by form/field
- Average time to resolution
- Queries by site/country
- Percentage of data queried

### 5.4 Data Review

| Review Type | Frequency | Responsible Party | Documentation |
|-------------|-----------|-------------------|---------------|
| Ongoing Data Review | [Weekly/Biweekly] | [Role] | [Location of documentation] |
| Patient Profiles Review | [Monthly/Quarterly] | [Role] | [Location of documentation] |
| Medical Review | [Monthly/Quarterly] | [Role] | [Location of documentation] |
| Statistical Review | [Prior to interim/final analysis] | [Role] | [Location of documentation] |

#### 5.4.1 Data Review Meetings

Schedule and procedures for data review meetings.

Example:
```
Data review meetings will be held biweekly with the following participants:
• Clinical Data Manager
• Medical Monitor
• Biostatistician
• Project Manager
• Clinical Operations Lead

Standing agenda items include:
1. Review of data metrics and trends
2. Discussion of problematic data issues
3. Review of queries older than 30 days
4. Action items from previous meetings
```

## 6. Coding Procedures

### 6.1 Medical Coding (MedDRA)

| Coding Element | Standard |
|----------------|----------|
| Dictionary | MedDRA |
| Version | [e.g., 24.0] |
| Coding Tool | [e.g., MedDRA Browser, TMS] |
| Coding Frequency | [e.g., Weekly] |
| Coder Qualifications | [Required qualifications] |
| Coding Review Process | [Description of review process] |
| Coding Guidelines | [Reference to coding guidelines document] |

#### 6.1.1 Verbatim Term Collection

Procedures for collecting verbatim terms.

Example:
```
Sites will be instructed to:
• Record verbatim terms in the source and CRF exactly as reported by the subject
• Avoid using abbreviations in verbatim terms
• Include onset date, end date, and severity for all adverse events
• Include diagnosis when known, rather than just symptoms
```

#### 6.1.2 Coding Workflow

Description of the coding workflow from term entry to final coded term.

Example:
```
The medical coding workflow consists of:
1. Initial auto-coding of terms with exact matches in the dictionary
2. Manual review of terms without exact matches
3. Selection of appropriate LLT based on coding guidelines
4. Quality check by second coder for manually coded terms
5. Medical review of complex or ambiguous terms
6. Documentation of coding decisions for terms requiring interpretation
```

#### 6.1.3 Coding Consistency

Procedures to ensure coding consistency.

Example:
```
To ensure coding consistency:
• A study-specific synonym list will be maintained
• Periodic reviews of synonym consistency will be conducted
• Coding decisions for difficult terms will be documented in a coding log
• Updates to the MedDRA dictionary will be evaluated for impact on previously coded terms
```

### 6.2 Drug Coding (WHO Drug)

| Coding Element | Standard |
|----------------|----------|
| Dictionary | WHO Drug Dictionary |
| Version | [e.g., March 2023] |
| Format | [e.g., B3/C3] |
| Coding Tool | [e.g., WHODrug Browser, TMS] |
| Coding Frequency | [e.g., Weekly] |
| Coder Qualifications | [Required qualifications] |
| Coding Review Process | [Description of review process] |
| Coding Guidelines | [Reference to coding guidelines document] |

#### 6.2.1 Medication Information Collection

Procedures for collecting medication information.

Example:
```
Sites will be instructed to collect:
• Brand name (if known) and generic name
• Indication
• Dose, frequency, and route of administration
• Start and end dates
• Complete information for combination products
```

#### 6.2.2 Coding Approach

Approach to medication coding.

Example:
```
Medications will be coded to:
• Preferred name
• ATC classification
• Drug class

Coding priority will be:
1. Exact match on trade name
2. Exact match on generic name
3. Match on active ingredient
```

## 7. Database Management

### 7.1 Database Design

| Database Element | Description |
|------------------|-------------|
| Database Platform | [e.g., Oracle, SQL Server] |
| Database Structure | [Description of structure] |
| Database Design Documentation | [Reference to documentation] |
| Database Design Approvers | [Roles responsible for approval] |

#### 7.1.1 Database Design Process

Description of the database design process.

Example:
```
The database design process includes:
1. Creation of database design specifications based on CRF
2. Review of specifications by data management, biostatistics, and programming
3. Implementation of database structure
4. Unit testing of individual tables and relationships
5. Integration testing of complete database
6. User acceptance testing
7. Final approval and release
```

### 7.2 User Access Control

| Access Control Element | Description |
|------------------------|-------------|
| Access Request Process | [Description of process] |
| Access Levels | [List of access levels and permissions] |
| Access Review Frequency | [e.g., Quarterly] |
| Deactivation Process | [Process for deactivating access] |
| Training Requirements | [Training required before access granted] |

#### 7.2.1 User Role Matrix

Example user role matrix:

| Role | View Data | Enter Data | Edit Data | Create Queries | Resolve Queries | Run Reports | System Admin |
|------|-----------|------------|-----------|----------------|-----------------|-------------|--------------|
| Investigator | ✓ | ✓ | ✓ | | ✓ | | |
| Study Coordinator | ✓ | ✓ | ✓ | | ✓ | | |
| Monitor | ✓ | | | ✓ | | ✓ | |
| Data Manager | ✓ | | ✓ | ✓ | ✓ | ✓ | |
| System Admin | ✓ | | ✓ | ✓ | ✓ | ✓ | ✓ |

### 7.3 Database Validation

| Validation Element | Description |
|---------------------|-------------|
| Validation Approach | [e.g., GAMP 5] |
| Validation Documentation | [Reference to documentation] |
| Validation Environment | [Description of validation environment] |
| Production Release Process | [Process for releasing to production] |

#### 7.3.1 Testing Types

Description of testing types used for database validation.

Example:
```
Database validation includes:
• Unit testing of individual components
• Integration testing of related components
• System testing of complete system
• User acceptance testing with end users
• Regression testing after any changes

Each test includes:
• Test ID
• Test objective
• Test steps
• Expected results
• Actual results
• Pass/fail status
• Tester and date
```

### 7.4 Database Lock Procedures

| Lock Element | Process |
|--------------|---------|
| Pre-lock Activities | [List of activities required before lock] |
| Lock Readiness Checklist | [Reference to checklist] |
| Lock Approval Process | [Description of approval process] |
| Lock Execution Process | [Description of execution process] |
| Unlock Process | [Process for unlocking if required] |

#### 7.4.1 Database Lock Checklist

Example database lock checklist items:

```
□ All patients have completed the study or discontinued
□ All CRFs have been received and entered
□ All queries have been resolved and closed
□ All external data has been received and reconciled
□ All SAEs have been reconciled with safety database
□ All coding has been completed and approved
□ All protocol deviations have been documented and categorized
□ Statistical analysis datasets have been validated
□ Quality control checks have been completed
□ Database lock authorization has been obtained from all required parties
```

#### 7.4.2 Post-Lock Activities

Activities to be performed after database lock.

Example:
```
After database lock:
1. Generate the final SAS datasets for analysis
2. Archive the database according to archiving procedures
3. Produce a database lock report including:
   • Date and time of lock
   • Individuals present for lock
   • Any issues encountered during lock
   • Final database metrics
4. Distribute locked datasets to statisticians
5. Update study tracking systems with lock date
```

## 8. Data Security and Privacy

### 8.1 Data Protection Measures

| Protection Element | Implementation |
|--------------------|----------------|
| Physical Security | [Description of physical security measures] |
| Network Security | [Description of network security measures] |
| Application Security | [Description of application security measures] |
| Data Encryption | [Description of encryption methods] |
| Access Controls | [Description of access controls] |

#### 8.1.1 Regulatory Compliance

Compliance with applicable regulations.

Example:
```
Data protection measures comply with:
• 21 CFR Part 11
• GDPR requirements
• HIPAA (for US sites)
• ICH GCP E6(R2)
• Local data protection regulations in participating countries
```

### 8.2 Backup Procedures

| Backup Element | Process |
|----------------|---------|
| Backup Frequency | [e.g., Daily, Hourly] |
| Backup Type | [e.g., Full, Incremental] |
| Backup Location | [On-site/Off-site/Cloud] |
| Backup Retention | [Duration] |
| Backup Verification | [Process for verifying backups] |
| Disaster Recovery Plan | [Reference to plan] |

#### 8.2.1 Recovery Testing

Procedures for testing backup recovery.

Example:
```
Recovery testing will be performed:
• Quarterly for the EDC system
• After any major system upgrade
• As part of the annual disaster recovery drill

Testing will include:
1. Restoration of database to test environment
2. Verification of data integrity
3. Verification of application functionality
4. Documentation of recovery time
5. Documentation of any issues encountered
```

### 8.3 Audit Trail

| Audit Trail Element | Description |
|---------------------|-------------|
| Scope | [What events are captured in audit trail] |
| Information Captured | [User ID, timestamp, old value, new value, reason] |
| Audit Trail Review | [Process and frequency for review] |
| Audit Trail Protection | [Measures to protect audit trail] |

#### 8.3.1 Audit Trail Reports

Description of available audit trail reports.

Example:
```
The following audit trail reports are available:
• Data change report - All changes to data values
• User activity report - Activity by user
• System access report - Login/logout activity
• Query management report - Changes to query status
• Form status report - Changes to form status
```

## 9. Data Transfer and Archival

### 9.1 Transfer Specifications

| Transfer Element | Specification |
|------------------|---------------|
| Data Transfer Format | [e.g., SAS datasets, CSV, XML] |
| Transfer Frequency | [e.g., One-time, Periodic] |
| Transfer Method | [e.g., SFTP, Secure portal] |
| Transfer Validation | [Process for validating transfers] |
| Transfer Documentation | [Documentation required] |

#### 9.1.1 External Data Transfers

Procedures for handling external data transfers.

Example:
```
For laboratory data transfers:
1. Lab data specifications will be defined in a lab transfer specification document
2. Test transfers will be conducted before study start
3. Lab data will be transferred weekly via secure FTP
4. Each transfer will include:
   • All new data since last transfer
   • Any corrections to previously transferred data
5. Data management will validate each transfer within 2 business days
6. Discrepancies will be communicated to the lab within 1 business day
```

### 9.2 Archive Requirements

| Archive Element | Requirement |
|-----------------|-------------|
| Archive Timing | [When archiving will occur] |
| Archive Format | [Format of archived data] |
| Archive Media | [Media used for archiving] |
| Archive Location | [Physical/virtual location] |
| Retention Period | [Duration of retention] |
| Access Controls | [Controls for archived data] |

#### 9.2.1 Archive Contents

List of contents to be included in the archive.

Example:
```
The study archive will include:
• Raw CRF data
• External data (labs, ECG, imaging, etc.)
• Final database extracts
• Data management documentation
  - Clinical Data Management Plan
  - Data Validation Plan
  - Database specifications
  - CRF design specifications
  - Edit check specifications
  - Coding guidelines
• Metadata including audit trails
• System configuration information
• User access information
```

## 10. Quality Control and Monitoring

### 10.1 Quality Control Procedures

| QC Element | Process |
|------------|---------|
| QC Sample Size | [e.g., 10% of all data] |
| QC Selection Method | [e.g., Random, Targeted] |
| QC Timing | [e.g., Ongoing, Pre-lock] |
| QC Documentation | [How QC activities are documented] |
| Error Rate Thresholds | [Acceptable error rates] |

#### 10.1.1 QC Process

Detailed description of the QC process.

Example:
```
The QC process includes:
1. Selection of data for QC review
2. Independent review by qualified person not involved in primary data processing
3. Documentation of all discrepancies identified
4. Root cause analysis of systematic issues
5. Correction of identified issues
6. Determination if expanded QC is needed based on error rates
7. Documentation of QC results
```

### 10.2 Performance Metrics

| Metric | Target | Calculation Method | Reporting Frequency |
|--------|--------|-------------------|---------------------|
| Data Entry Lag | < 5 days | Date of entry - Date of visit | Weekly |
| Query Response Time | < 7 days | Date of response - Date of query | Weekly |
| Query Rate | < 10% | # queries / # data points | Monthly |
| Error Rate | < 0.5% | # errors / # data points checked | Monthly |
| Missing Data Rate | < 2% | # missing / # expected | Monthly |
| Database Lock Timing | Within 4 weeks of LPLV | Date of lock - Date of LPLV | Study end |

#### 10.2.1 Metrics Reporting

Process for reporting and reviewing metrics.

Example:
```
Performance metrics will be:
• Calculated by the data management team
• Reviewed during biweekly team meetings
• Distributed to the study team monthly
• Included in quarterly project review meetings
• Used to identify trends and areas for improvement
```

### 10.3 Issue Management

| Issue Management Element | Process |
|--------------------------|---------|
| Issue Identification | [How issues are identified] |
| Issue Documentation | [How issues are documented] |
| Issue Categorization | [Categories of issues] |
| Issue Resolution | [Process for resolving issues] |
| Impact Assessment | [How impact is assessed] |

#### 10.3.1 Issue Escalation

Process for escalating critical issues.

Example:
```
Issues will be escalated according to:

Severity Level 1 (Critical):
• Data integrity issues affecting primary endpoints
• System outages affecting multiple sites
• Security breaches
Escalate to: Project Director, Medical Director, QA immediately

Severity Level 2 (Major):
• Issues affecting secondary endpoints
• Significant data inconsistencies
• Recurring site issues
Escalate to: Project Manager within 24 hours

Severity Level 3 (Minor):
• Isolated data issues
• Non-critical process deviations
• Minor system issues
Manage within data management team, report in regular meetings
```

## 11. References

1. ICH E6(R2): Good Clinical Practice
2. FDA 21 CFR Part 11: Electronic Records; Electronic Signatures
3. FDA Guidance for Industry: Computerized Systems Used in Clinical Investigations
4. EMA Reflection Paper on Expectations for Electronic Source Data and Data Transcribed to Electronic Data Collection Tools in Clinical Trials
5. CDISC Standards (CDASH, SDTM, ADaM)
6. [Study Protocol Number and Version]
7. [Organization's SOPs related to Data Management]

## 12. Appendices

### Appendix A: Glossary of Terms

| Term | Definition |
|------|------------|
| ADaM | Analysis Data Model |
| AE | Adverse Event |
| CDASH | Clinical Data Acquisition Standards Harmonization |
| CRF | Case Report Form |
| EDC | Electronic Data Capture |
| GCP | Good Clinical Practice |
| LPLV | Last Patient Last Visit |
| MedDRA | Medical Dictionary for Regulatory Activities |
| QC | Quality Control |
| SDTM | Study Data Tabulation Model |

### Appendix B: CRF Completion Guidelines

[Reference to or include CRF completion guidelines]

### Appendix C: Data Validation Plan

[Reference to or include data validation plan]

### Appendix D: Edit Check Specifications

[Reference to or include edit check specifications]

### Appendix E: Query Management Process Flow

[Include a visual diagram of the query management process]

### Appendix F: Database Lock Checklist

[Reference to or include detailed database lock checklist]
