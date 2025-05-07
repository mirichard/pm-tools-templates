# SPRINT PLANNING

## Document Information
**Product/Project Name:** *[Customer Portal Application]*  
**Sprint Number:** *[Sprint 5]*  
**Sprint Dates:** *[YYYY-MM-DD to YYYY-MM-DD]*  
**Sprint Duration:** *[2 weeks]*  
**Scrum Master:** *[John Doe]*  
**Product Owner:** *[Jane Smith]*  
**Last Updated:** *[YYYY-MM-DD]*  

---

## Document Purpose
*This Sprint Planning document captures the outcomes of the Sprint Planning meeting for Sprint [X]. It outlines the Sprint Goal, selected Product Backlog Items (PBIs), capacity planning, and the resulting Sprint Backlog with task breakdowns. This document serves as a reference for the Scrum Team throughout the Sprint and provides transparency to stakeholders on what the team is working on.*

---

## Table of Contents
1. [Sprint Planning Meeting Structure](#1-sprint-planning-meeting-structure)
2. [Sprint Goal](#2-sprint-goal)
3. [Capacity Planning](#3-capacity-planning)
4. [Sprint Backlog Creation](#4-sprint-backlog-creation)
5. [Task Breakdown Structure](#5-task-breakdown-structure)
6. [Sprint Planning Checklist](#6-sprint-planning-checklist)
7. [Example Sprint Backlog](#7-example-sprint-backlog)
8. [Definition of Done](#8-definition-of-done)
9. [Sprint Commitment](#9-sprint-commitment)

---

## 1. Sprint Planning Meeting Structure

### 1.1 Meeting Logistics
- **Date and Time:** *[YYYY-MM-DD, HH:MM - HH:MM]*
- **Location:** *[Meeting Room / Virtual Platform]*
- **Participants:** *[List team members present]*
- **Duration:** *[Maximum of 8 hours for a 4-week sprint, proportionally less for shorter sprints]*

### 1.2 Two-Part Structure

#### Part 1: "WHAT" (1st half)
Led by the Product Owner, this part focuses on selecting Product Backlog Items (PBIs) for the Sprint:

1. **Review Product Backlog**: Product Owner presents the highest priority items
2. **Discuss and Clarify**: Development Team asks questions to understand requirements
3. **Define Sprint Goal**: Collaborative formulation of a clear, focused goal
4. **Select PBIs**: Team selects items that align with the goal and can be completed within the Sprint
5. **Confirm Scope**: Team and Product Owner reach agreement on the selected items

#### Part 2: "HOW" (2nd half)
Led by the Development Team, this part focuses on how the work will be accomplished:

1. **Task Breakdown**: Team breaks down PBIs into tasks
2. **Effort Estimation**: Team estimates effort for each task
3. **Capacity Check**: Compare effort to available capacity
4. **Dependency Identification**: Identify dependencies and sequencing
5. **Volunteer for Tasks**: Team members self-select initial tasks
6. **Finalize Commitment**: Team confirms commitment to deliver the Sprint Backlog

### 1.3 Meeting Facilitation Tips (For Scrum Master)

- Keep the meeting timeboxed and focused
- Ensure all team members participate
- Address impediments that arise during planning
- Capture action items and decisions
- Help the team make realistic commitments
- Prevent detailed design discussions (defer to later sessions)
- Keep the focus on the Sprint Goal
- Use visual tools to maintain engagement

---

## 2. Sprint Goal

### 2.1 Sprint Goal Definition
*A concise statement that provides focus and direction for the Sprint. It should be specific, measurable, and achievable within the Sprint timebox.*

### 2.2 Characteristics of Good Sprint Goals

- **Focused**: Addresses a specific business need or value
- **Concise**: Can be easily remembered and communicated
- **Inspirational**: Motivates the team
- **Independent**: Not contingent on work outside the Sprint
- **Measurable**: Success can be objectively determined
- **Achievable**: Realistic within the Sprint timebox

### 2.3 Sprint Goal Creation Process

1. Product Owner proposes initial goal based on business priorities
2. Team discusses and refines the goal
3. Team confirms the goal is achievable within the Sprint
4. Team and Product Owner agree on final wording

### 2.4 Sprint Goal Example

*Example: "Deliver a fully functional user authentication system that allows users to register, log in, reset passwords, and manage their profiles, enabling secure access to the customer portal."*

---

## 3. Capacity Planning

### 3.1 Team Capacity Calculation

| Team Member | Role | Days Available | Hours/Day | Total Hours | Notes |
|-------------|------|----------------|-----------|-------------|-------|
| *Alex Smith* | *Frontend Developer* | *8* | *6* | *48* | *PTO on [dates]* |
| *Jamie Jones* | *Backend Developer* | *10* | *6* | *60* | *Full availability* |
| *Riley Green* | *QA Engineer* | *7* | *6* | *42* | *Training on [dates]* |
| *Casey Brown* | *UX Designer* | *5* | *4* | *20* | *Shared resource (50%)* |
| **TOTAL** | | | | **170** | |

### 3.2 Capacity Adjustments

- **Standard Availability**: Full sprint is [10] working days
- **Focus Factor**: [80%] (accounts for meetings, emails, interruptions)
- **Adjusted Team Capacity**: [170] hours × [80%] = [136] hours

### 3.3 Historical Velocity

| Sprint | Story Points Completed |
|--------|------------------------|
| Sprint 1 | 24 |
| Sprint 2 | 28 |
| Sprint 3 | 22 |
| Sprint 4 | 26 |
| **Average** | **25** |

### 3.4 Sprint Capacity Planning Notes

*Example: Based on our average velocity of 25 story points and our adjusted capacity of 136 hours, we're planning to commit to 26 story points for Sprint 5. This is slightly above our average velocity but the team feels confident due to reduced dependencies and improved knowledge of the codebase.*

---

## 4. Sprint Backlog Creation

### 4.1 Selection Criteria
When selecting PBIs for the Sprint, consider:

- Alignment with Sprint Goal
- Item priority in the Product Backlog
- Dependencies and technical constraints
- Team capacity
- "Definition of Ready" compliance
- Balance of work types (features, bugs, technical debt)

### 4.2 Selected PBIs

| ID | User Story | Acceptance Criteria | Story Points | Priority | Dependencies | Notes |
|----|------------|---------------------|--------------|----------|--------------|-------|
| *US-101* | *As a visitor, I want to create an account so that I can access the system* | *1. Email validation<br>2. Password requirements<br>3. Confirmation email<br>4. GDPR compliance* | *5* | *Critical* | *None* | *Frontend and backend work required* |
| *US-102* | *As a user, I want to log in with my credentials so that I can access my account* | *1. Email/password login<br>2. Error handling<br>3. Remember me option<br>4. Logout functionality* | *3* | *Critical* | *US-101* | *Session management included* |
| *US-103* | *As a user, I want to reset my password if I forget it so that I can regain access to my account* | *1. Email reset flow<br>2. Secure token generation<br>3. Password update form<br>4. Notification of change* | *3* | *High* | *US-101* | *Security review required* |
| *US-104* | *As a user, I want to edit my profile information so that my account details stay up to date* | *1. Edit form with validation<br>2. Profile picture upload<br>3. Email change verification<br>4. Save confirmation* | *5* | *Medium* | *US-102* | *S3 integration for images* |
| *TECH-015* | *Refactor authentication service to improve security* | *1. Implement password hashing<br>2. Add rate limiting<br>3. Update unit tests<br>4. Documentation* | *5* | *High* | *None* | *Technical debt item* |
| *BUG-042* | *Password requirements not clearly displayed during registration* | *1. Requirements displayed<br>2. Real-time validation<br>3. Consistent across devices* | *2* | *Medium* | *None* | *UX improvement* |
| **TOTAL** | | | **23** | | | |

### 4.3 PBIs Not Selected (Considered but Deferred)

| ID | User Story | Story Points | Priority | Reason for Deferral |
|----|------------|--------------|----------|---------------------|
| *US-105* | *As a user, I want to delete my account so that I can remove my data from the system* | *5* | *Low* | *Does not align with sprint goal, lower priority* |
| *BUG-043* | *UI layout issues on ultrawide monitors* | *3* | *Low* | *Limited user impact, lower priority* |

---

## 5. Task Breakdown Structure

### 5.1 Task Breakdown Guidelines

- Break down PBIs into tasks of 4-8 hours (ideally)
- Include all work required to meet the Definition of Done
- Include testing, documentation, and review tasks
- Be specific enough to track progress daily
- Consider dependencies between tasks
- Identify tasks that can be worked on in parallel
- Include setup, research, and integration tasks

### 5.2 Common Task Categories

- **Development Tasks**: Coding, implementation, configuration
- **Design Tasks**: UX design, UI implementation, mockups
- **Testing Tasks**: Unit tests, integration tests, user acceptance tests
- **Documentation Tasks**: Code documentation, user guides, API docs
- **Review Tasks**: Code reviews, design reviews, security reviews
- **Infrastructure Tasks**: Environment setup, deployment, CI/CD
- **Research Tasks**: Spikes, prototypes, evaluations

### 5.3 Task Template

```
Task ID: [PBI-ID]-[Sequential Number]
Task Name: [Descriptive Name]
Description: [Detailed description of work to be done]
Estimated Hours: [X hours]
Assigned To: [Team Member or "Unassigned"]
Dependencies: [List of task IDs this task depends on]
Definition of Done: [Specific criteria to consider this task complete]
```

---

## 6. Sprint Planning Checklist

### 6.1 Pre-Planning Checklist (For Scrum Master)

- [ ] Product Backlog is refined and prioritized
- [ ] PBIs at the top of the backlog meet Definition of Ready
- [ ] Product Owner is prepared to discuss priorities and answer questions
- [ ] Team members are available for the entire meeting
- [ ] Previous sprint's metrics and lessons learned are available
- [ ] Meeting space and tools are prepared and working
- [ ] Any pre-reading materials have been shared with the team

### 6.2 During Planning Checklist

- [ ] Timebox is respected (max 8 hours for 4-week sprint)
- [ ] Sprint Goal is clearly defined and agreed upon
- [ ] Team capacity is calculated and considered
- [ ] PBIs selected align with Sprint Goal
- [ ] All selected PBIs meet Definition of Ready
- [ ] PBIs are broken down into tasks
- [ ] Dependencies are identified and addressed
- [ ] Team agrees the Sprint Backlog is achievable
- [ ] Initial tasks are assigned or volunteered for

### 6.3 Post-Planning Checklist

- [ ] Sprint Backlog is visible to all stakeholders
- [ ] Sprint Goal is communicated to stakeholders
- [ ] Any impediments identified during planning are logged
- [ ] Team is clear on next steps and initial focus
- [ ] Sprint Planning outcomes are documented
- [ ] Sprint board/tool is updated with all tasks
- [ ] First Daily Scrum is scheduled

---

## 7. Example Sprint Backlog

*Below is an example of how the Sprint Backlog might look after task breakdown for the first PBI. Similar breakdowns would be done for all PBIs in the Sprint.*

### User Story: US-101 - User Registration

**Story**: As a visitor, I want to create an account so that I can access the system

**Story Points**: 5

**Tasks**:

| Task ID | Task Description | Estimated Hours | Assigned To | Dependencies | Status |
|---------|-----------------|----------------|------------|--------------|--------|
| US-101-1 | Design registration form UI and workflow | 4 | Casey | None | To Do |
| US-101-2 | Create API endpoint for user registration | 6 | Jamie | None | To Do |
| US-101-3 | Implement front-end registration form | 8 | Alex | US-101-1 | To Do |
| US-101-4 | Implement email validation and confirmation | 6 | Jamie | US-101-2 | To Do |
| US-101-5 | Implement password strength requirements | 4 | Alex | US-101-3 | To Do |
| US-101-6 | Implement GDPR compliance features | 4 | Jamie | US-101-2 | To Do |
| US-101-7 | Write unit tests for registration API | 3 | Jamie | US-101-2, US-101-4, US-101-6 | To Do |
| US-101-8 | Write front-end tests for registration | 3 | Alex | US-101-3, US-101-5 | To Do |
| US-101-9 | Perform integration testing | 4 | Riley | All US-101 development tasks | To Do |
| US-101-10 | Update user documentation | 2 | Riley | US-101-9 | To Do |

Total Estimated Hours: 44

### User Story: US-102 - User Login

*Similar task breakdown would be included here*

### Technical Debt: TECH-015 - Authentication Service Refactoring

*Similar task breakdown would be included here*

### Bug: BUG-042 - Password Requirements Display

*Similar task breakdown would be included here*

---

## 8. Definition of Done

*The Definition of Done is the shared understanding of what it means for work to be complete. All items in the Sprint Backlog must meet this definition to be considered done.*

### 8.1 Global Definition of Done (All PBIs)

- [ ] Code written and peer-reviewed (using pull request process)
- [ ] All acceptance criteria met and verified
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] UI/UX review completed (for front-end changes)
- [ ] Documentation updated
- [ ] Code merged to the main/development branch
- [ ] Build pipeline passes
- [ ] Deployed to staging environment
- [ ] Tested in staging environment
- [ ] Performance testing completed (if applicable)
- [ ] Security requirements met and verified
- [ ] Accessibility requirements met (WCAG 2.1 AA compliance)
- [ ] Product Owner review and approval
- [ ] No known defects (or all identified defects documented and prioritized)
- [ ] Technical debt identified and documented

### 8.2 Feature-Specific Definition of Done

*Additional DoD items specific to features in this Sprint:*

**User Authentication Features:**
- [ ] Security review completed
- [ ] Password policies enforced
- [ ] Session management tested
- [ ] Rate limiting implemented and tested
- [ ] GDPR requirements met

---

## 9. Sprint Commitment

### 9.1 Team Commitment

*By agreeing to this Sprint Backlog, the Development Team commits to:*

1. Working toward the Sprint Goal with focus and dedication
2. Adhering to the team's engineering practices and Definition of Done
3. Collaborating daily and communicating openly about progress and impediments
4. Being transparent about challenges that may impact the Sprint Goal
5. Self-organizing to deliver the selected PBIs within the Sprint timebox

### 9.2 Commitment Signatures

| Team Member | Role | Signature | Date |
|-------------|------|-----------|------|
| *Alex Smith* | *Frontend Developer* | ______________ | *YYYY-MM-DD* |
| *Jamie Jones* | *Backend Developer* | ______________ | *YYYY-MM-DD* |
| *Riley Green* | *QA Engineer* | ______________ | *YYYY-MM-DD* |
| *Casey Brown* | *UX Designer* | ______________ | *YYYY-MM-DD* |
| *Jane Smith* | *Product Owner* | ______________ | *YYYY-MM-DD* |
| *John Doe* | *Scrum Master* | ______________ | *YYYY-MM-DD* |

---

## 10. Sprint Summary and Key Information

### 10.1 Sprint Overview

**Sprint Goal:** *"Deliver a fully functional user authentication system that allows users to register, log in, reset passwords, and manage their profiles, enabling secure access to the customer portal."*

**Sprint Duration:** *2 weeks (YYYY-MM-DD to YYYY-MM-DD)*

**Total Story Points:** *23*

**Total Estimated Hours:** *136*

**Team Focus Factor:** *80%*

**Key Deliverables:**
- Complete user registration functionality
- Complete login/logout functionality 
- Password reset capability
- User profile management
- Improved authentication security

### 10.2 Key Risks and Mitigations

| Risk | Mitigation Plan |
|------|----------------|
| *Integration with email service may take longer than estimated* | *Start email service integration early in the sprint; have mockup fallback ready* |
| *Security review may identify additional requirements* | *Early security review scheduled; buffer time allocated for fixes* |
| *Team member Casey has limited availability* | *Front-loaded design tasks; Alex trained as backup for UI implementation* |

### 10.3 Dependencies and Coordination Needs

| Dependency | Description | Owner | Due Date | Status |
|------------|-------------|-------|----------|--------|
| *Email Service API Keys* | *Required for password reset functionality* | *Ops Team* | *YYYY-MM-DD* | *Requested* |
| *S3 Storage Configuration* | *Required for profile picture upload* | *DevOps* | *YYYY-MM-DD* | *In Progress* |
| *Security Team Review* | *Required before deployment* | *Security Lead* | *YYYY-MM-DD* | *Scheduled* |

### 10.4 Sprint Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| *Sprint Goal Achievement* | *100% completion* | *All authentication features working in staging* |
| *Velocity* | *23 story points* | *Completed story points at sprint end* |
| *Quality* | *0 critical bugs, <3 minor bugs* | *Bug count in testing* |
| *Test Coverage* | *>85% code coverage* | *Test coverage reports* |
| *Team Satisfaction* | *>4/5 average* | *Sprint retrospective survey* |

---

## Appendix A: Sprint Planning Meeting Agenda

```
SPRINT PLANNING MEETING AGENDA

Date: [Date]
Time: [Start Time] - [End Time]
Location: [Location/Virtual Platform]

PART 1: THE "WHAT" (First Half) - Led by Product Owner
1. Welcome and sprint planning overview (5 min)
2. Review of sprint retrospective action items (10 min)
3. Review of product vision and roadmap (10 min)
4. Product backlog review and clarification (30 min)
5. Team capacity calculation (15 min)
6. Sprint goal definition and refinement (20 min)
7. Sprint backlog selection and commitment (30 min)
8. Break (10 min)

PART 2: THE "HOW" (Second Half) - Led by Development Team
1. Task breakdown for each backlog item (60 min)
2. Task estimation (30 min)
3. Dependency identification (15 min)
4. Capacity check and adjustment (15 min)
5. Initial task assignments (15 min)
6. Review of sprint plan and confirmation of commitment (15 min)
7. Identify and address initial impediments (10 min)
8. Next steps and close (5 min)
```

## Appendix B: Task Breakdown Worksheet

```
USER STORY TASK BREAKDOWN WORKSHEET

Story ID: [ID]
Story Title: [Title]
Story Points: [Points]
Story Owner: [Team Member]

Step 1: Identify the main components of work
- [ ] Frontend work required?
- [ ] Backend work required?
- [ ] Database changes required?
- [ ] Integration work required?
- [ ] Documentation needed?
- [ ] Special testing required?

Step 2: Break down into specific tasks
1. [Task description] - [Estimated hours]
2. [Task description] - [Estimated hours]
3. [Task description] - [Estimated hours]
...

Step 3: Identify dependencies between tasks
- Task 2 depends on Task 1
- Task 3 depends on Task 2
...

Step 4: Identify potential risks or blockers
- [Risk/blocker description]
- [Risk/blocker description]
...

Step 5: Define acceptance criteria for tasks
- [ ] [Criterion 1]
- [ ] [Criterion 2]
...

Total Estimated Hours: [Sum of hours]
```

## Appendix C: Daily Scrum Template

```
DAILY SCRUM MEETING

Date: [YYYY-MM-DD]
Time: [HH:MM] - [HH:MM]
Location: [Location/Virtual Platform]

Team Updates:

[Team Member Name]:
- What did I accomplish yesterday?
  * [Task completed/progress]
  * [Task completed/progress]
- What will I do today?
  * [Task planned]
  * [Task planned]
- Do I have any blockers?
  * [Blocker, if any]

[Team Member Name]:
...

Blockers/Impediments to Discuss:
1. [Blocker description] - Owner: [Name] - Action: [Next steps]
2. [Blocker description] - Owner: [Name] - Action: [Next steps]

Sprint Burndown Update:
- Story Points Remaining: [X] of [Y] (Z%)
- On track: [Yes/No/At Risk]
- Adjustment needed: [Yes/No] - [Description if Yes]

Focus for Today:
- [Key focus area]
- [Key focus area]
```

---

*Note: This Sprint Planning template aligns with Scrum Guide best practices. Teams should adapt it to their specific context and needs while maintaining the core principles of Scrum.*

