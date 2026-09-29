# Issue #1161 Sprint 3 Readiness Analysis

**Candidate:** Risk register with deterministic scoring engine  
**Analysis Date:** 2026-09-29  
**Base Commit:** 919f2de3 (2026-09-25T14:16:12-04:00)  
**Prepared for:** Repository owner review  
**Status:** Further research required; not ready for Sprint 3 commitment

---

## Executive Summary

Issue #1161 proposes a Risk Management Plan template, 27-variable risk taxonomy, and deterministic scoring engine to improve consistency and explainability in risk ranking across projects.

**Current Status:**
- Issue is "Unscheduled, deprioritized" per current body (2026-09-24)
- Spike decision (2026-09-18) claims "GO" with Q4 timeline; **conflicts with current deprioritized status**
- Historical claims mostly unverified or contradicted
- Source paper (Geamanu et al., Dec 2025) not accessible

**Research Conclusion:**
- **Value proposition is hypothesized** (consistency improvement claimed but not validated with users)
- **Evidence base is insufficient** (unverified claims, inaccessible source paper, formula contradictions)
- **Not ready for Sprint 3 commitment** — research phase incomplete
- **Recommend deferral until:** Paper located or custom taxonomy approved + formula defensibility established + user validation obtained

---

## Recommended Disposition

### Primary Recommendation: DEFER — Further Research Required

**This candidate is not ready for Sprint 3 commitment.** Research phase is incomplete; critical blockers unresolved. Following a future decision to pursue this direction, substantial additional work is required before implementation can begin.

**Blockers preventing readiness:**

1. **Research source not accessible** (CRITICAL)
   - Geamanu et al. (Dec 2025) paper could not be located
   - Cannot verify 27-variable taxonomy validity
   - Cannot assess licensing/reuse constraints
   - **Must resolve before implementation:** Either locate paper OR authorize custom taxonomy development

2. **Scoring formula lacks defensibility** (CRITICAL)
   - Stated mitigation factor range (0.5-1.0) contradicted by examples (0.28, 0.145)
   - Threshold example contradicts classification table (score 10.08 labeled HIGH; table says 12+ is HIGH)
   - Conversion formula from effectiveness % to factor undefined
   - **Must resolve before implementation:** Clarify formula, verify correctness, justify thresholds with evidence

3. **No user validation of value proposition** (HIGH)
   - Consistency improvement is *hypothesized*, not validated
   - No user research confirming this solves a real pain point
   - Existing templates may be sufficient for most use cases
   - **Recommend before implementation:** Conduct user discovery (interviews with 5-10 PMs) to validate need

4. **MVP scope uncertain** (MEDIUM)
   - Scope definition depends on tooling choice: template only vs. template+spreadsheet vs. template+CLI tool
   - **Must clarify before implementation:** Define MVP deliverables

### If Repo Owner Decides to Continue Research Later

**Recommended follow-up work** (not for this sprint):

1. **Locate/clarify research source**
   - Attempt additional paper search through academic databases
   - If unsuccessful, authorize custom taxonomy and define scope
   
2. **Fix formula and document defensibility**
   - Clarify conversion formula from effectiveness % to mitigation factor
   - Justify threshold boundaries (6, 12, 20) with evidence or reasoning
   - Show corrected examples matching stated ranges

3. **Conduct user validation**
   - Interview 5-10 PMs from different project types
   - Validate: Does risk inconsistency cause real problems? Does this solution address them?
   - Document findings; adjust scope/approach based on feedback

4. **Define and bound implementation scope**
   - Decide: Template only, or template + spreadsheet, or template + CLI tool?
   - Map scope to effort requirements

**Total estimated research completion:** Uncertain; depends on paper search success and user availability

---

## Research Completion Status

**Distinction:** This table documents *research phase completion*, not implementation readiness. Even if all criteria show "Met," implementation requires additional planning and resource commitment.

| Criterion | Status | Evidence | Interpretation |
|-----------|--------|----------|-----------------|
| **Research source verified** | NOT MET | Geamanu et al. (2025) not found after web search | Paper accessibility unknown; cannot proceed without resolution |
| **Historical spike claims audited** | MET | 12 claims reviewed; evidence.md documents each | 8 claims unverified or contradicted; reduces confidence in spike quality |
| **Value proposition articulated** | PARTIAL | Mechanism clear (consistent scoring); user validation absent | Hypothesis: "Consistency improvement matters to PMs." Unvalidated; needs user discovery |
| **User journey documented** | MET | Scenario 1 (tech PM) & Scenario 2 (construction PM) detailed in scope-and-acceptance.md | Workflows illustrative; based on domain knowledge, not user research |
| **Input dictionary specified** | MET | Required/optional fields defined in scope-and-acceptance.md | Dictionary reflects researcher assumptions; needs validation with actual PM practice |
| **Scoring formula specified** | PARTIAL | Formula documented; contradictions exist between examples and stated ranges | Examples use 0.28, 0.145 mitigation factors; stated range is 0.5-1.0. Needs clarification |
| **Thresholds justified** | NOT MET | Thresholds (0-6/6-12/12-20/20+) presented; no evidence or derivation provided | Boundaries appear reasonable but unsupported; defensibility uncertain |
| **Implementation stories drafted** | MET | 4 stories with acceptance criteria in scope-and-acceptance.md | Stories assume settled formula; will require revision after formula clarification |
| **Evaluation plan defined** | MET | Measurement and acceptance criteria outlined in scope-and-acceptance.md | Plan is research-level; implementation evaluation plan still needed |
| **Effort estimates validated** | NOT MET | Spike provided 7.5 FTE-weeks; no task breakdown or resource staffing | Estimate is unvalidated; actual effort depends on scope (template=1-2 weeks; engine=5-10 weeks) |
| **Dependencies verified** | MET | #1160 and #1162 reviewed; both are unscheduled research candidates | No blocking relationships identified; #1161 can proceed independently |

