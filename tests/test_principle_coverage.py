"""Verify that coverage cannot pass through missing, invalid or stale evidence."""
import json
from pathlib import Path
import shutil
import unittest

from tests import test_principles_guidance as guidance_fixture
from scripts.validate_principle_coverage import MANIFEST, annotation, inspect, validate

ROOT = Path(__file__).resolve().parents[1]


class CoverageTests(unittest.TestCase):
    def setUp(self):
        fixture = guidance_fixture.GuidanceTests()
        fixture.setUp()
        self.addCleanup(fixture.doCleanups)
        self.root = fixture.root
        (self.root / 'schemas').mkdir()
        (self.root / 'meta').mkdir()
        shutil.copy(ROOT / 'schemas/principle-annotation.schema.json', self.root / 'schemas')
        shutil.copy(ROOT / 'docs/principles/principle-taxonomy.md', self.root / 'docs/principles')
        (self.root / 'docs/principles/self-assessment.md').write_text('# Assessment\n')
        self.file = self.root / 'templates/a.md'
        self.header = ('---\nprimary_principles: [value-focus]\n'
                       'secondary_principles: [stewardship]\n'
                       'principle_rationale: Connects investment outcomes to accountable ownership.\n---\n')
        for name in ('a', 'b'):
            p = self.root / f'templates/{name}.md'
            p.write_text(self.header + p.read_text())
        self.schema = json.loads((self.root / 'schemas/principle-annotation.schema.json').read_text())
        self.refresh()

    def refresh(self):
        manifest, errors = inspect(self.root)
        self.assertEqual(errors, [])
        (self.root / MANIFEST).write_text(json.dumps(manifest))

    def test_complete_and_reproducible(self):
        first, errors = validate(self.root)
        self.assertEqual(errors, [])
        self.assertEqual(first, validate(self.root)[0])
        self.assertEqual((first['annotated'], first['denominator']), (2, 2))

    def test_canonical_path_takes_precedence_over_legacy_alias(self):
        catalog = self.root / 'templates/templates.json'
        data = json.loads(catalog.read_text())
        data['templates'][0] = {'path': 'legacy/nonexistent.md', 'canonical_path': 'templates/a.md'}
        catalog.write_text(json.dumps(data))
        self.refresh()
        self.assertEqual(validate(self.root)[0]['denominator'], 2)

    def test_duplicate_missing_and_unsafe_catalog_paths_fail(self):
        catalog = self.root / 'templates/templates.json'
        original = catalog.read_text()
        for path in ('templates/a.md', 'templates/../templates/a.md', 'templates/missing.md', '../outside.md'):
            with self.subTest(path=path):
                data = json.loads(original)
                data['templates'].append({'path': path})
                catalog.write_text(json.dumps(data))
                self.assertTrue(inspect(self.root)[1])

    def test_catalog_growth_cannot_bypass_annotations(self):
        catalog = self.root / 'templates/templates.json'
        data = json.loads(catalog.read_text())
        data['templates'].append({'path': 'templates/new.md'})
        catalog.write_text(json.dumps(data))
        (self.root / 'templates/new.md').write_text('# New\n')
        manifest, errors = validate(self.root)
        self.assertEqual(manifest['denominator'], 3)
        self.assertEqual(manifest['annotated'], 2)
        self.assertTrue(any('new.md' in error for error in errors))

    def test_schema_overlap_duplicate_yaml_and_line_limits_fail(self):
        replacements = [
            ('primary_principles: [value-focus]', 'primary_principles: []'),
            ('[value-focus]', '[unknown]'),
            ('[value-focus]', '[value-focus, value-focus]'),
            ('[stewardship]', '[value-focus]'),
            ('[stewardship]', 'stewardship'),
            ('Connects investment outcomes to accountable ownership.', 'Too short'),
            ('Connects investment outcomes to accountable ownership.', 'x' * 241),
            ('Connects investment outcomes to accountable ownership.', 'First sentence. Second sentence.'),
            ('primary_principles:', 'primary_principles: [risk-optimization]\nprimary_principles:'),
            ('[value-focus]', '\n' + '\n'.join('  # extra line' for _ in range(11)) + '\n  - value-focus'),
        ]
        for old, new in replacements:
            with self.subTest(new=new), self.assertRaises(ValueError):
                annotation(self.header.replace(old, new), self.schema)

    def test_missing_guidance_and_discovery_fail(self):
        self.file.write_text(self.file.read_text().replace('## When to Use', '## Other'))
        (self.root / 'docs/principles/self-assessment.md').unlink()
        errors = inspect(self.root)[1]
        self.assertTrue(any('When to Use' in e for e in errors))
        self.assertTrue(any('discovery link' in e for e in errors))

    def test_manifest_rejects_drift_and_unapproved_exclusions(self):
        path = self.root / MANIFEST
        original = path.read_text()
        for key, value in [('denominator', 1), ('exclusions', ['templates/a.md']), ('templates', [])]:
            data = json.loads(original)
            data[key] = value
            path.write_text(json.dumps(data))
            self.assertTrue(any('stale' in e for e in validate(self.root)[1]))
        path.write_text(original)
        self.file.write_text(self.file.read_text() + '\nNew body text.\n')
        self.assertTrue(any('stale' in e for e in validate(self.root)[1]))

    def test_live_catalog(self):
        manifest, errors = validate(ROOT)
        self.assertEqual(errors, [])
        self.assertEqual(manifest['annotated'], manifest['denominator'])
        self.assertEqual(manifest['exclusions'], [])
