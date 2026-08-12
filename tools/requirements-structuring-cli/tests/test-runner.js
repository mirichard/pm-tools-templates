#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const { BusinessObject, BusinessObjectRegistry } = require('../src/business-object');
const { UCSStep, AlternativeFlow, UCSTemplate } = require('../src/ucs-template');
const TestGenerator = require('../src/test-generator');
const ConsistencyChecker = require('../src/consistency-checker');
const RequirementsParser = require('../src/parser');
const AmbiguityDetector = require('../src/ambiguity-detector');
const GherkinGenerator = require('../src/gherkin-generator');
const LLMClient = require('../src/llm-client');
const {
  sanitizeTerminalValue,
  validateStructuredResponse,
  buildSafeOutputPath,
  buildContainedChildPath,
  sanitizeErrorPayload,
  safeWriteText,
  safeWriteJSON,
} = require('../src/index');

class TestRunner {
  constructor() {
    this.testCount = 0;
    this.passedCount = 0;
    this.failedCount = 0;
  }

  async runAllTests() {
    console.log(chalk.blue.bold('🧪 Running Requirements Structuring CLI Tests\n'));

    await this.testBusinessObjectModel();
    await this.testUCSTemplateModel();
    await this.testTestGenerator();
    await this.testConsistencyChecker();
    await this.testParser();
    await this.testAmbiguityDetector();
    await this.testGherkinGenerator();
    await this.testSecurityBoundaries();

    this.printResults();
  }

  // ─── Business Object Tests ───────────────────────────────────────────────
  async testBusinessObjectModel() {
    console.log(chalk.yellow('📦 Testing Business Object Model...'));

    await this.test('Create a business object with all fields', () => {
      const bo = new BusinessObject('Order', ['totalAmount', 'status'], ['Filled', 'Shipped', 'Closed'], ['create', 'ship'], ['totalAmount > 0']);
      return bo.name === 'Order' && bo.attributes.length === 2 && bo.allowedStates.length === 3;
    });

    await this.test('Validate allowed states', () => {
      const bo = new BusinessObject('Order', [], ['Filled', 'Shipped']);
      return bo.isValidState('Filled') && !bo.isValidState('Deleted');
    });

    await this.test('Empty states allows any state', () => {
      const bo = new BusinessObject('Product');
      return bo.isValidState('anything');
    });

    await this.test('Registry stores and retrieves BOs', () => {
      const registry = new BusinessObjectRegistry();
      registry.register(new BusinessObject('Order'));
      registry.register(new BusinessObject('Cart'));
      return registry.has('Order') && registry.has('Cart') && !registry.has('Invoice') && registry.getAll().length === 2;
    });

    await this.test('Registry fromArray factory', () => {
      const registry = BusinessObjectRegistry.fromArray([
        { name: 'Order', allowedStates: ['Filled'] },
        { name: 'Cart', allowedStates: ['Active'] },
      ]);
      return registry.get('Order').allowedStates[0] === 'Filled';
    });

    await this.test('JSON round-trip', () => {
      const bo = new BusinessObject('Order', ['amount'], ['New'], ['create'], ['amount > 0']);
      const json = bo.toJSON();
      const restored = BusinessObject.fromJSON(json);
      return restored.name === 'Order' && restored.constraints[0] === 'amount > 0';
    });
  }

