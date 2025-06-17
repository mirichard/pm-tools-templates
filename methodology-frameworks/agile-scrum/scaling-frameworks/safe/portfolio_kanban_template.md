# SAFe Portfolio Kanban Template

## Overview
This template provides a framework for implementing Portfolio Kanban in SAFe, enabling organizations to visualize and manage the flow of portfolio epics from ideation to implementation. Portfolio Kanban helps establish a pull-based system for portfolio investment decisions.

## Template Information
- **Framework:** SAFe (Scaled Agile Framework)
- **Level:** Portfolio
- **Purpose:** Epic flow management and investment decision-making
- **Participants:** Portfolio Management, Epic Owners, Business Owners
- **Review Frequency:** Weekly or bi-weekly

---

## Portfolio Kanban Board Structure

### Board Layout
The Portfolio Kanban board consists of the following columns:

```
[Funnel] → [Reviewing] → [Analyzing] → [Portfolio Backlog] → [Implementing] → [Done]
```

### Column Definitions

#### 1. Funnel
**Purpose:** Capture all new epic ideas
**WIP Limit:** No limit
**Entry Criteria:** 
- [ ] Epic hypothesis is documented
- [ ] Business opportunity is identified
- [ ] Initial business case exists

**Activities:**
- Idea capture and initial documentation
- High-level business case development
- Stakeholder identification

#### 2. Reviewing
**Purpose:** Initial review and assessment
**WIP Limit:** 10-15 epics
**Entry Criteria:**
- [ ] Epic meets minimum threshold criteria
- [ ] Business sponsor is identified
- [ ] Initial ROI estimate exists

**Activities:**
- Portfolio review board assessment
- Initial prioritization
- Go/no-go decision for analysis

#### 3. Analyzing
**Purpose:** Detailed analysis and business case development
**WIP Limit:** 5-10 epics
**Entry Criteria:**
- [ ] Portfolio review board approval
- [ ] Analysis resources are available
- [ ] Epic owner is assigned

**Activities:**
- Detailed business case development
- Market research and validation
- Technical feasibility assessment
- Investment analysis

#### 4. Portfolio Backlog
**Purpose:** Approved epics awaiting implementation capacity
**WIP Limit:** No formal limit
**Entry Criteria:**
- [ ] Business case is approved
- [ ] ROI meets portfolio threshold
- [ ] Epic is sized and estimated

**Activities:**
- Epic prioritization and sequencing
- Capacity planning
- Solution context development

#### 5. Implementing
**Purpose:** Epics actively being developed
**WIP Limit:** Based on ART capacity
**Entry Criteria:**
- [ ] Implementation capacity is available
- [ ] Epic is ready for development
- [ ] Success criteria are defined

**Activities:**
- Epic decomposition into features
- Solution development
- Progress tracking and reporting

#### 6. Done
**Purpose:** Completed epics with realized value
**No WIP Limit**
**Entry Criteria:**
- [ ] Epic acceptance criteria met
- [ ] Business benefits are realized
- [ ] Value measurement completed

**Activities:**
- Value realization reporting
- Lessons learned capture
- Portfolio performance analysis

---

## Epic Card Template

### Epic Card Information
Each epic card should contain the following information:

#### Epic Header
```
Epic ID: [E001]
Epic Name: [Epic Title]
Epic Owner: [Name]
Business Sponsor: [Name]
```

#### Business Information
```
Business Value: [High/Medium/Low]
Strategic Theme: [Theme Name]
Investment Category: [New Product/Market/Technology/Platform]
Target Market: [Market Segment]
```

#### Financial Information
```
Total Investment: $[Amount]
Projected ROI: [Percentage]%
Payback Period: [Months]
NPV: $[Amount]
IRR: [Percentage]%
```

#### Timeline Information
```
Analysis Start: [Date]
Analysis Complete: [Date]
Implementation Start: [Date]
Expected Completion: [Date]
```

#### Success Metrics
```
Leading Indicators:
- [Metric 1]: [Target]
- [Metric 2]: [Target]

Lagging Indicators:
- [Metric 1]: [Target]
- [Metric 2]: [Target]
```

---

## Portfolio Review Process

### Review Board Composition
- **Portfolio Manager** (Chair)
- **Business Owners**
- **Solution/System Architects**
- **Epic Owners**
- **Finance Representative**

