---
title: "Backlog Refinement Template"
methodology: "agile"
complexity: "advanced"
owner: "mirichard"
updated: "2025-08-05"
---

# Backlog Refinement Template

## Meeting Information
- **Date**: [Date]
- **Duration**: 1-2 hours (typically 10% of sprint capacity)
- **Facilitator**: [Product Owner/Scrum Master]
- **Participants**: [Product Owner, Development Team, Scrum Master]
- **Sprint Context**: [Current sprint number and upcoming sprint focus]

## Meeting Objectives
- Refine user stories for upcoming sprint(s)
- Ensure stories meet Definition of Ready
- Estimate refined stories
- Clarify requirements and acceptance criteria
- Identify dependencies and risks

## Stories for Refinement

### High Priority Stories (Next Sprint Candidates)
| Story ID | Title | Priority | Current State | Target Sprint |
|----------|-------|----------|---------------|---------------|
| [US-001] | [Story Title] | P0 | Draft | Sprint N+1 |
| [US-002] | [Story Title] | P1 | Needs Clarification | Sprint N+1 |
| [US-003] | [Story Title] | P1 | Ready for Estimation | Sprint N+1 |

### Medium Priority Stories (Future Sprints)
| Story ID | Title | Priority | Current State | Target Sprint |
|----------|-------|----------|---------------|---------------|
| [US-004] | [Story Title] | P2 | Draft | Sprint N+2 |
| [US-005] | [Story Title] | P2 | Needs Research | Sprint N+2 |

## Story Refinement Process

### Story Template Review
For each story, ensure it follows the standard format:

**As a** [type of user]  
**I want** [some goal or objective]  
**So that** [some reason or benefit]

### Definition of Ready Checklist
For each story, verify:
- [ ] Story is clearly written and understandable
- [ ] Acceptance criteria are defined and testable
- [ ] Story is estimated by the development team
- [ ] Dependencies are identified and managed
- [ ] UI/UX mockups or wireframes available (if applicable)
- [ ] Performance criteria defined (if applicable)
- [ ] Security requirements identified (if applicable)

## Story Refinement Details

### Story: [US-001] [Story Title]

#### Original Story
[Current story description]

#### Refined Story
**As a** [refined user type]  
**I want** [refined goal]  
**So that** [refined benefit]

#### Acceptance Criteria
1. **Given** [context] **When** [action] **Then** [outcome]
2. **Given** [context] **When** [action] **Then** [outcome]
3. **Given** [context] **When** [action] **Then** [outcome]

#### Technical Considerations
- [Technical requirement 1]
- [Technical requirement 2]
- [Technical constraint or consideration]

#### Dependencies
- **Internal**: [Other stories or components needed]
- **External**: [Third-party dependencies or external teams]
- **Technical**: [Infrastructure or technology dependencies]

#### Questions and Clarifications
| Question | Answer | Impact |
|----------|--------|--------|
| [Question 1] | [Answer] | [Impact on story] |
| [Question 2] | [Answer] | [Impact on story] |

#### Estimation
- **Initial Estimate**: [Story points] 
- **Final Estimate**: [Story points after discussion]
- **Estimation Method**: [Planning poker, T-shirt sizes, etc.]
- **Confidence Level**: High/Medium/Low

#### Definition of Done Criteria
- [ ] All acceptance criteria met
- [ ] Code reviewed and approved
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] Product Owner acceptance received

### Story: [US-002] [Story Title]

#### Original Story
[Current story description]

