// Offline CLI error-path test: use the real parser, structurer, join and catch.
const LLMClient = require('../src/llm-client');
const AmbiguityDetector = require('../src/ambiguity-detector');
const inquirer = require('inquirer');
AmbiguityDetector.prototype.detect = async () => ({ findings: [],
  summary: { blockers: 0, warnings: 0, readinessScore: 'ready' } });
inquirer.prompt = async questions => ({ [questions[0].name]: true });
LLMClient.prototype.chat = async () => JSON.stringify({ useCaseId: 'UC-TEST', useCaseName: 'Test',
  steps: [{ stepId: '4', actor: 'System', action: 'validates', businessObject: 'Password',
    ...(process.env.TRACE_TEST_ID === 'missing' ? {} : { sourceRequirementId: process.env.TRACE_TEST_ID }) }] });
