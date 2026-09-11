#!/usr/bin/env python3
"""Strict changed-body metadata and structural navigation validation.

Catalog canonical_path (falling back to path) and alternate_paths identify maintained
bodies. Uncataloged Markdown under templates, or template-named/frontmatter files
in template roots, also receive validation. README/support prose is intentional
only outside that identity set. Unchanged metadata debt is reported separately;
all pointers are checked, including compatibility links outside migration waves.
"""
import argparse
from datetime import date
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import unquote, urlsplit
import yaml

CATALOG = 'templates/templates.json'
ROOTS = {'templates', 'domains', 'role-based-toolkits', 'project-lifecycle',
         'methodology-frameworks', 'industry-specializations', 'business-stakeholder-suite',
         'project-assessment-suite', 'essential-templates'}
METHODS = {'traditional', 'agile', 'hybrid', 'universal'}  # validate-curated-templates.js
REQUIRED = ('title', 'methodology', 'complexity', 'owner', 'updated')


class MetadataLoader(yaml.SafeLoader):
    """Reject duplicate keys, matching js-yaml's strict mapping behavior."""


def unique_mapping(loader, node, deep=False):
    result = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if not isinstance(key, str) or key in result:
            raise ValueError('metadata keys must be unique strings')
        result[key] = loader.construct_object(value_node, deep=deep)
    return result


MetadataLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, unique_mapping)


def git(root, *args):
    return subprocess.check_output(['git', '-C', str(root), *args])


def changed_files(root, base, head, event):
    # PR merge-base excludes changes made only on the target branch. Push uses
    # the event's before SHA, including multi-commit pushes (never HEAD^).
    if event == 'pull_request':
        base = git(root, 'merge-base', base, head).decode().strip()
    return set(git(root, 'diff', '--name-only', '-z', '--no-renames', base, head).decode().split('\0')) - {''}


def catalog_entries(content):
    data = json.loads(content)
    return data if isinstance(data, list) else data['templates']


def primary_paths(content):
    return {item.get('canonical_path') or item['path'] for item in catalog_entries(content)}


def catalog_paths(content):
    entries = catalog_entries(content)
    result = set()
    for item in entries:
        result.add(item.get('canonical_path') or item['path'])
        result.update(item.get('alternate_paths', []))
    return result


def pointer_candidate(content):
    return bool(re.search(r'^# .*(?:— Moved|— Compatibility Navigation|\(Moved\))', content, re.M)
                or '**Canonical location:**' in content or 'navigation only' in content
                or 'navigation guidance only' in content)


def pointer_errors(root, path, content):
    """Accept only a small navigation document, never a body with appended hints."""
    errors = []
    lines = [line.strip() for line in content.splitlines() if line.strip()]
    if not lines or not re.fullmatch(r'# .+ (?:— Moved|— Compatibility Navigation|\(Moved\))', lines[0]):
        errors.append('missing moved/navigation heading')
    if not ('navigation only' in content or 'navigation guidance only' in content):
        errors.append('missing navigation-only declaration')
    if len(content) > 2200 or len(lines) > 12 or content.startswith('---'):
        errors.append('substantial body or frontmatter in navigation file')
    headings = [line for line in lines[1:] if line.startswith('#')]
    if headings != ['## Purpose and overview', '## Usage instructions']:
        errors.append('unexpected navigation sections')
    if re.search(r'^\s*(?:\||```|~~~|[-*] |\d+\. )', content, re.M):
        errors.append('template tables, code, or lists in navigation file')
    links = re.findall(r'\[([^\]]+)\]\((<[^>]+>|[^)]+)\)', content)
    if len(links) != 1:
        errors.append('expected one canonical/maintained-location link')
    else:
        label, href = links[0]
        if '**Canonical location:**' not in content and not label.startswith('Open the maintained '):
            errors.append('link does not identify canonical/maintained location')
        url = urlsplit(href.strip('<>'))
        target = (Path(root) / Path(path).parent / unquote(url.path)).resolve()
        if url.scheme or url.netloc or url.query or url.fragment or not target.is_relative_to(Path(root).resolve()):
            errors.append('destination must be a repository-local file')
        elif target == (Path(root) / path).resolve() or not target.is_file():
            errors.append('missing or self-referential destination')
        elif pointer_candidate(target.read_text()):
            errors.append('destination is another pointer, not a maintained body')
    return errors


def classify(path, content, identities):
    p = Path(path)
    if p.parts[0] not in ROOTS and path not in identities:
        return 'support'
    if pointer_candidate(content):
        return 'pointer'
    if path in identities:
        return 'canonical'
    if 'template' in p.stem.lower() or content.startswith('---\n'):
        return 'canonical'
    if p.name.lower() in ('readme.md', 'testing_instructions.md') or 'docs' in p.parts:
        return 'support'
    return 'canonical' if p.parts[0] == 'templates' else 'support'


