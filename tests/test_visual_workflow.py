"""Exercise the actual inline workflow programs with small synthetic artifacts.

Run: python3 -m unittest discover -s tests -p test_visual_workflow.py
Requires the workflow's existing PyYAML, Pillow and numpy test libraries and Node.
"""
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

import yaml
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = yaml.safe_load((ROOT / '.github/workflows/visual-regression-testing.yml').read_text())


def program(job, name, language):
    step = next(s for s in WORKFLOW['jobs'][job]['steps'] if name in s['name'])
    return step['run'].split(f"{language} - << 'EOF'\n", 1)[1].split('\nEOF', 1)[0]


DISCOVER = program('visual-discovery', 'Discover Visual Test Targets', 'python3')
COMPARE = program('visual-comparison', 'Perform Visual Comparison', 'python3')
CAPTURE = program('visual-capture', 'Capture Screenshots', 'node').replace(
    '${{ matrix.browser }}', 'chromium').replace('${{ matrix.resolution.name }}', 'mobile').replace(
    '${{ matrix.resolution.width }}', '375').replace('${{ matrix.resolution.height }}', '667')
REPORT = program('visual-report', 'Generate Visual Regression Report', 'python3')


class VisualWorkflowTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        (self.root / 'visual-comparison-results').mkdir()

    def tearDown(self):
        self.temp.cleanup()

    def fixture(self, baseline=True):
        for resolution in ('chromium_mobile', 'chromium_desktop'):
            directory = self.root / 'screenshots' / resolution
            directory.mkdir(parents=True)
            (directory / 'manifest.json').write_text(json.dumps({'expected': ['sample.png']}))
            Image.new('RGB', (8, 8), 'white').save(directory / 'sample.png')
            if baseline:
                accepted = self.root / '.github/visual-baselines' / f'screenshots-{resolution}'
                accepted.mkdir(parents=True)
                Image.new('RGB', (8, 8), 'white').save(accepted / 'sample.png')

    def compare(self, passed=False, **env):
        result = subprocess.run(['python3', '-c', COMPARE], cwd=self.root,
                                env={**os.environ, **env}, capture_output=True, text=True)
        self.assertEqual(result.returncode == 0, passed, result.stdout + result.stderr)
        return json.loads((self.root / 'visual-comparison-results/summary.json').read_text())

    def test_complete_matching_comparison_passes(self):
        self.fixture()
        self.assertEqual(self.compare(passed=True)['total_comparisons'], 2)

    def test_discovery_deduplicates_overlapping_documentation_targets(self):
        (self.root / 'docs').mkdir()
        (self.root / 'docs/example.md').write_text('# Example')
        (self.root / 'visual-discovery').mkdir()
        result = subprocess.run(['python3', '-c', DISCOVER], cwd=self.root,
                                env={**os.environ, 'GITHUB_OUTPUT': str(self.root / 'outputs')},
                                capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        targets = json.loads((self.root / 'visual-discovery/targets.json').read_text())
        self.assertEqual([t['path'] for t in targets], ['docs/example.md'])

    def test_dimension_changes_fail(self):
        self.fixture()
        Image.new('RGB', (16, 16), 'white').save(self.root / 'screenshots/chromium_mobile/sample.png')
        self.assertEqual(self.compare()['regressions_found'], 1)

    def test_no_artifacts_fails(self):
        self.assertEqual(self.compare()['status'], 'incomplete')

    def test_missing_matrix_artifact_fails(self):
        self.fixture()
        (self.root / 'screenshots/chromium_mobile/manifest.json').unlink()
        self.assertEqual(self.compare()['status'], 'incomplete')

    def test_missing_expected_capture_fails(self):
        self.fixture()
        (self.root / 'screenshots/chromium_mobile/sample.png').unlink()
        self.assertEqual(self.compare()['status'], 'incomplete')

    def test_corrupt_capture_fails(self):
        self.fixture()
        (self.root / 'screenshots/chromium_mobile/sample.png').write_text('not an image')
        self.assertEqual(self.compare()['status'], 'incomplete')

    def test_missing_baselines_fails_even_update_requested(self):
        self.fixture(baseline=False)
        summary = self.compare(GITHUB_EVENT_INPUTS_BASELINE_UPDATE='true')
        self.assertNotEqual(summary['status'], 'passed')
        self.assertFalse((self.root / '.github/visual-baselines').exists())

    def test_regression_fails_even_update_requested(self):
        self.fixture()
        Image.new('RGB', (8, 8), 'black').save(self.root / 'screenshots/chromium_mobile/sample.png')
        self.assertEqual(self.compare(GITHUB_EVENT_INPUTS_BASELINE_UPDATE='true')['regressions_found'], 1)

    def test_partial_baseline_fails(self):
        self.fixture()
        (self.root / '.github/visual-baselines/screenshots-chromium_mobile/sample.png').unlink()
        self.assertEqual(self.compare()['status'], 'needs_baseline_review')

    def capture(self, mode='ok'):
        module = self.root / 'site/node_modules/playwright'
        module.mkdir(parents=True)
        module.joinpath('index.js').write_text('''
const fs = require('fs');
const noop = async () => {};
exports.chromium = {launch: async () => ({close: noop, newContext: async () => ({newPage: async () => ({
addStyleTag: noop, goto: noop, waitForLoadState: noop, waitForTimeout: noop,
screenshot: async options => {
 if ('quality' in options) throw new Error('PNG quality is invalid');
 if (process.env.CAPTURE_MODE === 'error') throw new Error('capture failure');
 if (process.env.CAPTURE_MODE !== 'missing') fs.writeFileSync(options.path, 'fixture');
}
})})})};
''')
        (self.root / 'rendered-templates').mkdir()
        manifest = [{'original': p, 'rendered': 'fixture.html', 'test_scenarios': ['dark_theme']}
                    for p in ('docs/a/README.md', 'docs/b/README.md')]
        (self.root / 'rendered-templates/manifest.json').write_text(json.dumps(manifest))
        output = self.root / 'screenshots/chromium_mobile'
        output.mkdir(parents=True)
        result = subprocess.run(['node', '-e', CAPTURE], cwd=self.root,
                                env={**os.environ, 'CAPTURE_MODE': mode}, capture_output=True, text=True)
        return result, list(output.glob('*.png'))

    def test_capture_png_options_and_same_basename_are_valid(self):
        result, files = self.capture()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(len(files), 4)

    def test_capture_errors_fail_job(self):
        result, _ = self.capture('error')
        self.assertNotEqual(result.returncode, 0)

    def test_missing_capture_outputs_fail_job(self):
        result, _ = self.capture('missing')
        self.assertNotEqual(result.returncode, 0)

    def test_report_missing_results_is_not_green(self):
        result = subprocess.run(['python3', '-c', REPORT], cwd=self.root,
                                env={**os.environ, 'VISUAL_UPSTREAM_OK': 'false'}, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        summary = json.loads((self.root / 'visual-testing-summary.json').read_text())
        self.assertEqual(summary['status'], 'incomplete')
        self.assertNotIn('All Visual Tests Passing', (self.root / 'visual-regression-report.md').read_text())

    def test_report_upstream_failure_overrides_passing_summary(self):
        self.fixture()
        self.compare(passed=True)
        result = subprocess.run(['python3', '-c', REPORT], cwd=self.root,
                                env={**os.environ, 'VISUAL_UPSTREAM_OK': 'false'}, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads((self.root / 'visual-testing-summary.json').read_text())['status'], 'incomplete')


if __name__ == '__main__':
    unittest.main()