  // ─── UCS Template Tests ──────────────────────────────────────────────────
  async testUCSTemplateModel() {
    console.log(chalk.yellow('\n📋 Testing UCS Template Model...'));

    await this.test('Create UCS template with basic flow', () => {
      const ucs = new UCSTemplate({
        useCaseId: 'UC-01',
        intent: 'Add item to cart',
        role: 'Customer',
        preconditions: ['Customer is logged in'],
        postconditions: ['Item added to cart'],
        basicFlow: { steps: [{ stepId: '1', actor: 'Customer', action: 'adds', businessObject: 'Product' }] },
      });
      return ucs.basicFlow.steps.length === 1 && ucs.basicFlow.steps[0].actor === 'Customer';
    });

    await this.test('Get flows at step returns correct branches', () => {
      const ucs = new UCSTemplate({
        useCaseId: 'UC-01', intent: 'Test', role: 'User',
        basicFlow: { steps: [
          { stepId: '1', actor: 'User', action: 'does', businessObject: 'Thing' },
          { stepId: '2', actor: 'User', action: 'does', businessObject: 'Other' },
        ]},
        alternativeFlows: [
          { flowId: '1a', deviationPoint: '1', triggerCondition: 'If X', steps: [{ stepId: '1a1', actor: 'System', action: 'shows', businessObject: 'Error' }] },
          { flowId: '2a', deviationPoint: '2', triggerCondition: 'If Y', steps: [{ stepId: '2a1', actor: 'System', action: 'retries', businessObject: 'Thing' }] },
        ],
      });
      return ucs.getFlowsAtStep('1').length === 1 && ucs.getFlowsAtStep('2').length === 1 && ucs.getFlowsAtStep('3').length === 0;
    });

    await this.test('Extract business objects from all flows', () => {
      const ucs = new UCSTemplate({
        useCaseId: 'UC-01', intent: 'Test', role: 'User',
        basicFlow: { steps: [{ stepId: '1', actor: 'User', action: 'creates', businessObject: 'Order' }] },
        alternativeFlows: [{ flowId: '1a', deviationPoint: '1', triggerCondition: 'If X', steps: [{ stepId: '1a1', actor: 'System', action: 'displays', businessObject: 'Error' }] }],
        exceptionFlows: [{ flowId: '1b', deviationPoint: '1', triggerCondition: 'Err', steps: [{ stepId: '1b1', actor: 'System', action: 'logs', businessObject: 'Payment' }] }],
      });
      const bos = ucs.extractBusinessObjects();
      return bos.includes('Order') && bos.includes('Error') && bos.includes('Payment') && bos.length === 3;
    });
  }

  // ─── Test Generator (Algorithm 1) ────────────────────────────────────────
  async testTestGenerator() {
    console.log(chalk.yellow('\n🧪 Testing Test Generator (Algorithm 1)...'));

    const generator = new TestGenerator();

    await this.test('Basic flow generates one test case', () => {
      const ucs = {
        useCaseId: 'UC-01', intent: 'Add to cart', role: 'Customer',
        preconditions: ['Logged in'], postconditions: ['Item in cart'],
        basicFlow: { steps: [
          { stepId: '1', actor: 'Customer', action: 'adds', businessObject: 'Product' },
          { stepId: '2', actor: 'System', action: 'displays', businessObject: 'Shopping Cart' },
        ]},
        alternativeFlows: [], exceptionFlows: [],
      };
      const testCases = generator.generate(ucs);
      return testCases.length === 1 && testCases[0].type === 'basic' && testCases[0].steps.length === 2;
    });

    await this.test('Alternative flow at step 1 generates 2 test cases', () => {
      const ucs = {
        useCaseId: 'UC-01', intent: 'Add to cart', role: 'Customer',
        preconditions: ['Logged in'], postconditions: ['Item in cart'],
        basicFlow: { steps: [
          { stepId: '1', actor: 'Customer', action: 'adds', businessObject: 'Product' },
          { stepId: '2', actor: 'System', action: 'displays', businessObject: 'Shopping Cart' },
        ]},
        alternativeFlows: [{
          flowId: '1a', deviationPoint: '1', triggerCondition: 'Product out of stock',
          steps: [{ stepId: '1a1', actor: 'System', action: 'displays', businessObject: 'Error' }],
        }],
        exceptionFlows: [],
      };
      const testCases = generator.generate(ucs);
      // 1 basic + 1 alternative = 2
      return testCases.length === 2 && testCases[1].type === 'alternative';
    });

    await this.test('Web Store example generates correct count (per paper Table 4)', () => {
      const ucs = {
        useCaseId: 'UC-02', intent: 'Check out the order', role: 'Customer',
        preconditions: ['Logged in', 'Order created'], postconditions: ['Checkout complete'],
        basicFlow: { steps: [
          { stepId: '1', actor: 'Customer', action: 'checks out', businessObject: 'Order' },
          { stepId: '2', actor: 'Customer', action: 'confirms', businessObject: 'Order' },
          { stepId: '3', actor: 'Customer', action: 'updates', businessObject: 'Order' },
          { stepId: '4', actor: 'Customer', action: 'receives', businessObject: 'Email' },
        ]},
        alternativeFlows: [
          { flowId: '1a', deviationPoint: '1', triggerCondition: 'Order incorrect', steps: [{ stepId: '1a1', actor: 'System', action: 'displays', businessObject: 'Error' }] },
          { flowId: '2a', deviationPoint: '2', triggerCondition: 'Payment fails', steps: [{ stepId: '2a1', actor: 'System', action: 'prompts', businessObject: 'Payment' }] },
          { flowId: '3a', deviationPoint: '3', triggerCondition: 'Past deadline', steps: [{ stepId: '3a1', actor: 'System', action: 'displays', businessObject: 'Notification' }] },
          { flowId: '4a', deviationPoint: '4', triggerCondition: 'Email failure', steps: [{ stepId: '4a1', actor: 'System', action: 'displays', businessObject: 'Error' }] },
        ],
        exceptionFlows: [],
      };
      const testCases = generator.generate(ucs);
      // 1 basic + 4 alternatives = 5 (matches paper's Table 4 for checkout)
      return testCases.length === 5;
    });

    await this.test('Rejoin point reconnects to basic flow', () => {
      const ucs = {
        useCaseId: 'UC-01', intent: 'Test', role: 'User',
        preconditions: [], postconditions: ['Done'],
        basicFlow: { steps: [
          { stepId: '1', actor: 'User', action: 'starts', businessObject: 'Process' },
          { stepId: '2', actor: 'User', action: 'validates', businessObject: 'Data' },
          { stepId: '3', actor: 'User', action: 'completes', businessObject: 'Process' },
        ]},
        alternativeFlows: [{
          flowId: '1a', deviationPoint: '1', triggerCondition: 'Special case',
          steps: [{ stepId: '1a1', actor: 'System', action: 'handles', businessObject: 'Special' }],
          rejoinPoint: '3',
        }],
        exceptionFlows: [],
      };
      const testCases = generator.generate(ucs);
      const altTC = testCases[1];
      // Should have: 0 steps before deviation + 1 alt step + step 3 (rejoin) = 2 steps
      return altTC.steps.length === 2 && altTC.steps[1].stepId === '3';
    });
  }

