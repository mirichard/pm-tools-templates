const assert = require('assert');
const fs = require('fs-extra');
const path = require('path');
const Ajv = require('ajv');
const { validateNFRInput } = require('../src/nfr-input');

// Regression coverage for #1164: the structurer's own generation prompt
// (prompts/01-structure-requirements.md) explicitly permits `toActor`,
// `precondition`, `postcondition`, `refUseCaseId`, `previousStep`,
// `deviationPoint`, and `rejoinPoint` to be `null`, and the UCS prompt
// (prompts/03-generate-ucs-template.md) permits the same for the four
// fields shared with UCS steps. The validator/schema previously required
// strings, rejecting the producer's own intentional output. Resolved as
// P1 by owner decision: loosen the validator/schema for exactly the
// fields the prompts authorize; leave every other field untouched.
module.exports = async function testNFRInputContract(runner) {
  const test = (description, fn) => runner.test(description, async () => { await fn(); return true; });
  const copy = (data) => JSON.parse(JSON.stringify(data));

  const structuredFixturePath = path.resolve(__dirname, 'fixtures/pr-1128-structured-artifact.json');
  const pr1128Structured = await fs.readJSON(structuredFixturePath);

  const minimalStructured = {
    useCaseId: 'UC-01',
    useCaseName: 'Test',
    steps: [{ stepId: '1', actor: 'User', action: 'does', businessObject: 'Thing' }],
  };
  const minimalUCS = {
    useCaseId: 'UC-01', intent: 'Test', role: 'User',
    preconditions: [], postconditions: [],
    basicFlow: { steps: [{ stepId: '1', actor: 'User', action: 'does', businessObject: 'Thing' }] },
  };

  // validateNFRInput is the actual runtime gate, but the reference schemas
  // are a separate source of truth the checkpoint's own investigation found
  // in conflict with it — assert against both, not just the validator, so a
  // schema regressing back to string-only would fail here even if
  // validateNFRInput stayed correct.
  const ajv = new Ajv({ strict: false });
  const validateFormalStructure = ajv.compile(require('../schemas/formal-structure.schema.json'));
  const validateUCSTemplate = ajv.compile(require('../schemas/ucs-template.schema.json'));

  await test('#1164 SC6: PR #1128\'s actual committed structured artifact validates (neutral and pci-dss captures are byte-identical, so this fixture covers both)', () => {
    const result = validateNFRInput(pr1128Structured);
    assert.strictEqual(result.kind, 'structured');
    assert.strictEqual(result.data.steps[0].refUseCaseId, null);
    assert.strictEqual(result.data.steps[0].previousStep, null);
  });

  await test('#1164: structured steps accept null for every field prompts/01-structure-requirements.md marks "(or null)"', () => {
    for (const field of ['precondition', 'previousStep', 'toActor', 'postcondition', 'refUseCaseId', 'deviationPoint', 'rejoinPoint']) {
      const data = copy(minimalStructured);
      data.steps[0][field] = null;
      const result = validateNFRInput(data);
      assert.strictEqual(result.data.steps[0][field], null, `${field} should validate as null`);
      assert(validateFormalStructure(data), `${field} = null should also pass formal-structure.schema.json: ${JSON.stringify(validateFormalStructure.errors)}`);
    }
  });

  await test('#1164: UCS basicFlow steps accept null for every field prompts/03-generate-ucs-template.md marks "(or null)"', () => {
    for (const field of ['toActor', 'precondition', 'postcondition', 'refUseCaseId']) {
      const data = copy(minimalUCS);
      data.basicFlow.steps[0][field] = null;
      const result = validateNFRInput(data);
      assert.strictEqual(result.data.basicFlow.steps[0][field], null, `${field} should validate as null`);
      assert(validateUCSTemplate(data), `${field} = null should also pass ucs-template.schema.json: ${JSON.stringify(validateUCSTemplate.errors)}`);
    }
  });

  await test('#1164 SC7 rejection guard: fields no prompt authorizes as null still reject null', () => {
    for (const field of ['stepId', 'actor', 'action', 'businessObject']) {
      const data = copy(minimalStructured);
      data.steps[0][field] = null;
      assert.throws(() => validateNFRInput(data), new RegExp(`steps\\[0\\]\\.${field}`),
        `${field} = null must still be rejected (not authorized by any generation prompt)`);
      assert(!validateFormalStructure(data), `${field} = null should also fail formal-structure.schema.json`);
    }
    const noDescription = copy(minimalStructured);
    noDescription.steps[0].description = null;
    assert.throws(() => validateNFRInput(noDescription), /steps\[0\]\.description must be a string/,
      'description = null must still be rejected: no generation prompt marks it "(or null)"');
    const topLevelNull = copy(minimalStructured);
    topLevelNull.useCaseName = null;
    assert.throws(() => validateNFRInput(topLevelNull), /useCaseName/);
    assert(!validateFormalStructure(topLevelNull), 'useCaseName = null should also fail formal-structure.schema.json');
  });

  await test('#1164 SC7 rejection guard: loosened fields still reject non-string, non-null values', () => {
    for (const field of ['precondition', 'previousStep', 'toActor', 'postcondition', 'refUseCaseId', 'deviationPoint', 'rejoinPoint']) {
      const data = copy(minimalStructured);
      data.steps[0][field] = 42;
      assert.throws(() => validateNFRInput(data), new RegExp(`steps\\[0\\]\\.${field} must be a string or null`),
        `${field} = 42 must still be rejected`);
      assert(!validateFormalStructure(data), `${field} = 42 should also fail formal-structure.schema.json`);
      const arrayData = copy(minimalStructured);
      arrayData.steps[0][field] = ['not', 'a', 'string'];
      assert.throws(() => validateNFRInput(arrayData), new RegExp(`steps\\[0\\]\\.${field} must be a string or null`));
      assert(!validateFormalStructure(arrayData), `${field} = array should also fail formal-structure.schema.json`);
    }
    const badFlowType = copy(minimalStructured);
    badFlowType.steps[0].flowType = null;
    assert.throws(() => validateNFRInput(badFlowType), /flowType must be basic, alternative, or exception/,
      'flowType is still a restricted enum, not nullable');
    assert(!validateFormalStructure(badFlowType), 'flowType = null should also fail formal-structure.schema.json: the schema restricts it to a plain string enum, not nullable');
  });
};
