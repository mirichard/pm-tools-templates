# Issues Management Guide

## Current classification policy

Every open issue must have exactly one approved `type:*` label. The definitions
live in [issue-types.json](../.github/issue-types.json). Other labels describe
priority, status, topic or compatibility; they do not replace the type.

| Label | Purpose | Title convention |
| --- | --- | --- |
| `type:epic` | Coordinated outcome delivered through related work | `EPIC:` |
| `type:story` | Bounded user outcome with acceptance criteria | `Story:` |
| `type:task` | Concrete implementation or maintenance activity | `Task:` |
| `type:bug` | Defect in existing behavior | `Bug:` |
| `type:spike` | Timeboxed investigation supporting a decision | `Spike:` |
| `type:candidate` | Uncommitted proposal requiring evaluation | Existing proposal prefixes are supported |
| `type:operational` | Ongoing report, monitoring alert or administrative record | Preserve titles used by automation |

Use the [issue chooser](https://github.com/mirichard/pm-tools-templates/issues/new/choose).
Bug forms assign `type:bug`; proposals, enhancement requests and contributions
start as `type:candidate`; template ratings are operational feedback records.
Epic, Story, Task and Spike forms support planned work. A new candidate does not
become a delivery commitment merely because it has a type.

Templates retain legacy and topical labels consumed by existing workflows.
Maintainers should keep title prefixes consistent when reclassifying work, but
the validator uses labels as its authority and does not rename issues.

## Validation and triage

The Issue type validation workflow checks opened, reopened, labeled and unlabeled
issues. A daily paginated sweep covers missed events and issues created with
`GITHUB_TOKEN`, which do not trigger a second issue workflow. Known automated
creators supply `type:operational` directly. Confirmed remediation work can be
filed separately as a Bug or Task and linked to the originating report.

Missing, multiple or unrecognized type labels receive `needs-type` and a single
bot comment. Correct the labels to resolve the flag; the same comment is updated.
The validator never selects a type from free text, replaces a parent, closes an
issue, assigns a priority, or changes a project status. A successful workflow run
means validation executed; consult its summary and the `needs-type` queue for
outstanding gaps. API failures fail the run.

```bash
# Review issues requiring classification
gh issue list --repo mirichard/pm-tools-templates --label needs-type

# Create an issue through the CLI with an explicit type
gh issue create --repo mirichard/pm-tools-templates \
  --title 'Task: Describe the work' --label type:task --body-file issue.md
```

Changing types requires removing the old `type:*` label and adding the new one.
Unknown or conflicting types require maintainer judgment; the bot does not guess.
Blank intake is disabled for general contributors, but maintainers and API clients
can bypass forms. This is validation after creation, not a server-side creation
restriction.

Before selecting an issue for delivery, maintainers verify its type, scope,
acceptance criteria and dependencies. Establish and verify a native parent
relationship where appropriate, or document why the issue is standalone.
A parent URL in a form does not create a native relationship. Classification and
parentage do not set priority or schedule work. Readiness is a **manual review
requirement**; this workflow does not enforce GitHub Project status transitions.

## Maintenance and rollout

Run `node --test tests/issue-types.test.cjs tests/template-analytics.test.cjs`.
CI checks the validator behavior, intake type coverage and the known automated
creator syntax. Extend those checks when introducing a new creation mechanism;
static checks are not a universal parser of arbitrary API clients.

After merging to the default branch, run **Issue type validation** manually with
`preview: true` to inspect the full backlog, then `preview: false` to reconcile it.
Event and scheduled runs reconcile automatically once merged. Reconciliation
creates missing approved labels and `needs-type`, without overwriting existing
label descriptions or colors. Template labels must already exist to be applied
at issue creation. The approved type labels were established during backlog
cleanup; bootstrap also supports recovery if any are removed.

Workflow changes are tested on pull requests without issue-write permissions.
The mutation workflow checks out only the default branch, accepts issue content
as data, and serializes its own runs. GitHub may replace pending concurrency runs;
the daily sweep provides eventual reconciliation. Concurrent manual edits can
also require a subsequent event or sweep.

References: [issue form syntax](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms),
[template configuration](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository),
and [workflow triggering](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow).

## Historical issue inventory — June 17, 2025

The material below is an archived snapshot, not current classifications,
commitments, completion evidence or creation guidance. It is not automatically
updated. Use the policy above, current GitHub issues and [ROADMAP.md](../ROADMAP.md)
for current decisions. Historical phase and priority labels are not required.

---


**Comprehensive project management for PM Tools Templates repository**

## Overview

This document provides a complete view of all issues in the PM Tools Templates repository, organized by type and priority. All strategic issues are tagged with the `strategic` label for easy filtering.

### 📊 Remote Repository Status (GitHub)
- **Total Issues:** 66 issues
- **Open Issues:** 28 
- **Closed Issues:** 38
- **Strategic Issues:** 29 (44% of total)
- **Last Updated:** June 17, 2025

---

## 🚀 Strategic Issues (Roadmap Implementation)

### Filter Command
```bash
gh issue list --label "strategic" --state all
```

### Phase 1: Foundation Enhancements (Mostly Complete)
- **#14:** 🚀 [Phase 1.1] Interactive Template Generator CLI
- **#15:** ⚡ [Phase 1.2] GitHub Actions Workflow Library  
- **#16:** 🔗 [Phase 1.3] Enhanced Tool Integrations
- **#17:** 📊 [Phase 1.4] Project Health Dashboard MVP
- **#18:** 📚 [Phase 1.5] Documentation Enhancement
- **#41:** Core Program Manager Toolkit Development
- **#42:** Portfolio Management Suite
- **#43:** Benefits Realization Management Suite
- **#44:** Program Lifecycle Templates  
- **#45:** Advanced Program Communication and Integration
- **#46:** Methodology-Specific Program Templates
- **#47:** EPIC: Program Management Template Suite Implementation

### Phase 2: Capability Expansion (Current Focus)
- **#19:** 🧠 [Phase 2.1] AI-Powered Project Insights
- **#20:** 🔄 [Phase 2.2] Advanced Workflow Orchestration
- **#49:** Product Owner Role Template Suite
- **#50:** Release Manager Role Template Suite
- **#57:** Design Thinking Integration ✅ **COMPLETED**
- **#58:** Lean Startup Templates
- **#59:** Power Automate Integration Templates
- **#60:** Zapier Workflow Templates
- **#61:** API Framework for Template Connectivity
- **#62:** Advanced Excel Automation Templates
- **#63:** Community Contribution Platform
- **#64:** Industry-Specific Adaptation Guidelines

### Phase 3: Ecosystem Enhancements (Future)
- **#21:** 🏪 [Phase 3.1] Template Marketplace
- **#22:** 🎓 [Phase 3.2] Certification & Training Program

### Phase 4: Security & Maintenance (Ongoing)
- **#65:** 🔐 SECURITY: Enable Signed Commits for Team Members
- **#66:** 🔐 SECURITY: Implement Security Monitoring and Dependency Management

### Master Epic
- **#23:** 🚀 [EPIC] PM Tools Templates Enhancement Roadmap

---

## 🔧 Operational Issues

### Bug Fixes
- **#51:** Fix 404 error for program-manager directory
- **#52:** Fix 404 error for project-manager directory
- **#34:** Fix typo in main README title

### Documentation & Process
- **#28:** Add GitHub Actions workflow for automated testing
- **#29:** Create CONTRIBUTING.md guide for community contributions

### Legacy Template Development (Pre-Strategic Planning)
- **#1:** Traditional: Core Process Groups Templates
- **#2:** Agile: Scrum Artifacts and Ceremonies Templates  
- **#3:** Hybrid: Framework Templates and Guidelines
- **#4:** Repository Setup and Configuration Tasks
- **#5:** Create Implementation Guides for All Methodologies
- **#6:** Develop Industry-Specific Template Variations
- **#7:** Create Best Practices Documentation
- **#8:** Develop Template Integration Guides
- **#9:** Create Organization Change Management Framework
- **#10:** Create User Acceptance Testing Framework and Templates
- **#11:** Create Transition to Operations Framework and Templates
- **#12:** Create Remaining Traditional Process Groups
- **#13:** Create PM templates that integrate with Github projects for Agile, Traditional and Hybrid methodologies

---

## 📊 Issue Management Commands

### View All Strategic Issues
```bash
gh issue list --label "strategic" --state all
```

### View Issues by Phase
```bash
# Phase 1 Issues
gh issue list --label "phase-1" --state all

# Phase 2 Issues  
gh issue list --label "phase-2" --state all

# Phase 3 Issues
gh issue list --label "phase-3" --state all
```

### View Issues by Priority
```bash
# High Priority
gh issue list --label "high-priority" --state all

# Medium Priority
gh issue list --label "medium-priority" --state all
```

### View Issues by Type
```bash
# Enhancement Issues
gh issue list --label "enhancement" --state all

# Bug Issues
gh issue list --label "bug" --state all

# Epic Issues
gh issue list --label "epic" --state all
```

### View Security Issues
```bash
gh issue list --search "SECURITY" --state all
```

---

## 🎯 Current Priorities

### Immediate Focus (Q3 2025)
1. **Complete Phase 2 Issues** - Focus on capabilities expansion
2. **Address Security Issues** - Implement #65 and #66 
3. **Fix Outstanding Bugs** - Resolve #51, #52
4. **Community Platform** - Establish #63

### Medium Term (Q4 2025)
1. **API Framework** - Issue #61 foundation for integrations
2. **Role-Based Suites** - Complete #49, #50
3. **Automation Templates** - Finish #59, #60, #62

### Long Term (2026)
1. **Phase 3 Initiatives** - Marketplace and certification programs
2. **Advanced Features** - AI insights, cloud platforms
3. **Partnership Programs** - Professional certifications

---

## 📋 Issue Creation Guidelines

### Strategic Issues
- Must be tagged with `strategic` label
- Should reference strategic roadmap
- Include phase assignment (phase-1, phase-2, phase-3)
- Set appropriate priority level
- Link to milestone when available

### Standard Issues
- Use clear, descriptive titles
- Include acceptance criteria
- Add relevant labels (bug, enhancement, documentation)
- Reference related issues
- Estimate effort when possible

### Security Issues
- Prefix title with 🔐 SECURITY:
- Mark as high priority
- Include security implications
- Reference compliance requirements

---

## 🔗 Related Documentation

- **Strategic Roadmap:** [`ROADMAP.md`](../ROADMAP.md)
- **Contributing Guide:** [`CONTRIBUTING.md`](../CONTRIBUTING.md)
- **Implementation Status:** [`IMPLEMENTATION_STATUS.md`](../IMPLEMENTATION_STATUS.md)
- **Repository Status:** [`REPOSITORY_STATUS.md`](../REPOSITORY_STATUS.md)

---

## 📈 Progress Tracking

### Completion Statistics
- **Total Issues:** 66 (28 open + 38 closed)
- **Open Issues:** 28
- **Closed Issues:** 38
- **Strategic Issues:** 29 total (28 open + 1 closed)
- **Strategic Completion Rate:** 3% (1/29)

### Issues by Phase (Open)
- **Phase 1 Issues:** 12 open
- **Phase 2 Issues:** 12 open  
- **Phase 3 Issues:** 1 open
- **Phase 4 Security Issues:** 2 open
- **Master Epic:** 1 open

### Issues by Priority (Open)
- **High Priority:** 18 issues
- **Medium Priority:** 10 issues
- **No Priority Assigned:** 0 issues

### Issues by Type (Open)
- **Enhancement Issues:** 25
- **Bug Issues:** 2
- **Documentation Issues:** 1
- **Strategic Issues:** 28

---

*This document is automatically updated as issues are created, modified, or completed. For real-time status, use the GitHub CLI commands provided above.*