#### Refinement Status
- **Status**: Needs More Information
- **Blocking Issues**: [What's preventing refinement]
- **Next Steps**: [What needs to happen next]
- **Owner**: [Who will resolve blocking issues]
- **Target Date**: [When to revisit]

#### Outstanding Questions
1. [Question 1] - Owner: [Name] - Due: [Date]
2. [Question 2] - Owner: [Name] - Due: [Date]

## Estimation Session

### Estimation Method Used
- [ ] Planning Poker
- [ ] T-Shirt Sizing
- [ ] Affinity Estimation
- [ ] Relative Sizing

### Story Point Reference
| Points | Description | Example |
|--------|-------------|---------|
| 1 | Trivial change | Fix typo, small config change |
| 2 | Simple story | Add field to form |
| 3 | Small story | Simple CRUD operation |
| 5 | Medium story | Complex form with validation |
| 8 | Large story | Integration with external service |
| 13 | Very large | Major feature, consider splitting |

### Estimation Results
| Story | Initial Estimates | Discussion Points | Final Estimate | Confidence |
|-------|------------------|-------------------|----------------|------------|
| [US-001] | 2,3,5,3 | [Key discussion points] | 3 | High |
| [US-002] | ?,8,13,5 | [Key discussion points] | 8 | Medium |

## Risk and Dependency Analysis

### Risks Identified
| Risk | Impact | Probability | Mitigation | Owner |
|------|--------|-------------|------------|-------|
| [Risk 1] | High/Med/Low | High/Med/Low | [Mitigation strategy] | [Owner] |
| [Risk 2] | High/Med/Low | High/Med/Low | [Mitigation strategy] | [Owner] |

### Dependencies Mapped
| Story | Depends On | Type | Status | Impact |
|-------|------------|------|--------|--------|
| [US-001] | [Dependency] | Internal/External | [Status] | [Impact if not resolved] |
| [US-002] | [Dependency] | Internal/External | [Status] | [Impact if not resolved] |

### Architectural Decisions Required
- [Decision 1]: [Description] - Owner: [Name] - Due: [Date]
- [Decision 2]: [Description] - Owner: [Name] - Due: [Date]

## Backlog Health Assessment

### Backlog Metrics
- **Stories Ready for Next Sprint**: [Number] ([Target: Sprint capacity + 20%])
- **Stories in Definition of Ready**: [Number]
- **Average Estimation Confidence**: [High/Medium/Low]
- **Dependency Resolution Rate**: [Percentage]

### Quality Indicators
- **Story Clarity**: [Score 1-5]
- **Acceptance Criteria Quality**: [Score 1-5]
- **Technical Feasibility Confidence**: [Score 1-5]
- **Business Value Clarity**: [Score 1-5]

## Action Items

### Story Actions
| Action | Story | Owner | Due Date | Status |
|--------|-------|-------|----------|--------|
| [Action 1] | [US-001] | [Owner] | [Date] | [Status] |
| [Action 2] | [US-002] | [Owner] | [Date] | [Status] |

### Process Improvements
- [ ] [Improvement 1] - Owner: [Name] - Due: [Date]
- [ ] [Improvement 2] - Owner: [Name] - Due: [Date]

### Research Tasks
- [ ] [Research 1] - Owner: [Name] - Due: [Date]
- [ ] [Research 2] - Owner: [Name] - Due: [Date]

## Sprint Planning Readiness

### Next Sprint Capacity
- **Team Capacity**: [Available story points]
- **Ready Stories Total**: [Story points available]
- **Capacity Buffer**: [Percentage above capacity]

### Sprint Planning Prerequisites
- [ ] Sufficient stories refined and estimated
- [ ] Critical dependencies resolved
- [ ] Sprint goal candidates identified
- [ ] Team capacity confirmed
- [ ] Major risks mitigated

### Recommended Sprint Backlog
Based on refinement session:
1. [US-001] - [Points] - [Rationale]
2. [US-002] - [Points] - [Rationale]
3. [US-003] - [Points] - [Rationale]

**Total**: [Points] ([Percentage] of capacity)

## Follow-up Activities

### Immediate Actions (Next 24 Hours)
- [ ] [Action 1] - Owner: [Name]
- [ ] [Action 2] - Owner: [Name]

### Before Next Sprint Planning
- [ ] [Action 1] - Owner: [Name] - Due: [Date]
- [ ] [Action 2] - Owner: [Name] - Due: [Date]

### Next Refinement Session
- **Date**: [Next refinement date]
- **Focus**: [Areas to focus on next time]
- **Stories to Cover**: [Story IDs for next session]

## Meeting Effectiveness

### What Worked Well
- [Success 1]
- [Success 2]

### Areas for Improvement
- [Improvement 1]
- [Improvement 2]

### Refinement Process Feedback
- **Meeting Length**: Too Short / Just Right / Too Long
- **Participant Engagement**: Low / Medium / High
- **Story Quality Improvement**: Low / Medium / High
- **Estimation Confidence**: Low / Medium / High

## Backlog Prioritization Updates

### Priority Changes Made
| Story | Old Priority | New Priority | Reason |
|-------|--------------|--------------|--------|
| [US-XXX] | P1 | P0 | [Reason] |
| [US-YYY] | P2 | P3 | [Reason] |

### Product Owner Decisions
- [Decision 1]: [Description and rationale]
- [Decision 2]: [Description and rationale]

---

**Meeting Facilitated by**: [Facilitator Name]  
**Date**: [Date]  
**Next Refinement**: [Date]

*Preparing the backlog for successful sprint execution*

