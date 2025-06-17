# SAFe Metrics and Reporting Dashboard Template

## Overview
This template provides a comprehensive framework for implementing SAFe metrics and reporting dashboards across all levels of the organization - Team, Program (ART), Large Solution, and Portfolio. It includes key performance indicators (KPIs), measurement practices, and dashboard designs that support decision-making and continuous improvement in SAFe implementations.

## Template Information
- **Framework:** SAFe (Scaled Agile Framework)
- **Scope:** All SAFe levels (Team, Program, Large Solution, Portfolio)
- **Purpose:** Measure flow, quality, outcomes, and competency
- **Audience:** Teams, Management, Leadership, Stakeholders
- **Update Frequency:** Real-time to quarterly, depending on metric

---

## SAFe Measurement Framework

### Four Measurement Domains

#### 1. Flow Metrics
**Purpose:** Measure the flow of value through the system
**Focus:** Throughput, flow time, flow load, flow efficiency, flow distribution

#### 2. Outcomes Metrics  
**Purpose:** Measure business and customer outcomes
**Focus:** Business results, customer satisfaction, operational performance

#### 3. Competency Metrics
**Purpose:** Measure organizational and individual capabilities
**Focus:** Lean-Agile maturity, skills development, coaching effectiveness

#### 4. Predictability Metrics
**Purpose:** Measure planning accuracy and reliability
**Focus:** PI objective achievement, commitment reliability, estimation accuracy

---

## Team-Level Metrics Dashboard

### Team Flow Metrics

#### Sprint/Iteration Metrics
| Metric | Current Sprint | Last Sprint | Trend | Target |
|--------|---------------|-------------|-------|--------|
| Stories Committed | 12 | 10 | ↑ | 10-12 |
| Stories Completed | 11 | 9 | ↑ | 90%+ |
| Story Points Committed | 55 | 48 | ↑ | 45-55 |
| Story Points Completed | 52 | 45 | ↑ | 90%+ |
| Cycle Time (avg days) | 3.2 | 3.8 | ↓ | <4 |
| Lead Time (avg days) | 8.1 | 9.2 | ↓ | <10 |

#### Team Velocity Tracking
```
Team Velocity Trend (Story Points)

Sprint:  1   2   3   4   5   6   7   8   9  10
Actual: 42  45  48  52  49  51  47  53  55  52
Plan:   45  45  50  50  50  50  50  50  50  50
        ┌─────────────────────────────────────┐
     60 │                    ●               │
     55 │            ●   ●   ● ●   ●   ●     │ ● Actual
     50 │    ●   ●   ●       ●       ●       │ ■ Planned  
     45 │■■■ ●■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■│
     40 │●                                   │
        └─────────────────────────────────────┘
```

#### Quality Metrics
| Metric | Current | Target | Trend |
|--------|---------|--------|-------|
| Defect Rate (per story) | 0.8 | <1.0 | ↓ |
| Test Coverage % | 87% | >85% | ↑ |
| Code Review Coverage % | 95% | >90% | → |
| Technical Debt (hours) | 24 | <30 | ↓ |
| Customer Satisfaction | 4.2/5 | >4.0 | ↑ |

#### Team Health Indicators
```
Team Health Dashboard

Engagement:     ████████░░ 80%
Collaboration:  ██████████ 100%
Delivery:       ███████░░░ 70%
Learning:       ████████░░ 80%
Fun:           ████████░░ 80%

Overall Health Score: 82% (Good)
```

### Team Dashboard Template

#### Daily Standup Board
```
Team Alpha - Sprint 10 Dashboard

In Progress        Blocked           Done Today
┌─────────────┐   ┌──────────────┐   ┌──────────────┐
│ STORY-123   │   │ STORY-117    │   │ STORY-115    │
│ User Login  │   │ Payment API  │   │ Profile Page │
│ (Sarah)     │   │ (Mike)       │   │ (Alex)       │
│             │   │ [API Down]   │   │              │
│ STORY-124   │   │              │   │ STORY-116    │
│ Dashboard   │   │ STORY-119    │   │ Bug Fix      │
│ (Tom)       │   │ Database     │   │ (Lisa)       │
│             │   │ (Chris)      │   │              │
│             │   │ [Env Issue]  │   │              │
└─────────────┘   └──────────────┘   └──────────────┘
```

