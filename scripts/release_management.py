#!/usr/bin/env python3
"""Validate release identity and reconcile GitHub metadata without moving tags."""

import argparse
import json
import os
from pathlib import Path
import re
import subprocess

DRAFT_MARKER = '<!-- repository-release-draft -->'


def version(value):
    if not isinstance(value, str) or not re.fullmatch(r'(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)', value):
        raise ValueError(f'Expected stable MAJOR.MINOR.PATCH version: {value!r}')
    return tuple(map(int, value.split('.')))


def validate(root):
    config = json.loads((root / 'release.json').read_text())
    current = config['current']
    if version(config['nextVersion']) <= version(current['version']):
        raise ValueError('nextVersion must be greater than current.version')
    if not re.fullmatch(r'[0-9a-f]{40}', current['commit']):
        raise ValueError('current.commit must be a full commit SHA')
    if current['tag'] not in ('vNext', f"v{current['version']}"):
        raise ValueError('Current release must use its numeric tag or the historical vNext alias')
    if not current['title'].strip():
        raise ValueError('Current release title is required')
    package = json.loads((root / 'package.json').read_text())
    lock = json.loads((root / 'package-lock.json').read_text())
    if any(v != current['version'] for v in (package['version'], lock['version'], lock['packages']['']['version'])):
        raise ValueError('Root package and lockfile versions must match current.version')
    return config


class GitHub:
    def __init__(self, repository):
        if not re.fullmatch(r'[\w.-]+/[\w.-]+', repository):
            raise ValueError('GITHUB_REPOSITORY must be owner/repository')
        self.prefix = f'repos/{repository}'

    def __call__(self, method, path, payload=None):
        command = ['gh', 'api', '--method', method, f'{self.prefix}/{path}']
        if payload is not None:
            command += ['--input', '-']
        try:
            result = subprocess.run(command, input=json.dumps(payload) if payload is not None else None,
                                    text=True, capture_output=True, check=True)
        except subprocess.CalledProcessError as error:
            detail = (error.stderr or '').strip() or f'gh exited with status {error.returncode}'
            for key in ('GH_TOKEN', 'GITHUB_TOKEN'):
                token = os.environ.get(key)
                if token:
                    detail = detail.replace(token, '[REDACTED]')
            raise ValueError(f'GitHub {method} {path} failed: {detail}') from error
        return json.loads(result.stdout) if result.stdout.strip() else None


def pages(api, endpoint):
    result = []
    page = 1
    while True:
        batch = api('GET', f'{endpoint}?per_page=100&page={page}')
        result.extend(batch)
        if len(batch) < 100:
            return result
        page += 1


def reconcile(config, api, apply=False):
    """Preflight every identity before adding an alias or updating release metadata."""
    current = config['current']
    numeric_tag = f"v{current['version']}"
    next_tag = f"v{config['nextVersion']}"
    tags = {item['name']: item['commit']['sha'] for item in pages(api, 'tags')}
    releases = pages(api, 'releases')
    if tags.get(current['tag']) != current['commit']:
        raise ValueError('Published release tag does not identify the accepted commit')
    if numeric_tag in tags and tags[numeric_tag] != current['commit']:
        raise ValueError('Numeric tag already identifies a different commit; refusing to move it')
    if next_tag in tags:
        raise ValueError('nextVersion is already reserved by an existing tag')
    published = [r for r in releases if r['tag_name'] == current['tag'] and not r['draft']]
    if len(published) != 1 or published[0]['prerelease']:
        raise ValueError('Expected one published stable current release')
    if any(r['tag_name'] == numeric_tag and r['id'] != published[0]['id'] for r in releases):
        raise ValueError('Numeric version already has a separate release entry')
    if any(r['tag_name'] == next_tag and not r['draft'] for r in releases):
        raise ValueError('nextVersion is already published')
    drafts = [r for r in releases if r['draft'] and (r['tag_name'] in
              (next_tag, config.get('legacyDraftTag')) or DRAFT_MARKER in (r.get('body') or ''))]
    if len(drafts) > 1:
        raise ValueError('Multiple repository drafts require manual reconciliation')

    release = published[0]
    name = f"{numeric_tag} — {current['title']}"
    body = release.get('body') or ''
    if current['tag'] != numeric_tag:
        body = body.replace(f"# {current['tag']} — {current['title']}", f'# {name}', 1)
        note = (f"Version identity: `{numeric_tag}` and `{current['tag']}` identify the same "
                f"accepted commit `{current['commit']}`. The original release URL and publication date are retained.")
        if note not in body:
            body = f'{body.rstrip()}\n\n{note}\n'
    plan = {'release': name, 'commit': current['commit'], 'alias': numeric_tag,
            'nextDraft': next_tag, 'previousTag': current['tag']}
    if not apply:
        return plan

    # Generate notes before mutations; explicit previous tag excludes already shipped work.
    notes = api('POST', 'releases/generate-notes', {
        'tag_name': next_tag, 'target_commitish': 'main', 'previous_tag_name': current['tag']})
    if numeric_tag not in tags:
        api('POST', 'git/refs', {'ref': f'refs/tags/{numeric_tag}', 'sha': current['commit']})
    if release['name'] != name or release.get('body') != body:
        api('PATCH', f"releases/{release['id']}", {'name': name, 'body': body})
    draft_body = f"{DRAFT_MARKER}\n\n{notes['body']}"
    draft_data = {'tag_name': next_tag, 'target_commitish': 'main', 'name': next_tag,
                  'body': draft_body, 'draft': True, 'prerelease': False}
    if drafts:
        api('PATCH', f"releases/{drafts[0]['id']}", draft_data)
    else:
        api('POST', 'releases', draft_data)

    # Read back all externally visible mutations. Existing tag refs are never patched.
    verified_tags = {t['name']: t['commit']['sha'] for t in pages(api, 'tags')}
    verified_release = api('GET', f"releases/{release['id']}")
    if any(verified_tags.get(t) != current['commit'] for t in (numeric_tag, current['tag'])):
        raise ValueError('Release tag verification failed')
    if any(verified_release[k] != v for k, v in {'name': name, 'body': body,
            'tag_name': current['tag'], 'published_at': release['published_at']}.items()):
        raise ValueError('Release metadata verification failed')
    verified_drafts = [r for r in pages(api, 'releases') if r['tag_name'] == next_tag and r['draft']]
    if len(verified_drafts) != 1 or verified_drafts[0]['body'] != draft_body:
        raise ValueError('Draft verification failed')
    return plan


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--remote', action='store_true', help='Preflight GitHub state (read-only)')
    parser.add_argument('--apply', action='store_true', help='Apply and verify release metadata and draft changes')
    args = parser.parse_args()
    config = validate(Path(__file__).resolve().parents[1])
    if args.remote or args.apply:
        result = reconcile(config, GitHub(os.environ.get('GITHUB_REPOSITORY', '')), args.apply)
        print(json.dumps(result, indent=2))
    else:
        print('Release manifest and root package versions are consistent.')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, KeyError, OSError, subprocess.CalledProcessError) as error:
        raise SystemExit(f'Release validation failed: {error}') from error
