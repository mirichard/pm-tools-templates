# Design Thinking Walkthrough: Volunteer Shift Reminders at a Regional Food Bank

**Project**: Riverside Food Bank Volunteer Shift Reliability  
**Example Type**: Documented worked example (fictional subject, illustrative data)  
**Prepared By**: Template maintainers  
**Last Updated**: 2026-10-08  
**Related Templates**: [Design Thinking Workshop Template](../../methodology-frameworks/emerging-methods/design-thinking/design_thinking_workshop_template.md), [User Empathy Mapping Template](../../methodology-frameworks/emerging-methods/design-thinking/user_empathy_mapping_template.md), [User Story Template](../../domains/uncertainty/role-based-toolkits/product-owner/user-story-template.md)

> This example carries ONE sample subject through six steps, from raw research to an Agile user story. Every organization, person, quote, and number is fictional and exists only to show how the templates connect. See [Limitations](#limitations-of-this-example) before drawing any conclusion from it.

## Scenario

Riverside Food Bank is a fictional regional nonprofit. About 120 volunteers staff Saturday sorting and distribution shifts. Shift coordinators report that 25-30% of volunteers who sign up do not show up, and last-minute gaps are filled by phone calls on Friday night. The leadership team wants to understand the problem before choosing a solution.

## How This Walkthrough Maps to the Templates

| Step | What happens | Template section used |
|------|--------------|-----------------------|
| 1 | User research input | [User Interview Guide](../../methodology-frameworks/emerging-methods/design-thinking/design_thinking_workshop_template.md#user-interview-guide) and [Data Organization Template](../../methodology-frameworks/emerging-methods/design-thinking/user_empathy_mapping_template.md#data-organization-template) |
| 2 | Empathy map | [Basic Four-Quadrant Empathy Map](../../methodology-frameworks/emerging-methods/design-thinking/user_empathy_mapping_template.md#basic-four-quadrant-empathy-map) |
| 3 | POV and How Might We | [POV Statement Template](../../methodology-frameworks/emerging-methods/design-thinking/design_thinking_workshop_template.md#point-of-view-pov-statement-template) and [HMW Question Generator](../../methodology-frameworks/emerging-methods/design-thinking/design_thinking_workshop_template.md#how-might-we-hmw-question-generator) |
| 4 | Ideation and selection | [Idea Clustering and Selection Matrix](../../methodology-frameworks/emerging-methods/design-thinking/design_thinking_workshop_template.md#idea-clustering-and-selection-matrix) |
| 5 | Prototype definition | [Prototype Planning Canvas](../../methodology-frameworks/emerging-methods/design-thinking/design_thinking_workshop_template.md#prototype-planning-canvas) |
| 6 | Agile handoff | [Agile Integration Points](../../methodology-frameworks/emerging-methods/design-thinking/user_empathy_mapping_template.md#agile-integration-points) and the canonical [User Story Template](../../domains/uncertainty/role-based-toolkits/product-owner/user-story-template.md) |

---

## Step 1: User Research Input

**Template used**: [User Interview Guide](../../methodology-frameworks/emerging-methods/design-thinking/design_thinking_workshop_template.md#user-interview-guide) for the interview plan, and the [Data Organization Template](../../methodology-frameworks/emerging-methods/design-thinking/user_empathy_mapping_template.md#data-organization-template) for sorting the notes.

### Research Plan (adapted from the Interview Guide)

- **Objective**: Understand why signed-up volunteers miss shifts and how coordinators cope
- **Format**: Semi-structured, 30 minutes each (shortened from the template's 45-60 minutes)
- **Participants (fictional)**: 3 volunteers and 2 shift coordinators
- **Research period**: 2026-09-01 to 2026-09-12

### Raw Notes (illustrative)

| Source | Role | Raw note |
|--------|------|----------|
| P1 | Volunteer (student) | "I sign up weeks ahead. By the time Saturday comes I've forgotten, or exams moved." Never received a reminder; checks the sign-up site only when signing up |
| P2 | Volunteer (retired) | Reads every email. Would come if asked the night before. "I hate leaving them short, but I don't know how to cancel." Does not know where the cancel button is |
| P3 | Volunteer (works shifts) | Work schedule changes weekly. "Texts are the only thing I look at." Skips the shift rather than explaining why |
| C1 | Coordinator | Spends about 3 hours every Friday evening phoning volunteers. "I'm calling people who already decided not to come." |
| C2 | Coordinator | Keeps a private spreadsheet of reliable volunteers. Over-books by 20% as a workaround, which sometimes leaves volunteers standing idle |

### Data Organization (sorted by the template's categories)

```
Research Data Organization Worksheet

User Segment: Volunteers and shift coordinators
Research Period: 2026-09-01 to 2026-09-12
Research Methods Used: Semi-structured interviews
Number of Participants: 5 (fictional)

Direct Quotes (SAYS):
├── "I've forgotten, or exams moved." (P1)
├── "I hate leaving them short, but I don't know how to cancel." (P2)
├── "Texts are the only thing I look at." (P3)
└── "I'm calling people who already decided not to come." (C1)

Observed Behaviors (DOES):
├── Volunteers check the sign-up site only when signing up (P1)
├── Volunteers skip silently instead of cancelling (P2, P3)
└── Coordinators over-book and phone on Friday night (C1, C2)
```

---

## Step 2: Empathy Map

**Template used**: [Basic Four-Quadrant Empathy Map](../../methodology-frameworks/emerging-methods/design-thinking/user_empathy_mapping_template.md#basic-four-quadrant-empathy-map). The quick two-column form in the workshop template's [Empathy Map Template](../../methodology-frameworks/emerging-methods/design-thinking/design_thinking_workshop_template.md#empathy-map-template) section can be used instead for a faster session.

```
Empathy Map for: Casey, occasional volunteer (composite of P1-P3)
Context: Between signing up for a Saturday shift and the shift itself
Based on: 3 volunteer interviews (fictional)

┌─────────────────────────┬─────────────────────────┐
│         THINKS          │          FEELS          │
│                         │                         │
│ • "I'll remember."      │ • Guilty about letting  │
│ • "They probably have   │   the team down         │
│   enough people."       │ • Embarrassed to cancel │
│ • "Cancelling is more   │   late                  │
│   awkward than just     │ • Still motivated by    │
│   not going."           │   the cause             │
│                         │                         │
├─────────────────────────┼─────────────────────────┤
│          SAYS           │          DOES           │
│                         │                         │
│ • "Texts are the only   │ • Signs up weeks ahead  │
│   thing I look at."     │ • Never revisits the    │
│ • "I don't know how to  │   sign-up site          │
│   cancel."              │ • Skips silently when   │
│ • "I hate leaving them  │   the week gets busy    │
│   short."               │                         │
│                         │                         │
└─────────────────────────┴─────────────────────────┘

PAIN POINTS:                    GAINS:
• No reminder before the shift  • Helping the community
• No obvious, low-effort way    • Being seen as reliable
  to cancel                     • Flexibility around a changing
• Sign-up is weeks ahead of       work or study schedule
  the shift
```

**Note on the evidence**: this map rests on three fictional interviews. A real map would record the number of participants behind each statement.

---

## Step 3: Point of View Statement and How Might We Questions

### Point of View

**Template used**: [POV Statement Template](../../methodology-frameworks/emerging-methods/design-thinking/design_thinking_workshop_template.md#point-of-view-pov-statement-template)

```yaml
point_of_view_development:
  user_persona:
    name: "Casey"
    role: "Occasional Saturday volunteer"
    context: "Signs up weeks ahead; schedule changes before the shift"

  user_need:
    functional_need: "Be reminded, and be able to confirm or cancel in seconds"
    emotional_need: "Feel reliable without feeling embarrassed"
    social_need: "Be seen as a dependable member of the team"

  insight:
    key_insight: "Volunteers don't skip because they don't care; they skip because cancelling feels harder and more awkward than silently not showing up"
    supporting_evidence: ["P2: \"I don't know how to cancel\"", "P3 skips rather than explaining", "C1 phones people who already decided not to come"]

  pov_statement:
    template: "[User] needs [need] because [insight]"
    result: "Occasional volunteers need a quick, low-pressure way to confirm or cancel their shift because cancelling currently feels more awkward than silently not showing up."
```

### How Might We Questions

**Template used**: [HMW Question Generator](../../methodology-frameworks/emerging-methods/design-thinking/design_thinking_workshop_template.md#how-might-we-hmw-question-generator)

1. How might we remind volunteers on the channel they actually look at?
2. How might we remove barriers to cancelling a shift?
3. How might we help volunteers feel good about cancelling early?
4. How might we help coordinators learn about gaps before Friday night?
5. How might we reimagine over-booking so that nobody stands idle?

**Question evaluation** (against the template's criteria): Questions 1, 2 and 4 are broad enough, do not assume a solution, and are grounded in the research. Question 5 was rejected as too narrow (it assumes over-booking stays).

**Selected focus question**: "How might we make confirming or cancelling a shift as easy as replying to a text message?"

**Rationale**: It addresses the key insight directly (cancelling is awkward) and the behavior evidence (P3 uses texts only).

---

## Step 4: Ideation and Idea Selection

**Template used**: [Idea Clustering and Selection Matrix](../../methodology-frameworks/emerging-methods/design-thinking/design_thinking_workshop_template.md#idea-clustering-and-selection-matrix)

### Ideas Generated (illustrative brainstorm output)

| ID | Idea | Cluster |
|----|------|---------|
| A | Text reminder 48 hours before the shift; reply YES to confirm or NO to cancel | Reminders |
| B | Self-service web page where volunteers manage their own shifts | Self-service |
| C | Automatic standby list that is texted when a volunteer cancels | Gap filling |
| D | Printed shift board at the food bank entrance | Visibility |
| E | Volunteer "buddy" who checks in with a partner before each shift | Social accountability |

### Scoring Matrix

Scale 1-5, all criteria weighted equally. For *Resources*, a higher score means **less** effort required. Totals are the sum of the five scores.

| Idea | User Impact | Feasibility | Innovation | Strategic Fit | Resources | Total Score |
|------|-------------|-------------|------------|---------------|-----------|-------------|
| A    |      5      |      5      |     2      |       4       |     4     |     20      |
| B    |      4      |      3      |     3      |       4       |     2     |     16      |
| C    |      4      |      3      |     4      |       5       |     3     |     19      |
| D    |      2      |      5      |     1      |       2       |     5     |     15      |
| E    |      3      |      4      |     2      |       3       |     2     |     14      |

### Selection

- **Top 3**: A (20), C (19), B (16)
- **Selected for prototyping**: **Idea A** (text reminder with reply-to-confirm). It scores highest, matches the focus question, and is quick to prototype.
- **Deferred**: Idea C is a natural follow-up that depends on A producing reliable cancellation data. Idea B is deferred because of its higher effort.

---

## Step 5: Prototype Definition

**Template used**: [Prototype Planning Canvas](../../methodology-frameworks/emerging-methods/design-thinking/design_thinking_workshop_template.md#prototype-planning-canvas)

```yaml
prototype_planning:
  objective:
    what_to_test: "Volunteers will reply to a text to confirm or cancel, and cancelling by text feels easier than not showing up"
    target_users: "Occasional Saturday volunteers; shift coordinators as secondary users"
    key_questions: ["Do volunteers understand the YES/NO reply?", "What do coordinators need to see after a reply?"]

  prototype_type:
    fidelity_level: "Low"
    format: "Scripted text messages sent by hand from a shared phone, plus a paper coordinator roster"
    complexity: "Simple concept"

  resources_needed:
    time_allocation: "Half a day to prepare"
    materials: ["Shared phone", "Message script", "Printed roster"]
    skills_required: ["Facilitation", "Plain-language writing"]
    team_members: "2 people (one coordinator, one facilitator)"

  success_criteria:
    learning_goals: "Learn whether the message wording is understood and whether replies are given"
    user_feedback: "Volunteers reply, and report cancelling by text as no harder than ignoring the message"
    iteration_plan: "Revise the wording and reply options after the first Saturday"
```

**Prototype message script (draft)**:

> Hi Casey, this is Riverside Food Bank. You're signed up for Saturday 9:00-12:00 sorting. Reply YES to confirm or NO if you can't make it. A NO is fine; it helps us plan. Thank you!

**Status**: This is a *definition* of the prototype. The walkthrough does not report test results, because none exist for this fictional subject.

---

## Step 6: Handoff to an Agile User Story

**Templates used**: [Agile Integration Points](../../methodology-frameworks/emerging-methods/design-thinking/user_empathy_mapping_template.md#agile-integration-points) (writing stories from empathy insights), [Sprint Integration Framework](../../methodology-frameworks/emerging-methods/design-thinking/design_thinking_workshop_template.md#sprint-integration-framework) (placing the work in a sprint), and the canonical [User Story Template](../../domains/uncertainty/role-based-toolkits/product-owner/user-story-template.md) for the story itself.

The empathy-based story pattern from the template is: "As a [user who thinks/feels X], I want [capability] so that [empathy-based benefit]". Below is the prototype's learning translated into a story using the canonical User Story Template's structure.

### Story Information
- **Story ID**: VOL-12
- **Epic**: Volunteer Shift Reliability
- **Priority**: High
- **Estimate**: 5 story points (illustrative)
- **Product Owner**: Alex Rivera (fictional)

### User Story
**As a** volunteer who worries about letting the team down  
**I want** to confirm or cancel my shift by replying to a text message  
**So that** I can cancel early without awkwardness and coordinators can fill the gap before Friday night

### Acceptance Criteria

#### Scenario 1: Volunteer confirms
**Given** a volunteer is signed up for a Saturday shift  
**When** they reply YES to the 48-hour reminder text  
**Then** the shift is marked confirmed on the coordinator roster

#### Scenario 2: Volunteer cancels
**Given** a volunteer is signed up for a Saturday shift  
**When** they reply NO to the reminder text  
**Then** the shift is released, the coordinator roster shows an open slot, and the volunteer receives a thank-you reply without any request for a reason

#### Scenario 3: Unclear reply
**Given** a volunteer replies with text other than YES or NO  
**When** the system receives the message  
**Then** the volunteer is sent one clarifying message and the coordinator is notified if there is still no clear answer 24 hours before the shift

### Additional Information
- **Business Value**: Fewer no-shows and less Friday-night phoning for coordinators
- **User Impact**: Cancelling becomes a low-effort, low-embarrassment action (empathy-map pain point addressed)
- **Dependencies**: Text-messaging provider and volunteer consent to receive texts
- **Risks and Assumptions**: *Assumption*: volunteers will accept text reminders. This is untested outside the prototype definition in Step 5 and should be validated in the first sprint

### Where the Story Goes Next

The story continues in the [User Story Template](../../domains/uncertainty/role-based-toolkits/product-owner/user-story-template.md): refinement with the team, the Definition of Ready and Definition of Done checklists, and a testing strategy. Idea C (standby list) becomes a follow-up story once cancellation data exists.

---

## Limitations of This Example

This is a **documented worked example, not usability testing with real first-time users.**

- All people, quotes, numbers, and scores are fictional and illustrative. No real users were interviewed, observed, or tested.
- It demonstrates how the templates connect and how artifacts flow from one step to the next. It does **not** show that the templates produce better outcomes, that the sample solution works, or that first-time users can follow the templates unaided.
- The walkthrough stops before the Test stage. No prototype results are reported.
- Scores in the selection matrix are the author's illustrative choices, not the outcome of a facilitated team session.
- Treat it as a reference for structure and sequencing only. Validate your own work with your own users.

---

## Related Resources

- [Design Thinking Workshop Template](../../methodology-frameworks/emerging-methods/design-thinking/design_thinking_workshop_template.md)
- [User Empathy Mapping Template](../../methodology-frameworks/emerging-methods/design-thinking/user_empathy_mapping_template.md)
- [User Story Template](../../domains/uncertainty/role-based-toolkits/product-owner/user-story-template.md)
- [Sprint Planning Example](../agile/sprint_planning_example.md)
