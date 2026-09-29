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
- Latest pushed commit: `de24deb0f763a29d0d29ee5612fa151a49cc6b47`

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

## Incomplete tasks and exact next action
- Incomplete: Phase 2 corrective rewrite of README/evidence/scope docs; phase 3 packet finalization; phase 4 validation and handoff comments.
- Exact next action: rewrite `research/1161-risk-scoring-engine/evidence.md` to a strict claim/source ledger with explicit search outcomes and limitations, then reconcile README and scope documents to that evidence.

## Changed files in this clean branch (current)
- `research/1161-risk-scoring-engine/README.md`
- `research/1161-risk-scoring-engine/evidence.md`
- `research/1161-risk-scoring-engine/scope-and-acceptance.md`
- `research/1161-risk-scoring-engine/PUBLICATION_INSTRUCTIONS.md`
- `research/1161-risk-scoring-engine/CONTINUATION.md`

## Validation results
- Completed:
  - `git fetch origin main research/1161-risk-scoring-engine refs/pull/1412/head`
  - `gh pr view 1412 --json ...` inventory capture
  - `gh pr view 1413 --json files ...` scope check confirms only research directory changes
- Pending:
  - merge-base scope re-check after phase 2/3 edits
  - markdown/link checks after research corrections

## Access failures and unresolved questions
- No API access failure encountered so far.
- Unresolved: whether external bibliographic sources are fully accessible from this environment; will log explicitly during Phase 2 search updates.

## Approved scope vs proposals
- Approved scope for this assignment: corrective research documentation only.
- Any method changes, taxonomy adoption, or implementation stories remain proposals requiring separate repo-owner approval.

## Explicit non-authorization statement
No merge, implementation authorization, or Sprint 3 commitment is granted by this packet.
