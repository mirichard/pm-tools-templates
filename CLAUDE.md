# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is primarily a **content library**: 154+ project management templates (Markdown, `.docx`, `.xlsx`) organized for browsing by humans, not a single application. Scattered inside it are several **independent, self-contained sub-applications** (their own `package.json`, own dependency tree) that support the library — a documentation site, a template browser, a dashboard, a couple of LLM-assisted CLIs, etc. There is no single build/run for "the project" — you build/test/run whichever sub-app or content-pipeline script you're touching.

The repo is mid-**reorg** (see `docs/reorg/STATUS.md`, `meta/`, `MIGRATION_GUIDE.md`): several directories exist in both an old and new form at once (e.g. `Agile/`, `Traditional/`, `Hybrid/` at repo root are legacy vs. `templates/agile/`, `templates/traditional/`, `templates/hybrid/`; `integration_guides/` vs `integration-guides/`; `industry_templates/` vs `industry-specializations/`). When editing template content, check whether a canonical, non-legacy location already exists before adding to an old path — `templates/templates.json` and `scripts/validate-canonical-paths.js` are the source of truth for what's canonical.

## Content pipeline (templates)

- `templates/templates.json` is the canonical metadata database for every template (canonical path, alternate paths, tags, methodology).
- `TEMPLATE_INDEX.md` is **generated** from `templates.json` via `node scripts/generate-template-index.js` (or the `.mjs` variant used by `npm run generate-template-index`). **Never hand-edit `TEMPLATE_INDEX.md`** — CI (`validate-index-and-links` job in `.github/workflows/ci.yml`) regenerates it and fails the build if the committed file drifts from the generator's output.
- `node scripts/validate-canonical-paths.js --strict` checks that every `canonical_path`/`alternate_paths` entry in `templates.json` actually exists on disk. Run this after moving or renaming template files.
- `python3 check_anchor_links_filtered.py` (and `check_links_no_deps.py`, mentioned in CONTRIBUTING.md) validate internal Markdown links/anchors before opening a PR.
- Markdown docs are scanned for leaked secrets/internal hostnames (`doc-sec-check.yml`, `scripts/detect-sensitive.sh`). Use placeholders (`{{variable}}`, `<YOUR_INTERNAL_HOST>`) instead of real hosts/IPs/credentials in examples; wrap an intentional example in `<!-- doc-sec-allow -->` to bypass a false positive.

## Sub-applications

Each of these is developed, tested, and linted independently from its own directory — `cd` into it and use its local `npm` scripts, not the root ones:

| Path | What it is | Stack |
|---|---|---|
| `docs/site/` | Astro-based template browser (previews, search, favorites, git-derived version history) — see `docs/ARCHITECTURE.md` | Astro + React, deployed to GitHub Pages |
| `dashboard-mvp/` | PM dashboard MVP | Next.js, Jest, ESLint |
| `web-mvp/` | Web MVP client | Vite + React, Playwright a11y tests |
| `site/` | Marketing/demo static site with server | Express, Playwright e2e + Lighthouse CI |
| `ai-insights/` | AI/ML insights service (training, prediction, API) | Express, TensorFlow.js, Jest |
| `analytics-platform/` | Analytics API + dashboard | Express/TS, Postgres (Knex), Redis, Kafka |
| `workflow-orchestration/` | Workflow orchestration engine/demo | Node, Jest |
| `curation-dashboard/` | Template curation dashboard (no `package.json` — plain JS served via its `backend/`) | Node |
| `backend/` | Small metrics-extraction server | Node (no deps) |
| `tools/requirements-structuring-cli/` | LLM-assisted CLI that turns NL requirements into formal Use Case Specs, ambiguity reports, and Gherkin/BDD `.feature` files (implements Li & Zheng 2025). Multi-provider: Gemini/Claude/OpenAI/any OpenAI-compatible endpoint via env vars. | Node, Commander |
| `tools/template-generator-cli/` | Interactive template generator/wizard, with its own dashboard/analytics/health-monitor servers | Node, Express, ws |
| `integrations/webhook-framework/` | Webhook integration framework (no root `package.json`; tested via root `npm run test:webhook`) | Node, Jest |

Each has its own README with setup details worth reading before making changes there.

## Common commands

Root-level (from repo root):

```bash
npm install                    # root deps only
npm run test:ci                # jest --coverage --runInBand --ci --passWithNoTests (root src/ tests)
npm run test:webhook           # jest for integrations/webhook-framework specifically
npm run generate-template-index  # regenerate TEMPLATE_INDEX.md from templates/templates.json
npm run doc-scan                 # scripts/doc-scan.js
node scripts/validate-canonical-paths.js --strict
python3 check_anchor_links_filtered.py
```

Docs site (Astro template browser):

```bash
npm run dev-site       # npm --prefix docs/site run dev
npm run build-site     # generate changelogs, then build docs/site
npm run preview-site   # preview built docs/site
npm run generate-changelogs   # git-log-derived changelog JSON for templates
```

Any sub-app (pattern — substitute the directory):

```bash
cd dashboard-mvp && npm install && npm test        # or: npm --prefix dashboard-mvp test
cd dashboard-mvp && npm run lint
cd dashboard-mvp && npm run dev
```

Running a single test: each sub-app uses its own test runner directly (Jest, Playwright, or a custom `tests/test-runner.js`), so pass the file straight through, e.g. `npx jest path/to/file.test.js` from inside that sub-app, or `npx playwright test tests/a11y.spec.ts` in `web-mvp/`.

## CI behavior worth knowing

`.github/workflows/ci.yml` auto-discovers **every** `package.json` in the repo (`find . -name package.json`) and runs `npm --prefix <package> run test:ci --if-present` for each as a matrix job — so any new sub-app only needs a `test:ci` script to be picked up automatically; no workflow edits required. Coverage from all packages is merged with `nyc` and gated at branches ≥80%, functions/lines/statements ≥85% (`merge-coverage` job). A separate `validate-index-and-links` job fails the build on template-index drift or broken anchor links (see Content pipeline above).

## Contribution conventions (from CONTRIBUTING.md)

- Branch from `develop`, not `main`. Naming: `feat/<ticket-id>-slug`, `fix/<ticket-id>-slug`, `chore/<task>`.
- Push and open a **draft PR to `develop`** early; squash-merge when CI passes. `develop` → `staging` → `main` promotion happens via a nightly job — don't push template changes directly to `staging`/`main`.
- Terminology: use "Traditional" as the user-facing term for waterfall-style content; only use "Traditional Project Management" when citing an official standard section, and never alter legal/trademark notices that reference it.
- New templates should follow the existing per-template structure (`README.md` with Purpose/When to Use/How to Use/Customization/Related Templates/Success Metrics sections, plus the actual `.docx`/`.xlsx` artifact where applicable) — copy the shape of a neighboring template rather than inventing a new one.
