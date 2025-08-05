---
title: "Work Breakdown Structure Template"
methodology: "traditional"
complexity: "advanced"
owner: "mirichard"
updated: "2025-08-05"
---

# WORK BREAKDOWN STRUCTURE (WBS)

## Document Control Information
**Document Title:** Work Breakdown Structure  
**Project Name:** [Project Name]  
**Document Version:** 1.0  
**Prepared By:** [Author Name, Role]  
**Preparation Date:** [YYYY-MM-DD]  
**Last Updated By:** [Name, Role]  
**Last Revision Date:** [YYYY-MM-DD]  

---

## Purpose and Overview

The Work Breakdown Structure (WBS) is a hierarchical decomposition of the total scope of work to be carried out by the project team to accomplish the project objectives and create the required deliverables. It organizes and defines the total scope of the project and represents the work specified in the currently approved project scope statement.

This document serves as:
- A foundational scope management tool that defines all project work elements
- A framework for detailed cost estimation and schedule development
- A basis for performance measurement and project control
- A communication tool for stakeholders to visualize project scope

---

## Instructions for Use

1. Begin with the approved project scope statement
2. Conduct WBS development workshops with appropriate stakeholders
3. Decompose project deliverables into work packages using this template
4. Create WBS Dictionary entries for each work package
5. Verify completeness using the 100% rule (all children must represent 100% of parent)
6. Review and obtain approval from key stakeholders
7. Integrate with project schedule, resource assignments, and cost estimates
8. Baseline the WBS and place under change control

---

## WBS Development Guidelines

### Decomposition Process

1. **Identify major deliverables** from the project scope statement
2. **Determine how each deliverable will be produced** (what work is required)
3. **Decompose higher-level items** into smaller, manageable components
4. **Continue decomposition** until reaching work packages that:
   - Can be realistically estimated for cost and duration
   - Can be assigned to a single responsible party
   - Can be completed in a reasonable timeframe (typically 2-80 hours of effort)
   - Have measurable progress and distinct completion criteria
5. **Verify decomposition** is sufficient and comprehensive

### Numbering Convention

- **Level 1**: Project Name (1.0)
- **Level 2**: Major Deliverable/Phase (1.1, 1.2, etc.)
- **Level 3**: Sub-deliverable (1.1.1, 1.1.2, etc.)
- **Level 4**: Work Package Components (1.1.1.1, 1.1.1.2, etc.)
- **Level 5**: Activities (if needed) (1.1.1.1.1, 1.1.1.1.2, etc.)

### Coding Structure

Using a proper coding structure enables better tracking, integration with other systems, and filtered reporting:

| Level | Format | Example | Description |
|-------|--------|---------|-------------|
| 1 | Project ID | PRJ-001 | Unique project identifier |
| 2 | Major Deliverable | PRJ-001.01 | Major phases or components |
| 3 | Sub-deliverable | PRJ-001.01.01 | Significant components of major deliverables |
| 4 | Work Package | PRJ-001.01.01.01 | Assignable units of work |
| 5+ | Activity (optional) | PRJ-001.01.01.01.01 | Detailed tasks within work packages |

---

## WBS Template Formats

### Hierarchical Outline Format

This format uses indentation to show the WBS hierarchy:

```
1.0 [Project Name]
  1.1 [Major Deliverable/Phase 1]
    1.1.1 [Sub-deliverable 1]
      1.1.1.1 [Work Package 1]
      1.1.1.2 [Work Package 2]
    1.1.2 [Sub-deliverable 2]
      1.1.2.1 [Work Package 1]
      1.1.2.2 [Work Package 2]
  1.2 [Major Deliverable/Phase 2]
    1.2.1 [Sub-deliverable 1]
      1.2.1.1 [Work Package 1]
      1.2.1.2 [Work Package 2]
```

### Tabular Format

| WBS Code | Description | Level | Parent | Responsible | Duration (days) | Effort (hours) |
|----------|-------------|-------|--------|-------------|-----------------|----------------|
| 1.0 | *Project Name* | 1 | - | *PM* | *120* | *1920* |
| 1.1 | *Major Deliverable 1* | 2 | 1.0 | *PM* | *30* | *480* |
| 1.1.1 | *Sub-deliverable 1.1* | 3 | 1.1 | *Team Lead A* | *15* | *240* |
| 1.1.1.1 | *Work Package 1.1.1* | 4 | 1.1.1 | *Team Member 1* | *5* | *80* |
| 1.1.1.2 | *Work Package 1.1.2* | 4 | 1.1.1 | *Team Member 2* | *10* | *160* |
| 1.1.2 | *Sub-deliverable 1.2* | 3 | 1.1 | *Team Lead B* | *15* | *240* |
| 1.1.2.1 | *Work Package 1.2.1* | 4 | 1.1.2 | *Team Member 3* | *7* | *112* |
| 1.1.2.2 | *Work Package 1.2.2* | 4 | 1.1.2 | *Team Member 4* | *8* | *128* |

