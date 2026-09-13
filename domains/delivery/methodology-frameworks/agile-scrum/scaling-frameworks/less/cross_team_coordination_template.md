---
title: "Cross Team Coordination Template"
methodology: "agile"
complexity: "advanced"
owner: "mirichard"
updated: "2025-08-05"
---

# LeSS Cross-Team Coordination Template

## Overview
This template provides frameworks and practices for effective cross-team coordination in Large-Scale Scrum (LeSS) environments. It focuses on mechanisms that enable multiple teams to work together on a shared Product Backlog while maintaining team autonomy and minimizing coordination overhead.

## Template Information
- **Framework:** LeSS (Large-Scale Scrum)
- **Scope:** Cross-team coordination and collaboration
- **Participants:** All teams, Scrum Masters, Product Owner(s)
- **Frequency:** Daily, weekly, and as-needed coordination
- **Goal:** Seamless collaboration with minimal overhead

---

## Coordination Principles

### LeSS Coordination Principles
1. **Prefer coordination in the code over coordination between people**
2. **Reduce the need for coordination through better design**
3. **When coordination is needed, do it just-in-time**
4. **Keep coordination lightweight and informal**
5. **Focus on value delivery over process compliance**

### Types of Coordination Needed

#### Technical Coordination
- Code integration and shared components
- Architecture decisions and standards
- Technical dependencies and interfaces
- Testing strategies and quality gates

#### Product Coordination
- Feature prioritization and sequencing
- User experience consistency
- Business rule alignment
- Customer feedback integration

#### Process Coordination
- Sprint synchronization
- Release planning and deployment
- Impediment resolution
- Knowledge sharing

---

## Coordination Mechanisms

### Daily Coordination

#### Scrum of Scrums
**Frequency:** Daily or 3x per week
**Duration:** 15-30 minutes
**Participants:** 1-2 representatives from each team

**Standard Questions:**
1. What did your team accomplish yesterday that others should know about?
2. What will your team do today that might affect other teams?
3. What impediments does your team have that other teams could help with?
4. What might your team do that could impede another team?

**Enhanced Questions for LeSS:**
5. What integration points are coming up this sprint?
6. Are there any architectural decisions that need cross-team input?
7. What knowledge or artifacts does your team need from other teams?

#### Community of Practice Meetings
**Frequency:** Weekly
**Duration:** 60 minutes
**Participants:** Practitioners from multiple teams

**Example Communities:**
- **Architecture Community:** System architects, lead developers
- **Testing Community:** Test engineers, quality advocates
- **UX Community:** Designers, user experience researchers
- **DevOps Community:** Infrastructure and deployment specialists

### Weekly Coordination

#### Multi-Team Sprint Review
**Frequency:** End of each sprint
**Duration:** 2-3 hours
**Participants:** All teams, stakeholders, Product Owner(s)

**Agenda:**
1. **Integrated Product Demonstration** (60-90 minutes)
   - Teams demonstrate working together
   - Focus on integrated functionality
   - Stakeholder feedback on complete features

2. **Cross-Team Learnings** (30-45 minutes)
   - Share technical discoveries
   - Discuss integration challenges
   - Plan improvements for next sprint

3. **Planning for Next Sprint** (15-30 minutes)
   - Preview upcoming cross-team work
   - Identify integration points
   - Plan coordination activities

### Sprint-Level Coordination

#### Multi-Team Sprint Planning
**Frequency:** Every sprint
**Duration:** See [LeSS Sprint Planning Template](./less_sprint_planning_template.md)
**Focus:** Coordinate team plans and dependencies

#### Mid-Sprint Coordination
**Frequency:** Mid-sprint (optional)
**Duration:** 30-60 minutes
**Participants:** Team representatives

**Purpose:**
- Check progress on cross-team dependencies
- Adjust plans based on new information
- Resolve emerging coordination issues

---

## Coordination Artifacts

### Dependency Board
Visual representation of cross-team dependencies

