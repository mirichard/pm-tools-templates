---
title: "Sprint Planning Template"
methodology: "agile"
complexity: "advanced"
owner: "mirichard"
updated: "2025-08-05"
---

# Sprint Planning Template

## Executive Summary
This template provides a comprehensive framework for conducting effective sprint planning sessions in Scrum projects, ensuring teams can commit to achievable sprint goals and deliverables.

## Sprint Planning Overview
**Sprint Number:** [Sprint X]
**Sprint Duration:** [2 weeks / 3 weeks / 4 weeks]
**Sprint Start Date:** [Date]
**Sprint End Date:** [Date]
**Planning Meeting Date:** [Date and time]
**Team Capacity:** [Total story points or hours available]

## Pre-Planning Preparation

### Product Backlog Readiness
**Backlog Grooming Status:**
- [ ] Product backlog prioritized by Product Owner
- [ ] Top stories estimated and refined
- [ ] Acceptance criteria defined for priority items
- [ ] Dependencies identified and documented
- [ ] Definition of Ready criteria met

**Story Readiness Checklist:**
- [ ] User stories follow INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable)
- [ ] Acceptance criteria clearly defined
- [ ] Story points estimated by development team
- [ ] Business value/priority assigned
- [ ] Dependencies documented

### Team Capacity Planning
**Team Member Availability:**
| Team Member | Role | Days Available | Capacity % | Story Points/Hours |
|-------------|------|----------------|------------|-------------------|
| [Name] | [Developer/Tester/etc.] | [8/10 days] | [80%] | [16 points] |
| [Name] | [Developer/Tester/etc.] | [8/10 days] | [100%] | [20 points] |
| [Name] | [Developer/Tester/etc.] | [6/10 days] | [60%] | [12 points] |

**Capacity Considerations:**
- [ ] Team member vacation/time off
- [ ] Training or conference attendance
- [ ] Support duties or production issues
- [ ] Other project commitments
- [ ] Historical velocity considerations

