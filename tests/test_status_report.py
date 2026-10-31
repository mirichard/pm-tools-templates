import importlib.util
import json
from pathlib import Path
import subprocess
import unittest
from unittest.mock import patch
from datetime import datetime, timezone

spec = importlib.util.spec_from_file_location("status_report", Path(__file__).parents[1] / "scripts/status_report.py")
report = importlib.util.module_from_spec(spec)
spec.loader.exec_module(report)
NOW = datetime(2026, 10, 30, tzinfo=timezone.utc)


def issue(n, state="open"):
    return {"number": n, "title": f"Issue {n}", "state": state,
            "closed_at": "2026-10-29T00:00:00Z" if state == "closed" else None,
            "labels": []}


class StatusReportTests(unittest.TestCase):
    def test_all_pages_exclude_prs_and_reconcile_totals(self):
        pages = [[issue(n) for n in range(1, 101)], [issue(101, "closed"), dict(issue(102), pull_request={})]]
        with patch.object(report.subprocess, "run", return_value=subprocess.CompletedProcess([], 0, json.dumps(pages))) as run:
            items = report.collect("owner/repo")
        self.assertIn("--paginate", run.call_args.args[0])
        metrics, recent, _ = report.summarize(items, NOW)
        self.assertEqual((metrics["total_issues"], metrics["open_issues"], metrics["closed_issues"]), (101, 100, 1))
        self.assertEqual(metrics["recent_closed"], len(recent))

    def test_failed_collection_does_not_become_zero(self):
        with patch.object(report.subprocess, "run", side_effect=subprocess.CalledProcessError(1, "gh")):
            with self.assertRaises(subprocess.CalledProcessError):
                report.collect("owner/repo")

    def test_recent_list_and_metrics_share_one_snapshot(self):
        items = [issue(1, "closed"), issue(2), issue(3, "closed")]
        items[2]["closed_at"] = "2026-01-01T00:00:00Z"
        items[1]["labels"] = [{"name": "priority-high"}, {"name": "high-priority"}]
        text, data = report.render(items, NOW, "weekly", "agile", "owner/repo")
        self.assertEqual(data["recent_closed_numbers"], [1])
        self.assertEqual(data["metrics"]["high_priority"], 1)
        self.assertIn("Recently closed issues (1)", text)
        self.assertIn("not sprint/release completion", text)
        self.assertNotIn("105%", text)
        self.assertEqual(data["health_indicators"]["overall_health"], "not_assessed")

    def test_empty_and_duplicate_snapshots(self):
        self.assertEqual(report.summarize([], NOW)[0]["completion_rate"], 0)
        with self.assertRaises(ValueError):
            report.summarize([issue(1), issue(1)], NOW)

    def test_invalid_state_and_future_closure(self):
        with self.assertRaises(ValueError):
            report.summarize([issue(1, "unknown")], NOW)
        future = issue(1, "closed")
        future["closed_at"] = "2027-01-01T00:00:00Z"
        self.assertEqual(report.summarize([future], NOW)[0]["recent_closed"], 0)


if __name__ == "__main__":
    unittest.main()