```
Dependency Board - Sprint [X]

Team A → Team B:  [User Auth API]     Status: ⚠️ At Risk
Team B → Team C:  [Payment Data]      Status: ✅ On Track  
Team C → Team A:  [Report Format]     Status: 🔴 Blocked
Team D → All:     [Common Library]    Status: ✅ Complete

Legend:
✅ Complete/On Track
⚠️ At Risk
🔴 Blocked/Issues
⏳ Not Started
```

### Integration Calendar
Schedule of planned integration points

| Week | Integration Event | Teams Involved | Deliverables | Success Criteria |
|------|------------------|----------------|--------------|------------------|
| 1 | API Interface Review | A, B | API specification | Signed off by both teams |
| 2 | Component Integration | B, C | Integrated module | All tests passing |
| 3 | End-to-End Testing | All | Complete feature | User acceptance criteria met |
| 4 | Release Preparation | All | Deployment package | Production ready |

### Knowledge Sharing Board
Track knowledge sharing needs and sessions

| Knowledge Area | Expert Team | Learning Teams | Session Planned | Status |
|----------------|-------------|----------------|-----------------|---------|
| Payment Processing | Team B | Team A, C | Week 2 | Scheduled |
| Mobile UI Patterns | Team C | Team A, D | Week 3 | Requested |
| Database Migration | Team A | All | Week 1 | Complete |

---

## Technical Coordination Practices

### Continuous Integration Strategy

#### Shared Code Integration
- **Trunk-Based Development:** All teams work on main branch
- **Feature Branches:** Short-lived branches for cross-team features
- **Integration Frequency:** Multiple times per day
- **Automated Testing:** Comprehensive test suite for integration

#### Code Review Practices
```
Cross-Team Code Review Process

1. Team creates pull request
2. Internal team review (required)
3. Affected team review (if applicable)
4. Architecture review (for significant changes)
5. Merge to main branch
6. Automated deployment to integration environment
```

#### Definition of Done (Shared)
Cross-team Definition of Done includes:
- [ ] Code follows shared coding standards
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Code reviewed by team and affected teams
- [ ] Documentation updated
- [ ] No breaking changes without team agreement
- [ ] Security review completed (if applicable)

### Architecture Coordination

#### Architectural Decision Records (ADRs)
Document significant architectural decisions affecting multiple teams

**ADR Template:**
```
# ADR-[Number]: [Title]

Date: [Date]
Status: [Proposed/Accepted/Deprecated]
Context: [Background and problem description]
Decision: [What was decided]
Consequences: [Positive and negative outcomes]
Teams Affected: [List of teams]
```

#### Architecture Review Board
- **Frequency:** Weekly or bi-weekly
- **Participants:** Architects from each team, senior developers
- **Purpose:** Review and approve significant architectural changes

### Quality Coordination

#### Shared Quality Standards
- **Code Quality:** Shared linting rules, complexity metrics
- **Test Coverage:** Minimum coverage requirements across teams
- **Performance:** Response time and throughput standards
- **Security:** Shared security scanning and review processes

#### Cross-Team Testing Strategy
```
Testing Pyramid for LeSS

                    🔺
                   /   \
              E2E /     \ (Few)
                 /       \
            API /         \ Integration
               /           \ (Some)
          Unit /             \ Tests
             /                 \
            /___________________ \ (Many)
           Team A  Team B  Team C
```

---

## Communication Coordination

### Communication Channels

#### Digital Communication
**Slack/Microsoft Teams Structure:**
```
#general-coordination        - Overall coordination updates
#sprint-planning            - Sprint planning discussions
#technical-architecture     - Architecture decisions
#integration-issues         - Integration problems and solutions
#knowledge-sharing          - Learning and teaching opportunities

Team-specific channels:
#team-a-updates
#team-b-updates
#team-c-updates
```

#### Information Radiators
- **Team Boards:** Visible progress for each team
- **Integration Dashboard:** Status of cross-team work
- **Impediment Board:** Shared impediments and resolution status
- **Architecture Decisions:** Recent ADRs and their impact

### Documentation Coordination

#### Shared Documentation
- **Architecture Documentation:** Maintained collaboratively
- **API Documentation:** Generated automatically from code
- **Process Documentation:** Living documents updated by all teams
- **Runbooks:** Operational procedures shared across teams

