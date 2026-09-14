"""Verify that relocated inherited debt never exempts changed or unplanned bodies."""
import hashlib
import json
import unittest
from scripts import quality_gate_baseline as baseline
from tests import test_template_metadata as fixtures

POINTER, VALID = fixtures.POINTER, fixtures.VALID


class QualityBaselineTests(unittest.TestCase):
    write = fixtures.MetadataTests.write
    git = fixtures.MetadataTests.git
    commit = fixtures.MetadataTests.commit

    def setUp(self):
        fixtures.MetadataTests.setUp(self)
        self.source = 'templates/body with spaces.md'
        self.destination = 'domains/measurement/body.md'
        self.move = dict(source=self.source, destination=self.destination, action='planned-move-not-executed')
        self.save_inventory()
        # A prior navigation file at the destination must not become the baseline.
        self.write(self.destination, '# Compatibility Navigation\nPurpose and usage\n')
        self.base = self.commit()
        self.write(self.destination, VALID)
        self.write(self.source, POINTER.replace('body with spaces.md', '../' + self.destination))
        self.move.update(action='executed-move-with-legacy-pointer',
                         execution={'pre_move_source_sha256': hashlib.sha256(VALID.encode()).hexdigest()})
        self.save_inventory()

    def save_inventory(self):
        self.write('meta/migration-inventory.json', json.dumps({'moves': [self.move]}))

    def test_original_source_replaces_previous_navigation_baseline(self):
        self.assertEqual(baseline.migration_sources(self.root, self.base), {self.destination: self.source})

    def test_changed_body_receives_no_debt_transfer(self):
        self.write(self.destination, VALID + 'Changed\n')
        self.assertEqual(baseline.migration_sources(self.root, self.base), {})

    def test_wrong_hash_receives_no_debt_transfer(self):
        self.move['execution']['pre_move_source_sha256'] = '0' * 64
        self.save_inventory()
        self.assertEqual(baseline.migration_sources(self.root, self.base), {})

    def test_wrong_pointer_receives_no_debt_transfer(self):
        self.write(self.source, POINTER)
        self.assertEqual(baseline.migration_sources(self.root, self.base), {})

    def test_template_with_appended_canonical_link_receives_no_debt_transfer(self):
        self.write(self.source, VALID + '\n**Canonical location:** '
                   '[Open template](../' + self.destination + ')\n')
        self.assertEqual(baseline.migration_sources(self.root, self.base), {})

    def test_invalid_navigation_receives_no_debt_transfer(self):
        pointer = POINTER.replace('body with spaces.md', '../' + self.destination)
        variants = {
            'extra link': pointer + '\n[Another link](../' + self.destination + ')\n',
            'template list': pointer + '\n- Template body item\n',
            'oversized body': pointer + '\n' + 'x' * 2201,
            'missing declaration': pointer.replace('navigation guidance only', 'a template'),
        }
        for name, content in variants.items():
            with self.subTest(name=name):
                self.write(self.source, content)
                self.assertEqual(baseline.migration_sources(self.root, self.base), {})

    def test_unplanned_destination_receives_no_debt_transfer(self):
        self.move['destination'] = 'domains/measurement/other.md'
        self.write(self.move['destination'], VALID)
        self.save_inventory()
        self.assertEqual(baseline.migration_sources(self.root, self.base), {})

    def test_symlink_receives_no_debt_transfer(self):
        path = self.root / self.destination
        path.unlink()
        self.write('other.md', VALID)
        path.symlink_to(self.root / 'other.md')
        self.assertEqual(baseline.migration_sources(self.root, self.base), {})


if __name__ == '__main__':
    unittest.main()
