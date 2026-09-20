"""Validate story #743/#744 guidance for the live canonical template catalog."""
import json
from pathlib import Path
import re
import sys


def section(text, title):
    match = re.search(r'^## ' + re.escape(title) + r'\s*\n(.*?)(?=^## |\Z)', text, re.M | re.S | re.I)
    return match.group(1).strip() if match else ''


def local_targets(source, text):
    for target in re.findall(r'\]\(([^)]+)\)', text):
        if re.match(r'^[a-z]+:', target):
            continue
        path, _, anchor = target.partition('#')
        yield (source.parent / path).resolve() if path else source.resolve(), anchor


def validate(root):
    root = Path(root).resolve()
    catalog = json.loads((root / 'templates/templates.json').read_text())['templates']
    paths = [item.get('canonical_path') or item['path'] for item in catalog]
    errors = []
    if not paths or len(set(paths)) != len(paths):
        errors.append('Catalog must contain unique canonical paths')
    canonical = {(root / path).resolve() for path in paths}
    guide = root / 'docs/principles/anti-patterns.md'
    guide_text = guide.read_text()
    anchors = set(re.findall(r'<a id="([a-z0-9-]+)"></a>', guide_text))
    if len(anchors) < 10:
        errors.append('Anti-pattern guide requires at least ten distinct patterns')
    guide_links = {p for p, _ in local_targets(guide, guide_text)}
    seen = {}
    for path in paths:
        file = root / path
        if not file.is_file():
            errors.append(f'{path}: canonical template missing')
            continue
        text = file.read_text()
        for title in ('When to Use', 'When NOT to Use'):
            content = section(text, title)
            bullets = re.findall(r'^- .+', content, re.M)
            if not 2 <= len(bullets) <= 5:
                errors.append(f'{path}: {title} requires 2–5 bullets')
            if title == 'When to Use':
                if content in seen:
                    errors.append(f'{path}: identical usage guidance to {seen[content]}')
                seen[content] = path
        pair_bullets = '\n'.join(re.findall(r'^- .+', section(text, 'Pairs Well With'), re.M))
        pairs = list(local_targets(file, pair_bullets))
        if not pairs or any(p not in canonical or p == file.resolve() for p, _ in pairs):
            errors.append(f'{path}: complementary links must reference other canonical templates')
        exclusions = list(local_targets(file, section(text, 'When NOT to Use')))
        if not any(p == guide and a in anchors for p, a in exclusions):
            errors.append(f'{path}: missing specific anti-pattern link')
        if file.resolve() not in guide_links:
            errors.append(f'{path}: anti-pattern guide lacks reciprocal template reference')
        if '800-801-context-assessment-model.md' not in text:
            errors.append(f'{path}: missing decision-engine context-model reference')
        for target, _ in local_targets(file, '\n'.join(section(text, t) for t in ('When to Use', 'When NOT to Use', 'Pairs Well With'))):
            if not target.is_file():
                errors.append(f'{path}: missing guidance link target {target}')
    for block in re.split(r'<a id="[a-z0-9-]+"></a>', guide_text)[1:]:
        for field in ('Domains', 'Description', 'Symptoms', 'Impact', 'Correct alternative', 'Relevant templates'):
            if f'**{field}:**' not in block:
                errors.append(f'Anti-pattern missing {field}')
    return {'catalog_templates': len(paths), 'anti_patterns': len(anchors), 'errors': errors}


if __name__ == '__main__':
    result = validate(Path(__file__).resolve().parents[1])
    print(json.dumps(result, indent=2))
    sys.exit(bool(result['errors']))
