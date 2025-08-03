# Branch Deletion Candidates - pm-tools-templates

**Generated:** 2025-08-03T15:48:00Z (Resolved conflict between reports)  
**⚠️ REQUIRES EXPLICIT APPROVAL BEFORE ANY DELETIONS**

## Safe for Deletion (No Unique Commits)

### Local Branches
| Branch | Status | Reason | Command |
|--------|---------|---------|---------|
| `feature/add-contributing-guide` | SAFE | No unique commits, already in main | `git branch -d feature/add-contributing-guide` |
| `feature/add-template-checklist` | SAFE | No unique commits, superseded | `git branch -d feature/add-template-checklist` |
| `feature/enhance-readme-badges` | SAFE | Changes integrated via other branches | `git branch -d feature/enhance-readme-badges` |
| `feature/co-authored-enhancement` | SAFE | Changes integrated via other branches | `git branch -d feature/co-authored-enhancement` |
| `quickfix/readme-title-format` | SAFE | Changes superseded in main | `git branch -d quickfix/readme-title-format` |

### Remote Branches (Requires Push Permission)
| Branch | Status | Reason | Command |
|--------|--------|--------|---------|
| `origin/mirichard-patch-1` | SAFE | Quick README update, superseded | `git push origin --delete mirichard-patch-1` |
| `origin/codex/review-roadmap.md-and-suggest-themes` | SAFE | All automated dashboard updates already merged | `git push origin --delete codex/review-roadmap.md-and-suggest-themes` |
| `origin/codex/test-mvp-dashboard` | SAFE | Experimental dashboard work, already integrated | `git push origin --delete codex/test-mvp-dashboard` |

## Archive Before Deletion (Historical Value)

### Experimental/Test Branches
| Branch | Action | Archive Tag | Reason |
|--------|--------|-------------|--------|
| `codex/test-mvp-dashboard` | Archive → Delete | `archive/codex-test-mvp-dashboard` | Dashboard experiments, keep for reference |
| `origin/codex/review-roadmap.md-and-suggest-themes` | Archive → Delete | `archive/codex-review-roadmap` | Automated dashboard updates |
| `origin/r4rbdf-codex/test-mvp-dashboard` | Archive → Delete | `archive/r4rbdf-codex-dashboard` | Dashboard preview experiments |

**Archive Commands:**
```bash
# Create archive tags
git tag archive/codex-test-mvp-dashboard codex/test-mvp-dashboard
git tag archive/codex-review-roadmap origin/codex/review-roadmap.md-and-suggest-themes
git tag archive/r4rbdf-codex-dashboard origin/r4rbdf-codex/test-mvp-dashboard

# Push tags to preserve history
git push origin --tags

# Then delete branches (requires approval)
git branch -d codex/test-mvp-dashboard
git push origin --delete codex/review-roadmap.md-and-suggest-themes
git push origin --delete r4rbdf-codex/test-mvp-dashboard
```

## Keep Active (Contains Unique Commits)

### Must Preserve Until Merged
| Branch | Unique Commits | Reason | Action Required |
|--------|---------------|--------|-----------------|
| `develop` | 3 | Main development branch | **MERGE FIRST** |
| `feature/issue-327-executive-dashboard-enhancement` | 5 | Executive dashboard features | **MERGE FIRST** |
| `feature/product-owner-release-manager-epics` | 2 | PM role templates | **MERGE FIRST** |
| `fix/jsx-syntax` | 11 | Major frontend changes | **MERGE FIRST** |
| `fix/status-reporting-20250722-125719` | 5 | Production workflow | **MERGE FIRST** |
| `fix/add-program-manager-readme` | 1 | Documentation | **MERGE FIRST** |
| `test/monday-morning-email` | 3 | Workflow testing | **MERGE FIRST** |
| `origin/fix-broken-links-readme` | 1 | Link fixes | **MERGE FIRST** |
| `staging` | 0 | Staging environment | **KEEP ACTIVE** |

## Post-Merge Deletion Plan

### After Successful Merges
Once all unique commits are successfully merged into `main`, the following branches become safe for deletion:

```bash
# Phase 1: After clean merges
git branch -d fix/add-program-manager-readme
git branch -d test/monday-morning-email
git push origin --delete fix-broken-links-readme

# Phase 2: After conflict resolution
git branch -d develop  # Only after successful merge
git branch -d feature/issue-327-executive-dashboard-enhancement
git branch -d feature/product-owner-release-manager-epics
git branch -d fix/jsx-syntax
git branch -d fix/status-reporting-20250722-125719
```

## Safety Checklist

Before any deletion, verify:
- [ ] Branch has been successfully merged to main
- [ ] All unique commits are confirmed in main branch
- [ ] No open pull requests reference the branch
- [ ] Archive tags created for historical branches
- [ ] Team notification sent (if applicable)
- [ ] Backup created if branch has experimental value

## Verification Commands

Before deletion, double-check each branch:

```bash
# Verify no unique commits exist
git cherry -v origin/main origin/codex/review-roadmap.md-and-suggest-themes
git cherry -v origin/main origin/codex/test-mvp-dashboard  
git cherry -v origin/main origin/feature/add-contributing-guide
```

Expected output: *empty* (no lines) indicating no unique commits.

## Zip Archive Fallback

For maximum safety, create zip archives of important branches:

```bash
# Create zip archives for safety
git archive --format=zip --output=backup-develop-$(date +%Y%m%d).zip develop
git archive --format=zip --output=backup-jsx-syntax-$(date +%Y%m%d).zip fix/jsx-syntax
git archive --format=zip --output=backup-executive-dashboard-$(date +%Y%m%d).zip feature/issue-327-executive-dashboard-enhancement
```

## Deletion Statistics

- **Total Branches:** 24
- **Safe for Immediate Deletion:** 8
- **Archive Then Delete:** 3  
- **Must Merge First:** 8
- **Keep Active:** 5

**Branch Reduction:** 24 → 5 active branches (79% reduction)

## ⚠️ CRITICAL WARNINGS

1. **Never delete without explicit approval**
2. **Always verify commit preservation in main**
3. **Create backups for any experimental work**
4. **Test functionality after each deletion batch**
5. **Document all deletion decisions in audit log**

**Status:** READY FOR REVIEW - No deletions will be performed without explicit maintainer approval.
