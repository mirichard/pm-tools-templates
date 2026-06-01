# Task #808: Decision Tree Research

**Story:** #728 ([Selection] – Decision Tree Guide)
**Epic:** #709 (Epic 2: Template Decision Engine)
**Date:** 2026-05-31
**Status:** Complete
**Closes:** #808

---

## Objective

Analyze the rules engine output (from [806-rules-engine-implementation.md](806-rules-engine-implementation.md) and [807-rules-engine-validation.md](807-rules-engine-validation.md)) to identify the optimal question sequence for a guided decision tree that converges on template recommendations within 5–7 questions.

---

## Research Findings

### Question Ordering Analysis

The rules engine processes 7 dimensions. The decision tree must reduce this to 5–7 user-facing questions. Analysis of rule impact and information gain shows:

| Dimension | Rules | Filtering Power | Information Gain | Recommended Position |
|-----------|-------|-----------------|-----------------|---------------------|
| Methodology | R001–R003 | Eliminates ~70% of templates | Highest | Q1 (must be first) |
| Project Phase | R004–R007 | Narrows to ~15-35 of remaining | High | Q2 |
| Risk Profile | R008–R011 | Adds 0–13 supplements | High (for compliance) | Q3 |
| Team Size | R020–R022 | Selects toolkit recommendation | Medium | Q4 |
| Industry | R012–R015 | Adds 0–6 supplements | Medium (domain-specific) | Q5 |
| PM Experience | R023–R025 | Filters complexity | Low (refinement only) | Q6 |
| Project Size | R016–R019 | Sets governance level | Low (overlaps team size) | Merged with Q4 |

**Key insight:** Project Size (R016–R019) and Team Size (R020–R022) are strongly correlated. In the validation profiles, every "enterprise" project had a "large" team, and every "small" project had a "small" team. Merging these into a single "Project Scale" question reduces the tree from 7 to 6 questions without losing discrimination.

### Proposed Question Sequence (6 Questions)

#### Q1: What methodology does your project follow?
- **Options:**
  1. **Traditional/Waterfall** — Sequential phases, formal gates, comprehensive upfront planning
  2. **Agile/Scrum** — Iterative sprints, continuous delivery, adaptive planning
  3. **Hybrid** — Mix of traditional planning with agile execution
  4. **Not sure** — Need help choosing → routes to [Methodology Selection Guide](../../quick-start-kits/methodology-selection-guide.md)
- **Rules activated:** R001, R002, or R003
- **Branching:** "Not sure" exits to methodology guide; all others continue to Q2
- **Why first:** Methodology is the strongest filter — it determines the primary template pool

#### Q2: What phase is your project in?
- **Options:**
  1. **Just starting** — Project initiation, chartering, business case
  2. **Planning** — Defining scope, schedule, budget, resources
  3. **In progress** — Executing and delivering work
  4. **Closing** — Wrapping up, handover, lessons learned
- **Rules activated:** R004, R005, R006, or R007
- **Why second:** Phase determines which lifecycle templates are immediately needed — the most time-sensitive dimension

#### Q3: What is your project's risk profile?
- **Options:**
  1. **Low** — Minimal risk, no regulatory requirements
  2. **Medium** — Some unknowns, moderate complexity
  3. **High** — Significant risk, mission-critical, multiple dependencies
  4. **Regulatory** — Compliance requirements (FDA, SOX, HIPAA, GDPR, etc.)
- **Rules activated:** R008–R011; "Regulatory" also triggers compliance supplements via R010
- **Why third:** Risk profile has the highest supplement impact — it can add 5–13 additional templates

#### Q4: What is your project scale?
- **Options:**
  1. **Small** — Solo or small team (1–9), under 3 months
  2. **Medium** — Mid-size team (10–50), 3–12 months
  3. **Large** — Large team (50+), 1–2 years, multiple workstreams
- **Rules activated:** R016/R020 (small), R017/R021 (medium), R018-R019/R022 (large)
- **Why merged:** This combines Team Size + Project Size into one question. Validation showed these dimensions are strongly correlated. The combined question is more intuitive for users.
- **Note:** "Enterprise" (R019) is included in "Large" — the engine will detect enterprise-level projects through the combination of Large scale + Regulatory risk or specific industry

#### Q5: What industry is your project in?
- **Options:**
  1. **General / Other** — No industry-specific requirements
  2. **IT / Software** — Technology, software development, digital transformation
  3. **Healthcare / Pharmaceutical** — Clinical, regulatory, GxP requirements
  4. **Financial Services** — Banking, insurance, compliance-heavy
