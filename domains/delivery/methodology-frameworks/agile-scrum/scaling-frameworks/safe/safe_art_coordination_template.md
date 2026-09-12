---
title: "Safe Art Coordination Template"
methodology: "agile"
complexity: "advanced"
owner: "mirichard"
updated: "2025-08-05"
---

# SAFe ART Coordination Template

**Enterprise:** [Enterprise Name]  
**Portfolio:** [Portfolio Name]  
**Created By:** [Name/Role]  
**Last Updated:** [YYYY-MM-DD]  
**Version:** [1.0]

## 📋 ART Coordination Overview

Agile Release Train (ART) coordination is essential for synchronizing the work of multiple agile teams (5-12 teams, 50-125 people) working together on a common solution. This template provides a comprehensive framework for:

- Synchronizing teams within and across ARTs
- Managing dependencies between teams and with external groups
- Coordinating releases and deployments
- Measuring program-level progress and health
- Establishing effective coordination ceremonies and cadence

This template follows SAFe (Scaled Agile Framework) best practices for program-level coordination.

## 🏗️ ART Structure and Roles

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

## 🔄 ART Synchronization Framework

### Program Increment (PI) Structure
```
PI Planning (2 days) → Development (4 iterations) → System Demo → Inspect & Adapt → Innovation & Planning (1 iteration) → Next PI
```

### Iteration Structure Within PI
```
Iteration 1: Development + Team Demo + System Demo
Iteration 2: Development + Team Demo + System Demo
Iteration 3: Development + Team Demo + System Demo
Iteration 4: Development + Team Demo + System Demo
Iteration 5: Innovation & Planning + PI Planning
```

### ART Synchronization Events

| Event | Frequency | Duration | Participants | Purpose |
|-------|-----------|----------|--------------|---------|
| **PI Planning** | Every PI (8-12 weeks) | 2 days | All ART members, stakeholders | Plan next Program Increment |
| **ART Sync** | Weekly | 30-60 min | Scrum Masters, RTE, Product Management | Cross-team coordination |
| **PO Sync** | Weekly | 30-45 min | Product Owners, Product Management | Feature alignment |
| **System Demo** | End of each iteration | 1-2 hours | All ART members, stakeholders | Demo integrated functionality |
| **Inspect & Adapt** | End of each PI | 4-6 hours | All ART members | Retrospective and improvement |

### Weekly ART Sync (Scrum of Scrums) Agenda

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

### Product Owner (PO) Sync Agenda

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

### Multi-ART Synchronization (for Large Solutions)

When multiple ARTs must coordinate, additional synchronization mechanisms are needed:

| Event | Frequency | Duration | Participants | Purpose |
|-------|-----------|----------|--------------|---------|
| **Solution Train Sync** | Weekly | 60 min | RTEs, Solution Management, Solution Architect | Cross-ART coordination |
| **Solution Demo** | End of PI | 2-3 hours | ART representatives, stakeholders | Demo end-to-end solution |
| **Pre-PI Planning** | Before PI Planning | 1 day | RTEs, Product Management, System Architects | Align ARTs on solution vision |
| **Post-PI Planning** | After PI Planning | 4 hours | RTEs, Product Management, System Architects | Resolve cross-ART dependencies |

## 📊 Dependency Management

### Dependency Types

#### Internal Dependencies (Within ART)
- **Team-to-Team:** Dependencies between teams within the same ART
- **Common examples:** API contracts, shared components, data models

#### External Dependencies (Outside ART)
- **ART-to-ART:** Dependencies between ARTs within the same solution
- **ART-to-Supplier:** Dependencies on external vendors or partners
- **ART-to-Platform:** Dependencies on shared infrastructure or services

### Dependency Visualization - Program Board

The Program Board visualizes features, dependencies, and milestones across all teams and iterations.

