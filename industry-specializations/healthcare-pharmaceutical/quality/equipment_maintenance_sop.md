# Equipment Maintenance SOP Template

## Document Control

**Document Number:** EQ-MAINT-SOP-001  
**Effective Date:** [DATE]  
**Version:** 1.0  
**Supersedes:** N/A  

### Approval Matrix

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Author | [Name] | | |
| Quality Assurance | [Name] | | |
| Engineering Manager | [Name] | | |
| Operations Manager | [Name] | | |
| Quality Control Manager | [Name] | | |

### Document History

| Version | Date | Description of Change | Author |
|---------|------|------------------------|--------|
| 1.0 | [DATE] | Initial release | [Name] |

### Distribution List

| Department/Role | Copy Number |
|-----------------|-------------|
| Quality Assurance | 01 |
| Engineering | 02 |
| Manufacturing | 03 |
| Quality Control | 04 |
| Validation | 05 |

## 1. Purpose and Scope

### 1.1 Purpose

This Standard Operating Procedure (SOP) establishes a standardized methodology for the maintenance of equipment used in GMP operations to ensure consistent performance, compliance with regulatory requirements, and extended equipment lifecycle.

### 1.2 Scope

This SOP applies to all equipment used in the manufacturing, testing, packaging, and storage of pharmaceutical products, including:
- Production equipment
- Laboratory instruments and equipment
- Utilities and facility systems critical to GMP operations
- Monitoring and control systems

This SOP covers all maintenance activities including preventive maintenance, predictive maintenance, corrective maintenance, calibration, and qualification activities.

### 1.3 Regulatory References

- 21 CFR Part 211.67 - Equipment Cleaning and Maintenance
- 21 CFR Part 211.68 - Automatic, Mechanical, and Electronic Equipment
- 21 CFR Part 211.182 - Equipment Cleaning and Use Log
- EU GMP Annex 15 - Qualification and Validation
- ICH Q7 - Good Manufacturing Practice Guide for Active Pharmaceutical Ingredients
- ISO 13485:2016 - Medical Devices — Quality Management Systems
- WHO TRS 961, Annex 3 - WHO Good Manufacturing Practices for Pharmaceutical Products

## 2. Roles and Responsibilities

### 2.1 Site Head / Operations Manager
- Overall accountability for equipment maintenance program
- Providing necessary resources for effective implementation
- Reviewing and approving equipment maintenance strategies

### 2.2 Engineering/Maintenance Department
- Developing maintenance procedures and schedules
- Executing maintenance activities according to approved procedures
- Maintaining appropriate documentation and records
- Investigating equipment failures and implementing corrective actions
- Managing spare parts inventory
- Providing technical expertise and support

### 2.3 Quality Assurance
- Reviewing and approving maintenance procedures and schedules
- Conducting periodic audits of the maintenance program
- Ensuring compliance with GMP requirements
- Approving equipment release for production after major maintenance
- Reviewing maintenance documentation and trending data

### 2.4 Equipment Owners / Production Department
- Coordinating equipment availability for scheduled maintenance
- Reporting equipment issues promptly
- Performing and documenting operator-level maintenance tasks
- Maintaining daily equipment logs

### 2.5 Validation Department
- Evaluating maintenance impact on equipment qualification status
- Performing requalification activities when required
- Providing guidance on maintenance intervals based on qualification data

### 2.6 Quality Control
- Verifying calibration status of equipment before use
- Conducting equipment performance checks as required
- Supporting investigation of equipment-related deviations

## 3. Equipment Inventory Management

### 3.1 Equipment Classification and Criticality Assessment

Equipment shall be classified based on its criticality to product quality, process control, and operational continuity:

| Criticality Level | Definition | Examples | Maintenance Strategy |
|-------------------|------------|----------|----------------------|
| Critical (A) | Direct impact on product quality, safety, or potency | Sterilizers, Filling machines, HVAC systems for aseptic areas | Comprehensive PM, predictive maintenance, redundancy |
| Major (B) | Significant impact on process control or could affect product quality | Mixers, Mills, Packaging equipment, Water systems | Regular PM, selective predictive maintenance |
| Minor (C) | Minimal direct impact on product quality | General utilities, Warehousing equipment | Basic PM, primarily corrective maintenance |

