#!/usr/bin/env python3
import hashlib
import json
import os
from pathlib import Path

root = Path('.')
manifest_path = root / 'meta/migration-waves/b3b.json'
m = json.loads(manifest_path.read_text())
assets = m['assets']
mapping = {a['source']: a['destination'] for a in assets}
evidence = 'docs/vnext/sprint-12/b3b-migration-record.md'
pre_sha = m['pre_batch_sha']

for a in assets:
    src = root / a['source']
    dst = root / a['destination']
    assert src.is_file(), f'missing source: {src}'
    assert not dst.exists(), f'destination already exists: {dst}'
    digest = hashlib.sha256(src.read_bytes()).hexdigest()
    assert digest == a['pre_move_sha256'], (a['source'], digest, a['pre_move_sha256'])

for a in assets:
    src = root / a['source']
    dst = root / a['destination']
    body = src.read_bytes()
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_bytes(body)
    lines = body.decode('utf-8').splitlines()
    title = next((ln[2:].strip() for ln in lines if ln.startswith('# ')), Path(a['source']).stem.replace('_', ' ').title())
    rel = os.path.relpath(dst, start=src.parent).replace(os.sep, '/')
    pointer = (
        f'# {title} — Moved\n\n'
        '## Purpose and overview\n\n'
        f'This legacy path is retained so existing repository links and external bookmarks continue to reach the {title} after its domain migration. '
        'The maintained canonical template now resides in the Delivery domain; this file contains navigation guidance only and is not a second template copy.\n\n'
        f'**Canonical location:** [Open the {title}]({rel})\n\n'
        '## Usage instructions\n\n'
        'Follow the canonical-location link above to view, copy, or update the template. Update only the canonical file when proposing content changes. '
        'References to this legacy path remain supported for backward compatibility, but new documentation and catalog entries should link directly to the canonical domain path.\n'
    )
    src.write_text(pointer)

catalog_path = root / 'templates/templates.json'
catalog = json.loads(catalog_path.read_text())
for template in catalog.get('templates', []):
    old = template.get('path')
    if old in mapping:
        template['path'] = mapping[old]
        alts = template.setdefault('alternate_paths', [])
        if old not in alts:
            alts.append(old)

def replace_nested_paths(obj):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == 'alternate_paths':
                continue
            if isinstance(v, str) and v in mapping:
                obj[k] = mapping[v]
            else:
                replace_nested_paths(v)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            if isinstance(v, str) and v in mapping:
                obj[i] = mapping[v]
            else:
                replace_nested_paths(v)

replace_nested_paths(catalog)
catalog_path.write_text(json.dumps(catalog, indent=2) + '\n')

for p in ['meta/domain-mapping.json', 'meta/cross-references.json', 'meta/value-flow-mapping.json']:
    path = root / p
    text = path.read_text()
    for old, new in mapping.items():
        text = text.replace(f'"{old}"', f'"{new}"')
    path.write_text(text)

inv_path = root / 'meta/migration-inventory.json'
inv = json.loads(inv_path.read_text())
selected = set(mapping)
touched = 0
for rec in inv['moves']:
    deps = rec.get('dependencies')
    if isinstance(deps, list):
        rec['dependencies'] = [mapping.get(x, x) for x in deps]
    if rec.get('source') in selected:
        a = next(a for a in assets if a['source'] == rec['source'])
        rec['action'] = 'executed-move-with-legacy-pointer'
        rec['execution'] = {
            'batch_id': 'B3B',
            'pre_batch_sha': pre_sha,
            'pre_move_source_sha256': a['pre_move_sha256'],
            'evidence_file': evidence,
            'rollback_owner': m['rollback_owner'],
        }
        touched += 1
assert touched == 11, touched
executions = inv['batch_execution_records']
assert not any(x.get('batch_id') == 'B3B' for x in executions), 'duplicate B3B batch execution'
executions.append({
    'batch_id': 'B3B',
    'issue': '#1057',
    'parent_issue': '#711',
    'asset_count': len(assets),
    'status': 'executed',
    'evidence_file': evidence,
    'rollback_owner': m['rollback_owner'],
})
inv_path.write_text(json.dumps(inv, indent=2) + '\n')

text_files = [root / 'TEMPLATE_INDEX.md']
for base in [root / 'docs/decision-engine', root / 'docs/templates']:
    if base.exists():
        text_files.extend(base.rglob('*.md'))
for path in text_files:
    text = path.read_text()
    changed = text
    for old, new in mapping.items():
        changed = changed.replace(old, new)
    if changed != text:
        path.write_text(changed)

m['phase'] = 'executed'
manifest_path.write_text(json.dumps(m, indent=2) + '\n')
print(f'Executed {len(assets)} B3B assets')
