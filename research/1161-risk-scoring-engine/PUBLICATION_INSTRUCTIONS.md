# Publication Instructions for Issue #1161 Research PR

**Prepared:** 2026-09-29  
**Status:** Ready for draft PR publication  
**Base Branch:** main  
**PR Type:** Documentation-only (no code changes)

---

## Files Included in This Package

This research package contains **three comprehensive analysis documents** (1,107 lines total):

1. **README.md** (294 lines)
   - Executive summary, disposition recommendation
   - Sprint 3 readiness checklist
   - Key repo owner decisions needed
   - What changed from historical proposal

2. **evidence.md** (114 lines)
   - Detailed audit of 12 historical spike claims
   - Repository risk resource inventory
   - Paper search results
   - Standards research findings
   - Alternatives comparison
   - Blockers and unresolved gaps

3. **scope-and-acceptance.md** (699 lines)
   - Two detailed user journey scenarios (tech & non-tech projects)
   - Input dictionary with field definitions
   - Proposed scoring contract
   - Four draft implementation stories
   - Evaluation and acceptance plan
   - Dependencies and effort drivers

---

## Publication Steps

### Step 1: Create Branch

```bash
cd /workspaces/pm-tools-templates
git checkout main
git pull origin main
git checkout -b research/1161-risk-register
```

### Step 2: Copy Files

```bash
mkdir -p research/1161-risk-register
cp /tmp/pr-research-1161/*.md research/1161-risk-register/

# Verify
ls -la research/1161-risk-register/
# Expected: README.md, evidence.md, scope-and-acceptance.md
```

### Step 3: Validate Markdown

```bash
# Check for markdown errors
npm run test:markdown -- research/1161-risk-register/*.md

# If no markdown linter, validate manually:
# - No broken links
# - Tables format correctly
# - Code blocks properly closed
# - Headers hierarchy consistent
```

**Expected:** No errors (files are pre-validated)

### Step 4: Verify Links

```bash
# Check all markdown links in these files
python3 check_anchor_links_filtered.py research/1161-risk-register/

# Expected: All links valid (using GitHub URLs to issues #1107, #1160, #1162)
```

### Step 5: Commit

```bash
git add research/1161-risk-register/
git commit -m "docs(research): Issue #1161 Sprint 3 readiness analysis

- Add comprehensive evidence audit of historical spike claims
- Document repository risk management resource inventory
- Define user journey, input dictionary, and assessment contract
- Draft four implementation stories with acceptance criteria
- Present three disposition options for repo owner decision
- Identify critical blockers: paper access, formula clarification, scope definition

Related to #1161
Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Step 6: Create Pull Request

```bash
git push -u origin research/1161-risk-register

# Via GitHub CLI:
gh pr create \
  --title "Research: Issue #1161 Sprint 3 Readiness Analysis" \
  --body "## Research Package

This PR contains a comprehensive readiness analysis for issue #1161 (Risk register with deterministic scoring engine), prepared for Sprint 3 consideration.

### Contents
- Audit of historical spike claims (12 claims; most unverified or contradicted)
- Repository inventory of 25+ existing risk management resources
- User journey and input specification for two project domains
- Proposed assessment contract with scoring formula
- Four draft implementation stories with acceptance criteria
- Evaluation plan for measuring user usefulness and impact

### Key Findings
- Source paper (Geamanu et al., Dec 2025) not accessible; cannot verify 27-variable taxonomy
- Existing templates are mature; gap is deterministic scoring with modifiers
- Historical claims mostly unverified; formula contradictions identified
- Value proposition is reasonable but uncertain; needs validation

### Recommendation
**Conditional Readiness:** Can proceed to implementation IF:
1. Repo owner decides: Paper access or custom taxonomy?
2. Repo owner clarifies: Formula conversion and threshold conflicts
3. Repo owner defines: MVP scope (template only, or template+engine?)
4. Blockers resolved: Dependencies on #1160/#1162?

### Next Steps
1. Repo owner review and decision on blockers (2-3 days)
2. If greenlit: Analysis completes stories/evaluation plan (3-5 days)
3. Implementation decision: Template (2-3 FTE-weeks) or template+engine (5-10 FTE-weeks)

**Status:** Ready for repo owner review; not sprint authorization" \
  --draft \
  --label "research" \
  --label "candidate" \
  --related-to 1161
```

### Step 7: Add Proposed Issue Comment

**Draft comment for repo owner to post on #1161 when ready:**

```markdown
## Sprint 3 Readiness Analysis Complete (2026-09-29)

