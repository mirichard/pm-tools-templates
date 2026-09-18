---
title: Safe Metrics Dashboard Template
methodology: agile
complexity: advanced
owner: mirichard
updated: '2025-08-05'
primary_principles:
- systems-thinking
- collaborative-leadership
secondary_principles:
- adaptability
- value-focus
principle_rationale: Enables enterprise alignment through systems perspective and
  collaborative governance.
---

# SAFe Metrics Dashboard Template

**Enterprise:** [Enterprise Name]  
**Portfolio:** [Portfolio Name]  
**Created By:** [Name/Role]  
**Last Updated:** [YYYY-MM-DD]  
**Version:** [1.0]

## 📋 Metrics Dashboard Overview

A comprehensive metrics dashboard is essential for effective measurement and improvement in a SAFe environment. This template provides a structured approach to implementing metrics at all levels of the Scaled Agile Framework:

- **Team Level:** Focused on iteration delivery and team performance
- **Program Level:** Measuring ART effectiveness and program increment success
- **Large Solution Level:** Tracking solution train coordination and capability delivery
- **Portfolio Level:** Monitoring strategic alignment and business outcomes

This template follows SAFe best practices for metrics and measurement, emphasizing flow, outcomes, competency, and predictability.

## 🔄 SAFe Measurement Framework

### Core Measurement Domains

| Domain | Focus | Purpose | Examples |
|--------|-------|---------|----------|
| **Flow** | Efficiency of value delivery | Measure how value moves through the system | Lead time, cycle time, throughput, WIP |
| **Outcomes** | Business and customer results | Measure actual benefits delivered | Revenue, customer satisfaction, cost savings |
| **Competency** | Organizational capabilities | Measure maturity in SAFe practices | Training completion, practice adoption |
| **Predictability** | Planning reliability | Measure accuracy of forecasts | PI commitments met, estimation accuracy |

### Big Picture: Metrics Alignment with SAFe Levels

```
┌─────────────────────────────────────────────────────────────┐
│                     Portfolio Level                         │
│  • Epic throughput and lead time                            │
│  • Investment distribution across value streams              │
│  • Business outcomes and strategic alignment                 │
│  • Portfolio ROI and financial metrics                       │
├─────────────────────────────────────────────────────────────┤
│                 Large Solution Level                        │
│  • Capability delivery and integration                       │
│  • Solution quality and performance                          │
│  • Cross-ART coordination                                    │
│  • Solution train synchronization                            │
├─────────────────────────────────────────────────────────────┤
│                    Program Level                            │
│  • Feature flow and delivery                                 │
│  • Program increment predictability                          │
│  • Business value achievement                                │
│  • ART performance and dependencies                          │
├─────────────────────────────────────────────────────────────┤
│                     Team Level                              │
│  • Story completion and velocity                             │
│  • Team quality and technical metrics                        │
│  • Iteration goals achievement                               │
│  • Team health and improvement                               │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Team-Level Metrics Dashboard

### Agile Team Performance Metrics

#### Iteration/Sprint Flow Metrics

| Metric | Current | Target | Trend | Purpose |
|--------|---------|--------|-------|---------|
| **Velocity (points)** | 52 | 45-55 | ↑ | Measure team capacity |
| **Predictability %** | 92% | >90% | → | % of committed work completed |
| **Cycle Time (days)** | 3.2 | <4 | ↓ | Time from start to completion |
| **Lead Time (days)** | 8.1 | <10 | ↓ | Time from request to delivery |
| **WIP (stories)** | 5 | 4-6 | → | Work in progress at any time |

#### Team Velocity Chart Example

```
Team Velocity (Story Points)

Iteration:  1   2   3   4   5   6   7   8   9  10
Actual:    42  45  48  52  49  51  47  53  55  52
Committed: 45  45  50  50  50  50  50  50  50  50
        ┌─────────────────────────────────────┐
     60 │                    ●               │
     55 │            ●   ●   ● ●   ●   ●     │ ● Actual
     50 │    ●   ●   ●       ●       ●       │ ■ Committed  
     45 │■■■ ●■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■│
     40 │●                                   │
        └─────────────────────────────────────┘
