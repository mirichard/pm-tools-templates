"""Exercise real generation and guard against unsafe dispatch/startup regressions."""
import importlib.util
import os
from pathlib import Path
import re
import subprocess
import tempfile
import unittest
import yaml

ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT / '.github/workflows/clean-status-workflow.yml'
spec = importlib.util.spec_from_file_location('status', ROOT / 'scripts/validate-status-output.py')
status = importlib.util.module_from_spec(spec)
spec.loader.exec_module(status)


class CleanStatusTests(unittest.TestCase):
    def setUp(self):
        self.workflow = yaml.safe_load(WORKFLOW.read_text())
        self.steps = self.workflow['jobs']['enhanced-clean-status']['steps']

    def test_safe_mode_skips_delivery_and_mutation(self):
        for name in ('Send Status Email', 'Commit Status Report'):
            step = next(s for s in self.steps if s['name'] == name)
            self.assertEqual(step['if'], '${{ !inputs.test_mode }}')
        mail = next(s for s in self.steps if s['name'] == 'Send Status Email')
        self.assertEqual(mail['with']['to'], '${{ secrets.EMAIL_RECIPIENTS }}')
        self.assertNotIn('MAIL_RECIPIENTS', self.workflow['env'])
        trigger = self.workflow.get('on', self.workflow.get(True))
        self.assertEqual(str(trigger['workflow_dispatch']['inputs']['test_mode']['default']).lower(), 'true')

    def test_interpolated_scalars_stay_well_below_expression_limit(self):
        def visit(value):
            if isinstance(value, dict):
                for v in value.values(): visit(v)
            elif isinstance(value, list):
                for v in value: visit(v)
            elif isinstance(value, str) and '${{' in value:
                # GitHub compiles interpolated scalars to format expressions,
                # including the literal text. Keep ample room for escaping.
                self.assertLess(len(value), 10000)
        visit(self.workflow)

    def test_real_report_and_email_without_mail_credentials(self):
        generation = next(s['run'] for s in self.steps if s['name'] == 'Generate Status Report')
        for progress, risks in ((0, 0), (80, 2)):
            values = dict(total_issues=10, open_issues=2, closed_issues=8,
                          completion_rate=80, strategic_progress=progress,
                          high_priority=12, critical_risks=risks, bugs=1,
                          blockers=0, recent_closed=3)
            script = re.sub(r'\$\{\{ steps.metrics.outputs.(\w+) }}',
                            lambda m: str(values[m[1]]), generation)
            with tempfile.TemporaryDirectory() as tmp:
                env = dict(PATH=os.environ['PATH'], REPORT_TYPE='weekly', METHODOLOGY='hybrid',
                           GITHUB_REPOSITORY='fixture/repository',
                           PROGRAM_DASHBOARD_URL='https://example.invalid/dashboard',
                           DETAILED_REPORTS_URL='https://example.invalid/reports',
                           **{k.upper(): str(v) for k, v in values.items()})
                subprocess.run(['bash', '-euo', 'pipefail', '-c', script], cwd=tmp, env=env, check=True)
                result = subprocess.run(['bash', str(ROOT / 'scripts/generate-status-email.sh')],
                                        cwd=tmp, env=env, check=True, capture_output=True, text=True)
                self.assertEqual(result.stderr, '')
                subprocess.run(['python3', str(ROOT / 'scripts/validate-status-output.py')],
                               cwd=tmp, env=env, check=True)
                email = (Path(tmp) / 'email/status-email.html').read_text()
                self.assertIn('fixture/repository/issues', email)
                self.assertIn('80%', email)

    def test_missing_output_fails(self):
        with self.assertRaises(ValueError): status.validate('', '')


if __name__ == '__main__':
    unittest.main()
