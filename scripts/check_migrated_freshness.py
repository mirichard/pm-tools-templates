#!/usr/bin/env python3
"""Require current, content-bound reviews for the complete migrated inventory."""
import argparse
from datetime import date
import json
from pathlib import Path

if __package__:
    from .lint_template_metadata import metadata
    from .template_reviews import load_reviews
else:
    from lint_template_metadata import metadata
    from template_reviews import load_reviews


def check(root, today=None):
    root = Path(root)
    today = today or date.today()
    inventory = json.loads((root / 'meta/migration-inventory.json').read_text())
    paths = [m['destination'] for m in inventory['moves']
             if m['action'] == 'executed-move-with-legacy-pointer']
    reviews, errors = load_reviews(root, today)
    if not paths or len(set(paths)) != len(paths):
        errors.append('Migration inventory must contain unique executed destinations')
    warnings = []
    reviewed = 0
    for path in sorted(set(paths)):
        record = reviews.get(path)
        if not record:
            errors.append(f'{path}: missing validated full-content review')
        else:
            reviewed += 1
        try:
            content = (root / path).read_text()
        except OSError as exc:
            errors.append(f'{path}: {exc}')
            continue
        found, stale = metadata(content, today, record.get('reviewed') if record else None)
        errors.extend(f'{path}: {item}' for item in found)
        warnings.extend(f'{path}: {item}' for item in stale)
    return dict(date=today.isoformat(), migrated=len(paths), reviewed=reviewed,
                errors=errors, age_warnings=warnings)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--json-output')
    args = parser.parse_args()
    result = check(Path.cwd())
    print(json.dumps(result, indent=2))
    if args.json_output:
        Path(args.json_output).write_text(json.dumps(result, indent=2) + '\n')
    return bool(result['errors'] or result['age_warnings'])


if __name__ == '__main__':
    raise SystemExit(main())
