# Product Metrics Dashboard Template

## Overview

This comprehensive dashboard template provides Product Owners with essential metrics to track product performance, user engagement, business impact, and development progress. Use this template to create data-driven insights that support product decisions and communicate value to stakeholders.

## Dashboard Structure

### Executive Summary Panel

#### Key Performance Indicators (KPIs)
- **Monthly Active Users (MAU):** {{ current_mau }} ({{ mau_change }}% vs last month)
- **Product Revenue:** ${{ monthly_revenue }} ({{ revenue_change }}% vs last month)
- **Customer Satisfaction (CSAT):** {{ csat_score }}/10 ({{ csat_change }} vs last month)
- **Feature Adoption Rate:** {{ adoption_rate }}% ({{ adoption_change }}% vs last month)

#### Health Score
```
🟢 Product Health: {{ health_score }}/100
├── User Engagement: {{ engagement_score }}/25
├── Business Performance: {{ business_score }}/25  
├── Technical Health: {{ technical_score }}/25
└── User Satisfaction: {{ satisfaction_score }}/25
```

### 1. User Engagement Metrics

#### Core Engagement Metrics

**Daily/Weekly/Monthly Active Users**
```
DAU:  {{ dau }} users  ({{ dau_trend }})
WAU:  {{ wau }} users  ({{ wau_trend }})
MAU:  {{ mau }} users  ({{ mau_trend }})

Ratios:
DAU/MAU: {{ dau_mau_ratio }}% (Stickiness)
WAU/MAU: {{ wau_mau_ratio }}% (Weekly Retention)
```

**Session Metrics**
- Average Session Duration: {{ avg_session_duration }} minutes
- Sessions per User: {{ sessions_per_user }}
- Bounce Rate: {{ bounce_rate }}%
- Pages/Screens per Session: {{ pages_per_session }}

**User Journey Metrics**
- Time to First Value: {{ time_to_first_value }} minutes
- Feature Discovery Rate: {{ feature_discovery_rate }}%
- Conversion Funnel Completion: {{ funnel_completion }}%
- User Onboarding Completion: {{ onboarding_completion }}%

#### User Segmentation Analysis

| Segment | Users | % of Total | Engagement Score | Revenue per User |
|---------|-------|------------|------------------|------------------|
| Power Users | {{ power_users }} | {{ power_users_pct }}% | {{ power_engagement }} | ${{ power_revenue }} |
| Regular Users | {{ regular_users }} | {{ regular_users_pct }}% | {{ regular_engagement }} | ${{ regular_revenue }} |
| Casual Users | {{ casual_users }} | {{ casual_users_pct }}% | {{ casual_engagement }} | ${{ casual_revenue }} |
| At-Risk Users | {{ atrisk_users }} | {{ atrisk_users_pct }}% | {{ atrisk_engagement }} | ${{ atrisk_revenue }} |

#### Cohort Analysis

**Monthly Retention Cohorts**
```
Month 1: {{ month1_retention }}% retained
Month 2: {{ month2_retention }}% retained  
Month 3: {{ month3_retention }}% retained
Month 6: {{ month6_retention }}% retained
Month 12: {{ month12_retention }}% retained
```

### 2. Feature Performance Metrics

#### Feature Adoption Tracking

| Feature | Launch Date | Users | Adoption Rate | Usage Frequency | User Rating |
|---------|-------------|-------|---------------|-----------------|-------------|
| {{ feature1_name }} | {{ feature1_date }} | {{ feature1_users }} | {{ feature1_adoption }}% | {{ feature1_frequency }} | {{ feature1_rating }}/5 |
| {{ feature2_name }} | {{ feature2_date }} | {{ feature2_users }} | {{ feature2_adoption }}% | {{ feature2_frequency }} | {{ feature2_rating }}/5 |
| {{ feature3_name }} | {{ feature3_date }} | {{ feature3_users }} | {{ feature3_adoption }}% | {{ feature3_frequency }} | {{ feature3_rating }}/5 |

#### Feature Usage Trends
- **Most Used Features:** {{ top_features }}
- **Fastest Growing Features:** {{ growing_features }}
- **Underperforming Features:** {{ underperforming_features }}
- **Feature Drop-off Points:** {{ dropoff_features }}

