---
title: "Project Dashboard Template"
methodology: "universal"
complexity: "advanced"
owner: "mirichard"
updated: "2026-09-19"
primary_principles: ["evidence-based-decisions"]
secondary_principles: ["risk-optimization", "stakeholder-engagement"]
principle_rationale: "Defines dashboard metrics, sources and status thresholds so stakeholders can identify exceptions and assign timely action."
---


# Project Dashboard Template

## When to Use

- During execution when a concise dashboard supports exception decisions.
- When owners can maintain metric definitions, sources, status thresholds, and actions.

## When NOT to Use

- To turn missing or stale data into a favorable status.
- Do not report sample values, unsupported ratings, or missing data as verified performance. See [Metric without source](../../../../../docs/principles/anti-patterns.md#metric-source).

## Pairs Well With

- [Status Report Template](../../../../../domains/uncertainty/project-lifecycle/04-monitoring-control/progress-tracking/status-report-template.md).
- [Project Performance Monitoring Template](../../../../../domains/delivery/templates/traditional/Traditional/Process_Groups/Monitoring_and_Controlling/project_performance_monitoring_template.md).

Selection context: Uncertainty domain; universal methodology; advanced complexity. Match the situations above to project phase, risk, team size, and industry using the [decision-engine context model](../../../../../meta/architecture-research/800-801-context-assessment-model.md).

## Purpose/Overview
This dashboard template provides a visual, at-a-glance view of project health and performance. Designed for quick status communication, it presents key metrics, milestones, and issues in a concise format ideal for stakeholder briefings, executive reporting, and team meetings. The template emphasizes visual indicators and trend data to facilitate rapid decision-making.

## Usage Instructions
1. **Update Frequency**: Refresh weekly or bi-weekly to maintain accuracy
2. **Visual Indicators**: Use consistent color coding (🟢🟡🔴) throughout
3. **Data Sources**: Pull metrics from your project management tools
4. **Trend Analysis**: Include variance and trend indicators where relevant
5. **Focus Areas**: Highlight only the most critical risks and issues
6. **Stakeholder Review**: Share during project meetings and status calls
7. **Customization**: Add/remove metrics based on your project's key success factors
8. **Archive**: Maintain historical versions to track project trends over time

## Project Overview
- **Project Name**: [Project Name]
- **Project Manager**: [Name]
- **Reporting Period**: [Period]
- **Overall Status**: 🟢 Green / 🟡 Yellow / 🔴 Red

## Executive Summary
[Brief summary of project status, key achievements, and critical issues]

## Metric definitions and status rules

For each metric, record its source, data date, owner, target, and status thresholds. Use “not assessed” when evidence is unavailable. Agree the meaning of green/yellow/red before reporting.

Cost variance below means actual cost minus the approved budget for the same reporting scope and period; positive is over budget. It is not an earned-value cost variance. Schedule variance below is actual or forecast milestone date minus baseline date in days; positive is late. Define the quality-score calculation before using it.

## Key Metrics

### Schedule Performance
- **Planned Progress**: [X]%
- **Actual Progress**: [Y]%
- **Schedule Variance**: [+/- days]

### Budget Performance  
- **Budget**: $[Amount]
- **Actual Cost**: $[Amount]
- **Cost Variance**: [+/- $Amount]

### Quality Metrics
- **Defects Found**: [Number]
- **Defects Resolved**: [Number]
- **Quality Score**: [Score]

## Milestone Status
| Milestone | Planned Date | Actual Date | Status |
|-----------|--------------|-------------|--------|
| [Milestone 1] | [Date] | [Date] | ✅ Complete |
| [Milestone 2] | [Date] | - | 🟡 In Progress |
| [Milestone 3] | [Date] | - | ⏳ Planned |

## Top Risks and Issues
| Item | Type | Priority | Status | Owner |
|------|------|----------|--------|-------|
| [Item] | Risk/Issue | High/Med/Low | [Status] | [Owner] |

## Upcoming Activities
- [Key activities for next period]

*Visual project performance tracking*