### 3.2 Equipment Master Record

An Equipment Master Record shall be maintained for each piece of equipment, containing:

- Unique equipment identification number
- Description and specifications
- Manufacturer information and contact details
- Purchase date and warranty information
- Location and operational status
- GMP criticality classification
- Maintenance requirements and frequency
- Calibration requirements (if applicable)
- Qualification status and requirements
- Reference to operating procedures
- Historical maintenance records
- Parts list and recommended spare parts

### 3.3 Equipment Labeling and Identification

All equipment shall be clearly labeled with:

- Unique identification number
- Calibration status (if applicable)
- Maintenance status
- Next maintenance due date
- Any usage restrictions

### 3.4 Equipment Status Management

A system shall be established to track and communicate equipment status:

- Available for use
- Under maintenance
- Out of service
- Pending qualification
- Restricted use

## 4. Maintenance Program Types

### 4.1 Preventive Maintenance (PM)

#### 4.1.1 Definition and Purpose
Preventive maintenance consists of regularly scheduled inspections, adjustments, lubrication, cleaning, and replacement of components to prevent equipment failures before they occur.

#### 4.1.2 PM Frequency Determination
PM frequency shall be established based on:
- Manufacturer recommendations
- Equipment criticality
- Historical performance data
- Risk assessment
- Regulatory requirements
- Production schedule

#### 4.1.3 Standard PM Tasks
Standard PM activities include:
- Visual inspections
- Cleaning and sanitization
- Lubrication
- Parts replacement
- Calibration verification
- Operational checks
- Safety feature verification

#### 4.1.4 PM Scheduling and Tracking
A master PM schedule shall be maintained, showing:
- Equipment ID
- PM task descriptions
- Frequency
- Last completion date
- Next due date
- Responsible personnel

**Example PM Schedule Format:**

| Equipment ID | Description | PM Type | Frequency | Last Done | Next Due | Responsible |
|--------------|-------------|---------|-----------|-----------|----------|-------------|
| MIX-101 | Powder Mixer | Full service | Quarterly | 15-Mar-2025 | 15-Jun-2025 | Engineering |
| MIX-101 | Powder Mixer | Lubrication | Monthly | 15-May-2025 | 15-Jun-2025 | Operator |
| FILL-203 | Liquid Filler | Critical components | Monthly | 10-May-2025 | 10-Jun-2025 | Engineering |
| HVAC-04 | Cleanroom AHU | Filter check | Weekly | 12-Jun-2025 | 19-Jun-2025 | Facilities |

### 4.2 Predictive Maintenance (PdM)

#### 4.2.1 Definition and Purpose
Predictive maintenance utilizes data-driven techniques to monitor equipment condition during operation to predict when maintenance should be performed, optimizing maintenance intervals and reducing unexpected failures.

#### 4.2.2 PdM Techniques
- Vibration analysis
- Thermography
- Oil analysis
- Ultrasonic inspection
- Motor current analysis
- Process parameter trending

#### 4.2.3 Implementation Strategy
PdM shall be implemented for critical equipment where:
- Failure modes can be detected through condition monitoring
- Sufficient failure prediction lead time exists
- Cost-benefit analysis justifies the investment
- Specialized knowledge and tools are available

#### 4.2.4 Data Collection and Analysis
- Data collection procedures for each PdM technique
- Baseline establishment methodology
- Trend analysis procedures
- Alert and alarm thresholds
- Escalation protocols

### 4.3 Corrective Maintenance (CM)

#### 4.3.1 Definition and Purpose
Corrective maintenance refers to repairs performed after equipment failure to restore functionality.

#### 4.3.2 Response Classification
Maintenance response shall be prioritized based on:

| Priority | Description | Response Time | Resolution Time | Example |
|----------|-------------|---------------|-----------------|---------|
| Emergency | Critical equipment failure impacting production or safety | Immediate | <24 hours | Sterilizer failure during production |
| Urgent | Significant impact on operations but production can continue | <4 hours | <48 hours | Backup pump failure |
| Routine | Limited operational impact | <24 hours | <7 days | Minor leaks, cosmetic issues |
| Planned | Scheduled repair during planned downtime | Next planned shutdown | Per project plan | Equipment upgrades |

