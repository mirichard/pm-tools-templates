"""Validate content-bound review evidence independently of modification dates."""
from datetime import date
import hashlib
import json
from pathlib import Path
import re

REVIEW_FILE = 'meta/template-content-reviews.json'
STATUSES = {'reviewed', 'pending', 'needs-revision', 'specialist-review'}


def load_reviews(root, today=None):
    """Return completed review records and errors; pending work never clears age debt."""
    root = Path(root).resolve()
    today = today or date.today()
    file = root / REVIEW_FILE
    if not file.exists():
        return {}, []
    try:
        data = json.loads(file.read_text())
        if not isinstance(data, dict) or data.get('version') != 1 or not isinstance(data.get('templates'), list):
            raise ValueError('expected version 1 and templates array')
    except (OSError, ValueError) as exc:
        return {}, [f'{REVIEW_FILE}: {exc}']
    reviews, errors, seen = {}, [], set()
    for record in data['templates']:
        try:
            if not isinstance(record, dict):
                raise ValueError('record must be an object')
            path = record.get('path')
            if not isinstance(path, str) or not path or path in seen:
                raise ValueError('missing or duplicate path')
            seen.add(path)
            candidate = root / path
            if (Path(path).is_absolute() or '..' in Path(path).parts
                    or candidate.is_symlink() or not candidate.resolve().is_relative_to(root)
                    or not candidate.is_file()):
                raise ValueError('path must identify a regular repository file')
            if record.get('status') not in STATUSES:
                raise ValueError('invalid review status')
            if record['status'] != 'reviewed':
                continue
            reviewed = date.fromisoformat(str(record.get('reviewed', '')))
            if reviewed > today:
                raise ValueError('review date cannot be in the future')
            if record.get('scope') != 'full-content':
                raise ValueError('only full-content reviews establish freshness')
            if not isinstance(record.get('reviewer'), str) or not record['reviewer'].strip():
                raise ValueError('reviewer is required')
            evidence = record.get('evidence')
            if (not isinstance(evidence, list) or not evidence
                    or any(not isinstance(item, str) or not item.strip() for item in evidence)):
                raise ValueError('specific review evidence is required')
            digest = record.get('sha256', '')
            if (not isinstance(digest, str) or not re.fullmatch(r'[0-9a-f]{64}', digest)
                    or hashlib.sha256(candidate.read_bytes()).hexdigest() != digest):
                raise ValueError('review hash does not match current content; review the changes')
            reviews[path] = record
        except (OSError, ValueError, TypeError) as exc:
            label = record.get('path', '<record>') if isinstance(record, dict) else '<record>'
            errors.append(f'{REVIEW_FILE}: {label}: {exc}')
    return reviews, errors
