/**
 * Shared actor classification for UCS steps: distinguishes system/automated
 * actors from human/external actors. A single source of truth keeps
 * gherkin-generator.js (When/Then routing) and test-generator.js (branch
 * test-case synthesis) from drifting on which actor names count as "the
 * system".
 */
const SYSTEM_ACTORS = ['system', 'the system', 'application', 'server', 'api'];

function isSystemActor(actor) {
  return SYSTEM_ACTORS.includes((actor || '').toLowerCase());
}

module.exports = { isSystemActor };
