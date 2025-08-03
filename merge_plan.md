# Merge Plan - pm-tools-templates

**Generated:** 2025-08-03T14:00:19Z  
**Repository:** https://github.com/mirichard/pm-tools-templates  
**Target Branch:** `main` (04168130)

## Executive Summary

- **Total Branches:** 24
- **Branches with Unique Commits:** 11
- **Clean Merges:** 5 branches
- **Conflict Resolution Required:** 3 branches
- **Archive/Delete Candidates:** 16 branches

## Phase 1: Clean Merges (Low Risk)

### Order: Least Overlapping First

#### 1.1 Documentation Fixes
```bash
# 1. Fix broken links
git checkout main
git merge origin/fix-broken-links-readme --no-ff -m "Merge: Fix broken internal links"

# 2. Program Manager README
git merge fix/add-program-manager-readme --no-ff -m "Merge: Add Program Manager toolkit documentation"
```

#### 1.2 Feature Branches (Sequential)
```bash
# 3. Status reporting workflow (HIGH PRIORITY)
git merge fix/status-reporting-20250722-125719 --no-ff -m "Merge: Production-ready status reporting workflow"

# 4. Executive dashboard enhancements
git merge feature/issue-327-executive-dashboard-enhancement --no-ff -m "Merge: Executive Dashboard Enhancement - Issue #327"

# 5. Test workflows
git merge test/monday-morning-email --no-ff -m "Merge: Monday morning email workflow tests"
```

**Validation Steps for Each Merge:**
- [ ] Run `git status` to confirm clean working directory
- [ ] Test build: `npm test` (if applicable)
- [ ] Check for broken links in documentation
- [ ] Verify workflow syntax: `yamllint .github/workflows/*.yml`

## Phase 2: Conflict Resolution (High Risk)

### 2.1 Develop Branch (CRITICAL)
**Conflicts:** `TemplateSelector.tsx`

```bash
# Pre-merge analysis
git checkout main
git merge develop --no-commit --no-ff

# Expected conflict in:
# PM Tools Templates - Q3 2025 Delivery Cycle/Implementation/template-selector/src/components/TemplateSelector.tsx

# Resolution strategy:
# 1. Keep main's version for stability
# 2. Manually integrate develop's accessibility improvements
# 3. Preserve React best practices
```

**Conflict Resolution Steps:**
1. **Backup current state**: `git stash push -m "Pre-merge backup"`
2. **Start merge**: `git merge develop --no-commit`
3. **Resolve conflicts**: 
   - Open `TemplateSelector.tsx` in editor
   - Keep main's structure
   - Integrate accessibility features from develop
   - Maintain React 18+ compatibility
4. **Test thoroughly**: Run full test suite
5. **Commit**: `git commit -m "Merge develop: Integrate accessibility improvements"`

### 2.2 Product Owner/Release Manager Epics
**Conflicts:** `README.md`, `ROADMAP.md`

```bash
# Documentation conflicts - lower risk
git merge feature/product-owner-release-manager-epics --no-commit --no-ff

# Resolution strategy:
# 1. Preserve main's current structure
# 2. Add new PM role templates
# 3. Update ROADMAP with new features
```

### 2.3 JSX Syntax Branch (COMPLEX)
**Conflicts:** Multiple React/JS files

```bash
# High complexity - consider selective cherry-picking
git log --oneline fix/jsx-syntax ^main

# Recommended approach:
# Cherry-pick specific commits rather than full merge
git cherry-pick 74d35b11  # Norman UI principles (most valuable)
git cherry-pick 6f51fc972  # TemplateSelector reset (if needed)
```

## Phase 3: Post-Merge Validation

### 3.1 Automated Tests
```bash
# Run comprehensive test suite
npm test
npm run lint
npm run build

# Security scanning
npm audit
git secrets --scan
```

### 3.2 Integration Verification
- [ ] All workflows execute successfully
- [ ] No broken internal links
- [ ] Documentation is consistent
- [ ] React components render without errors
- [ ] TypeScript compilation passes

## Phase 4: Branch Cleanup

### 4.1 Archive Branches (Keep Remotely)
```bash
# Create archive tags before deletion
git tag archive/codex-test-mvp-dashboard codex/test-mvp-dashboard
git tag archive/codex-review-roadmap origin/codex/review-roadmap.md-and-suggest-themes
git tag archive/r4rbdf-codex-dashboard origin/r4rbdf-codex/test-mvp-dashboard

# Push archive tags
git push origin --tags
```

### 4.2 Safe Deletion Candidates
```bash
# Delete superseded branches (LOCAL ONLY - requires approval)
git branch -d quickfix/readme-title-format
git branch -d feature/add-template-checklist
git branch -d feature/enhance-readme-badges
git branch -d feature/co-authored-enhancement
```

### 4.3 Remote Cleanup (REQUIRES APPROVAL)
```bash
# DO NOT RUN WITHOUT EXPLICIT APPROVAL
# git push origin --delete mirichard-patch-1
# git push origin --delete fix-broken-links-readme
```

## Rollback Plans

### Emergency Rollback
```bash
# If critical issues arise
git reset --hard HEAD~1  # Undo last merge
git push origin main --force-with-lease  # Only if absolutely necessary

# Alternative: Revert specific merge
git revert -m 1 <merge-commit-sha>
```

### Per-Phase Rollback
- **Phase 1**: `git reset --hard <commit-before-phase-1>`
- **Phase 2**: Individual merge reverts using `git revert -m 1`
- **Phase 3**: No rollback needed (validation only)
- **Phase 4**: `git tag` and `git branch` operations are reversible

## Risk Mitigation

### High-Risk Items
1. **`develop` branch**: Core functionality changes
2. **`fix/jsx-syntax`**: Major frontend modifications
3. **Force pushes**: Never use without explicit approval

### Safety Measures
- All operations logged in `warp_ai_audit.log`
- Backup tags created before any destructive operations
- Dry-run testing with `--no-commit` flags
- Incremental approach with validation between phases

## Success Criteria

- [ ] All unique commits preserved in main
- [ ] No functionality regression
- [ ] All tests pass
- [ ] Documentation is current and accurate
- [ ] Branch count reduced from 24 to ~8 active branches
- [ ] Clear audit trail maintained

## Timeline Estimate

- **Phase 1**: 30 minutes
- **Phase 2**: 2-3 hours (conflict resolution)
- **Phase 3**: 45 minutes (validation)
- **Phase 4**: 30 minutes (cleanup)
- **Total**: 4-5 hours

**Next Steps:** Proceed with Phase 1 (Clean Merges) and request approval before Phase 2 (Conflict Resolution).
