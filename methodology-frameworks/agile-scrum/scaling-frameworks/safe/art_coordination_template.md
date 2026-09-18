# SAFe Agile Release Train (ART) Coordination Template

## Overview
This template provides a comprehensive framework for coordinating and synchronizing multiple agile teams within a SAFe Agile Release Train (ART). It covers the essential ceremonies, artifacts, and practices needed to ensure effective collaboration and delivery across 5-12 agile teams working toward common PI objectives.

## Template Information
- **Framework:** SAFe (Scaled Agile Framework)
- **Level:** Program (ART)
- **Teams:** 5-12 Agile Teams (50-125 people)
- **Duration:** Program Increment (8-12 weeks)
- **Key Role:** Release Train Engineer (RTE)

---

## ART Structure and Roles

### ART Team Composition
```
Agile Release Train (ART)
├── Release Train Engineer (RTE)
├── Product Management
├── System Architect/Engineering
├── Business Owners
├── Agile Teams (5-12 teams)
│   ├── Team 1: Scrum Master + Product Owner + Dev Team
│   ├── Team 2: Scrum Master + Product Owner + Dev Team
│   ├── Team 3: Scrum Master + Product Owner + Dev Team
│   └── ...
├── System Team (optional)
├── Shared Services (optional)
└── DevOps (optional)
```

### Key Roles and Responsibilities

#### Release Train Engineer (RTE)
- **Primary Responsibility:** Facilitate ART events and processes
- **Key Activities:**
  - Lead PI Planning and other ART events
  - Manage risks, impediments, and dependencies
  - Facilitate cross-team coordination
  - Coach teams and other stakeholders
  - Drive continuous improvement

#### Product Management
- **Primary Responsibility:** Define and prioritize Program Backlog
- **Key Activities:**
  - Develop and communicate product vision
  - Prioritize features and capabilities
  - Participate in solution planning
  - Validate business value delivery

#### System Architect/Engineering
- **Primary Responsibility:** Provide technical leadership
- **Key Activities:**
  - Define system architecture and design
  - Guide technology decisions
  - Facilitate architectural runway
  - Support teams with technical guidance

---

## ART Cadence and Synchronization

### Program Increment (PI) Structure
```
PI Planning (2 days) → Innovation & Planning (1 iteration) → Development (4 iterations) → System Demo → Inspect & Adapt → Next PI
```

### Iteration Structure Within PI
```
Iteration 1: Development + Team Demo
Iteration 2: Development + Team Demo  
Iteration 3: Development + Team Demo
Iteration 4: Development + Team Demo
Iteration 5: Innovation & Planning + System Demo
```

### ART Synchronization Events

#### Weekly ART Sync (Scrum of Scrums)
**Duration:** 30-60 minutes
**Participants:** Scrum Masters, RTE, Product Management
**Frequency:** Weekly

**Agenda Template:**
1. **Team Updates (20-40 minutes)**
   - Each team provides update (2-3 minutes per team)
   - Progress toward PI objectives
   - Blockers and impediments
   - Dependencies needing coordination

2. **Cross-Team Coordination (10-15 minutes)**
   - Dependency resolution
   - Integration planning
   - Resource coordination
   - Risk mitigation

3. **Action Items and Follow-ups (5 minutes)**
   - Assign owners to action items
   - Schedule follow-up meetings
   - Escalate issues if needed

#### Product Owner (PO) Sync
**Duration:** 30-45 minutes
**Participants:** Product Owners, Product Management
**Frequency:** Weekly

**Agenda Template:**
1. **Program Backlog Review (15-20 minutes)**
   - Upcoming feature priorities
   - Backlog refinement needs
   - Market feedback and insights

2. **Feature Coordination (15-20 minutes)**
   - Feature dependencies
   - Integration requirements
   - Business value alignment

3. **Customer Feedback (5-10 minutes)**
   - User feedback review
   - Market insights
   - Competitive analysis updates

#### System Demo
**Duration:** 1-2 hours
**Participants:** All ART members, stakeholders
**Frequency:** Every iteration (except PI Planning iteration)