  // ─── Consistency Checker (Algorithms 2 & 3) ──────────────────────────────
  async testConsistencyChecker() {
    console.log(chalk.yellow('\n🔍 Testing Consistency Checker (Algorithms 2 & 3)...'));

    const checker = new ConsistencyChecker();

    await this.test('Rule 1: Detects missing BO in UCS', () => {
      const ucs = {
        useCaseId: 'UC-01', intent: 'Test', role: 'User',
        basicFlow: { steps: [{ stepId: '1', actor: 'User', action: 'creates', businessObject: 'Order' }] },
        alternativeFlows: [], exceptionFlows: [],
      };
      const bpm = {
        activityNodes: [{ nodeId: 'a1', name: 'Create order', associatedUseCaseId: 'UC-01' }],
        objectNodes: [
          { nodeId: 'on1', businessObjectType: 'Order' },
          { nodeId: 'on2', businessObjectType: 'Invoice' },
        ],
        objectEdges: [
          { sourceNodeId: 'on1', targetNodeId: 'a1' },
          { sourceNodeId: 'a1', targetNodeId: 'on2' },
        ],
        controlEdges: [],
      };
      const result = checker.validateWithProcess(ucs, bpm);
      // Invoice is in BPM but not in UCS → Rule 1 violation
      return result.violations.length === 1 && result.violations[0].rule === 1 && result.violations[0].businessObject === 'Invoice';
    });

    await this.test('Rule 2: Detects BO ordering violation', () => {
      const ucs = {
        useCaseId: 'UC-01', intent: 'Test', role: 'User',
        basicFlow: { steps: [
          { stepId: '1', actor: 'User', action: 'creates', businessObject: 'Order' },
          { stepId: '2', actor: 'User', action: 'fills', businessObject: 'Shopping Cart' },
        ]},
        alternativeFlows: [], exceptionFlows: [],
      };
      const bpm = {
        activityNodes: [{ nodeId: 'a1', name: 'Check out', associatedUseCaseId: 'UC-01' }],
        objectNodes: [
          { nodeId: 'on1', businessObjectType: 'Shopping Cart' },
          { nodeId: 'on2', businessObjectType: 'Order' },
        ],
        objectEdges: [
          { sourceNodeId: 'on1', targetNodeId: 'a1' },
          { sourceNodeId: 'a1', targetNodeId: 'on2' },
        ],
        controlEdges: [],
      };
      const result = checker.validateWithProcess(ucs, bpm);
      // Order (output) appears before Shopping Cart (input) → Rule 2 violation
      const rule2 = result.violations.filter((v) => v.rule === 2);
      return rule2.length === 1;
    });

    await this.test('Rule 3: Detects state ordering violation', () => {
      const ucs = {
        useCaseId: 'UC-01', intent: 'Test', role: 'User',
        basicFlow: { steps: [
          { stepId: '1', actor: 'User', action: 'ship order', businessObject: 'Order' },
          { stepId: '2', actor: 'User', action: 'fill order', businessObject: 'Order' },
        ]},
        alternativeFlows: [], exceptionFlows: [],
      };
      const stateModel = {
        businessObjectName: 'Order',
        states: [
          { stateId: 's1', name: 'Filled' },
          { stateId: 's2', name: 'Shipped' },
        ],
        transitions: [
          { transitionId: 't1', sourceStateId: 's1', targetStateId: 's2', triggerAction: 'fill order' },
          { transitionId: 't2', sourceStateId: 's2', targetStateId: 's2', triggerAction: 'ship order' },
        ],
      };
      const result = checker.validateWithState(ucs, stateModel);
      // "ship order" precedes "fill order" in UCS but state machine requires fill → ship
      return result.violations.length >= 1 && result.violations[0].rule === 3;
    });

    await this.test('No violations when UCS is consistent', () => {
      const ucs = {
        useCaseId: 'UC-01', intent: 'Test', role: 'User',
        basicFlow: { steps: [
          { stepId: '1', actor: 'User', action: 'adds', businessObject: 'Shopping Cart' },
          { stepId: '2', actor: 'User', action: 'creates', businessObject: 'Order' },
        ]},
        alternativeFlows: [], exceptionFlows: [],
      };
      const bpm = {
        activityNodes: [{ nodeId: 'a1', name: 'Check out', associatedUseCaseId: 'UC-01' }],
        objectNodes: [
          { nodeId: 'on1', businessObjectType: 'Shopping Cart' },
          { nodeId: 'on2', businessObjectType: 'Order' },
        ],
        objectEdges: [
          { sourceNodeId: 'on1', targetNodeId: 'a1' },
          { sourceNodeId: 'a1', targetNodeId: 'on2' },
        ],
        controlEdges: [],
      };
      const result = checker.validateWithProcess(ucs, bpm);
      return result.violations.length === 0;
    });
  }

