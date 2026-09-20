"""Guard delivery guidance navigation and honest optional metric output."""
import re
import unittest
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]


class ProductAcceptanceTests(unittest.TestCase):
    def test_delivery_guides_link_to_existing_files_and_anchors(self):
        files = list((ROOT / 'docs/delivery').glob('*.md'))
        files += [ROOT / 'metrics/README.md', ROOT / 'project-lifecycle/05-closure/transition-to-operations/README.md']
        for path in files:
            for target in re.findall(r'\[[^\]]+\]\(([^)]+)\)', path.read_text()):
                url = urlsplit(target)
                if url.scheme or not url.path:
                    continue
                resolved = path.parent / url.path
                with self.subTest(document=str(path.relative_to(ROOT)), target=target):
                    self.assertTrue(resolved.exists())
                    if url.fragment and resolved.is_file():
                        body = resolved.read_text()
                        headings = re.findall(r'^#+\s+(.+)$', body, re.M)
                        anchors = {re.sub(r'[^\w\- ]', '', h.lower()).replace(' ', '-') for h in headings}
                        anchors.update(re.findall(r'<a id="([^"]+)"', body))
                        self.assertIn(url.fragment, anchors)

    def test_original_delivery_stages_have_complete_loop_rows(self):
        body = (ROOT / 'docs/delivery/feedback-loop-architecture.md').read_text()
        for stage in ('Ideation', 'Planning', 'Execution', 'Delivery', 'Post-delivery'):
            rows = [r for r in body.splitlines() if r.startswith('| ' + stage + ' |')]
            with self.subTest(stage=stage):
                self.assertEqual(len(rows), 1)
                cells = rows[0].strip('|').split('|')
                self.assertEqual(len(cells), 4)
                self.assertTrue(all(c.strip() for c in cells))
                self.assertRegex(rows[0], r'\]\([^)]+\)')

    def test_existing_producers_do_not_invent_flow_observations(self):
        for filename in ('status-reporting.yml', 'weekly-status-email.yml'):
            body = (ROOT / '.github/workflows' / filename).read_text()
            with self.subTest(producer=filename):
                self.assertEqual(body.count('"flow_metrics": null,'), 1)
                self.assertIn('"recent_closed":', body)
                self.assertIn('"health_indicators":', body)


if __name__ == '__main__':
    unittest.main()
