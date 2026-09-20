"""Risk scaling must preserve higher floors and evidence uncertainty."""
import copy
import itertools
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unittest

from scripts.scale_governance_risk import RISK_DIMENSIONS, scale_risk
from scripts.select_governance_tier import TIERS

ROOT = Path(__file__).resolve().parents[1]
PROFILE = {'profile_version': '1.0', 'project_context': {
    'size': 'small', 'methodology': 'hybrid', 'risk_profile': 'low',
    'team_size': 'small', 'industry': 'it', 'phase': 'planning',
    'pm_experience': 'intermediate',
}}


def ratings(**changes):
    return {**dict.fromkeys(RISK_DIMENSIONS, 'low'), **changes}


class RiskScalingTests(unittest.TestCase):
    def test_three_archetypes(self):
        for risk, tier in ((ratings(), 'light'), (ratings(schedule='medium', budget='medium', organizational='medium'), 'standard'), (ratings(technical='high', schedule='medium', budget='medium', organizational='medium'), 'rigorous')):
            result = scale_risk(PROFILE, risk)
            self.assertEqual(result['tier'], tier)
            self.assertFalse(result['provisional'])
            self.assertTrue(result['approval_required'])

    def test_any_high_dimension_cannot_be_averaged_away(self):
        for dimension in RISK_DIMENSIONS:
            result = scale_risk(PROFILE, ratings(**{dimension: 'high'}))
            self.assertEqual(result['tier'], 'rigorous')
            self.assertEqual(result['effective_risk_profile'], 'high')

    def test_unknown_is_high_provisional_not_low(self):
        result = scale_risk(PROFILE, ratings(technical='unknown', compliance='unknown'))
        self.assertEqual(result['tier'], 'rigorous')
        self.assertTrue(result['provisional'])
        self.assertEqual(result['unresolved_dimensions'], ['technical', 'compliance'])

    def test_low_residual_does_not_remove_existing_floors(self):
        for field, value, tier in (('risk_profile', 'regulatory', 'rigorous'), ('risk_profile', 'high', 'rigorous'), ('risk_profile', 'medium', 'standard'), ('size', 'enterprise', 'rigorous'), ('team_size', 'large', 'rigorous')):
            profile = copy.deepcopy(PROFILE)
            profile['project_context'][field] = value
            result = scale_risk(profile, ratings())
            self.assertEqual(result['tier'], tier)
            if value == 'regulatory':
                self.assertEqual(result['effective_risk_profile'], 'regulatory')
        self.assertEqual(scale_risk(PROFILE, ratings(), 'standard')['tier'], 'standard')
        self.assertEqual(scale_risk(PROFILE, ratings(), 'rigorous')['tier'], 'rigorous')

    def test_raising_exposure_never_reduces_tier(self):
        levels = ('low', 'medium', 'high')
        for values in itertools.product(levels, repeat=5):
            assessed = dict(zip(RISK_DIMENSIONS, values))
            before = TIERS.index(scale_risk(PROFILE, assessed)['tier'])
            for dimension in RISK_DIMENSIONS:
                raised = {**assessed, dimension: 'high'}
                self.assertGreaterEqual(TIERS.index(scale_risk(PROFILE, raised)['tier']), before)

    def test_no_input_mutation(self):
        profile = copy.deepcopy(PROFILE)
        risk = ratings(technical='high')
        original = copy.deepcopy((profile, risk))
        scale_risk(profile, risk)
        self.assertEqual((profile, risk), original)

    def test_incomplete_or_invalid_input_is_rejected(self):
        invalid = [None, [], {}, ratings(extra='low')]
        for dimension in RISK_DIMENSIONS:
            missing = ratings()
            del missing[dimension]
            invalid.append(missing)
            for value in (None, [], {}, 1, 'Low', 'critical', 'regulatory', 'n/a'):
                invalid.append(ratings(**{dimension: value}))
        for assessment in invalid:
            with self.subTest(assessment=assessment), self.assertRaises(ValueError):
                scale_risk(PROFILE, assessment)
        with self.assertRaises(ValueError):
            scale_risk({}, ratings())
        with self.assertRaises(ValueError):
            scale_risk(PROFILE, ratings(), 'unknown')

    def test_cli_success_and_failure(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'assessment.json'
            for payload, expected in (('{', 2), ('[]', 2), (json.dumps({'profile': PROFILE, 'risk_dimensions': ratings(technical='unknown')}), 0)):
                path.write_text(payload)
                result = subprocess.run([sys.executable, str(ROOT / 'scripts/scale_governance_risk.py'), str(path)], capture_output=True, text=True)
                self.assertEqual(result.returncode, expected, result.stderr)
                if expected:
                    self.assertEqual(result.stdout, '')
                    self.assertIn('No scaling recommendation', result.stderr)
                else:
                    self.assertTrue(json.loads(result.stdout)['provisional'])

    def test_documented_example_links_and_assessment_handoffs(self):
        guide = ROOT / 'docs/governance/risk-based-scaling.md'
        text = guide.read_text()
        example = json.loads(re.search(r'```json\n(.*?)\n```', text, re.S).group(1))
        self.assertEqual(scale_risk(example['profile'], example['risk_dimensions'])['tier'], 'rigorous')
        for target in re.findall(r'\]\(([^)]+)\)', text):
            self.assertTrue((guide.parent / target.split('#')[0]).is_file(), target)
        assets = list(ROOT.glob('domains/**/*risk*assessment*template.md'))
        self.assertEqual(len(assets), 4)
        assets.append(ROOT / 'domains/uncertainty/project-lifecycle/02-planning/risk-management/risk-register-template.md')
        for asset in assets:
            body = asset.read_text()
            self.assertIn('## Governance scaling recommendations', body, str(asset))
            target = re.search(r'\[risk-based governance framework\]\(([^)]+)\)', body).group(1)
            self.assertEqual((asset.parent / target).resolve(), guide)
        for field in RISK_DIMENSIONS:
            self.assertIn(field.capitalize(), text)


if __name__ == '__main__':
    unittest.main()
