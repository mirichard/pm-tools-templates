#!/usr/bin/env python3
"""Fail closed when the real Clean Status report/email output is incomplete."""
from datetime import date
from html.parser import HTMLParser
import os
from pathlib import Path


def validate(report, email):
    for section in ('## Executive Summary', '## Key Highlights', '## Detailed Metrics'):
        if section not in report:
            raise ValueError(f'Missing report section: {section}')
    if '${{' in email or '${' in email:
        raise ValueError('Unexpanded email interpolation')
    parser = HTMLParser()
    parser.feed(email)
    for marker in ('<!DOCTYPE html>', '<html>', '</html>', 'Program Status Update',
                   'Full Status Report'):
        if marker not in email:
            raise ValueError(f'Missing email content: {marker}')


if __name__ == '__main__':
    report_type = os.environ['REPORT_TYPE']
    if report_type not in ('weekly', 'monthly', 'sprint', 'milestone'):
        raise ValueError('Unsupported report type')
    report = Path(f'reports/status/{report_type}-status-{date.today()}.md').read_text()
    validate(report, Path('email/status-email.html').read_text())
    print('Generated report and email content validated; this validator sends no email.')
