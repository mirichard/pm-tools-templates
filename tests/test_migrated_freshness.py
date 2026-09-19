import hashlib
import json
from pathlib import Path
import tempfile
import unittest
from datetime import date
from scripts.check_migrated_freshness import check


class MigratedFreshnessTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        (self.root / 'meta').mkdir()
        self.path = 'template.md'
        (self.root / self.path).write_text('---\ntitle: Example\nmethodology: universal\ncomplexity: starter\nowner: owner\nupdated: 2024-01-01\n---\n# Example\n')
        self.moves = [{'destination': self.path, 'action': 'executed-move-with-legacy-pointer'}]
        self.records = [dict(path=self.path, status='reviewed', reviewed='2026-09-19',
                             scope='full-content', reviewer='Reviewer', evidence=['Reviewed instructions'],
                             sha256=hashlib.sha256((self.root / self.path).read_bytes()).hexdigest())]

    def run_check(self, today=date(2026, 9, 19)):
        (self.root / 'meta/migration-inventory.json').write_text(json.dumps({'moves': self.moves}))
        (self.root / 'meta/template-content-reviews.json').write_text(json.dumps({'version': 1, 'templates': self.records}))
        return check(self.root, today)

    def test_current_review_preserves_old_modification_date(self):
        result = self.run_check()
        self.assertEqual((result['migrated'], result['reviewed']), (1, 1))
        self.assertEqual(result['errors'] + result['age_warnings'], [])

    def test_age_boundary_is_365_days(self):
        self.assertEqual(self.run_check(date(2027, 9, 19))['age_warnings'], [])
        self.assertEqual(len(self.run_check(date(2027, 9, 20))['age_warnings']), 1)

    def test_missing_review_cannot_drop_denominator(self):
        self.records.clear()
        result = self.run_check()
        self.assertEqual(result['migrated'], 1)
        self.assertTrue(result['errors'])
        self.assertTrue(result['age_warnings'])

    def test_pending_does_not_clear_age(self):
        self.records[0]['status'] = 'pending'
        result = self.run_check()
        self.assertEqual(result['reviewed'], 0)
        self.assertTrue(result['errors'] and result['age_warnings'])

    def test_content_change_invalidates_review(self):
        with (self.root / self.path).open('a') as stream:
            stream.write('Changed instructions.\n')
        result = self.run_check()
        self.assertEqual(result['reviewed'], 0)
        self.assertTrue(any('hash' in e for e in result['errors']))

    def test_future_review_is_invalid(self):
        result = self.run_check(date(2026, 9, 18))
        self.assertTrue(any('future' in e for e in result['errors']))

    def test_empty_or_duplicate_inventory_is_invalid(self):
        self.moves *= 2
        self.assertTrue(self.run_check()['errors'])
        self.moves.clear()
        self.assertTrue(self.run_check()['errors'])

    def test_missing_body_fails(self):
        (self.root / self.path).unlink()
        self.assertTrue(self.run_check()['errors'])
