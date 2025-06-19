# Prioritization Framework Guide

## Overview

This guide provides product owners with proven frameworks and methodologies for effectively prioritizing product backlogs, features, and initiatives to maximize business value and customer satisfaction.

## Prioritization Principles

### Core Principles
1. **Value-Driven**: Prioritize based on business and customer value
2. **Data-Informed**: Use metrics and evidence, not just opinions
3. **Iterative**: Regularly reassess and adjust priorities
4. **Transparent**: Make prioritization criteria clear to all stakeholders
5. **Balanced**: Consider multiple factors and perspectives

## Prioritization Frameworks

### 1. MoSCoW Method

#### Framework Overview
- **Must Have**: Critical features required for launch
- **Should Have**: Important but not critical features
- **Could Have**: Nice-to-have features if time permits
- **Won't Have**: Features explicitly excluded from current scope

#### Implementation Template
| Feature | Category | Justification | Dependencies |
|---------|----------|---------------|--------------|
| [Feature 1] | Must Have | [Business justification] | [Dependencies] |
| [Feature 2] | Should Have | [Value justification] | [Dependencies] |
| [Feature 3] | Could Have | [Enhancement value] | [Dependencies] |

#### Best Practices
- Limit "Must Have" to truly essential items (typically 60% or less)
- Regularly reassess categories as understanding evolves
- Use stakeholder workshops to align on categories

### 2. RICE Scoring Framework

#### Components
- **Reach**: How many users will be impacted?
- **Impact**: How much will this impact each user?
- **Confidence**: How confident are we in our estimates?
- **Effort**: How much work is required?

#### Calculation
**RICE Score = (Reach × Impact × Confidence) / Effort**

#### RICE Scoring Template
| Feature | Reach | Impact | Confidence | Effort | RICE Score | Priority |
|---------|-------|---------|------------|---------|------------|----------|
| [Feature 1] | 1000 | 3 | 80% | 5 | 480 | 1 |
| [Feature 2] | 500 | 2 | 90% | 2 | 450 | 2 |

#### Scoring Guidelines
**Impact Scale (1-3)**
- 3 = Massive impact
- 2 = High impact  
- 1 = Medium impact
- 0.5 = Low impact
- 0.25 = Minimal impact

**Confidence Scale (%)**
- 100% = Completely confident
- 80% = High confidence
- 50% = Medium confidence
- 20% = Low confidence

### 3. Value vs. Effort Matrix

#### Framework Structure
| High Value, Low Effort | High Value, High Effort |
|------------------------|-------------------------|
| **Quick Wins** (Do First) | **Major Projects** (Do Second) |
| [Feature list] | [Feature list] |

