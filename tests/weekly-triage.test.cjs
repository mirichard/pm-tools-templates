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
