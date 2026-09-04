#!/bin/bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCANNER="$REPO_ROOT/scripts/detect-sensitive.sh"
TEST_ROOT="$(mktemp -d)"

cleanup() {
    rm -rf "$TEST_ROOT"
}
trap cleanup EXIT

run_scan() {
    local expected_exit="$1"
    local target_dir="$2"
    local report_file="$3"
    local output_file="$4"
    local actual_exit

    set +e
    COMPLIANCE_REPORT="$report_file" bash "$SCANNER" scan "$target_dir" > "$output_file" 2>&1
    actual_exit=$?
    set -e

    if [[ "$actual_exit" -ne "$expected_exit" ]]; then
        cat "$output_file" >&2
        echo "Expected exit $expected_exit, got $actual_exit" >&2
        exit 1
    fi
}

safe_dir="$TEST_ROOT/safe-fixture"
mkdir -p "$safe_dir"
printf 'project template\n' > "$safe_dir/template.md"
run_scan 0 "$safe_dir" "$TEST_ROOT/safe-report.md" "$TEST_ROOT/safe-output.log"
grep -q '\*\*Status:\*\* ✅ PASSED' "$TEST_ROOT/safe-report.md"
grep -Eq '\*\*Scan Date:\*\* [0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2} UTC' "$TEST_ROOT/safe-report.md"
if grep -q '{{SCAN_DATE}}' "$TEST_ROOT/safe-report.md"; then
    echo 'Scan date placeholder was not replaced' >&2
    exit 1
fi
grep -q 'Binary metadata analysis completed' "$TEST_ROOT/safe-output.log"

sensitive_dir="$TEST_ROOT/sensitive-fixture"
mkdir -p "$sensitive_dir"
printf 'contact person@sensitive-test.net\n' > "$sensitive_dir/template.md"
run_scan 1 "$sensitive_dir" "$TEST_ROOT/sensitive-report.md" "$TEST_ROOT/sensitive-output.log"
grep -q '\*\*Status:\*\* ❌ FAILED' "$TEST_ROOT/sensitive-report.md"
grep -q 'person@sensitive-test.net' "$TEST_ROOT/sensitive-output.log"
grep -q 'Binary metadata analysis completed' "$TEST_ROOT/sensitive-output.log"

special_dir="$TEST_ROOT/safe&scope"
mkdir -p "$special_dir"
printf 'project template\n' > "$special_dir/template.md"
run_scan 0 "$special_dir" "$TEST_ROOT/special-report.md" "$TEST_ROOT/special-output.log"
grep -q '\*\*Scan Scope:\*\* safe&scope' "$TEST_ROOT/special-report.md"

mkdir "$TEST_ROOT/report-directory"
run_scan 2 "$safe_dir" "$TEST_ROOT/report-directory" "$TEST_ROOT/tool-error-output.log"
grep -q 'Is a directory' "$TEST_ROOT/tool-error-output.log"

echo 'PASS: detect-sensitive.sh regression tests'
