---
title: "Roi Tracking Template"
methodology: "traditional"
complexity: "advanced"
owner: "mirichard"
updated: "2025-08-05"
---

# ROI Tracking Template

## Overview

This template provides a comprehensive framework for tracking Return on Investment (ROI) throughout the project lifecycle, aligned with Traditional Guide Project Cost Management knowledge area. Use this template to measure, monitor, and report on project value creation and financial performance.

## ROI Calculation Framework

### Basic ROI Formula
```
ROI = (Financial Benefit - Project Cost) / Project Cost × 100%
```

### Net Present Value (NPV) Calculation
```
NPV = Σ [Benefit(t) / (1 + r)^t] - Initial Investment
Where:
- t = time period
- r = discount rate
- Benefit(t) = net benefit in period t
```

### Internal Rate of Return (IRR)
```
IRR = Discount rate where NPV = 0
```

## Project Financial Overview

### Project Information
- **Project Name:** {{ project_name }}
- **Project ID:** {{ project_id }}
- **Project Manager:** {{ project_manager }}
- **Start Date:** {{ start_date }}
- **End Date:** {{ end_date }}
- **Business Case Reference:** {{ business_case_ref }}

### Investment Summary
- **Total Project Investment:** ${{ total_investment }}
- **Initial Capital Investment:** ${{ initial_investment }}
- **Operational Investment:** ${{ operational_investment }}
- **Implementation Costs:** ${{ implementation_costs }}
- **Training and Change Management:** ${{ training_costs }}

## Cost Tracking

### Project Costs Breakdown

| Cost Category | Budgeted Amount | Actual Amount | Variance | Variance % |
|---------------|----------------|---------------|----------|------------|
| Personnel Costs | ${{ personnel_budget }} | ${{ personnel_actual }} | ${{ personnel_variance }} | {{ personnel_variance_pct }}% |
| Technology/Equipment | ${{ technology_budget }} | ${{ technology_actual }} | ${{ technology_variance }} | {{ technology_variance_pct }}% |
| Software Licenses | ${{ software_budget }} | ${{ software_actual }} | ${{ software_variance }} | {{ software_variance_pct }}% |
| Training & Development | ${{ training_budget }} | ${{ training_actual }} | ${{ training_variance }} | {{ training_variance_pct }}% |
| External Services | ${{ external_budget }} | ${{ external_actual }} | ${{ external_variance }} | {{ external_variance_pct }}% |
| Infrastructure | ${{ infrastructure_budget }} | ${{ infrastructure_actual }} | ${{ infrastructure_variance }} | {{ infrastructure_variance_pct }}% |
| Other Costs | ${{ other_budget }} | ${{ other_actual }} | ${{ other_variance }} | {{ other_variance_pct }}% |
| **TOTAL** | **${{ total_budget }}** | **${{ total_actual }}** | **${{ total_variance }}** | **{{ total_variance_pct }}%** |

### Cost Performance Indicators
- **Cost Performance Index (CPI):** {{ cpi }} ({{ cpi_status }})
- **Budget at Completion (BAC):** ${{ bac }}
- **Estimate at Completion (EAC):** ${{ eac }}
- **Estimate to Complete (ETC):** ${{ etc }}
- **Variance at Completion (VAC):** ${{ vac }}

## Benefits Tracking

### Financial Benefits

#### Direct Financial Benefits

| Benefit Category | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 | Total |
|------------------|--------|--------|--------|--------|--------|-------|
| Cost Savings | ${{ y1_cost_savings }} | ${{ y2_cost_savings }} | ${{ y3_cost_savings }} | ${{ y4_cost_savings }} | ${{ y5_cost_savings }} | ${{ total_cost_savings }} |
| Revenue Increase | ${{ y1_revenue_increase }} | ${{ y2_revenue_increase }} | ${{ y3_revenue_increase }} | ${{ y4_revenue_increase }} | ${{ y5_revenue_increase }} | ${{ total_revenue_increase }} |
| Cost Avoidance | ${{ y1_cost_avoidance }} | ${{ y2_cost_avoidance }} | ${{ y3_cost_avoidance }} | ${{ y4_cost_avoidance }} | ${{ y5_cost_avoidance }} | ${{ total_cost_avoidance }} |
| **Total Benefits** | **${{ y1_total_benefits }}** | **${{ y2_total_benefits }}** | **${{ y3_total_benefits }}** | **${{ y4_total_benefits }}** | **${{ y5_total_benefits }}** | **${{ total_benefits }}** |