### Review Cadence
- **Frequency:** Weekly or bi-weekly
- **Duration:** 2-3 hours
- **Format:** In-person or virtual meeting

### Review Agenda Template

#### 1. Portfolio Metrics Review (15 minutes)
- Portfolio flow metrics
- Investment allocation review
- Capacity utilization analysis
- Value delivery trends

#### 2. Funnel Review (20 minutes)
- New epic presentations
- Initial screening decisions
- Move to Reviewing column

#### 3. Reviewing Column (25 minutes)
- Epic prioritization
- Resource allocation decisions
- Move to Analyzing or reject

#### 4. Analyzing Column (30 minutes)
- Business case presentations
- Investment decisions
- Move to Portfolio Backlog or reject

#### 5. Portfolio Backlog (20 minutes)
- Epic sequencing and prioritization
- Capacity planning
- Implementation timing decisions

#### 6. Implementing Epics (15 minutes)
- Progress updates
- Issue escalation
- Scope and timeline adjustments

#### 7. Action Items and Next Steps (5 minutes)
- Decision documentation
- Follow-up assignments
- Next meeting preparation

---

## Business Case Template

### Executive Summary
**Epic Name:** [Epic Title]
**Business Sponsor:** [Name]
**Epic Owner:** [Name]
**Investment Request:** $[Amount]

#### Problem Statement
[Describe the business problem or opportunity this epic addresses]

#### Proposed Solution
[High-level description of the proposed solution]

#### Expected Benefits
[Key business benefits and value proposition]

### Business Context

#### Strategic Alignment
- **Strategic Theme:** [Theme Name]
- **Business Objective:** [Specific objective]
- **Portfolio Priority:** [High/Medium/Low]

#### Market Analysis
- **Target Market:** [Market segment description]
- **Market Size:** $[Amount]
- **Competitive Landscape:** [Brief analysis]
- **Market Trends:** [Relevant trends]

### Solution Overview

#### Scope and Features
**In Scope:**
- [Feature/capability 1]
- [Feature/capability 2]
- [Feature/capability 3]

**Out of Scope:**
- [Explicitly excluded items]

#### Technical Approach
- **Technology Stack:** [Technologies to be used]
- **Integration Points:** [System integrations required]
- **Architecture Considerations:** [Key architectural decisions]

### Financial Analysis

#### Investment Summary
| Category | Amount | Percentage |
|----------|--------|------------|
| Development | $[Amount] | [%] |
| Infrastructure | $[Amount] | [%] |
| Third-party Tools | $[Amount] | [%] |
| Training | $[Amount] | [%] |
| Other | $[Amount] | [%] |
| **Total** | **$[Amount]** | **100%** |

#### Revenue Projections
| Year | Revenue | Cost Savings | Total Benefit |
|------|---------|--------------|---------------|
| Year 1 | $[Amount] | $[Amount] | $[Amount] |
| Year 2 | $[Amount] | $[Amount] | $[Amount] |
| Year 3 | $[Amount] | $[Amount] | $[Amount] |

#### Financial Metrics
- **ROI:** [Percentage]%
- **NPV:** $[Amount]
- **IRR:** [Percentage]%
- **Payback Period:** [Months] months
- **Break-even Point:** [Date]

### Risk Analysis

#### Risk Assessment
| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|-------------------|
| [Risk 1] | High/Med/Low | High/Med/Low | [Strategy] |
| [Risk 2] | High/Med/Low | High/Med/Low | [Strategy] |
| [Risk 3] | High/Med/Low | High/Med/Low | [Strategy] |

#### Assumptions
- [Assumption 1]
- [Assumption 2]
- [Assumption 3]

### Implementation Plan

#### High-Level Timeline
| Milestone | Target Date | Dependencies |
|-----------|-------------|--------------|
| Analysis Complete | [Date] | [Dependencies] |
| Development Start | [Date] | [Dependencies] |
| MVP Release | [Date] | [Dependencies] |
| Full Implementation | [Date] | [Dependencies] |

#### Resource Requirements
- **Development Team:** [Size and duration]
- **Subject Matter Experts:** [Expertise needed]
- **Infrastructure:** [Infrastructure requirements]
- **Budget:** $[Amount]

### Success Criteria

#### Business Outcomes
- [Outcome 1]: [Target metric]
- [Outcome 2]: [Target metric]
- [Outcome 3]: [Target metric]