#### 4.3.3 Failure Reporting Process
- Initial notification procedures
- Required information for maintenance request
- Approval requirements for emergency repairs
- Documentation requirements

#### 4.3.4 Failure Investigation
- Root cause analysis methodology
- Failure mode and effects analysis (FMEA)
- Corrective and preventive action development
- Maintenance program adjustment procedures

## 5. Maintenance Procedures

### 5.1 Equipment Assessment

#### 5.1.1 Initial Assessment
For each equipment type, conduct assessment covering:
- Critical components and wear points
- Common failure modes
- Manufacturer maintenance recommendations
- Regulatory requirements
- Operational experience with similar equipment
- Spare parts availability
- Specialized maintenance skills required

#### 5.1.2 Risk Assessment
Conduct a maintenance-focused risk assessment considering:
- Equipment criticality
- Failure consequences
- Detection difficulty
- Historical reliability
- Redundancy availability
- Maintenance complexity
- Resource constraints

#### 5.1.3 Maintenance Strategy Development
Based on assessment results:
- Determine optimal maintenance approach (PM, PdM, CM mix)
- Establish maintenance frequencies
- Identify resource requirements
- Document required procedures
- Define performance metrics

### 5.2 Maintenance Planning

#### 5.2.1 Maintenance Plan Development
Document specific maintenance plans for each equipment type including:
- Detailed task descriptions
- Required tools and materials
- Safety precautions
- Estimated time requirements
- Personnel qualifications
- Reference documents
- Acceptance criteria

#### 5.2.2 Scheduling Considerations
Coordinate maintenance scheduling with:
- Production planning
- Cleaning validation requirements
- Personnel availability
- Regulatory compliance deadlines
- Facility shutdown opportunities
- Supply chain constraints

#### 5.2.3 Resource Allocation
Plan for required resources:
- Skilled personnel requirements
- Specialized tools and equipment
- Spare parts and consumables
- Contractor requirements
- Budget allocation

### 5.3 Execution and Documentation

#### 5.3.1 Pre-Maintenance Procedures
Before beginning maintenance:
- Obtain necessary approvals
- Review maintenance procedure
- Conduct safety assessment
- Gather required tools and parts
- Properly prepare and isolate equipment
- Apply appropriate status labeling

#### 5.3.2 Maintenance Execution
During maintenance:
- Follow approved procedures
- Document as-found conditions
- Record all activities performed
- Note any deviations from procedure
- Document parts replaced
- Record measurements and test results

#### 5.3.3 Documentation Requirements
Document maintenance activities using approved forms containing:
- Equipment identification
- Maintenance procedure reference
- Date and time
- Technician identification
- Tasks performed
- Parts replaced
- Test results
- Non-conformances observed
- Time to complete
- Equipment status after maintenance

**Example Maintenance Record Format:**

```
EQUIPMENT MAINTENANCE RECORD
Equipment ID: _________________ Description: _________________
Work Order #: _________________ Date: _________________
Maintenance Type: ☐ Preventive ☐ Predictive ☐ Corrective ☐ Other
Procedure Reference: _________________

TASKS COMPLETED:
[Checklist of specific tasks with completion checkboxes]

PARTS REPLACED:
Part Number | Description | Quantity | Lot/Serial Number
----------- | ----------- | -------- | ----------------

TEST RESULTS:
Test | Specification | Result | Pass/Fail
---- | ------------- | ------ | ---------

COMMENTS:
[Free text field for observations and comments]

COMPLETION STATUS:
☐ Completed as planned
☐ Partially completed (explain in comments)
☐ Deferred (explain in comments)

Performed by: _________________ Signature: _________________
Verified by: _________________ Signature: _________________
```

### 5.4 Post-Maintenance Verification

#### 5.4.1 Functional Testing
After maintenance completion:
- Perform operational verification
- Check critical parameters
- Verify safety features
- Monitor initial operation
- Document performance results

#### 5.4.2 Calibration Verification
Where applicable:
- Verify calibration status
- Perform post-maintenance calibration checks
- Document calibration results
- Update calibration labels

