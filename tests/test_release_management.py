import copy
import json
from pathlib import Path
import tempfile
import unittest

from scripts.release_management import reconcile, validate, version, DRAFT_MARKER


SHA = 'a' * 40
CONFIG = {'current': {'version': '2.3.0', 'tag': 'vNext', 'commit': SHA,
                      'title': 'Value Delivery System Upgrade'},
          'nextVersion': '2.3.1', 'legacyDraftTag': 'v0.0.1'}


class FakeGitHub:
    def __init__(self):
        self.tags = [{'name': 'vNext', 'commit': {'sha': SHA}},
                     {'name': 'v2.2.0', 'commit': {'sha': 'b' * 40}}]
        self.releases = [dict(id=1, tag_name='vNext', name='vNext', body='# vNext — Value Delivery System Upgrade',
                              draft=False, prerelease=False, published_at='2026-09-21T00:32:20Z'),
                         dict(id=2, tag_name='v0.0.1', body='Old draft', draft=True)]
        self.writes = []

    def __call__(self, method, path, payload=None):
        if method == 'GET':
            if path.startswith('tags?'):
                return copy.deepcopy(self.tags)
            if path.startswith('releases?'):
                return copy.deepcopy(self.releases)
            return copy.deepcopy(next(r for r in self.releases if r['id'] == int(path.split('/')[-1])))
        self.writes.append((method, path, payload))
        if path == 'releases/generate-notes':
            return {'body': f"Changes since {payload['previous_tag_name']}"}
        if path == 'git/refs':
            self.tags.append({'name': payload['ref'].removeprefix('refs/tags/'), 'commit': {'sha': payload['sha']}})
        elif method == 'PATCH':
            next(r for r in self.releases if r['id'] == int(path.split('/')[-1])).update(payload)
        elif path == 'releases':
            self.releases.append(dict(id=3, **payload))


class ReleaseTests(unittest.TestCase):
    def test_read_only_preflight(self):
        api = FakeGitHub()
        self.assertEqual(reconcile(CONFIG, api)['nextDraft'], 'v2.3.1')
        self.assertEqual(api.writes, [])

    def test_reconcile_preserves_identity_and_is_repeatable(self):
        api = FakeGitHub()
        reconcile(CONFIG, api, True)
        reconcile(CONFIG, api, True)
        self.assertEqual(len([t for t in api.tags if t['name'] == 'v2.3.0']), 1)
        self.assertEqual(len(api.releases), 2)
        self.assertEqual(api.releases[0]['tag_name'], 'vNext')
        self.assertEqual(api.releases[0]['published_at'], '2026-09-21T00:32:20Z')
        self.assertEqual(api.releases[0]['body'].count('Version identity:'), 1)
        self.assertEqual(api.releases[1]['tag_name'], 'v2.3.1')
        self.assertTrue(api.releases[1]['draft'])
        self.assertIn('Changes since vNext', api.releases[1]['body'])

    def test_collision_and_wrong_baseline_fail_before_writes(self):
        for tag in ('vNext', 'v2.3.0', 'v2.3.1'):
            with self.subTest(tag=tag):
                api = FakeGitHub()
                api.tags = [t for t in api.tags if t['name'] != tag]
                api.tags.append({'name': tag, 'commit': {'sha': 'c' * 40}})
                with self.assertRaises(ValueError):
                    reconcile(CONFIG, api, True)
                self.assertEqual(api.writes, [])

    def test_component_releases_do_not_change_repository_version(self):
        api = FakeGitHub()
        api.releases.append(dict(id=5, tag_name='v9.0.0-requirements-cli', draft=True))
        api.tags.append({'name': 'v2025.08.08', 'commit': {'sha': 'd' * 40}})
        reconcile(CONFIG, api, True)
        self.assertEqual(api.releases[2]['tag_name'], 'v9.0.0-requirements-cli')
        self.assertEqual(api.releases[1]['tag_name'], 'v2.3.1')

    def test_multiple_repository_drafts_fail(self):
        api = FakeGitHub()
        api.releases.append(dict(id=3, tag_name='v2.3.1', draft=True))
        with self.assertRaises(ValueError):
            reconcile(CONFIG, api, True)
        self.assertEqual(api.writes, [])

    def test_changed_next_version_reuses_managed_draft(self):
        api = FakeGitHub()
        reconcile(CONFIG, api, True)
        changed = copy.deepcopy(CONFIG)
        changed['nextVersion'] = '2.4.0'
        reconcile(changed, api, True)
        self.assertEqual(len(api.releases), 2)
        self.assertEqual(api.releases[1]['tag_name'], 'v2.4.0')
        self.assertIn(DRAFT_MARKER, api.releases[1]['body'])

    def test_missing_draft_created_unpublished(self):
        api = FakeGitHub()
        api.releases.pop()
        reconcile(CONFIG, api, True)
        self.assertTrue(api.releases[-1]['draft'])

    def test_readback_failure_is_reported(self):
        api = FakeGitHub()
        def corrupt(method, path, payload=None):
            result = api(method, path, payload)
            if method == 'GET' and path == 'releases/1':
                result['published_at'] = 'changed'
            return result
        with self.assertRaisesRegex(ValueError, 'verification failed'):
            reconcile(CONFIG, corrupt, True)

    def test_version_validation(self):
        self.assertGreater(version('2.10.0'), version('2.9.9'))
        for bad in ('02.3.0', '2.3', 'v2.3.0', '2.3.0-rc1', '2.3.0\n'):
            with self.subTest(value=bad), self.assertRaises(ValueError):
                version(bad)

    def test_manifest_and_package_drift(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'release.json').write_text(json.dumps(CONFIG))
            (root / 'package.json').write_text(json.dumps({'version': '2.3.0'}))
            lock = {'version': '2.3.0', 'packages': {'': {'version': '2.3.0'}}}
            (root / 'package-lock.json').write_text(json.dumps(lock))
            validate(root)
            lock['packages']['']['version'] = '2.0.0'
            (root / 'package-lock.json').write_text(json.dumps(lock))
            with self.assertRaisesRegex(ValueError, 'must match'):
                validate(root)


if __name__ == '__main__':
    unittest.main()
