#!/usr/bin/env bash
# Read-only checks: propagate validation, tool, and network failures to CI.
set -euo pipefail
mkdir -p health-reports
case "${1:-}" in
  lint)
    shopt -s nullglob
    workflows=(.github/workflows/*.yml .github/workflows/*.yaml)
    if (( ${#workflows[@]} == 0 )); then
      echo "No executable workflow files found." >&2
      exit 1
    fi
    # GitHub executes top-level workflows, not archived subdirectories.
    actionlint -shellcheck= -pyflakes= "${workflows[@]}" 2>&1 | tee health-reports/actionlint.txt
    echo "Actions syntax passed for ${#workflows[@]} top-level workflow files."
    ;;
  audit)
    if [[ ! -f package.json || ! -f package-lock.json ]]; then
      echo "Root package.json and package-lock.json are required." >&2
      exit 1
    fi
    echo "Auditing root runtime dependencies; failing at moderate severity or above."
    if npm audit --package-lock-only --ignore-scripts --omit=dev --audit-level=moderate --json > health-reports/npm-audit.json; then
      echo "Root runtime dependency audit passed at the moderate threshold."
    else
      result=$?
      cat health-reports/npm-audit.json
      echo "Dependency audit failed (exit $result); inspect npm-audit.json." >&2
      exit "$result"
    fi
    ;;
  *)
    echo "Usage: $0 {lint|audit}" >&2
    exit 2
    ;;
esac
