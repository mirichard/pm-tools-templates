---
title: "Less Sprint Planning Template"
methodology: "agile"
complexity: "advanced"
owner: "mirichard"
updated: "2025-08-05"
---

# LeSS Sprint Planning Template

## Overview
This template provides a comprehensive framework for conducting Sprint Planning in Large-Scale Scrum (LeSS) environments. LeSS Sprint Planning is designed to coordinate multiple teams working on the same Product Backlog, ensuring alignment and collaboration while maintaining the core Scrum principles.

## Template Information
- **Framework:** LeSS (Large-Scale Scrum)
- **Event Type:** Sprint Planning
- **Duration:** 4-8 hours (depending on number of teams and sprint length)
- **Participants:** All teams, Product Owner(s), Scrum Masters
- **Frequency:** Every sprint (typically 2-4 weeks)

---

## LeSS Sprint Planning Structure

### Two-Part Sprint Planning Process

#### Part 1: Product Backlog Refinement and Selection
**Duration:** 2-4 hours
**Participants:** Representatives from all teams, Product Owner(s)
**Objective:** Select and clarify Product Backlog Items for the sprint

#### Part 2: Team Sprint Planning
**Duration:** 2-4 hours
**Participants:** Individual teams with their Scrum Masters
**Objective:** Create detailed sprint plans and task breakdowns

---

## Pre-Sprint Planning Preparation

### One Week Before Sprint Planning

#### Product Owner Preparation
- [ ] **Product Backlog Refinement**
  - [ ] Ensure top items are "Ready" according to Definition of Ready
  - [ ] Update item priorities based on latest business needs
  - [ ] Prepare clarifications for complex items
  - [ ] Estimate relative sizing if needed

- [ ] **Stakeholder Alignment**
  - [ ] Confirm sprint goals with key stakeholders
  - [ ] Gather latest market/customer feedback
  - [ ] Review and update product vision if needed
  - [ ] Prepare business context for teams

#### Scrum Masters Preparation
- [ ] **Logistics Coordination**
  - [ ] Book rooms for both parts of Sprint Planning
  - [ ] Ensure all teams have access to planning tools
  - [ ] Coordinate with other Scrum Masters on timing
  - [ ] Prepare facilitation materials

- [ ] **Team Preparation**
  - [ ] Review team capacity for upcoming sprint
  - [ ] Identify team members who may be unavailable
  - [ ] Prepare team-specific questions or concerns
  - [ ] Review previous sprint retrospective actions

#### Teams Preparation
- [ ] **Technical Readiness**
  - [ ] Complete any outstanding tasks from previous sprint
  - [ ] Review Definition of Done
  - [ ] Identify technical dependencies between teams
  - [ ] Prepare development environment

---

## Part 1: Multi-Team Sprint Planning

### Agenda Template (4 hours)

#### Opening and Context Setting (30 minutes)
**Facilitator:** Chief Product Owner or Senior Scrum Master
**Participants:** All teams (2-3 representatives per team)

**Activities:**
1. **Welcome and Sprint Goal** (10 minutes)
   - Product Owner presents overall sprint goal
   - Business context and priorities
   - Market or customer updates

2. **Product Backlog Review** (15 minutes)
   - Review top priority items for the sprint
   - Clarify any questions about requirements
   - Confirm item priorities and dependencies

3. **Capacity Planning** (5 minutes)
   - Each team shares their capacity for the sprint
   - Account for vacations, training, etc.
   - Identify any capacity constraints

#### Product Backlog Item Selection (2.5 hours)
**Facilitator:** Product Owner with Scrum Master support
**Participants:** Team representatives

**Round 1: Initial Selection (45 minutes)**
1. **Item Presentation** (30 minutes)
   - Product Owner presents each high-priority item
   - Teams ask clarifying questions
   - Discuss acceptance criteria and constraints

2. **Initial Team Selection** (15 minutes)
   - Teams indicate interest in specific items
   - Note potential conflicts or overlaps
   - Identify items requiring multi-team collaboration

**Round 2: Coordination and Refinement (60 minutes)**
1. **Multi-Team Items Discussion** (30 minutes)
   - Focus on items requiring coordination between teams
   - Define interfaces and hand-off points
   - Establish communication protocols

2. **Dependency Mapping** (20 minutes)
   - Identify dependencies between selected items
   - Map out critical path items
   - Plan coordination touchpoints

