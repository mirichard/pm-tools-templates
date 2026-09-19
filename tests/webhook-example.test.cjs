const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const body = fs.readFileSync('domains/delivery/industry-specializations/information-technology/software-development/api_documentation_template.md', 'utf8');
const block = [...body.matchAll(/```javascript\n([\s\S]*?)```/g)].map(m => m[1]).find(code => code.includes('function verifyWebhookSignature'));
assert.ok(block, 'The documented webhook verifier must exist');
const verify = vm.runInNewContext(block + '\nverifyWebhookSignature;', { require, Buffer });
const payload = Buffer.from('{"event":"example"}');
const secret = 'test-only-secret';
const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

test('documented verifier accepts authentic payload and rejects tampering', () => {
  assert.equal(verify(payload, signature, secret), true);
  assert.equal(verify(payload, signature.toUpperCase(), secret), true);
  assert.equal(verify(Buffer.from('changed'), signature, secret), false);
  assert.equal(verify(payload, signature, 'wrong-secret'), false);
});

test('malformed signatures return false without buffer-length exceptions', () => {
  for (const invalid of [undefined, null, 123, '', 'a', 'g'.repeat(64), '0'.repeat(63), '0'.repeat(65)]) {
    assert.equal(verify(payload, invalid, secret), false);
  }
});
