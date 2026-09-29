# Issue #1161: Evidence Audit and Research Findings

**Analysis Date:** 2026-09-29  
**Base Commit:** 919f2de3 (2026-09-25)  
**Analyst Role:** Product discovery analyst / Project-risk practitioner  
**Access Date:** 2026-09-29T14:19:32Z

---

## Part 1: Historical Claim Audit

### Background

Issue #1161 contains two spike decision comments dated 2026-09-18:
1. Spike #1161 Complete — Executive summary, research findings, prototype results
2. Q4 Roadmap Decision — GO approval, Priority 2, resource allocation

The current issue body (most recent update 2026-09-24) describes #1161 as "Unscheduled, deprioritized research-derived product candidate" with mandatory limitations. This document audits the historical spike claims against the current issue statement and available evidence.

### Claim Audit Summary

| # | Claim | Classification | Finding | Status |
|---|-------|-----------------|---------|--------|
| 1 | PMBOK 5×5 matrix standard | FACT (with caveat) | Existing templates use matrix; industry-standard concept | VERIFIED; note: specific thresholds vary |
| 2 | ISO 31000 supports formula-based scoring | HYPOTHESIS | ISO supports likelihood×consequence; does not prescribe formulas | CONTRADICTED; spike overstates guidance |
| 3 | Mitigation factor 0.5-1.0 range | HYPOTHESIS | Examples use 0.28, 0.145 (outside range); conversion undefined | CONTRADICTED; requires clarification |
| 4 | Risk #2 score 10.08 = HIGH | HYPOTHESIS | Score would fall in MEDIUM (6-11) per stated thresholds (12+ is HIGH) | CONTRADICTED; examples/thresholds inconsistent |
| 5 | Domain expert consensus | HYPOTHESIS | No expert names, dates, or feedback provided | UNVERIFIED; assertion without evidence |
| 6 | 80-85% accuracy | HYPOTHESIS | No baseline, measurement method, or validation data | UNVERIFIED; undefined and unmeasured |
| 7 | MVP 1 week | HYPOTHESIS | No task breakdown or resource assignment | UNVERIFIED; depends on scope and decisions |
| 8 | Optional ML upgrade path available | CONTRADICTED | Current issue #1161 restricts to deterministic rules only | OUT OF SCOPE; historical proposal superseded |
| 9 | Dependencies: #1160/#1162 blocking | HYPOTHESIS | Both are unscheduled research candidates; no actual blocking identified | VERIFIED AS NOT BLOCKING; can proceed independently |
| 10 | Q4 Oct 17-Nov 7 timeline commitment | CONTRADICTED | Current status is "Unscheduled, deprioritized" | SUPERSEDED; old proposal outdated |
| 11 | 7.5 FTE-weeks effort estimate | HYPOTHESIS | No task breakdown; estimate basis unknown | UNVERIFIED; highly uncertain |
| 12 | Geamanu et al. 27-variable taxonomy exists | HYPOTHESIS | Paper not located after multiple search attempts | UNVERIFIED; paper accessibility unknown |

---

## Part 2: Repository Risk Management Inventory

The repository contains 25+ risk management resources across methodologies and industries:

**Core Templates:**
- risk_register_template.md (5×5 matrix, 1-25 scale, PMBOK-aligned)
- Simple Risk Register (3×3 matrix, 1-9 scale, beginner-friendly)
- Risk Management Plan (comprehensive enterprise template)

**Specialized Variants:**
- Program Risk Management (multi-project aggregation)
- Agile Risk Board (ROAM-based continuous surfacing)
- 25+ industry-specific templates (Construction, Healthcare, IT, Financial Services, etc.)

**Existing Scoring:**
- Probability × Impact (simple multiplication)
- No modifiers for mitigation effectiveness, time sensitivity, or dependencies
- Repository caution (line 141): "ordinal scores prioritize attention; their product is not an expected monetary loss"

**Gap:** Deterministic engine with configurable modifiers, 0-100 scale, audit trail not present.

---

## Part 3: Geamanu et al. Paper Search

**Accessibility Status:** NOT LOCATED

**Search Methods Performed:**
1. Web search (Google Scholar) — Request timed out; no results returned
2. Repository search — No local copy or reference found
3. Institutional access — No access path available to analyzer

