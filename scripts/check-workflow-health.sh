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

    # Validate the supported npm report schema and moderate-severity exit policy.
    shape=$(python3 - "$report_path" "$npm_exit" <<'PYTHON'
import json, sys
def require(condition, message):
    if not condition:
        raise ValueError(message)
try:
    with open(sys.argv[1]) as f:
        data = json.load(f)
    require(isinstance(data, dict), 'report must be an object')
    require('error' not in data and 'errors' not in data, 'operational error in report')
    require(type(data.get('auditReportVersion')) is int and data['auditReportVersion'] == 2, 'unsupported report version')
    findings = data.get('vulnerabilities')
    require(isinstance(findings, dict), 'vulnerabilities must be an object')
    levels = ('info', 'low', 'moderate', 'high', 'critical')
    counts = dict.fromkeys(levels, 0)
    for name, finding in findings.items():
        require(isinstance(finding, dict) and finding.get('severity') in levels, 'invalid finding severity')
        counts[finding['severity']] += 1
    metadata = data.get('metadata')
    require(isinstance(metadata, dict), 'metadata must be an object')
    totals = metadata.get('vulnerabilities')
    require(isinstance(totals, dict), 'missing vulnerability counts')
    for level in (*levels, 'total'):
        count = totals.get(level)
        require(type(count) is int and count >= 0, 'invalid vulnerability count')
        expected = len(findings) if level == 'total' else counts[level]
        require(count == expected, 'inconsistent vulnerability counts')
    actionable = any(counts[level] for level in ('moderate', 'high', 'critical'))
    require(int(sys.argv[2]) == (1 if actionable else 0), 'exit status inconsistent with moderate severity policy')
except (ValueError, OSError, TypeError) as error:
    print('malformed/operational_error: ' + str(error))
else:
    print('report')
PYTHON
    )

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
      # Reserved for operational failures; the runner records this separately.
      exit 2
    fi
    ;;
  *)
    echo "Usage: $0 {lint|audit}" >&2
    exit 2
    ;;
esac