---

## Program (ART) Level Metrics Dashboard

### ART Flow Metrics

#### PI Objective Progress
| Team | PI Objectives | Committed | Actual | Achievement % |
|------|---------------|-----------|--------|---------------|
| Team Alpha | 3 | 24 pts | 22 pts | 92% |
| Team Beta | 4 | 32 pts | 28 pts | 88% |
| Team Gamma | 3 | 28 pts | 30 pts | 107% |
| Team Delta | 4 | 36 pts | 31 pts | 86% |
| **ART Total** | **14** | **120 pts** | **111 pts** | **93%** |

#### Feature Flow Metrics
```
Feature Flow Dashboard - PI 4

Throughput: 18 features completed this PI
Average Lead Time: 6.2 weeks
Average Cycle Time: 4.1 weeks
WIP: 12 features currently in progress

Flow Efficiency: 66% (4.1 weeks active / 6.2 weeks total)

Feature Status Distribution:
Done:        ████████████████████ 18 (60%)
In Progress: ████████████         12 (40%)
Blocked:     ██                    2 (7%)
```

#### Dependency Management
| Dependency | Provider | Consumer | Status | Due Date | Risk |
|------------|----------|----------|---------|----------|------|
| User Auth API | Team Alpha | Team Beta | Complete | Week 8 | Green |
| Payment Gateway | Team Beta | Team Gamma | In Progress | Week 10 | Yellow |
| Reporting Service | Team Delta | Team Gamma | Blocked | Week 9 | Red |
| Mobile SDK | External | Team Alpha | At Risk | Week 11 | Yellow |

### ART Predictability Metrics

#### PI Predictability Measure
```
PI Predictability Trend

PI:        1    2    3    4    5    6
Planned:  120  115  125  120  118  122
Actual:   108  118  119  111  115  --
%:        90%  103% 95%  93%  97%  --

Target: 80-120% achievement rate
Actual Trend: ↑ Improving predictability
```

#### Business Value Delivery
| PI | Business Value Planned | Business Value Delivered | Achievement |
|----|----------------------|-------------------------|-------------|
| PI 1 | 240 | 216 | 90% |
| PI 2 | 260 | 273 | 105% |
| PI 3 | 255 | 242 | 95% |
| PI 4 | 275 | 257 | 93% |

### ART Quality Dashboard

#### Technical Quality Metrics
```
ART Quality Scorecard

Code Quality:
- Technical Debt Ratio: 12% (Target: <15%)
- Code Coverage: 84% (Target: >80%)
- Security Vulnerabilities: 3 High, 12 Medium
- Performance: 95% meet SLA

Delivery Quality:
- Defect Escape Rate: 2.1% (Target: <3%)
- Customer-Found Defects: 8 this PI
- Production Incidents: 2 (Target: <5)
- Mean Time to Recovery: 2.3 hours
```

---

## Large Solution Level Metrics

### Solution Flow Metrics

#### Capability Progress Tracking
| Capability | Contributing ARTs | Progress | Planned Release | Status |
|------------|------------------|----------|----------------|---------|
| Customer Portal | ART 1, ART 2 | 75% | Q3 2025 | On Track |
| Payment Platform | ART 2, ART 3 | 60% | Q4 2025 | At Risk |
| Analytics Suite | ART 1, ART 4 | 45% | Q1 2026 | On Track |

#### Solution Integration Metrics
```
Solution Integration Health

ART Synchronization:
- Shared Milestones: 8/10 on track
- Cross-ART Dependencies: 15/18 resolved
- Integration Events: 95% attendance

Solution Demo Results:
- Stakeholder Satisfaction: 4.3/5
- Feature Integration Success: 90%
- Business Value Demonstration: High
```

