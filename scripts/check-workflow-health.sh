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
    npm_exit=0
    npm audit "${prefix_args[@]}" --package-lock-only --ignore-scripts --omit=dev --audit-level=moderate --json > "$report_path" || npm_exit=$?

    # Distinguish a real audit report (has both `vulnerabilities` and
    # `auditReportVersion`, whatever the finding counts are) from an
    # operational error response or malformed/non-JSON output. npm's exit
    # code alone conflates these: a >=moderate finding and a registry/tool
    # error can both exit non-zero, with completely unrelated JSON shapes -
    # confirmed directly by forcing a registry error and comparing its
    # output to a clean report's output, not assumed from npm's docs alone.
    shape=$(python3 -c "
import json, sys
try:
    with open('$report_path') as f:
        data = json.load(f)
except Exception as e:
    print('malformed: ' + str(e))
    sys.exit()
if not isinstance(data, dict) or 'vulnerabilities' not in data or 'auditReportVersion' not in data:
    print('operational_error')
    sys.exit()
print('report')
" 2>&1)

    if [[ "$shape" == "report" ]]; then
      if [[ "$npm_exit" -eq 0 ]]; then
        echo "Runtime dependency audit for $target_dir passed at the moderate threshold."
      else
        cat "$report_path"
        echo "Dependency audit for $target_dir found vulnerabilities at or above the moderate threshold (exit $npm_exit); inspect $report_path." >&2
        exit "$npm_exit"
      fi
    else
      cat "$report_path" >&2
      echo "Dependency audit for $target_dir could not produce a valid report ($shape) - this is a tool/registry/parse error, not a vulnerability finding; inspect $report_path." >&2
      # An invalid report shape is never a pass, even if npm itself somehow
      # exited 0 - force a non-zero exit in that case rather than propagate
      # the misleading success code.
      if [[ "$npm_exit" -ne 0 ]]; then
        exit "$npm_exit"
      fi
      exit 1
    fi
    ;;
  *)
    echo "Usage: $0 {lint|audit}" >&2
    exit 2
    ;;
esac
