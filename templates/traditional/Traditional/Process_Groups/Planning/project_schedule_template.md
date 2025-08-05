---
title: "Project Schedule Template"
methodology: "traditional"
complexity: "advanced"
owner: "mirichard"
updated: "2025-08-05"
---

# PROJECT SCHEDULE

## Document Control Information
**Document Title:** Project Schedule  
**Project Name:** [Project Name]  
**Document Version:** 1.0  
**Prepared By:** [Author Name, Role]  
**Preparation Date:** [YYYY-MM-DD]  
**Last Updated By:** [Name, Role]  
**Last Revision Date:** [YYYY-MM-DD]  

---

## Purpose and Overview

The Project Schedule is a time-based representation of project activities that documents when work will be performed and deliverables will be produced. It serves as a tool for communication, resource management, progress tracking, and forecasting project completion.

This document serves to:
- Define the timeline for project execution
- Establish the sequence and dependencies between activities
- Assign resources to activities
- Identify the critical path for project completion
- Establish a baseline for measuring schedule performance
- Communicate timing expectations to all stakeholders

---

## Instructions for Use

1. Use this template after completing the Work Breakdown Structure (WBS)
2. Follow the schedule development process outlined in Section III
3. Complete each section of the schedule template with project-specific information
4. Review the schedule with relevant stakeholders for validation and approval
5. Baseline the schedule once approved
6. Update the schedule regularly throughout project execution
7. Document schedule changes according to the change control process

---

## Schedule Development Process

### Schedule Development Workflow

1. **Define Activities**: Identify specific activities required to produce project deliverables
2. **Sequence Activities**: Determine logical relationships between activities
3. **Estimate Resources**: Determine type and quantity of resources required for each activity
4. **Estimate Durations**: Estimate time required to complete each activity
5. **Develop Schedule**: Create schedule model using activities, sequences, resources, and durations
6. **Validate Schedule**: Review schedule with team and stakeholders
7. **Analyze Schedule**: Perform critical path analysis, identify buffer/contingency needs
8. **Optimize Schedule**: Compress or adjust schedule as needed to meet constraints
9. **Baseline Schedule**: Establish approved schedule as the performance measurement baseline
10. **Control Schedule**: Monitor progress, manage changes, and update as needed

### Activity Definition Guidelines

Activities should:
- Derive directly from work packages in the WBS
- Have clear start and finish points
- Be definable at a level of detail appropriate for effective management
- Have durations within a manageable time frame (typically 1 day to 2 weeks)
- Be assignable to specific individuals or teams
- Have measurable progress indicators

### Activity Sequencing Methods

| Relationship | Description | Notation | Example |
|--------------|-------------|----------|---------|
| Finish-to-Start (FS) | Activity B cannot start until Activity A finishes | A FS B | Testing (B) cannot start until development (A) is complete |
| Start-to-Start (SS) | Activity B cannot start until Activity A starts | A SS B | Document writing (B) can start after requirements gathering (A) begins |
| Finish-to-Finish (FF) | Activity B cannot finish until Activity A finishes | A FF B | System testing (B) cannot finish until bug fixing (A) is complete |
| Start-to-Finish (SF) | Activity B cannot finish until Activity A starts | A SF B | Old system support (B) ends when new system implementation (A) starts |
| Leads and Lags | Time modifiers for relationships | FS+5 or FS-3 | Install software (B) can start 2 days before hardware setup (A) completes (FS-2) |

### Duration Estimation Techniques

1. **Expert Judgment**: Based on experience with similar activities
2. **Analogous Estimating**: Using actual durations from similar activities in past projects
3. **Parametric Estimating**: Using statistical relationships between historical data and variables
4. **Three-Point Estimating (PERT)**: Using optimistic (O), most likely (M), and pessimistic (P) estimates
   - Triangular Distribution: (O + M + P) / 3
   - Beta Distribution (PERT): (O + 4M + P) / 6
5. **Bottom-up Estimating**: Estimating individual components then aggregating
6. **Reserve Analysis**: Adding buffer time (contingency reserves) for known risks

---

## Schedule Components

### Activity Attributes Template

