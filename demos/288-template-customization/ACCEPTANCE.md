# Issue #75 verification — 09/26/2026

## Scope and baseline

Baseline: `fa9c3356` on main. Tests target `demos/288-template-customization`,
not the separate `demo/288` implementation. No AI recovery changes are included.

Four regression tests were run against a production build of the unchanged
baseline and failed at their expected behavioral assertions:

| Scenario | Baseline observation | Fixed behavior |
| --- | --- | --- |
| Switch away from and back to Charter | Project name became empty | Per-template in-memory drafts retained |
| Add a Sprint goal | No list Add control | Typed list add/edit/remove controls |
| Malformed saved JSON | No recovery warning | Warning and no silent replacement |
| Storage quota failure | No actionable save failure message | Explicit failure, draft retained, download available |

The fixed production build passed **25 Chromium tests** with no retries:
16 workflow regression/acceptance tests, the existing Charter UAT, and eight
accessibility/keyboard tests. The all-editor tests inspect downloaded contents
and filenames and compare exports after reload/restore; they do not merely
check that a download occurred. Tests also exercise template isolation,
malformed collections/records, denied reads, failed writes, retry, loading over
unsaved edits, validation refresh, string-list/numeric types, and narrow layouts.

## Commands and environment

- Node.js 24.19.0; dependency installation from the package lock.
- `npm run build`: passed (TypeScript and Vite).
- `npx playwright test --config=playwright.local.config.ts --workers=2`:
  25 passed, no retries, 22.6 seconds.
- `git diff --check`: passed.

The pinned Playwright 1.62.1 browser downloads returned invalid ZIP archives in
this environment. Tests therefore used a separately installed
`@sparticuz/chromium` 153.0.0 executable, Chromium 153.0.8010.0, through a temporary
local config importing the repository config and overriding only launchOptions
(executablePath and no-sandbox/disable-gpu/disable-dev-shm-usage flags).
That temporary config, binary and package are not repository dependencies.
The repository's standard Chromium configuration is unchanged. Hosted checks
with the standard browser remain required; local results are not represented
as pinned-browser verification.

## Remaining acceptance and limitations

- Await hosted CI, maintainer review and user acceptance on the PR revision.
- No iPad/Safari, screen-reader or cross-browser acceptance is claimed by these
  Chromium checks. The narrow viewport test uses 390 × 844 CSS pixels.
- Saved drafts remain local browser storage; no server persistence or file
  import is introduced. Simultaneous writes from multiple tabs are not a
  transactional database. Browser-exit warnings are best effort.
- Draft export is intentionally allowed for recovery and labeled when required
  data is missing/invalid. This checks template structure, not project correctness.
- Generated dist and incremental-build artifacts are not part of the source
  change; run the build before previewing or testing this revision.

Keep #75 open until the relevant merged revision and user acceptance are recorded.
