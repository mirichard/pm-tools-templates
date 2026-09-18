import assert from 'node:assert/strict';
import test from 'node:test';
import { resolvePreviewPath } from '../server.js';

test('preview path boundary accepts only indexed repository paths', () => {
  const allowed = ['docs/guide.md'];
  assert.match(resolvePreviewPath('docs/guide.md', allowed), /docs\/guide\.md$/);
  assert.equal(resolvePreviewPath('../package.json', allowed), null);
  assert.equal(resolvePreviewPath('docs/guide.md/../../package.json', allowed), null);
  assert.equal(resolvePreviewPath('/etc/passwd', allowed), null);
});
