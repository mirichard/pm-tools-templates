# Issue #1161: Scope, User Journey, and Acceptance Criteria

**Analysis Date:** 2026-09-29  
**Document Status:** Research phase — Proposed scope pending repo owner decisions  
**Note:** This document defines the proposed contract IF the candidate is greenlit; not all decisions finalized

---

## Part 1: End-to-End User Journey

### Scenario 1: Technology Project Manager (Traditional/Hybrid Delivery)

**Actor:** Sarah, Program Manager at a 50-person consulting firm  
**Project:** 4-month IT system upgrade (50 identified risks across 5 work streams)  
**Goal:** Prioritize risks for steering committee review; allocate response resources

#### Journey Steps

**1. Why Use This Resource?**
- Sarah knows basic risk ranking (Probability × Impact)
- Team scores risks differently depending on who assesses them
- Mitigations are planned but not reflected in scoring; hard to show risk reduction
- Multiple projects make consistent comparison difficult

**2. What to Prepare** (Information gathering)
- [ ] List of identified risks (from team workshop, lessons learned, risk register template)
- [ ] Probability assessment (1-5 scale; she'll use "almost certain" to "rare" language)
- [ ] Impact assessment (schedule, cost, scope, team morale; she'll translate to 1-5)
- [ ] Mitigation plans (from response planning session; what's being done to reduce probability/impact?)
- [ ] Timeline context (which phase is each risk most relevant?)
- [ ] Dependencies (which other tasks/teams affected if risk occurs?)

**Where to get it:** Existing project team, governance docs, previous project registers, lessons learned

**3. What Sarah Provides** (Inputs to scoring engine)

For each risk:
- Risk description (narrative)
- Category (Technical, Schedule, Cost, Resource, External, Organizational, Scope, Change Mgmt)
- Probability (1-5: Rare, Unlikely, Possible, Likely, Almost Certain)
- Impact (1-5: Negligible, Minor, Moderate, Major, Catastrophic)
- Mitigation effectiveness (0-100%: e.g., "Cross-training reduces departure impact to 40%")
- Timeline sensitivity (1.0-1.5: e.g., 1.2 = "This risk is early in project; some buffer exists")
- Dependency count (1.0-1.5: e.g., 1.3 = "Affects 3-4 downstream tasks")
- Assigned owner (name, role)
- Escalation threshold (High, Medium, or other)

**Format:** Spreadsheet with one row per risk + column guidance

**4. What the Engine Does**

```
Risk Score = (Probability × Impact) × Mitigation Factor × Time Factor × Dependency Factor

Example Risk: "Senior architect leaves during design phase"
- Probability: 3 (Possible; 30-50% chance)
- Impact: 5 (Catastrophic; major rework, timeline delay)
- Mitigation: "Cross-training plan + documentation" = 60% effective → Factor 0.7
- Timeline: 1.1 (early in project; some buffer)
- Dependency: 1.4 (affects all downstream modules)

Score = (3 × 5) × 0.7 × 1.1 × 1.4 = 15 × 0.7 × 1.1 × 1.4 = 16.17

Threshold interpretation:
- 0-6 = Low (monitor)
- 6-12 = Medium (active response)
- 12-20 = High (escalate, executive attention)
- 20+ = Critical (emergency response)

Score 16.17 → HIGH priority
```

**5. What Outputs Mean**

Sarah receives:
- **Risk Score (0-100 scale):** Normalized priority across all projects
- **Score breakdown:** Shows which factors drove the score (e.g., high impact × high dependency = high score)
- **Mitigation benefit:** How much the score drops if mitigation executes (e.g., "With mitigation, score drops to 8")
- **Comparison:** "This risk ranks #3 of 50 on this project; #7 across all firm projects"
- **Change history:** "Score updated 2026-09-28 when mitigation plan approval confirmed"

**6. Investigation & Decision**

Sarah uses the score to:
- **Prioritize steering committee agenda** (HIGH risks discussed first)
- **Allocate response resources** (assign owners to top 5-10 risks)
- **Justify decisions** (shows scoring logic, not just gut feel)
- **Track progress** ("After 2-month mitigation, this dropped from 18 to 8")

**7. Follow-up & Reassessment**

- **Weekly risk review:** Are any new risks emerging? Did scores change?
- **Monthly steering check:** Compare highest risks; confirm escalations, resource allocation
- **Baseline checkpoint (monthly):** Full re-score of all risks as project progresses, team changes, tech decisions solidify
- **Lessons learned (post-project):** Which risks occurred? Was scoring accurate? Calibrate for next project

---

### Scenario 2: Construction Project Manager (Non-Technology)

**Actor:** Mike, Project Manager for $10M commercial construction project  
**Project:** 18-month mixed-use building development (40 risks across site, trades, permits, funding)  
**Goal:** Identify top 5-8 risks for owner briefing; allocate contingency budget

#### Journey Steps

**1. Why Use This?**
- Multiple trade contractors; each assesses risk differently
- Weather, permit delays, funding changes happen mid-project
- Need to explain to owner why contingency is 15% not 5%

**2. What Mike Prepares**
- Identified risks (from design, permits, contractor feedback, lessons learned from similar projects)
- Probability (weather risk, permit delays, contractor availability, supplier issues)
- Impact (schedule slippage in days, budget impact %, work quality rework)
- Mitigation (weather protections, permit expeditors, supplier contracts)
- Timeline (which project phase most affected?)
- Dependencies (which other trades/permits affected?)

**Where to get it:** Pre-construction meetings, trade quotes, municipal contacts, previous project history

**3. Inputs Mike Provides**

Same structure as Sarah (Scenario 1), but context is construction:

- Risk: "Heavy rain delays foundation pour by 2-3 weeks"
- Probability: 4 (Likely; 70% chance in this season)
- Impact: 4 (Major; cascades through framing, interior, finish)
- Mitigation: "Roof protection + accelerated drying" = 50% effective (reduces impact, not probability)
- Timeline: 1.3 (foundation phase is critical path; any delay compresses downstream)
- Dependency: 1.5 (affects all interior trades, owner occupancy date)

**4. What Engine Does**

```
Score = (4 × 4) × 0.75 × 1.3 × 1.5 = 58.5 → HIGH priority
```

(Using alternative mitigation factor model: 0-100% effectiveness → 1.0 - (effectiveness × 0.5) = factor)

**5. Outputs for Mike**

- Score comparison: "This rates #2 of 40 risks on this project"
- Budget impact: "Allocate $150K contingency for this risk (vs. $50K if mitigation executes perfectly)"
- Timeline impact: "If this occurs, add 3 weeks to critical path"
- Mitigation tracking: "Roof protection system on order; arriving week of Oct 15"

**6. Use for Owner Briefing**

Mike presents:
- Top 5 risks (by score) + scores
- Why they're rated HIGH (transparent formula, not black box)
- Mitigation plan for each (what's being done?)
- Owner decision (accept risk? Allocate contingency? Adjust timeline?)

**7. Ongoing Management**

- Monthly risk review: Update scores as project progresses, weather patterns emerge
- Post-storm reassessment: If heavy rain occurs, update similar future risks based on actual outcome
- Lessons learned: "Our weather mitigation worked better than expected; adjust for next project"

---

## Part 2: Input Dictionary

### Core Fields (Required for All Risks)

| Field | Purpose | Type | Required | Scale/Units | Example | Missing/Invalid Handling |
|-------|---------|------|----------|-------------|---------|------------------------|
| **Risk ID** | Unique identifier | Text | Required | Alphanumeric code | RISK-T-001 | Reject if missing; auto-generate if format inconsistent |
| **Risk Description** | What could go wrong? | Text | Required | 1-3 sentences | "Senior architect leaves during design phase" | Reject if >500 chars or obviously vague ("something bad") |
| **Category** | Risk type for grouping | Dropdown | Required | 8 types: Technical, Schedule, Cost, Resource, External, Organizational, Change Mgmt, Scope | "Resource" | Reject if not in list; offer suggestions |
| **Probability** | Likelihood of occurrence | Integer | Required | 1-5 scale | 3 (Possible) | Reject if outside 1-5; offer scale guide ("What % chance?") |
| **Impact** | Consequence if it occurs | Integer | Required | 1-5 scale | 5 (Catastrophic) | Reject if outside 1-5; context-specific guidance by domain |

### Response Planning Fields (Required If Score ≥ Threshold)

| Field | Purpose | Type | Required | Units | Example | Missing/Invalid Handling |
|-------|---------|------|----------|-------|---------|------------------------|
| **Mitigation Effectiveness** | What % of risk is reduced by planned mitigation? | Percentage | Conditional (if response strategy is "Mitigate") | 0-100% | 60% | If missing and Mitigate selected, prompt user; default to 0% (no mitigation) |
| **Response Strategy** | How will we handle this risk? | Dropdown | Required | Avoid / Mitigate / Transfer / Accept / Contingent / Escalate | "Mitigate" | Reject if not in list |
| **Response Owner** | Who is accountable? | Text | Required | Name or role | "Jane Doe (Engineering Lead)" | Reject if empty; cross-reference to team roster if available |

### Context Factors (Optional, but Improve Score)

| Field | Purpose | Type | Required | Scale | Example | Missing/Invalid Handling |
|-------|---------|------|----------|-------|---------|------------------------|
| **Time Sensitivity** | Is this risk concentrated early or late? | Decimal | Optional | 0.8-1.5 (0.8=late buffer exists, 1.5=immediate) | 1.2 (early in project) | If missing, default to 1.0 (neutral); document default in scoring |
| **Dependency Count** | How many other tasks affected? | Decimal | Optional | 1.0-1.5 (1.0=isolated, 1.5=affects many downstream) | 1.3 (affects 3-4 tasks) | If missing, default to 1.0; prompt if >1 downstream tasks identified |
| **Assessment Date** | When was this scored? | Date | Required | YYYY-MM-DD | 2026-09-28 | Reject if future date or >30 days old (stale assessment) |
| **Evidence/Rationale** | Why did you score it this way? | Text | Optional | Free-form notes | "Similar project had 2 departures; 1 affected schedule 2 weeks" | If missing, warn user ("Scoring without evidence?"); store for audit trail |

### Administrative Fields

| Field | Purpose | Type | Required | Format | Example | Handling |
|-------|---------|------|----------|--------|---------|----------|
| **Project Name** | Which project? | Text | Required | Project ID or name | "Q1-2027-ERP-Upgrade" | Match to active project list if available |
| **Risk Status** | Current state | Dropdown | Required | Identified / Assessed / Planned / Active / Closed / Occurred | "Active" | Update based on response actions and milestones |
| **Escalation Threshold** | At what score does this need executive attention? | Dropdown | Optional | Low / Medium / High | "High" | Default to "High"; allow project/org override |
| **Last Updated By** | Who last changed this entry? | Text | Auto-populated | User email/name | analyst@company.com | System-populated; audit trail maintained |

---

## Part 3: Proposed Assessment Contract

**⚠️ CAVEAT:** This formula section is a research proposal. The formula and thresholds have NOT been validated against real data or user testing. Before implementation, formula defensibility must be established through one of these methods:
1. Verify against published research (if Geamanu et al. paper is located)
2. Conduct expert review and document rationale for each component
3. Validate through user testing with sample risks

Current formula contains contradictions (examples don't match stated ranges; see evidence.md). These must be resolved before implementation.

### Scoring Formula

```
Risk Score = (Probability × Impact) × M_factor × T_factor × D_factor

Where:
  Probability: 1-5 scale (Rare, Unlikely, Possible, Likely, Almost Certain)
  Impact: 1-5 scale (Negligible, Minor, Moderate, Major, Catastrophic)
  M_factor: Mitigation effectiveness modifier (0.5-1.0 range)
  T_factor: Time sensitivity modifier (0.8-1.2 range)
  D_factor: Dependency modifier (1.0-1.5 range)

Score range: 0-100 (normalized from 0-30 raw, scaled to 0-100 for readability)
```

### Mitigation Factor Calculation

**RESOLVED DECISION NEEDED:** Current spike contradicts ranges; propose:

```
M_factor = 1.0 - (Mitigation_Effectiveness_Percent / 100) × 0.5

Example:
  - 0% effective → 1.0 (no reduction)
  - 50% effective → 0.75 (25% reduction in score)
  - 100% effective → 0.5 (50% reduction in score)

This maps 0-100% effectiveness to 0.5-1.0 factor range (as stated in spike).
```

**Result:** Risk score reflects both base (P×I) and mitigation benefit (M_factor)

### Time Sensitivity Factor

```
T_factor interpretation:
  - 0.8-0.9: Risk occurs late in project; buffer exists to respond
  - 1.0: Neutral; risk applies throughout
  - 1.1-1.2: Risk occurs early or on critical path; less reaction time

Assignment guidance:
  - Early project phase (0-30% duration) & on critical path → 1.2
  - Early phase but some buffer → 1.1
  - Mid-project → 1.0
  - Late project; time to react exists → 0.8-0.9
```

### Dependency Factor

```
D_factor interpretation:
  - 1.0: Risk isolated; affects only one work stream or task
  - 1.1-1.2: Risk affects 2-3 downstream tasks or teams
  - 1.3-1.4: Risk affects 4-6 downstream tasks; multiple teams impacted
  - 1.5: Risk is on critical path; cascades to many downstream; affects project completion

Assignment guidance:
  Count how many other identified tasks/risks become harder if this occurs.
  
  Example:
    - Resource departure: How many tasks lose their assigned person? →D_factor
    - Technical integration failure: How many modules depend on it? → D_factor
    - Permit delay: How many trade phases pause? → D_factor
```

### Threshold Classification

```
Score 0-6:     LOW
  Interpretation: Manageable; accept or passive monitoring
  Action: Document in register; review monthly
  Escalation: No

Score 6-12:    MEDIUM
  Interpretation: Active management required; mitigation plan in place
  Action: Track bi-weekly; update as mitigation progresses
  Escalation: To project manager for approval; no escalation to steering

Score 12-20:   HIGH
  Interpretation: Significant; requires executive attention
  Action: Weekly review; escalate any status changes
  Escalation: To steering committee; confirm response owner assigned

Score 20+:     CRITICAL
  Interpretation: Emergency; immediate response required
  Action: Daily review if active; escalate to senior leadership
  Escalation: Executive escalation pathway; possible project re-baselining

Boundaries are inclusive on lower end: Score 6.0 ∈ [6, 12] (MEDIUM).
```

### Missing Data Handling

| Scenario | Handling | User Feedback |
|----------|----------|---------------|
| Probability not provided | **REJECT** — Cannot score without likelihood | "Probability is required. Use 1-5 scale: 1=Rare, 5=Almost Certain" |
| Impact not provided | **REJECT** — Cannot score without consequence | "Impact is required. Assess effect on schedule, cost, scope, or quality." |
| Mitigation effectiveness not provided | **DEFAULT to 0%** (M_factor = 1.0) | "Mitigation effect not specified; scoring assumes no mitigation benefit. Update if response plan will reduce probability/impact." |
| Time sensitivity not provided | **DEFAULT to 1.0** (neutral) | "Time sensitivity not specified; scoring assumes even exposure throughout project. Adjust if risk is early/late or on critical path." |
| Dependency factor not provided | **DEFAULT to 1.0** (isolated risk) | "Dependency not specified; scoring assumes isolated risk. Adjust if this affects other tasks." |
| Assessment date is missing | **REJECT** — Cannot track recency | "Assessment date is required to verify currency. When was this scored?" |
| Assessment date is >30 days old | **WARN, ALLOW CONTINUE** | "This risk was last assessed XX days ago. Update probability/impact if project conditions changed?" |
| Risk status is "Occurred" | **CLOSE RISK** — Remove from active scoring | "Risk has occurred and is now an issue. Transition to issue register; retain for lessons learned." |

### Inherent vs. Residual Risk

**Inherent Risk:** Score WITHOUT mitigation (M_factor = 1.0)
```
Inherent = (Probability × Impact) × 1.0 × T_factor × D_factor
```

**Residual Risk:** Score WITH mitigation (actual M_factor)
```
Residual = (Probability × Impact) × M_factor × T_factor × D_factor
```

**Tracking:**
- Always record both; show as "Score: 16.2 (inherent: 22.1; mitigation benefit: 5.9)"
- Allows PM to see: "This risk is HIGH now, but would be CRITICAL without our mitigation plan"
- Supports decision: "Is our mitigation worth the cost? We're saving 5.9 points of risk."

### Human Overrides and Documentation

**Scenario:** PM disagrees with engine score; wants to override.

**Process:**
1. Engine calculates score (e.g., 8.3 = MEDIUM)
2. PM enters override (e.g., score 15 = HIGH)
3. System requires **override rationale** (free text): "Historical project had this risk; actual impact was Major despite moderate probability; treating as learned from past"
4. Original score retained in audit trail; override marked with reason and date
5. Reports show: "Scored 8.3 (system); OVERRIDE to 15 (reason: historical precedent); Owner: [PM name], [date]"

**Usage guidelines:**
- Overrides allowed but tracked
- No auto-correction; PMs decide if override is appropriate
- Audit trail enables learning: "Did the override improve decision-making?"

---

## Part 4: Draft Implementation Stories

**⚠️ STATUS NOTE:** These stories assume the formula and thresholds will be verified/finalized before implementation. Stories are provided as placeholders for planning purposes only. Acceptance criteria may change significantly after formula validation and user testing.

### Story 1: Risk Assessment Template Enhancement

**Title:** Update Risk Management Plan template with modifier guidance

**User Story:**  
As a Project Manager, I want to understand when and how to consider mitigation effectiveness, timeline urgency, and dependencies so that my risk scores reflect real-world factors beyond just probability and impact.

**Acceptance Criteria:**
- [ ] risk_management_plan_template.md includes new "Advanced Scoring" section
- [ ] Section explains: Mitigation effectiveness (0-100%), Time sensitivity (0.8-1.5), Dependency count (1.0-1.5)
- [ ] Provides formula: Score = (P × I) × M × T × D with worked examples from 2 different project domains
- [ ] Example 1: Technology project risk (e.g., "Key developer departure")
- [ ] Example 2: Non-technology risk (e.g., "Weather delay, permit delay, vendor failure")
- [ ] Both examples show: Base score (P×I), Mitigation adjustment, Final score
- [ ] Threshold table updated (0-6 Low, 6-12 Medium, 12-20 High, 20+ Critical) with justification
- [ ] Includes note: "Formula validates research direction; for deterministic engine implementation, use scoring tool"
- [ ] Documentation reviewed by at least one PM for clarity; feedback incorporated

**Definition of Done:**
- Template updated and linked in TEMPLATE_INDEX.md
- No broken markdown links
- Compatibility with existing risk_register_template.md confirmed
- Story added to appropriate project/milestone

**Tests:**
- [ ] Template renders without errors (markdown validation)
- [ ] Examples calculate correctly (math spot-checked)
- [ ] Template imported into spreadsheet tool; scores match formula (accuracy test)

**Effort Estimate:** 2-3 days (research, writing, review)  
**Owner Role:** Product/Technical Writer  
**Dependencies:** None (can proceed immediately)

---

### Story 2: Risk Register Spreadsheet with Scoring Engine

**Title:** Create risk register spreadsheet template with integrated scoring formulas

**User Story:**  
As a Program Manager, I want a risk register spreadsheet that calculates risk scores automatically using the P×I×M×T×D formula so that I can quickly assess risks consistently and share scored registers with stakeholders.

**Acceptance Criteria:**
- [ ] Excel/Google Sheets template created with columns:
  - Risk ID, Description, Category, Probability (1-5), Impact (1-5)
  - Mitigation Effectiveness (%), Time Sensitivity (0.8-1.5), Dependency Count (1.0-1.5)
  - Assessment Date, Owner, Status, Response Strategy
- [ ] Formula row calculates: (P × I) × M × T × D for each risk
- [ ] Normalized score (0-100) calculated; categorical classification (Low/Medium/High/Critical)
- [ ] Data validation: P and I inputs constrained to 1-5; Mitigation to 0-100%; T to 0.8-1.5; D to 1.0-1.5
- [ ] Error handling: Missing required fields show warning; stale assessments flagged
- [ ] Included: 2 worked examples (technology + construction project contexts)
- [ ] Summary sheet: Ranked list of all risks by score; pivot by category and status
- [ ] Dashboard: Visual summary (e.g., count by threshold: Low/Medium/High/Critical)
- [ ] Instructions: 1-page guide explaining formula, fields, interpretation
- [ ] Tested in Excel and Google Sheets; formulas work correctly in both

**Definition of Done:**
- Spreadsheet template published in templates/universal/ or appropriate location
- Markdown guide (risk-register-scorecard.md) created with instructions
- Template included in TEMPLATE_INDEX.md
- Linked from risk_management_plan_template.md

**Tests:**
- [ ] Load template; enter sample data; verify formulas calculate correctly
- [ ] Test boundary cases: Prob=1, Impact=1 → Score ~1; Prob=5, Impact=5, all modifiers max → Score ~90
- [ ] Test data validation: Try to enter Prob=6; should reject; try Impact="High"; should reject
- [ ] Test in Excel 2019+, Excel 365, Google Sheets; formulas work in all three
- [ ] Rows 0-100 of risks can be added; performance acceptable (<1 second recalculation)

**Effort Estimate:** 3-5 days (template design, formula testing, documentation, UAT)  
**Owner Role:** Program Manager / PM Tool Specialist  
**Dependencies:** Story 1 (template guidance) should be complete first

---

### Story 3: Risk Scoring Guidance and Calibration Document

**Title:** Develop guidance for calibrating probability, impact, and modifier scores to organizational context

**User Story:**  
As a Project Governance Lead, I want clear guidance for my teams on how to rate probability and impact consistently (e.g., "What does 'Major' impact mean for our organization?") and how to assess mitigation effectiveness so that all projects score risks the same way.

**Acceptance Criteria:**
- [ ] Document created: "Risk Scoring Calibration Guide" (10-15 pages)
- [ ] Defines Probability scale (1-5) with % ranges and real-world examples
  - 1 (Rare): <10% chance; provide 2-3 examples (e.g., "asteroid strike")
  - 2 (Unlikely): 10-30%; examples
  - 3 (Possible): 30-70%; examples
  - 4 (Likely): 70-90%; examples
  - 5 (Almost Certain): >90%; examples
- [ ] Defines Impact scale (1-5) WITH CONTEXT by project type and domain
  - Technology projects: Schedule impact (days), Cost impact (%), Quality impact (features lost), Team impact (morale)
  - Construction projects: Schedule impact (days), Cost impact ($), Quality impact (rework %), Safety impact (incidents)
  - Healthcare/Regulatory projects: Compliance impact, Audit findings, Patient impact
  - Similar breakdowns for 3-4 other domains
- [ ] Mitigation effectiveness guidance:
  - "How do we estimate if our mitigation will be 60% effective vs. 80%?"
  - Clarifies: Effectiveness = (Base consequence - Residual consequence) / Base consequence × 100%
  - Examples: "Cross-training + documentation might reduce team departure impact from 2-month delay to 1 month = 50% effective"
- [ ] Time Sensitivity guidance: When to use 0.8 vs. 1.0 vs. 1.2
- [ ] Dependency guidance: How to count downstream tasks/teams
- [ ] Organizational context section:
  - "For [Organization Name], HIGH risk should be escalated to Steering Committee"
  - "Thresholds can be adjusted; default is 12-20 for HIGH; we're using 10-18 due to higher risk appetite"
- [ ] Appendix: 3-5 worked examples showing how to score a risk from description through final score
- [ ] Field-tested with PM team; feedback incorporated

**Definition of Done:**
- Document published (location: docs/risk-management/ or similar)
- Linked from risk_management_plan_template.md and scoring spreadsheet guide
- Training materials reference this guide; no internal contradictions with other docs

**Tests:**
- [ ] Review by: PM team (clarity), Governance lead (completeness), Finance (cost calibration)
- [ ] Field test: Have 3-4 PMs from different domains score same 5 risks independently, then with guide; scores converge (within ±1 point)

**Effort Estimate:** 3-5 days (writing, domain research, examples, field testing)  
**Owner Role:** Governance/PMO Lead  
**Dependencies:** Story 1 and 2 should be complete for reference

---

### Story 4: Risk Score Validation and Audit Trail

**Title:** Document mechanism for tracking risk score changes, overrides, and audit trail

**User Story:**  
As an Audit Lead, I want to track how risk scores change over time and be able to explain why a specific risk received a particular score so that I can validate risk management process integrity and learn from scoring decisions.

**Acceptance Criteria:**
- [ ] Risk History Log in risk_register_template.md enhanced to include:
  - Date, Risk ID, Change (scoring inputs changed, mitigation effectiveness updated, override applied)
  - Previous Score, New Score, Reason for Change
  - Changed By (PM name), Approval (if override)
- [ ] Spreadsheet template includes "Score History" sheet tracking:
  - Assessment_Date, Risk_ID, Probability, Impact, Mitigation_%, Time_Sensitivity, Dependency_Factor
  - Calculated_Score, Status, Owner_Name, Override_Applied, Override_Reason, Approved_By
- [ ] Reports available:
  - "Risk Score Trend" (how did top 10 risks change over project lifecycle?)
  - "Mitigation Effectiveness" (which risks actually benefited from planned mitigation?)
  - "Override Log" (which scores were manually changed? Why?)
- [ ] Guidance: "When to override engine scores; how to document rationale"
- [ ] Example: Filled-in history log showing realistic changes over 6-month project

**Definition of Done:**
- Updated templates published (risk_register_template.md, spreadsheet with history sheet)
- Reports documented with examples
- Linked from governance/audit documentation

**Tests:**
- [ ] Create sample project with 10 risks; score them monthly for 3 months; verify history tracking captures all changes
- [ ] Apply 2-3 overrides; verify rationale stored and retrievable
- [ ] Generate "Trend Report"; verify accuracy (calculations correct, dates in order)

**Effort Estimate:** 2-3 days (template enhancement, report design, examples)  
**Owner Role:** PM / Governance  
**Dependencies:** Stories 1-3 should be in place

---

## Part 5: Proposed Delivery Structure

### Option A: Template Enhancement Only (Recommended for Sprint 3 MVP)

**Deliverables:**
1. Enhanced risk_management_plan_template.md (modifiers, formula, thresholds)
2. Risk Scoring Calibration Guide (guidance doc)
3. risk-register-scorecard.xlsx (spreadsheet template with formulas)
4. Risk Score Validation guide (history/audit trail)

**Delivery Format:**
- Markdown documentation in docs/risk-management/
- Spreadsheet template in templates/universal/
- Updated TEMPLATE_INDEX.md with new resources
- Updated links in existing templates

**Effort:** 8-12 FTE-days (Stories 1-4, all documentation)

**Timeline:** Feasible within 2-week sprint if no blockers

**User Value:**
- Immediate: Consistent scoring methodology available
- Usable in Excel/Sheets; no new tools to learn
- Reduces scoring inconsistency across teams
- Tracks mitigation benefit in scoring

---

### Option B: Template + CLI Tool (Requires Scope Expansion)

**Adds to Option A:**
5. Command-line risk scoring tool (CLI)
   - Input: CSV risk data
   - Process: Apply formula, validate inputs, generate scores
   - Output: HTML report, scored CSV, summary statistics

**Delivery Format:**
- Node.js CLI tool in tools/risk-scoring-cli/
- pip Python package alternative
- npm publish for accessibility

**Effort:** 20-30 FTE-days (Option A + tool development)

**Timeline:** 4-5 week sprint required

**Not recommended for Sprint 3** — adds 2-3 weeks; template+spreadsheet MVP provides 80% value

---

### Option C: Template + Web Dashboard (Requires Significant Scope)

**Adds to Option B:**
6. Web interface for risk entry, scoring, visualization
   - Dashboard: Risk trends, top risks, category breakdown
   - Charts: Score distribution, timeline view

**Effort:** 40-60 FTE-days (not feasible for Sprint 3)

**Timeline:** 8-10 week sprint required

**Not recommended** — defer to Phase 2

---

## Part 6: Evaluation and Acceptance Plan

### Three Evaluation Dimensions

#### 1. Calculation Correctness

**Question:** Does the engine execute its formula correctly?

**Test Method:**
- Create 10 test cases with known (P, I, M, T, D) values
- Calculate expected score by hand
- Run through spreadsheet/CLI
- Verify match (within 0.01 rounding tolerance)

**Test Cases Must Include:**
- [ ] Boundary: P=1, I=1, all modifiers min → score ~1
- [ ] Boundary: P=5, I=5, all modifiers max → score ~90
- [ ] Neutral: P=3, I=3, M=1.0, T=1.0, D=1.0 → score ~9
- [ ] With mitigation: (4×4)×0.7×1.0×1.0 = 11.2 (MEDIUM)
- [ ] Mitigation benefit: Same risk without mitigation = 16 (HIGH) → with = 11.2 (MEDIUM)
- [ ] Override: Calculated score 8, PM overrides to 12; rationale logged

**Pass Criteria:**
- All 10 test cases match expected results
- Formula documented in code/template; human-readable
- Edge cases (zero probability, missing modifiers) handled per specification

**Owner:** Developer/QA  
**Effort:** 1-2 days

---

#### 2. User Usefulness

**Question:** Can a PM understand the scoring logic and make better-supported decisions?

**Test Method:**
- Select 2-3 PMs from different project types (tech, construction, other)
- Ask them to score 5 pre-written risks using the template
- Have them explain: "Why did you rate this probability/impact this way? What score did you expect?"
- Compare their scores before and after training on the formula
- Collect feedback: "Did this help you prioritize? What was confusing?"

**Success Criteria:**
- [ ] PMs can explain scoring logic (formula + modifiers) in their own words
- [ ] PMs rate same risk consistently (within ±1 point) after training
- [ ] PMs report >80% confidence in their scores ("I can defend this to my steering committee")
- [ ] Feedback: ≥3 "very useful" ratings on a 5-point scale
- [ ] No one rates it ≤2 (poor/confusing)

**Owner:** PM team / User acceptance  
**Effort:** 2-3 days (training, scoring session, debrief)

---

#### 3. Real-World Outcome (Post-Implementation)

**Question:** Does use of this system lead to better risk decisions or project outcomes?

**Measurement Plan (Deferred to Phase 2; Not Sprint 3 Gate):**

**Metrics to Track:**
- Consistency: Variation in risk scores across PMs for same risk (target: <±2 points after training)
- Adoption: % of projects using template within 3 months (target: >60%)
- Mitigation effectiveness: Did planned mitigations actually reduce risk as expected? (track over 2-3 projects)
- Decision quality: Risks scored HIGH/CRITICAL — did they actually require the response resources allocated? (retrospective validation)
- User satisfaction: "Would you use this again?" (target: >70% "yes")

**Success Criteria (Post-Delivery, Month 3):**
- Variation in scoring reduced by 30% (before vs. after template use)
- No cases of "we didn't see this risk coming" for risks scored HIGH/CRITICAL
- User satisfaction >70%

**Owner:** PMO / Governance  
**Effort:** Minimal during Sprint 3 (planning); 1-2 hours/month during months 2-3 for data collection

---

## Part 7: Dependencies and Effort Drivers

### Critical Dependencies (Blockers if Not Met)

| Dependency | Status | Owner | Timeline | Contingency |
|---|---|---|---|---|
| Formula finalization (P×I×M×T×D) | PENDING | Repo Owner | 3-5 days | If unresolved: use simplified P×I×T without M and D factors |
| MVP scope decision (template only vs. template+engine) | PENDING | Repo Owner | 1-2 days | If unresolved: default to Option A (template+spreadsheet) |
| Risk Management Plan template access | MET | Exists | N/A | Already in repo; use as foundation |
| Calibration guidance approval | PENDING | Repo Owner/PMO | 2-3 days | If unresolved: use generic guidance; customize later |

### Implementation Effort Drivers

| Factor | Impact | Adjustment |
|--------|--------|-----------|
| Number of domain examples in guidance | 1-3 domains = +2 days; 4-6 domains = +5 days | Recommend 2-3 domains for Sprint 3 MVP |
| Spreadsheet tool targets | Excel only = 1 day; Excel + Google Sheets = +2 days | Recommend Excel + Sheets (widely used) |
| Field testing/UAT | Light (1 PM, 1 project) = 1 day; Comprehensive (4 PMs, 4 projects) = 5 days | Recommend light testing for MVP |
| Governance/audit trail depth | Simple history log = 1 day; Full dashboard + reports = 5 days | Recommend simple log for Sprint 3 |
| Internationalization | English only = 0 days; 2+ languages = +3 days | Recommend English MVP; localize later |

---

## Part 8: Risks to Delivery

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Repo owner unable to decide on blockers (paper, formula, scope) | Medium (30%) | High | Set decision deadline by 2026-10-01; escalate if needed |
| Spreadsheet formula complexity causes errors | Low (10%) | Medium | Thorough testing with multiple accountants/analysts; peer review |
| PM team resists new scoring method as "too complex" | Medium (30%) | Medium | Plan training session; show time savings after 2-3 projects |
| Stakeholder disagrees with thresholds (HIGH at 12 vs. our preferred 10) | Medium (40%) | Low | Make thresholds configurable in guidance; allow organizational override |
| Geamanu paper licensing prevents use of 27-variable taxonomy | Medium (30%) | High | Use custom taxonomy from existing templates; risk mitigated |

---

## Summary

**This proposed scope is feasible for Sprint 3 IF:**
1. Blockers are resolved by repo owner within 3-5 days
2. Resource (3-5 FTE-weeks for Option A) is available
3. Scope is bounded to template+spreadsheet (Option A), not CLI/web (Options B-C)

**Value delivered:**
- Consistent risk scoring methodology available for all projects
- Transparent, auditable, repeatable scoring (deterministic without ML)
- Framework for continuous improvement (history/feedback tracking)
- Foundation for future tool/engine enhancements

**Next step:** Repo owner reviews and decides on blockers; analysis completes if greenlit.
