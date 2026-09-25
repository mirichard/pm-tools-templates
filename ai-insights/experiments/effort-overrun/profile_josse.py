"""Profile the pinned JOSSE archive database without fitting or copying issue text."""
import argparse
from collections import Counter
import hashlib
import json
import math
from pathlib import Path
import re
import sqlite3
from urllib.parse import urlparse

SOURCE_SHA256 = '38f9ed6021889d99a322a62f878d202eed8dad278144807a4cd74ff58943a30f'


def profile(path):
    path = Path(path).resolve(strict=True)
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    if digest != SOURCE_SHA256:
        raise ValueError('Database does not match the reviewed Zenodo 7022735 snapshot')
    with sqlite3.connect(path.as_uri() + '?mode=ro', uri=True) as connection:
        if connection.execute('PRAGMA integrity_check').fetchone() != ('ok',):
            raise ValueError('Database integrity check failed')
        rows = connection.execute('SELECT id, reference, expert_estimated_effort, actual_effort FROM "case"').fetchall()
    paired = Counter()
    reasons = Counter()
    for key, reference, estimate, actual in rows:
        if not re.fullmatch(r'[A-Za-z][A-Za-z0-9_]*-\d+', key or ''):
            reasons['invalid_issue_key'] += 1
            continue
        if not all(isinstance(x, (float, int)) and math.isfinite(x) and x > 0 for x in (estimate, actual)):
            reasons['missing_or_nonpositive_effort_pair'] += 1
            continue
        host = urlparse(reference or '').hostname
        if not host:
            reasons['missing_source_host'] += 1
            continue
        paired[f'{host}/{key.rsplit("-", 1)[0]}'] += 1
    return {'doi': '10.5281/zenodo.7022735', 'sha256': digest, 'total_rows': len(rows),
            'paired_positive_rows': sum(paired.values()), 'paired_project_groups': len(paired),
            'excluded': dict(reasons), 'paired_by_project': dict(sorted(paired.items())),
            'has_timestamps': False, 'model_fitted': False}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('database', type=Path)
    args = parser.parse_args()
    print(json.dumps(profile(args.database), indent=2))
