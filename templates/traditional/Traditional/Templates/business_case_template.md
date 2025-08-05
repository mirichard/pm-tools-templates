---
title: "Business Case Template"
methodology: "traditional"
complexity: "advanced"
owner: "mirichard"
updated: "2025-08-05"
---

# Business Case Template - Waterfall Methodology

## Executive Summary

### Project Overview
- **Project Name:** {{ project_name }}
- **Project Sponsor:** {{ project_sponsor }}
- **Business Case Owner:** {{ business_case_owner }}
- **Date Prepared:** {{ date_prepared }}
- **Executive Approval Required:** {{ approval_required }}

### Investment Summary
- **Total Investment Required:** ${{ total_investment }}
- **Expected ROI:** {{ expected_roi }}%
- **Payback Period:** {{ payback_period }} years
- **Net Present Value (NPV):** ${{ npv }}
- **Internal Rate of Return (IRR):** {{ irr }}%

### Strategic Justification
{{ strategic_justification_summary }}

### Recommendation
{{ executive_recommendation }}

## 1. Problem Statement and Opportunity

### Business Problem
{{ business_problem_description }}

### Current State Analysis
- **Current Process/System:** {{ current_state }}
- **Key Pain Points:** 
  - {{ pain_point_1 }}
  - {{ pain_point_2 }}
  - {{ pain_point_3 }}
- **Quantified Impact:**
  - Annual cost of problem: ${{ annual_cost_problem }}
  - Productivity loss: {{ productivity_loss }}%
  - Customer impact: {{ customer_impact }}

### Market Opportunity
- **Market Size:** ${{ market_size }}
- **Target Market Share:** {{ target_market_share }}%
- **Revenue Opportunity:** ${{ revenue_opportunity }}
- **Competitive Advantage:** {{ competitive_advantage }}

### Drivers for Change
#### Internal Drivers
- {{ internal_driver_1 }}
- {{ internal_driver_2 }}
- {{ internal_driver_3 }}

#### External Drivers
- {{ external_driver_1 }}
- {{ external_driver_2 }}
- {{ external_driver_3 }}

## 2. Strategic Alignment

### Organizational Strategy Alignment
- **Strategic Goal 1:** {{ strategic_goal_1 }}
  - **Alignment:** {{ alignment_1 }}
- **Strategic Goal 2:** {{ strategic_goal_2 }}
  - **Alignment:** {{ alignment_2 }}
- **Strategic Goal 3:** {{ strategic_goal_3 }}
  - **Alignment:** {{ alignment_3 }}

### Success Criteria
| Success Criterion | Target Metric | Measurement Method | Responsible Party |
|------------------|---------------|-------------------|-------------------|
| {{ criterion_1 }} | {{ target_1 }} | {{ measurement_1 }} | {{ responsible_1 }} |
| {{ criterion_2 }} | {{ target_2 }} | {{ measurement_2 }} | {{ responsible_2 }} |
| {{ criterion_3 }} | {{ target_3 }} | {{ measurement_3 }} | {{ responsible_3 }} |

## 3. Solution Overview

### Proposed Solution
{{ solution_description }}

### Key Features and Capabilities
1. **{{ feature_1_name }}**
   - Description: {{ feature_1_description }}
   - Business Value: {{ feature_1_value }}

2. **{{ feature_2_name }}**
   - Description: {{ feature_2_description }}
   - Business Value: {{ feature_2_value }}

3. **{{ feature_3_name }}**
   - Description: {{ feature_3_description }}
   - Business Value: {{ feature_3_value }}

### Solution Architecture (High-Level)
{{ solution_architecture_description }}

### Technology Components
- **Platform:** {{ platform }}
- **Integration Requirements:** {{ integration_requirements }}
- **Infrastructure Needs:** {{ infrastructure_needs }}
- **Security Requirements:** {{ security_requirements }}

## 4. Options Analysis

### Option 1: Do Nothing (Status Quo)
- **Description:** {{ option1_description }}
- **Cost:** ${{ option1_cost }}
- **Benefits:** {{ option1_benefits }}
- **Risks:** {{ option1_risks }}
- **Recommendation:** {{ option1_recommendation }}

### Option 2: Proposed Solution
- **Description:** {{ option2_description }}
- **Cost:** ${{ option2_cost }}
- **Benefits:** {{ option2_benefits }}
- **Risks:** {{ option2_risks }}
- **Recommendation:** {{ option2_recommendation }}

