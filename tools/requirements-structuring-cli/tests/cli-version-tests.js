const assert = require('assert/strict');
const { execFileSync } = require('child_process');
const path = require('path');

module.exports = async runner => {
  await runner.test('CLI --version reports the same version as package.json', () => {
    const pkg = require('../package.json');
    const output = execFileSync(
      process.execPath,
      [path.join(__dirname, '..', 'src', 'index.js'), '--version'],
      { encoding: 'utf8' }
    );
    const lines = output.split('\n').map(l => l.trim()).filter(Boolean);
    const reportedVersion = lines[lines.length - 1];
    assert.equal(reportedVersion, pkg.version);
    return true;
  });
};
