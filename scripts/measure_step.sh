#!/usr/bin/env bash
set -euo pipefail

# Usage: measure_step.sh <name> -- command...
# Records timing for a single step and appends a JSON line to $TIMING_FILE (default: timings.jsonl)

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <name> -- command..." >&2
  exit 2
fi

STEP_NAME="$1"
shift
if [[ "$1" != "--" ]]; then
  echo "Expected -- after step name" >&2
  exit 2
fi
shift

TIMING_FILE_PATH="${TIMING_FILE:-timings.jsonl}"
START_TS=$(date +%s)
START_ISO=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Run command and measure wall clock using time -p
TMP_DIR=$(mktemp -d)
REAL_FILE="$TMP_DIR/real.txt"
EXIT_CODE=0
{
  { time -p "$@" 1>"$TMP_DIR/stdout.log" 2>"$TMP_DIR/stderr.log"; } 2>"$REAL_FILE" || EXIT_CODE=$?
} || true
END_TS=$(date +%s)
END_ISO=$(date -u +%Y-%m-%dT%H:%M:%SZ)

REAL_SEC=$(awk '/^real /{print $2}' "$REAL_FILE" 2>/dev/null || echo "")
# Fallback if time output missing
if [[ -z "${REAL_SEC}" ]]; then
  REAL_SEC=$(( END_TS - START_TS ))
fi

mkdir -p "$(dirname "$TIMING_FILE_PATH")"
cat >>"$TIMING_FILE_PATH" <<EOF
{"step":"$STEP_NAME","start":"$START_ISO","end":"$END_ISO","duration_sec":$REAL_SEC,"exit_code":$EXIT_CODE}
EOF

# Also emit logs as grouped output if available
if [[ -s "$TMP_DIR/stdout.log" ]]; then
  echo "::group::${STEP_NAME} stdout"
  sed -e 's/\r$//' "$TMP_DIR/stdout.log" || true
  echo "::endgroup::"
fi
if [[ -s "$TMP_DIR/stderr.log" ]]; then
  echo "::group::${STEP_NAME} stderr"
  sed -e 's/\r$//' "$TMP_DIR/stderr.log" || true
  echo "::endgroup::"
fi

rm -rf "$TMP_DIR"
exit $EXIT_CODE
