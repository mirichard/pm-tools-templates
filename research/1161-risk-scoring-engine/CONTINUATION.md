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
- Latest pushed commit: `3fcea781504ed1a7f40fd8cab39bc32e9662a10c`

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
   - Removed obsolete `PUBLICATION_INSTRUCTIONS.md` from replacement branch.

## Incomplete tasks and exact next action
- Incomplete: phase 3 checkpoint commit/push; phase 4 validation suite and PR/issue status updates.
- Exact next action: run scope/quality validation (`git diff --check`, merge-base file-scope checks, markdown/link checks), then update PR #1413 description and post a concise status comment on issue #1161.

## Changed files in this clean branch (current)
- `research/1161-risk-scoring-engine/README.md`
- `research/1161-risk-scoring-engine/evidence.md`
- `research/1161-risk-scoring-engine/scope-and-acceptance.md`
- `research/1161-risk-scoring-engine/CONTINUATION.md`
- `research/1161-risk-scoring-engine/PUBLICATION_INSTRUCTIONS.md` (deleted in working tree; not yet committed)

## Validation results
- Completed:
  - `git fetch origin main research/1161-risk-scoring-engine refs/pull/1412/head`
  - `gh pr view 1412 --json ...` inventory capture
  - `gh pr view 1413 --json files ...` scope check confirms only research directory changes
- Pending:
  - merge-base scope re-check after phase 2/3 edits
  - markdown/link checks after research corrections

## Access failures and unresolved questions
- Access failures observed: HTTP 403 from Google Scholar query, DOI resolver endpoint, and MDPI article endpoint in this environment.
- Unresolved: full-paper access and rights interpretation for taxonomy reuse details; institutional-path checks remain outstanding.

## Approved scope vs proposals
- Approved scope for this assignment: corrective research documentation only.
- Any method changes, taxonomy adoption, or implementation stories remain proposals requiring separate repo-owner approval.

## Explicit non-authorization statement
No merge, implementation authorization, or Sprint 3 commitment is granted by this packet.