#### Leading Indicators
- [Indicator 1]: [Target]
- [Indicator 2]: [Target]

#### Acceptance Criteria
- [ ] [Specific, measurable criterion]
- [ ] [Specific, measurable criterion]
- [ ] [Specific, measurable criterion]

---

## Flow Metrics Dashboard

### Key Performance Indicators

#### Throughput Metrics
- **Epic Throughput:** [Number] epics completed per quarter
- **Cycle Time:** [Days] average time from funnel to done
- **Lead Time:** [Days] average time from idea to value delivery

#### Flow Efficiency
- **Work in Progress:** [Number] of epics in each column
- **Flow Efficiency:** [Percentage]% of time adding value vs. waiting
- **Blocked Items:** [Number] of epics currently blocked

#### Investment Metrics
- **Portfolio Investment:** $[Amount] currently in implementing
- **Investment by Category:** [Breakdown by investment type]
- **ROI Realization:** [Percentage]% of projected ROI achieved

### Metrics Tracking Template

#### Weekly Flow Metrics
| Metric | This Week | Last Week | Trend | Target |
|--------|-----------|-----------|--------|--------|
| Epics in Funnel | [Number] | [Number] | ↑/↓/→ | [Target] |
| Epics in Reviewing | [Number] | [Number] | ↑/↓/→ | [Target] |
| Epics in Analyzing | [Number] | [Number] | ↑/↓/→ | [Target] |
| Epics in Backlog | [Number] | [Number] | ↑/↓/→ | [Target] |
| Epics Implementing | [Number] | [Number] | ↑/↓/→ | [Target] |
| Epics Completed | [Number] | [Number] | ↑/↓/→ | [Target] |

#### Quarterly Investment Review
| Investment Category | Q1 | Q2 | Q3 | Q4 | Total |
|-------------------|----|----|----|----|-------|
| New Products | $[Amount] | $[Amount] | $[Amount] | $[Amount] | $[Amount] |
| Market Expansion | $[Amount] | $[Amount] | $[Amount] | $[Amount] | $[Amount] |
| Technology Platform | $[Amount] | $[Amount] | $[Amount] | $[Amount] | $[Amount] |
| Operational Excellence | $[Amount] | $[Amount] | $[Amount] | $[Amount] | $[Amount] |

---

## Decision Framework

### Investment Criteria

#### Minimum Threshold Criteria
All epics must meet these criteria to proceed beyond Funnel:
- [ ] Aligns with strategic themes
- [ ] Minimum ROI of [Percentage]%
- [ ] Market opportunity > $[Amount]
- [ ] Technical feasibility confirmed
- [ ] Resource availability validated

#### Prioritization Criteria
Weight factors for epic prioritization:

| Criteria | Weight | Score (1-5) | Weighted Score |
|----------|--------|-------------|----------------|
| Strategic Alignment | 30% | [Score] | [Calculation] |
| Financial Return | 25% | [Score] | [Calculation] |
| Market Opportunity | 20% | [Score] | [Calculation] |
| Technical Risk | 15% | [Score] | [Calculation] |
| Resource Availability | 10% | [Score] | [Calculation] |

### Go/No-Go Decision Template

#### Decision Criteria Checklist
- [ ] **Strategic Fit:** Epic aligns with portfolio strategy
- [ ] **Financial Viability:** ROI meets or exceeds threshold
- [ ] **Market Validation:** Customer demand is validated
- [ ] **Technical Feasibility:** Solution is technically achievable
- [ ] **Resource Capacity:** Required resources are available
- [ ] **Risk Tolerance:** Risk level is acceptable

#### Decision Documentation
**Epic:** [Epic Name]
**Decision Date:** [Date]
**Decision:** Go / No-Go / Defer
**Rationale:** [Explanation of decision]
**Conditions:** [Any conditions for go decision]
**Next Review:** [Date for next review if deferred]

---

## Portfolio Kanban Ceremonies

### Daily Portfolio Standup (Optional)
**Participants:** Portfolio Manager, Epic Owners
**Duration:** 15 minutes
**Format:** Virtual or in-person

**Agenda:**
1. **Blockers and Impediments** (10 minutes)
   - Identify portfolio-level blockers
   - Escalate critical issues
   - Coordinate resolution efforts