### Graphical Format (Tree Structure)

The WBS can also be presented as a graphical tree structure where:
- The project appears at the top (Level 1)
- Major deliverables/phases appear below (Level 2)
- Continuing decomposition downward through the levels
- Work packages as terminal nodes

*Note: Create and attach a graphical representation using a tool like Microsoft Project, WBS Chart Pro, Visio, or similar.*

---

## Example WBS for Software Implementation Project

### Hierarchical Outline Example

```
1.0 CRM System Implementation Project
  1.1 Project Management
    1.1.1 Project Initiation
      1.1.1.1 Project Charter Development
      1.1.1.2 Kickoff Meeting
    1.1.2 Project Planning
      1.1.2.1 Develop Project Management Plan
      1.1.2.2 Create Project Schedule
    1.1.3 Project Execution
      1.1.3.1 Status Reporting
      1.1.3.2 Team Management
    1.1.4 Project Monitoring and Control
      1.1.4.1 Change Control
      1.1.4.2 Risk Management
    1.1.5 Project Closure
      1.1.5.1 Final Acceptance
      1.1.5.2 Lessons Learned
  1.2 Requirements and Analysis
    1.2.1 Business Requirements
      1.2.1.1 Stakeholder Interviews
      1.2.1.2 Requirements Documentation
    1.2.2 System Analysis
      1.2.2.1 Current System Assessment
      1.2.2.2 Gap Analysis
    1.2.3 Requirements Approval
      1.2.3.1 Requirements Review Meeting
      1.2.3.2 Requirements Sign-off
  1.3 Solution Design
    1.3.1 System Architecture
      1.3.1.1 Technical Architecture Design
      1.3.1.2 Security Design
    1.3.2 Database Design
      1.3.2.1 Data Model Development
      1.3.2.2 Database Schema Creation
    1.3.3 User Interface Design
      1.3.3.1 UI Mockups
      1.3.3.2 UI Design Approval
  1.4 System Configuration and Development
    1.4.1 Environment Setup
      1.4.1.1 Development Environment
      1.4.1.2 Test Environment
      1.4.1.3 Production Environment
    1.4.2 System Configuration
      1.4.2.1 Base System Setup
      1.4.2.2 Module Configuration
    1.4.3 Custom Development
      1.4.3.1 Custom Module Development
      1.4.3.2 Integration Development
    1.4.4 Data Migration
      1.4.4.1 Data Cleansing
      1.4.4.2 Migration Scripts Development
      1.4.4.3 Test Migration Run
  1.5 Testing
    1.5.1 Test Planning
      1.5.1.1 Test Strategy Development
      1.5.1.2 Test Case Creation
    1.5.2 Unit Testing
      1.5.2.1 Module Testing
      1.5.2.2 Defect Resolution
    1.5.3 Integration Testing
      1.5.3.1 End-to-End Process Testing
      1.5.3.2 Defect Resolution
    1.5.4 User Acceptance Testing
      1.5.4.1 UAT Session Facilitation
      1.5.4.2 UAT Defect Resolution
      1.5.4.3 UAT Sign-off
  1.6 Deployment
    1.6.1 Deployment Planning
      1.6.1.1 Deployment Strategy
      1.6.1.2 Rollback Plan
    1.6.2 Training
      1.6.2.1 Training Materials Development
      1.6.2.2 End-user Training
      1.6.2.3 Admin Training
    1.6.3 Go-Live Activities
      1.6.3.1 Final Data Migration
      1.6.3.2 System Activation
      1.6.3.3 Go-Live Support
  1.7 Post-Implementation Support
    1.7.1 Hypercare Support
      1.7.1.1 Day 1-30 Support
      1.7.1.2 Issue Resolution
    1.7.2 Transition to Operations
      1.7.2.1 Knowledge Transfer
      1.7.2.2 Support Documentation
      1.7.2.3 Transition Sign-off
```

---