```

#### Team Quality Metrics

| Metric | Current | Target | Trend | Purpose |
|--------|---------|--------|-------|---------|
| **Defect Density** | 0.8/story | <1.0 | ↓ | Quality of delivered work |
| **Test Coverage %** | 87% | >85% | ↑ | Code covered by automated tests |
| **Technical Debt Hours** | 24 | <30 | ↓ | Hours allocated to tech debt |
| **Build Success Rate** | 95% | >95% | → | % of successful builds |
| **Code Review Coverage** | 100% | 100% | → | % of code reviewed before merge |

#### Team Health Radar

```
Team Health Assessment
                   Leadership
                       5
                       │
                       │
     Learning  4       │       4  Fun
                 ●─────┼─────●
             3   │     │     │   3
                 │     │     │
                 │     │     │
     Process  4 ●│─────┼─────│● 5  Delivery
                 │     │     │
                 │     │     │
             3   │     │     │   3
                 ●─────┼─────●
  Collaboration         │         Technical
                       4           Practices
                       
Team Health Score: 4.0/5.0 (Good)
```

### Team Dashboard Implementation Example

#### Daily Standup Board

```
Team Alpha - Iteration 7 Dashboard

┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  TO DO (4)     │  │  IN PROGRESS (5)│  │  DONE (8)      │
├────────────────┤  ├────────────────┤  ├────────────────┤
│ STORY-128      │  │ STORY-123      │  │ STORY-115      │
│ User Settings  │  │ User Login     │  │ Profile Page   │
│                │  │ (Sarah)        │  │ (Alex)         │
├────────────────┤  ├────────────────┤  ├────────────────┤
│ STORY-129      │  │ STORY-124      │  │ STORY-116      │
│ Report Export  │  │ Dashboard      │  │ Bug Fix #345   │
│                │  │ (Tom)          │  │ (Lisa)         │
├────────────────┤  ├────────────────┤  ├────────────────┤
│ STORY-130      │  │ STORY-125      │  │ STORY-117      │
│ Email Notif.   │  │ Data Import    │  │ Database Query │
│                │  │ (Mike)         │  │ (Chris)        │
├────────────────┤  ├────────────────┤  ├────────────────┤
│ STORY-131      │  │ STORY-126 🚩   │  │ STORY-118      │
│ Password Reset │  │ Payment API    │  │ Login Security │
│                │  │ (David)        │  │ (Sarah)        │
│                │  ├────────────────┤  ├────────────────┤
│                │  │ STORY-127      │  │ ...more        │
│                │  │ Error Handling │  │                │
│                │  │ (Lisa)         │  │                │
└────────────────┘  └────────────────┘  └────────────────┘

BLOCKERS:
- STORY-126: External API dependency - waiting for credentials
```

#### Data Collection Guidelines

1. **Velocity and Predictability:**
   - Track in ALM tool (Jira, Azure DevOps, etc.)
   - Measure at end of each iteration
   - Include team commitment vs. actual

2. **Quality Metrics:**
   - Pull from CI/CD pipeline and code analysis tools
   - Update daily or with each build
   - Track trends over time with control limits

3. **Team Health:**
   - Monthly team self-assessment
   - Facilitated by Scrum Master
   - Anonymous input with group discussion

## 📈 Program (ART) Level Metrics Dashboard

### Program Increment (PI) Performance

#### PI Objectives Achievement

| Team | PI Objectives | Business Value | Actual Achievement | Predictability |
|------|---------------|----------------|-------------------|---------------|
| Team Alpha | 5 | 40 | 37 (93%) | On Target |
| Team Beta | 4 | 35 | 31 (89%) | On Target |
| Team Gamma | 6 | 45 | 43 (96%) | On Target |
| Team Delta | 4 | 30 | 24 (80%) | At Risk |
| **ART Total** | **19** | **150** | **135 (90%)** | **On Target** |

#### Program Predictability Measure

```
Program Predictability Trend

