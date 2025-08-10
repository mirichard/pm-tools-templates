import test from 'node:test';
import assert from 'node:assert/strict';
import { stripFrontMatter, sliceFromFirstHeading } from '../src/lib/markdown.js';

const sample = `---\nowner: test\n---\n
title: "Backlog Refinement Template" methodology: "agile" complexity: "advanced"\n# Backlog Refinement Template\nBody here`;

test('stripFrontMatter removes yaml and metadata lines', () => {
  const cleaned = stripFrontMatter(sample);
  assert.ok(!/^---/.test(cleaned));
  assert.match(cleaned, /Backlog Refinement Template/);
  assert.ok(!/methodology:\s*"agile"/.test(cleaned));
});

test('sliceFromFirstHeading starts at first heading', () => {
  const body = sliceFromFirstHeading(stripFrontMatter(sample));
  assert.ok(body.startsWith('# Backlog Refinement Template'));
});