## WBS Dictionary Template

The WBS Dictionary provides detailed information about each component in the WBS. Here's a template for WBS Dictionary entries:

### WBS Dictionary Entry

| Item | Description |
|------|-------------|
| **WBS Code:** | [Unique identifier from WBS] |
| **WBS Element Name:** | [Name of the deliverable or work package] |
| **WBS Level:** | [1, 2, 3, etc.] |
| **Description:** | [Detailed description of what this element includes] |
| **Deliverables:** | [Specific outputs to be produced] |
| **Acceptance Criteria:** | [Criteria that must be met for approval] |
| **Assumptions:** | [Factors assumed to be true for planning purposes] |
| **Constraints:** | [Factors that limit options for this element] |
| **Dependencies:** | [Elements that must be completed before/after this element] |
| **Responsible Party:** | [Person or role responsible for delivery] |
| **Resource Requirements:** | [Labor, materials, equipment, etc. needed] |
| **Estimated Duration:** | [Expected time to complete] |
| **Estimated Effort:** | [Person-hours required] |
| **Estimated Cost:** | [Budget allocation for this element] |
| **Quality Requirements:** | [Quality standards that must be met] |
| **Risks:** | [Known risks associated with this element] |
| **References:** | [Links to relevant documentation] |

### WBS Dictionary Example Entry

| Item | Description |
|------|-------------|
| **WBS Code:** | *1.4.3.1* |
| **WBS Element Name:** | *Custom Module Development* |
| **WBS Level:** | *4* |
| **Description:** | *Design, development, and unit testing of custom modules needed to support specific business requirements not available in the base CRM system.* |
| **Deliverables:** | *Functional custom modules, Unit test results, Technical documentation* |
| **Acceptance Criteria:** | *- All modules pass unit tests<br>- Code review completed<br>- Documentation complete and reviewed<br>- Performance meets specified requirements* |
| **Assumptions:** | *- Development team has required CRM platform expertise<br>- Development environments are available and configured* |
| **Constraints:** | *- Must use approved development standards<br>- Must maintain compatibility with future system upgrades<br>- Must be completed within 4 weeks* |
| **Dependencies:** | *- Requires completed System Architecture (1.3.1)<br>- Must be completed before Integration Testing (1.5.3)* |
| **Responsible Party:** | *Development Team Lead* |
| **Resource Requirements:** | *2 Senior Developers, 1 Junior Developer, Development environment access* |
| **Estimated Duration:** | *20 business days* |
| **Estimated Effort:** | *480 person-hours* |
| **Estimated Cost:** | *$72,000* |
| **Quality Requirements:** | *- Code coverage minimum 85%<br>- No critical or high security vulnerabilities<br>- Performance meets SLA requirements* |
| **Risks:** | *- Limited expertise with certain CRM APIs<br>- Integration complexity may exceed estimates* |
| **References:** | *- Functional Requirements Doc #FR-123<br>- Technical Design Doc #TD-456* |

---

## Integration with Other Project Documents

The WBS integrates with other project planning documents as follows:

| Document | Integration Point |
|----------|-------------------|
| **Project Scope Statement** | The WBS breaks down the approved scope into manageable components |
| **Project Schedule** | Activities are developed based on WBS work packages |
| **Resource Assignment Matrix** | WBS work packages are assigned to team members or roles |
| **Cost Estimates** | Costs are estimated at the work package level and rolled up |
| **Risk Register** | Risks can be identified and managed at the work package level |
| **Quality Management Plan** | Quality requirements are defined for WBS components |
| **Communications Plan** | WBS provides structure for reporting progress |
| **Procurement Plan** | Identifies components that may require external procurement |
| **Change Management Plan** | Changes are assessed against the WBS to determine impact |

---

## WBS Development Best Practices

1. **Follow the 100% Rule**
   - The WBS must include 100% of the work defined in the project scope
   - The sum of work at each level must equal 100% of the work at the level above
   - Avoid overlapping work between WBS elements to prevent double-counting

2. **Use Nouns for Deliverables**
   - Name WBS elements with nouns rather than verbs to emphasize deliverables
   - Example: Use "Requirements Document" instead of "Document Requirements"

3. **Apply the 8/80 Rule for Work Packages**
   - Work packages should require more than 8 hours but fewer than 80 hours of effort
   - This provides a balance between too much detail and not enough control

4. **Keep WBS Levels Consistent**
   - Maintain consistent detail level across similar components
   - Avoid over-