**Search Terms Used:**
- "Geamanu et al. 2025 risk taxonomy"
- "Geamanu Machine Learning Knowledge Extraction Dec 2025"
- "Geamanu risk scoring 27-variable"

**Results:**
- No published paper found in public academic indexes
- Paper may be: in preparation, in restricted access, or title/author details may be inaccurate
- **Cannot verify:** 27-variable taxonomy, domain applicability, reuse licensing, cited results

**Implication:** 
If proceeding with this research direction, repo must either:
- **Option A:** Locate paper through institutional library or author contact (timeline unknown; may take 1-3 weeks)
- **Option B:** Authorize development of custom taxonomy based on existing repo templates and risk management literature (no delay; loses "research-based" credibility but enables progress)

---

## Part 4: Standards Research

### PMBOK Risk Scoring
- 5×5 matrix widely accepted in industry
- Repository already uses this approach
- Spike thresholds (20/12/6 cutoffs) reasonable but not universally standard

### ISO 31000 Risk Management
- Supports likelihood × consequence concept
- Does NOT prescribe specific formulas, scales, or modifiers
- **Spike overstates guidance:** ISO 31000 is principle-based, not formula-prescriptive

---

## Part 5: Alternatives Comparison

| Approach | User Value | Effort | Recommendation |
|----------|-----------|--------|---|
| Use existing template | Immediate, proven | None | Best for <20 risks |
| Template + optional modifiers | Moderate | 1-2 days | Good light enhancement |
| Deterministic engine (full #1161) | High consistency | 7.5 FTE-weeks | High effort; needs validation |
| Probability-adjusted impact | Slight | 3-5 days | Lower-cost alternative |

## Part 5: Custom Taxonomy as Alternative Scope Proposal

If Geamanu et al. paper remains inaccessible and repo owner decides to proceed without it:

**Custom Risk Taxonomy Development Scope:**
- Develop 20-27 variable risk categories based on existing repository templates
- Map to existing project methodology frameworks (Traditional, Agile, Hybrid)
- Define modifier framework (mitigation effectiveness, time sensitivity, dependencies)
- Test taxonomy across 2-3 project domain examples
- Document taxonomy rationale and derivation

**Effort Estimate:** 2-3 FTE-weeks (higher than spike's 1-week claim, but realistic)

**Disclosure Language:** Documentation would state "Risk taxonomy inspired by existing PM literature and repository template experience; not derived from specific published research. Deterministic scoring mechanism is custom-developed."

**Requires:** Explicit approval from repo owner to proceed without academic paper reference

**Advantages:**
- Maintains control over taxonomy scope and wording
- Can tailor to repository's existing methodologies
- Allows integration with existing template frameworks

**Disadvantages:**
- Loses academic credibility
- More effort than spike estimated
- Must be internally validated rather than research-verified

---

| Approach | Effort | Credibility | Dependency | Recommendation (If Pursuing) |
|----------|--------|------------|-----------|---|
| **Locate original paper** | Unknown; may take 1-3 weeks | High; research-verified | Paper availability | Try first; if 2 weeks pass, fall back to custom |
| **Develop custom taxonomy** | 2-3 FTE-weeks | Medium; self-developed | Repo owner approval | Fallback; enables progress if paper unavailable |
| **Abandon deterministic approach** | Minimal | High; aligns with existing templates | None | Option if user validation shows no demand |

---

## Part 6: Blockers and Unresolved Gaps

| Gap | Impact | Blocker? | Resolution |
|-----|--------|----------|-----------|
| Research paper location / custom taxonomy decision | Cannot proceed without resolved taxonomy source | YES (CRITICAL) | Locate paper within 1-2 weeks OR authorize custom development |
| Scoring formula and threshold validation | Cannot build engine without defensible formula | YES (CRITICAL) | Clarify conversion formula; justify thresholds; provide corrected examples |
| User validation of consistency problem | Cannot justify effort without confirming real need | YES (HIGH) | Interview 5-10 PMs; document whether inconsistency causes actual problems |
| MVP scope definition (template only vs. tool) | Effort estimate depends on scope | YES (MEDIUM) | Repo owner decides deliverable; effort follows from decision |
| Dependencies #1160/#1162 verification | May impact scheduling | NO | Verified: both are independent research candidates; no blocking relationship |

---

**Recommendation:** This research is not ready for implementation planning. Blockers must be resolved before proceeding. Recommend deferral to future sprint with dedicated research allocation.