PI:        1    2    3    4    5    Current
Actual:   82%  90%  85%  88%  90%  90%
       ┌─────────────────────────────────────┐
   100%│                                     │
       │                                     │
    90%│     ●──●     ●─────●               │
       │         │   ╱                       │
    80%│●        │  ╱                        │ ──── Target Range (80-100%)
       │         │╱                          │ ●     Actual
    70%│         ╱                           │
       │        ╱                            │
    60%│                                     │
       └─────────────────────────────────────┘
        PI-1   PI-2   PI-3   PI-4   PI-5  Current
```

### Feature Flow Metrics

#### Feature Flow Dashboard

| Metric | Current PI | Previous PI | Trend | Target |
|--------|------------|-------------|-------|--------|
| **Features Planned** | 22 | 20 | ↑ | Based on capacity |
| **Features Completed** | 18 | 17 | ↑ | >80% of planned |
| **Average Feature Cycle Time** | 3.2 weeks | 3.5 weeks | ↓ | <3.5 weeks |
| **Feature Lead Time** | 6.1 weeks | 6.8 weeks | ↓ | <7 weeks |
| **Features in Progress** | 12 | 14 | ↓ | WIP Limit: 15 |

#### Cumulative Flow Diagram

```
Feature Cumulative Flow Diagram - Current PI
       ┌───────────────────────────────────────────┐
    40 │                                           │
       │                         Done              │
    35 │                   ●─────●─────●─────●─────│
       │              ●────┤                       │
    30 │         ●────┤    │                       │
       │    ●────┤    │    │                       │
    25 │────┤    │    │    │                       │
       │    │    │    │    │     Testing           │
    20 │    │    │    │    │                       │
       │    │    │    │●────●─────●─────●─────●────│
    15 │    │    │●───┤    │                       │
       │    │●───┤    │    │                       │
    10 │●───┤    │    │    │  In Development       │
       │    │    │    │    │                       │
     5 │    │    │    │●────●─────●─────●─────●────│
       │    │    │●───┤    │                       │
     0 │────────────────────────────────────────────│
       │  W1   W2   W3   W4   W5    W6    W7    W8 │
       └───────────────────────────────────────────┘
```

### Program-Level Dependencies

#### Dependency Tracking Board

| ID | Type | Provider | Consumer | Deliverable | Required By | Status | Risk |
|----|------|----------|----------|------------|-------------|--------|------|
| D001 | Internal | Team Alpha | Team Beta | User Auth API | Iteration 2 | Complete | - |
| D002 | Internal | Team Gamma | Team Delta | Reporting Engine | Iteration 3 | At Risk | Medium |
| D003 | External | Vendor | Team Alpha | SDK Update | Iteration 3 | On Track | Low |
| D004 | ART-to-ART | ART Falcon | This ART | Payment Gateway | PI Boundary | Delayed | High |

#### Program Risk Management

```
ROAM Board - Current PI

┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  RESOLVED (3)  │  │  OWNED (4)     │  │  ACCEPTED (2)  │  │  MITIGATED (3) │
├────────────────┤  ├────────────────┤  ├────────────────┤  ├────────────────┤
│ R001: Dev Env  │  │ R005: API      │  │ R011: Release  │  │ R015: Security │
│ performance    │  │ performance    │  │ date fixed     │  │ vulnerability  │
├────────────────┤  ├────────────────┤  ├────────────────┤  ├────────────────┤
│ R002: Team     │  │ R006: Database │  │ R012: Budget   │  │ R016: Browser  │
│ onboarding     │  │ migration      │  │ constraints    │  │ compatibility  │
├────────────────┤  ├────────────────┤  │                │  ├────────────────┤
│ R003: Tooling  │  │ R007: External │  │                │  │ R017: Data     │
│ licenses       │  │ dependency     │  │                │  │ migration      │
│                │  ├────────────────┤  │                │  │                │
│                │  │ R008: Testing  │  │                │  │                │
│                │  │ automation     │  │                │  │                │
└────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘
```

### ART Quality and Delivery Metrics

| Metric | Current | Target | Trend | Purpose |
|--------|---------|--------|-------|---------|
| **Defect Escape Rate** | 2.5% | <3% | ↓ | % of defects found post-release |
| **Mean Time to Repair** | 3.2 hrs | <4 hrs | ↓ | Time to fix production issues |
| **Release Frequency** | 2 wks | 2 wks | → | How often software is released |
| **Integration Success** | 92% | >90% | ↑ | % of successful integrations |
| **Technical Debt Ratio** | 14% | <15% | → | % of effort on technical debt |

#### Data Collection Guidelines

1. **Program Increment Metrics:**
   - Collect at PI boundaries
   - Aggregate team-level data
   - RTE responsible for dashboard maintenance

2. **Feature Flow Metrics:**
   - Track in program-level backlogs
   - Update weekly in ART sync
   - Product Management reviews for business alignment

3. **Dependency and Risk Tracking:**
   - Update in weekly ART sync meetings
   - Maintain ROAM board for risk management
   - Automate status updates where possible

## 🌐 Large Solution Level Dashboard

### Solution Train Metrics

#### Capability Tracking

| Capability | Contributing ARTs | Progress | Planned Release | Status |
|------------|------------------|----------|----------------|---------|
| Customer Portal | ART Alpha, ART Beta | 75% | Q2 2023 | On Track |
| Payment Processing | ART Beta, ART Gamma | 60% | Q3 2023 | At Risk |
| Data Analytics | ART Alpha, ART Delta | 45% | Q4 2023 | On Track |
| Mobile Platform | ART Gamma | 80% | Q2 2023 | On Track |

#### Solution Integration Health

```
Solution Integration Success Rate

Sprint:    1    2    3    4    5    6    7    8
Success %: 70   75   80   85   90   88   92   95
       ┌────────────────────────────────────────┐
   100%│                                ●       │
       │                         ●─────╱        │
    90%│                    ●────╱              │ ● Success Rate
       │               ●────╱                   │ ----- Trend
    80%│          ●────╱                        │
       │     ●────╱                             │
    70%│●────╱                                  │
       │                                        │
    60%│                                        │
       └────────────────────────────────────────┘
```

### Cross-ART Coordination

#### Solution Train Dependencies

| Provider ART | Consumer ART | Capability | Dependency | Due Date | Status |
|--------------|--------------|------------|------------|----------|---------|
| ART Alpha | ART Beta | Customer Portal | Authentication | PI 4-I2 | Complete |
| ART Beta | ART Gamma | Payment Processing | API Gateway | PI 4-I3 | At Risk |
| ART Gamma | ART Delta | Mobile Platform | SDK Integration | PI 4-I4 | On Track |
| ART Delta | ART Alpha | Data Analytics | Reporting Engine | PI 5-I1 | Not Started |

#### Solution Roadmap Progress

```
Solution Roadmap - 2023

                Q1               Q2               Q3               Q4
        ┌────────────────┬────────────────┬────────────────┬────────────────┐
Auth    │████████████████│                │                │                │
System  │   COMPLETED    │                │                │                │
        ├────────────────┼────────────────┼────────────────┼────────────────┤
Customer│                │████████████████│████████▒▒▒▒▒▒▒▒│                │
Portal  │                │  IN PROGRESS   │  PLANNED       │                │
        ├────────────────┼────────────────┼────────────────┼────────────────┤
Payment │                │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│████████████████│████████▒▒▒▒▒▒▒▒│
System  │                │  PLANNED       │  PLANNED       │  PLANNED       │
        ├────────────────┼────────────────┼────────────────┼────────────────┤
Data    │                │                │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│████████████████│
Platform│                │                │  PLANNED       │  PLANNED       │
        ├────────────────┼────────────────┼────────────────┼────────────────┤