### Option 3: Alternative Solution
- **Description:** {{ option3_description }}
- **Cost:** ${{ option3_cost }}
- **Benefits:** {{ option3_benefits }}
- **Risks:** {{ option3_risks }}
- **Recommendation:** {{ option3_recommendation }}

### Options Comparison Matrix

| Criteria | Weight | Option 1 (Do Nothing) | Option 2 (Proposed) | Option 3 (Alternative) |
|----------|--------|----------------------|---------------------|------------------------|
| Cost | {{ cost_weight }}% | {{ option1_cost_score }} | {{ option2_cost_score }} | {{ option3_cost_score }} |
| Benefit Realization | {{ benefit_weight }}% | {{ option1_benefit_score }} | {{ option2_benefit_score }} | {{ option3_benefit_score }} |
| Risk Level | {{ risk_weight }}% | {{ option1_risk_score }} | {{ option2_risk_score }} | {{ option3_risk_score }} |
| Implementation Complexity | {{ complexity_weight }}% | {{ option1_complexity_score }} | {{ option2_complexity_score }} | {{ option3_complexity_score }} |
| Strategic Fit | {{ strategic_weight }}% | {{ option1_strategic_score }} | {{ option2_strategic_score }} | {{ option3_strategic_score }} |
| **Weighted Total** | **100%** | **{{ option1_total_score }}** | **{{ option2_total_score }}** | **{{ option3_total_score }}** |

## 5. Financial Analysis

### Investment Requirements

#### Capital Expenditure (CapEx)
| Category | Year 0 | Year 1 | Year 2 | Year 3 | Total |
|----------|--------|--------|--------|--------|-------|
| Hardware | ${{ hardware_y0 }} | ${{ hardware_y1 }} | ${{ hardware_y2 }} | ${{ hardware_y3 }} | ${{ hardware_total }} |
| Software Licenses | ${{ software_y0 }} | ${{ software_y1 }} | ${{ software_y2 }} | ${{ software_y3 }} | ${{ software_total }} |
| Implementation Services | ${{ implementation_y0 }} | ${{ implementation_y1 }} | ${{ implementation_y2 }} | ${{ implementation_y3 }} | ${{ implementation_total }} |
| Training | ${{ training_y0 }} | ${{ training_y1 }} | ${{ training_y2 }} | ${{ training_y3 }} | ${{ training_total }} |
| **Total CapEx** | **${{ capex_y0 }}** | **${{ capex_y1 }}** | **${{ capex_y2 }}** | **${{ capex_y3 }}** | **${{ capex_total }}** |

#### Operational Expenditure (OpEx)
| Category | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 | Total |
|----------|--------|--------|--------|--------|--------|-------|
| Software Maintenance | ${{ maintenance_y1 }} | ${{ maintenance_y2 }} | ${{ maintenance_y3 }} | ${{ maintenance_y4 }} | ${{ maintenance_y5 }} | ${{ maintenance_total }} |
| Support Services | ${{ support_y1 }} | ${{ support_y2 }} | ${{ support_y3 }} | ${{ support_y4 }} | ${{ support_y5 }} | ${{ support_total }} |
| Infrastructure | ${{ infrastructure_y1 }} | ${{ infrastructure_y2 }} | ${{ infrastructure_y3 }} | ${{ infrastructure_y4 }} | ${{ infrastructure_y5 }} | ${{ infrastructure_total }} |
| Internal Resources | ${{ internal_y1 }} | ${{ internal_y2 }} | ${{ internal_y3 }} | ${{ internal_y4 }} | ${{ internal_y5 }} | ${{ internal_total }} |
| **Total OpEx** | **${{ opex_y1 }}** | **${{ opex_y2 }}** | **${{ opex_y3 }}** | **${{ opex_y4 }}** | **${{ opex_y5 }}** | **${{ opex_total }}** |

### Benefit Analysis

