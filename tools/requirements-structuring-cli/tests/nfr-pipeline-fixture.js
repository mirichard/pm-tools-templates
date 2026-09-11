/** Test-only preload: replace remote LLM stages/prompts, exercise the real CLI. */
const fs = require('fs-extra');
const sample = require('../examples/web-store-ucs.json');
const { UCSTemplate } = require('../src/ucs-template');
const LLMClient = require('../src/llm-client');
const AmbiguityDetector = require('../src/ambiguity-detector');
const RequirementsStructurer = require('../src/structurer');
const UCSTransformer = require('../src/ucs-transformer');
const TestGenerator = require('../src/test-generator');
const GherkinGenerator = require('../src/gherkin-generator');
const NFRGenerator = require('../src/nfr-generator');
const FeedbackLoop = require('../src/feedback-loop');
const ConsistencyChecker = require('../src/consistency-checker');
const inquirer = require('inquirer');

function record(event, detail = {}) {
  if (process.env.NFR_TEST_EVENTS) {
    fs.appendFileSync(process.env.NFR_TEST_EVENTS, JSON.stringify({ event, ...detail }) + '\n');
  }
}

require('./nfr-classification-preload');
AmbiguityDetector.prototype.detect = async function () {
  record('ambiguity');
  const gate = process.env.NFR_TEST_GATE;
  return { findings: [], summary: { blockers: 0, warnings: 0,
    readinessScore: gate === 'not_ready' ? 'not_ready' : gate === 'clarification' ? 'needs_clarification' : 'ready' } };
};
RequirementsStructurer.prototype.structure = async function () {
  record('structure', { provider: this.llm.provider, model: this.llm.model });
  return { useCaseId: sample.useCaseId, useCaseName: sample.useCaseName, steps: sample.basicFlow.steps };
};
UCSTransformer.prototype.transform = async function () {
  record('ucs');
  return UCSTemplate.fromJSON(sample);
};
const generateTests = TestGenerator.prototype.generate;
TestGenerator.prototype.generate = function (...args) {
  record('tests');
  return generateTests.apply(this, args);
};
const generateGherkin = GherkinGenerator.prototype.generateFile;
GherkinGenerator.prototype.generateFile = async function (...args) {
  record('gherkin');
  return generateGherkin.apply(this, args);
};
const generateNFR = NFRGenerator.prototype.run;
NFRGenerator.prototype.run = async function (input, options) {
  record('nfr', { hasUseCaseName: Object.prototype.hasOwnProperty.call(input, 'useCaseName'),
    attributes: options.attributes, threshold: options.confidenceThreshold, overlay: options.overlay });
  return generateNFR.call(this, input, options);
};
FeedbackLoop.prototype.run = async function (ucs) {
  record('feedback');
  return { updatedUCS: ucs, suggestions: [] };
};
for (const [method, event] of [['validateWithProcess', 'activity'], ['validateWithState', 'state']]) {
  const original = ConsistencyChecker.prototype[method];
  ConsistencyChecker.prototype[method] = function (...args) {
    record(event);
    return original.apply(this, args);
  };
}
inquirer.prompt = async (questions) => {
  const question = questions[0];
  record('gate', { message: question.message });
  const gate = process.env.NFR_TEST_GATE;
  const decline = gate === 'clarification' ||
    (gate === 'phase1' && question.message.includes('Phase 2')) ||
    (gate === 'phase2' && question.message.includes('Phase 3'));
  return { [question.name]: !decline };
};