| Field | Description | Example |
|-------|-------------|---------|
| **Activity ID** | Unique identifier | ACT-1001 |
| **Activity Name** | Descriptive name | Database Design |
| **WBS Reference** | Related WBS element | 1.3.2.1 |
| **Description** | Detailed description of work | Creating logical and physical database design for the system |
| **Predecessor(s)** | Activities that must finish first | ACT-1000 (Requirements Analysis) |
| **Successor(s)** | Activities that follow | ACT-1002 (Database Implementation) |
| **Relationship Type** | Type of dependency | FS (Finish-to-Start) |
| **Lead/Lag** | Time adjustment to relationship | +2d (2 day lag) |
| **Duration** | Estimated time to complete | 5 days |
| **Effort** | Person-hours required | 40 hours |
| **Start Date** | Scheduled start date | YYYY-MM-DD |
| **Finish Date** | Scheduled finish date | YYYY-MM-DD |
| **Resources** | People or materials assigned | John Smith (Database Architect) |
| **Resource Units** | Allocation percentage | 100% |
| **Constraints** | Fixed dates or deadlines | Must finish by YYYY-MM-DD |
| **Assumptions** | Underlying assumptions | Resource has SQL Server experience |
| **Priority** | Relative importance | High/Medium/Low |
| **Status** | Current state | Not Started/In Progress/Complete |
| **% Complete** | Completion percentage | 0% |
| **Notes** | Additional information | Requires vendor input on data structure |

### Activity List Template

| Activity ID | Activity Name | WBS Reference | Description | Duration | Predecessors | Resources | Status |
|-------------|--------------|--------------|-------------|----------|--------------|-----------|--------|
| *ACT-1000* | *Requirements Analysis* | *1.2.1* | *Gather and document requirements* | *10d* | *None* | *Business Analyst* | *Complete* |
| *ACT-1001* | *Database Design* | *1.3.2.1* | *Design database schema* | *5d* | *ACT-1000 FS* | *Database Architect* | *In Progress* |
| *ACT-1002* | *Database Implementation* | *1.3.2.2* | *Create and configure database* | *3d* | *ACT-1001 FS+2d* | *Database Developer* | *Not Started* |
| [Activity ID] | [Activity Name] | [WBS Reference] | [Description] | [Duration] | [Predecessors] | [Resources] | [Status] |

### Milestone List Template

| Milestone ID | Milestone Name | Description | Planned Date | Actual Date | Status | Owner |
|--------------|---------------|-------------|--------------|------------|--------|-------|
| *MS-001* | *Project Kickoff* | *Formal start of project* | *YYYY-MM-DD* | *YYYY-MM-DD* | *Complete* | *Project Manager* |
| *MS-002* | *Requirements Approved* | *Requirements signed off by stakeholders* | *YYYY-MM-DD* | *YYYY-MM-DD* | *Complete* | *Business Analyst* |
| *MS-003* | *Design Complete* | *All design documents approved* | *YYYY-MM-DD* | *N/A* | *Pending* | *Solution Architect* |
| [Milestone ID] | [Milestone Name] | [Description] | [Planned Date] | [Actual Date] | [Status] | [Owner] |

---

## Schedule Presentation Formats

### Gantt Chart Format

A Gantt chart displays activities as horizontal bars along a timeline, with:
- Activities listed vertically on the left
- Timeline displayed horizontally
- Activity durations shown as horizontal bars
- Dependencies displayed as arrows between activities
- Milestones marked as diamonds
- Critical path activities typically highlighted
- Resources often displayed alongside activities

*Note: Create Gantt charts using project management software like Microsoft Project, Smartsheet, or similar tools.*

**Example Gantt Chart Elements:**
```
Task Name                 | Duration | Start      | Finish     | Predecessors | Resources
--------------------------|----------|------------|------------|--------------|----------
1. Project Initiation     | 10 days  | 2025-01-01 | 2025-01-14 |              | PM
   1.1 Project Charter    | 5 days   | 2025-01-01 | 2025-01-07 |              | PM
   1.2 Stakeholder Reg.   | 3 days   | 2025-01-08 | 2025-01-10 | 1.1          | PM
   1.3 Kickoff Meeting    | 2 days   | 2025-01-13 | 2025-01-14 | 1.2          | PM, Team
2. Project Planning       | 15 days  | 2025-01-15 | 2025-02-04 | 1            |
   2.1 Requirements       | 10 days  | 2025-01-15 | 2025-01-28 |              | BA
   2.2 Design             | 5 days   | 2025-01-29 | 2025-02-04 | 2.1          | Designer
...
```

### Network Diagram Format

A network diagram (precedence diagram) shows the logical relationships between activities:
- Activities represented as nodes (boxes)
- Dependencies shown as arrows between nodes
- Early start/finish and late start/finish times displayed
- Critical path highlighted
- Float/slack time indicated

**Example Network Diagram Box:**
```
┌───────────────────────────┐
│ Activity ID: ACT-1001     │
│ Name: Database Design     │
│                           │
│ Duration: 5 days          │
│ ES: 11  EF: 15            │
│ LS: 11  LF: 15            │
│ Float: 0 (Critical Path)  │
└───────────────────────────┘
```

### Calendar View

A calendar view displays project activities on a standard calendar:
- Activities scheduled on specific dates
- Multiple activities can appear on the same day
- Resource allocations can be overlaid
- Useful for resource scheduling and availability visualization

