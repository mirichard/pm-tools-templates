#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DOMAINS = ['Stakeholder', 'Team', 'Delivery', 'Planning', 'Uncertainty', 'Measurement'];
const MINIMUM_ASSETS = 3;

const normalize = value => String(value).replaceAll('\\', '/').replace(/^\.\//, '');
const readJson = (root, file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

function localLinks(content) {
  return [...content.matchAll(/\[[^\]]+\]\((<[^>]+>|[^)]+)\)/g)]
    .map(match => match[1].replace(/^<|>$/g, ''))
    .filter(href => !/^[a-z][a-z0-9+.-]*:/i.test(href) && !href.startsWith('#'));
}

export function validateDomainNavigation(root) {
  const errors = [];
  const mapping = readJson(root, 'meta/domain-mapping.json');
  const crossReferences = readJson(root, 'meta/cross-references.json');
  const mappedByPath = new Map(mapping.mappings.map(item => [normalize(item.path), item]));
  const crossPaths = new Set(crossReferences.records.map(item => normalize(item.path)));
  const requiredStarts = readJson(root, 'meta/domain-review-decisions.json').decisions;
  const rootReadme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  const rootLinks = new Set(localLinks(rootReadme).map(normalize));
  const journeys = [];

  for (const domain of DOMAINS) {
    const slug = domain.toLowerCase();
    const domainRoot = path.join(root, 'domains', slug);
    const readmePath = path.join(domainRoot, 'README.md');
    const mapped = mapping.mappings.filter(item => item.domain?.primary === domain);
    if (mapped.length < MINIMUM_ASSETS) errors.push(`${domain}: ${mapped.length} assets; minimum is ${MINIMUM_ASSETS}`);
    if (!fs.existsSync(readmePath)) {
      errors.push(`${domain}: missing domains/${slug}/README.md`);
      continue;
    }
    if (!rootLinks.has(`domains/${slug}/`)) errors.push(`${domain}: root README does not link the domain entry point`);

    const content = fs.readFileSync(readmePath, 'utf8');
    const linkedMapped = new Set();
    for (const href of localLinks(content)) {
      const target = path.resolve(domainRoot, href.split('#')[0]);
      if (!target.startsWith(`${root}${path.sep}`) || !fs.existsSync(target)) {
        errors.push(`${domain}: broken or externalized local link ${href}`);
        continue;
      }
      const relative = normalize(path.relative(root, target));
      if (mappedByPath.get(relative)?.domain?.primary === domain) linkedMapped.add(relative);
    }
    if (linkedMapped.size < MINIMUM_ASSETS) {
      errors.push(`${domain}: landing page links ${linkedMapped.size} primary-domain assets; minimum is ${MINIMUM_ASSETS}`);
    }
    for (const decision of requiredStarts.filter(item => item.primary === domain)) {
      if (!linkedMapped.has(normalize(decision.path))) {
        errors.push(`${domain}: missing reviewed starting asset: ${decision.path}`);
      }
    }
    for (const asset of linkedMapped) {
      if (!crossPaths.has(asset)) errors.push(`${domain}: starting asset lacks workflow cross-reference: ${asset}`);
    }
    journeys.push({ domain, mappedAssets: mapped.length, startingAssets: linkedMapped.size });
  }

  for (const asset of mappedByPath.keys()) {
    if (!crossPaths.has(asset)) errors.push(`Mapped asset lacks workflow cross-reference: ${asset}`);
  }
  for (const asset of crossPaths) {
    if (!mappedByPath.has(asset)) errors.push(`Workflow cross-reference has unmapped path: ${asset}`);
  }
  if (crossReferences.covered !== mapping.mappings.length || crossReferences.denominator !== mapping.mappings.length) {
    errors.push('Cross-reference coverage does not match the domain-mapping denominator');
  }
  return { errors: [...new Set(errors)].sort(), journeys };
}

function main() {
  const root = process.cwd();
  const result = validateDomainNavigation(root);
  if (result.errors.length) {
    console.error(`Domain navigation validation failed with ${result.errors.length} error(s):`);
    result.errors.forEach(error => console.error(` - ${error}`));
    process.exit(1);
  }
  for (const journey of result.journeys) {
    console.log(`PASS: ${journey.domain} — ${journey.mappedAssets} mapped assets; ${journey.startingAssets} landing-page starts.`);
  }
  console.log('PASS: six domain entry points and workflow findability validated.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
