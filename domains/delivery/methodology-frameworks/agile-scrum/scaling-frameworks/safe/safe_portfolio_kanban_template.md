---
title: "Safe Portfolio Kanban Template"
methodology: "agile"
complexity: "advanced"
owner: "mirichard"
updated: "2026-09-19"
---

# SAFe Portfolio Kanban Template

## When to Use

- When portfolio epics need explicit entry policies, evaluation, and work-in-progress limits.
- When investment owners need lean business cases and transparent prioritization.

## When NOT to Use

- To substitute calculated priority scores for accountable investment judgment.
- Do not infer realized value from completed outputs, spending, or activity counts. See [Value equals output](../../../../../../docs/principles/anti-patterns.md#value-output).

## Pairs Well With

- [Portfolio Kanban Template](../../../../../../domains/delivery/methodology-frameworks/agile-scrum/scaling-frameworks/safe/portfolio_kanban_template.md).
- [Advanced Business Case Template](../../../../../../domains/stakeholder/business-stakeholder-suite/financial-governance/enhanced-business-cases/advanced-business-case-template.md).

Selection context: Delivery domain; agile methodology; advanced complexity. Match the situations above to project phase, risk, team size, and industry using the [decision-engine context model](../../../../../../meta/architecture-research/800-801-context-assessment-model.md).

## Completing the worksheet

Replace populated examples with project evidence before circulation. Record the reporting period, baseline, source, owner, and calculation for each measure; define thresholds and approval authority locally. Show unavailable values as unknown rather than zero or a favorable status. Reconcile totals and units, handle zero denominators explicitly, and retain the decision rationale and supporting evidence.


**Enterprise:** [Enterprise Name]  
**Portfolio:** [Portfolio Name]  
**Created By:** [Name/Role]  
**Last Updated:** [YYYY-MM-DD]\
**Version:** [1.0]

## 📋 Portfolio Kanban Overview

The Portfolio Kanban system visualizes the flow of business and enabler epics from concept to completion, helping to:

- Limit work in progress (WIP) to improve flow
- Make portfolio work visible to all stakeholders
- Establish clear policies for work movement
- Implement a structured approach to portfolio prioritization
- Provide transparency into the enterprise's most significant initiatives

This template provides a framework for implementing a SAFe Portfolio Kanban system following Scaled Agile Framework best practices.

## 🔄 Kanban Board Structure

### Epic Workflow States

| State | Description | Entry Criteria | Exit Criteria | WIP Limit | Owner/Participants |
|-------|-------------|----------------|---------------|-----------|-------------------|
| **Funnel** | Initial capture of epic ideas | None - all epics start here | Epic has a brief description and identified business sponsor | None | Anyone |
| **Reviewing** | Initial analysis and evaluation | Sponsor identified; Description created | WSJF calculated; Initial analysis complete | 10 epics | LPM Team, Epic Owners |
| **Analyzing** | Detailed analysis, business case development | WSJF calculated; LPM team approval to analyze | Lean business case complete; Solution intent defined | 5 epics | Epic Owner, Subject Matter Experts |
| **Portfolio Backlog** | Approved epics awaiting implementation capacity | Lean business case approved; Epic meets minimum WSJF threshold | Committed for implementation; Resources allocated | 15 epics | LPM Team |
| **Implementing** | Epic is being implemented by one or more ARTs | Resources allocated; Added to PI Planning | All features implemented; Acceptance criteria met | 8 epics | ARTs, Epic Owner |
| **Done** | Epic completed and benefits being realized | All acceptance criteria met; Solution validated | None - terminal state | None | Epic Owner, LPM Team |
| **Archived** | Historic record of completed or rejected epics | Epic completed or explicitly rejected | None - terminal state | None | System Administrator |

### Visual Representation

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│             │ │             │ │             │ │             │ │             │ │             │ │             │
│   FUNNEL    │ │  REVIEWING  │ │  ANALYZING  │ │ PORTFOLIO   │ │IMPLEMENTING │ │    DONE     │ │  ARCHIVED   │
│             │ │             │ │             │ │  BACKLOG    │ │             │ │             │ │             │
│ No WIP Limit│ │ WIP Limit:10│ │ WIP Limit: 5│ │ WIP Limit:15│ │ WIP Limit: 8│ │ No WIP Limit│ │ No WIP Limit│
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
      ↑               ↑               ↑               ↑               ↑               ↑               ↑
   All Ideas    Initial Review    Deep Analysis    Approved for     In Progress     Completed      Historical
                                                  Implementation                                     Record
```

## 📝 Epic Card Template

Each epic on the Kanban board should contain the following information:

### Basic Information
- **Epic ID:** [Unique Identifier]
- **Epic Name:** [Descriptive title]
- **Epic Owner:** [Person responsible]
- **Epic Type:** [Business/Enabler]
- **Strategic Theme:** [Alignment to strategic themes]
- **Current State:** [Kanban state]
- **Start Date:** [When work began]
- **Target Completion:** [Expected completion]

### Business Information
- **Business Outcome:** [Measurable outcome expected]
- **Leading Indicators:** [Early measures of success]
- **WSJF Score:** [Weighted Shortest Job First calculation]
- **Cost of Delay:** [$ value/time period]
- **Job Size:** [Relative size estimate]

### Implementation Information
- **Impacted ARTs:** [ARTs involved in implementation]
- **Key Dependencies:** [Other epics, capabilities, or systems]
- **Key Milestones:** [Major achievement points]
- **Progress:** [% complete or feature count]

## 🔄 Portfolio Kanban Policies

### General Policies
1. **Card Movement:** Only move cards during Portfolio Sync meetings or with LPM approval
2. **WIP Limits:** Only exceed WIP limits with explicit approval from Portfolio Management
3. **Age Monitoring:** Epics in any state for more than 30 days require escalation and review
4. **Blockers:** Blocked epics must be clearly marked and discussed in Portfolio Sync
5. **Prioritization:** WSJF is the primary prioritization mechanism for epics

### State-Specific Policies

#### Funnel Policies
- New epics can be added by anyone in the organization
- Each epic requires a brief description and identified sponsor
- Funnel is reviewed and groomed monthly
- Epics without activity for 90+ days may be removed

#### Reviewing Policies
- Epic review occurs weekly during Portfolio Sync
- Initial WSJF calculation must be completed before advancing
- Business and enabler epics must align with at least one strategic theme
- Maximum time in state: 4 weeks

#### Analyzing Policies
- Analysis requires involvement of subject matter experts from relevant areas
- Lean business case must include benefits hypothesis and success metrics
- Architectural and UX conceptual designs must be completed
- Maximum time in state: 8 weeks

#### Portfolio Backlog Policies
- Epics must be sequenced based on WSJF and dependencies
- Epics can only be pulled when implementation capacity is available
- Quarterly review of backlog to ensure continued strategic alignment
- Epic details and documentation must be current before implementation

#### Implementing Policies
- Implementation must be coordinated across affected ARTs
- Status must be updated at least bi-weekly
- Impediments must be raised to Portfolio Sync meetings
- Significant scope changes require re-analysis and approval

#### Done/Archived Policies
- Benefit measurement plan must be in place for at least 3 months post-completion
- Retrospective must be conducted and documented
- All documentation must be finalized and stored in knowledge repository

## 💹 WSJF Calculation

Weighted Shortest Job First (WSJF) is calculated as:

**WSJF = Cost of Delay ÷ Job Size**

Where **Cost of Delay** = (Business Value + Time Criticality + Risk Reduction/Opportunity Enablement)

### Scoring Guidelines

| Score | Business Value | Time Criticality | Risk Reduction | Job Size |
|-------|---------------|------------------|----------------|----------|
| **1** | Minimal value | No urgency | Minimal risk reduction | Extra Large |
| **3** | Moderate value | Low urgency | Some risk reduction | Large |
| **5** | Significant value | Moderate urgency | Significant risk reduction | Medium |
| **8** | High value | High urgency | Substantial risk reduction | Small |
| **13** | Very high value | Very high urgency | Very high risk reduction | Extra Small |
| **20** | Extreme value | Extreme urgency | Major risk reduction | - |

### WSJF Example

| Epic | Business Value | Time Criticality | Risk Reduction | CoD (Sum) | Job Size | WSJF (CoD ÷ Job Size) | Rank |
|------|---------------|------------------|----------------|-----------|----------|----------------------|------|
| Customer Portal | 13 | 8 | 5 | 26 | 5 | 5.2 | 2 |
| Payment Gateway | 20 | 13 | 8 | 41 | 8 | 5.1 | 3 |
| Data Migration | 8 | 20 | 13 | 41 | 3 | 13.7 | 1 |
| UX Redesign | 13 | 5 | 5 | 23 | 8 | 2.9 | 5 |
| Security Update | 8 | 13 | 20 | 41 | 13 | 3.2 | 4 |

## 📊 Lean Business Case Template

### Epic Summary
**Epic Name:** [Name]  
**Epic Owner:** [Name]  
**Problem Statement:** [Clear articulation of the problem being solved]

### Business Outcomes
- **Primary Outcome:** [Specific measurable outcome]
- **Secondary Outcomes:** [Other benefits]
- **Leading Indicators:** [Early signals of success]

### Solution Overview
- **Proposed Approach:** [High-level solution]
- **Alternative Approaches Considered:** [Other options evaluated]
- **Estimated Effort:** [T-shirt size or range estimate]
- **Impacted Systems/Areas:** [Systems, teams, or processes affected]

### Strategic Alignment
- **Strategic Themes:** [Connection to enterprise strategy]
- **Portfolio Vision:** [How this advances portfolio goals]

### Implementation Considerations
- **Key Dependencies:** [Other initiatives, systems, or decisions]
- **Key Risks:** [Major risks to success]
- **Timing Constraints:** [Market or regulatory windows]

### Financial Analysis
- **Estimated Costs:** [Implementation costs]
- **Expected Benefits:** [Financial benefits]
- **Payback Period:** [Time to recoup investment]
- **Funding Source:** [Budget allocation]

### Recommendation
- **Go/No-Go Decision:** [Recommendation with rationale]
- **Next Steps:** [Immediate actions if approved]

## 📈 Portfolio Kanban Metrics

### Flow Metrics

| Metric | Description | Target | Current | Trend |
|--------|-------------|--------|---------|-------|
| **Throughput** | Number of epics completed per time period | 4 per quarter | [Value] | [↑/↓/→] |
| **Cycle Time** | Average time from Analyzing to Done | 6 months | [Value] | [↑/↓/→] |
| **Lead Time** | Average time from Funnel to Done | 9 months | [Value] | [↑/↓/→] |
| **WIP** | Current number of epics in progress | ≤ 8 | [Value] | [↑/↓/→] |
| **Flow Efficiency** | % of time epics are actively worked vs. waiting | >40% | [Value] | [↑/↓/→] |
| **Blockers** | Number of blocked epics | 0 | [Value] | [↑/↓/→] |

### Process Health Metrics

| Metric | Description | Target | Current | Trend |
|--------|-------------|--------|---------|-------|
| **Aging WIP** | Epics in progress > 90 days | ≤ 3 | [Value] | [↑/↓/→] |
| **Escaped Defects** | Defects found after implementation | ≤ 3 per epic | [Value] | [↑/↓/→] |
| **Forecast Accuracy** | Actual vs. estimated completion date | ±20% | [Value] | [↑/↓/→] |
| **Strategic Alignment** | % of epics aligned to strategic themes | >90% | [Value] | [↑/↓/→] |
| **Feedback Cycle** | Average time from feedback to action | ≤ 14 days | [Value] | [↑/↓/→] |

### Business Outcome Metrics

| Metric | Description | Target | Current | Trend |
|--------|-------------|--------|---------|-------|
| **Benefits Realization** | % of epics achieving stated benefits | >75% | [Value] | [↑/↓/→] |
| **Customer Satisfaction** | Customer satisfaction with delivered solutions | >4.2/5 | [Value] | [↑/↓/→] |
| **Time to Market** | Time from idea to customer availability | -10% YoY | [Value] | [↑/↓/→] |
| **Innovation Rate** | % of epics that represent new capabilities | >30% | [Value] | [↑/↓/→] |
| **Technical Debt Reduction** | % of enabler epics addressing tech debt | 20-30% | [Value] | [↑/↓/→] |

## 🔍 Portfolio Kanban Cadence

### Meeting Structure

| Meeting | Frequency | Duration | Participants | Purpose |
|---------|-----------|----------|--------------|---------|
| **Portfolio Sync** | Weekly | 1 hour | LPM Team, Epic Owners | Review kanban board, move epics, address blockers |
| **Epic Review** | Bi-weekly | 2 hours | LPM Team, Epic Owners, SMEs | Review epics in Analysis, make go/no-go decisions |
| **Portfolio Steering** | Monthly | 2 hours | Executives, LPM Team | Strategic alignment review, resource allocation decisions |
| **Portfolio Retrospective** | Quarterly | 3 hours | LPM Team, Sample of Epic Owners | Process improvement, metrics review |

### Portfolio Sync Agenda Template

1. **Review Metrics** (10 min)
   - Flow metrics
   - Blockers and impediments
   - Aging WIP

2. **Kanban Board Review** (30 min)
   - Right-to-left review of epics
   - Update epic status
   - Identify and discuss blockers
   - Move epics that meet exit criteria

3. **WIP Management** (10 min)
   - Address WIP limit violations
   - Discuss capacity allocation

4. **Next Steps & Action Items** (10 min)
   - Assign action items
   - Confirm next meeting

## 📱 Portfolio Kanban Implementation Examples

### Physical Board Example

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           PORTFOLIO KANBAN BOARD                                │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   FUNNEL    │ │  REVIEWING  │ │  ANALYZING  │ │ PORTFOLIO   │ │IMPLEMENTING │ │    DONE     │
│             │ │             │ │             │ │  BACKLOG    │ │             │ │             │
├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤
│ Mobile App  │ │ Customer    │ │ Payment     │ │ Data        │ │ Security    │ │ API         │
│ Redesign    │ │ Portal      │ │ Gateway     │ │ Migration   │ │ Update      │ │ Gateway     │
├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤
│ Blockchain  │ │ Reporting   │ │ DevOps      │ │ UX          │ │ Cloud       │ │ Customer    │
│ Integration │ │ Dashboard   │ │ Pipeline    │ │ Redesign    │ │ Migration   │ │ Onboarding  │
├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤
│ AI-powered  │ │ Regulatory  │ │             │ │ Mobile      │ │ Compliance  │ │             │
│ Analytics   │ │ Compliance  │ │             │ │ App v2      │ │ Framework   │ │             │
├─────────────┤ ├─────────────┤ │             │ ├─────────────┤ ├─────────────┤ │             │
│ Voice       │ │             │ │             │ │ Analytics   │ │ CRM         │ │             │
│ Assistant   │ │             │ │             │ │ Platform    │ │ Integration │ │             │
├─────────────┤ │             │ │             │ ├─────────────┤ │             │ │             │
│ IoT         │ │             │ │             │ │ Legacy      │ │             │ │             │
│ Platform    │ │             │ │             │ │ Migration   │ │             │ │             │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
    No Limit        WIP: 3          WIP: 2         WIP: 5          WIP: 5         No Limit
```

### Digital Tool Example (Jira/Rally/Azure DevOps)

For digital implementation:

1. **Create Epic Type Custom Field**
   - Business Epic
   - Enabler Epic

2. **Create Portfolio States as Workflow Status**
   - Funnel
   - Reviewing
   - Analyzing
   - Portfolio Backlog
   - Implementing
   - Done
   - Archived

3. **Configure Custom Fields**
   - Business Value (1-20)
   - Time Criticality (1-20)
   - Risk Reduction/Opportunity Enablement (1-20)
   - Job Size (1-13)
   - WSJF (Calculated)
   - Strategic Theme (List)
   - Business Outcome (Text)

4. **Configure Board**
   - Columns represent states
   - WIP limits displayed on columns
   - Swimlanes can represent strategic themes or epic types
   - Cards show epic ID, name, owner, and WSJF score

5. **Configure Dashboard**
   - Cycle time and lead time charts
   - Throughput chart
   - Aging WIP chart
   - Cumulative flow diagram

## 🛠️ Portfolio Kanban Implementation Steps

1. **Define Portfolio Vision & Strategy**
   - Clearly articulate portfolio vision
   - Identify strategic themes
   - Define value streams and ARTs

2. **Design Portfolio Kanban**
   - Define workflow states
   - Set initial WIP limits
   - Create policies for each state
   - Design epic card template

3. **Configure Tools**
   - Set up physical or digital board
   - Configure metrics collection
   - Establish reporting mechanisms

4. **Train Participants**
   - Train LPM team on Kanban principles
   - Train epic owners on process
   - Train executives on portfolio governance

5. **Launch & Monitor**
   - Begin with current epics
   - Hold regular Portfolio Sync meetings
   - Collect and analyze metrics

6. **Continuous Improvement**
   - Review and adjust WIP limits
   - Refine policies
   - Update workflow as needed

## 🔄 Portfolio Kanban Anti-patterns

| Anti-pattern | Description | Solution |
|--------------|-------------|----------|
| **Kanban Theater** | Following the form but not the principles | Focus on flow, limiting WIP, and making policies explicit |
| **WIP Limit Violations** | Regularly exceeding WIP limits | Enforce limits, escalate violations, address root causes |
| **Stale Epics** | Epics staying in one state for extended periods | Implement aging policies, regular review of aged items |
| **Bypassing Process** | Moving epics without meeting exit criteria | Reinforce policies, require formal approval for exceptions |
| **Micro-portfolio Management** | Portfolio team making all decisions | Empower ARTs/teams, focus portfolio on strategic decisions |
| **Focusing on Activity, Not Outcomes** | Measuring busyness instead of value | Shift metrics to outcomes, measure benefits realization |

---

## Appendix A: SAFe Portfolio Level Roles

- **Enterprise Architect:** Defines strategic technical direction
- **Epic Owner:** Responsible for defining, analyzing, and driving implementation of an epic
- **Lean Portfolio Management (LPM):** Governs the portfolio, allocates budget, and defines strategic themes
- **Product Management:** Represents customer needs at the portfolio level
- **Business Owners:** Responsible for ROI, business results, and implementation

## Appendix B: Additional Resources

- SAFe Framework: [www.scaledagileframework.com](https://www.scaledagileframework.com/)
- Portfolio Kanban article: [www.scaledagileframework.com/portfolio-kanban](https://www.scaledagileframework.com/portfolio-kanban/)
- Lean Portfolio Management: [www.scaledagileframework.com/lean-portfolio-management](https://www.scaledagileframework.com/lean-portfolio-management/)

---

*This template follows the Scaled Agile Framework (SAFe) Portfolio Kanban practices. Customize as needed for your organization's specific implementation of SAFe.*
