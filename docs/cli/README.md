# PM Tools CLI Usage Guide

This guide consolidates common command-line tasks and helper scripts available in this repository for validating docs, scanning links, and enriching metadata.

Audience
- Contributors and maintainers who need a single reference for repo CLI tasks

Prerequisites
- macOS/Linux or Windows (WSL recommended)
- Node.js 18+ if using Node-based tools
- Python 3.10+ if using Python scripts

Installation
- No global install required. Use scripts in-place.
- Optional: `npm ci` at repo root to set up Node-based tooling.

Core commands

Link validation
- Lightweight, no-deps link checker:
  ./check_links_no_deps.py
- Anchored link checker (respects allowlist in doc-sec-allowlist.txt):
  python3 check_anchor_links.py
- Full docs link check via GitHub Actions (local dry run):
  act -W .github/workflows/docs-link-check.yml  # optional, requires act

Documentation scanning
- Security doc scan (writes SARIF):
  bash analyze-all-links.sh > doc-scan.sarif

Metadata tools
- Add metadata to missing files (safe, idempotent):
  bash add_remaining_metadata.sh
- Fix duplicate metadata blocks in templates:
  bash fix_duplicate_metadata.sh
- Add metadata in bulk (Python helper):
  python3 add_metadata.py --path docs/templates --dry-run

Examples
- Validate anchors in docs/ and top-level README:
  python3 check_anchor_links_filtered.py docs README.md

- Enrich templates with frontmatter metadata:
  python3 add_metadata.py --path docs/templates --apply

- Run all maintenance scripts safely:
  bash add_remaining_metadata.sh && bash fix_duplicate_metadata.sh && python3 check_anchor_links.py

Conventions
- Do not commit secret values; scripts never print secrets
- Prefer --dry-run first, then apply changes
- Ensure exit codes are checked in CI workflows; scripts return non-zero on failure

Troubleshooting
- If a script is missing execute permission, run: chmod +x <script>
- For Node-based packages, run: npm ci
- For Python, create a venv: python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt (if present)

