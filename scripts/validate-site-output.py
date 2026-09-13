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
    print(f"Verified {len(catalog['templates'])} canonical previews and downloads.")


if __name__ == '__main__':
    main()