#### 5.4.3 GMP Impact Assessment
Evaluate impact on:
- Equipment qualification status
- Validated state
- Product quality
- Process parameters
- Cleaning procedures
- Documentation requirements

#### 5.4.4 Equipment Release
Before returning to production:
- Complete all required documentation
- Obtain necessary approvals
- Update equipment status
- Communicate to relevant personnel
- Remove maintenance tags
- Apply appropriate status labeling

## 6. Calibration Requirements

### 6.1 Calibration Program Overview

#### 6.1.1 Scope
- Identify equipment requiring calibration
- Establish calibration frequencies
- Define acceptable tolerance ranges
- Determine calibration methods
- Specify calibration standards

#### 6.1.2 Calibration Classifications
Based on GMP impact:
- Critical (direct impact on product quality)
- Major (indirect impact on product quality)
- Minor (no impact on product quality)

### 6.2 Calibration Procedures

#### 6.2.1 Standard Calibration Methods
- Reference to specific calibration procedures
- Use of traceable reference standards
- Environmental requirements
- Pre-calibration checks
- Adjustment procedures
- Post-calibration verification

#### 6.2.2 Calibration Frequency Determination
Establish frequencies based on:
- Manufacturer recommendations
- Regulatory requirements
- Historical drift data
- Equipment criticality
- Usage conditions
- Risk assessment

#### 6.2.3 Out-of-Tolerance Handling
Procedures for handling out-of-tolerance conditions:
- Immediate actions
- Documentation requirements
- Impact assessment
- Product quality evaluation
- Corrective action determination
- Adjustment of calibration frequency

### 6.3 Calibration Documentation

#### 6.3.1 Calibration Records
Maintain records including:
- Equipment identification
- Calibration procedure reference
- Calibration standards used with traceability
- As-found and as-left readings
- Acceptance criteria
- Adjustments made
- Date of calibration
- Due date for next calibration
- Technician identification

#### 6.3.2 Calibration Labeling
Apply calibration labels showing:
- Calibration date
- Calibration due date
- Technician identification
- Limitations of use (if applicable)
- Reference to calibration certificate

#### 6.3.3 Calibration Certificates
For external calibrations:
- Maintain certificates showing traceability
- Review certificates for compliance
- Verify inclusion of uncertainty measurements
- Ensure appropriate accreditation reference

## 7. Documentation and Records

### 7.1 Maintenance Documentation System

#### 7.1.1 Document Hierarchy
- Equipment maintenance SOPs
- Equipment-specific maintenance procedures
- Preventive maintenance schedules
- Maintenance work orders
- Maintenance records and logs
- Calibration records
- Deviation reports
- Change control documentation

#### 7.1.2 Documentation Management
- Document control procedures
- Version control
- Review and approval requirements
- Distribution management
- Archiving requirements
- Retrieval procedures

### 7.2 Required Records and Retention

#### 7.2.1 Maintenance Records
Maintain records of:
- All preventive maintenance activities
- Corrective maintenance actions
- Equipment modifications
- Parts replacement history
- Maintenance trending data
- Deviations and investigations
- Contractor service reports

#### 7.2.2 Retention Requirements
Maintain records according to:
- Regulatory requirements (minimum 1 year after expiry of last product manufactured)
- Company policies
- Equipment lifecycle needs
- Validation requirements

#### 7.2.3 Electronic Records
For computerized maintenance management systems:
- Compliance with 21 CFR Part 11
- Data backup procedures
- System access controls
- Audit trail requirements
- Electronic signature controls
- System validation documentation

### 7.3 Maintenance Reporting

#### 7.3.1 Routine Reporting
Generate and distribute:
- Weekly maintenance completion reports
- Monthly PM compliance metrics
- Quarterly maintenance trending analysis
- Annual maintenance program review

#### 7.3.2 Management Review Data
Provide data for management review:
- Maintenance program effectiveness
- Resource utilization
- Cost analysis
- Compliance metrics
- Improvement opportunities

## 8. Training Requirements

### 8.1 Training Program

