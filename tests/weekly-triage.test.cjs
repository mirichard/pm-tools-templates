const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
test('all three entry points use one tested engine without issue body interpolation',()=>{
 for(const name of ['weekly-triage-automation','sprint-management','verify-completion-claims']){
  const text=fs.readFileSync(path.join(__dirname,`../.github/workflows/${name}.yml`),'utf8');
  assert.match(text,/uses: \.\/\.github\/workflows\/planning-review.yml/);
  assert.doesNotMatch(text,/steps\.triage-data\.outputs|task_description|issues\.close/);
 }
});
test('engine keeps repository content out of shell arguments and defaults to preview',()=>{
 const text=fs.readFileSync(path.join(__dirname,'../.github/workflows/planning-review.yml'),'utf8');
 assert.match(text,/default: true/);assert.match(text,/persist-credentials: false/);
 assert.match(text,/process.env.ISSUE_NUMBER/);assert.doesNotMatch(text,/run:.*\$\{\{/);
});

test('planning uses the project credential for GraphQL and retains the repository client', async () => {
  const workflow = fs.readFileSync(path.join(__dirname, '../.github/workflows/planning-review.yml'), 'utf8');
  const scriptMatch = workflow.match(/          script: \|\n([\s\S]*?)(?=      - uses:)/);
  assert.ok(scriptMatch, 'planning script must be present');
  const script = scriptMatch[1].split('\n').map(line => line.replace(/^ {12}/, '')).join('\n');
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const execute = new AsyncFunction('github', 'getOctokit', 'core', 'require', 'process', script);
  const projectToken = 'synthetic-project-read-token';
  const repositoryClient = {
    graphql: {
      defaults() {
        throw new Error('Repository client must not supply project authentication');
      }
    }
  };
  const projectGraphql = async () => ({ viewer: { login: 'project-reader' } });
  let clientCreations = 0;
  let engineCalls = 0;
  const getOctokit = token => {
    assert.equal(token, projectToken);
    clientCreations++;
    return { graphql: projectGraphql };
  };
  const requireEngine = modulePath => {
    assert.equal(modulePath, './scripts/planning-automation.cjs');
    return {
      async run(options) {
        engineCalls++;
        assert.equal(options.github, repositoryClient);
        assert.equal(options.graphql, projectGraphql);
        assert.equal(options.preview, true);
        assert.equal(options.issueNumber, null);
        assert.deepEqual(await options.graphql(), { viewer: { login: 'project-reader' } });
      }
    };
  };
  await execute(repositoryClient, getOctokit, {}, requireEngine, {
    env: { PROJECT_TOKEN: projectToken, PREVIEW: 'true', ISSUE_NUMBER: '' }
  });
  assert.equal(clientCreations, 1);
  assert.equal(engineCalls, 1);
  await assert.rejects(
    execute(repositoryClient, getOctokit, {}, requireEngine, {
      env: { PROJECT_TOKEN: '', PREVIEW: 'false', ISSUE_NUMBER: '' }
    }),
    /ROADMAP_PROJECT_TOKEN required/
  );
  await assert.rejects(
    execute(repositoryClient, getOctokit, {}, requireEngine, {
      env: { PROJECT_TOKEN: projectToken, PREVIEW: 'true', ISSUE_NUMBER: 'invalid' }
    }),
    /Invalid issue number/
  );
  assert.equal(clientCreations, 1);
  assert.equal(engineCalls, 1);
});
