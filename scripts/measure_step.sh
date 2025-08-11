#!/usr/bin/env bash
# usage: measure_step "<name>" -- <command and args>
set -euo pipefail
name="${1:-}"
if [[ -z "$name" ]]; then
  echo "usage: measure_step \"<name>\" -- <command and args>" >&2
  exit 2
fi
shift || true
if [[ "${1:-}" == "--" ]]; then shift || true; fi
start=$(date +%s%3N)
if "$@"; then
  status=0
else
  status=$?
fi
end=$(date +%s%3N)
mkdir -p gha-timings
printf '{"step":"%s","start_ms":%s,"end_ms":%s,"dur_ms":%s,"status":%s}\n' \
  "$name" "$start" "$end" "$((end-start))" "$status" >> gha-timings/timings.jsonl
exit $status