3. **Capacity Validation** (10 minutes)
   - Validate selection against team capacities
   - Adjust selection if needed
   - Confirm feasibility of sprint goal

**Round 3: Finalization (45 minutes)**
1. **Final Item Assignment** (25 minutes)
   - Confirm which teams will work on which items
   - Resolve any remaining conflicts
   - Document team commitments

2. **Cross-Team Coordination Planning** (15 minutes)
   - Schedule integration points
   - Plan daily coordination mechanisms
   - Identify Scrum of Scrums participants

3. **Sprint Goal Confirmation** (5 minutes)
   - Confirm sprint goal is achievable with selected items
   - Get commitment from all teams
   - Document final sprint goal

#### Wrap-up and Next Steps (30 minutes)
1. **Summary and Documentation** (15 minutes)
   - Summarize selected Product Backlog Items
   - Document team assignments and dependencies
   - Share coordination plan with all teams

2. **Part 2 Logistics** (10 minutes)
   - Confirm timing for individual team planning
   - Share any additional information teams need
   - Address final questions

3. **Quick Retrospective** (5 minutes)
   - Gather feedback on Part 1 process
   - Note improvements for next time

---

## Part 2: Individual Team Sprint Planning

### Team Sprint Planning Agenda (2-4 hours)

#### Sprint Planning Part A: What (1-2 hours)
**Participants:** Full team + Scrum Master
**Objective:** Understand and commit to Product Backlog Items

1. **Product Backlog Items Review** (30-45 minutes)
   - Detailed review of items assigned to the team
   - Clarify acceptance criteria and constraints
   - Identify any remaining questions for Product Owner

2. **Sprint Goal Refinement** (15-30 minutes)
   - Refine overall sprint goal for team context
   - Ensure team understands value and priorities
   - Connect team work to product vision

3. **Capacity Planning** (15-30 minutes)
   - Detailed capacity calculation for team
   - Account for ceremonies, meetings, and other commitments
   - Plan for sustainable pace

4. **Initial Commitment** (15-30 minutes)
   - Team discusses and commits to selected items
   - Identify any concerns or risks
   - Document initial sprint backlog

#### Sprint Planning Part B: How (1-2 hours)
**Participants:** Development team + Scrum Master
**Objective:** Create detailed plan for delivery

1. **Task Breakdown** (45-75 minutes)
   - Break down Product Backlog Items into tasks
   - Estimate task efforts and durations
   - Identify task dependencies and sequencing

2. **Coordination Planning** (15-30 minutes)
   - Plan coordination with other teams
   - Schedule integration and review points
   - Identify shared resources or environments

3. **Risk Assessment** (15-30 minutes)
   - Identify technical and coordination risks
   - Plan mitigation strategies
   - Document assumptions and dependencies

4. **Final Plan Review** (15-30 minutes)
   - Review complete sprint plan
   - Validate against capacity and sprint goal
   - Make final adjustments if needed

---

## LeSS Sprint Planning Artifacts

### Overall Sprint Backlog Template

