"""Validate the event catalog's usable routing contract and integration links."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
GUIDE = ROOT / 'docs/governance/event-driven-controls.md'
NOTICES = ROOT / 'docs/governance/event-notifications.md'


def rows(text):
    return [[cell.strip() for cell in line.strip().strip('|').split('|')]
            for line in text.splitlines() if re.match(r'\| E\d{2} \|', line)]


class EventControlsTests(unittest.TestCase):
    def test_catalog_size_unique_ids_complete_routing(self):
        catalog = rows(GUIDE.read_text())
        self.assertGreaterEqual(len(catalog), 10)
        self.assertLessEqual(len(catalog), 15)
        ids = [row[0] for row in catalog]
        self.assertEqual(len(ids), len(set(ids)))
        for row in catalog:
            self.assertEqual(len(row), 6, row)
            self.assertTrue(all(cell and '[' not in cell for cell in row), row)
            self.assertIn(row[-1], ('Immediate', 'Urgent', 'Routine'))
            self.assertGreater(len(row[2]), 30)  # An actionable condition, not a title.
            self.assertGreater(len(row[3]), 30)
            self.assertGreater(len(row[4]), 20)

    def test_every_response_class_has_deadlines_and_escalation(self):
        text = GUIDE.read_text()
        for name in {row[-1] for row in rows(text)}:
            match = re.search(r'^\| ' + name + r' \| (.+)$', text, re.M)
            self.assertIsNotNone(match, name)
            fields = [cell.strip() for cell in match.group(1).strip('|').split('|')]
            self.assertEqual(len(fields), 3)
            self.assertRegex(fields[0], r'\d.*(?:hour|day)')
            self.assertRegex(fields[1], r'\d.*(?:hour|day)')
            self.assertIn('backup', fields[2].lower())

    def test_local_links_and_anchors_resolve(self):
        for source in (GUIDE, NOTICES):
            for link in re.findall(r'\]\(([^)]+)\)', source.read_text()):
                path, _, anchor = link.partition('#')
                target = (source.parent / path).resolve()
                with self.subTest(source=source.name, link=link):
                    self.assertTrue(target.is_file())
                    if anchor:
                        headings = re.findall(r'^#+ (.+)$', target.read_text(), re.M)
                        slugs = {re.sub(r'[^\w\- ]', '', heading.lower()).replace(' ', '-') for heading in headings}
                        self.assertIn(anchor, slugs)

    def test_notifications_keep_identity_deadlines_and_evidence(self):
        sections = re.split(r'^## ', NOTICES.read_text(), flags=re.M)[1:]
        self.assertEqual(len(sections), 3)
        for section in sections:
            self.assertIn('Occurrence ID / E01–E12', section)
            self.assertIn('Linked records:', section)
            self.assertIn('Timestamp', section)
        for section in sections[:2]:
            self.assertIn('Acknowledge by:', section)
            self.assertIn('Response plan due:', section)
        self.assertIn('Residual exposure:', sections[2])
        self.assertIn('Decision and authority:', sections[2])

    def test_monitoring_assets_link_catalog_and_notification_patterns(self):
        paths = (
            'domains/uncertainty/project-lifecycle/04-monitoring-control/progress-tracking/status-report-template.md',
            'domains/uncertainty/project-lifecycle/04-monitoring-control/progress-tracking/project-dashboard-template.md',
            'domains/uncertainty/project-lifecycle/02-planning/risk-management/risk-register-template.md',
        )
        for path in paths:
            source = ROOT / path
            text = source.read_text()
            self.assertEqual(text.count('## Event-driven governance handoff'), 1)
            for title, expected in (('event catalog and response process', GUIDE), ('alert, escalation and closure notifications', NOTICES)):
                match = re.search(r'\[' + re.escape(title) + r'\]\(([^)]+)\)', text)
                self.assertIsNotNone(match)
                self.assertEqual((source.parent / match.group(1)).resolve(), expected)


if __name__ == '__main__':
    unittest.main()