### Solution Train Coordination

#### Solution Train Metrics
| Metric | Current Value | Target | Trend |
|--------|---------------|--------|-------|
| ARTs in Solution Train | 4 | 3-5 | → |
| Solution Increment Duration | 12 weeks | 10-12 weeks | → |
| Cross-ART Feature Dependencies | 18 | <20 | ↓ |
| Solution Demo Frequency | Monthly | Monthly | → |
| Architectural Runway (months) | 2.5 | 2-3 months | → |

---

## Portfolio Level Metrics Dashboard

### Portfolio Flow Metrics

#### Epic Flow Dashboard
```
Portfolio Kanban Flow Metrics

Throughput: 6 epics completed this quarter
Average Epic Lead Time: 8.5 months
Epic WIP: 14 epics currently implementing

Epic Flow by Status:
Funnel:         ████████████████████ 25
Reviewing:      ██████               8
Analyzing:      ████                 5
Portfolio BL:   ████████            12
Implementing:   ██████████          14
Done (Q):       ████████             6
```

#### Investment Distribution
| Investment Category | Allocation | Actual Spend | Variance |
|-------------------|------------|--------------|----------|
| New Products | 40% | 38% | -2% |
| Market Expansion | 25% | 27% | +2% |
| Operational Excellence | 20% | 22% | +2% |
| Technology Platform | 15% | 13% | -2% |

### Portfolio Outcomes

#### Business Outcomes Dashboard
```
Portfolio Business Outcomes - Q2 2025

Revenue Impact:
Target: $2.5M incremental revenue
Actual: $2.8M (+12%)

Cost Reduction:
Target: $800K operational savings  
Actual: $750K (-6%)

Customer Metrics:
NPS Score: 58 (Target: 55+)
Customer Retention: 94% (Target: 92%+)
Time to Market: 6.2 months (Target: <7 months)

Market Position:
Market Share: 23% (Target: 22%+)
Competitive Wins: 67% (Target: 65%+)
```

#### Portfolio ROI Tracking
| Epic | Investment | Revenue Generated | Cost Savings | Total ROI | Status |
|------|------------|------------------|--------------|-----------|---------|
| E001 | $500K | $1.2M | $200K | 280% | Complete |
| E002 | $750K | $800K | $150K | 127% | Complete |
| E003 | $1.2M | $1.8M | $300K | 175% | Implementing |
| E004 | $900K | TBD | TBD | TBD | Analyzing |

---

## Competency and Maturity Metrics

### SAFe Maturity Assessment

#### Core Competency Evaluation
| Competency | Team Level | Program Level | Portfolio Level | Target |
|------------|------------|---------------|----------------|---------|
| Lean-Agile Leadership | 3.2 | 3.8 | 3.5 | 4.0 |
| Team and Technical Agility | 4.1 | 3.9 | N/A | 4.0 |
| Agile Product Delivery | 3.7 | 3.6 | 3.4 | 4.0 |
| Enterprise Solution Delivery | N/A | 3.2 | 3.1 | 3.5 |
| Lean Portfolio Management | N/A | N/A | 3.0 | 3.5 |
| Organizational Agility | 3.4 | 3.5 | 3.2 | 3.5 |
| Continuous Learning Culture | 3.8 | 3.7 | 3.6 | 4.0 |

*Scale: 1-Beginning, 2-Developing, 3-Performing, 4-Optimizing, 5-Innovating*

### Learning and Development Metrics

#### Training and Certification Progress
```
SAFe Training Completion Status

Leading SAFe:           ████████████████████ 85% (17/20)
SAFe Scrum Master:      ██████████████████   90% (45/50)
SAFe Product Owner:     ████████████████     80% (32/40)
SAFe DevOps:           ██████████           50% (15/30)
SAFe Architect:        ████████             40% (8/20)

Target: 80% completion for role-relevant certifications
```

---

## Advanced Analytics and Insights

### Predictive Analytics

