"""Exercise scripts/applicability-gate.sh (round-6 QA finding F3: a required
check must always report a real conclusion - not-applicable, selection-
failed, or work-failed - never silently missing)."""
import os
from pathlib import Path
import subprocess
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts/applicability-gate.sh"


class ApplicabilityGateTests(unittest.TestCase):
    def run_gate(self, **overrides):
        env = os.environ.copy()
        env.pop("CHANGES_RESULT", None)
        env.pop("APPLICABLE", None)
        env.pop("EVENT_NAME", None)
        env.pop("WORK_RESULT", None)
        env.pop("WORK_LABEL", None)
        env.update(overrides)
        return subprocess.run(
            ["bash", str(SCRIPT)], env=env, text=True, capture_output=True, check=False,
        )

    def test_not_applicable_pull_request_passes(self):
        result = self.run_gate(
            CHANGES_RESULT="success", APPLICABLE="false", EVENT_NAME="pull_request",
            WORK_RESULT="skipped", WORK_LABEL="docs-only PR",
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("correctly skipped", result.stdout)

    def test_applicable_and_work_failed_fails(self):
        result = self.run_gate(
            CHANGES_RESULT="success", APPLICABLE="true", EVENT_NAME="pull_request",
            WORK_RESULT="failure", WORK_LABEL="integration-only PR",
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("did not succeed", result.stdout)

    def test_applicable_and_work_succeeded_passes(self):
        result = self.run_gate(
            CHANGES_RESULT="success", APPLICABLE="true", EVENT_NAME="pull_request",
            WORK_RESULT="success", WORK_LABEL="image-only PR",
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("passed", result.stdout)

    def test_push_event_runs_even_when_not_applicable(self):
        result = self.run_gate(
            CHANGES_RESULT="success", APPLICABLE="false", EVENT_NAME="push",
            WORK_RESULT="success", WORK_LABEL="push",
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("passed", result.stdout)

    def test_push_event_not_applicable_but_work_failed_fails(self):
        result = self.run_gate(
            CHANGES_RESULT="success", APPLICABLE="false", EVENT_NAME="push",
            WORK_RESULT="failure", WORK_LABEL="push",
        )
        self.assertNotEqual(result.returncode, 0)

    def test_selection_failure_fails_distinctly(self):
        result = self.run_gate(
            CHANGES_RESULT="failure", APPLICABLE="false", EVENT_NAME="pull_request",
            WORK_RESULT="skipped", WORK_LABEL="failed-selection PR",
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("change detection failed", result.stdout + result.stderr)

    def test_missing_required_env_var_fails_loudly(self):
        result = self.run_gate(
            CHANGES_RESULT="success", APPLICABLE="true", EVENT_NAME="push",
        )  # WORK_RESULT deliberately omitted
        self.assertNotEqual(result.returncode, 0)


if __name__ == "__main__":
    unittest.main()
