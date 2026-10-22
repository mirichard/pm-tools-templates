"""Exercise the actual audit command boundary using local package-manager fixtures."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / 'scripts/javascript-audit.py'
spec = importlib.util.spec_from_file_location('javascript_audit', SCRIPT)
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


def report(severity=None):
    totals = dict.fromkeys(audit.SEVERITIES, 0)
    if severity:
        totals[severity] = 1
    return {'auditReportVersion': 2, 'vulnerabilities': {'example': {'severity': severity}} if severity else {},
            'metadata': {'vulnerabilities': {**totals, 'total': int(severity is not None)}}}


class JavascriptAuditTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.project = self.root / 'project'
        self.project.mkdir()
        (self.project / 'package.json').write_text('{}')
        self.output = self.root / 'javascript-audit.json'
        self.bin = self.root / 'bin'
        self.bin.mkdir()
        self.env = {**os.environ, 'PATH': str(self.bin) + os.pathsep + os.environ['PATH']}

    def fake_manager(self, body, code, manager='npm'):
        (self.root / 'fixture').write_text(body)
        command = self.bin / manager
        command.write_text('#!/usr/bin/env python3\nimport os,sys\nfrom pathlib import Path\n'
                           f'root=Path({str(self.root)!r})\n'
                           '(root/"invocations").open("a").write(os.getcwd()+" "+" ".join(sys.argv[1:])+"\\n")\n'
                           'print((root/"fixture").read_text())\nprint("fixture stderr",file=sys.stderr)\n'
                           f'sys.exit({code})\n')
        command.chmod(0o755)
        if manager == 'yarn':
            (self.project / 'yarn.lock').touch()

    def run_audit(self):
        result = subprocess.run(['python3', str(SCRIPT), '--directory', str(self.project),
            '--output', str(self.output), '--attempts', '2', '--retry-delay', '0'],
            env=self.env, cwd=self.root, capture_output=True, text=True)
        return result, json.loads(self.output.read_text())

    def test_clean_report_and_correct_directory(self):
        self.fake_manager(json.dumps(report()), 0)
        result, data = self.run_audit()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(data['total_vulnerabilities'], 0)
        calls = (self.root / 'invocations').read_text().splitlines()
        self.assertEqual(calls, [str(self.project) + ' audit --json --audit-level=info'])

    def test_vulnerabilities_are_retained_without_retry(self):
        self.fake_manager(json.dumps(report('high')), 1)
        result, data = self.run_audit()
        self.assertEqual(result.returncode, 0)
        self.assertEqual(data['total_vulnerabilities'], 1)
        self.assertEqual(data['audit_exit_code'], 1)
        self.assertEqual(len((self.root / 'invocations').read_text().splitlines()), 1)
        self.assertIn('example', (self.root / 'javascript-audit.attempt-1.stdout.json').read_text())

    def test_invalid_reports_fail_and_replace_stale_success(self):
        cases = ['not json', '{}', '{"vulnerabilities":{}}', '[]',
                 json.dumps({**report(), 'error': {'code': 'E403'}}),
                 json.dumps({**report(), 'metadata': None})]
        for body in cases:
            with self.subTest(body=body):
                self.output.write_text('{"status":"complete","total_vulnerabilities":0}')
                self.fake_manager(body, 1)
                result, data = self.run_audit()
                self.assertEqual(result.returncode, 2)
                self.assertEqual(data['status'], 'operational_error')
                self.assertIsNone(data['total_vulnerabilities'])
                self.assertEqual((self.root / 'javascript-audit.attempt-2.stderr.log').read_text(), 'fixture stderr\n')

    def test_exit_report_mismatches_fail(self):
        for code, body in [(1, report()), (0, report('high')), (127, report())]:
            with self.subTest(code=code):
                self.fake_manager(json.dumps(body), code)
                result, data = self.run_audit()
                self.assertEqual(result.returncode, 2)
                self.assertEqual(data['status'], 'operational_error')

    def test_invalid_counts_and_severities_fail(self):
        for value in [True, -1, '0', None]:
            data = report()
            data['metadata']['vulnerabilities']['high'] = value
            with self.subTest(value=value), self.assertRaises(ValueError):
                audit.validate_report('npm', json.dumps(data), 0)
        data = report('high')
        data['vulnerabilities']['example']['severity'] = 'low'
        with self.assertRaises(ValueError):
            audit.validate_report('npm', json.dumps(data), 1)

    def test_yarn_summary_and_vulnerability_exit_mask(self):
        for severity, code in [(None, 0), ('high', 8)]:
            counts = report(severity)['metadata']['vulnerabilities']
            self.fake_manager(json.dumps({'type': 'auditSummary', 'data': {'vulnerabilities': counts}}), code, 'yarn')
            result, data = self.run_audit()
            self.assertEqual(result.returncode, 0, result.stdout)
            self.assertEqual(data['total_vulnerabilities'], int(severity is not None))

    def test_yarn_error_or_missing_summary_fails(self):
        for body in ['{"type":"info","data":"nothing"}',
                     json.dumps({'type': 'error', 'data': 'registry failed'}) + '\n' + json.dumps({'type':'auditSummary','data':{'vulnerabilities':report()['metadata']['vulnerabilities']}})]:
            self.fake_manager(body, 1, 'yarn')
            result, data = self.run_audit()
            self.assertEqual(result.returncode, 2)
            self.assertEqual(data['status'], 'operational_error')

    def test_workflow_shell_propagates_failure_and_preserves_findings(self):
        workflow = (ROOT / '.github/workflows/dependency-security.yml').read_text()
        function = workflow[workflow.index('          analyze_javascript()'):workflow.index('          analyze_python()')]
        function = function.replace('scripts/javascript-audit.py', str(SCRIPT))
        function = function.replace('--output javascript-audit.json', '--output javascript-audit.json --attempts 2 --retry-delay 0')
        (self.root / 'security-scan').symlink_to(self.project, target_is_directory=True)
        for body, code, expected in [(json.dumps(report('high')), 1, 0), ('{}', 1, 2)]:
            self.fake_manager(body, code)
            result = subprocess.run(['bash', '-e', '-o', 'pipefail', '-c',
                                     function + '\nanalyze_javascript\necho ANALYSIS_COMPLETED'],
                                    cwd=self.root, env=self.env, capture_output=True, text=True)
            self.assertEqual(result.returncode, expected, result.stdout + result.stderr)
            self.assertEqual('ANALYSIS_COMPLETED' in result.stdout, expected == 0)
            data = json.loads(self.output.read_text())
            self.assertEqual(data['total_vulnerabilities'], 1 if expected == 0 else None)

    def test_workflow_uses_strict_runner_without_empty_fallback(self):
        workflow = (ROOT / '.github/workflows/dependency-security.yml').read_text()
        self.assertIn('python3 scripts/javascript-audit.py', workflow)
        self.assertNotIn('echo \'{"vulnerabilities":{}}\'', workflow)
        self.assertIn("raise ValueError('JavaScript audit did not complete successfully')", workflow)
        self.assertNotIn('Security scanning completed successfully!', workflow)
        self.assertIn('ANALYSIS_OUTCOME: ${{ steps.analyze.outcome }}', workflow)


if __name__ == '__main__':
    unittest.main()
