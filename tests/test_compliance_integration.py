"""Verify navigable, complete compliance overlays (not legal conformity)."""
import re
import unittest
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
GUIDE = ROOT / "docs/governance/compliance-integration-framework.md"


class ComplianceIntegrationTests(unittest.TestCase):
    def test_local_integration_links_resolve(self):
        for path in (GUIDE, ROOT / "README_COMPLIANCE.md", ROOT / ".compliance_scripts/README.md"):
            links = re.findall(r"\[[^\]]+\]\(([^)]+)\)", path.read_text())
            for target in links:
                parsed = urlsplit(target)
                if parsed.scheme or not parsed.path:
                    continue
                with self.subTest(document=path.name, target=target):
                    self.assertTrue((path.parent / parsed.path).is_file())

    def test_each_framework_maps_existing_artifacts_and_primary_sources(self):
        text = GUIDE.read_text()
        frameworks = {
            "GDPR": "eur-lex.europa.eu",
            "HIPAA": "www.hhs.gov",
            "SOX": "www.ecfr.gov",
            "ISO/IEC 27001": "www.iso.org",
            "NIST CSF 2.0": "www.nist.gov",
        }
        sections = dict(re.findall(r"^## ([^\n]+)\n(.*?)(?=^## |\Z)", text, re.M | re.S))
        for name, authority in frameworks.items():
            with self.subTest(framework=name):
                section = sections[name]
                urls = re.findall(r"\[[^\]]+\]\(([^)]+)\)", section)
                self.assertIn(authority, {urlsplit(url).netloc for url in urls})
                artifact_rows = [line for line in section.splitlines() if line.startswith("| ") and "](" in line]
                self.assertGreaterEqual(len(artifact_rows), 3)
                for row in artifact_rows:
                    cells = row.strip("|").split("|")
                    self.assertEqual(len(cells), 3)
                    self.assertTrue(all(cell.strip() for cell in cells))

    def test_nist_mapping_covers_all_six_functions(self):
        text = GUIDE.read_text().split("## NIST CSF 2.0\n", 1)[1].split("\n## ", 1)[0]
        rows = re.findall(r"^\| (Govern|Identify|Protect|Detect|Respond|Recover) \|", text, re.M)
        self.assertCountEqual(rows, ["Govern", "Identify", "Protect", "Detect", "Respond", "Recover"])


if __name__ == "__main__":
    unittest.main()