### Sprint Goal Definition
**Sprint Goal Framework:**
**Primary Objective:** [High-level goal for the sprint]
**Success Criteria:** [How we'll know the goal is achieved]
**Business Value:** [Why this goal matters to stakeholders]
**Risks:** [Potential obstacles to achieving the goal]

**Example Sprint Goals:**
- "Implement user authentication feature to enable secure user login"
- "Complete payment processing integration to support e-commerce transactions"
- "Enhance search functionality to improve user experience and findability"

## Sprint Planning Meeting Structure

### Part 1: What to Build (1-2 hours)
**Agenda Items:**
1. **Review Sprint Goal** (15 minutes)
   - Product Owner presents proposed sprint goal
   - Team discusses feasibility and alignment
   - Finalize sprint goal commitment

2. **Product Backlog Review** (45-60 minutes)
   - Product Owner explains top priority stories
   - Team asks clarifying questions
   - Review acceptance criteria and business value
   - Identify potential risks or dependencies

3. **Initial Story Selection** (30-45 minutes)
   - Team selects stories that align with sprint goal
   - Estimate total story points/hours
   - Verify selection fits team capacity
   - Identify any missing requirements

**Part 1 Outputs:**
- [ ] Confirmed sprint goal
- [ ] Initial list of sprint backlog items
- [ ] Clarified requirements and acceptance criteria
- [ ] Identified risks and dependencies

### Part 2: How to Build (1-2 hours)
**Agenda Items:**
1. **Task Breakdown** (60-90 minutes)
   - Break down each story into specific tasks
   - Estimate task effort in hours
   - Identify task dependencies
   - Assign initial task ownership

2. **Technical Planning** (30-45 minutes)
   - Review technical approach for complex stories
   - Identify architecture or design decisions needed
   - Plan integration points and testing strategy
   - Discuss any technical risks or unknowns

3. **Final Capacity Check** (15-30 minutes)
   - Sum up all task estimates
   - Compare against team capacity
   - Adjust scope if necessary
   - Finalize sprint commitment

**Part 2 Outputs:**
- [ ] Detailed task breakdown for each story
- [ ] Task estimates and assignments
- [ ] Technical approach documented
- [ ] Final sprint backlog commitment

## Sprint Backlog Creation

### Story Selection Criteria
**Story Prioritization Factors:**
- [ ] **Business Value:** Impact on users and business goals
- [ ] **Sprint Goal Alignment:** Contribution to overall sprint objective
- [ ] **Dependencies:** Stories that unblock future work
- [ ] **Risk Level:** Balance of high-risk and low-risk items
- [ ] **Team Expertise:** Match stories to team skills and interests

### Sprint Backlog Format
**Story Template:**
```
Story: [User story title]
As a [user type], I want [functionality] so that [benefit]

Acceptance Criteria:
- [ ] [Specific testable criteria 1]
- [ ] [Specific testable criteria 2]
- [ ] [Specific testable criteria 3]

Story Points: [X points]
Priority: [High/Medium/Low]
Dependencies: [Other stories or external dependencies]

Tasks:
- [ ] [Task 1] - [X hours] - [Assigned to]
- [ ] [Task 2] - [X hours] - [Assigned to]
- [ ] [Task 3] - [X hours] - [Assigned to]
```

### Commitment and Risk Management
**Sprint Commitment:**
- [ ] **Total Story Points:** [X points committed]
- [ ] **Team Capacity:** [Y points available]
- [ ] **Commitment Confidence:** [High/Medium/Low]
- [ ] **Stretch Goals:** [Optional items if ahead of schedule]

**Risk Assessment:**
| Risk | Probability | Impact | Mitigation Plan |
|------|-------------|--------|-----------------|
| [Technical complexity higher than estimated] | [Medium] | [High] | [Pair programming, spike research] |
| [External dependency delays] | [Low] | [Medium] | [Early communication, backup plan] |
| [Team member unavailability] | [Low] | [Medium] | [Cross-training, task redistribution] |

## Sprint Execution Planning

### Daily Scrum Preparation
**Daily Standup Format:**
- What did I complete yesterday?
- What will I work on today?
- What impediments are blocking my progress?

**Tracking Mechanisms:**
- [ ] **Sprint Burndown Chart:** Track story points/hours remaining
- [ ] **Task Board:** Visual representation of work in progress
- [ ] **Impediment Log:** Document and track blockers
- [ ] **Sprint Goal Progress:** Regular assessment of goal achievement

### Definition of Done
**Story-Level DoD:**
- [ ] Code completed and peer reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Acceptance criteria validated
- [ ] Documentation updated
- [ ] Code merged to main branch

**Sprint-Level DoD:**
- [ ] All committed stories completed
- [ ] Sprint goal achieved
- [ ] No critical bugs remain
- [ ] Product Owner accepts deliverables
- [ ] Demo prepared for sprint review

## Sprint Planning Outputs

### Key Deliverables
**Planning Artifacts:**
- [ ] **Sprint Goal:** Clear, achievable objective
- [ ] **Sprint Backlog:** Committed stories with tasks
- [ ] **Capacity Plan:** Team availability and workload
- [ ] **Risk Register:** Identified risks and mitigation plans
- [ ] **Definition of Done:** Completion criteria

### Communication Plan
**Stakeholder Communication:**
- [ ] Sprint goal shared with stakeholders
- [ ] Sprint backlog visible to organization
- [ ] Progress reporting mechanism established
- [ ] Demo preparation scheduled
- [ ] Retrospective planning initiated

### Success Metrics
**Sprint Planning Effectiveness:**
- [ ] **Planning Time:** Completed within time box (4 hours max)
- [ ] **Team Buy-in:** Full team commitment to sprint goal
- [ ] **Scope Accuracy:** Actual vs. planned story completion
- [ ] **Goal Achievement:** Sprint goal met at sprint end
- [ ] **Stakeholder Satisfaction:** Value delivered meets expectations

## Common Sprint Planning Challenges

### Overcommitment
**Problem:** Team commits to more work than capacity allows
**Solutions:**
- Use historical velocity data for capacity planning
- Include buffer time for unexpected issues
- Focus on sprint goal rather than maximizing story points
- Practice saying "no" to additional scope during sprint

### Unclear Requirements
**Problem:** Stories lack sufficient detail for estimation and execution
**Solutions:**
- Implement Definition of Ready criteria
- Conduct backlog grooming sessions before planning
- Involve Product Owner in clarifying requirements
- Break down large stories into smaller, clearer pieces

### Technical Debt Impact
**Problem:** Technical debt slows development velocity
**Solutions:**
- Allocate capacity percentage to technical debt stories
- Include refactoring tasks in story estimates
- Track technical debt and communicate impact to stakeholders
- Balance feature development with technical improvements

### Dependency Management
**Problem:** External dependencies block sprint progress
**Solutions:**
- Identify dependencies during planning
- Communicate with external teams early
- Plan alternative stories as backup options
- Track dependency status in daily standups

## Continuous Improvement

### Sprint Planning Retrospective
**Evaluation Questions:**
- Was our sprint planning effective?
- Did we accurately estimate our capacity?
- Were requirements clear enough for execution?
- What would we do differently next planning session?

**Improvement Actions:**
- [ ] Adjust planning process based on team feedback
- [ ] Refine estimation techniques
- [ ] Improve backlog grooming practices
- [ ] Enhance communication with Product Owner

### Planning Maturity Assessment
**Maturity Indicators:**
- Planning consistently completed within time box
- High accuracy in scope prediction
- Team confidence in commitments
- Minimal scope changes during sprint
- Consistent achievement of sprint goals

---
Related Resources:
- [Product Backlog Management](../planning/product_backlog_template.md)
- [Sprint Zero Template](../sprint-zero/sprint_zero_template.md)
- [Sprint Review Template](../ceremonies/sprint_review_template.md)
- [Sprint Retrospective Template](../ceremonies/sprint_retrospective_template.md)
