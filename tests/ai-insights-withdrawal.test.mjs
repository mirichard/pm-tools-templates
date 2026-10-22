import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync, spawnSync } from 'node:child_process';
import os from 'node:os';

const source = fs.readFileSync('tools/template-generator-cli/src/ecosystem-gateway.js', 'utf8');
const context = { module: { exports: {} }, __dirname: path.resolve('tools/template-generator-cli/src'), process, console,
  require(name) {
    if (name === 'path') return path;
    if (['fs-extra', 'chalk', 'ora'].includes(name)) return {};
    throw new Error(`Unexpected dependency call: ${name}`);
  },
};
vm.runInNewContext(source, context);
const { EcosystemGateway, AIInsightsConnector } = context.module.exports;

test('withdrawn AI is unavailable even when its old files or service might exist', async () => {
  const result = await EcosystemGateway.prototype.checkAIInsightsAvailable.call({});
  assert.equal(result.available, false);
  const connector = new AIInsightsConnector('/old/repository');
  assert.equal(await connector.checkAIServiceAvailable(), false);
  const insights = await connector.getProjectIntelligence({ teamSize: 5 });
  assert.equal(insights.available, false);
  assert.equal(insights.aiConfidence, null);
  assert.equal(insights.riskPredictions.length, 0);
});

test('container withdrawal gate passes absence and rejects restored tracked files', () => {
  const workflow = fs.readFileSync('.github/workflows/container-scan.yml', 'utf8');
  const script = workflow.split('        run: |\n')[1].split('\n').map(line => line.replace(/^          /, '')).join('\n');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-withdrawal-'));
  try {
    execFileSync('git', ['init', '-q', directory]);
    assert.equal(spawnSync('bash', ['-e', '-c', script], { cwd: directory }).status, 0);
    fs.mkdirSync(path.join(directory, 'ai-insights'));
    fs.writeFileSync(path.join(directory, 'ai-insights/package.json'), '{}');
    execFileSync('git', ['add', 'ai-insights'], { cwd: directory });
    assert.equal(spawnSync('bash', ['-e', '-c', script], { cwd: directory }).status, 1);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