#### Flow Predictability Models
```
Feature Delivery Forecast

Based on current velocity and historical data:

Next PI (PI 5):
- Planned Features: 22
- Predicted Delivery: 19-21 features (86-95% confidence)
- Risk Factors: 2 cross-team dependencies, 1 external integration

Next 3 PIs Outlook:
- High Confidence: 18-20 features per PI
- Medium Confidence: 16-22 features per PI
- Risk Factors: Team capacity, external dependencies
```

#### Value Stream Optimization
| Value Stream | Lead Time | % Value-Add Time | Bottleneck | Improvement Opportunity |
|--------------|-----------|------------------|------------|------------------------|
| Feature Development | 8.2 weeks | 45% | Code Review | Parallel review process |
| Epic to Feature | 12.1 weeks | 30% | Analysis | Smaller epic sizing |
| Idea to Epic | 16.5 weeks | 25% | Prioritization | Lean business cases |

### Operational Intelligence

#### System Performance Correlation
```
Delivery Performance vs. Team Health

High Team Health (>80%):     Average Velocity: 52 pts
Medium Team Health (60-80%): Average Velocity: 47 pts  
Low Team Health (<60%):      Average Velocity: 38 pts

Correlation: r=0.73 (Strong positive correlation)
Insight: Team health improvement initiatives show 
         13% velocity improvement over 2 PIs
```

---

## Dashboard Implementation Guide

### Technology Stack Options

#### Cloud-Based Solutions
**Tableau/Power BI:**
- **Pros:** Rich visualizations, real-time data, executive dashboards
- **Cons:** Cost, complexity, requires data integration
- **Best For:** Enterprise-wide implementations

**Grafana/Kibana:**
- **Pros:** Open source, flexible, DevOps-friendly
- **Cons:** Technical setup required, limited business views
- **Best For:** Technical teams, engineering metrics

#### Tool-Integrated Dashboards
**Jira/Azure DevOps:**
- **Pros:** Native integration, no additional tools
- **Cons:** Limited customization, basic visualizations
- **Best For:** Small to medium organizations

**Rally/VersionOne:**
- **Pros:** SAFe-specific features, built-in metrics
- **Cons:** Cost, vendor lock-in
- **Best For:** Large SAFe implementations

### Data Integration Architecture

#### Data Sources
```
Data Flow Architecture

Sources:          Integration:       Analytics:        Presentation:
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ Jira        │──▶│ Data Lake   │──▶│ Analytics   │──▶│ Executive   │
│ Azure DevOps│   │ (AWS S3/    │   │ Engine      │   │ Dashboard   │
│ Git         │   │ Azure Blob) │   │ (Spark/     │   │             │
│ Jenkins     │   │             │   │ Databricks) │   │ Team        │
│ Monitoring  │   │ ETL         │   │             │   │ Dashboard   │
│ Tools       │   │ (Airflow)   │   │ ML Models   │   │             │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
```

### Dashboard Design Principles

#### Information Hierarchy
1. **Executive Level:** Outcomes, ROI, strategic alignment
2. **Management Level:** Flow metrics, predictability, team health  
3. **Team Level:** Velocity, quality, impediments
4. **Individual Level:** Personal productivity, skill development

#### Visual Design Guidelines
- **Color Coding:** Red (attention needed), Yellow (watch), Green (good)
- **Trend Indicators:** Arrows and sparklines for quick trend identification
- **Drill-Down Capability:** Click through from summary to detail
- **Mobile Responsive:** Accessible on tablets and phones

---

## Metrics Governance

### Data Quality Standards

#### Metric Definitions
All metrics must include:
- **Definition:** Clear, unambiguous description
- **Calculation:** Specific formula or method
- **Data Sources:** Where data originates
- **Update Frequency:** How often metric is refreshed
- **Ownership:** Who is responsible for accuracy

#### Data Validation Process
1. **Source System Validation:** Ensure data accuracy at source
2. **Transformation Validation:** Verify ETL processes
3. **Business Rule Validation:** Apply business logic correctly
4. **User Acceptance:** Stakeholder validation of results

