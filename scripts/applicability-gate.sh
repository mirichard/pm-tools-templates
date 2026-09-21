#!/usr/bin/env bash
# Shared "gate" evaluator for a workflow that triggers unconditionally but is
# only applicable to some pushes/PRs (container-scan.yml, integration-oauth-
# check.yml - round-6 QA finding F3). Distinguishes three outcomes: change
# detection itself failed; legitimately not applicable (pass); the
# conditional work job didn't succeed, whether it failed or never ran when
# it should have (fail).
#
# Required env: CHANGES_RESULT, APPLICABLE, EVENT_NAME, WORK_RESULT
# Optional env: WORK_LABEL (used in messages only)
set -euo pipefail

: "${CHANGES_RESULT:?CHANGES_RESULT is required}"
: "${APPLICABLE:?APPLICABLE is required}"
: "${EVENT_NAME:?EVENT_NAME is required}"
: "${WORK_RESULT:?WORK_RESULT is required}"
label="${WORK_LABEL:-this check}"

if [[ "$CHANGES_RESULT" != "success" ]]; then
  echo "::error::change detection failed (result: $CHANGES_RESULT) - cannot determine applicability."
  exit 1
fi

if [[ "$APPLICABLE" != "true" && "$EVENT_NAME" != "push" ]]; then
  echo "Not applicable to this PR ($label); correctly skipped."
  exit 0
fi

if [[ "$WORK_RESULT" != "success" ]]; then
  echo "::error::$label did not succeed (result: $WORK_RESULT)."
  exit 1
fi

echo "$label passed."
