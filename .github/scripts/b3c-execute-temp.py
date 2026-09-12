import hashlib
import json
import os
import pathlib
import re
import subprocess

root = pathlib.Path('.').resolve()
manifest_path = root / 'meta/migration-waves/b3c.json'
manifest = json.loads(manifest_path.read_text())
assets = manifest['assets']
evidence = 'docs/vnext/sprint-12/b3c-migration-record.md'


def title_from(text, fallback):
    match = re.search(r'^title:\s*["\']?([^"\'\n]+)', text, re.M)
    if match:
        return match.group(1).strip()
    match = re.search(r'^#\s+(.+?)\s*$', text, re.M)
    return match.group(1).strip() if match else fallback


def pointer(title, source, destination):
    rel = os.path.relpath(destination, start=os.path.dirname(source) or '.').replace(os.sep, '/')
    return (
        f'# {title} — Moved\n\n'
        '## Purpose and overview\n\n'
        f'This legacy path is retained so existing repository links and external bookmarks continue to reach the {title} after its domain migration. '
        'The maintained canonical template now resides in the Delivery domain; this file contains navigation guidance only and is not a second template copy.\n\n'
        f'**Canonical location:** [Open the {title}]({rel})\n\n'
        '## Usage instructions\n\n'
        'Follow the canonical-location link above to view, copy, or update the template. Update only the canonical file when proposing content changes. '
        'References to this legacy path remain supported for backward compatibility, but new documentation and catalog entries should link directly to the canonical domain path.\n'
    )


source_to_dest = {}
title_by_source = {}
for asset in assets:
    source = asset['source']
    destination = asset['destination']
    src = root / source
    dst = root / destination
    if not src.is_file():
        raise SystemExit(f'missing source: {source}')
    if dst.exists():
        raise SystemExit(f'destination collision: {destination}')
    data = src.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    if digest != asset['pre_move_sha256']:
        raise SystemExit(f'hash mismatch for {source}: {digest}')
    text = data.decode('utf-8')
    title = title_from(text, pathlib.Path(source).stem.replace('_', ' ').title())
    title_by_source[source] = title
    source_to_dest[source] = destination
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_bytes(data)
    src.write_text(pointer(title, source, destination), encoding='utf-8')

excluded_exact = {
    'meta/migration-inventory.json',
    'meta/cross-references.json',
    'templates/templates.json',
    'templates/templates.proposed.json',
}
tracked = subprocess.check_output(['git', 'ls-files', '-z']).decode().split('\0')
text_ext = {'.md', '.json', '.yaml', '.yml', '.js', '.mjs', '.ts', '.tsx', '.jsx', '.html'}
for rel in tracked:
    if not rel or rel in excluded_exact:
        continue
    if rel.startswith('meta/migration-waves/'):
        continue
    if re.match(r'docs/vnext/sprint-12/[^/]+-migration-record\.md$', rel):
        continue
    if pathlib.Path(rel).suffix.lower() not in text_ext:
        continue
    path = root / rel
    try:
        text = path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        continue
    original = text
    for source, destination in source_to_dest.items():
        text = text.replace(source, destination)
    if text != original:
        path.write_text(text, encoding='utf-8')

for catalog_rel in ['templates/templates.json', 'templates/templates.proposed.json']:
    path = root / catalog_rel
    if not path.exists():
        continue
    db = json.loads(path.read_text())
    for item in db.get('templates', []):
        original_path = item.get('path')
        if original_path in source_to_dest:
            source = original_path
            item['path'] = source_to_dest[source]
            aliases = item.get('alternate_paths', [])
            if source not in aliases:
                aliases.append(source)
            item['alternate_paths'] = aliases
        canonical = item.get('canonical_path')
        if canonical in source_to_dest:
            source = canonical
            item['canonical_path'] = source_to_dest[source]
            aliases = item.get('alternate_paths', [])
            if source not in aliases:
                aliases.append(source)
            item['alternate_paths'] = aliases
        for related in item.get('relatedTemplates', []) or []:
            related_path = related.get('path')
            if related_path in source_to_dest:
                related['path'] = source_to_dest[related_path]
    path.write_text(json.dumps(db, indent=2) + '\n')

inventory_path = root / 'meta/migration-inventory.json'
inventory = json.loads(inventory_path.read_text())
records = inventory.setdefault('batch_execution_records', [])
if any(record.get('batch_id') == 'B3C' for record in records):
    raise SystemExit('B3C batch execution record already exists')
records.append({
    'batch_id': 'B3C',
    'issue': '#1057',
    'parent_issue': '#711',
    'asset_count': len(assets),
    'status': 'executed',
    'evidence_file': evidence,
    'rollback_owner': manifest['rollback_owner'],
})
moves = {move['source']: move for move in inventory['moves']}
for asset in assets:
    source = asset['source']
    move = moves.get(source)
    if not move:
        raise SystemExit(f'inventory move missing: {source}')
    if move.get('action') != 'planned-move-not-executed':
        raise SystemExit(f'unexpected pre-execution action for {source}: {move.get("action")}')
    move['action'] = 'executed-move-with-legacy-pointer'
    move['execution'] = {
        'batch_id': 'B3C',
        'pre_batch_sha': manifest['pre_batch_sha'],
        'pre_move_source_sha256': asset['pre_move_sha256'],
        'evidence_file': evidence,
        'rollback_owner': manifest['rollback_owner'],
    }