### Metric Lifecycle Management

#### Metric Introduction Process
1. **Business Justification:** Why metric is needed
2. **Definition Workshop:** Stakeholder alignment on calculation
3. **Technical Implementation:** Data pipeline creation
4. **User Training:** How to interpret and use metric
5. **Success Criteria:** What constitutes effective usage

#### Metric Retirement Process
1. **Usage Analysis:** Determine if metric is being used
2. **Value Assessment:** Evaluate ongoing business value
3. **Stakeholder Consultation:** Discuss retirement with users
4. **Deprecation Period:** Gradual phase-out with notice
5. **Archive:** Maintain historical data for reference

---

## Continuous Improvement Framework

### Metrics Review Cycle

#### Monthly Metrics Review
**Participants:** Metrics team, key stakeholders
**Duration:** 2 hours
**Agenda:**
1. **Data Quality Review** (30 minutes)
   - Identify data issues and inconsistencies
   - Review data freshness and completeness
   - Plan remediation actions

2. **Metric Performance** (45 minutes)
   - Analyze trends and outliers
   - Identify insights and action items
   - Validate metric calculations

3. **User Feedback** (30 minutes)
   - Collect dashboard usability feedback
   - Identify new metric requirements
   - Plan dashboard enhancements

4. **Action Planning** (15 minutes)
   - Assign improvement actions
   - Set timeline for implementations
   - Schedule follow-up reviews

### Success Measurement

#### Dashboard Adoption Metrics
- **User Engagement:** Daily/weekly active users
- **Usage Patterns:** Most viewed dashboards and metrics
- **Decision Impact:** Decisions influenced by metrics
- **Time to Insight:** Speed of problem identification

#### Business Impact Metrics
- **Improved Predictability:** Reduced variance in deliveries
- **Faster Problem Resolution:** Quicker identification of issues  
- **Better Resource Allocation:** Data-driven capacity planning
- **Enhanced Transparency:** Increased stakeholder confidence

---

## Related Templates
- [PI Planning Template](./pi_planning_template.md)
- [Portfolio Kanban Template](./portfolio_kanban_template.md)
- [ART Coordination Template](./art_coordination_template.md)
- [SAFe Executive Dashboard Templates](../../../business-stakeholder-suite/safe-executive-dashboards/README.md)

---

## Customization Guidelines

### Organization Size Adaptations

#### Small Organizations (1-3 ARTs)
- **Focus:** Team and Program level metrics
- **Tools:** Built-in tool dashboards (Jira, Azure DevOps)
- **Frequency:** Weekly reviews, monthly deep dives
- **Complexity:** Simple calculations, basic visualizations

#### Medium Organizations (4-10 ARTs)
- **Focus:** Program and Large Solution metrics
- **Tools:** Dedicated BI tools (Tableau, Power BI)
- **Frequency:** Daily dashboards, weekly reviews
- **Complexity:** Advanced analytics, trend analysis

#### Large Organizations (10+ ARTs)
- **Focus:** All levels including Portfolio
- **Tools:** Enterprise data platforms, ML analytics
- **Frequency:** Real-time dashboards, automated alerts
- **Complexity:** Predictive models, correlation analysis

### Industry Customizations

#### Software Development
- **Technical Metrics:** Code quality, deployment frequency, MTTR
- **Innovation Metrics:** Technical debt reduction, architecture improvements
- **Customer Metrics:** User engagement, feature adoption rates

#### Financial Services
- **Compliance Metrics:** Regulatory requirement tracking, audit readiness
- **Risk Metrics:** Security incidents, compliance violations
- **Business Metrics:** Transaction volumes, processing times

#### Manufacturing
- **Quality Metrics:** Defect rates, compliance adherence
- **Efficiency Metrics:** Production throughput, waste reduction
- **Safety Metrics:** Incident rates, safety compliance

---

## Version History
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | [Date] | Initial template creation | [Author] |

---

*This template is part of the PM Tools Templates library. For more information and additional templates, visit [repository root](../../../../README.md).*