#### Operational Cost Savings

| Savings Category | Annual Savings | Description | Realization Status |
|------------------|----------------|-------------|-------------------|
| Process Automation | ${{ automation_savings }} | {{ automation_description }} | {{ automation_status }} |
| Resource Optimization | ${{ resource_savings }} | {{ resource_description }} | {{ resource_status }} |
| Efficiency Improvements | ${{ efficiency_savings }} | {{ efficiency_description }} | {{ efficiency_status }} |
| Error Reduction | ${{ error_savings }} | {{ error_description }} | {{ error_status }} |
| Compliance Improvements | ${{ compliance_savings }} | {{ compliance_description }} | {{ compliance_status }} |

#### Revenue Enhancement

| Revenue Stream | Annual Impact | Description | Realization Status |
|----------------|---------------|-------------|-------------------|
| New Products/Services | ${{ new_product_revenue }} | {{ new_product_description }} | {{ new_product_status }} |
| Market Expansion | ${{ market_expansion_revenue }} | {{ market_description }} | {{ market_status }} |
| Customer Retention | ${{ retention_revenue }} | {{ retention_description }} | {{ retention_status }} |
| Pricing Optimization | ${{ pricing_revenue }} | {{ pricing_description }} | {{ pricing_status }} |
| Cross-selling/Upselling | ${{ cross_sell_revenue }} | {{ cross_sell_description }} | {{ cross_sell_status }} |

### Non-Financial Benefits

#### Quantifiable Non-Financial Benefits

| Benefit | Baseline | Target | Current | Achievement % | Business Value |
|---------|----------|--------|---------|---------------|----------------|
| Customer Satisfaction Score | {{ customer_baseline }} | {{ customer_target }} | {{ customer_current }} | {{ customer_achievement }}% | {{ customer_value }} |
| Employee Productivity | {{ productivity_baseline }} | {{ productivity_target }} | {{ productivity_current }} | {{ productivity_achievement }}% | {{ productivity_value }} |
| Process Cycle Time | {{ cycle_baseline }} | {{ cycle_target }} | {{ cycle_current }} | {{ cycle_achievement }}% | {{ cycle_value }} |
| Quality Improvement | {{ quality_baseline }} | {{ quality_target }} | {{ quality_current }} | {{ quality_achievement }}% | {{ quality_value }} |
| Compliance Score | {{ compliance_baseline }} | {{ compliance_target }} | {{ compliance_current }} | {{ compliance_achievement }}% | {{ compliance_value }} |

#### Qualitative Benefits

**Strategic Benefits:**
- {{ strategic_benefit_1 }}
- {{ strategic_benefit_2 }}
- {{ strategic_benefit_3 }}

**Operational Benefits:**
- {{ operational_benefit_1 }}
- {{ operational_benefit_2 }}
- {{ operational_benefit_3 }}

**Stakeholder Benefits:**
- {{ stakeholder_benefit_1 }}
- {{ stakeholder_benefit_2 }}
- {{ stakeholder_benefit_3 }}

## ROI Analysis

### Current ROI Calculations

#### Simple ROI
```
Current ROI = ({{ total_benefits_realized }} - {{ total_costs_actual }}) / {{ total_costs_actual }} × 100%
Current ROI = {{ simple_roi }}%
```

#### Net Present Value (NPV)
```
NPV Calculation (Discount Rate: {{ discount_rate }}%):
Year 0: -${{ year0_cashflow }}
Year 1: ${{ year1_cashflow_pv }}
Year 2: ${{ year2_cashflow_pv }}
Year 3: ${{ year3_cashflow_pv }}
Year 4: ${{ year4_cashflow_pv }}
Year 5: ${{ year5_cashflow_pv }}

Net Present Value: ${{ npv_total }}
```

#### Internal Rate of Return (IRR)
```
IRR = {{ irr_percentage }}%
```

#### Payback Period
```
Simple Payback Period: {{ simple_payback }} years
Discounted Payback Period: {{ discounted_payback }} years
```

### ROI Performance Tracking

| Metric | Planned | Actual | Variance | Status |
|--------|---------|--------|----------|---------|
| Simple ROI | {{ planned_roi }}% | {{ actual_roi }}% | {{ roi_variance }}% | {{ roi_status }} |
| NPV | ${{ planned_npv }} | ${{ actual_npv }} | ${{ npv_variance }} | {{ npv_status }} |
| IRR | {{ planned_irr }}% | {{ actual_irr }}% | {{ irr_variance }}% | {{ irr_status }} |
| Payback Period | {{ planned_payback }} years | {{ actual_payback }} years | {{ payback_variance }} years | {{ payback_status }} |