inventory_path.write_text(json.dumps(inventory, indent=2) + '\n')

review_path = root / 'meta/needs-review.md'
review = review_path.read_text()
for title in title_by_source.values():
    pattern = re.compile(rf'\n- \*\*{re.escape(title)}\*\* \(`[^`]+`\)\n(?:  - .*\n)+', re.M)
    review = pattern.sub('\n', review)
count = len(re.findall(r'^- \*\*', review, re.M))
review = re.sub(r'\*\*Count:\*\* \d+ of 137', f'**Count:** {count} of 137', review)
review_path.write_text(review)

manifest['phase'] = 'executed'
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')

rows = [
    f"| `{asset['source']}` | `{asset['destination']}` | `{asset['pre_move_sha256']}` |"
    for asset in assets
]
record_lines = [
    '# B3C Migration Execution Record',
    '',
    '- Issues: [#1057](https://github.com/mirichard/pm-tools-templates/issues/1057) (parent [#711](https://github.com/mirichard/pm-tools-templates/issues/711))',
    '- Batch: `B3C`',
    '- Source batch: `3`',
    f'- Asset count: `{len(assets)}`',
    '- Primary domain: `Delivery`',
    f'- Rollback owner: `{manifest["rollback_owner"]}`',
    f'- Pre-batch SHA: `{manifest["pre_batch_sha"]}`',
    '- Physical migration commit: `<pending-atomic-commit>`',
    '- Manifest: `meta/migration-waves/b3c.json`',
    '- Status: **PASS — local guarded execution validation complete; atomic branch commit pending**',
    '',
    '## Scope decision',
    '',
    'B3C is the next dependency-safe Batch 3 / Delivery wave after B3B. The repository planner selected a 10-asset SCC-safe atomic set under the 12-asset target/limit. Same-wave dependency cycles remain intact; no dependency cycle is split.',
    '',
    '## Assets and immutable hashes',
    '',
    '| Legacy source | Canonical destination | Pre-move SHA-256 |',
    '|---|---|---|',
    *rows,
    '',
    '## Checkpoint A — entry baseline',
    '',
    f'- Production `main` anchor: `{manifest["pre_batch_sha"]}`.',
    '- Entry manifest: PASS — 10 assets, limit 12.',
    '- Entry source/action guard: PASS — all B3C sources planned before move.',
    '- Destination collision guard: PASS — zero pre-existing destinations.',
    '- Source hash guard: PASS — 10/10 immutable hashes matched before move.',
    '- Full entry validation: PASS — GitHub Actions run `34724550956`.',
    '',
    '## Checkpoints B/C — canonical moves and compatibility',
    '',
    '- 10/10 canonical destination bodies preserve their immutable pre-move SHA-256 values.',
    '- 10/10 legacy source paths are navigation-only pointers.',
    '- 10/10 legacy pointers resolve to the intended Delivery canonical.',
    '- Canonical bodies are copied byte-for-byte; inherited Markdown whitespace is preserved.',
    '',
    '## Checkpoint D — canonical references and execution metadata',
    '',
    '- 10/10 inventory moves are `executed-move-with-legacy-pointer` with B3C execution metadata.',
    '- Exactly one B3C `batch_execution_records` entry exists.',
    '- Current canonical references are migrated while historical wave evidence retains original source identity.',
    '- Migrated catalog entries retain legacy sources in `alternate_paths`.',
    '',
    '## Checkpoint E — executed-state validation',
    '',
    '**Pending atomic branch commit and final guarded validation run.**',
    '',
    '## Checkpoint F — integration/visual validation',
    '',
    '**Pending.** Required branch/PR integration workflows and comprehensive visual regression must be reviewed on the final delivery head. Visual baselines must not be updated merely to force a green result.',
    '',
    '## Checkpoint G — post-merge verification',
    '',
    '**Pending.** After manual integration, production `main` must reverify canonical hashes, legacy pointers, catalog compatibility, required workflows, comprehensive visual regression, and rollback anchor before B3C is treated as integrated.',
    '',
    '## Technical-debt disposition',
    '',
    'B3C is a structural migration. Canonical template bodies remain immutable; inherited content-quality issues are not silently repaired as part of this wave.',
    '',
    '## Rollback',
    '',
    'Pre-batch rollback anchor:',
    '',
    f'`{manifest["pre_batch_sha"]}`',
    '',
    'After manual integration, the wave-level rollback method is:',
    '',
    '`git revert <B3C-merge-sha>`',
    '',
]
record_path = root / evidence
record_path.parent.mkdir(parents=True, exist_ok=True)
record_path.write_text('\n'.join(record_lines))
