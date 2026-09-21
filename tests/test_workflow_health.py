"""Exercise the real health-check entrypoint, including failure propagation."""
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts/check-workflow-health.sh"
VALID = """name: Fixture
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: echo ok
"""


class WorkflowHealthTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.workflows = self.root / ".github/workflows"
        self.workflows.mkdir(parents=True)
        self.env = os.environ.copy()

    def run_check(self, mode):
        return subprocess.run(
            ["bash", str(SCRIPT), mode], cwd=self.root, env=self.env,
            text=True, capture_output=True, check=False,
        )

    def test_valid_workflows_and_archived_files(self):
        (self.workflows / "valid.yml").write_text(VALID)
        (self.workflows / "also-valid.yaml").write_text(VALID)
        archive = self.workflows / "archive"
        archive.mkdir()
        (archive / "disabled.yml").write_text("invalid: [")
        result = self.run_check("lint")
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("2 top-level workflow files", result.stdout)

    def test_invalid_expression_fails_and_preserves_report(self):
        (self.workflows / "invalid.yaml").write_text(
            VALID.replace("echo ok", "echo ${{ github.run_started_at }}")
        )
        result = self.run_check("lint")
        self.assertNotEqual(result.returncode, 0)
        self.assertNotIn("Actions syntax passed", result.stdout)
        report = (self.root / "health-reports/actionlint.txt").read_text()
        self.assertIn("run_started_at", report)

    def test_malformed_yaml_fails(self):
        (self.workflows / "invalid.yml").write_text("jobs: [")
        self.assertNotEqual(self.run_check("lint").returncode, 0)

    def test_no_workflows_fails(self):
        self.assertNotEqual(self.run_check("lint").returncode, 0)

    def fake_npm(self, exit_code):
        for filename in ("package.json", "package-lock.json"):
            (self.root / filename).write_text("{}")
        bindir = self.root / "bin"
        bindir.mkdir()
        npm = bindir / "npm"
        npm.write_text(
            '#!/bin/bash\nprintf "%s\\n" "$@" > npm-args.txt\n'
            'echo \'{"fixture": true}\'\n'
            f'exit {exit_code}\n'
        )
        npm.chmod(0o755)
        self.env["PATH"] = str(bindir) + os.pathsep + self.env["PATH"]

    def test_successful_audit_scope(self):
        self.fake_npm(0)
        result = self.run_check("audit")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual((self.root / "npm-args.txt").read_text().splitlines(), [
            "audit", "--package-lock-only", "--ignore-scripts", "--omit=dev",
            "--audit-level=moderate", "--json",
        ])

    def assert_failed_audit(self, code):
        self.fake_npm(code)
        result = self.run_check("audit")
        self.assertEqual(result.returncode, code)
        self.assertNotIn("audit passed", result.stdout)
        self.assertIn('"fixture": true', (self.root / "health-reports/npm-audit.json").read_text())

    def test_vulnerability_failure_propagates(self):
        self.assert_failed_audit(1)

    def test_tool_or_network_failure_propagates(self):
        self.assert_failed_audit(2)

    def test_missing_manifests_fail(self):
        result = self.run_check("audit")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("are required", result.stderr)

    def test_unknown_mode_fails(self):
        self.assertEqual(self.run_check("unknown").returncode, 2)


if __name__ == "__main__":
    unittest.main()