### ROI Trend Analysis

#### Monthly ROI Tracking
| Month | Cumulative Investment | Cumulative Benefits | ROI % | Trend |
|-------|----------------------|-------------------|-------|--------|
| {{ month1 }} | ${{ month1_investment }} | ${{ month1_benefits }} | {{ month1_roi }}% | {{ month1_trend }} |
| {{ month2 }} | ${{ month2_investment }} | ${{ month2_benefits }} | {{ month2_roi }}% | {{ month2_trend }} |
| {{ month3 }} | ${{ month3_investment }} | ${{ month3_benefits }} | {{ month3_roi }}% | {{ month3_trend }} |
| {{ month4 }} | ${{ month4_investment }} | ${{ month4_benefits }} | {{ month4_roi }}% | {{ month4_trend }} |
| {{ month5 }} | ${{ month5_investment }} | ${{ month5_benefits }} | {{ month5_roi }}% | {{ month5_trend }} |
| {{ month6 }} | ${{ month6_investment }} | ${{ month6_benefits }} | {{ month6_roi }}% | {{ month6_trend }} |

## Benefit Realization Management

### Benefit Realization Plan

| Benefit | Owner | Target Date | Realization Approach | Success Criteria | Status |
|---------|--------|-------------|---------------------|------------------|---------|
| {{ benefit1_name }} | {{ benefit1_owner }} | {{ benefit1_date }} | {{ benefit1_approach }} | {{ benefit1_criteria }} | {{ benefit1_status }} |
| {{ benefit2_name }} | {{ benefit2_owner }} | {{ benefit2_date }} | {{ benefit2_approach }} | {{ benefit2_criteria }} | {{ benefit2_status }} |
| {{ benefit3_name }} | {{ benefit3_owner }} | {{ benefit3_date }} | {{ benefit3_approach }} | {{ benefit3_criteria }} | {{ benefit3_status }} |

### Benefit Tracking Schedule

#### Phase 1: Implementation (Months 1-6)
- **Expected Benefits:** ${{ phase1_benefits }}
- **Key Milestones:** {{ phase1_milestones }}
- **Risk Factors:** {{ phase1_risks }}

#### Phase 2: Early Adoption (Months 7-12)
- **Expected Benefits:** ${{ phase2_benefits }}
- **Key Milestones:** {{ phase2_milestones }}
- **Risk Factors:** {{ phase2_risks }}

#### Phase 3: Full Realization (Months 13-24)
- **Expected Benefits:** ${{ phase3_benefits }}
- **Key Milestones:** {{ phase3_milestones }}
- **Risk Factors:** {{ phase3_risks }}

### Benefit Realization Risks

| Risk | Impact | Probability | Mitigation Strategy | Owner | Status |
|------|--------|-------------|-------------------|--------|---------|
| {{ risk1_description }} | {{ risk1_impact }} | {{ risk1_probability }} | {{ risk1_mitigation }} | {{ risk1_owner }} | {{ risk1_status }} |
| {{ risk2_description }} | {{ risk2_impact }} | {{ risk2_probability }} | {{ risk2_mitigation }} | {{ risk2_owner }} | {{ risk2_status }} |
| {{ risk3_description }} | {{ risk3_impact }} | {{ risk3_probability }} | {{ risk3_mitigation }} | {{ risk3_owner }} | {{ risk3_status }} |

## Performance Dashboard

### Key Performance Indicators

#### Financial KPIs
- **Current ROI:** {{ current_roi }}% (Target: {{ target_roi }}%)
- **Cost Performance Index:** {{ current_cpi }} (Target: ≥ 1.0)
- **Benefits Realization Rate:** {{ benefits_realization_rate }}% (Target: {{ target_realization_rate }}%)
- **Payback Achievement:** {{ payback_achievement }}% complete

#### Operational KPIs
- **Milestone Achievement:** {{ milestone_achievement }}%
- **Benefit Owner Engagement:** {{ owner_engagement }}%
- **Risk Mitigation Effectiveness:** {{ risk_mitigation_effectiveness }}%
- **Stakeholder Satisfaction:** {{ stakeholder_satisfaction }}/10

### ROI Visualization

