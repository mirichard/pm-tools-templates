# CONTINUATION — issue #1161 research correction

## Objective and boundaries
- Objective: produce a narrowly scoped replacement draft research PR that corrects research quality issues from #1412 and supports a repo-owner decision on #1161.
- In scope: research documents under `research/1161-risk-scoring-engine/` only.
- Out of scope: product implementation, ML buildout, dependency/CI/app changes, merge/close actions, sprint/release commitments.
- Decision authority remains with repo owner.

## Links
- Issue: https://github.com/mirichard/pm-tools-templates/issues/1161
- Original draft PR (preserved): https://github.com/mirichard/pm-tools-templates/pull/1412
- Replacement draft PR: https://github.com/mirichard/pm-tools-templates/pull/1413

## Source and base revisions
- Verified source revision: `4751154c6c1ab7a18741534b4ef9d8b7a452ac53`
- Current `origin/main` used for clean base: `12784bd89f21fcbcc6fb91322fd3e324dd0b8b04`
- #1412 live head at start of this run: `4751154c6c1ab7a18741534b4ef9d8b7a452ac53`

## Active branch and latest pushed commit
- Active branch: `research/1161-readiness-corrections`
- Latest pushed commit: this checkpoint commit

## Completed tasks with evidence
1. Verified contamination and current PR state.
   - Evidence: `gh pr view 1412` showed draft PR, 30 commits, 84 changed files, including `ai-insights/*`, `.github/*`, and research docs.
2. Verified source revision continuity.
   - Evidence: reviewed revision exists and is ancestor/equal to #1412 head.
3. Created clean worktree/branch from current `origin/main`.
   - Worktree: `/workspaces/pm-tools-templates-1161-clean`
   - Branch: `research/1161-readiness-corrections`
4. Preserved intended research files from verified source revision into clean branch:
   - `README.md`
   - `evidence.md`
   - `scope-and-acceptance.md`
   - `PUBLICATION_INSTRUCTIONS.md`
5. Committed and pushed clean phase-1 checkpoint from `origin/main`.
   - Commit: `de24deb0f763a29d0d29ee5612fa151a49cc6b47`
6. Opened replacement draft PR and cross-linked #1412.
   - Replacement PR: #1413 (draft)
   - Comment posted on #1412 instructing that it must not be merged due to unrelated app/CI/dependency changes.
7. Verified scope isolation for replacement PR.
   - `gh pr view 1413 --json files` shows changes only under `research/1161-risk-scoring-engine/`.
8. Corrected research content in place (phase 2):
   - Rewrote `evidence.md` as claim/source ledger with explicit search outcome types and limitations.
   - Rewrote `README.md` with corrected disposition and acceptance matrix (`Met/Not met/Unknown` only).
   - Rewrote `scope-and-acceptance.md` to preserve uncertainty and mark all stories as gated proposals.
9. Performed external/source checks:
   - Retrieved #1161/#1160/#1162 issue bodies and #1161 historical comments.
   - Retrieved Crossref/OpenAlex records for DOI `10.3390/make8010001`.
   - Recorded DOI/MDPI/Scholar HTTP 403 failures as access failures, not absence evidence.
10. Began phase 3 packet finalization:
   - Removed obsolete `PUBLICATION_INSTRUCTIONS.md` as an intermediate replacement-branch step (not a deletion from `main`; final PR diff remains four added research files).
11. Completed phase 4 verification and handoff updates:
   - Re-fetched `origin/main` and confirmed clean-base SHA unchanged.
   - Verified merge-base diff scope contains only research packet files.
   - Ran `git diff --check` with no whitespace/conflict-marker findings.
   - Updated PR #1413 description to match corrected scope, limitations, and validation.
   - Posted status comment on #1161 with replacement PR link, disposition, completed corrections, unresolved research, and continuation steps.
12. Applied final wording/scope corrections requested after publication:
   - Stated consistently that paper-derived taxonomy/method claims require examination of relevant source content and reuse terms; metadata alone is insufficient.
   - Clarified that the repo owner may approve a different research direction, but cannot waive verification while retaining paper-derived claims.
   - Kept `CONTINUATION.md` final-diff file list to the four files present in PR #1413.

## Incomplete tasks and exact next action
- Incomplete: none in this assignment scope.
- Exact next action: repo owner reviews PR #1413 and decides whether to defer/decline or authorize additional research gates (source verification path, method-definition criteria, user-value evidence criteria).

## Changed files in this clean branch (current)
- `research/1161-risk-scoring-engine/README.md`
- `research/1161-risk-scoring-engine/evidence.md`
- `research/1161-risk-scoring-engine/scope-and-acceptance.md`
- `research/1161-risk-scoring-engine/CONTINUATION.md`

## Validation results
- Completed:
  - `git fetch origin main research/1161-risk-scoring-engine refs/pull/1412/head`
  - `gh pr view 1412 --json ...` inventory capture
  - `gh pr view 1413 --json files ...` scope check confirms only research directory changes
  - `git fetch --no-tags origin main` re-check before finalization (main unchanged at `12784bd89f21fcbcc6fb91322fd3e324dd0b8b04`)
  - `git diff --name-only origin/main...HEAD` -> only `research/1161-risk-scoring-engine/*`
  - `git diff --check origin/main...HEAD` -> no findings
  - Non-mutating run of `check_anchor_links_filtered.py` over repo root -> baseline report: files checked 1357, broken links 5, suggestions 16282
- Pending:
  - none

## Access failures and unresolved questions
- Access failures observed: HTTP 403 from Google Scholar query, DOI resolver endpoint, and MDPI article endpoint in this environment.
- Unresolved: full-paper access and rights interpretation for taxonomy reuse details; metadata alone is insufficient for paper-derived claims, and institutional-path checks remain outstanding.

## Approved scope vs proposals
- Approved scope for this assignment: corrective research documentation only.
- Any method changes, taxonomy adoption, or implementation stories remain proposals requiring separate repo-owner approval.

## Explicit non-authorization statement
No merge, implementation authorization, or Sprint 3 commitment is granted by this packet.
