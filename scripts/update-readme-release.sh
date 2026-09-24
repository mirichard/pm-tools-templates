#!/usr/bin/env bash
# Refresh only the README release reference from the reviewed manifest.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 - <<'PY'
from pathlib import Path
import re
from scripts.release_management import validate

root = Path('.')
current = validate(root)['current']
label = f"v{current['version']}"
if current['tag'] != label:
    label += f" ({current['tag']})"
replacement = (f'The latest published repository release is [{label}]'
               f"(https://github.com/mirichard/pm-tools-templates/releases/tag/{current['tag']})")
p = root / 'README.md'
text, count = re.subn(r'The latest published repository release is \[[^\]]+\]\([^)]+\)',
                      lambda _: replacement, p.read_text())
if count != 1:
    raise SystemExit('Expected exactly one README release reference; no changes written')
p.write_text(text)
print('README release reference matches release.json; review before committing.')
PY