#### ROI Trend Chart
```
ROI Progress Over Time:
Month 1: [████░░░░░░] {{ month1_roi }}%
Month 2: [█████░░░░░] {{ month2_roi }}%
Month 3: [██████░░░░] {{ month3_roi }}%
Month 4: [███████░░░] {{ month4_roi }}%
Month 5: [████████░░] {{ month5_roi }}%
Month 6: [█████████░] {{ month6_roi }}%
Target:  [██████████] {{ target_roi }}%
```

#### Benefits vs. Costs Comparison
```
Cumulative Benefits: ${{ cumulative_benefits }}
Cumulative Costs:    ${{ cumulative_costs }}
Net Value:           ${{ net_value }}
```

## Governance and Reporting

### ROI Governance Structure

#### ROI Steering Committee
- **Chair:** {{ steering_chair }}
- **Members:** {{ steering_members }}
- **Meeting Frequency:** {{ steering_frequency }}
- **Responsibilities:** {{ steering_responsibilities }}

#### Benefits Review Board
- **Chair:** {{ benefits_chair }}
- **Members:** {{ benefits_members }}
- **Meeting Frequency:** {{ benefits_frequency }}
- **Responsibilities:** {{ benefits_responsibilities }}

### Reporting Schedule

#### Monthly Reports
- **Audience:** Project team, benefit owners
- **Content:** Cost tracking, benefit realization progress, risk updates
- **Format:** Dashboard summary, detailed variance analysis

#### Quarterly Reviews
- **Audience:** Steering committee, senior stakeholders
- **Content:** ROI performance, trend analysis, corrective actions
- **Format:** Executive presentation, comprehensive analysis

#### Annual Assessment
- **Audience:** Executive leadership, board of directors
- **Content:** Full ROI realization, lessons learned, future recommendations
- **Format:** Comprehensive report, business case validation

### Report Templates

#### Monthly ROI Report Template
```
Project: {{ project_name }}
Reporting Period: {{ reporting_period }}

Executive Summary:
- Current ROI: {{ current_roi }}%
- Benefits Realized: ${{ benefits_realized }}
- Costs Incurred: ${{ costs_incurred }}
- Key Issues: {{ key_issues }}

Detailed Analysis:
[Include detailed cost and benefit breakdown]

Recommendations:
[Include actionable recommendations]

Next Steps:
[Include planned activities for next period]
```

## Continuous Improvement

### ROI Optimization Opportunities

#### Cost Optimization
- {{ cost_optimization_1 }}
- {{ cost_optimization_2 }}
- {{ cost_optimization_3 }}

#### Benefit Enhancement
- {{ benefit_enhancement_1 }}
- {{ benefit_enhancement_2 }}
- {{ benefit_enhancement_3 }}

#### Process Improvements
- {{ process_improvement_1 }}
- {{ process_improvement_2 }}
- {{ process_improvement_3 }}

### Lessons Learned

#### What Worked Well
- {{ success_factor_1 }}
- {{ success_factor_2 }}
- {{ success_factor_3 }}

#### Areas for Improvement
- {{ improvement_area_1 }}
- {{ improvement_area_2 }}
- {{ improvement_area_3 }}

#### Best Practices Identified
- {{ best_practice_1 }}
- {{ best_practice_2 }}
- {{ best_practice_3 }}

## Appendices

### Appendix A: Calculation Methodologies
[Detailed explanation of all ROI calculation methods used]

### Appendix B: Data Sources and Assumptions
[Documentation of all data sources and key assumptions]

### Appendix C: Risk Register
[Complete risk register with detailed risk analysis]

### Appendix D: Stakeholder Analysis
[Analysis of stakeholder impact and engagement]

---

## Related Templates

- [Business Case Template](../../../Waterfall/Templates/business_case_template.md)
- [Project Budget Template](./project_budget_template.md)
- [Cost-Benefit Analysis Template](./cost_benefit_analysis_template.md)
- [Financial Dashboard Template](../../business-stakeholder-suite/safe-executive-dashboards/financial-dashboard-template.md)

---

**Document Control:**
- **Version:** 2.1
- **Last Updated:** {{ current_date }}
- **Next Review:** {{ next_review_date }}
- **Document Owner:** {{ document_owner }}
- **Approved By:** {{ approved_by }}

**Traditional Guide Alignment:**
- **Knowledge Area:** Project Cost Management
- **Process Group:** Monitoring and Controlling
- **Related Processes:** Control Costs, Control Schedule, Monitor and Control Project Work

