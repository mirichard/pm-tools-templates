# Task #768: Value Delivery Flow Model

**Story:** #718 ([Mapping] – Value Flow Mapping – Input-Output-Outcome Alignment)
**Epic:** #707 (Epic 0: Repository Audit & Mapping)
**Date:** 2026-04-03
**Status:** Complete

---

## 1. Framework References

This model synthesizes concepts from:
- **PMBOK 7 (Chapter 2):** "A System for Value Delivery" — projects exist within a system that enables organizations to deliver value
- **MSP (Managing Successful Programmes):** Benefits management lifecycle — identifying, planning, delivering, and reviewing benefits
- **Lean Value Stream Mapping:** Flow of value from request to delivery, identifying waste and handoffs

## 2. The 4-Stage Value Delivery Flow Model

```
┌─────────┐    ┌─────────────┐    ┌──────────┐    ┌──────────┐
│  INPUTS  │ →  │  ACTIVITIES  │ →  │  OUTPUTS  │ →  │ OUTCOMES  │
│          │    │              │    │           │    │           │
│ What we  │    │ What we do   │    │ What we   │    │ What      │
│ gather   │    │ to transform │    │ produce   │    │ changes   │
│ & assess │    │ inputs       │    │ & deliver │    │ as a      │
│          │    │              │    │           │    │ result    │
└─────────┘    └─────────────┘    └──────────┘    └──────────┘
```

### Stage 1: INPUTS
**Definition:** Assets that help gather, organize, and assess the raw materials of project work — stakeholder needs, business context, requirements, constraints, and existing conditions.

**Entry criteria:** Project or initiative has been conceived; there is a need to understand the starting conditions.
**Exit criteria:** Sufficient understanding exists to plan and begin work.

**Characteristics:**
- Focused on understanding the current state
- Gather stakeholder needs, expectations, and constraints
- Assess feasibility, risk landscape, and organizational readiness
- Establish the "why" and "what" of the endeavor

**Example asset types:** Business cases, stakeholder registers, feasibility studies, current-state analysis templates, requirements documents, project charters (initiation aspect)

### Stage 2: ACTIVITIES
**Definition:** Assets that guide, structure, and support the execution of project work — planning, coordinating, building, and managing the transformation of inputs into deliverables.

**Entry criteria:** Inputs are sufficiently understood; the team is ready to plan or execute.
**Exit criteria:** Planned work is complete; deliverables are produced.

**Characteristics:**
- Focused on the "how" and "when"
- Structure work decomposition, scheduling, and resource allocation
- Guide team coordination, ceremonies, and daily execution
- Manage changes, risks, and issues during execution

**Example asset types:** Sprint planning templates, WBS, project management plans, risk management plans, communication plans, change control templates, daily standup guides

### Stage 3: OUTPUTS
**Definition:** Assets that produce, format, and deliver the tangible deliverables and reports of project work — status reports, dashboards, documentation, and handoff artifacts.

**Entry criteria:** Activities are generating results that need to be communicated or delivered.
**Exit criteria:** Deliverables are accepted; stakeholders have received the information they need.

**Characteristics:**
- Focused on what gets delivered and communicated
- Generate reports, dashboards, and status updates
- Package deliverables for stakeholder consumption
- Document decisions, approvals, and formal records

**Example asset types:** Status report templates, executive dashboards, project closure reports, lessons learned documents, handover templates, meeting minutes templates

### Stage 4: OUTCOMES
**Definition:** Assets that track, measure, and validate whether project outputs actually delivered the intended business value — benefits realization, ROI tracking, and continuous improvement.

**Entry criteria:** Outputs have been delivered; sufficient time has passed to measure impact.
**Exit criteria:** Business value is confirmed, documented, and fed back into organizational learning.

**Characteristics:**
- Focused on "did it matter?" and "what did we learn?"
- Track benefits realization against original business case
- Measure ROI, value delivered, and strategic alignment
- Feed lessons learned back into organizational capability

**Example asset types:** Benefits realization trackers, ROI dashboards, value stream analysis, project health assessments, process maturity assessments, retrospective templates (improvement aspect)

---

## 3. Asset Classification Categories

