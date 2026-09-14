"""Shared navigation-only contract for legacy migration pointers."""
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit


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
