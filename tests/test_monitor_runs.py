"""Bounded monitor API retrieval; no network requests."""
import importlib.util
import json
from datetime import datetime, timezone
from pathlib import Path
import subprocess
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('monitor', ROOT / 'scripts/fetch-monitor-runs.py')
monitor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(monitor)
NOW = datetime(2026, 9, 21, 12, tzinfo=timezone.utc)


class MonitorTests(unittest.TestCase):
    def test_server_window_and_complete_pagination(self):
        calls = []
        def request(repo, window, page):
            calls.append((repo, window, page))
            return {'total_count': 101, 'workflow_runs': [{'id': n} for n in (range(100) if page == 1 else [100])]}
        result = monitor.fetch_runs('owner/repo', 7, request, NOW)
        self.assertEqual(len(result), 101)
        self.assertEqual(len(calls), 2)
        self.assertEqual(calls[0][1], '2026-09-14T12:00:00Z..2026-09-21T12:00:00Z')

    def test_busy_window_is_split_without_overlapping_seconds(self):
        calls = []
        def request(repo, window, page):
            calls.append(window)
            if len(calls) == 1:
                return {'total_count': 1001, 'workflow_runs': []}
            return {'total_count': 1, 'workflow_runs': [{'id': len(calls)}]}
        result = monitor.fetch_runs('owner/repo', 1, request, NOW)
        self.assertEqual(len(result), 2)
        self.assertEqual(calls[1], '2026-09-20T12:00:00Z..2026-09-21T00:00:00Z')
        self.assertEqual(calls[2], '2026-09-21T00:00:01Z..2026-09-21T12:00:00Z')

    def test_budget_exhaustion_fails_without_returning_partial_data(self):
        calls = []
        def request(*args):
            calls.append(args)
            return {'total_count': 1001, 'workflow_runs': []}
        with patch.object(monitor, 'MAX_REQUESTS', 3):
            with self.assertRaisesRegex(ValueError, 'budget exhausted'):
                monitor.fetch_runs('owner/repo', 30, request, NOW)
        self.assertEqual(len(calls), 3)

    def test_maximum_complete_window_uses_ten_requests(self):
        calls = []
        def request(repo, window, page):
            calls.append(page)
            return {'total_count': 1000, 'workflow_runs': [{'id': n} for n in range((page - 1) * 100, page * 100)]}
        self.assertEqual(len(monitor.fetch_runs('owner/repo', 30, request, NOW)), 1000)
        self.assertEqual(len(calls), 10)

    def test_empty_and_inconsistent_data_fail(self):
        for data in [{'total_count': 0, 'workflow_runs': []}, {'total_count': 2, 'workflow_runs': [{'id': 1}]}]:
            with self.subTest(data=data), self.assertRaises(ValueError):
                monitor.fetch_runs('owner/repo', 1, lambda *args: data, NOW)

    def test_rate_limit_is_not_retried(self):
        with patch.object(monitor.subprocess, 'run', return_value=subprocess.CompletedProcess([], 1, '', 'API rate limit exceeded')) as run:
            with self.assertRaisesRegex(RuntimeError, 'no automatic retry'):
                monitor.fetch_runs('owner/repo', 1, monitor.request, NOW)
            self.assertEqual(run.call_count, 1)

    def test_gh_request_uses_get_filter_and_no_automatic_pagination(self):
        with patch.object(monitor.subprocess, 'run', return_value=subprocess.CompletedProcess([], 0, json.dumps({'total_count': 1, 'workflow_runs': [{'id': 1}]}), '')) as run:
            monitor.fetch_runs('owner/repo', 1, monitor.request, NOW)
            args = run.call_args.args[0]
            self.assertIn('GET', args)
            self.assertIn('created=2026-09-20T12:00:00Z..2026-09-21T12:00:00Z', args)
            self.assertIn('per_page=100', args)
            self.assertNotIn('--paginate', args)


if __name__ == '__main__':
    unittest.main()