def metadata(content, today=None):
    errors, warnings = [], []
    today = today or date.today()
    match = re.match(r'\A---\n(.*?)\n---(?:\n|$)', content, re.S)
    if not match:
        return ['missing or invalid YAML frontmatter'], []
    try:
        data = yaml.load(match[1], Loader=MetadataLoader)
        if not isinstance(data, dict):
            raise ValueError('frontmatter must be a mapping')
    except (yaml.YAMLError, ValueError) as exc:
        return [f'invalid YAML: {exc}'], []
    for field in REQUIRED:
        if not data.get(field) or (isinstance(data[field], str) and not data[field].strip()):
            errors.append(f'missing required field {field}')
        elif field != 'updated' and not isinstance(data[field], str):
            errors.append(f'{field} must be a string')
    if data.get('methodology') and str(data['methodology']).strip().lower() not in METHODS:
        errors.append('invalid methodology')
    if data.get('complexity') and data['complexity'] not in ('starter', 'intermediate', 'advanced'):
        errors.append('invalid complexity')
    if data.get('updated'):
        try:
            updated = date.fromisoformat(str(data['updated']))
            if (today - updated).days > 365:
                warnings.append('updated date is more than 365 days old')
        except ValueError:
            errors.append('updated must be a valid YYYY-MM-DD date')
    return errors, warnings


def lint(root, changed, old_identities=(), today=None, old_primary=None):
    root = Path(root)
    catalog = (root / CATALOG).read_text()
    identities = catalog_paths(catalog)
    primary = primary_paths(catalog)
    strict = set(changed) | (identities - set(old_identities))
    if old_primary is not None:
        strict.update(primary - set(old_primary))
    errors, debt, warnings, classifications = [], [], [], {}
    files = set(git(root, 'ls-files', '-z', '*.md').decode().split('\0')) - {''}
    for path in sorted(files | identities | set(old_identities)):
        if not path.endswith('.md'): continue
        file = root / path
        if not file.is_file():
            if path in identities: errors.append(f'{path}: catalog body missing')
            continue
        content = file.read_text()
        kind = classify(path, content, identities | set(old_identities))
        classifications[path] = kind
        if kind == 'pointer':
            errors.extend(f'{path}: {e}' for e in pointer_errors(root, path, content))
            # A catalog's primary body cannot silently become navigation. Alternate
            # paths may intentionally be pointers and are validated structurally.
            if path in primary:
                errors.append(f'{path}: catalog canonical body is a pointer')
        elif kind == 'canonical':
            found, stale = metadata(content, today)
            (errors if path in strict else debt).extend(f'{path}: {e}' for e in found)
            warnings.extend(f'{path}: {w}' for w in stale)
    return dict(errors=errors, inherited_debt=debt, warnings=warnings, classifications=classifications,
                changed=sorted(changed), strict=sorted(strict))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base', required=True)
    parser.add_argument('--head', default='HEAD')
    parser.add_argument('--event', choices=['pull_request', 'push', 'workflow_dispatch'], required=True)
    parser.add_argument('--json-output')
    args = parser.parse_args()
    root = Path.cwd()
    if git(root, 'rev-parse', args.head).strip() != git(root, 'rev-parse', 'HEAD').strip():
        raise ValueError('Checkout must match the tested head')
    if not args.base or set(args.base) == {'0'}:
        raise ValueError('No comparison base: provide a real commit; refusing to skip validation')
    base = args.base
    if args.event == 'pull_request': base = git(root, 'merge-base', base, args.head).decode().strip()
    old_catalog = git(root, 'show', f'{base}:{CATALOG}').decode()
    old = catalog_paths(old_catalog)
    changed = changed_files(root, args.base, args.head, args.event)
    for path in changed:
        if not path.endswith('.md'): continue
        previous = subprocess.run(['git', 'show', f'{base}:{path}'], capture_output=True, text=True)
        if previous.returncode == 0 and classify(path, previous.stdout, old) == 'canonical':
            old.add(path)
    result = lint(root, changed, old, old_primary=primary_paths(old_catalog))
    for group in ('errors', 'inherited_debt', 'warnings'):
        print(f'{group}: {len(result[group])}')
        for message in result[group]: print(f'  {message}')
    counts = {kind: list(result['classifications'].values()).count(kind) for kind in ('canonical', 'pointer', 'support')}
    print('Denominator:', json.dumps(counts, sort_keys=True))
    print('Changed files:', json.dumps(result['changed']))
    if args.json_output: Path(args.json_output).write_text(json.dumps(result, indent=2) + '\n')
    return bool(result['errors'])


if __name__ == '__main__':
    raise SystemExit(main())