- **Rules activated:** R012–R015
- **Why fifth:** Industry adds supplements but doesn't change the core recommendation — it can come later in the flow

#### Q6: What is your PM experience level?
- **Options:**
  1. **New to PM** — First project or limited experience
  2. **Intermediate** — Several projects completed
  3. **Advanced** — Senior PM, certified, extensive experience
- **Rules activated:** R023–R025
- **Why last:** Experience is a refinement filter — it adjusts template complexity but doesn't change which templates are recommended. Also, asking this last avoids making users feel judged early in the flow.

### Branching Logic Summary

```
Q1 (Methodology)
├── "Not sure" → EXIT: Methodology Selection Guide
├── Traditional → Q2
├── Agile → Q2
└── Hybrid → Q2

Q2 (Phase) → always continues to Q3

Q3 (Risk Profile)
├── Low/Medium → Q4
└── High/Regulatory → Q4 (with risk supplements queued)

Q4 (Scale) → always continues to Q5

Q5 (Industry)
├── General → Q6
└── Specific → Q6 (with industry supplements queued)

Q6 (Experience) → TERMINAL: Generate recommendation card
```

**Total paths:** 3 methodologies × 4 phases × 4 risk levels × 3 scales × 4 industries × 3 experience = **1,728 unique profiles**

**But only ~36 distinct recommendation sets** because many combinations produce identical template lists (e.g., low vs. medium risk with general industry produces the same base set).

---

## Integration with Existing Content

### Methodology Selection Guide Integration

The existing [methodology-selection-guide.md](../../quick-start-kits/methodology-selection-guide.md) should be **referenced, not duplicated**:

1. **Q1 "Not sure" branch** → Links directly to the methodology selection guide
2. **Decision tree introduction** → References the guide as a prerequisite for users who haven't chosen a methodology
3. **The guide's "Context Assessment Questions"** overlap with Q1–Q4 of the decision tree but serve a different purpose (methodology selection vs. template selection)

**Recommendation:** Add a brief note at the top of the decision tree:
> *If you haven't selected a methodology yet, start with the [Methodology Selection Guide](../../quick-start-kits/methodology-selection-guide.md) first, then return here to find the right templates.*

### Template Selection Checklist Integration

The existing [TEMPLATE_SELECTION_CHECKLIST.md](../../TEMPLATE_SELECTION_CHECKLIST.md) has a "Quick Assessment" and "Detailed Assessment" section. The decision tree should:
1. **Replace** the "Quick Assessment" section as the primary entry point (the tree is more guided)
2. **Reference** the "Detailed Assessment" for users who want finer-grained control
3. **Link to** the Quick Decision Matrix for users who already know what they need

---

## Terminal Node → Template Mapping

Each terminal node produces a recommendation card by combining the active rules. The key terminal archetypes are:

| Archetype | Methodology | Risk | Scale | Example Rules | Template Count |
|-----------|-------------|------|-------|---------------|----------------|
| Lightweight Agile | Agile | Low | Small | R002+R004+R011+R016+R020+R023 | 3–5 |
| Standard Agile | Agile | Medium | Medium | R002+R005+R008+R017+R021+R024 | 7–10 |
| Scaled Agile | Agile | High | Large | R002+R006+R009+R018+R022+R025 | 12–18 |
| Lightweight Traditional | Traditional | Low | Small | R001+R004+R011+R016+R020+R023 | 3–5 |
| Standard Traditional | Traditional | Medium | Medium | R001+R005+R008+R017+R021+R024 | 7–10 |
| Enterprise Traditional | Traditional | Regulatory | Large | R001+R005+R010+R019+R022+R025 | 18–22 |
| Balanced Hybrid | Hybrid | Medium | Medium | R003+R006+R008+R017+R021+R024 | 8–14 |
| Governed Hybrid | Hybrid | High | Large | R003+R005+R009+R018+R022+R025 | 14–18 |

---

## Design Recommendations for Task #809

1. **Pure markdown implementation:** Each question is a heading with bulleted options; each option links to the next question's heading via anchor. Terminal nodes render the recommendation card inline.
2. **Progressive disclosure:** Show the recommendation card at the end, not incrementally — users find it clearer to answer all questions first.
3. **Back-navigation:** Each question should include a "← Back to previous question" link.
4. **Question count indicator:** Show "Question 3 of 6" to set expectations.
5. **Optional interactive enhancement:** A simple HTML/JS version could use `<details>` tags or a single-page app with radio buttons — but the markdown version must be fully functional without JavaScript.

**No blockers for Task 4 (Decision Tree Design).**