**Agenda Template:**
1. **Demo Preparation (15 minutes)**
   - Demo order and logistics
   - Technical setup verification
   - Stakeholder introductions

2. **Team Demonstrations (60-90 minutes)**
   - Each team demos completed features (5-10 minutes per team)
   - Focus on integrated functionality
   - Business value demonstration

3. **Stakeholder Feedback (15-30 minutes)**
   - Stakeholder questions and feedback
   - Future direction discussions
   - Value validation

---

## ART Coordination Artifacts

### Program Board
The Program Board visualizes features, dependencies, and milestones across all teams and iterations.

#### Program Board Structure
```
Team/Item        | Iteration 1 | Iteration 2 | Iteration 3 | Iteration 4 | Iteration 5
-----------------|-------------|-------------|-------------|-------------|-------------
Team Alpha       | Feature A1  | Feature A2  | Feature A3  | Feature A4  | Innovation
Team Beta        | Feature B1  | Feature B2  | Feature B3  | Feature B4  | Innovation
Team Gamma       | Feature G1  | Feature G2  | Feature G3  | Feature G4  | Innovation
Team Delta       | Feature D1  | Feature D2  | Feature D3  | Feature D4  | Innovation
Milestones       | M1         | M2         | M3         | PI Demo     | Inspect & Adapt
Dependencies     | [Red lines connecting dependent features across teams]
```

#### Dependency Mapping
- **Red strings/lines:** Critical dependencies between teams
- **Dotted lines:** External dependencies
- **Thick lines:** Dependencies on critical path

### Feature Progress Tracking

#### Feature Status Dashboard
| Feature ID | Feature Name | Owner Team | Status | % Complete | Dependencies | Risks |
|------------|--------------|------------|---------|------------|--------------|-------|
| F001 | User Authentication | Team Alpha | In Progress | 75% | None | Low |
| F002 | Payment Processing | Team Beta | In Progress | 50% | F001 | Medium |
| F003 | Reporting Dashboard | Team Gamma | Not Started | 0% | F001, F002 | High |

#### PI Objective Progress
| Team | PI Objective | Business Value | Status | Confidence | Comments |
|------|--------------|----------------|---------|------------|----------|
| Team Alpha | Implement core auth system | 8 | On Track | 4 | Unit tests complete |
| Team Beta | Payment integration | 9 | At Risk | 2 | Third-party API issues |
| Team Gamma | Analytics foundation | 6 | On Track | 4 | Ahead of schedule |

---

## Risk and Impediment Management

### ROAM (Resolved, Owned, Accepted, Mitigated) Board

#### Risk Classification
```
ROAM Board

Resolved                Owned                   Accepted               Mitigated
- Risk R001: Resolved   - Risk R003: Team Beta  - Risk R007: Budget   - Risk R004: Backup plan
- Risk R002: Closed     - Risk R004: Team Delta - Risk R008: Timeline - Risk R005: Alternative
                        - Risk R005: RTE        - Risk R009: Scope    - Risk R006: Workaround
```