2. **Key Decisions Needed** (5 minutes)
   - Identify urgent decisions
   - Schedule additional meetings if needed

### Weekly Portfolio Review
**Participants:** Portfolio Review Board
**Duration:** 2-3 hours
**Format:** Formal meeting

**Agenda:** [Use agenda template above]

### Monthly Portfolio Health Check
**Participants:** Senior Leadership, Portfolio Manager
**Duration:** 1 hour
**Format:** Executive briefing

**Agenda:**
1. **Portfolio Performance** (20 minutes)
   - Flow metrics review
   - Investment performance
   - Value delivery trends

2. **Strategic Alignment** (20 minutes)
   - Epic portfolio vs. strategy
   - Market changes impact
   - Competitive positioning

3. **Risks and Issues** (15 minutes)
   - Portfolio-level risks
   - Escalated issues
   - Mitigation strategies

4. **Forward Looking** (5 minutes)
   - Upcoming decisions
   - Resource planning
   - Strategic adjustments

---

## Tool Implementation

### Physical Board Setup
**Materials Needed:**
- Large wall space or magnetic board
- Sticky notes (different colors for epic types)
- Magnetic cards or laminated epic cards
- Markers and pens
- Tape or magnetic strips

**Board Layout:**
```
[Column Headers]
[WIP Limits displayed prominently]
[Epic cards organized by column]
[Blocked items marked clearly]
[Expedite lane if needed]
```

### Digital Tool Options

#### Jira Portfolio Kanban
- **Setup:** Create portfolio-level board
- **Epic Cards:** Use epic issue type
- **Custom Fields:** Add financial and business fields
- **Workflows:** Configure column workflows
- **Reporting:** Use built-in flow metrics

#### Azure DevOps Portfolio Boards
- **Setup:** Create portfolio-level board
- **Work Items:** Use epic work item type
- **Custom Fields:** Add business case fields
- **Workflows:** Configure state transitions
- **Analytics:** Use portfolio analytics

#### Miro/Mural Digital Boards
- **Setup:** Create collaborative board template
- **Epic Cards:** Use digital sticky notes
- **Workflow:** Manual movement between columns
- **Collaboration:** Real-time editing and commenting

---

## Customization Guidelines

### Organization Size Adaptations

#### Small Organizations (1-3 ARTs)
- Simplified approval process
- Reduced documentation requirements
- Combined roles (Portfolio Manager + Epic Owner)
- Monthly instead of weekly reviews

#### Medium Organizations (4-10 ARTs)
- Standard template as provided
- Dedicated portfolio management roles
- Formal review processes
- Weekly review cadence

#### Large Organizations (10+ ARTs)
- Enhanced governance processes
- Multiple portfolio boards by value stream
- Dedicated analysis teams
- Daily portfolio standups

### Industry Customizations

#### Technology Companies
- Emphasize technical feasibility analysis
- Include architecture review gates
- Add technology stack decisions
- Focus on innovation metrics

#### Financial Services
- Include regulatory compliance review
- Add risk management assessments
- Emphasize security considerations
- Include audit trail requirements

#### Healthcare/Life Sciences
- Add regulatory approval processes
- Include patient safety assessments
- Emphasize compliance requirements
- Add clinical trial considerations

---

## Related Templates
- [PI Planning Template](./pi_planning_template.md)
- [ART Coordination Template](./art_coordination_template.md)
- [SAFe Metrics Dashboard Template](./metrics_dashboard_template.md)
- [Epic Business Case Template](./epic_business_case_template.md)
- [Portfolio Management Role Guide](../../../role-based-toolkits/portfolio-manager/README.md)

---

## Success Metrics

### Portfolio Flow Health
- **Cycle Time:** ≤ 6 months from funnel to implementing
- **Throughput:** Consistent epic completion rate
- **Predictability:** 80%+ of epics complete on time
- **Value Delivery:** 90%+ of epics meet ROI targets

### Investment Efficiency
- **Portfolio ROI:** Meets or exceeds organizational targets
- **Investment Balance:** Appropriate mix across categories
- **Resource Utilization:** 85%+ capacity utilization
- **Time to Market:** Reduced time from idea to value

---

## Version History
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | [Date] | Initial template creation | [Author] |

---

*This template is part of the PM Tools Templates library. For more information and additional templates, visit [repository root](../../../../README.md).*