### Tabular Schedule

| Activity | Start Date | End Date | Duration | Lead | Team Members | % Complete | Status |
|----------|------------|----------|----------|------|--------------|------------|--------|
| [Activity] | [YYYY-MM-DD] | [YYYY-MM-DD] | [Duration] | [Lead] | [Team] | [Completion %] | [Status] |

---

## Resource Considerations

### Resource Loading Chart Template

Resource loading charts display resource allocation over time.

**Sample Resource Loading Table:**

| Resource Name | Role | Week 1 | Week 2 | Week 3 | Week 4 | Week 5 | Week 6 | Total Hours |
|---------------|------|--------|--------|--------|--------|--------|--------|-------------|
| *Jane Smith* | *Project Manager* | *20h* | *20h* | *20h* | *20h* | *20h* | *20h* | *120h* |
| *John Doe* | *Developer* | *40h* | *40h* | *40h* | *40h* | *20h* | *10h* | *190h* |
| *Alice Brown* | *Designer* | *10h* | *30h* | *40h* | *20h* | *0h* | *0h* | *100h* |
| [Resource Name] | [Role] | [Hours] | [Hours] | [Hours] | [Hours] | [Hours] | [Hours] | [Sum] |

### Resource Leveling Considerations

Resource leveling aims to resolve over-allocations while minimizing impact on the project schedule:

1. **Techniques for Resource Leveling:**
   - Delaying non-critical activities within their float
   - Splitting activities to allow for interruptions
   - Adjusting resource assignments across activities
   - Extending activity durations but using fewer resources
   - Adding resources to critical activities (crashing)

2. **Impact Documentation:**
   
   | Activity | Original Duration | Leveled Duration | Delay | Justification | Impact on End Date |
   |----------|-------------------|------------------|-------|---------------|-------------------|
   | [Activity] | [Duration] | [New Duration] | [Delay] | [Reason] | [Impact] |

3. **Resource Leveling Priority Rules:**
   - Critical activities first
   - Activities with least float first
   - Higher priority activities first
   - Resource-intensive activities first
   - Activities with preferred sequence first

---

## Schedule Baseline and Control

### Schedule Baseline

The schedule baseline is the approved version of the project schedule that serves as the basis for comparison to actual results. Document the baseline approval as follows:

**Baseline Approval:**

| Item | Details |
|------|---------|
| **Baseline Version:** | [Version number] |
| **Baseline Date:** | [YYYY-MM-DD] |
| **Project Start Date:** | [YYYY-MM-DD] |
| **Project End Date:** | [YYYY-MM-DD] |
| **Total Duration:** | [Duration] |
| **Critical Path Duration:** | [Duration] |
| **Schedule Reserve:** | [Duration] |
| **Approved By:** | [Name, Title] |
| **Approval Date:** | [YYYY-MM-DD] |
| **Comments:** | [Any special conditions or notes about the baseline] |

### Schedule Control Process

1. **Progress Tracking**:
   - Update activity status (Not Started, In Progress, Complete)
   - Record actual start and finish dates
   - Update percent complete
   - Document actual work/duration

2. **Performance Measurement**:
   - Schedule variance (SV) = Earned Value (EV) - Planned Value (PV)
   - Schedule performance index (SPI) = EV / PV
   - Forecast schedule using SPI trends

3. **Schedule Change Control**:

   | Field | Description |
   |-------|-------------|
   | **Change Request ID:** | [Unique identifier] |
   | **Description of Change:** | [What is changing in the schedule] |
   | **Reason for Change:** | [Why the change is needed] |
   | **Impact on Schedule:** | [Days added/removed, effect on critical path] |
   | **Impact on Resources:** | [Additional resources needed or resource changes] |
   | **Impact on Cost:** | [Cost increase/decrease due to schedule change] |
   | **Impact on Scope/Quality:** | [Any effects on deliverables or quality] |
   | **Alternatives Considered:** | [Other options that were evaluated] |
   | **Recommendation:** | [Approve/Reject recommendation] |
   | **Approvals Required:** | [Names/roles needed to approve] |
   | **Decision:** | [Approved/Rejected] |
   | **Decision Date:** | [YYYY-MM-DD] |

4. **Schedule Updates and Communication**:
   - Update schedule with approved changes
   - Maintain version control
   - Communicate changes to stakeholders
   - Document lessons learned

---

## Integration with Other Project Documents

| Document | Integration Point |
|----------|-------------------|
| **Work Breakdown Structure** | Activities derive from WBS work packages; WBS codes link activities to scope elements |
| **Resource Management Plan** | Resources assigned to activities based on availability in Resource Management Plan |
| **Cost Management Plan** | Activity durations and resource assignments drive cost estimates |
| **Risk Register** | Schedule risks identified in Risk Register may require buf