#### Risk Template
**Risk ID:** R[###]
**Title:** [Brief risk description]
**Category:** Technical/Business/External/Resource
**Probability:** High/Medium/Low
**Impact:** High/Medium/Low
**Owner:** [Name/Team]
**Status:** Open/In Progress/Resolved
**ROAM Classification:** Resolved/Owned/Accepted/Mitigated

**Description:**
[Detailed description of the risk]

**Impact Statement:**
[What happens if this risk occurs]

**Mitigation Plan:**
[Actions to reduce probability or impact]

**Contingency Plan:**
[Actions if risk occurs]

**Review Date:** [Date for next review]

### Impediment Tracking

#### Impediment Log
| ID | Impediment | Affected Teams | Owner | Priority | Status | Created | Target Resolution |
|----|------------|----------------|-------|----------|--------|---------|-------------------|
| I001 | Database performance | Team A, C | RTE | High | In Progress | Week 2 | Week 4 |
| I002 | Tool licensing | All Teams | Product Mgmt | Medium | Open | Week 1 | Week 3 |
| I003 | Environment access | Team B | DevOps | High | Resolved | Week 1 | Week 2 |

#### Escalation Process
1. **Team Level:** Scrum Master works with team to resolve
2. **ART Level:** RTE coordinates cross-team resolution
3. **Program Level:** Escalate to Portfolio Management
4. **Organization Level:** Executive intervention required

---

## Dependency Coordination

### Dependency Types

#### Internal Dependencies (Between ART Teams)
- **Consuming Team:** Team that needs deliverable
- **Providing Team:** Team that creates deliverable
- **Deliverable:** Specific item needed
- **Due Date:** When deliverable is needed
- **Status:** Not Started/In Progress/Complete/Blocked

#### External Dependencies (Outside ART)
- **Provider:** External team/organization
- **Deliverable:** What is needed
- **Impact:** Effect on ART if not delivered
- **Contingency:** Alternative plan if not available

### Dependency Coordination Process

#### Weekly Dependency Review
1. **Review Dependency Board (10 minutes)**
   - Check status of all active dependencies
   - Identify newly at-risk dependencies
   - Update completion status

2. **Provider Team Updates (15 minutes)**
   - Teams report on dependencies they're providing
   - Highlight any delivery risks
   - Coordinate handoff logistics

3. **Consumer Team Updates (15 minutes)**
   - Teams report on dependencies they need
   - Clarify requirements and acceptance criteria
   - Adjust plans based on dependency status

4. **Resolution Planning (10 minutes)**
   - Identify blocked dependencies
   - Assign owners for resolution actions
   - Schedule follow-up discussions

### Dependency Agreement Template

**Dependency ID:** D[###]
**Provider Team:** [Team Name]
**Consumer Team:** [Team Name]
**Deliverable:** [Description of what is needed]

**Details:**
- **Format:** [API, Component, Data, etc.]
- **Interface Definition:** [Technical specifications]
- **Acceptance Criteria:** [How consumer will validate]
- **Quality Standards:** [Performance, security requirements]

**Timeline:**
- **Start Date:** [When work begins]
- **Delivery Date:** [When deliverable is available]
- **Integration Date:** [When consumer integrates]

**Communication:**
- **Primary Contacts:** Provider: [Name], Consumer: [Name]
- **Escalation Path:** [Chain of escalation]
- **Update Frequency:** [How often status is shared]

**Risks:**
- **Provider Risks:** [Risks to delivering on time]
- **Consumer Risks:** [Risks to integration]
- **Mitigation Plans:** [Plans to address risks]

---

## ART Metrics and Reporting

### Key Performance Indicators (KPIs)

#### Flow Metrics
- **Throughput:** Features completed per iteration
- **Lead Time:** Time from feature start to deployment
- **Cycle Time:** Time from feature start to completion
- **Work in Progress (WIP):** Number of features in progress

#### Quality Metrics
- **Defect Rate:** Defects per feature
- **Test Coverage:** Percentage of code covered by tests
- **Technical Debt:** Story points allocated to technical debt
- **Customer Satisfaction:** Feedback scores from stakeholders

#### Predictability Metrics
- **PI Predictability:** Percentage of PI objectives achieved
- **Feature Predictability:** Percentage of planned features delivered
- **Iteration Predictability:** Percentage of iteration commitments met
- **Dependency Reliability:** Percentage of dependencies delivered on time

### ART Dashboard Template

#### Weekly ART Health Dashboard
```
ART Health Dashboard - Week [X] of PI [Y]

Team Performance:
┌─────────────┬──────────┬──────────┬────────────┬──────────┐
│ Team        │ Stories  │ Story    │ PI Obj     │ Health   │
│             │ Complete │ Points   │ Progress   │ Score    │
├─────────────┼──────────┼──────────┼────────────┼──────────┤
│ Team Alpha  │ 8        │ 34       │ 65%        │ Green    │
│ Team Beta   │ 6        │ 28       │ 45%        │ Yellow   │
│ Team Gamma  │ 9        │ 41       │ 78%        │ Green    │
│ Team Delta  │ 7        │ 32       │ 55%        │ Yellow   │
└─────────────┴──────────┴──────────┴────────────┴──────────┘

Dependencies:
- Total: 24
- On Track: 18 (75%)
- At Risk: 4 (17%)
- Blocked: 2 (8%)

Risks:
- High: 2
- Medium: 5
- Low: 8

Impediments:
- Open: 6
- In Progress: 4
- Resolved This Week: 3
```

#### PI Progress Report Template
**Program Increment [X] - Week [Y] Status Report**

**Executive Summary:**
[2-3 sentence summary of ART progress and key issues]

**PI Objective Progress:**
- **On Track:** [X] objectives ([X]%)
- **At Risk:** [X] objectives ([X]%)
- **Off Track:** [X] objectives ([X]%)

**Key Accomplishments This Week:**
- [Accomplishment 1]
- [Accomplishment 2]
- [Accomplishment 3]

**Key Risks and Mitigation:**
- **Risk 1:** [Description] - [Mitigation]
- **Risk 2:** [Description] - [Mitigation]

**Impediments Requiring Escalation:**
- [Impediment 1] - [Required action]
- [Impediment 2] - [Required action]

**Upcoming Milestones:**
- [Milestone 1]: [Date] - [Status]
- [Milestone 2]: [Date] - [Status]

**Support Needed:**
- [Request 1]
- [Request 2]

---

## Continuous Improvement

### Inspect and Adapt (I&A) Workshop

#### Workshop Structure (4-6 hours)
1. **PI System Demo (1-2 hours)**
   - Demonstrate integrated PI results
   - Stakeholder feedback collection
   - Business value assessment

2. **Quantitative and Qualitative Measurement (1 hour)**
   - Review PI metrics and performance
   - Analyze flow, quality, and predictability data
   - Identify trends and patterns

3. **Retrospective and Problem-Solving Workshop (2-3 hours)**
   - Identify improvement opportunities
   - Root cause analysis
   - Solution brainstorming and prioritization

#### I&A Retrospective Template

**What Went Well:**
- [Success 1]: [Impact and why it worked]
- [Success 2]: [Impact and why it worked]
- [Success 3]: [Impact and why it worked]

**What Didn't Go Well:**
- [Challenge 1]: [Impact and root causes]
- [Challenge 2]: [Impact and root causes]
- [Challenge 3]: [Impact and root causes]

**Improvement Actions:**
| Priority | Improvement | Owner | Target Date | Success Criteria |
|----------|-------------|-------|-------------|------------------|
| High | [Action 1] | [Owner] | [Date] | [Criteria] |
| Medium | [Action 2] | [Owner] | [Date] | [Criteria] |
| Low | [Action 3] | [Owner] | [Date] | [Criteria] |

### ART Coaching and Maturity

#### ART Maturity Assessment
Rate each area from 1 (Beginning) to 5 (Optimizing):

**Planning and Coordination:**
- [ ] PI Planning effectiveness: [Score]
- [ ] Dependency management: [Score]
- [ ] Cross-team collaboration: [Score]

**Execution and Delivery:**
- [ ] Feature delivery predictability: [Score]
- [ ] Quality and technical practices: [Score]
- [ ] Integration and deployment: [Score]

**Continuous Improvement:**
- [ ] Retrospective effectiveness: [Score]
- [ ] Metrics usage and improvement: [Score]
- [ ] Innovation and learning: [Score]

**Culture and Leadership:**
- [ ] Lean-Agile mindset adoption: [Score]
- [ ] Leadership support: [Score]
- [ ] Team empowerment: [Score]

#### Coaching Focus Areas
Based on maturity assessment, prioritize coaching in:
1. **Low Scoring Areas:** [Areas needing immediate attention]
2. **Medium Scoring Areas:** [Areas for continued development]
3. **High Scoring Areas:** [Areas to maintain and share learnings]

---

## Tool Integration

### Digital ART Coordination Tools

#### Recommended Tool Stack
- **Program Board:** Miro, Mural, or dedicated SAFe tools
- **Backlog Management:** Jira, Azure DevOps, or Rally
- **Communication:** Slack, Microsoft Teams
- **Documentation:** Confluence, SharePoint
- **Metrics:** Built-in tool analytics or custom dashboards

#### Tool Configuration Guidelines

**Jira Configuration for ART:**
- **Projects:** One project per team + one ART project
- **Issue Types:** Epic, Feature, Story, Bug, Task
- **Workflows:** Aligned with team and ART processes
- **Boards:** Team boards + ART Program Board
- **Reports:** Flow metrics, burndown, velocity

**Azure DevOps Configuration:**
- **Team Projects:** One per team + one ART project
- **Work Item Types:** Epic, Feature, User Story, Task, Bug
- **Boards:** Team boards + Program Board
- **Dashboards:** ART metrics and health indicators
- **Repositories:** Code integration and CI/CD

---

## Customization Guidelines

### ART Size Adaptations

#### Small ART (3-5 teams, 30-50 people)
- **Simplified coordination:** Less formal ceremonies
- **Combined roles:** RTE may also be Scrum Master
- **Flexible cadence:** Bi-weekly instead of weekly syncs
- **Streamlined artifacts:** Simplified tracking and reporting

#### Medium ART (5-8 teams, 50-100 people)
- **Standard template:** Use template as provided
- **Dedicated RTE:** Full-time release train engineer
- **Regular cadence:** Weekly synchronization events
- **Complete artifacts:** All tracking and coordination artifacts

#### Large ART (8-12 teams, 100-125 people)
- **Enhanced coordination:** Additional synchronization points
- **Specialized roles:** Dedicated system team, DevOps team
- **Frequent touchpoints:** Daily coordination for critical dependencies
- **Advanced tooling:** Sophisticated tracking and automation

### Industry Adaptations

#### Software Development
- **Technical focus:** Emphasize architecture and technical debt
- **DevOps integration:** Strong CI/CD and deployment coordination
- **Quality gates:** Code review and testing coordination
- **Innovation time:** Dedicated technical exploration

#### Hardware/Manufacturing
- **Longer cycles:** Extended PIs for hardware development
- **Supplier coordination:** External dependency management
- **Prototype management:** Physical deliverable coordination
- **Compliance focus:** Regulatory and safety requirements

#### Financial Services
- **Regulatory compliance:** Enhanced governance and documentation
- **Risk management:** Detailed risk assessment and mitigation
- **Security focus:** Security review and approval processes
- **Audit trails:** Comprehensive documentation and tracking

---

## Related Templates
- [PI Planning Template](./pi_planning_template.md)
- [Portfolio Kanban Template](./portfolio_kanban_template.md)
- [SAFe Metrics Dashboard Template](./metrics_dashboard_template.md)
- [Release Train Engineer Role Guide](../../../role-based-toolkits/release-train-engineer/README.md)
- [Scrum Master Role Guide](../../../role-based-toolkits/scrum-master/README.md)

---

## Success Metrics

### ART Coordination Effectiveness
- **Dependency Resolution Rate:** 90%+ dependencies resolved on time
- **Cross-Team Collaboration:** High team satisfaction scores
- **Communication Effectiveness:** Reduced escalations and conflicts
- **Coordination Overhead:** <10% of team capacity spent on coordination

### Delivery Performance
- **PI Predictability:** 80%+ of PI objectives achieved
- **Feature Delivery:** 85%+ of planned features delivered
- **Quality Metrics:** Defect rates within acceptable thresholds
- **Stakeholder Satisfaction:** High ratings from business stakeholders

---

## Version History
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | [Date] | Initial template creation | [Author] |

---

*This template is part of the PM Tools Templates library. For more information and additional templates, visit [repository root](../../../../README.md).*