Each asset maps to exactly one **primary** value flow category. Assets that serve multiple stages get a primary assignment based on their dominant purpose, plus optional secondary assignments.

### Category Definitions

| Category | Stage | Definition | Tag Indicators |
|----------|-------|------------|---------------|
| `input-enabler` | Inputs | Gathers, organizes, or assesses starting conditions | `stakeholder-management` (alone), `planning` (when assessment-focused) |
| `activity-support` | Activities | Guides, structures, or coordinates execution work | `planning`, `agile`, `scrum`, `traditional`, `hybrid`, `communication` (when process-focused) |
| `output-generator` | Outputs | Produces deliverables, reports, or documentation | `monitoring`, `communication` (when reporting-focused), `quality` (when deliverable-focused) |
| `outcome-tracker` | Outcomes | Measures value, tracks benefits, drives improvement | `finance`, `quality` (when assessment-focused) |

### Tag-to-Category Mapping Rules

These rules enable automated draft mapping via `templates.json` tags:

```
PRIMARY MAPPINGS (highest-priority tag wins):
  finance                    → outcome-tracker
  healthcare                 → activity-support (domain-specific execution guidance)
  agile, scrum, kanban       → activity-support
  traditional, hybrid        → activity-support
  monitoring                 → output-generator

SECONDARY/CONTEXT MAPPINGS (apply when primary is ambiguous):
  planning + risk-management → activity-support
  planning + stakeholder-management (no execution tags) → input-enabler
  quality + monitoring       → output-generator
  quality + no monitoring    → outcome-tracker
  communication + monitoring → output-generator
  communication + planning   → activity-support
  stakeholder-management + communication + no planning → output-generator

DEFAULT:
  If no primary rule matches → activity-support (most common category)
```

### Handling Multi-Stage Assets

Some assets naturally span stages:
- **Project Charter** → Primary: `input-enabler` (defines project context), Secondary: `activity-support` (authorizes work)
- **Risk Register** → Primary: `activity-support` (manages risks during execution), Secondary: `input-enabler` (initial risk assessment)
- **Retrospective Template** → Primary: `outcome-tracker` (drives improvement), Secondary: `output-generator` (produces lessons learned)

**Rule:** Assign based on the asset's **primary use context**. If a PM picks up this template, what are they most likely trying to accomplish?

### Edge Cases

| Asset Type | Classification | Rationale |
|-----------|---------------|-----------|
| Meta-assets (scripts, schemas) | `activity-support` | They support the execution of template management work |
| Framework docs (methodology guides) | `activity-support` | They guide how work is performed |
| Index/navigation files | Excluded | Infrastructure, not value-delivery assets |
| Integration guides | `activity-support` | They enable tool-supported execution |
| Industry templates | Inherit from content | A pharma risk register is still `activity-support` |

---

## 4. Flow Visualization

```
INPUTS                    ACTIVITIES                 OUTPUTS                   OUTCOMES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Business Case         →   Project Mgmt Plan      →   Status Reports        →   Benefits Register
Stakeholder Register  →   Sprint Planning        →   Executive Dashboard   →   ROI Dashboard
Feasibility Study     →   Risk Mgmt Plan         →   Closure Report        →   Value Stream Analysis
Current State Analysis→   Change Control         →   Lessons Learned Doc   →   Maturity Assessment
Requirements Doc      →   Communication Plan     →   Handover Package      →   Health Assessment
Project Charter       →   WBS / Backlog          →   Meeting Minutes       →   Retrospective (improve)
```

---

## 5. Relationship to Performance Domains

The value flow is **orthogonal** to performance domains — any domain can appear at any stage:

| Domain \ Stage | Inputs | Activities | Outputs | Outcomes |
|---------------|--------|------------|---------|----------|
| Stakeholder | Stakeholder register | Communication plan | Status reports | Satisfaction surveys |
| Team | Skills matrix | Team charter, standups | Team performance report | Retrospective |
| Delivery | Requirements | Sprint/iteration plans | Deliverables | Value realization |
| Planning | Business case | PM plan, schedule | Plan updates | Plan accuracy metrics |
| Uncertainty | Risk assessment | Risk response plans | Risk reports | Risk trend analysis |
| Measurement | Baseline metrics | KPI tracking setup | Dashboards | Outcome measurement |