#### 8.1.1 Required Competencies
- Equipment-specific technical knowledge
- Maintenance procedure execution
- Documentation practices
- GMP awareness
- Safety procedures
- Troubleshooting skills
- Calibration techniques (if applicable)

#### 8.1.2 Training Methods
- Classroom training
- On-the-job training
- Vendor training
- Computer-based training
- Mentoring programs
- Refresher training

#### 8.1.3 Qualification Process
- Initial qualification requirements
- Competency assessment methods
- Periodic requalification
- Technical skill verification
- Documentation review

### 8.2 Training Documentation

#### 8.2.1 Training Records
Maintain records including:
- Training content
- Training dates
- Assessment results
- Trainer identification
- Trainee acknowledgment
- Competency verification

#### 8.2.2 Training Matrix
Establish a matrix showing:
- Personnel names
- Required training modules
- Completion status
- Due dates for refresher training
- Special certifications

### 8.3 Vendor and Contractor Qualification

#### 8.3.1 Qualification Requirements
- Technical expertise verification
- GMP awareness assessment
- Quality system evaluation
- Past performance review
- Regulatory compliance history

#### 8.3.2 Oversight Procedures
- Work supervision requirements
- Documentation review
- Performance evaluation
- Requalification frequency
- Corrective action process

## 9. Quality Metrics and KPIs

### 9.1 Performance Metrics

#### 9.1.1 Compliance Metrics
- PM completion rate (target: >95%)
- PM schedule adherence (target: >90%)
- Overdue maintenance items (target: <5%)
- SOP compliance (target: 100%)
- Calibration compliance (target: 100%)
- Documentation accuracy (target: >98%)

#### 9.1.2 Effectiveness Metrics
- Equipment availability (target: >95% for critical equipment)
- Mean time between failures (MTBF)
- Mean time to repair (MTTR)
- First-time fix rate (target: >85%)
- Percentage of emergency maintenance (target: <10%)
- Critical equipment failure rate (target: <2%)

#### 9.1.3 Efficiency Metrics
- Planned vs. unplanned maintenance ratio (target: >80:20)
- Maintenance labor utilization
- Parts and materials costs
- Contractor usage
- Overtime hours

### 9.2 Data Collection and Analysis

#### 9.2.1 Data Sources
- Maintenance work orders
- Equipment history records
- Calibration records
- Deviation reports
- Production downtime records
- Spare parts usage data

#### 9.2.2 Analysis Techniques
- Trend analysis
- Pareto analysis of failures
- Root cause analysis
- Cost-benefit analysis
- Reliability modeling
- Maintenance effectiveness assessment

### 9.3 Continuous Improvement

#### 9.3.1 Review Process
- Monthly metric review
- Quarterly program assessment
- Annual maintenance strategy review
- Post-failure improvement analysis

#### 9.3.2 Improvement Methodologies
- PDCA (Plan-Do-Check-Act) cycle
- Reliability-centered maintenance
- Total productive maintenance concepts
- Lean maintenance practices
- Best practice benchmarking

#### 9.3.3 Implementation of Improvements
- Change control process
- Impact assessment
- Implementation planning
- Effectiveness verification
- Documentation update
- Training on changes

## 10. Related Forms and Templates

### 10.1 Maintenance Procedures
- Equipment-specific maintenance procedure template
- Lubrication schedule template
- Critical spare parts list template
- Troubleshooting guide template

### 10.2 Documentation Forms
- Preventive maintenance checklist
- Corrective maintenance report
- Equipment history record
- Calibration record
- Deviation report
- Change request form

### 10.3 Planning and Management Templates
- Maintenance schedule template
- Resource allocation worksheet
- Contractor qualification form
- Training record template
- Performance metrics dashboard

## Appendices

### Appendix A: Glossary of Terms
[List of maintenance-related terminology and definitions]

### Appendix B: References
[List of applicable regulations, standards, and guidance documents]

### Appendix C: Equipment Categorization Guide
[Detailed guide for classifying equipment by criticality]

### Appendix D: Maintenance Procedure Template
[Standardized template for creating equipment-specific maintenance procedures]

### Appendix E: Troubleshooting Guides
[Generic troubleshooting methodology and equipment-specific guides]
