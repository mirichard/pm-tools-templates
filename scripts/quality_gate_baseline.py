#!/usr/bin/env python3
"""Resolve verified migration sources for the quality gate's existing debt policy."""
import argparse
import hashlib
import hmac
import json
import os
from pathlib import Path
import posixpath
import re
import stat
import subprocess

if __package__:
    from .migration_pointer import pointer_errors
else:
    from migration_pointer import pointer_errors


def git_bytes(root, base, path):
    return subprocess.check_output(['git', '-C', str(root), 'show', f'{base}:{path}'],
                                   stderr=subprocess.DEVNULL)


def regular_bytes(root, path):
    if not isinstance(path, str) or path.startswith('/') or '..' in Path(path).parts:
        raise ValueError('Invalid repository path')
    with os.fdopen(os.open(root / path, os.O_RDONLY | os.O_NOFOLLOW), 'rb') as stream:
        if not stat.S_ISREG(os.fstat(stream.fileno()).st_mode):
            raise ValueError('Expected regular file')
        return stream.read()


def migration_sources(root, base):
    """Only transfer debt for a preplanned, hash-preserved move with its pointer."""
    root = Path(root)
    previous = json.loads(git_bytes(root, base, 'meta/migration-inventory.json'))
    current = json.loads((root / 'meta/migration-inventory.json').read_text())
    catalog = json.loads(git_bytes(root, base, 'templates/templates.json'))
    primary = {t.get('canonical_path') or t['path'] for t in catalog['templates']}
    planned = {m['source']: m for m in previous['moves']}
    result = {}
    for move in current['moves']:
        source, destination = move.get('source'), move.get('destination')
        old = planned.get(source, {})
        if (source not in primary or old.get('action') != 'planned-move-not-executed'
                or old.get('destination') != destination
                or move.get('action') != 'executed-move-with-legacy-pointer'):
            continue
        try:
            body = git_bytes(root, base, source)
            digest = move.get('execution', {}).get('pre_move_source_sha256')
            if not hmac.compare_digest(hashlib.sha256(body).hexdigest(), digest) or not hmac.compare_digest(regular_bytes(root, destination), body):
                continue
            pointer = regular_bytes(root, source).decode()
            if pointer_errors(root, source, pointer):
                continue
            target = re.search(r'\*\*Canonical location:\*\*\s*\[[^\]]+\]\(([^)]+)\)', pointer)
            if not target or posixpath.normpath(posixpath.join(posixpath.dirname(source), target[1].removeprefix('<').removesuffix('>'))) != destination:
                continue
            result[destination] = source
        except (OSError, ValueError, subprocess.CalledProcessError):
            continue
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    Path(args.output).write_text(json.dumps(migration_sources(Path.cwd(), args.base)))


if __name__ == '__main__':
    main()
