# Demo: Template Preview, Caching, a11y/perf gates, and Analytics

This repository includes a minimal demo site implementing:
- 388: Preview Renderer + Caching
- 390: E2E + accessibility + performance gates
- 391: Analytics foundation (opt-in, privacy-first)

Location: `site/`

## Run locally

Requirements: Node.js 18+ (recommend 20+)

- Install deps and start:
  - cd site
  - npm install
  - npm run start
- Open http://localhost:5173

## Features

- Template index automatically scans the repository for `.md` templates across Agile, PMBOK, Hybrid, Waterfall, and other folders.
- Preview endpoint `/api/preview?path=...` renders Markdown to HTML with syntax highlighting.
- Caching via ETag and 304 responses when templates have not changed.
- Accessibility-friendly UI with keyboard navigation of templates and aria-live rendering.
- Opt-in telemetry banner (localStorage consent). If enabled, preview events are counted and exposed at `/api/dashboard`.

## CI Gates

GitHub Actions workflow `.github/workflows/ci.yml` runs:
- Playwright E2E tests and axe-core a11y checks
- Lighthouse CI with thresholds: performance >= 0.8 (warn), accessibility >= 0.9 (error), best-practices >= 0.9 (warn)

## Notes and Privacy

- Telemetry is anonymous, opt-in, and stored in-memory only for the demo; no PII is collected.
- To clear telemetry, restart the server. Consent can be changed by clearing browser localStorage.

## Rollback

Revert or remove the `site/` directory and CI workflow file to disable the demo.