**Met:** 5/11 | **Partial:** 3/11 | **Not Met:** 3/11

---

## What Changed from Historical Proposal

| Historical Claim | Current Finding | Implication |
|---|---|---|
| "Spike complete, GO" | Spike work was research, not implementation authorization | Historical decision does not authorize Sprint 3; requires fresh review |
| "Q4 timeline Oct 17-Nov 7" | Current status is "Unscheduled, deprioritized" | Timeline superseded; requires new commitment decision |
| "7.5 FTE-weeks with breakdown" | Spike estimate has no task breakdown or resource plan | Effort unvalidated; may change with scope refinement |
| "ML upgrade path included" | Current issue restricts to deterministic rules only | ML phase explicitly out of scope; historical proposal may be obsolete |
| "Geamanu 27-variable taxonomy" | Paper not accessible; taxonomy unverified | Cannot claim "from paper" without access; must use alternative |
| "Domain expert consensus" | No experts named or review documented | "Consensus" asserted without evidence; needs validation |
| "Formula examples align with ranges" | Mitigation factors contradict stated ranges; score classification incorrect | Formula needs correction before engine can be built |

---

## Outstanding Research Gaps

The following items remain unresolved and prevent advancement to implementation planning. If the repo owner decides to pursue this direction in a future sprint, these must be completed:

### 1. Research Paper Status (BLOCKING)

**Current state:** Geamanu et al. (Dec 2025) could not be located through web search.

**Options if research continues:**
- Locate paper through institutional library access or author contact
- If unsuccessful after reasonable search effort: Authorize development of custom taxonomy based on existing repo templates and risk management literature

**Why this matters:** Paper location determines whether we can claim "research-based" taxonomy or must develop one from scratch. Licensing restrictions (if paper found) may constrain reuse.

### 2. Scoring Formula Defensibility (BLOCKING)

**Current issues:**
- Mitigation factor stated as 0.5-1.0 range; examples use 0.28 and 0.145 (contradicting range)
- Threshold example: Risk #2 scores 10.08, labeled HIGH; classification table says HIGH ≥ 12 (inconsistent)
- Conversion formula from effectiveness percentage to mitigation factor is undefined

**What must be resolved:**
- Clarify and document the conversion formula (e.g., "Mitigation Factor = 1.0 - (Effectiveness% / 100 × 0.5)")
- Correct examples to use stated ranges consistently
- Provide evidence or reasoning for threshold boundaries (6, 12, 20 cutoffs)
- Verify all formula components are mathematically sound and defensible

**Why this matters:** Scoring engine correctness depends on defensible formula. Users must trust the calculation.

### 3. User Value Validation (CRITICAL)

**Current state:** Value proposition (consistency improvement) is *hypothesized*, not validated.

**What must be done:**
- Conduct user interviews with 5-10 PMs from different project types and organizational contexts
- Validate: Does risk scoring inconsistency actually cause problems? Does deterministic scoring solve them?
- Document what % of users find this valuable and under what conditions
- Adjust scope/approach based on findings

**Why this matters:** Implementation should serve real user needs, not assumptions. Without validation, this may solve a non-problem.

### 4. Implementation Scope Definition (CRITICAL IF PURSUING)

**Uncertainty:** MVP could range from template only (low effort) to full CLI tool (high effort).

**Scope options:**
- **Template enhancement:** Add scoring guidance to existing templates (minimal effort)
- **Spreadsheet calculator:** Excel/Google Sheets with embedded formulas (moderate effort)  
- **Standalone tool:** CLI or web interface for risk scoring (high effort; requires maintenance)

**Current state:** Scope not decided. Effort estimates vary accordingly.

---


## Key Findings from Research

### Repository Already Has Extensive Risk Resources

- **25+ risk templates** across methodologies and industries
- **Existing 5×5 matrix approach** (1-25 scale, P × I scoring)
- **No deterministic engine with modifiers** in current templates
- **Gap is real:** Modifier support (mitigation effectiveness, time sensitivity, dependencies) not currently in templates

### Value Proposition (HYPOTHESIZED)

**Claimed Problem:** Risk teams score same risk differently; inconsistent across projects; mitigation benefit not visible in score

**Proposed Solution:** Deterministic engine applies consistent rules; tracks modifiers; normalizes to 0-100 scale

**Status:** Reasoning is sound; mechanism is clear; **BUT NOT VALIDATED WITH ACTUAL USERS**

