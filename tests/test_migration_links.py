import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("checker", Path(__file__).resolve().parents[1] / "scripts/check_migration_links.py")
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)


class MigrationLinksTests(unittest.TestCase):
    def test_missing_file_and_fragment_are_detected(self):
        files = {"a.md": "# Intro\n# Intro\n<a id='explicit'></a>"}
        count, failures = checker.check("[ok](a.md#intro-1) [ok](a.md#explicit) [bad](a.md#absent) [bad](missing.md)", "index.md", files.__getitem__, files.__contains__)
        self.assertEqual(count, 4)
        self.assertEqual(sum(failures.values()), 2)

    def test_fences_external_urls_and_encoded_paths(self):
        files = {"a b.md": "# Intro"}
        count, failures = checker.check("```md\n[x](missing.md)\n```\n[x](https://example.com) [ok](a%20b.md#intro)", "index.md", files.__getitem__, files.__contains__)
        self.assertEqual(count, 1)
        self.assertFalse(failures)

    def test_move_breaks_previously_valid_relative_link(self):
        files = {"legacy/related.md": "# Related"}
        text = "[related](related.md)"
        _, before = checker.check(text, "legacy/template.md", files.__getitem__, files.__contains__)
        _, after = checker.check(text, "domains/legacy/template.md", files.__getitem__, files.__contains__)
        self.assertFalse(before)
        self.assertEqual(sum((after - before).values()), 1)


if __name__ == "__main__":
    unittest.main()