#### Financial Benefits
| Benefit Category | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 | Total |
|------------------|--------|--------|--------|--------|--------|-------|
| Cost Savings | ${{ cost_savings_y1 }} | ${{ cost_savings_y2 }} | ${{ cost_savings_y3 }} | ${{ cost_savings_y4 }} | ${{ cost_savings_y5 }} | ${{ cost_savings_total }} |
| Revenue Increase | ${{ revenue_y1 }} | ${{ revenue_y2 }} | ${{ revenue_y3 }} | ${{ revenue_y4 }} | ${{ revenue_y5 }} | ${{ revenue_total }} |
| Productivity Gains | ${{ productivity_y1 }} | ${{ productivity_y2 }} | ${{ productivity_y3 }} | ${{ productivity_y4 }} | ${{ productivity_y5 }} | ${{ productivity_total }} |
| Cost Avoidance | ${{ avoidance_y1 }} | ${{ avoidance_y2 }} | ${{ avoidance_y3 }} | ${{ avoidance_y4 }} | ${{ avoidance_y5 }} | ${{ avoidance_total }} |
| **Total Benefits** | **${{ benefits_y1 }}** | **${{ benefits_y2 }}** | **${{ benefits_y3 }}** | **${{ benefits_y4 }}** | **${{ benefits_y5 }}** | **${{ benefits_total }}** |

### ROI Analysis

#### Cash Flow Analysis
| Year | Investment | Benefits | Net Cash Flow | Cumulative Cash Flow |
|------|-----------|----------|---------------|---------------------|
| 0 | (${{ investment_y0 }}) | $0 | (${{ net_cashflow_y0 }}) | (${{ cumulative_y0 }}) |
| 1 | (${{ investment_y1 }}) | ${{ benefits_y1 }} | ${{ net_cashflow_y1 }} | ${{ cumulative_y1 }} |
| 2 | (${{ investment_y2 }}) | ${{ benefits_y2 }} | ${{ net_cashflow_y2 }} | ${{ cumulative_y2 }} |
| 3 | (${{ investment_y3 }}) | ${{ benefits_y3 }} | ${{ net_cashflow_y3 }} | ${{ cumulative_y3 }} |
| 4 | (${{ investment_y4 }}) | ${{ benefits_y4 }} | ${{ net_cashflow_y4 }} | ${{ cumulative_y4 }} |
| 5 | (${{ investment_y5 }}) | ${{ benefits_y5 }} | ${{ net_cashflow_y5 }} | ${{ cumulative_y5 }} |

#### Financial Metrics
- **Net Present Value (NPV):** ${{ npv }} (Discount Rate: {{ discount_rate }}%)
- **Internal Rate of Return (IRR):** {{ irr }}%
- **Payback Period:** {{ payback_period }} years
- **Return on Investment (ROI):** {{ roi }}%
- **Benefit-Cost Ratio:** {{ benefit_cost_ratio }}:1

### Sensitivity Analysis
| Scenario | NPV | IRR | Payback Period | Comments |
|----------|-----|-----|----------------|----------|
| Base Case | ${{ base_npv }} | {{ base_irr }}% | {{ base_payback }} years | {{ base_comments }} |
| Best Case (+20% benefits) | ${{ best_npv }} | {{ best_irr }}% | {{ best_payback }} years | {{ best_comments }} |
| Worst Case (-20% benefits) | ${{ worst_npv }} | {{ worst_irr }}% | {{ worst_payback }} years | {{ worst_comments }} |

## 6. Implementation Approach

### Waterfall Project Phases

#### Phase 1: Requirements and Analysis ({{ phase1_duration }})
- **Objectives:** {{ phase1_objectives }}
- **Key Deliverables:**
  - {{ phase1_deliverable1 }}
  - {{ phase1_deliverable2 }}
  - {{ phase1_deliverable3 }}
- **Success Criteria:** {{ phase1_success_criteria }}
- **Resource Requirements:** {{ phase1_resources }}

#### Phase 2: Design ({{ phase2_duration }})
- **Objectives:** {{ phase2_objectives }}
- **Key Deliverables:**
  - {{ phase2_deliverable1 }}
  - {{ phase2_deliverable2 }}
  - {{ phase2_deliverable3 }}
- **Success Criteria:** {{ phase2_success_criteria }}
- **Resource Requirements:** {{ phase2_resources }}

#### Phase 3: Development/Implementation ({{ phase3_duration }})
- **Objectives:** {{ phase3_objectives }}
- **Key Deliverables:**
  - {{ phase3_deliverable1 }}
  - {{ phase3_deliverable2 }}
  - {{ phase3_deliverable3 }}
- **Success Criteria:** {{ phase3_success_criteria }}
- **Resource Requirements:** {{ phase3_resources }}

#### Phase 4: Testing ({{ phase4_duration }})
- **Objectives:** {{ phase4_objectives }}
- **Key Deliverables:**
  - {{ phase4_deliverable1 }}
  - {{ phase4_deliverable2 }}
  - {{ phase4_deliverable3 }}
- **Success Criteria:** {{ phase4_success_criteria }}
- **Resource Requirements:** {{ phase4_resources }}