Research analysis for this candidate has been completed and is available in pull request [#XXXX](https://github.com/mirichard/pm-tools-templates/pull/XXXX).

### Key Findings

**What Works:**
- Repository has 25+ risk management resources; gap is deterministic scoring with modifiers
- Value proposition is clear: improve consistency and cross-project comparison
- User journey defined for two project types (tech and non-tech)
- Scope can be bounded: MVP = template+spreadsheet calculator (2-3 FTE-weeks)

**What Needs Decision:**
1. **Paper access:** Geamanu et al. paper (Dec 2025) not located
   - Option A: Authorize custom taxonomy based on existing templates (RECOMMENDED)
   - Option B: Require paper access before proceeding
   
2. **Formula clarification:** Examples contradict stated ranges
   - Mitigation factor stated 0.5-1.0; examples use 0.28, 0.145
   - Risk #2 score 10.08 labeled HIGH; threshold says 12+ is HIGH
   - **Action:** Correct examples or adjust thresholds

3. **MVP scope:** Template only, or template+engine?
   - Option A (RECOMMENDED): Template+spreadsheet calculator (2-3 FTE-weeks, 80% value)
   - Option B: Template+CLI tool (5-10 FTE-weeks, incremental value)

4. **Dependencies:** Verify #1160 and #1162 status
   - Spike claims this depends on those issues; need confirmation

### Historical Spike Claims Status
- ✓ PMBOK risk matrix concept: Valid (existing repo uses 5×5)
- ✗ Formula examples: Contradicted (ranges don't match examples)
- ✗ Expert consensus: Unverified (no experts named or documented)
- ✗ 80-85% accuracy: Unverified (no measurement method provided)
- ✗ Geamanu paper: NOT FOUND (cannot verify taxonomy or licensing)
- ✗ ML upgrade path: Out of scope (current issue restricts to deterministic rules)

### Recommendation
**Conditional Go for Sprint 3** if:
- Repo owner decides on blockers above (2-3 days)
- Resource (2-3 FTE-weeks for MVP) is available
- User value justifies effort (consistency improvement proven useful)

**OR**

**Recommend Deferral** if:
- Paper must be accessed and licensing requires negotiation
- Scope cannot be bounded below 5 FTE-weeks
- #1160/#1162 dependencies genuinely block this work
- Sprint 3 capacity is insufficient

### Next Steps
1. Repo owner reviews research PR and provides decisions on blockers
2. If proceeding: Complete user stories and acceptance criteria (~3-5 days)
3. Implementation planning: Schedule for Sprint 3 or later sprint

Full analysis available in PR #XXXX; see README.md for executive summary.
```

---

## Markdown Validation Checklist

Use this checklist to verify files before merging PR:

- [ ] All file paths in this README are relative and correct
- [ ] All markdown tables render without errors
- [ ] All code blocks are properly closed with ```
- [ ] All headers use consistent hierarchy (no skipped levels)
- [ ] All links to GitHub issues (#1107, #1160, #1162, #1161) are formatted correctly
- [ ] No broken internal links (links to files in repo)
- [ ] No leftover editing marks or TODOs
- [ ] Spelling and grammar reviewed (at least skim for obvious errors)
- [ ] Line length reasonable (no excessively long lines >120 chars recommended)

## File Locations Reference

After publication, files will be located at:
- `research/1161-risk-register/README.md`
- `research/1161-risk-register/evidence.md`
- `research/1161-risk-register/scope-and-acceptance.md`

Link in comments/documentation:
```markdown
[Issue #1161 Research](research/1161-risk-register/README.md)
[Evidence Audit](research/1161-risk-register/evidence.md)
[Scope & Acceptance](research/1161-risk-register/scope-and-acceptance.md)
```

---

## Success Criteria for Publication

✓ Files in PR pass markdown validation  
✓ All GitHub issue links (#1107, #1160, #1162, #1161) resolved correctly  
✓ No conflicts with existing repository structure  
✓ PR title references #1161 with "Related to" (not "Fixes" or "Closes")  
✓ PR marked as DRAFT (not auto-merged)  
✓ PR description includes summary of findings and key decisions needed  
✓ PR is ready for repo owner review within 1-2 business days  

---

## If Questions Arise During Publication

**Markdown rendering issues?**
- Check file encoding (UTF-8)
- Verify table pipe alignment (| per column)
- Ensure code blocks close properly (``` on own line)

**GitHub link issues?**
- Verify issue numbers (#1107, #1160, #1162) are publicly accessible
- Check that repository owner is mirichard/pm-tools-templates

**File location issues?**
- `research/` directory should be created if it doesn't exist
- Use lowercase: `research/1161-risk-register/` (not `Research/`)

**Permission issues?**
- Branch should be writable to current user
- Branch name follows pattern: `research/<issue-number>-<topic>`

---

**Document prepared by:** Product discovery analyst  
**Date:** 2026-09-29  
**Ready for publication:** YES  
**Expected PR review time:** 2-3 business days
