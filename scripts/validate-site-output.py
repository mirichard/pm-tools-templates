#!/usr/bin/env python3
"""Verify built catalog previews and downloads against canonical repository bytes."""
from html.parser import HTMLParser
from pathlib import Path
import json


class Preview(HTMLParser):
    def __init__(self):
        super().__init__()
        self.inside = False
        self.content = ''
        self.downloads = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == 'pre' and 'aria-label' in attributes:
            self.inside = True
        if tag == 'a' and 'download' in attributes:
            self.downloads.append(attributes.get('href'))

    def handle_endtag(self, tag):
        if tag == 'pre':
            self.inside = False

    def handle_data(self, data):
        if self.inside:
            self.content += data


def main():
    root = Path(__file__).resolve().parent.parent
    output = root / 'docs/site/dist'
    catalog = json.loads((root / 'templates/templates.json').read_text())
    for template in catalog['templates']:
        source = root / (template.get('canonical_path') or template['path'])
        identity = source.stem
        download = output / 'downloads' / f'{identity}.md'
        if download.read_bytes() != source.read_bytes():
            raise ValueError(f'{identity}: download differs from canonical bytes')
        preview = Preview()
        preview.feed((output / 'templates' / identity / 'index.html').read_text())
        if preview.content != source.read_text():
            raise ValueError(f'{identity}: preview differs from canonical content')
        if f'/pm-tools-templates/downloads/{identity}.md' not in preview.downloads:
            raise ValueError(f'{identity}: canonical download link missing')
    planning = output / 'planning-review'
    for filename in ['index.html', 'review.css', 'review.mjs', 'review-view.mjs', 'data.json']:
        if not (planning / filename).is_file() or not (planning / filename).stat().st_size:
            raise ValueError(f'Planning review output missing: {filename}')
    review = json.loads((planning / 'data.json').read_text())
    if review.get('schemaVersion') != 1 or review.get('repository') != 'mirichard/pm-tools-templates':
        raise ValueError('Planning review identity mismatch')
    if not isinstance(review.get('findings'), list) or not isinstance(review.get('inventory'), list):
        raise ValueError('Planning review evidence model missing')
    print(f"Verified {len(catalog['templates'])} canonical previews and downloads, and the planning review page.")


if __name__ == '__main__':
    main()
