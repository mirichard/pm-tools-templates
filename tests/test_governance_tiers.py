"""Boundary checks for #746 selection, template applicability and navigation."""
import copy
import itertools
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unittest

from scripts.select_governance_tier import DIMENSIONS, TIERS, select_tier

ROOT = Path(__file__).resolve().parents[1]
BASE = {'profile_version': '1.0', 'project_context': {
    'size': 'small', 'methodology': 'agile', 'risk_profile': 'low',
    'team_size': 'small', 'industry': 'it', 'phase': 'starting',
    'pm_experience': 'new',
}}


def profile(**context):
    result = copy.deepcopy(BASE)
    result['project_context'].update(context)
    return result


class SelectionTests(unittest.TestCase):
    def test_small_low_risk_and_medium_boundaries(self):
        self.assertEqual(select_tier(BASE)['tier'], 'light')
        for change in ({'size': 'medium'}, {'team_size': 'medium'}, {'risk_profile': 'medium'}):
            with self.subTest(change=change):
                self.assertEqual(select_tier(profile(**change))['tier'], 'standard')

    def test_small_scale_never_offsets_high_risk(self):
        for risk in ('high', 'regulatory'):
            for team in ('solo', 'small'):
                result = select_tier(profile(risk_profile=risk, team_size=team))
                self.assertEqual(result['tier'], 'rigorous')
                self.assertIn(f'risk_profile={risk}', result['reasons'])
                self.assertTrue(result['approval_required'])

    def test_large_scale_never_offset_by_low_risk(self):
        for change in ({'size': 'large'}, {'size': 'enterprise'}, {'team_size': 'large'}):
            self.assertEqual(select_tier(profile(**change))['tier'], 'rigorous')

    def test_policy_can_raise_but_cannot_lower_context_floor(self):
        self.assertEqual(select_tier(BASE, 'standard')['tier'], 'standard')
        self.assertEqual(select_tier(BASE, 'rigorous')['tier'], 'rigorous')
        self.assertEqual(select_tier(profile(risk_profile='regulatory'), 'light')['tier'], 'rigorous')
        with self.assertRaises(ValueError):
            select_tier(BASE, 'minimal')

    def test_tailoring_fields_never_remove_risk_controls(self):
        fields = ('methodology', 'industry', 'phase', 'pm_experience')
        for values in itertools.product(*(DIMENSIONS[f] for f in fields)):
            self.assertEqual(select_tier(profile(risk_profile='high', **dict(zip(fields, values))))['tier'], 'rigorous')

    def test_every_required_field_rejects_missing_and_invalid_values(self):
        for field in DIMENSIONS:
            for value in (None, '', 'unknown', [], {}, 1):
                with self.subTest(field=field, value=value):
                    with self.assertRaises(ValueError):
                        select_tier(profile(**{field: value}))
            data = copy.deepcopy(BASE)
            del data['project_context'][field]
            with self.assertRaises(ValueError):
                select_tier(data)
        for data in (None, [], {}, {'profile_version': '2.0'}, {'profile_version': '1.0', 'project_context': []}):
            with self.assertRaises(ValueError):
                select_tier(data)

    def test_cli_invalid_input_has_no_recommendation(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'context.json'
            path.write_text('{')
            result = subprocess.run([sys.executable, str(ROOT / 'scripts/select_governance_tier.py'), str(path)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 2)
            self.assertEqual(result.stdout, '')
            self.assertIn('No tier selected', result.stderr)
            path.write_text(json.dumps(BASE))
            result = subprocess.run([sys.executable, str(ROOT / 'scripts/select_governance_tier.py'), str(path), '--minimum-tier', 'standard'], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(json.loads(result.stdout)['tier'], 'standard')


class NavigationTests(unittest.TestCase):
    def test_inventory_covers_existing_governance_assets_and_tags(self):
        inventory = json.loads((ROOT / 'meta/governance-tiers.json').read_text())['templates']
        paths = [record['path'] for record in inventory]
        self.assertEqual(len(paths), len(set(paths)))
        expected = set()
        for folder in ('role-based-toolkits/project-manager/governance-tools', 'role-based-toolkits/program-manager/governance-framework'):
            expected.update(str(p.relative_to(ROOT)) for p in (ROOT / folder).glob('*.md') if p.name != 'README.md')
        expected.update((
            'role-based-toolkits/program-manager/benefits-realization/benefits-governance.md',
            'role-based-toolkits/program-manager/portfolio-management/governance-cadence.md',
            'domains/measurement/project-assessment-suite/governance-assessment-template.md',
        ))
        self.assertEqual(set(paths), expected)
        for record in inventory:
            self.assertTrue(record['tiers'])
            self.assertEqual(len(record['tiers']), len(set(record['tiers'])))
            self.assertTrue({tier.lower() for tier in record['tiers']} <= set(TIERS))
            text = (ROOT / record['path']).read_text()
            tag = '**Governance tiers:** ' + ', '.join(record['tiers']) + '.'
            self.assertEqual(text.count(tag), 1)
            link = re.search(r'\[adaptive governance model\]\(([^)]+)\)', text).group(1)
            self.assertTrue((ROOT / record['path']).parent.joinpath(link).is_file())

    def test_matrix_links_and_documented_profile(self):
        guide = ROOT / 'docs/governance/governance-decision-matrix.md'
        text = guide.read_text()
        for link in re.findall(r'\]\(([^)]+)\)', text):
            with self.subTest(link=link):
                self.assertTrue((guide.parent / link).is_file())
        example = json.loads(re.search(r'```json\n(.*?)\n```', text, re.S).group(1))
        self.assertEqual(select_tier(example)['tier'], 'light')
        for heading in ('## Required controls by tier', '## Changing tiers', '## Worked contexts'):
            self.assertIn(heading, text)


if __name__ == '__main__':
    unittest.main()