#### A/B Testing Results

**Current Tests**
- Test: {{ test_name }}
  - Variant A: {{ variant_a_conversion }}% conversion
  - Variant B: {{ variant_b_conversion }}% conversion
  - Confidence: {{ test_confidence }}%
  - Recommendation: {{ test_recommendation }}

### 3. Business Impact Metrics

#### Revenue Metrics
- **Monthly Recurring Revenue (MRR):** ${{ mrr }}
- **Annual Recurring Revenue (ARR):** ${{ arr }}
- **Average Revenue Per User (ARPU):** ${{ arpu }}
- **Customer Lifetime Value (CLV):** ${{ clv }}
- **Customer Acquisition Cost (CAC):** ${{ cac }}
- **CLV/CAC Ratio:** {{ clv_cac_ratio }}:1

#### Conversion Metrics
- **Trial to Paid Conversion:** {{ trial_conversion }}%
- **Freemium to Premium:** {{ freemium_conversion }}%
- **Upsell Rate:** {{ upsell_rate }}%
- **Cross-sell Rate:** {{ crosssell_rate }}%

#### Customer Metrics
- **New Customers:** {{ new_customers }} ({{ new_customers_change }}% vs last month)
- **Churned Customers:** {{ churned_customers }} ({{ churn_rate }}% churn rate)
- **Net Revenue Churn:** {{ net_revenue_churn }}%
- **Logo Churn:** {{ logo_churn }}%

### 4. User Satisfaction Metrics

#### Satisfaction Scores
- **Customer Satisfaction (CSAT):** {{ csat_score }}/10
- **Net Promoter Score (NPS):** {{ nps_score }} ({{ nps_category }})
- **Customer Effort Score (CES):** {{ ces_score }}/7
- **Product-Market Fit Score:** {{ pmf_score }}%

#### Feedback Analysis
**Recent Feedback Themes:**
- Positive: {{ positive_feedback_themes }}
- Negative: {{ negative_feedback_themes }}
- Feature Requests: {{ feature_requests }}
- Bug Reports: {{ bug_reports }}

**Support Metrics:**
- Tickets Created: {{ support_tickets }}
- Average Resolution Time: {{ avg_resolution_time }} hours
- First Contact Resolution: {{ fcr_rate }}%
- Support Satisfaction: {{ support_satisfaction }}/5

### 5. Development & Quality Metrics

#### Release Metrics
- **Release Frequency:** {{ release_frequency }} releases/month
- **Lead Time:** {{ lead_time }} days (idea to production)
- **Cycle Time:** {{ cycle_time }} days (development to release)
- **Deployment Success Rate:** {{ deployment_success }}%

#### Quality Metrics
- **Bug Reports:** {{ bug_reports }} ({{ bug_trend }} vs last month)
- **Critical Issues:** {{ critical_issues }}
- **Average Bug Resolution Time:** {{ bug_resolution_time }} hours
- **Technical Debt Score:** {{ tech_debt_score }}/100

#### Team Performance
- **Story Points Completed:** {{ story_points }}
- **Sprint Goal Achievement:** {{ sprint_goals }}%
- **Team Velocity:** {{ team_velocity }} points/sprint
- **Predictability:** {{ predictability }}%

### 6. Competitive & Market Analysis

#### Market Position
- **Market Share:** {{ market_share }}%
- **Competitive Win Rate:** {{ win_rate }}%
- **Feature Parity Score:** {{ feature_parity }}%
- **Time to Market vs Competitors:** {{ time_to_market }}% faster/slower

#### Industry Benchmarks
| Metric | Our Product | Industry Average | Ranking |
|--------|-------------|------------------|---------|
| CSAT Score | {{ our_csat }} | {{ industry_csat }} | {{ csat_ranking }} |
| NPS | {{ our_nps }} | {{ industry_nps }} | {{ nps_ranking }} |
| Feature Adoption | {{ our_adoption }} | {{ industry_adoption }} | {{ adoption_ranking }} |

### 7. Goal Tracking & OKRs

#### Quarterly Objectives

