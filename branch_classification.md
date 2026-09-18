# Branch Classification - pm-tools-templates

**Generated:** 2025-08-03T14:00:19Z  
**Updated after merge-tree analysis**

## MERGEABLE (Clean Merge)

| Branch | Unique Commits | Risk Level | Notes |
|--------|---------------|------------|-------|
| `feature/issue-327-executive-dashboard-enhancement` | 5 | MEDIUM | Clean merge, executive dashboard features |
| `fix/status-reporting-20250722-125719` | 5 | HIGH | Clean merge, production-ready workflow |
| `feature/add-contributing-guide` | 0 | LOW | No unique commits, already in main |
| `fix/add-program-manager-readme` | 1 | LOW | Clean merge, documentation only |
| `origin/fix-broken-links-readme` | 1 | LOW | Clean merge, documentation fix |

## WIP-CONFLICT (Manual Resolution Required)

| Branch | Unique Commits | Conflict Files | Risk Level | Notes |
|--------|---------------|----------------|------------|-------|
| `develop` | 3 | TemplateSelector.tsx | HIGH | Main development branch, critical |
| `feature/product-owner-release-manager-epics` | 2 | README.md, ROADMAP.md | MEDIUM | Documentation conflicts |
| `fix/jsx-syntax` | 11 | Multiple React/JS files | HIGH | Major frontend changes |

## STALE (Inactive ≥180 days)

*None identified - all branches are recent (June-August 2025)*

## DUPLICATE/SUPERSEDED

| Branch | Status | Notes |
|--------|--------|-------|
| `quickfix/readme-title-format` | SUPERSEDED | Changes already in main via other merges |
| `origin/mirichard-patch-1` | SUPERSEDED | Quick README update, superseded |
| `feature/add-template-checklist` | SUPERSEDED | No unique commits remaining |
| `feature/enhance-readme-badges` | SUPERSEDED | Changes integrated via other branches |
| `feature/co-authored-enhancement` | SUPERSEDED | Changes integrated via other branches |

## TEST/EXPERIMENTAL

| Branch | Status | Action |
|--------|--------|--------|
| `test/monday-morning-email` | KEEP | 3 unique commits, workflow testing |
| `codex/test-mvp-dashboard` | ARCHIVE | Dashboard experiments, historical value |
| `origin/codex/review-roadmap.md-and-suggest-themes` | ARCHIVE | Automated dashboard updates |
| `origin/r4rbdf-codex/test-mvp-dashboard` | ARCHIVE | Dashboard preview experiments |

**Risk Assessment:**
- **HIGH RISK**: `develop`, `fix/jsx-syntax` (major conflicts)
- **MEDIUM RISK**: `feature/issue-327-executive-dashboard-enhancement`, `feature/product-owner-release-manager-epics`
- **LOW RISK**: Documentation and README branches
