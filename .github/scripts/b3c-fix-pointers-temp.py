import json
import os
import pathlib
import re

manifest = json.loads(pathlib.Path('meta/migration-waves/b3c.json').read_text())
for asset in manifest['assets']:
    source = asset['source']
    destination = asset['destination']
    path = pathlib.Path(source)
    relative = os.path.relpath(destination, start=os.path.dirname(source) or '.').replace(os.sep, '/')
    text = path.read_text()
    updated, count = re.subn(
        r'(^\s*\*{0,2}Canonical location:?\*{0,2}\s*\[[^\]]+\]\()[^)]+(\))',
        rf'\g<1>{relative}\g<2>',
        text,
        count=1,
        flags=re.I | re.M,
    )
    if count != 1:
        raise SystemExit(f'canonical pointer not found exactly once: {source}')
    path.write_text(updated)