This is a hypothesis requiring validation before implementation:
- Do PMs actually experience scoring inconsistency as a problem?
- If yes, does deterministic scoring solve it cost-effectively?
- What % of users would adopt this?

### Arguments for Pursuing (If Blockers Resolved)

1. **Inconsistent risk scoring is a recognized problem** in project risk management literature (hypothesis supported by domain knowledge, not user research)
2. **Repository foundation is strong** — 25+ risk templates already exist; gap (modifiers) is well-defined
3. **Deterministic approach aligns with repository values** — Transparent, auditable, repeatable
4. **Scope can be contained** — Don't need full ML/predictive model; template + scoring rules suffice
5. **Research direction is sound** — Risk taxonomies and scoring modifiers are legitimate PM topics

### Arguments Against Implementing (Without Further Validation)

1. **Source paper inaccessible** — Cannot verify taxonomy or claims made about it
2. **Historical spike claims are largely unverified** — 8 of 12 claims unverified or contradicted; raises confidence concerns
3. **Formula contains contradictions** — Examples don't match stated ranges; thresholds inconsistently applied
4. **No user validation of value** — No evidence this solves a real user problem; gap might not matter in practice
5. **Existing templates are sufficient for many use cases** — Risk management works without deterministic scoring for most projects
6. **Effort is substantial without clear ROI** — Implementation cost (unknown; 2-10 weeks depending on scope) must justify benefit (unvalidated)

---


---

## Analysis Documents

This readiness package includes:

1. **README.md** (this file)
   - Executive summary, disposition, blockers, decisions for repo owner
   - Sprint 3 readiness checklist
   - Key uncertainties and options

2. **evidence.md**
   - Detailed claim audit (12 claims audited)
   - Repository risk resource inventory
   - Paper search results and licensing analysis
   - Standards research (PMBOK/ISO 31000)
   - Alternatives comparison
   - Unresolved gaps and blockers

3. **scope-and-acceptance.md**
   - User journey (end-to-end PM risk assessment workflow)
   - Input dictionary (fields, required/optional, examples from 2+ contexts)
   - Proposed assessment contract (formula, processing, outputs)
   - Draft implementation stories with acceptance criteria
   - Evaluation and acceptance plan
   - Dependencies and effort drivers

---

## Remaining Work Before Implementation

### Repo Owner Actions (2-3 days)

- [ ] Decide: Paper access or custom taxonomy?
- [ ] Clarify: Formula conversion formula and threshold alignment
- [ ] Define: MVP scope (template only, or template + engine?)
- [ ] Verify: Dependencies #1160/#1162 status
- [ ] Confirm: Sprint 3 resource availability

## If Pursuing This Direction in a Future Sprint

Should the repo owner decide to proceed with this research direction, the following work remains:

### Prerequisite Work (Before Implementation Planning)

- [ ] Resolve paper status: Locate Geamanu et al. (2025) OR authorize custom taxonomy development
- [ ] Fix and defend formula: Clarify conversion formula, correct examples, justify thresholds with evidence
- [ ] Validate user value: Interview 5-10 PMs to confirm scoring inconsistency is a real problem and this solution addresses it
- [ ] Define implementation scope: Template only vs. spreadsheet vs. CLI tool (scope drives effort significantly)

### If Pursuing Implementation After Prerequisite Work

- [ ] Finalize input dictionary and validation rules
- [ ] Verify acceptance criteria for template and scoring guide
- [ ] Plan implementation effort with task breakdown and resource availability
- [ ] Define success metrics and user acceptance approach

---

## Summary: Research Completion Status

**This research package documents the current state of this candidate as of 2026-09-29.** It provides:

✓ Historical spike claims audited (12 claims; evidence.md documents each)  
✓ Repository risk resources inventoried (25+ templates across methodologies)  
✓ Value proposition articulated (but unvalidated hypothesis)  
✓ User scenarios documented (illustrative; not from user research)  
✓ Input dictionary specified (researcher assumptions; needs validation)  
✓ Scoring formula detailed (with documented contradictions)  
✓ Implementation stories drafted (provisionally; assume formula changes)  
✓ Blockers clearly identified (paper, formula, user validation, scope)  

**Not included in this research:**
- User validation of value proposition
- Verified scoring formula
- Verified paper access or approved custom taxonomy
- Implementation task breakdown or resource plan
- Effort estimates with defensible basis

---

## Next Steps for Repository Owner

**Option 1: Defer (RECOMMENDED for Sprint 3)**
- Close this analysis
- Revisit for later sprint (when capacity allows further research or when user demand justifies)

**Option 2: Pursue Further Research (If High Priority)**
- Assign research lead for blockers (paper, formula, user validation)
- Plan follow-up work (estimated scope: 2-4 weeks to resolve blockers and prepare for implementation)
- Update issue status and assign to sprint when blockers resolved

**Do not move to implementation planning** until all blockers are resolved and user validation completed.


---

**Document prepared by:** Product discovery analyst  
**Date:** 2026-09-29  
**Status:** Ready for repo owner decision; not sprint authorization  
**Related issue:** #1161 (GitHub)
