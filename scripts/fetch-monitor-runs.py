"""Fetch a complete server-filtered window within a fixed Actions API budget."""
import argparse
from datetime import datetime, timedelta, timezone
import json
from pathlib import Path
import subprocess

MAX_REQUESTS = 120
MAX_WINDOW_RUNS = 1000
PAGE_SIZE = 100


def fetch_runs(repository, days, request, now=None):
    now = (now or datetime.now(timezone.utc)).replace(microsecond=0)
    pending = [(now - timedelta(days=days), now)]
    all_runs = {}
    requests = 0

    def page_request(window, page):
        nonlocal requests
        if requests >= MAX_REQUESTS:
            raise ValueError('Monitoring unavailable: request budget exhausted; no partial health score generated')
        requests += 1
        return request(repository, window, page)

    while pending:
        start, end = pending.pop()
        window = f"{start.strftime('%Y-%m-%dT%H:%M:%SZ')}..{end.strftime('%Y-%m-%dT%H:%M:%SZ')}"
        data = page_request(window, 1)
        total = data['total_count']
        if total > MAX_WINDOW_RUNS:
            seconds = int((end - start).total_seconds())
            if seconds < 1:
                raise ValueError('Monitoring unavailable: too many runs in one second')
            middle = start + timedelta(seconds=seconds // 2)
            pending.extend([(middle + timedelta(seconds=1), end), (start, middle)])
            continue
        runs = {run['id']: run for run in data['workflow_runs']}
        for page in range(2, (total + PAGE_SIZE - 1) // PAGE_SIZE + 1):
            data = page_request(window, page)
            if data['total_count'] != total:
                raise ValueError('Monitoring unavailable: result count changed during pagination')
            runs.update((run['id'], run) for run in data['workflow_runs'])
        if len(runs) != total:
            raise ValueError('Monitoring unavailable: inconsistent pagination; no partial health score generated')
        all_runs.update(runs)
    if not all_runs:
        raise ValueError('Monitoring unavailable: no runs in the requested window')
    return list(all_runs.values())


def request(repository, window, page):
    result = subprocess.run([
        'gh', 'api', '--method', 'GET', f'repos/{repository}/actions/runs',
        '-f', f'created={window}', '-f', f'per_page={PAGE_SIZE}', '-f', f'page={page}',
    ], text=True, capture_output=True, check=False, timeout=60)
    if result.returncode:
        raise RuntimeError(f'Workflow API request failed; no automatic retry: {result.stderr.strip()}')
    return json.loads(result.stdout)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repository', required=True)
    parser.add_argument('--days', required=True, type=int, choices=[1, 7, 30])
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    # Write only after the complete bounded fetch succeeds. One object per line
    # matches downstream JSONL readers; pretty-printed objects do not.
    runs = fetch_runs(args.repository, args.days, request)
    Path(args.output).write_text(''.join(json.dumps(run) + '\n' for run in runs))