#### Documentation Standards
- **Format:** Consistent documentation format across teams
- **Location:** Centralized documentation repository
- **Ownership:** Clear ownership and update responsibilities
- **Review:** Regular review and update cycles

---

## Coordination Challenges and Solutions

### Common Coordination Challenges

#### Challenge 1: Too Much Coordination Overhead
**Symptoms:**
- Teams spending more time in meetings than developing
- Multiple coordination meetings covering same topics
- Coordination activities not adding clear value

**Solutions:**
- **Eliminate Redundant Meetings:** Consolidate similar coordination activities
- **Time-box Coordination:** Strict time limits on coordination activities
- **Value-based Filtering:** Only coordinate on high-value dependencies
- **Asynchronous Communication:** Use async methods when possible

#### Challenge 2: Inconsistent Communication
**Symptoms:**
- Teams getting different information
- Decisions made without involving affected teams
- Important information not reaching all teams

**Solutions:**
- **Single Source of Truth:** Centralized information repository
- **Communication Standards:** Clear protocols for sharing information
- **Stakeholder Mapping:** Identify who needs what information
- **Regular Communication Audits:** Review and improve communication flow

#### Challenge 3: Technical Debt in Shared Components
**Symptoms:**
- Shared code becoming difficult to modify
- Teams avoiding changes to shared components
- Increasing coordination overhead for technical changes

**Solutions:**
- **Shared Ownership:** All teams responsible for shared components
- **Technical Debt Sprint:** Dedicated time for technical debt reduction
- **Architecture Refactoring:** Proactive architectural improvements
- **Component Decoupling:** Reduce dependencies between components

### Coordination Anti-Patterns to Avoid

#### Anti-Pattern 1: Command and Control Coordination
**What It Looks Like:**
- Centralized team making all coordination decisions
- Teams not empowered to coordinate directly
- Rigid coordination processes

**Better Approach:**
- Enable direct team-to-team coordination
- Facilitate rather than control coordination
- Flexible, adaptive coordination mechanisms

#### Anti-Pattern 2: Over-Coordination
**What It Looks Like:**
- Coordinating every small detail
- Multiple approval processes for simple changes
- Fear-driven coordination

**Better Approach:**
- Focus on high-impact coordination only
- Trust teams to coordinate appropriately
- Just-in-time coordination

#### Anti-Pattern 3: Coordination Theater
**What It Looks Like:**
- Coordination meetings without real coordination
- Status reporting without problem-solving
- Process compliance over value delivery

**Better Approach:**
- Focus on actual coordination needs
- Problem-solving orientation
- Measure coordination effectiveness

---

## Tools for Cross-Team Coordination

### Digital Coordination Tools

#### Project Management Tools
**Jira/Azure DevOps:**
- **Cross-Team Boards:** Visibility into all team work
- **Dependency Tracking:** Link related work items
- **Release Planning:** Coordinate releases across teams
- **Reporting:** Cross-team progress and metrics

**Features to Configure:**
- Shared project for cross-team items
- Custom fields for dependency tracking
- Automated notifications for dependency changes
- Cross-team reporting dashboards

#### Collaboration Tools
**Miro/Mural:**
- **Visual Planning:** Cross-team planning sessions
- **Dependency Mapping:** Visual dependency relationships
- **Architecture Diagrams:** Shared technical documentation
- **Retrospective Boards:** Cross-team improvement sessions

**Confluence/Notion:**
- **Shared Documentation:** Architecture and process docs
- **Decision Records:** ADRs and decision tracking
- **Knowledge Base:** Searchable team knowledge
- **Templates:** Standardized documentation formats

### Physical Coordination Tools

