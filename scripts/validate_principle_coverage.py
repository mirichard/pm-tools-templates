"""Enforce the live catalog's principle contract and reproducible coverage manifest."""
import argparse
from collections import Counter
import hashlib
import hmac
import json
from pathlib import Path
import re
import subprocess
import sys

import yaml

try:
    from scripts.validate_principles_guidance import local_targets, validate as validate_guidance
except ModuleNotFoundError:
    from validate_principles_guidance import local_targets, validate as validate_guidance

CATALOG = 'templates/templates.json'
MANIFEST = 'meta/principle-coverage.json'
SCHEMA = 'schemas/principle-annotation.schema.json'
FIELDS = ('primary_principles', 'secondary_principles', 'principle_rationale')


class UniqueLoader(yaml.SafeLoader):
    """Reject ambiguous YAML instead of silently accepting the last duplicate key."""


def unique_mapping(loader, node, deep=False):
    mapping = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if not isinstance(key, str) or key in mapping:
            raise ValueError('frontmatter keys must be unique strings')
        mapping[key] = loader.construct_object(value_node, deep=deep)
    return mapping


UniqueLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, unique_mapping)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def git_value(root, *args):
    result = subprocess.run(['git', '-C', str(root), *args], capture_output=True, text=True)
    return result.stdout.strip() if result.returncode == 0 else None


def annotation(text, schema):
    """Check the approved three-field schema plus overlap and physical line limits."""
    match = re.match(r'\A---\r?\n(.*?)\r?\n---(?:\r?\n|$)', text, re.S)
    if not match:
        raise ValueError('missing YAML frontmatter')
    source = match.group(1)
    data = yaml.load(source, Loader=UniqueLoader)
    if not isinstance(data, dict) or any(key not in data for key in FIELDS):
        raise ValueError('missing required principle annotation fields')
    result = {key: data[key] for key in FIELDS}
    approved = set(schema['$defs']['principle']['enum'])
    for key in FIELDS[:2]:
        values = result[key]
        if not isinstance(values, list) or any(not isinstance(v, str) for v in values):
            raise ValueError(f'{key} must be an array of strings')
        if len(values) < schema['properties'][key].get('minItems', 0):
            raise ValueError(f'{key} must not be empty')
        if len(values) != len(set(values)) or not set(values) <= approved:
            raise ValueError(f'{key} contains duplicate or invalid principle identifiers')
    if set(result[FIELDS[0]]) & set(result[FIELDS[1]]):
        raise ValueError('primary and secondary principles overlap')
    rationale = result[FIELDS[2]]
    rules = schema['properties'][FIELDS[2]]
    if (not isinstance(rationale, str) or not rules['minLength'] <= len(rationale) <= rules['maxLength']
            or not rationale.strip() or '\n' in rationale
            or re.search(r'[.!?]\s+[A-Z]', rationale)):
        raise ValueError('rationale must be one concise sentence within schema length limits')
    node = yaml.compose(source, Loader=UniqueLoader)
    lines = set()
    for key, value in node.value:
        if key.value in FIELDS:
            end = value.end_mark.line + (value.end_mark.column > 0)
            lines.update(range(key.start_mark.line, end))
    if len(lines) > 10:
        raise ValueError('annotation exceeds ten physical lines')
    return result, len(lines)


def inspect(root):
    root = Path(root).resolve()
    errors, entries, seen = [], [], set()
    catalog = json.loads((root / CATALOG).read_text())
    records = catalog['templates']
    if not isinstance(records, list) or not records:
        raise ValueError('catalog must contain a nonempty templates array')
    schema = json.loads((root / SCHEMA).read_text())
    existing = 0
    for record in records:
        path = record.get('canonical_path') if record.get('canonical_path') is not None else record.get('path')
        if (not isinstance(path, str) or not path or Path(path).is_absolute()
                or '..' in Path(path).parts or Path(path).suffix.lower() != '.md'):
            errors.append(f'{path!r}: invalid canonical Markdown path')
            continue
        file = root / path
        canonical = file.resolve()
        if canonical in seen:
            errors.append(f'{path}: duplicate canonical path')
            continue
        seen.add(canonical)
        if not canonical.is_relative_to(root) or file.is_symlink() or not file.is_file():
            errors.append(f'{path}: missing or unsafe canonical template')
            continue
        existing += 1
        try:
            text = file.read_text()
            values, lines = annotation(text, schema)
            entries.append({'path': path, 'sha256': digest(file), 'annotation_lines': lines, **values})
        except (ValueError, yaml.YAMLError) as exc:
            errors.append(f'{path}: {exc}')
    try:
        errors.extend(validate_guidance(root)['errors'])
    except (OSError, ValueError, KeyError, TypeError) as exc:
        errors.append(f'usage guidance validation failed: {exc}')
    landing = root / 'docs/principles/principle-taxonomy.md'
    text = landing.read_text()
    targets = set(p for p, _ in local_targets(landing, text))
    for name in ('anti-patterns.md', 'self-assessment.md'):
        required = landing.parent / name
        if required not in targets or not required.is_file():
            errors.append(f'taxonomy: missing discovery link to {name}')
    for principle in schema['$defs']['principle']['enum']:
        if f'`{principle}`' not in text:
            errors.append(f'taxonomy: missing schema identifier {principle}')
    counts = Counter(p for entry in entries for key in FIELDS[:2] for p in entry[key])
    manifest = {
        'version': 1,
        'catalog_commit': git_value(root, 'log', '-1', '--format=%H', '--', CATALOG),
        'catalog_sha256': digest(root / CATALOG),
        'schema_sha256': digest(root / SCHEMA),
        'catalog_records': len(records),
        'denominator': existing,
        'annotated': len(entries),
        'coverage_percent': round(100 * len(entries) / existing, 2) if existing else 0,
        'exclusions': [],
        'principle_counts': dict(sorted(counts.items())),
        'templates': sorted(entries, key=lambda entry: entry['path']),
    }
    return manifest, sorted(errors)


def validate(root, check_manifest=True):
    root = Path(root)
    manifest, errors = inspect(root)
    if check_manifest:
        try:
            recorded = json.loads((root / MANIFEST).read_text())
            expected_bytes = json.dumps(manifest, sort_keys=True).encode('utf-8')
            recorded_bytes = json.dumps(recorded, sort_keys=True).encode('utf-8')
            if not hmac.compare_digest(recorded_bytes, expected_bytes):
                errors.append('coverage manifest is stale: regenerate from the live catalog')
        except (OSError, ValueError):
            errors.append('coverage manifest is missing or invalid')
    return manifest, errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--write-manifest', action='store_true')
    parser.add_argument('--json-output', type=Path)
    args = parser.parse_args()
    try:
        manifest, errors = validate(args.root, check_manifest=not args.write_manifest)
        if args.write_manifest and not errors:
            (args.root / MANIFEST).write_text(json.dumps(manifest, indent=2) + '\n')
        report = {key: value for key, value in manifest.items() if key != 'templates'}
        report.update(tested_commit=git_value(args.root, 'rev-parse', 'HEAD'),
                      working_tree_dirty=bool(git_value(args.root, 'status', '--porcelain', '--untracked-files=no')),
                      errors=errors)
    except (OSError, ValueError, KeyError, TypeError, yaml.YAMLError) as exc:
        report = {'errors': [str(exc)]}
    output = json.dumps(report, indent=2) + '\n'
    if args.json_output:
        args.json_output.write_text(output)
    print(output, end='')
    return bool(report['errors'])


if __name__ == '__main__':
    sys.exit(main())
