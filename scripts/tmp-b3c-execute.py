#!/usr/bin/env python3
import hashlib
import json
import os
from pathlib import Path

root = Path('.')
manifest_path = root / 'meta/migration-waves/b3c.json'
manifest = json.loads(manifest_path.read_text())
assets = manifest['assets']
assert manifest['wave_id'] == 'B3C'
assert manifest['phase'] == 'entry'
assert manifest['asset_count'] == 10
mapping = {a['source']: a['destination'] for a in assets}
evidence = 'docs/vnext/sprint-12/b3c-migration-record.md'
pre_sha = manifest['pre_batch_sha']

policy = json.loads((root / 'meta/migration-reference-policy.json').read_text())
historical_prefixes = tuple(policy.get('historical_prefixes', []))
intentional_files = set(policy.get('intentional_exact_files', []))

def historical_or_intentional(rel: str) -> bool:
    return rel in intentional_files or rel.startswith(historical_prefixes)

def canonicalize_text(text: str) -> str:
    """Replace B3C legacy paths once while protecting already-canonical paths."""
    protected = {}
    for index, destination in enumerate(mapping.values()):
        token = f'__B3C_CANONICAL_PATH_{index}__'
        if destination in text:
            text = text.replace(destination, token)
            protected[token] = destination
    for source, destination in mapping.items():
        text = text.replace(source, destination)
    for token, destination in protected.items():
        text = text.replace(token, destination)
    return text

# Guard immutable source state before touching the tree.
for asset in assets:
    src = root / asset['source']
    dst = root / asset['destination']
    assert src.is_file(), f'missing source: {src}'
    assert not dst.exists(), f'destination already exists: {dst}'
    digest = hashlib.sha256(src.read_bytes()).hexdigest()
    assert digest == asset['pre_move_sha256'], (asset['source'], digest, asset['pre_move_sha256'])

# Copy canonical bodies byte-for-byte and replace legacy sources with navigation-only pointers.
for asset in assets:
    src = root / asset['source']
    dst = root / asset['destination']
    body = src.read_bytes()
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_bytes(body)
    lines = body.decode('utf-8').splitlines()
    title = next((line[2:].strip() for line in lines if line.startswith('# ')), Path(asset['source']).stem.replace('_', ' ').title())
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

# Canonicalize the template catalog while retaining legacy aliases only at the top level.
catalog_path = root / 'templates/templates.json'
catalog = json.loads(catalog_path.read_text())
for template in catalog.get('templates', []):
    old = template.get('path')
    if old in mapping:
        template['path'] = mapping[old]
        alternates = template.setdefault('alternate_paths', [])
        if old not in alternates:
            alternates.append(old)

def replace_nested_paths(obj):
    if isinstance(obj, dict):
        for key, value in obj.items():
            if key == 'alternate_paths':
                continue
            if isinstance(value, str) and value in mapping:
                obj[key] = mapping[value]
            else:
                replace_nested_paths(value)
    elif isinstance(obj, list):
        for index, value in enumerate(obj):
            if isinstance(value, str) and value in mapping:
                obj[index] = mapping[value]
            else:
                replace_nested_paths(value)

replace_nested_paths(catalog)
catalog_path.write_text(json.dumps(catalog, indent=2) + '\n')

# Canonicalize current structured metadata exactly once.
structured_files = {
    'meta/domain-mapping.json',
    'meta/cross-references.json',
    'meta/value-flow-mapping.json',
}
for relative in structured_files:
    path = root / relative
    path.write_text(canonicalize_text(path.read_text()))

# Transition migration inventory and globally canonicalize dependency edges to this wave.
inv_path = root / 'meta/migration-inventory.json'
inv = json.loads(inv_path.read_text())
selected = set(mapping)
asset_by_source = {a['source']: a for a in assets}
touched = 0
for record in inv['moves']:
    dependencies = record.get('dependencies')
    if isinstance(dependencies, list):
        record['dependencies'] = [mapping.get(value, value) for value in dependencies]
    if record.get('source') in selected:
        asset = asset_by_source[record['source']]
        record['action'] = 'executed-move-with-legacy-pointer'
        record['execution'] = {
            'batch_id': 'B3C',
            'pre_batch_sha': pre_sha,
            'pre_move_source_sha256': asset['pre_move_sha256'],
            'evidence_file': evidence,
            'rollback_owner': manifest['rollback_owner'],
        }
        touched += 1
assert touched == len(assets), touched
executions = inv['batch_execution_records']
assert not any(item.get('batch_id') == 'B3C' for item in executions), 'duplicate B3C batch execution'
executions.append({
    'batch_id': 'B3C',
    'issue': '#1057',
    'parent_issue': '#711',
    'asset_count': len(assets),
    'status': 'executed',
    'evidence_file': evidence,
    'rollback_owner': manifest['rollback_owner'],
})
inv_path.write_text(json.dumps(inv, indent=2) + '\n')

# Treat affected_internal_references as an executable checklist. Historical/intentional
# records retain source identity by policy; canonical bodies remain byte-preserved.
selected_bodies = set(mapping.values())
selected_sources = set(mapping)
already_structured = structured_files | {
    'templates/templates.json',
    'meta/migration-inventory.json',
    'meta/migration-waves/b3c.json',
}
maintained_files = set()
for record in inv['moves']:
    if record.get('source') not in selected:
        continue
    for relative in record.get('affected_internal_references', []):
        relative = relative.replace('\\', '/')
        if (
            historical_or_intentional(relative)
            or relative in selected_bodies
            or relative in selected_sources
            or relative in already_structured
        ):
            continue
        maintained_files.add(relative)

# Preserve the standard maintained discovery surfaces used by prior waves, but process each
# file at most once so canonicalization is idempotent.
maintained_files.add('TEMPLATE_INDEX.md')
for base in [root / 'docs/decision-engine', root / 'docs/templates']:
    if base.exists():
        for path in base.rglob('*.md'):
            maintained_files.add(path.relative_to(root).as_posix())

for relative in sorted(maintained_files):
    path = root / relative
    if not path.is_file():
        continue
    try:
        text = path.read_text()
    except UnicodeDecodeError:
        continue
    changed = canonicalize_text(text)
    if changed != text:
        path.write_text(changed)

manifest['phase'] = 'executed'
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Executed {len(assets)} B3C assets')
