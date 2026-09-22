#!/usr/bin/env python3
"""Capture JavaScript audits without treating tool failures as clean reports."""
import argparse
from collections import Counter
import json
from pathlib import Path
import subprocess
import time

SEVERITIES = ('info', 'low', 'moderate', 'high', 'critical')


def counts(value):
    if not isinstance(value, dict) or any(type(value.get(k)) is not int or value[k] < 0 for k in SEVERITIES):
        raise ValueError('invalid vulnerability counts')
    return sum(value[k] for k in SEVERITIES)


def validate_report(manager, output, exit_code):
    if manager == 'npm':
        data = json.loads(output)
        if not isinstance(data, dict) or 'error' in data or type(data.get('auditReportVersion')) is not int or data['auditReportVersion'] != 2:
            raise ValueError('invalid npm audit envelope')
        findings = data.get('vulnerabilities')
        totals = data.get('metadata', {}).get('vulnerabilities')
        total = counts(totals)
        if type(totals.get('total')) is not int or totals['total'] != total or not isinstance(findings, dict) or len(findings) != total:
            raise ValueError('inconsistent npm vulnerability totals')
        actual = Counter()
        for finding in findings.values():
            if not isinstance(finding, dict) or finding.get('severity') not in SEVERITIES:
                raise ValueError('invalid npm vulnerability entry')
            actual[finding['severity']] += 1
        if any(actual[k] != totals[k] for k in SEVERITIES):
            raise ValueError('inconsistent npm severity counts')
        expected_exit = int(total > 0)
    else:
        # Yarn Classic emits newline-delimited events, not one JSON document.
        events = [json.loads(line) for line in output.splitlines() if line.strip()]
        if any(not isinstance(e, dict) or e.get('type') == 'error' for e in events):
            raise ValueError('invalid Yarn audit events')
        summaries = [e.get('data') for e in events if e.get('type') == 'auditSummary']
        if len(summaries) != 1 or not isinstance(summaries[0], dict):
            raise ValueError('missing or duplicate Yarn audit summary')
        totals = summaries[0].get('vulnerabilities')
        total = counts(totals)
        expected_exit = sum(1 << i for i, severity in enumerate(SEVERITIES) if totals[severity])
    if exit_code != expected_exit:
        raise ValueError(f'audit exit {exit_code} conflicts with report (expected {expected_exit})')
    return total


def run_audit(directory, output, attempts=3, retry_delay=5):
    directory, output = Path(directory).resolve(), Path(output).resolve()
    manager = 'yarn' if (directory / 'yarn.lock').is_file() else 'npm'
    command = ['yarn', 'audit', '--json'] if manager == 'yarn' else ['npm', 'audit', '--json', '--audit-level=info']
    output.unlink(missing_ok=True)
    reason = 'audit did not run'
    for attempt in range(1, attempts + 1):
        try:
            result = subprocess.run(command, cwd=directory, capture_output=True, text=True, timeout=60, check=False)
            output.with_name(f'{output.stem}.attempt-{attempt}.stdout.json').write_text(result.stdout)
            output.with_name(f'{output.stem}.attempt-{attempt}.stderr.log').write_text(result.stderr)
            total = validate_report(manager, result.stdout, result.returncode)
            output.write_text(json.dumps({'status': 'complete', 'package_manager': manager,
                'total_vulnerabilities': total, 'audit_exit_code': result.returncode}, indent=2) + '\n')
            print(f'{manager} audit completed: {total} vulnerable dependencies')
            return 0
        except (OSError, subprocess.TimeoutExpired, ValueError, TypeError, AttributeError) as error:
            reason = str(error)
            print(f'Audit attempt {attempt}/{attempts} failed: {reason}', flush=True)
            if attempt < attempts:
                time.sleep(retry_delay)
    output.write_text(json.dumps({'status': 'operational_error', 'package_manager': manager,
        'total_vulnerabilities': None, 'error': reason}, indent=2) + '\n')
    return 2


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--directory', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--attempts', type=int, choices=range(1, 4), default=3)
    parser.add_argument('--retry-delay', type=float, default=5)
    args = parser.parse_args()
    if args.retry_delay < 0:
        parser.error('--retry-delay must be nonnegative')
    raise SystemExit(run_audit(args.directory, args.output, args.attempts, args.retry_delay))