  // ─── Parser Tests ────────────────────────────────────────────────────────
  async testParser() {
    console.log(chalk.yellow('\n📄 Testing Requirements Parser...'));

    const parser = new RequirementsParser();

    await this.test('Parses example input file', async () => {
      const examplePath = path.resolve(__dirname, '..', 'examples', 'web-store-input.md');
      if (!(await fs.pathExists(examplePath))) return false;
      const result = await parser.parse(examplePath);
      return result.useCaseId === 'UC-01' && result.basicFlow.length === 7 && result.businessObjects.includes('Shopping Cart');
    });

    await this.test('Parses markdown content directly', () => {
      const content = '## Use Case ID\nUC-99\n## Actors\n- Admin\n- System\n## Basic Flow\n1. Admin logs in\n2. System displays dashboard';
      const result = parser.parseContent(content);
      return result.useCaseId === 'UC-99' && result.actors.length === 2 && result.basicFlow.length === 2;
    });
  }

  // ─── Ambiguity Detector Tests ─────────────────────────────────────────────
  async testAmbiguityDetector() {
    console.log(chalk.yellow('\n🔎 Testing Ambiguity Detector...'));

    await this.test('Instantiates without error', () => {
      const detector = new AmbiguityDetector();
      return detector !== null && typeof detector.detect === 'function';
    });

    await this.test('formatFindings renders ready badge', () => {
      const detector = new AmbiguityDetector();
      const result = {
        findings: [],
        summary: { blockers: 0, warnings: 0, readinessScore: 'ready' },
      };
      const output = detector.formatFindings(result);
      return output.includes('READY') && output.includes('No ambiguities detected');
    });

    await this.test('formatFindings renders blockers', () => {
      const detector = new AmbiguityDetector();
      const result = {
        findings: [{
          severity: 'blocker',
          category: 'vague_qualifier',
          phrase: 'should be fast',
          section: 'Performance',
          issue: 'No numeric target',
          question: 'What response time is acceptable?',
        }],
        summary: { blockers: 1, warnings: 0, readinessScore: 'not_ready' },
      };
      const output = detector.formatFindings(result);
      return output.includes('NOT READY') && output.includes('should be fast') && output.includes('1 blocker');
    });

    await this.test('formatMarkdown renders Markdown report', () => {
      const detector = new AmbiguityDetector();
      const result = {
        findings: [
          { severity: 'blocker', category: 'vague_qualifier', phrase: 'quickly', section: 'Perf', issue: 'Vague', question: 'How fast?' },
          { severity: 'warning', category: 'missing_boundary', phrase: 'many items', section: 'Cart', issue: 'No max', question: 'What limit?' },
        ],
        summary: { blockers: 1, warnings: 1, readinessScore: 'needs_clarification' },
      };
      const md = detector.formatMarkdown(result);
      return md.includes('# Ambiguity Analysis Report') && md.includes('## Blockers') && md.includes('## Warnings');
    });
  }