#### Sprint Overview
**Sprint Number:** [Sprint #]
**Sprint Duration:** [Start Date] - [End Date]
**Sprint Goal:** [Clear, measurable goal for the sprint]

#### Product Backlog Items
| Item ID | Title | Team(s) | Story Points | Dependencies | Status |
|---------|-------|---------|--------------|--------------|--------|
| PBI-001 | User authentication system | Team A | 13 | None | Committed |
| PBI-002 | Payment integration | Team B | 8 | PBI-001 | Committed |
| PBI-003 | Reporting dashboard | Team A, C | 21 | PBI-001, PBI-002 | Committed |

#### Cross-Team Dependencies
| Dependency | Providing Team | Consuming Team | Deliverable | Due Date | Status |
|------------|----------------|----------------|-------------|----------|--------|
| D001 | Team A | Team B | Authentication API | Day 8 | Not Started |
| D002 | Team B | Team C | Payment data format | Day 12 | Not Started |

### Individual Team Sprint Backlog

#### Team [Name] Sprint Backlog
**Team Capacity:** [Available hours/points for sprint]
**Team Sprint Goal:** [Team-specific goal aligned with overall sprint goal]

#### Product Backlog Items Detail
**PBI-001: [Title]**
- **Story Points:** [Points]
- **Acceptance Criteria:**
  - [ ] [Criterion 1]
  - [ ] [Criterion 2]
  - [ ] [Criterion 3]

**Tasks:**
| Task | Estimate | Assignee | Dependencies | Status |
|------|----------|----------|--------------|--------|
| Design user interface | 4h | Alice | None | Not Started |
| Implement backend API | 8h | Bob | UI design | Not Started |
| Write unit tests | 4h | Carol | Backend API | Not Started |

#### Daily Coordination Plan
- **Scrum of Scrums Participant:** [Name]
- **Integration Points:** [Planned integration dates/milestones]
- **Communication Channels:** [Slack channels, meetings, etc.]

---

## Coordination Mechanisms

### Scrum of Scrums
**Frequency:** Daily or 3x per week
**Duration:** 15-30 minutes
**Participants:** 1-2 representatives from each team

#### Scrum of Scrums Agenda
1. **Team Updates** (2-3 minutes per team)
   - What did we accomplish yesterday?
   - What will we work on today?
   - What impediments do we have?
   - What might impede other teams?

2. **Dependency Coordination** (5-10 minutes)
   - Update on cross-team dependencies
   - Coordinate integration activities
   - Plan joint work sessions if needed

3. **Issue Escalation** (5-10 minutes)
   - Escalate impediments requiring management attention
   - Coordinate resolution of cross-team issues
   - Plan follow-up actions

### Integration Planning

#### Continuous Integration Strategy
- **Daily Integration:** Teams integrate work daily
- **Mid-Sprint Review:** Multi-team integration check at sprint midpoint
- **Sprint Review Preparation:** Final integration before sprint review

#### Integration Checklist
- [ ] **Technical Integration**
  - [ ] Code merged successfully
  - [ ] All automated tests passing
  - [ ] No integration conflicts

- [ ] **Functional Integration**
  - [ ] Features work together as expected
  - [ ] User experience is coherent
  - [ ] Performance meets requirements

- [ ] **Documentation Integration**
  - [ ] User documentation updated
  - [ ] API documentation current
  - [ ] Deployment guides updated

---

## Common Challenges and Solutions

### Challenge 1: Too Many Teams in Part 1
**Problem:** Part 1 becomes unwieldy with many teams
**Solution:**
- Use representative model (2-3 people per team)
- Pre-filter Product Backlog Items by theme or area
- Use multiple smaller sessions by product area

### Challenge 2: Unequal Team Participation
**Problem:** Some teams dominate discussion while others remain silent
**Solution:**
- Use structured rounds where each team speaks
- Employ facilitation techniques like round-robin
- Encourage quieter teams with direct questions

### Challenge 3: Dependency Complexity
**Problem:** Too many dependencies make coordination difficult
**Solution:**
- Focus on critical path dependencies only
- Use dependency boards for visual management
- Consider re-organizing teams around value streams

### Challenge 4: Product Owner Availability
**Problem:** Product Owner can't provide clarifications to all teams
**Solution:**
- Use Area Product Owners for different domains
- Prepare comprehensive acceptance criteria upfront
- Schedule dedicated Q&A sessions

---

## Tools and Technology

### Recommended Tools

#### Digital Planning Tools
**Jira/Azure DevOps:**
- **Setup:** Shared product backlog across all teams
- **Views:** Team-specific sprint boards
- **Dependencies:** Link related items across teams
- **Reporting:** Sprint burndown and progress tracking

**Miro/Mural:**
- **Visual Planning:** Collaborative sprint planning boards
- **Dependency Mapping:** Visual dependency relationships
- **Retrospectives:** Multi-team retrospective formats
- **Templates:** Reusable planning templates

#### Communication Tools
**Slack/Microsoft Teams:**
- **Channels:** Dedicated channels for cross-team coordination
- **Integrations:** Tool notifications and updates
- **Video:** Quick face-to-face coordination calls
- **Bots:** Automated reminders and status updates

### Physical Planning Setup

#### Room Layout for Part 1
```
Multi-Team Sprint Planning Room Layout

Product Owner        ┌─────────────────┐
Presentation    ──►  │                 │
                     │   Main Screen   │
Team A Table         │                 │
┌─────────────┐     └─────────────────┘     ┌─────────────┐
│ 3 people    │                            │ 3 people    │ Team B Table
│             │     Product Backlog         │             │
└─────────────┘     Wall/Board             └─────────────┘
                    ┌─────────────────┐
Team C Table        │ ┌─┐ ┌─┐ ┌─┐ ┌─┐ │        Team D Table
┌─────────────┐     │ │1│ │2│ │3│ │4│ │     ┌─────────────┐
│ 3 people    │     │ └─┘ └─┘ └─┘ └─┘ │     │ 3 people    │
│             │     └─────────────────┘     │             │
└─────────────┘                            └─────────────┘
```

#### Materials Needed
- Large wall space or multiple whiteboards
- Sticky notes (different colors for different teams)
- Markers and pens
- Flip chart paper
- Timer for timeboxing activities
- Laptop/projector for digital tools

---

## Success Metrics

### Sprint Planning Effectiveness
- **Planning Duration:** Sprint planning completed within allocated time
- **Team Satisfaction:** High team confidence in sprint plan
- **Clarity Score:** Teams have clear understanding of their work
- **Dependency Resolution:** Cross-team dependencies clearly defined

### Sprint Execution Results
- **Sprint Goal Achievement:** Teams deliver committed work
- **Coordination Effectiveness:** Smooth cross-team collaboration
- **Integration Success:** Products integrate without major issues
- **Velocity Predictability:** Teams deliver consistently over time

### Improvement Indicators
- **Planning Time Reduction:** Less time needed for planning over time
- **Fewer Mid-Sprint Changes:** Stable sprint scope
- **Reduced Dependencies:** Teams become more autonomous
- **Higher Quality:** Fewer defects and rework

---

## Customization Guidelines

### Team Size Adaptations

#### Small LeSS Implementation (2-4 teams)
- **Simplified Part 1:** 2-3 hours instead of 4
- **Combined Activities:** Merge some planning activities
- **Informal Coordination:** Less structured coordination mechanisms
- **Single Room:** All teams can plan in same space

#### Medium LeSS Implementation (5-8 teams)
- **Standard Template:** Use template as provided
- **Area Focus:** Consider organizing by product areas
- **Multiple Facilitators:** Use multiple Scrum Masters for coordination
- **Structured Process:** Follow formal process closely

#### Large LeSS Implementation (8+ teams)
- **LeSS Huge Approach:** Consider splitting into multiple Requirement Areas
- **Multiple Sessions:** Run multiple Part 1 sessions by area
- **Area Product Owners:** Use multiple Product Owners
- **Advanced Tooling:** Invest in sophisticated planning tools

### Industry Adaptations

#### Software Development
- **Technical Dependencies:** Focus heavily on code and API dependencies
- **DevOps Integration:** Include deployment and infrastructure planning
- **Architecture Reviews:** Include architecture discussions in planning
- **Performance Planning:** Plan for performance testing and optimization

#### Hardware/Manufacturing
- **Longer Sprints:** Use 4-week sprints for longer development cycles
- **Physical Prototypes:** Plan for prototype creation and testing
- **Supply Chain:** Include supplier dependencies in planning
- **Regulatory Requirements:** Include compliance and certification planning

#### Financial Services
- **Regulatory Focus:** Include compliance reviews in planning
- **Security Requirements:** Plan for security testing and reviews
- **Data Privacy:** Include privacy impact assessments
- **Risk Management:** Detailed risk assessment for each feature

---

## Related Templates
- [Overall Product Backlog Management](./overall_product_backlog_template.md)
- [LeSS Retrospective Template](./less_retrospective_template.md)
- [Cross-Team Coordination Template](./cross_team_coordination_template.md)
- [LeSS Adoption Roadmap](../../quick-start-kits/less-adoption/README.md)

---

## Continuous Improvement

### Sprint Planning Retrospective Questions
1. **Effectiveness:**
   - Did our planning process help us achieve our sprint goal?
   - Were there any gaps in our planning that caused issues?
   - How well did we coordinate across teams?

2. **Efficiency:**
   - Did we spend the right amount of time planning?
   - Which parts of planning were most/least valuable?
   - How can we make planning more efficient?

3. **Collaboration:**
   - How well did teams collaborate during planning?
   - Were there any communication issues?
   - Did everyone have a voice in the planning process?

4. **Future Improvements:**
   - What would we do differently next time?
   - What tools or techniques would help us plan better?
   - How can we better prepare for planning?

### Planning Process Evolution
- **Quarterly Review:** Assess and adjust planning process
- **Tool Evaluation:** Regularly evaluate tools and techniques
- **Facilitation Skills:** Develop Scrum Master facilitation capabilities
- **Cross-Team Learning:** Share best practices between teams

---

## Version History
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | [Date] | Initial LeSS Sprint Planning template | [Author] |

---

*This template is part of the PM Tools Templates library. For more information and additional templates, visit [repository root](../../../../README.md).*