Mobile  │                │████████████████│████████████████│                │
App     │                │  IN PROGRESS   │  PLANNED       │                │
        └────────────────┴────────────────┴────────────────┴────────────────┘
```

### Solution Quality Metrics

| Metric | Current | Target | Trend | Purpose |
|--------|---------|--------|-------|---------|
| **End-to-End Quality** | 89% | >90% | ↑ | System-level quality assessment |
| **System Performance** | 97% | >95% | → | Performance against SLAs |
| **Integration Success** | 92% | >90% | ↑ | Success rate of integrations |
| **Security Compliance** | 100% | 100% | → | Adherence to security standards |

#### Data Collection Guidelines

1. **Capability Tracking:**
   - Solution Management maintains capability roadmap
   - Update status bi-weekly in Solution Train sync
   - Verify with ARTs and stakeholders

2. **Cross-ART Dependencies:**
   - Document during Pre-PI Planning
   - Review in Solution Train sync meetings
   - Solution Train Engineer maintains dashboard

3. **Solution Integration:**
   - Measure during solution demos
   - System Team collects technical metrics
   - Update after each integration point

## 📈 Portfolio Level Dashboard

### Epic Flow Metrics

#### Portfolio Kanban Flow

| Epic State | Current Count | WIP Limit | Avg. Time in State | Trend |
|------------|---------------|-----------|-------------------|-------|
| **Funnel** | 25 | None | N/A | ↑ |
| **Reviewing** | 8 | 10 | 2.5 weeks | → |
| **Analyzing** | 5 | 5 | 3.2 weeks | → |
| **Portfolio Backlog** | 12 | 15 | 5.5 weeks | ↓ |
| **Implementing** | 14 | 8 | 12.3 weeks | ↑ |
| **Done** | 6 (this quarter) | None | N/A | ↑ |

#### Epic Lead Time Breakdown

```
Epic Lead Time Distribution (Weeks)

                    0    5    10   15   20   25   30   35
                    ├────┼────┼────┼────┼────┼────┼────┤
Funnel to           ▒▒▒▒▒▒▒▒▒▒
Reviewing           [2.1 weeks avg]

Reviewing to        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
Analyzing           [3.2 weeks avg]

Analyzing to        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
Portfolio Backlog   [4.3 weeks avg]

Backlog to          ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
Implementing        [5.1 weeks avg]

Implementing to     ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
Done                [12.3 weeks avg]
                    ├────┼────┼────┼────┼────┼────┼────┤
                    0    5    10   15   20   25   30   35

Total Epic Lead Time (Funnel to Done): 27.0 weeks average
```

### Strategic Portfolio Metrics

#### Investment Distribution

```
Portfolio Investment Distribution

┌───────────────────────────────────────────────────────┐
│                                                       │
│  ┌─────────┐                            ┌─────────┐   │
│  │         │                            │         │   │
│  │  40%    │        Growth             │   25%   │   │
│  │         │        Business           │         │   │
│  │         │                           │         │   │
│  └─────────┘                           └─────────┘   │
│                                                       │
│                                                       │
│  ┌─────────┐                            ┌─────────┐   │
│  │         │                            │         │   │
│  │  20%    │        Operational        │   15%   │   │
│  │         │        Excellence         │         │   │
│  │         │                           │         │   │
│  └─────────┘                           └─────────┘   │
│                                                       │
└───────────────────────────────────────────────────────┘

