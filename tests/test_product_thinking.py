"""Mode selection must preserve baseline controls and point to maintained assets."""
import importlib.util
import itertools
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
import contextlib
import io

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('recommender', ROOT / 'scripts/template-recommender.py')
ENGINE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(ENGINE)
BASE = dict(size='small', methodology='traditional', risk_profile='regulatory', team_size='small', industry='general', phase='closing', pm_experience='new')


class ProductThinkingTests(unittest.TestCase):
    def test_legacy_profile_keeps_baseline_output(self):
        # Compare with the committed parent implementation; no new mode may change old profiles.
        legacy_source = subprocess.check_output(['git', 'show', 'e12ac901f5cc53d4088e8b681bb46e2b4d5f773c:scripts/template-recommender.py'], cwd=ROOT, text=True)
        with tempfile.TemporaryDirectory() as temp:
            script = Path(temp) / 'legacy.py'
            profile = Path(temp) / 'profile.json'
            script.write_text(legacy_source)
            for phase in ENGINE.ESSENTIALS:
                ctx = dict(BASE, phase=phase)
                profile.write_text(json.dumps(ctx))
                legacy = subprocess.check_output([sys.executable, str(script), '--json', str(profile)], text=True)
                self.assertEqual(ENGINE.generate_recommendations(ctx) + '\n', legacy)

    def test_all_mode_phase_combinations_retain_regulatory_controls(self):
        for mode, phase, experience in itertools.product(ENGINE.DELIVERY_MODES, ENGINE.ESSENTIALS, ('new', 'advanced')):
            with self.subTest(mode=mode, phase=phase, experience=experience):
                ctx = dict(BASE, delivery_mode=mode, phase=phase, pm_experience=experience)
                output = ENGINE.generate_recommendations(ctx)
                self.assertIn('DELIVERY MODE: ' + mode, output)
                for _, path, _ in ENGINE.RISK_EXTRAS:
                    self.assertIn(path, output)
                if mode not in ('project', 'unsure'):
                    self.assertIn(ENGINE.MODE_PHASE_ASSETS[phase][1], output)
                    self.assertIn('product-vision-template.md', output)

    def test_invalid_mode_is_rejected(self):
        for value in ('agile', 'hybrid', '', None, [], {}):
            with self.subTest(value=value), self.assertRaises(ValueError):
                ENGINE.generate_recommendations(dict(BASE, delivery_mode=value))

    def test_unknown_mode_does_not_claim_product_readiness(self):
        mode, assets = ENGINE.delivery_mode_recommendations(dict(BASE, delivery_mode='unsure'))
        self.assertEqual(assets, [])
        self.assertIn('Resolve', ENGINE.MODE_REASONS[mode])

    def test_recommended_assets_exist(self):
        for _, path, _ in [*ENGINE.MODE_ASSETS, *ENGINE.MODE_PHASE_ASSETS.values()]:
            with self.subTest(path=path):
                self.assertTrue((ROOT / path).is_file())

    def test_mixed_modes_have_distinct_ownership_guidance(self):
        first = ENGINE.generate_recommendations(dict(BASE, delivery_mode='project_within_product'))
        second = ENGINE.generate_recommendations(dict(BASE, delivery_mode='product_within_project'))
        self.assertIn('retain project gates', first)
        self.assertIn('establish funding and ownership', second)
        for output in (first, second):
            self.assertIn('transition_to_operations_framework.md', output)

    def test_cli_wrapped_and_flat_profiles_and_invalid_exit(self):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / 'profile.json'
            ctx = dict(BASE, delivery_mode='product')
            for data in (ctx, {'profile_version': '1.0', 'project_context': ctx}):
                path.write_text(json.dumps(data))
                result = subprocess.run([sys.executable, str(ROOT / 'scripts/template-recommender.py'), '--json', str(path)], capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertIn('DELIVERY MODE: product', result.stdout)
            path.write_text(json.dumps(dict(BASE, delivery_mode='invalid')))
            result = subprocess.run([sys.executable, str(ROOT / 'scripts/template-recommender.py'), '--json', str(path)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 2)
            self.assertEqual(result.stdout, '')
            self.assertIn('delivery_mode', result.stderr)

    def test_interactive_default_is_unresolved(self):
        with patch('builtins.input', return_value=''), contextlib.redirect_stdout(io.StringIO()):
            ctx = ENGINE.ask_questions()
        self.assertEqual(ctx['delivery_mode'], 'unsure')


if __name__ == '__main__':
    unittest.main()
