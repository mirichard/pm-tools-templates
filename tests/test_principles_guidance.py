"""Regression tests for catalog growth and lost applicability/discovery guidance."""
import json
from pathlib import Path
import tempfile
import unittest

from scripts.validate_principles_guidance import validate


class GuidanceTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        (self.root / 'templates').mkdir()
        (self.root / 'docs/principles').mkdir(parents=True)
        for name, other in [('a', 'b'), ('b', 'a')]:
            (self.root / f'templates/{name}.md').write_text(
                f'## When to Use\n- Plan {name}.\n- Review {name}.\n'
                '## When NOT to Use\n- Outside scope.\n'
                '- See [pattern](../docs/principles/anti-patterns.md#pattern-0).\n'
                f'## Pairs Well With\n- [Other]({other}.md)\n'
                'Context: 800-801-context-assessment-model.md\n')
        self.catalog = self.root / 'templates/templates.json'
        self.catalog.write_text(json.dumps({'templates': [{'path': 'templates/a.md'}, {'path': 'templates/b.md'}]}))
        guide = ''
        for i in range(10):
            guide += f'<a id="pattern-{i}"></a>\n'
            guide += '\n'.join(f'**{field}:** Example.' for field in ('Domains', 'Description', 'Symptoms', 'Impact', 'Correct alternative', 'Relevant templates'))
            guide += '\n[A](../../templates/a.md) [B](../../templates/b.md)\n'
        (self.root / 'docs/principles/anti-patterns.md').write_text(guide)

    def test_complete_fixture_passes(self):
        self.assertEqual(validate(self.root)['errors'], [])

    def test_new_catalog_template_cannot_bypass_guidance(self):
        data = json.loads(self.catalog.read_text())
        data['templates'].append({'path': 'templates/new.md'})
        self.catalog.write_text(json.dumps(data))
        (self.root / 'templates/new.md').write_text('# New template\n')
        self.assertTrue(any('new.md' in e for e in validate(self.root)['errors']))

    def test_missing_exclusion_and_self_pair_fail(self):
        file = self.root / 'templates/a.md'
        file.write_text(file.read_text().replace('## When NOT to Use', '## Notes').replace('[Other](b.md)', '[Other](a.md)'))
        errors = validate(self.root)['errors']
        self.assertTrue(any('When NOT' in e for e in errors))
        self.assertTrue(any('complementary' in e for e in errors))

    def test_broken_pattern_anchor_fails(self):
        file = self.root / 'templates/a.md'
        file.write_text(file.read_text().replace('#pattern-0', '#missing'))
        self.assertTrue(any('anti-pattern link' in e for e in validate(self.root)['errors']))

    def test_live_catalog_passes(self):
        self.assertEqual(validate(Path(__file__).resolve().parents[1])['errors'], [])
