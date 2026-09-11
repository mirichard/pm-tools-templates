"""Deterministic metadata policy, pointer structure and Git event fixtures."""
from datetime import date
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('metadata', ROOT / 'scripts/lint_template_metadata.py')
lint = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lint)
VALID = '---\ntitle: Test template\nmethodology: universal\ncomplexity: starter\nowner: maintainer\nupdated: 2026-09-01\n---\n# Body\n'
POINTER = '''# Test Template — Moved

## Purpose and overview

This file contains navigation guidance only and is not a second template copy.

**Canonical location:** [Open template](<body with spaces.md>)

## Usage instructions

Follow the link to copy or update the maintained template.
'''


class MetadataTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.write('templates/body with spaces.md', VALID)
        self.write('templates/templates.json', json.dumps({'templates': [{'path': 'templates/body with spaces.md'}]}))
        self.git('init', '-q')
        self.git('config', 'user.email', 'fixture@example.invalid')
        self.git('config', 'user.name', 'Fixture')
        self.commit()

    def write(self, path, content):
        file = self.root / path
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text(content)

    def git(self, *args):
        return subprocess.check_output(['git', '-C', str(self.root), *args], stderr=subprocess.DEVNULL).decode().strip()

    def commit(self):
        self.git('add', '.')
        self.git('commit', '-qm', 'fixture')
        return self.git('rev-parse', 'HEAD')

    def test_valid_canonical_and_universal(self):
        self.assertEqual(lint.metadata(VALID, date(2026, 9, 11)), ([], []))

    def test_missing_metadata(self):
        self.assertTrue(lint.metadata('# Template')[0])
        self.assertTrue(lint.metadata(VALID.replace('owner: maintainer\n', ''))[0])

    def test_invalid_metadata(self):
        for old, new in [('universal', 'unknown'), ('starter', 'hard'), ('2026-09-01', '2026-02-30'),
                         ('owner: maintainer', 'owner: [a, b]'), ('title: Test template', 'title: " "')]:
            self.assertTrue(lint.metadata(VALID.replace(old, new))[0])

    def test_duplicate_yaml_keys_fail(self):
        self.assertTrue(lint.metadata(VALID.replace('owner: maintainer', 'owner: first\nowner: second'))[0])

    def test_valid_pointer_with_spaces(self):
        self.assertEqual(lint.classify('templates/legacy.md', POINTER, set()), 'pointer')
        self.assertEqual(lint.pointer_errors(self.root, 'templates/legacy.md', POINTER), [])

    def test_missing_destination(self):
        self.assertTrue(lint.pointer_errors(self.root, 'templates/legacy.md', POINTER.replace('body with spaces.md', 'missing.md')))

    def test_malformed_pointer(self):
        self.assertTrue(lint.pointer_errors(self.root, 'templates/legacy.md', POINTER.replace('## Usage instructions', '## Template')))

    def test_body_plus_pointer_fails(self):
        for content in (VALID + POINTER, POINTER + '\n## Full Template\n| Task | Owner |\n', POINTER + 'body ' * 500):
            self.assertTrue(lint.pointer_errors(self.root, 'templates/legacy.md', content))

    def test_support_and_catalog_identity(self):
        self.assertEqual(lint.classify('templates/README.md', '# Guide', set()), 'support')
        self.assertEqual(lint.classify('templates/excel/Testing_Instructions.md', '# Guide', set()), 'support')
        self.assertEqual(lint.classify('templates/README.md', '# Body', {'templates/README.md'}), 'canonical')
        self.assertEqual(lint.classify('domains/team/new-template.md', '# Body', set()), 'canonical')
        self.assertEqual(lint.classify('docs/spec.md', 'navigation only', set()), 'support')

    def test_changed_canonical_blocks_while_debt_is_visible(self):
        self.write('templates/body with spaces.md', '# Missing metadata')
        identities = {'templates/body with spaces.md'}
        result = lint.lint(self.root, set(), identities)
        self.assertFalse(result['errors'])
        self.assertTrue(result['inherited_debt'])
        self.assertTrue(lint.lint(self.root, identities, identities)['errors'])

    def test_catalog_addition_validates_unchanged_body(self):
        self.write('templates/new.md', '# Missing metadata')
        self.commit()
        self.write(lint.CATALOG, json.dumps({'templates': [{'path': 'templates/new.md'}]}))
        self.assertTrue(lint.lint(self.root, {lint.CATALOG}, {'templates/body with spaces.md'})['errors'])

    def test_catalog_removal_does_not_exempt_changed_body(self):
        self.write(lint.CATALOG, json.dumps({'templates': []}))
        self.write('templates/body with spaces.md', '# Missing metadata')
        self.assertTrue(lint.lint(self.root, {lint.CATALOG, 'templates/body with spaces.md'},
                                  {'templates/body with spaces.md'})['errors'])

    def test_promoting_alternate_to_canonical_validates_body(self):
        self.write('templates/body with spaces.md', '# Missing metadata')
        self.assertTrue(lint.lint(self.root, {lint.CATALOG}, {'templates/body with spaces.md'},
                                  old_primary={'templates/former.md'})['errors'])

    def test_push_multi_commit_selection(self):
        base = self.git('rev-parse', 'HEAD')
        self.write('templates/first file.md', VALID)
        self.commit()
        self.write('templates/second.md', VALID)
        head = self.commit()
        self.assertEqual(lint.changed_files(self.root, base, head, 'push'),
                         {'templates/first file.md', 'templates/second.md'})

    def test_pr_selection_uses_merge_base(self):
        base = self.git('rev-parse', 'HEAD')
        self.git('checkout', '-qb', 'feature')
        self.write('templates/feature file.md', VALID)
        head = self.commit()
        self.git('checkout', '--detach', base)
        self.write('templates/base-only.md', VALID)
        target = self.commit()
        self.assertEqual(lint.changed_files(self.root, target, head, 'pull_request'), {'templates/feature file.md'})

    def test_real_b2b_and_generic_compatibility_pointers(self):
        manifest = json.loads((ROOT / 'meta/migration-waves/b2b.json').read_text())
        for asset in manifest['assets']:
            self.assertEqual(lint.pointer_errors(ROOT, asset['source'], (ROOT / asset['source']).read_text()), [])
        for path in ('domains/uncertainty/essential-templates/infrastructure/deployment-checklist-template.md',
                     'domains/uncertainty/industry-specializations/information-technology/infrastructure/infrastructure_assessment_template.md'):
            self.assertEqual(lint.pointer_errors(ROOT, path, (ROOT / path).read_text()), [])


if __name__ == '__main__':
    unittest.main()
