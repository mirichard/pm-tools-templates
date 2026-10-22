"""Exercise the actual inline workflow programs with small synthetic artifacts.

Pull requests are compared against their own base commit (no stored baselines):
incomplete capture evidence fails the check, visual differences are reported for review.

Run: python3 -m unittest discover -s tests -p test_visual_workflow.py
Requires PyYAML, Pillow, numpy, markdown, python-frontmatter, git and Node.
"""
import importlib.util
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
HAVE_RENDER_LIBS = all(importlib.util.find_spec(m) for m in ('markdown', 'frontmatter'))


def program(job, name, language):
    step = next(s for s in WORKFLOW['jobs'][job]['steps'] if name in s['name'])
    return step['run'].split(f"{language} - << 'EOF'\n", 1)[1].split('\nEOF', 1)[0]


DISCOVER = program('visual-discovery', 'Discover Visual Test Targets', 'python3')
RENDER = program('template-rendering', 'Render Templates to HTML', 'python3')
COMPARE = program('visual-comparison', 'Perform Visual Comparison', 'python3')
REPORT = program('visual-report', 'Generate Visual Regression Report', 'python3')


def capture_program(side):
    return program('visual-capture', 'Capture Screenshots', 'node').replace(
        '${{ matrix.browser }}', 'chromium').replace('${{ matrix.resolution.name }}', 'mobile').replace(
        '${{ matrix.resolution.width }}', '375').replace('${{ matrix.resolution.height }}', '667').replace(
        '${{ matrix.side }}', side)


GIT_ENV = {'GIT_AUTHOR_NAME': 't', 'GIT_AUTHOR_EMAIL': 't@example.com',
           'GIT_COMMITTER_NAME': 't', 'GIT_COMMITTER_EMAIL': 't@example.com'}


class VisualWorkflowTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        (self.root / 'visual-comparison-results').mkdir()

    def tearDown(self):
        self.temp.cleanup()

    # ---- comparison -------------------------------------------------------------------
    def fixture(self, base='same'):
        """Head screenshots always; base screenshots: 'same', 'new-page' (empty) or None (missing)."""
        for resolution in ('chromium_mobile', 'chromium_desktop'):
            directory = self.root / 'screenshots' / resolution
            directory.mkdir(parents=True)
            (directory / 'manifest.json').write_text(json.dumps({'expected': ['sample.png']}))
            Image.new('RGB', (8, 8), 'white').save(directory / 'sample.png')
            if base is None:
                continue
            baseline = self.root / 'baseline-screenshots' / resolution
            baseline.mkdir(parents=True)
            if base == 'same':
                (baseline / 'manifest.json').write_text(json.dumps({'expected': ['sample.png']}))
                Image.new('RGB', (8, 8), 'white').save(baseline / 'sample.png')
            else:
                (baseline / 'manifest.json').write_text(json.dumps({'expected': []}))

    def compare(self, passed=False, mode='pr_diff', **env):
        result = subprocess.run(['python3', '-c', COMPARE], cwd=self.root,
                                env={**os.environ, 'VISUAL_MODE': mode, **env}, capture_output=True, text=True)
        self.assertEqual(result.returncode == 0, passed, result.stdout + result.stderr)
        return json.loads((self.root / 'visual-comparison-results/summary.json').read_text())

    def test_pr_unchanged_screenshots_pass(self):
        self.fixture()
        summary = self.compare(passed=True)
        self.assertEqual((summary['status'], summary['total_comparisons']), ('passed', 2))

    def test_pr_visual_change_is_reported_without_failing(self):
        self.fixture()
        Image.new('RGB', (8, 8), 'black').save(self.root / 'screenshots/chromium_mobile/sample.png')
        summary = self.compare(passed=True)
        self.assertEqual((summary['status'], summary['regressions_found']), ('changes_for_review', 1))

    def test_pr_dimension_change_is_reported_without_failing(self):
        self.fixture()
        Image.new('RGB', (16, 16), 'white').save(self.root / 'screenshots/chromium_mobile/sample.png')
        summary = self.compare(passed=True)
        self.assertEqual((summary['status'], summary['regressions_found']), ('changes_for_review', 1))

    def test_pr_new_page_without_base_version_passes(self):
        self.fixture(base='new-page')
        summary = self.compare(passed=True)
        self.assertEqual((summary['status'], summary['new_screenshots']), ('passed', 2))

    def test_pr_missing_base_artifacts_fail(self):
        self.fixture(base=None)
        self.assertEqual(self.compare()['status'], 'incomplete')

    def test_pr_incomplete_base_capture_fails(self):
        self.fixture()
        (self.root / 'baseline-screenshots/chromium_mobile/sample.png').unlink()
        self.assertEqual(self.compare()['status'], 'incomplete')

    def test_full_run_passes_without_any_base(self):
        self.fixture(base=None)
        self.assertEqual(self.compare(passed=True, mode='full')['status'], 'passed')

    def test_no_artifacts_fails(self):
        self.assertEqual(self.compare(mode='full')['status'], 'incomplete')

    def test_missing_matrix_artifact_fails(self):
        self.fixture(base=None)
        (self.root / 'screenshots/chromium_mobile/manifest.json').unlink()
        self.assertEqual(self.compare(mode='full')['status'], 'incomplete')

    def test_missing_expected_capture_fails(self):
        self.fixture(base=None)
        (self.root / 'screenshots/chromium_mobile/sample.png').unlink()
        self.assertEqual(self.compare(mode='full')['status'], 'incomplete')

    def test_corrupt_capture_fails(self):
        self.fixture(base=None)
        (self.root / 'screenshots/chromium_mobile/sample.png').write_text('not an image')
        self.assertEqual(self.compare(mode='full')['status'], 'incomplete')

    # ---- discovery --------------------------------------------------------------------
    def discover(self, **env):
        (self.root / 'visual-discovery').mkdir(exist_ok=True)
        result = subprocess.run(['python3', '-c', DISCOVER], cwd=self.root,
                                env={**os.environ, 'GITHUB_OUTPUT': str(self.root / 'outputs'), **env},
                                capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        targets = json.loads((self.root / 'visual-discovery/targets.json').read_text())
        summary = json.loads((self.root / 'visual-discovery/summary.json').read_text())
        return targets, summary

    def test_discovery_deduplicates_overlapping_documentation_targets(self):
        (self.root / 'docs').mkdir()
        (self.root / 'docs/example.md').write_text('# Example')
        targets, summary = self.discover()
        self.assertEqual([t['path'] for t in targets], ['docs/example.md'])
        self.assertEqual((summary['mode'], summary['sides']), ('full', ['head']))

    def git(self, *args):
        return subprocess.run(['git', *args], cwd=self.root, check=True, capture_output=True,
                              text=True, env={**os.environ, **GIT_ENV}).stdout.strip()

    def test_pull_request_discovery_selects_only_changed_targets(self):
        (self.root / 'docs').mkdir()
        (self.root / 'docs/a.md').write_text('# A')
        (self.root / 'docs/b.md').write_text('# B')
        self.git('init', '-q')
        self.git('add', '.')
        self.git('commit', '-q', '-m', 'base')
        base = self.git('rev-parse', 'HEAD')
        (self.root / 'docs/a.md').write_text('# A changed')
        (self.root / 'docs/c.md').write_text('# C new')
        self.git('add', '.')
        self.git('commit', '-q', '-m', 'head')
        targets, summary = self.discover(EVENT_NAME='pull_request', PR_BASE_SHA=base)
        self.assertEqual(sorted(t['path'] for t in targets), ['docs/a.md', 'docs/c.md'])
        self.assertEqual((summary['mode'], summary['sides']), ('pr_diff', ['head', 'base']))

    def test_pull_request_without_visual_changes_has_no_targets(self):
        (self.root / 'docs').mkdir()
        (self.root / 'docs/a.md').write_text('# A')
        (self.root / 'notes.txt').write_text('1')
        self.git('init', '-q')
        self.git('add', '.')
        self.git('commit', '-q', '-m', 'base')
        base = self.git('rev-parse', 'HEAD')
        (self.root / 'notes.txt').write_text('2')
        self.git('add', '.')
        self.git('commit', '-q', '-m', 'head')
        targets, summary = self.discover(EVENT_NAME='pull_request', PR_BASE_SHA=base)
        self.assertEqual((targets, summary['total_targets']), ([], 0))

    # ---- rendering --------------------------------------------------------------------
    def render(self, side, paths):
        (self.root / 'visual-discovery').mkdir()
        (self.root / 'docs').mkdir(exist_ok=True)
        (self.root / 'rendered-templates').mkdir()  # the workflow's shell step runs mkdir -p first
        targets = [{'type': 'documentation', 'path': p, 'name': Path(p).stem, 'category': 'documentation',
                    'priority': 'medium', 'test_scenarios': ['desktop']} for p in paths]
        (self.root / 'visual-discovery/targets.json').write_text(json.dumps(targets))
        return subprocess.run(['python3', '-c', RENDER], cwd=self.root,
                              env={**os.environ, 'VISUAL_SIDE': side}, capture_output=True, text=True)

    def manifest(self):
        return json.loads((self.root / 'rendered-templates/manifest.json').read_text())

    @unittest.skipUnless(HAVE_RENDER_LIBS, 'markdown and python-frontmatter are required')
    def test_base_render_skips_pages_that_do_not_exist_at_base(self):
        (self.root / 'docs').mkdir()
        (self.root / 'docs/old.md').write_text('# Old')
        result = self.render('base', ['docs/old.md', 'docs/new.md'])
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual([m['original'] for m in self.manifest()], ['docs/old.md'])

    @unittest.skipUnless(HAVE_RENDER_LIBS, 'markdown and python-frontmatter are required')
    def test_base_render_allows_an_empty_manifest(self):
        result = self.render('base', ['docs/new.md'])
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.manifest(), [])

    @unittest.skipUnless(HAVE_RENDER_LIBS, 'markdown and python-frontmatter are required')
    def test_head_render_fails_when_a_target_is_missing(self):
        self.assertNotEqual(self.render('head', ['docs/new.md']).returncode, 0)

    @unittest.skipUnless(HAVE_RENDER_LIBS, 'markdown and python-frontmatter are required')
    def test_head_render_with_no_targets_fails(self):
        self.assertNotEqual(self.render('head', []).returncode, 0)

    # ---- capture ----------------------------------------------------------------------
    def capture(self, mode='ok', side='head', paths=('docs/a/README.md', 'docs/b/README.md')):
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
        manifest = [{'original': p, 'rendered': 'fixture.html', 'test_scenarios': ['dark_theme']} for p in paths]
        (self.root / 'rendered-templates/manifest.json').write_text(json.dumps(manifest))
        output = self.root / 'screenshots/chromium_mobile'
        output.mkdir(parents=True)
        result = subprocess.run(['node', '-e', capture_program(side)], cwd=self.root,
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

    def test_base_side_with_no_pages_is_valid(self):
        result, files = self.capture(side='base', paths=())
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(files, [])

    def test_head_side_with_no_pages_fails(self):
        result, _ = self.capture(side='head', paths=())
        self.assertNotEqual(result.returncode, 0)

    # ---- report -----------------------------------------------------------------------
    def report(self, upstream_ok):
        return subprocess.run(['python3', '-c', REPORT], cwd=self.root,
                              env={**os.environ, 'VISUAL_UPSTREAM_OK': upstream_ok}, capture_output=True, text=True)

    def summary_file(self):
        return json.loads((self.root / 'visual-testing-summary.json').read_text())

    def test_report_missing_results_is_not_green(self):
        result = self.report('false')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.summary_file()['status'], 'incomplete')
        self.assertNotIn('All Visual Tests Passing', (self.root / 'visual-regression-report.md').read_text())

    def test_report_upstream_failure_overrides_passing_summary(self):
        self.fixture()
        self.compare(passed=True)
        self.assertEqual(self.report('false').returncode, 0)
        self.assertEqual(self.summary_file()['status'], 'incomplete')

    def test_report_keeps_changes_for_review_status(self):
        self.fixture()
        Image.new('RGB', (8, 8), 'black').save(self.root / 'screenshots/chromium_mobile/sample.png')
        self.compare(passed=True)
        result = self.report('true')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.summary_file()['status'], 'changes_for_review')
        report = (self.root / 'visual-regression-report.md').read_text()
        self.assertIn('Visual changes detected', report)
        self.assertNotIn('All Visual Tests Passing', report)


if __name__ == '__main__':
    unittest.main()