#### Coordination Boards
```
Physical Cross-Team Coordination Board

Dependencies          Integration          Knowledge
┌─────────────┐      ┌─────────────┐     ┌─────────────┐
│ Team A → B  │      │ Week 1: API │     │ Payment     │
│ Auth System │      │ Week 2: UI  │     │ Processing  │
│ Due: Week 2 │      │ Week 3: E2E │     │ Expert: B   │
│             │      │ Week 4: QA  │     │ Learners:A,C│
│ Team B → C  │      │             │     │             │
│ Data Format │      │             │     │ Mobile UI   │
│ Due: Week 3 │      │             │     │ Expert: C   │
└─────────────┘      └─────────────┘     └─────────────┘
```

#### Team Space Layout
- **Co-located Teams:** Physical proximity for easy coordination
- **Shared Spaces:** Common areas for cross-team activities
- **Information Radiators:** Visible status and information boards
- **Coordination Zones:** Dedicated spaces for coordination activities

---

## Measuring Coordination Effectiveness

### Coordination Metrics

#### Efficiency Metrics
- **Coordination Overhead:** Percentage of time spent on coordination
- **Decision Speed:** Time from issue identification to resolution
- **Communication Effectiveness:** Information reaching intended recipients
- **Meeting Efficiency:** Productive vs. total coordination time

#### Effectiveness Metrics
- **Dependency Resolution:** Percentage of dependencies resolved on time
- **Integration Success:** Successful integrations vs. total attempts
- **Cross-Team Satisfaction:** Team satisfaction with coordination
- **Value Delivery:** Features delivered requiring cross-team work

#### Quality Metrics
- **Integration Defects:** Defects found in cross-team integrations
- **Rework Due to Coordination:** Work redone due to coordination issues
- **Architecture Consistency:** Adherence to architectural standards
- **Knowledge Sharing:** Effective knowledge transfer between teams

### Coordination Health Check

#### Monthly Coordination Assessment
1. **Are teams able to coordinate effectively without excessive overhead?**
2. **Are dependencies being identified and resolved proactively?**
3. **Is knowledge being shared effectively between teams?**
4. **Are integration points working smoothly?**
5. **Are architectural decisions being made collaboratively?**

#### Quarterly Coordination Review
- **Coordination Process Retrospective:** What's working, what isn't?
- **Tool Effectiveness Review:** Are coordination tools helping or hindering?
- **Communication Audit:** Is information flowing effectively?
- **Dependency Analysis:** What dependencies are we creating/removing?

---

## Continuous Improvement

### Coordination Experiments

#### Experiment 1: Reduce Coordination Meetings
**Hypothesis:** We can maintain coordination effectiveness with fewer meetings
**Test:** Reduce Scrum of Scrums frequency from daily to 3x per week
**Measure:** Coordination effectiveness and team satisfaction
**Duration:** 2 sprints

#### Experiment 2: Async Dependency Updates
**Hypothesis:** Asynchronous dependency updates are more efficient than meetings
**Test:** Use shared board for dependency updates instead of meeting time
**Measure:** Time saved and information accuracy
**Duration:** 1 sprint

#### Experiment 3: Community of Practice Focus
**Hypothesis:** Communities of Practice reduce coordination overhead
**Test:** Invest more in CoP activities, measure coordination needs
**Measure:** Cross-team coordination requests and knowledge sharing
**Duration:** 1 quarter

### Learning and Adaptation

#### Coordination Retrospectives
- **What coordination mechanisms are most/least valuable?**
- **Where do we have too much/too little coordination?**
- **How can we make coordination more efficient?**
- **What tools or practices would improve coordination?**

#### Best Practice Sharing
- **Successful Coordination Patterns:** Document and share effective approaches
- **Lessons Learned:** Share coordination failures and lessons
- **Tool Tips:** Effective use of coordination tools
- **Process Improvements:** Continuous improvement of coordination processes

---

## Related Templates
- [LeSS Sprint Planning Template](./less_sprint_planning_template.md)
- [Overall Product Backlog Management](./overall_product_backlog_template.md)
- [LeSS Retrospective Template](./less_retrospective_template.md)
- [LeSS Adoption Roadmap](../../quick-start-kits/less-adoption/README.md)

---

## Version History
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | [Date] | Initial Cross-Team Coordination template | [Author] |

---

*This template is part of the PM Tools Templates library. For more information and additional templates, visit [repository root](../../../../README.md).*

