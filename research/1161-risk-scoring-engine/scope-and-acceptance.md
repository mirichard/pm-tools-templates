# Issue #1161 Scope and Acceptance (Research Draft)

**Status:** Further research required; not ready for Sprint 3 commitment.

This document keeps usable scenario framing while preserving uncertainty. Stories here are proposals only, not approved implementation instructions.

## 1) Fictional user journeys (illustrative only)

### Journey A (technology program context)

- **Decision the PM is trying to make:** Which risks need immediate governance attention and response ownership this period.
- **Information that must be prepared:** risk description, probability judgment, impact judgment, response plan status, dependency context, assessment date, and rationale notes.
- **Where information might come from:** team workshops, prior registers, architecture reviews, schedule/network plans, and current response actions.
- **What a proposed resource would do:** structure inputs, apply an explicitly approved method (if one is approved), and present traceable ranking outputs with rationale capture.
- **What the user would receive:** prioritized list with score components, uncertainty flags, and explicit differentiation between inherent and assessed residual views.
- **Appropriate follow-up actions:** challenge assumptions, confirm owners and review cadence, escalate per governance policy, and re-score when evidence changes.

### Journey B (non-technology construction/regulatory context)

- **Decision the PM is trying to make:** Which risks justify contingency allocation and sponsor-level escalation before next gate.
- **Information that must be prepared:** probability/impact judgments, phase timing relevance, cross-trade dependencies, permit/regulatory constraints, and evidence quality.
- **Where information might come from:** contractor coordination meetings, permit status records, weather/season assumptions, and prior project outcomes.
- **What a proposed resource would do:** keep assumptions explicit, avoid silent defaults for missing dependency or mitigation evidence, and separate planned responses from verified effects.
- **What the user would receive:** ranked risks plus evidence-confidence notes, unresolved-data markers, and clear “do not infer” warnings where inputs are missing.
- **Appropriate follow-up actions:** gather missing evidence, revisit judgments with independent reviewers, and update contingency decisions using documented rationale.

## 2) Input needs and evidence handling boundaries

### Required input classes (conceptual)

1. **Observed evidence** (dated facts): events, dependencies, current status, verified response effects.
2. **User judgment** (ordinal assessments): probability and impact choices made by accountable reviewers.
3. **Assumptions** (explicitly marked): expected response effect, timing relevance, dependency spread when evidence is incomplete.
4. **Missing information** (explicitly unresolved): unknown dependency links, unknown mitigation efficacy, stale or absent assessment dates.

### Rules for uncertainty preservation

- Missing dependency evidence must **not** imply the risk is isolated.
- Missing mitigation evidence must **not** imply a measured reduction exists.
- Planned, implemented, and verified response effects must be tracked separately.
- Inherent risk, current assessed residual risk, and hypothetical post-response scenarios must be separated.
- Ordinal score changes must not be presented as financial savings or proof of real-world mitigation value.
- Deterministic arithmetic must not be presented as eliminating judgment in inputs or method design.

## 3) Historical/unvalidated proposal under audit (not approved specification)

The prior packet contained an unresolved scoring proposal. It remains historical and unvalidated.

### Contradictions documented

- Stated bounds (P 1–5, I 1–5, M 0.5–1.0, T 0.8–1.2, D 1.0–1.5) permit a raw maximum of 45, not 30.
- A variant time factor bound of 1.5 raises raw maximum to 56.25.
- Historical examples used mitigation factors outside the stated range and included threshold-label mismatch.

### Consequence for this packet

No replacement constants, thresholds, defaults, weighting, confidence levels, stale-data limits, or override rules are approved here.

## 4) Provisional scope options (proposal set, no ranking)

### Option A — Improve existing guidance and calibration

- Enhance template guidance clarity and evidence capture without introducing a new deterministic scoring product.
- Requires evidence that current ambiguity causes meaningful decision-quality issues.

### Option B — Add a transparent calculation aid using an approved method

- Could be spreadsheet/template support only after method approval.
- Requires approved method specification first; otherwise arithmetic consistency checks are undefined.

### Option C — Continue source-research investigation

- Focus on source verification, applicability limits, and reuse constraints before method adoption claims.

### Option D — Defer or decline further product development

- Valid option when method/value uncertainty remains unresolved versus competing backlog needs.

## 5) Draft stories (proposals only; gated)

These are planning placeholders, not approved work instructions.

### Story P1 — Evidence-first risk assessment guidance

- **Purpose:** improve traceability of risk judgments and assumptions.
- **Prerequisites:** none beyond repo-owner authorization for documentation work.
- **Not included:** disputed formula as mandatory acceptance criteria.

### Story P2 — Calculation aid prototype (if method approved)

- **Purpose:** test whether an explicitly approved method can be executed consistently.
- **Prerequisites:** approved method definition and uncertainty-handling rules.
- **Not included:** implied production rollout, predictive claims, or sprint commitment.

### Story P3 — User-value validation research

- **Purpose:** determine whether this candidate improves practical PM decision support versus current practice.
- **Prerequisites:** agreed evidence standard for usefulness and independent review approach.
- **Not included:** automatic implementation progression.

## 6) Evaluation approach (separate evidence streams)

### A. Calculation correctness (only after method approval)

- Verify arithmetic execution against the approved specification.
- This does not by itself prove practical value or outcome improvement.

### B. Practical usefulness versus current PM practice

- Assess whether users can prepare inputs, interpret outputs, and make better-supported decisions.
- Include effort burden and false-reassurance checks.

### C. Real-world outcomes

- Evaluate whether decisions and project outcomes improve over time.
- Keep causality limits explicit; confidence and arithmetic consistency alone are insufficient.

### Total-effort accounting required in any future evaluation plan

- Preparation
- Data entry
- Verification
- Correction/rework
- Interpretation
- Follow-up action

## 7) What still requires explicit repo-owner decision

1. Whether to continue research on this candidate now.
2. Whether source-paper verification is mandatory before any taxonomy claims.
3. Whether to authorize method-definition work, and under what evidence standard.
4. Whether user-value research should be performed before any implementation planning.

## 8) Non-authorization statement

Draft only. Further research required. No merge, implementation authorization, or Sprint 3 commitment.
