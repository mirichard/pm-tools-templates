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
    target_dir="${2:-.}"
    if [[ ! -f "$target_dir/package.json" || ! -f "$target_dir/package-lock.json" ]]; then
      echo "$target_dir/package.json and package-lock.json are required." >&2
      exit 1
    fi
    report_name=$(echo "$target_dir" | tr '/.' '--' | sed 's/^-*//')
    report_path="health-reports/npm-audit${report_name:+-$report_name}.json"
    echo "Auditing runtime dependencies in $target_dir; failing at moderate severity or above."
    # Only pass --prefix when a directory argument was actually given, so the
    # no-argument (root) call keeps its exact original argv for callers/tests
    # that depend on it.
    prefix_args=()
    if [[ -n "${2:-}" ]]; then
      prefix_args=(--prefix "$target_dir")
    fi
    if npm audit "${prefix_args[@]}" --package-lock-only --ignore-scripts --omit=dev --audit-level=moderate --json > "$report_path"; then
      echo "Runtime dependency audit for $target_dir passed at the moderate threshold."
    else
      result=$?
      cat "$report_path"
      echo "Dependency audit for $target_dir failed (exit $result); inspect $report_path." >&2
      exit "$result"
    fi
    ;;
  *)
    echo "Usage: $0 {lint|audit}" >&2
    exit 2
    ;;
esac