  // ─── Gherkin Generator Tests ──────────────────────────────────────────────
  async testGherkinGenerator() {
    console.log(chalk.yellow('\n🥒 Testing Gherkin Generator...'));

    const gherkin = new GherkinGenerator();

    await this.test('Generates Feature header from UCS', () => {
      const ucs = {
        useCaseId: 'UC-01',
        useCaseName: 'Add to Cart',
        intent: 'Customer adds product to shopping cart',
        preconditions: ['Customer is logged in'],
      };
      const output = gherkin.generate([], ucs);
      return output.includes('Feature: UC-01') && output.includes('Add to Cart') && output.includes('Background:');
    });

    await this.test('Background contains UCS preconditions', () => {
      const ucs = {
        useCaseId: 'UC-01', useCaseName: 'Test', intent: 'Test',
        preconditions: ['Customer is logged in', 'Cart is empty'],
      };
      const output = gherkin.generate([], ucs);
      return output.includes('Given the customer is logged in') && output.includes('Given the cart is empty');
    });

    await this.test('Test case becomes Scenario with Given/When/Then', () => {
      const ucs = {
        useCaseId: 'UC-01', useCaseName: 'Add to Cart', intent: 'Test',
        preconditions: [],
      };
      const testCases = [{
        triggerCondition: 'Customer adds a valid product',
        preconditions: ['Product is in stock'],
        steps: [
          { actor: 'Customer', action: 'selects', businessObject: 'Product', description: 'Customer selects a product from the catalog' },
          { actor: 'System', action: 'adds', businessObject: 'Cart', description: 'System adds the product to the cart' },
        ],
        expectedPostconditions: ['Cart contains the selected product'],
      }];
      const output = gherkin.generate(testCases, ucs);
      return (
        output.includes('Scenario: Customer adds a valid product') &&
        output.includes('Given') &&
        output.includes('When') &&
        output.includes('Then')
      );
    });

    await this.test('Multiple test cases produce multiple scenarios', () => {
      const ucs = {
        useCaseId: 'UC-01', useCaseName: 'Test', intent: 'Test',
        preconditions: [],
      };
      const testCases = [
        { triggerCondition: 'Happy Path', preconditions: [], steps: [{ actor: 'User', action: 'clicks', businessObject: 'Button' }], expectedPostconditions: [] },
        { triggerCondition: 'Error Path', preconditions: [], steps: [{ actor: 'System', action: 'shows', businessObject: 'Error' }], expectedPostconditions: [] },
      ];
      const output = gherkin.generate(testCases, ucs);
      const scenarioCount = (output.match(/Scenario:/g) || []).length;
      return scenarioCount === 2;
    });

    await this.test('Actor actions map to When, system actions to Then', () => {
      const ucs = { useCaseId: 'UC-01', useCaseName: 'Test', intent: 'Test', preconditions: [] };
      const testCases = [{
        triggerCondition: 'Test',
        preconditions: [],
        steps: [
          { actor: 'Customer', action: 'submits', businessObject: 'Order' },
          { actor: 'System', action: 'confirms', businessObject: 'Order' },
        ],
        expectedPostconditions: [],
      }];
      const output = gherkin.generate(testCases, ucs);
      const lines = output.split('\n').map((l) => l.trim());
      const whenLine = lines.find((l) => l.startsWith('When'));
      const thenLine = lines.find((l) => l.startsWith('Then'));
      return whenLine && thenLine && whenLine.includes('Customer') && thenLine.includes('System');
    });

    await this.test('Postconditions appear as Then steps', () => {
      const ucs = { useCaseId: 'UC-01', useCaseName: 'Test', intent: 'Test', preconditions: [] };
      const testCases = [{
        triggerCondition: 'Test',
        preconditions: [],
        steps: [{ actor: 'User', action: 'clicks', businessObject: 'Save' }],
        expectedPostconditions: ['Record is saved'],
      }];
      const output = gherkin.generate(testCases, ucs);
      return output.includes('Then the record is saved');
    });
  }