**Objective 1: {{ objective1_name }}**
- Key Result 1: {{ kr1_description }} ({{ kr1_progress }}% complete)
- Key Result 2: {{ kr2_description }} ({{ kr2_progress }}% complete)
- Key Result 3: {{ kr3_description }} ({{ kr3_progress }}% complete)

**Objective 2: {{ objective2_name }}**
- Key Result 1: {{ kr4_description }} ({{ kr4_progress }}% complete)
- Key Result 2: {{ kr5_description }} ({{ kr5_progress }}% complete)

#### Goal Progress Visualization
```
Q{{ current_quarter }} Goals Progress:
{{ goal1_name }}: ████████████░░░░ {{ goal1_progress }}%
{{ goal2_name }}: ████████████████ {{ goal2_progress }}%
{{ goal3_name }}: ████████░░░░░░░░ {{ goal3_progress }}%
```

### 8. Alerts & Action Items

#### Red Flag Indicators
🔴 **Critical Issues:**
- {{ critical_issue1 }}
- {{ critical_issue2 }}

🟡 **Warning Indicators:**
- {{ warning1 }}
- {{ warning2 }}

#### Recommended Actions
1. **Immediate (This Week):**
   - {{ immediate_action1 }}
   - {{ immediate_action2 }}

2. **Short-term (This Month):**
   - {{ shortterm_action1 }}
   - {{ shortterm_action2 }}

3. **Long-term (This Quarter):**
   - {{ longterm_action1 }}
   - {{ longterm_action2 }}

## Dashboard Configuration

### Data Sources
- **Analytics Platform:** Google Analytics, Mixpanel, Amplitude
- **Product Database:** User activity logs, feature usage data
- **Customer Success:** Support tickets, satisfaction surveys
- **Financial Systems:** Revenue data, subscription metrics
- **Development Tools:** Jira, GitHub, deployment metrics

### Refresh Schedule
- **Real-time Metrics:** User activity, system health
- **Daily Updates:** Engagement metrics, support tickets
- **Weekly Updates:** Revenue metrics, cohort analysis
- **Monthly Updates:** NPS scores, competitive analysis

### Access & Permissions
- **View Access:** All product team members, key stakeholders
- **Edit Access:** Product Owner, Product Manager, Analytics lead
- **Admin Access:** Product Owner, Technical lead

## Dashboard Templates by Role

### Executive Summary Dashboard
**Frequency:** Weekly
**Audience:** Executives, Leadership team
**Focus:** High-level KPIs, business impact, strategic metrics

### Product Team Dashboard  
**Frequency:** Daily
**Audience:** Product team, Engineering, Design
**Focus:** Feature performance, user engagement, development metrics

### Customer Success Dashboard
**Frequency:** Daily  
**Audience:** Customer Success, Support teams
**Focus:** User satisfaction, support metrics, health scores

### Marketing Dashboard
**Frequency:** Weekly
**Audience:** Marketing, Growth teams  
**Focus:** Acquisition metrics, conversion funnels, user segments

## Best Practices

### Dashboard Design
- **Keep it Simple:** Focus on actionable metrics
- **Visual Hierarchy:** Most important metrics prominently displayed
- **Color Coding:** Consistent color scheme for status indicators
- **Mobile-Friendly:** Ensure accessibility on mobile devices

### Data Quality
- **Regular Validation:** Verify data accuracy weekly
- **Clear Definitions:** Document metric calculations
- **Historical Context:** Show trends and comparisons
- **Real-time Updates:** Ensure timely data refresh

### Stakeholder Communication
- **Regular Reviews:** Weekly dashboard walkthroughs
- **Context Provision:** Explain metric changes and trends
- **Action-Oriented:** Focus on insights that drive decisions
- **Feedback Loop:** Continuously improve based on user needs

---

## Related Resources

- [OKR Template](./okr-template.md)
- [User Research Planning](./user-research-planning.md)
- [Product Strategy Canvas](./product-strategy-canvas.md)
- [Analytics Implementation Guide](../project-manager/reporting-dashboards/analytics-setup.md)

---

**Last Updated:** {{ current_date }}
**Dashboard Version:** 3.2
**Next Review:** {{ next_month }}