| Low Value, Low Effort | Low Value, High Effort |
|-----------------------|------------------------|
| **Fill-ins** (Do Third) | **Time Wasters** (Don't Do) |
| [Feature list] | [Feature list] |

#### Implementation Steps
1. Define value criteria (business impact, user satisfaction, strategic alignment)
2. Estimate effort (development time, complexity, resources)
3. Plot features on 2x2 matrix
4. Prioritize quick wins, plan major projects, consider fill-ins

### 4. Kano Model

#### Categories
- **Basic Needs**: Expected features that cause dissatisfaction if missing
- **Performance Needs**: Features that increase satisfaction linearly
- **Excitement Needs**: Unexpected features that delight users
- **Indifferent**: Features users don't care about
- **Reverse**: Features that actually decrease satisfaction

#### Kano Survey Template
**For each feature, ask:**
1. How do you feel if this feature is present?
2. How do you feel if this feature is absent?

**Response Options:**
- I like it
- I expect it
- I am neutral
- I can live with it
- I dislike it

#### Prioritization Strategy
1. **Must Do**: Basic needs (prevent dissatisfaction)
2. **Should Do**: Performance needs (increase satisfaction)
3. **Could Do**: Excitement needs (create delight)
4. **Won't Do**: Indifferent and reverse features

### 5. ICE Framework

#### Components
- **Impact**: How much will this move the needle?
- **Confidence**: How confident are we this will work?
- **Ease**: How easy is this to implement?

#### Scoring
Rate each component on a scale of 1-10, then calculate:
**ICE Score = (Impact + Confidence + Ease) / 3**

#### ICE Scoring Template
| Feature | Impact (1-10) | Confidence (1-10) | Ease (1-10) | ICE Score | Priority |
|---------|---------------|-------------------|-------------|-----------|----------|
| [Feature 1] | 8 | 7 | 6 | 7.0 | High |
| [Feature 2] | 6 | 9 | 8 | 7.7 | High |

### 6. Weighted Scoring Model

#### Setup Process
1. Define evaluation criteria
2. Assign weights to each criterion
3. Score each feature against criteria
4. Calculate weighted scores

#### Sample Criteria and Weights
| Criteria | Weight | Description |
|----------|--------|-------------|
| Revenue Impact | 25% | Potential revenue increase |
| Customer Satisfaction | 20% | Impact on user satisfaction |
| Strategic Alignment | 20% | Alignment with company strategy |
| Technical Feasibility | 15% | Ease of implementation |
| Market Differentiation | 10% | Competitive advantage |
| Resource Availability | 10% | Team capacity and skills |

#### Scoring Template
| Feature | Revenue (25%) | Satisfaction (20%) | Strategy (20%) | Technical (15%) | Market (10%) | Resources (10%) | Weighted Score |
|---------|---------------|-------------------|----------------|-----------------|--------------|-----------------|----------------|
| [Feature 1] | 8 × 0.25 = 2.0 | 7 × 0.20 = 1.4 | 9 × 0.20 = 1.8 | 6 × 0.15 = 0.9 | 8 × 0.10 = 0.8 | 7 × 0.10 = 0.7 | 7.6 |

## Implementation Guidelines

### Choosing the Right Framework

#### Use MoSCoW When:
- Working with fixed scope and timeline
- Need simple stakeholder communication
- Managing regulatory or compliance requirements

#### Use RICE When:
- Have quantitative data available
- Need to compare diverse features
- Want to include confidence levels

#### Use Value vs. Effort When:
- Need quick visual prioritization
- Want to identify quick wins
- Have limited prioritization time

#### Use Kano When:
- Focusing on customer satisfaction
- Want to understand feature types
- Planning user experience improvements

#### Use ICE When:
- Running experiments or tests
- Need quick prioritization
- Working in uncertain environments

#### Use Weighted Scoring When:
- Have multiple complex criteria
- Need detailed analysis
- Want to involve multiple stakeholders

### Multi-Framework Approach

#### Recommended Process
1. **Initial Filter**: Use MoSCoW to eliminate non-essential features
2. **Detailed Analysis**: Apply RICE or Weighted Scoring for remaining features
3. **Validation**: Use Kano model to understand customer impact
4. **Quick Decisions**: Use ICE for rapid prioritization of small items

### Stakeholder Involvement

#### Stakeholder Prioritization Workshop
1. **Preparation** (1 hour)
   - Share framework explanation
   - Prepare feature list and criteria
   - Set up scoring materials

2. **Workshop** (2-3 hours)
   - Explain prioritization criteria
   - Score features individually
   - Discuss discrepancies
   - Reach consensus on priorities

3. **Follow-up** (30 minutes)
   - Document final priorities
   - Communicate decisions
   - Plan implementation

## Common Prioritization Challenges

### Challenge 1: "Everything is High Priority"
**Solutions:**
- Force rank features (no ties allowed)
- Use limited budgeting exercise
- Apply strict MoSCoW percentages

### Challenge 2: Lack of Data
**Solutions:**
- Start with qualitative assessments
- Plan experiments to gather data
- Use proxy metrics and assumptions

### Challenge 3: Changing Priorities
**Solutions:**
- Schedule regular reprioritization
- Define criteria for priority changes
- Communicate impact of changes

### Challenge 4: Stakeholder Disagreement
**Solutions:**
- Use objective frameworks
- Facilitate structured discussions
- Escalate to decision makers when needed

## Prioritization Best Practices

### Regular Review Cycle
- **Weekly**: Review current sprint priorities
- **Bi-weekly**: Assess next sprint candidates
- **Monthly**: Evaluate quarterly roadmap
- **Quarterly**: Review strategic priorities

### Documentation Standards
- Record prioritization rationale
- Track priority changes over time
- Maintain stakeholder feedback
- Document framework decisions

### Communication Guidelines
- Share priorities transparently
- Explain prioritization criteria
- Provide regular updates
- Address stakeholder concerns

## Tools and Templates

### Prioritization Spreadsheet Template
[Link to downloadable spreadsheet with all frameworks]

### Workshop Facilitation Guide
[Link to step-by-step workshop guide]

### Stakeholder Communication Templates
[Link to email and presentation templates]

---

**Prepared by**: Product Management Team  
**Last Updated**: [Date]  
**Next Review**: [Date]

*Data-driven prioritization for maximum product value*

