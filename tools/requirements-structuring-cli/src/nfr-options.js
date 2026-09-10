const { InvalidArgumentError } = require('commander');

function nonEmpty(value) {
  if (!value.trim()) throw new InvalidArgumentError('Expected a non-empty value.');
  return value.trim();
}

function parseAttributes(value) {
  const attributes = value.split(',').map((entry) => entry.trim());
  if (attributes.some((entry) => !entry)) {
    throw new InvalidArgumentError('--attributes requires a comma-separated list without empty entries.');
  }
  // Taxonomy membership is owned by #1115, not this command skeleton.
  return [...new Set(attributes)];
}

function parseConfidence(value) {
  const threshold = Number(value);
  if (!value.trim() || !Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
    throw new InvalidArgumentError('--confidence-threshold must be a finite number between 0 and 1.');
  }
  return threshold;
}

function parseProvider(value) {
  const provider = nonEmpty(value).toLowerCase();
  if (!['gemini', 'anthropic', 'openai'].includes(provider)) {
    throw new InvalidArgumentError('--provider must be gemini, anthropic, or openai (including compatible APIs).');
  }
  return provider;
}

function addNFROptions(command) {
  return command
    .option('--provider <name>', 'LLM provider (uses existing environment configuration)', parseProvider)
    .option('--model <name>', 'Override the configured LLM model', nonEmpty)
    .option('--attributes <names>', 'Comma-separated attribute subset (stored for #1108)', parseAttributes)
    .option('--confidence-threshold <number>', 'Review threshold from 0 to 1 (stored for #1111)', parseConfidence)
    .option('--profile <name>', 'Domain overlay profile (alias for --overlay)', nonEmpty)
    .option('--overlay <name>', 'Domain overlay name; default is neutral core', nonEmpty);
}

function normalizeNFROptions(options) {
  if (options.profile && options.overlay && options.profile !== options.overlay) {
    throw new Error('--profile and --overlay must select the same name when both are supplied.');
  }
  return {
    ...options,
    attributes: options.attributes || [],
    confidenceThreshold: options.confidenceThreshold ?? null,
    overlay: options.overlay || options.profile || 'neutral',
  };
}

// Keep provider/model resolution in LLMClient; flags override its existing env
// inputs only for this invocation. Restore them even if an action fails.
function configureNFRProvider(options) {
  const previous = { LLM_PROVIDER: process.env.LLM_PROVIDER, LLM_MODEL: process.env.LLM_MODEL };
  if (options.provider) process.env.LLM_PROVIDER = options.provider;
  if (options.model) process.env.LLM_MODEL = options.model;
  return () => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  };
}

module.exports = { addNFROptions, normalizeNFROptions, configureNFRProvider };
