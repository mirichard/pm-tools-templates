import { mkdtemp, mkdir, copyFile, writeFile, readFile, rm, access } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

let root;
beforeEach(async () => {
  root = await mkdtemp(path.join(os.tmpdir(), 'workflow-build-'));
  await mkdir(path.join(root, 'scripts'));
  await mkdir(path.join(root, 'src'));
  await writeFile(path.join(root, 'package.json'), '{"type":"module"}');
  await copyFile(fileURLToPath(new URL('../scripts/build.js', import.meta.url)), path.join(root, 'scripts/build.js'));
});
afterEach(async () => { await rm(root, { recursive: true, force: true }); });
const build = () => spawnSync(process.execPath, ['scripts/build.js'], { cwd: root, encoding: 'utf8' });

test('produces importable ESM and removes stale output', async () => {
  await writeFile(path.join(root, 'src/index.js'), 'export const value = 42;');
  await mkdir(path.join(root, 'dist'));
  await writeFile(path.join(root, 'dist/stale.js'), 'stale');
  const result = build();
  expect(result.status).toBe(0);
  expect(await readFile(path.join(root, 'dist/index.js'), 'utf8')).toContain('value = 42');
  await expect(access(path.join(root, 'dist/stale.js'))).rejects.toThrow();
});
test.each([
  ['syntax error', 'export const = ;'],
  ['unresolvable import', 'export { missing } from "./missing.js";'],
])('rejects %s and leaves no usable distribution', async (_name, source) => {
  await writeFile(path.join(root, 'src/index.js'), source);
  expect(build().status).not.toBe(0);
  await expect(access(path.join(root, 'dist'))).rejects.toThrow();
});
