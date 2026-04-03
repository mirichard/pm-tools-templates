# Task #829: Getting Started Experience Design

**Story:** #733 ([Onboarding] – Getting Started Guide – First-Use Experience)
**Epic:** #710 (Epic 3: README + Entry Experience Redesign)
**Date:** 2026-04-03
**Status:** Complete

---

## 1. Design Principles

- **Under 5 minutes** from landing to first template customized
- **Single path** — no decision fatigue for new users
- **Progressive disclosure** — simple first, complexity later
- **Leverage existing content** — don't duplicate, consolidate and link

## 2. Five-Step Getting Started Flow

### Step 1: What is this? (30 seconds)
**Content:** One-paragraph description + key stats
**Source:** New (replace README Quick Start intro)

> A curated collection of 154+ battle-tested, open-source templates for project and program managers. Whether you're running agile sprints, traditional waterfall projects, or a hybrid approach — find the right template, customize it, and go.

**Existing content used:** README.md line 12 (adapt existing tagline)
**Gap:** None — just needs tightening

### Step 2: How is it organized? (60 seconds)
**Content:** Link to architecture diagram + 3-sentence explanation of the three navigation paths
**Source:** `docs/SYSTEM_ARCHITECTURE.md` (created Sprint 3)

> This repo is organized three ways — pick the one that matches your question:
> - **By Role:** "I'm a Scrum Master" → `role-based-toolkits/`
> - **By Phase:** "I'm in planning" → `project-lifecycle/`
> - **By Methodology:** "I need agile templates" → `templates/agile/`

**Existing content used:** `docs/SYSTEM_ARCHITECTURE.md` (link to full diagram)
**Gap:** None — Sprint 3 deliverable covers this

### Step 3: Find what you need (90 seconds)
**Content:** Decision tree with 3 questions → direct link to the right area
**Source:** Consolidate from `quick-start-kits/methodology-selection-guide.md` + `docs/getting-started/methodology-selector.md`

Decision flow:
1. **Do you know your role?** → Yes: go to role toolkit → No: continue
2. **Do you know your methodology?** → Agile/Traditional/Hybrid: go to methodology area → Not sure: use methodology selection guide
3. **Do you know what you need to do?** → Browse by lifecycle phase or use Template Index

**Existing content used:** Methodology selection guide (2 versions — merge best parts)
**Gap:** No unified decision tree exists. Create a simple markdown flowchart.

### Step 4: First template walkthrough (120 seconds)
**Content:** Pick the Project Charter (Simple), fill in 5 fields, save — done.
**Source:** `quick-start-kits/first-time-pm-starter/project-charter-simple.md` (best beginner content)

Walkthrough:
1. Open `quick-start-kits/first-time-pm-starter/project-charter-simple.md`
2. Replace `[Project Name]` with your project name
3. Fill in the Objective (1 sentence)
4. List 3 key stakeholders
5. Set one milestone date
6. Save → you've created your first project artifact

**Existing content used:** `first-time-pm-starter/` kit + `docs/getting-started/tutorials/customize-project-charter.md`
**Gap:** Need to merge the simplified charter kit with the tutorial walkthrough into one seamless flow.

### Step 5: What next? (30 seconds)
**Content:** Three progressive paths based on experience level
**Source:** `docs/getting-started/progressive-complexity.md` (adapt)

- **Beginner:** Continue with the [First-Time PM Starter Kit](quick-start-kits/first-time-pm-starter/) — 9 simplified templates covering charter, risks, budget, status, and stakeholders
- **Intermediate:** Explore your [Role Toolkit](role-based-toolkits/) for comprehensive templates tailored to your position
- **Advanced:** Browse the [Template Index](TEMPLATE_INDEX.md) for the full collection of 154+ templates, or check [Industry Specializations](industry-specializations/) for your sector

**Existing content used:** Progressive complexity guide + role-based-toolkits/README.md Getting Started section
**Gap:** Need to write the "what next" section connecting these paths. Minor effort.

---

## 3. Content Gap Summary

| Step | Existing Content | Gap | Effort to Fill |
|------|-----------------|-----|---------------|
| 1. What is this? | README intro | Needs tightening, not rewriting | S |
| 2. How organized? | SYSTEM_ARCHITECTURE.md | None — Sprint 3 deliverable | None |
| 3. Find what you need | 2 methodology guides | Need merged decision tree | M |
| 4. First walkthrough | Charter template + tutorial | Need merged walkthrough | M |
| 5. What next? | Progressive complexity guide | Need connecting paths | S |

**Total new content needed:** ~2 pages of new writing + consolidation. Achievable in Sprint 5 Task #830.

## 4. Implementation Plan (for Sprint 5, Task #830)

Target file: `docs/getting-started/README.md` (overwrite current content)

Structure:
```
# Getting Started with PM Tools & Templates

## What is this? [Step 1]
## How it's organized [Step 2 — link to SYSTEM_ARCHITECTURE.md]
## Find what you need [Step 3 — decision tree]
## Your first template [Step 4 — charter walkthrough]
## What's next? [Step 5 — three paths]
```

README.md Quick Start section should link here:
```
## Quick Start
→ **[New here? Start the 5-minute Getting Started Guide](docs/getting-started/README.md)**
```