Target Split: 40% Growth / 25% Transformation / 20% Operations / 15% Compliance
Actual Split: 38% Growth / 27% Transformation / 22% Operations / 13% Compliance
```

#### Business Outcomes Dashboard

| Outcome | Metric | Target | Actual | Status |
|---------|--------|--------|--------|--------|
| **Revenue Growth** | Q2 Incremental Revenue | $2.5M | $2.8M | Exceeding |
| **Customer Retention** | Renewal Rate | 90% | 94% | Exceeding |
| **Operational Efficiency** | Process Cost | -10% | -8% | At Risk |
| **Product Quality** | CSAT Score | 4.2/5 | 4.3/5 | On Target |
| **Time to Market** | Concept to Cash | 6 months | 7.2 months | At Risk |

### Portfolio ROI Tracking

| Epic | Investment | Target ROI | Actual/Projected ROI | Status |
|------|------------|------------|---------------------|---------|
| Customer Portal | $1.2M | 200% | 230% | Complete |
| Data Analytics | $850K | 150% | 160% | In Progress |
| Mobile App v2 | $950K | 180% | 150% | At Risk |
| Security Overhaul | $500K | 120% | 140% | On Target |

#### Data Collection Guidelines

1. **Epic Flow Metrics:**
   - LPM team tracks in portfolio management tool
   - Update weekly during portfolio sync
   - Calculate lead and cycle times monthly

2. **Investment Distribution:**
   - Finance team provides quarterly updates
   - Lean Portfolio Management reviews alignment
   - Adjust allocations based on strategic themes

3. **Business Outcomes:**
   - Product Management collects customer metrics
   - Finance provides business performance data
   - Monthly executive dashboard review

## 📊 Competency and Maturity Metrics

### SAFe Practice Adoption

#### Core Competency Radar

```
SAFe Competency Radar
                   Lean-Agile 
                   Leadership
                       4
                       │
                       │
Continuous   3         │        3   Team and Technical
Learning     ●─────────┼─────────●  Agility
Culture                │
                       │
                       │
                3      │        4
Organizational ●───────┼────────● Agile Product
Agility                │          Delivery
                       │
                       │
                 2     │      3
Enterprise      ●──────┼──────● Lean Portfolio
Solution Delivery      │        Management
                       
Maturity Scale: 1-Beginning, 2-Developing, 3-Performing, 4-Optimizing, 5-Leading
```

#### Training and Certification Progress

| Role | Required Training | Completion % | Target % | Gap |
|------|------------------|--------------|---------|-----|
| **Executives** | Leading SAFe | 85% | 100% | 15% |
| **Product Owners** | SAFe PO/PM | 90% | 95% | 5% |
| **Scrum Masters** | SAFe SM | 95% | 100% | 5% |
| **Team Members** | SAFe for Teams | 85% | 90% | 5% |
| **Architects** | SAFe for Architects | 75% | 85% | 10% |

### Continuous Improvement Metrics

| Metric | Current | Target | Trend | Purpose |
|--------|---------|--------|-------|---------|
| **Inspect & Adapt Actions** | 24 | N/A | ↑ | # of improvement actions |
| **I&A Completion Rate** | 80% | >85% | ↑ | % of actions completed |
| **Innovation Rate** | 15% | >10% | → | % of time on innovation |
| **Process Improvement ROI** | 3.5x | >3x | ↑ | Return on improvement efforts |

#### Data Collection Guidelines

1. **Competency Assessment:**
   - Quarterly facilitated assessments
   - RTE and LACE team collaborate
   - Include representative cross-section of roles

2. **Training Metrics:**
   - HR systems track certification data
   - Quarterly reporting to leadership
   - Include both formal and informal learning

3. **Improvement Metrics:**
   - Track in action management system
   - Review during PI ceremonies
   - RTE/STE responsible for follow-up

## 📉 Visualization and Reporting Guidelines

### Dashboard Design Best Practices

1. **Information Hierarchy:**
   - **Level 1:** Executive summary with key performance indicators
   - **Level 2:** Drill-down dashboards for specific domains
   - **Level 3:** Detailed metrics for analysis and action

2. **Visual Design Elements:**
   - Use consistent color coding (Red/Yellow/Green)
   - Include trend indicators (↑/↓/→)
   - Provide historical context with trend lines
   - Use appropriate chart types for data representation

3. **Dashboard Organization:**
   - Group related metrics together
   - Provide both leading and lagging indicators
   - Include targets and thresholds
   - Allow filtering by timeframe and organizational unit

### Tool Implementation Options

| Tool Type | Examples | Best For | Considerations |
|-----------|----------|----------|---------------|
| **ALM Tools** | Jira, Azure DevOps, Rally | Team-level metrics | Limited customization |
| **BI Tools** | Tableau, Power BI | Executive dashboards | Integration effort |
| **Custom Dashboards** | Grafana, ELK Stack | DevOps, technical metrics | Technical expertise |
| **SAFe-Specific** | SAFe Metrics app | Comprehensive SAFe metrics | Cost, vendor lock-in |

### Implementation Example

```
Data Pipeline Architecture