```
Team/Item        | Iteration 1 | Iteration 2 | Iteration 3 | Iteration 4 | Iteration 5
-----------------|-------------|-------------|-------------|-------------|-------------
Team Alpha       | Feature A1  | Feature A2  | Feature A3  | Feature A4  | Innovation
                 |      ↓      |             |             |      ↓      |
Team Beta        | Feature B1  | Feature B2  | Feature B3  | Feature B4  | Innovation
                 |             |      ↓      |             |             |
Team Gamma       | Feature G1  | Feature G2  | Feature G3  | Feature G4  | Innovation
                 |             |      ↑      |      ↓      |             |
Team Delta       | Feature D1  | Feature D2  | Feature D3  | Feature D4  | Innovation
Milestones       | M1         | M2          | M3          | PI Demo     | Inspect & Adapt
```

**Legend:**
- **↓ or ↑:** Direction of dependency (provider to consumer)
- **Red arrows:** Critical dependencies on critical path
- **Dotted arrows:** External dependencies (outside ART)

### Dependency Management Process

#### 1. Identification (During PI Planning)
- Teams identify dependencies on Program Board
- Document in Dependency Tracking System
- Classify as internal or external

#### 2. Planning and Negotiation
- Establish delivery dates with provider teams
- Agree on acceptance criteria and interfaces
- Document agreements in Dependency Register

#### 3. Tracking and Monitoring
- Review status in weekly ART Sync
- Visualize on Program Board
- Update Dependency Register

#### 4. Resolution and Closure
- Verify acceptance criteria met
- Mark as resolved in tracking system
- Capture lessons learned

### Dependency Register Template

| ID | Type | Provider | Consumer | Deliverable | Required By | Status | Risk | Last Updated |
|----|------|----------|----------|------------|-------------|--------|------|--------------|
| D001 | Internal | Team Alpha | Team Beta | Authentication API | Iteration 2 | On Track | Low | YYYY-MM-DD |
| D002 | External | ART Falcon | ART Eagle | Payment Service | Iteration 3 | At Risk | High | YYYY-MM-DD |
| D003 | Supplier | Vendor X | Team Delta | SDK Update | Iteration 1 | Complete | - | YYYY-MM-DD |

### Dependency Agreement Template