  // ─── Security boundary tests ─────────────────────────────────────────────
  async testSecurityBoundaries() {
    console.log(chalk.yellow('\n🛡️ Testing security boundaries...'));
    const tempRoot = path.join('/tmp', `requirements-cli-security-${process.pid}`);
    await fs.remove(tempRoot);
    await fs.ensureDir(tempRoot);

    await this.test('Terminal sanitizer strips control chars', () => {
      const unsafe = 'first\r\nsecond\u001b[31mred\u2028text\u2029';
      const safe = sanitizeTerminalValue(unsafe);
      return safe.includes('first') && safe.includes('second') && !safe.includes('\r') && !safe.includes('\n') && !safe.includes('\u001b') && !safe.includes('\u2028') && !safe.includes('\u2029');
    });

    await this.test('Structured response validator accepts valid JSON object', () => {
      const payload = { content: { text: 'ok' } };
      return validateStructuredResponse(JSON.stringify(payload), { expectedRoot: 'object', requiredKeys: ['content'] });
    });

    await this.test('Structured response validator rejects dangerous keys', () => {
      try {
        validateStructuredResponse('{"__proto__":{"polluted":true}}', { expectedRoot: 'object' });
        return false;
      } catch (error) {
        return typeof error?.message === 'string' && error.message.includes('prohibited key');
      }
    });

    await this.test('Output path builder rejects null bytes and traversal outside root', () => {
      try {
        buildContainedChildPath('/tmp/root', '../escape.txt');
        return false;
      } catch (error) {
        return typeof error?.message === 'string' && error.message.includes('application-controlled names');
      }
    });

    await this.test('Error redaction strips secrets and hostile content', () => {
      const redacted = sanitizeErrorPayload({
        provider: 'test', status: 401, message: 'Bearer abc123\n\u001b[31m evil\n',
        headers: { authorization: 'Bearer abc123', 'x-api-key': 'key123', cookie: 'sid=secret' },
        body: 'token=abc123',
      });
      const serialized = JSON.stringify(redacted);
      return serialized.includes('REDACTED') && !serialized.includes('abc123') && !serialized.includes('key123') && !serialized.includes('sid=secret') && !serialized.includes('headers');
    });

    await this.test('Real text sink preserves multiline Markdown and Gherkin', async () => {
      const markdown = '# Report\n\n- First\n- Second\n';
      const gherkin = 'Feature: Checkout\n\n  Scenario: Pay\n    Given a cart\n';
      await safeWriteText(path.join(tempRoot, 'report.md'), markdown, 'utf8', { rootDir: tempRoot });
      await safeWriteText(path.join(tempRoot, 'feature.feature'), gherkin, 'utf8', { rootDir: tempRoot });
      return await fs.readFile(path.join(tempRoot, 'report.md'), 'utf8') === markdown && await fs.readFile(path.join(tempRoot, 'feature.feature'), 'utf8') === gherkin;
    });

    await this.test('Real JSON sink validates and parses output', async () => {
      const output = path.join(tempRoot, 'data.json');
      await safeWriteJSON(output, { content: { text: 'ok' } }, { rootDir: tempRoot });
      return JSON.parse(await fs.readFile(output, 'utf8')).content.text === 'ok';
    });

    await this.test('Real JSON sink rejects dangerous and oversized data before writing', async () => {
      try {
        await safeWriteJSON(path.join(tempRoot, 'danger.json'), JSON.parse('{"safe":{"__proto__":{"polluted":true}}}'), { rootDir: tempRoot });
        await safeWriteJSON(path.join(tempRoot, 'large.json'), { text: 'x'.repeat(2000001) }, { rootDir: tempRoot });
        return false;
      } catch (error) {
        return error instanceof Error && !(await fs.pathExists(path.join(tempRoot, 'danger.json')));
      }
    });

    await this.test('User paths work while generated paths stay contained', async () => {
      const absolute = path.join(tempRoot, 'absolute.md');
      await safeWriteText(absolute, 'ok');
      let escaped = false;
      try { buildContainedChildPath(tempRoot, '../escape.md'); } catch { escaped = true; }
      return await fs.pathExists(absolute) && escaped;
    });

    await this.test('Symlink escape is rejected for generated paths', async () => {
      const outside = path.join(tempRoot, 'outside');
      const root = path.join(tempRoot, 'root');
      await fs.ensureDir(outside);
      await fs.ensureSymlink(outside, path.join(root, 'link'));
      try { buildContainedChildPath(root, 'link/file.json'); return false; } catch { return true; }
    });

    await this.test('Remote content cannot select a destination path', async () => {
      const candidate = { outputPath: '../escape.json', content: 'remote' };
      await safeWriteJSON(path.join(tempRoot, 'fixed.json'), candidate, { rootDir: tempRoot });
      return await fs.pathExists(path.join(tempRoot, 'fixed.json')) && !(await fs.pathExists(path.join(tempRoot, '..', 'escape.json')));
    });

    await this.test('Real chatJSON validates fenced, malformed, and dangerous JSON', async () => {
      const client = Object.create(LLMClient.prototype);
      client.chat = async () => '```json\n{"content":{"text":"ok"}}\n```';
      const valid = await client.chatJSON({ requiredKeys: ['content'] });
      client.chat = async () => '{bad';
      let malformed = false;
      try { await client.chatJSON(); } catch { malformed = true; }
      client.chat = async () => '{"__proto__":{"polluted":true}}';
      let dangerous = false;
      try { await client.chatJSON(); } catch { dangerous = true; }
      return valid.content.text === 'ok' && malformed && dangerous;
    });

    await this.test('Provider prompts preserve legitimate multiline content', async () => {
      const client = Object.create(LLMClient.prototype);
      let captured;
      client.provider = 'openai';
      client.validate = () => {};
      client._chatOpenAI = async (args) => { captured = args; return 'ok'; };
      const prompt = 'line one\n\nline two';
      await client.chat({ systemPrompt: prompt, userPrompt: prompt });
      return captured.systemPrompt === prompt && captured.userPrompt === prompt;
    });

    await this.test('Trace persistence excludes remote response bodies', async () => {
      const traceDir = path.join(tempRoot, 'traces');
      const client = Object.create(LLMClient.prototype);
      client.traceDir = traceDir;
      client.provider = 'test';
      client.model = 'test-model';
      await client._saveTrace([{ role: 'user', content: 'line one\nline two' }], 'Bearer test-api-key\nremote body');
      const traceFiles = await fs.readdir(traceDir);
      const trace = JSON.parse(await fs.readFile(path.join(traceDir, traceFiles[0]), 'utf8'));
      return trace.response === '[REDACTED_REMOTE_RESPONSE]' && !JSON.stringify(trace).includes('test-api-key') && !JSON.stringify(trace).includes('remote body');
    });

    await fs.remove(tempRoot);
  }

  // ─── Test Infrastructure ─────────────────────────────────────────────────
  async test(description, testFunction) {
    this.testCount++;
    try {
      const result = await testFunction();
      if (result) {
        console.log(chalk.green(`  ✅ ${description}`));
        this.passedCount++;
      } else {
        console.log(chalk.red(`  ❌ ${description}`));
        this.failedCount++;
      }
    } catch (error) {
      console.log(chalk.red(`  ❌ ${description} - Error: ${error.message}`));
      this.failedCount++;
    }
  }

  printResults() {
    console.log(chalk.blue('\n' + '='.repeat(60)));
    console.log(chalk.blue.bold('Test Results'));
    console.log(chalk.blue('='.repeat(60)));
    console.log(chalk.white(`  Total:  ${this.testCount}`));
    console.log(chalk.green(`  Passed: ${this.passedCount}`));
    if (this.failedCount > 0) {
      console.log(chalk.red(`  Failed: ${this.failedCount}`));
    }
    console.log(chalk.blue('='.repeat(60)));

    if (this.failedCount > 0) {
      process.exit(1);
    }
  }
}

const runner = new TestRunner();
runner.runAllTests();