Sources          →   Collection    →   Processing     →   Presentation
┌─────────────┐      ┌─────────┐      ┌─────────┐      ┌─────────────┐
│ ALM Tool    │      │         │      │         │      │ Executive   │
│ (Jira)      │──┐   │         │      │         │      │ Dashboard   │
└─────────────┘  │   │         │      │         │      └─────────────┘
                 │   │ Data    │      │ Analytics│
┌─────────────┐  ├──▶│ Lake    │─────▶│ Engine  │─────▶┌─────────────┐
│ CI/CD       │  │   │         │      │         │      │ Program     │
│ (Jenkins)   │──┘   │         │      │         │      │ Dashboard   │
└─────────────┘      │         │      │         │      └─────────────┘
                     └─────────┘      └─────────┘
┌─────────────┐                                        ┌─────────────┐
│ Financial   │                                        │ Team        │
│ Systems     │──────────────────────────────────────▶│ Dashboard   │
└─────────────┘                                        └─────────────┘
```

## 🔄 Metrics Governance and Improvement

### Metrics Lifecycle Management

1. **Introduction Process:**
   - Define business purpose and hypothesis
   - Establish calculation method and data sources
   - Set initial targets and thresholds
   - Create visualization and reporting

2. **Review Process:**
   - Quarterly metrics review with stakeholders
   - Validate continued relevance and accuracy
   - Adjust targets based on trends and goals
   - Address data quality issues

3. **Retirement Process:**
   - Identify metrics with low value or usage
   - Validate with stakeholders before removal
   - Archive historical data for reference
   - Document decision and rationale

### Common Anti-Patterns

| Anti-pattern | Description | Solution |
|--------------|-------------|----------|
| **Metrics Overload** | Too many metrics without focus | Focus on 5-7 key metrics per level |
| **Vanity Metrics** | Metrics that look good but drive no action | Tie metrics to business outcomes |
| **Measurement Theater** | Collecting metrics without using them | Review utilization and decisions driven |
| **Gaming the System** | Behaviors that improve metrics but not outcomes | Balance metrics and focus on outcomes |
| **Analysis Paralysis** | Excessive data without action | Time-box analysis and require actions |

## 📄 Additional Resources

- **SAFe Framework:** [www.scaledagileframework.com](https://www.scaledagileframework.com/)
- **SAFe Metrics Article:** [www.scaledagileframework.com/metrics](https://www.scaledagileframework.com/metrics/)
- **Flow Metrics:** [www.scaledagileframework.com/flow-metrics](https://www.scaledagileframework.com/flow-metrics/)
- **Measure and Grow Article:** [www.scaledagileframework.com/measure-and-grow](https://www.scaledagileframework.com/measure-and-grow/)

## When to Use

Use throughout the project lifecycle to identify, assess, and track risks. This template is essential for projects with significant complexity, multiple stakeholders, or high business impact, where structured risk management provides decision-making value.

## When NOT to Use

Do not use for very low-risk, short-duration tasks where informal risk awareness is sufficient. Avoid this template if your governance framework requires a different risk management approach or if stakeholders prefer real-time risk dashboards over static registers.

## 🔄 Related Templates

- [PI Planning Template](./safe_program_increment_planning_template.md)
- [Portfolio Kanban Template](./safe_portfolio_kanban_template.md)
- [ART Coordination Template](./safe_art_coordination_template.md)

---

*This template follows the Scaled Agile Framework (SAFe) practices for metrics and measurement. Customize as needed for your organization's specific implementation of SAFe.*