#### Phase 5: Deployment ({{ phase5_duration }})
- **Objectives:** {{ phase5_objectives }}
- **Key Deliverables:**
  - {{ phase5_deliverable1 }}
  - {{ phase5_deliverable2 }}
  - {{ phase5_deliverable3 }}
- **Success Criteria:** {{ phase5_success_criteria }}
- **Resource Requirements:** {{ phase5_resources }}

### Project Timeline
- **Total Project Duration:** {{ total_duration }}
- **Start Date:** {{ project_start_date }}
- **End Date:** {{ project_end_date }}
- **Key Milestones:**
  - {{ milestone1 }}: {{ milestone1_date }}
  - {{ milestone2 }}: {{ milestone2_date }}
  - {{ milestone3 }}: {{ milestone3_date }}
  - {{ milestone4 }}: {{ milestone4_date }}

### Resource Requirements
- **Project Manager:** {{ pm_allocation }}% allocation
- **Business Analyst:** {{ ba_allocation }}% allocation
- **Technical Team:** {{ tech_team_size }} resources
- **Subject Matter Experts:** {{ sme_allocation }}% allocation
- **External Vendors:** {{ vendor_requirements }}

## 7. Risk Analysis

### Risk Assessment Matrix

| Risk | Probability | Impact | Risk Level | Mitigation Strategy | Risk Owner |
|------|------------|--------|------------|-------------------|------------|
| {{ risk1 }} | {{ risk1_probability }} | {{ risk1_impact }} | {{ risk1_level }} | {{ risk1_mitigation }} | {{ risk1_owner }} |
| {{ risk2 }} | {{ risk2_probability }} | {{ risk2_impact }} | {{ risk2_level }} | {{ risk2_mitigation }} | {{ risk2_owner }} |
| {{ risk3 }} | {{ risk3_probability }} | {{ risk3_impact }} | {{ risk3_level }} | {{ risk3_mitigation }} | {{ risk3_owner }} |
| {{ risk4 }} | {{ risk4_probability }} | {{ risk4_impact }} | {{ risk4_level }} | {{ risk4_mitigation }} | {{ risk4_owner }} |

### High-Priority Risks

#### Technical Risks
- **{{ technical_risk1 }}**
  - Impact: {{ technical_risk1_impact }}
  - Mitigation: {{ technical_risk1_mitigation }}

#### Business Risks
- **{{ business_risk1 }}**
  - Impact: {{ business_risk1_impact }}
  - Mitigation: {{ business_risk1_mitigation }}

#### Organizational Risks
- **{{ org_risk1 }}**
  - Impact: {{ org_risk1_impact }}
  - Mitigation: {{ org_risk1_mitigation }}

### Risk Contingency
- **Risk Reserve:** {{ risk_reserve }}% of total budget
- **Contingency Fund:** ${{ contingency_fund }}
- **Risk Response Team:** {{ risk_response_team }}

## 8. Organizational Impact

### Change Management Requirements

#### Stakeholder Impact Analysis
| Stakeholder Group | Impact Level | Change Required | Resistance Level | Engagement Strategy |
|------------------|--------------|-----------------|------------------|-------------------|
| {{ stakeholder1 }} | {{ impact1 }} | {{ change1 }} | {{ resistance1 }} | {{ strategy1 }} |
| {{ stakeholder2 }} | {{ impact2 }} | {{ change2 }} | {{ resistance2 }} | {{ strategy2 }} |
| {{ stakeholder3 }} | {{ impact3 }} | {{ change3 }} | {{ resistance3 }} | {{ strategy3 }} |

#### Training Requirements
- **Training Budget:** ${{ training_budget }}
- **Training Duration:** {{ training_duration }}
- **Training Methods:** {{ training_methods }}
- **Number of Users:** {{ users_to_train }}

### Organizational Readiness
- **Change Readiness Score:** {{ readiness_score }}/10
- **Leadership Support:** {{ leadership_support }}
- **Resource Availability:** {{ resource_availability }}
- **Cultural Fit:** {{ cultural_fit }}

## 9. Success Measurement

### Key Performance Indicators (KPIs)

#### Financial KPIs
- **ROI Achievement:** Target {{ target_roi }}%
- **Cost Reduction:** Target ${{ target_cost_reduction }}
- **Revenue Increase:** Target ${{ target_revenue_increase }}