**Dependency ID:** [D###]  
**Provider:** [Team/ART/Supplier Name]  
**Consumer:** [Team/ART Name]  
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

## 🚀 Release Coordination

### Release Types in SAFe

| Release Type | Timing | Scope | Planning Horizon |
|--------------|--------|-------|------------------|
| **Feature Release** | As completed | Individual features | 1-2 iterations |
| **Capability Release** | Mid-PI or end of PI | Set of related features | 1 PI |
| **Solution Release** | End of PI or multi-PI | Full solution increment | 1-2 PIs |
| **Fixed-Date Release** | Calendar-driven | Features ready by date | Varies |

### Release Management Roles

- **Release Management Team:** Coordinates releases across ARTs
- **Release Train Engineer (RTE):** Facilitates ART-level release activities
- **System Team:** Provides integration, testing, and deployment support
- **DevOps Team:** Manages CI/CD pipeline and release infrastructure

### Release Planning Process

#### Pre-Release Planning (1-2 weeks before PI Planning)
- Define release objectives and scope
- Identify key milestones and dates
- Review architectural runway
- Prepare infrastructure and environments

#### Release Planning (During PI Planning)
- Allocate features to iterations
- Identify integration points
- Establish release criteria
- Plan deployment strategy

#### Release Execution (During PI)
- Track progress in weekly ART Sync
- Manage scope changes
- Coordinate integration and testing
- Address risks and impediments

#### Release Readiness (1-2 weeks before release)
- Conduct go/no-go assessment
- Verify acceptance criteria
- Prepare deployment plans
- Coordinate stakeholder communications

### Release Coordination Board

| Feature | Status | Owner | Integration Status | UAT Status | Release Readiness | Issues |
|---------|--------|-------|-------------------|------------|-------------------|--------|
| F001 | Dev Complete | Team Alpha | Integrated | Passed | Ready | None |
| F002 | Testing | Team Beta | Integrated | In Progress | At Risk | Issue #123 |
| F003 | In Progress | Team Gamma | Not Started | Not Started | Not Ready | Dependency D002 |

### Release Readiness Checklist

**Feature Readiness:**
- [ ] All features complete and tested
- [ ] Feature documentation complete
- [ ] Feature demos approved by Product Management

**Technical Readiness:**
- [ ] All integration tests passed
- [ ] Performance testing complete
- [ ] Security testing complete
- [ ] Technical documentation updated

**Operational Readiness:**
- [ ] Deployment plan approved
- [ ] Rollback plan prepared
- [ ] Monitoring in place
- [ ] Support team trained

**Business Readiness:**
- [ ] User documentation complete
- [ ] Training materials prepared
- [ ] Marketing materials ready
- [ ] Stakeholders notified

### Go/No-Go Meeting Agenda

1. **Release Content Review (15 minutes)**
   - Features included and excluded
   - Known issues and workarounds

2. **Readiness Assessment (20 minutes)**
   - Technical readiness
   - Business readiness
   - Operational readiness

3. **Risk Review (15 minutes)**
   - Outstanding risks
   - Mitigation plans

4. **Decision and Next Steps (10 minutes)**
   - Go/No-Go decision
   - Action items for release execution

## 📈 Metrics and Reporting Across ARTs

### Program Level Metrics

#### Flow Metrics
- **Program Velocity:** Story points completed per iteration
- **Features Delivered:** Number of features completed per PI
- **Cycle Time:** Average time from feature start to completion
- **WIP:** Number of features in progress

#### Predictability Metrics
- **Program Predictability Measure:** % of PI objectives achieved
- **Feature Completion Rate:** % of planned features completed
- **Milestone Achievement:** % of milestones met on time

#### Quality Metrics
- **Defect Density:** Defects per feature
- **Escaped Defects:** Defects found after release
- **Technical Debt:** Story points allocated to technical debt
- **Test Automation Coverage:** % of tests automated

### ART Coordination Metrics

#### Dependency Health
- **Dependency Resolution Rate:** % of dependencies resolved on time
- **Dependency Delays:** Average delay caused by dependencies
- **Cross-ART Dependency Count:** Number of dependencies between ARTs

#### Integration Effectiveness
- **Integration Frequency:** How often teams integrate
- **Integration Success Rate:** % of successful integrations
- **Build Stability:** % of successful builds

#### Collaboration Effectiveness
- **Meeting Efficiency:** Value rating of coordination meetings
- **Information Flow:** Survey rating of cross-team communication
- **Impediment Resolution Time:** Average time to resolve impediments

### ART Health Dashboard

```
ART Health Dashboard - PI [X] - Iteration [Y]

Program Predictability: 85% (▲5%)
Feature Completion:    78% (▼3%)
Dependency Resolution: 92% (▲2%)
Defect Density:        2.3 per feature (▼0.5)

┌─────────────┬──────────┬──────────┬────────────┬──────────┐
│ Team        │ Velocity │ Features │ PI Obj     │ Health   │
│             │ (points) │ Complete │ Progress   │ Score    │
├─────────────┼──────────┼──────────┼────────────┼──────────┤
│ Team Alpha  │ 34       │ 3/4      │ 65%        │ 🟢       │
│ Team Beta   │ 28       │ 2/4      │ 45%        │ 🟡       │
│ Team Gamma  │ 41       │ 4/5      │ 78%        │ 🟢       │
│ Team Delta  │ 32       │ 3/5      │ 55%        │ 🟡       │
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
```

### Multi-ART Coordination Dashboard

For large solutions with multiple ARTs, a higher-level dashboard helps track cross-ART coordination:

```
Solution Train Dashboard - PI [X]

┌─────────────┬───────────┬───────────┬───────────┬────────────┐
│ ART         │ PI Pred.  │ Cross-ART │ Release   │ Solution   │
│             │ Measure   │ Deps      │ Readiness │ Demo Ready │
├─────────────┼───────────┼───────────┼───────────┼────────────┤
│ ART Eagle   │ 85%       │ 8/10      │ 🟢        │ 🟢         │
│ ART Falcon  │ 78%       │ 7/12      │ 🟡        │ 🟡         │
│ ART Griffin │ 92%       │ 9/9       │ 🟢        │ 🟢         │
│ ART Phoenix │ 65%       │ 5/11      │ 🔴        │ 🟡         │
└─────────────┴───────────┴───────────┴───────────┴────────────┘

Solution Level Metrics:
- Feature Completion: 80%
- Integration Success: 85%
- Customer Satisfaction: 4.2/5
- Time-to-Market: -15% YoY
```

### Reporting Cadence

| Report | Frequency | Audience | Purpose |
|--------|-----------|----------|---------|
| **Team Dashboard** | Daily | Team members | Daily tracking and planning |
| **ART Dashboard** | Weekly | ART members, RTE | ART-level progress tracking |
| **PI Status Report** | Bi-weekly | Portfolio stakeholders | Executive visibility |
| **Solution Train Dashboard** | Bi-weekly | Solution management | Multi-ART coordination |

## 🔄 Implementing ART Coordination

### Implementation Steps

1. **Assess Current State**
   - Evaluate team structure and maturity
   - Identify existing coordination mechanisms
   - Assess tooling and metrics capabilities

2. **Design ART Structure**
   - Define ART boundaries and teams
   - Assign key roles (RTE, Product Management, etc.)
   - Establish cadence and ceremonies

3. **Establish Coordination Mechanisms**
   - Configure Program Board
   - Set up dependency tracking
   - Design metrics dashboard

4. **Pilot First PI**
   - Conduct first PI Planning
   - Implement coordination events
   - Monitor and adjust as needed

5. **Continuous Improvement**
   - Conduct regular Inspect & Adapt
   - Refine coordination mechanisms
   - Evolve metrics and reporting

### Common Anti-patterns

| Anti-pattern | Description | Solution |
|--------------|-------------|----------|
| **Coordination Theater** | Going through motions without real coordination | Focus on value-driven outcomes |
| **Excessive Meetings** | Too many coordination touchpoints | Consolidate and make events outcome-focused |
| **Dependency Debt** | Accumulation of unresolved dependencies | Prioritize dependency resolution |
| **Siloed ARTs** | ARTs operating independently | Strengthen Solution Train coordination |
| **Metrics Overload** | Too many metrics without actionable insights | Focus on core flow and predictability metrics |

### Example: Multi-ART Coordination for a Financial System

**Context:** A large financial institution developing a new trading platform with 3 ARTs:
- **ART 1 (Trading Core):** Core trading engine
- **ART 2 (User Experience):** Trading UI and client-facing features
- **ART 3 (Analytics):** Reporting and analytics capabilities

**Coordination Approach:**

1. **Structure**
   - Solution Train with Solution Train Engineer
   - Weekly Solution Train Sync with RTEs from all ARTs
   - Shared System Team for integration

2. **Integration Strategy**
   - Continuous integration environment
   - Daily integration builds
   - Bi-weekly end-to-end testing

3. **Dependency Management**
   - API contracts defined before implementation
   - Cross-ART architectural runway
   - Shared Component Teams for common services

4. **Release Coordination**
   - Synchronized PI cadence
   - Joint Solution Demo
   - Phased deployment strategy

5. **Metrics Focus**
   - Feature completion across ARTs
   - Cross-ART dependency health
   - Integration stability
   - End-to-end quality metrics

## 📄 Additional Resources

- **SAFe Framework:** [www.scaledagileframework.com](https://www.scaledagileframework.com/)
- **Program Board article:** [www.scaledagileframework.com/program-board](https://www.scaledagileframework.com/program-board/)
- **PI Planning article:** [www.scaledagileframework.com/pi-planning](https://www.scaledagileframework.com/pi-planning/)
- **Agile Release Train article:** [www.scaledagileframework.com/agile-release-train](https://www.scaledagileframework.com/agile-release-train/)

## 🔄 Related Templates

- [PI Planning Template](./safe_program_increment_planning_template.md)
- [Portfolio Kanban Template](./safe_portfolio_kanban_template.md)
- [SAFe Metrics Dashboard Template](./metrics_dashboard_template.md)

---

*This template follows the Scaled Agile Framework (SAFe) practices for ART coordination. Customize as needed for your organization's specific implementation of SAFe.*
