"""Review dates cannot hide stale, unreviewed, or modified template content."""
from datetime import date
import hashlib
import json
from pathlib import Path
import tempfile
import unittest

from scripts.lint_template_metadata import metadata
from scripts.template_reviews import load_reviews, REVIEW_FILE

BODY = '---\ntitle: Example\nmethodology: universal\ncomplexity: starter\nowner: owner\nupdated: 2025-01-01\n---\n# Example\n'
TODAY = date(2026, 9, 19)


class ReviewTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        (self.root / 'meta').mkdir()
        (self.root / 'template.md').write_text(BODY)
        self.record = dict(path='template.md', status='reviewed', reviewed='2026-09-19',
                           reviewer='Codex (AI)', scope='full-content',
                           sha256=hashlib.sha256(BODY.encode()).hexdigest(),
                           evidence=['Read instructions, fields, examples, and limitations.'])

    def load(self, records=None):
        (self.root / REVIEW_FILE).write_text(json.dumps(dict(version=1, templates=records or [self.record])))
        return load_reviews(self.root, TODAY)

    def test_old_update_remains_visible_without_completed_review(self):
        self.assertTrue(metadata(BODY, TODAY)[1])
        for status in ('pending', 'needs-revision', 'specialist-review'):
            self.record['status'] = status
            reviews, errors = self.load()
            self.assertEqual((reviews, errors), ({}, []))

    def test_valid_bound_review_preserves_update_and_clears_age_warning(self):
        reviews, errors = self.load()
        self.assertFalse(errors)
        self.assertEqual(metadata(BODY, TODAY, reviews['template.md']['reviewed']), ([], []))
        self.assertIn('updated: 2025-01-01', (self.root / 'template.md').read_text())

    def test_tampered_content_and_hash_fail(self):
        (self.root / 'template.md').write_text(BODY + 'Unreviewed change\n')
        self.assertTrue(self.load()[1])
        (self.root / 'template.md').write_text(BODY)
        self.record['sha256'] = '0' * 64
        self.assertTrue(self.load()[1])

    def test_missing_identity_evidence_or_full_scope_fails(self):
        for key in ('reviewer', 'evidence', 'scope', 'sha256', 'reviewed'):
            record = dict(self.record)
            del record[key]
            self.assertTrue(self.load([record])[1], key)
        self.record['scope'] = 'links-only'
        self.assertTrue(self.load()[1])

    def test_dates_are_valid_not_future_and_after_update(self):
        for value in ('2026-02-30', '2026-09-20'):
            self.record['reviewed'] = value
            self.assertTrue(self.load()[1])
        self.assertTrue(metadata(BODY, TODAY, '2024-12-31')[0])
        self.assertTrue(metadata(BODY.replace('2025-01-01', '2026-09-20'), TODAY)[0])
        self.assertTrue(metadata(BODY, TODAY, '2025-01-02')[1])

    def test_duplicate_unknown_status_and_unsafe_paths_fail(self):
        self.assertTrue(self.load([self.record, self.record])[1])
        for key, value in [('status', 'approved-ish'), ('path', '../outside.md'), ('path', '/etc/passwd')]:
            record = dict(self.record, **{key: value})
            self.assertTrue(self.load([record])[1])
        (self.root / 'alias.md').symlink_to(self.root / 'template.md')
        self.assertTrue(self.load([dict(self.record, path='alias.md')])[1])

    def test_repository_ledger_covers_exact_migration_denominator(self):
        root = Path(__file__).resolve().parents[1]
        inventory = json.loads((root / 'meta/migration-inventory.json').read_text())
        records = json.loads((root / REVIEW_FILE).read_text())['templates']
        expected = {move['destination'] for move in inventory['moves']}
        self.assertEqual({record['path'] for record in records}, expected)
        self.assertEqual(len(records), len(expected))
        self.assertFalse(load_reviews(root, TODAY)[1])

    def test_missing_or_malformed_manifest(self):
        self.assertEqual(load_reviews(self.root, TODAY), ({}, []))
        (self.root / REVIEW_FILE).write_text('[]')
        self.assertTrue(load_reviews(self.root, TODAY)[1])
        (self.root / REVIEW_FILE).write_text('{broken')
        self.assertTrue(load_reviews(self.root, TODAY)[1])


if __name__ == '__main__':
    unittest.main()