#### Operational KPIs
- **Process Efficiency:** Target {{ target_efficiency }}% improvement
- **Quality Improvement:** Target {{ target_quality }}% improvement
- **Customer Satisfaction:** Target {{ target_satisfaction }} score

#### Strategic KPIs
- **Market Share:** Target {{ target_market_share }}%
- **Competitive Position:** Target ranking {{ target_ranking }}
- **Innovation Index:** Target {{ target_innovation }} score

### Benefit Realization Plan
- **Benefit Tracking Owner:** {{ benefit_owner }}
- **Measurement Frequency:** {{ measurement_frequency }}
- **Reporting Schedule:** {{ reporting_schedule }}
- **Review Process:** {{ review_process }}

## 10. Governance and Decision Points

### Governance Structure
- **Steering Committee:** {{ steering_committee }}
- **Project Sponsor:** {{ project_sponsor }}
- **Business Case Owner:** {{ business_case_owner }}
- **Project Manager:** {{ project_manager }}

### Decision Gates
#### Gate 1: Concept Approval
- **Date:** {{ gate1_date }}
- **Criteria:** {{ gate1_criteria }}
- **Approvers:** {{ gate1_approvers }}

#### Gate 2: Design Approval
- **Date:** {{ gate2_date }}
- **Criteria:** {{ gate2_criteria }}
- **Approvers:** {{ gate2_approvers }}

#### Gate 3: Implementation Approval
- **Date:** {{ gate3_date }}
- **Criteria:** {{ gate3_criteria }}
- **Approvers:** {{ gate3_approvers }}

#### Gate 4: Deployment Approval
- **Date:** {{ gate4_date }}
- **Criteria:** {{ gate4_criteria }}
- **Approvers:** {{ gate4_approvers }}

### Success Criteria for Business Case Approval
- [ ] Strategic alignment confirmed
- [ ] Financial case validated
- [ ] Risk assessment completed
- [ ] Resource availability confirmed
- [ ] Stakeholder buy-in obtained
- [ ] Implementation plan approved

## 11. Assumptions and Dependencies

### Key Assumptions
1. {{ assumption1 }}
2. {{ assumption2 }}
3. {{ assumption3 }}
4. {{ assumption4 }}
5. {{ assumption5 }}

### Critical Dependencies
1. {{ dependency1 }}
   - **Impact if not met:** {{ dependency1_impact }}
   - **Mitigation:** {{ dependency1_mitigation }}

2. {{ dependency2 }}
   - **Impact if not met:** {{ dependency2_impact }}
   - **Mitigation:** {{ dependency2_mitigation }}

3. {{ dependency3 }}
   - **Impact if not met:** {{ dependency3_impact }}
   - **Mitigation:** {{ dependency3_mitigation }}

## 12. Recommendation and Next Steps

### Recommendation
{{ final_recommendation }}

### Rationale
{{ recommendation_rationale }}

### Immediate Next Steps
1. {{ next_step1 }}
2. {{ next_step2 }}
3. {{ next_step3 }}
4. {{ next_step4 }}

### Approval Required
- **Business Case Approval:** {{ approval_required }}
- **Budget Approval:** ${{ budget_approval_amount }}
- **Resource Approval:** {{ resource_approval }}
- **Timeline Approval:** {{ timeline_approval }}

## Appendices

### Appendix A: Detailed Financial Model
[Include detailed financial calculations and assumptions]

### Appendix B: Market Research and Analysis
[Include market analysis supporting the opportunity]

### Appendix C: Technical Architecture Details
[Include detailed technical specifications and architecture]

### Appendix D: Stakeholder Analysis
[Include detailed stakeholder impact and engagement analysis]

### Appendix E: Risk Register
[Include complete risk register with detailed risk analysis]

---

## Document Control

- **Document Version:** {{ document_version }}
- **Last Updated:** {{ last_updated }}
- **Next Review Date:** {{ next_review }}
- **Document Owner:** {{ document_owner }}
- **Approved By:** {{ approved_by }}
- **Approval Date:** {{ approval_date }}

---

## Related Templates

- [ROI Tracking Template](../../Traditional/Knowledge_Areas/Project_Cost_Management/roi_tracking_template.md)
- [Project Charter Template](./project_charter_template.md)
- [Requirements Specification Template](./requirements_specification_template.md)
- [Project Plan Template](./project_plan_template.md)

---

**Waterfall Methodology Alignment:**
- **Phase:** Initiation
- **Process Group:** Initiating
- **Knowledge Areas:** Project Integration Management, Project Scope Management
- **Gate Review:** Business Case Approval Gate

