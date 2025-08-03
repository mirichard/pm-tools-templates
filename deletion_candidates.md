# Deletion Candidates Report

**Generated:** 2025-08-03T14:58:56Z  
**Repository:** mirichard/pm-tools-templates  

## Branches with No Unique Commits (Safe to Delete)

These branches have been analyzed and contain no commits that are not already in `origin/main`:

### 1. origin/codex/review-roadmap.md-and-suggest-themes
- **Last Commit**: 2025-06-28 21:06:48 +0000
- **Author**: Dashboard Generator  
- **Age**: 36 days
- **Unique Commits**: 0
- **Reason**: All automated dashboard updates already merged

### 2. origin/codex/test-mvp-dashboard  
- **Last Commit**: 2025-06-29 20:08:21 -0400
- **Author**: Michael Richard
- **Age**: 35 days  
- **Unique Commits**: 0
- **Reason**: Experimental dashboard work, already integrated

### 3. origin/feature/add-contributing-guide
- **Last Commit**: 2025-06-08 14:41:37 -0400
- **Author**: Michael Richard
- **Age**: 56 days
- **Unique Commits**: 0
- **Reason**: CONTRIBUTING.md changes already in main

### 4. origin/staging (Special Case)
- **Status**: Protected branch - KEEP
- **Reason**: Pre-production deployment branch
- **Unique Commits**: 0 (by design)

## Verification Commands

Before deletion, double-check each branch:

```bash
# Verify no unique commits exist
git cherry -v origin/main origin/codex/review-roadmap.md-and-suggest-themes
git cherry -v origin/main origin/codex/test-mvp-dashboard  
git cherry -v origin/main origin/feature/add-contributing-guide
```

Expected output: *empty* (no lines) indicating no unique commits.

## Archive Strategy

Before deletion, create archive tags:

```bash
git tag archive/codex-review-roadmap origin/codex/review-roadmap.md-and-suggest-themes
git tag archive/codex-test-mvp-dashboard origin/codex/test-mvp-dashboard
git tag archive/feature-add-contributing-guide origin/feature/add-contributing-guide
git push origin --tags
```

## Deletion Commands (REQUIRES APPROVAL)

**⚠️ DO NOT EXECUTE WITHOUT EXPLICIT APPROVAL ⚠️**

```bash
# Delete remote branches
git push origin --delete codex/review-roadmap.md-and-suggest-themes
git push origin --delete codex/test-mvp-dashboard
git push origin --delete feature/add-contributing-guide
```

## Summary

- **Total candidates**: 3 branches
- **Archive tags**: 3 to be created
- **Storage impact**: Minimal (no unique commits)
- **Risk level**: Zero (verified no unique commits)

All candidate branches have been double-checked for unique commits and confirmed safe for deletion.
