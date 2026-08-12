const fs = require('fs-extra');
const path = require('path');

const DANGEROUS_KEYS = new Set(['__proto__', 'prototype', 'constructor']);
const ANSI_ESCAPE_RE = /\u001b\[[0-?]*[ -/]*[@-~]/g;
const CONTROL_RE = /[\u0000-\u001F\u007F-\u009F\u2028\u2029]/g;

function sanitizeTerminalValue(value) {
  if (value === null || value === undefined) return '';

  let text = String(value);
  text = text.replace(ANSI_ESCAPE_RE, '');
  text = text.replace(CONTROL_RE, ' ');
  text = text.replace(/\r\n|\r|\n/g, ' ');
  return text;
}

function stripJsonFences(raw) {
  if (typeof raw !== 'string') return raw;

  const fenced = raw.match(/```(?:json)?\s*\n([\s\S]*?)(?:\n```|$)/);
  if (fenced) {
    return fenced[1].trim();
  }

  const openFence = raw.match(/```(?:json)?\s*\n([\s\S]+)/);
  return openFence ? openFence[1].trim() : raw.trim();
}

function validateStructuredResponse(raw, options = {}) {
  const {
    expectedRoot = 'object',
    requiredKeys = [],
    maxDepth = 12,
    maxStringLength = 200000,
    maxArrayLength = 500,
    maxObjectKeys = 200,
    maxTotalLength = 2000000,
  } = options;

  if (raw === null || raw === undefined) {
    throw new Error('Response payload is empty.');
  }

  const jsonString = stripJsonFences(raw);
  if (!jsonString) {
    throw new Error('No JSON content found in the remote response.');
  }
  if (jsonString.length > maxTotalLength) {
    throw new Error(`Remote response too large (${jsonString.length} bytes).`);
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`Invalid JSON from provider: ${error.message}`);
  }

  if (expectedRoot === 'object' && (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed))) {
    throw new Error(`Expected a JSON object but got ${Array.isArray(parsed) ? 'array' : typeof parsed}.`);
  }
  if (expectedRoot === 'array' && !Array.isArray(parsed)) {
    throw new Error(`Expected a JSON array but got ${typeof parsed}.`);
  }

  const dangerousKeyPattern = /(?:^|[,{\s])"(?:__proto__|prototype|constructor)"\s*:/;
  if (dangerousKeyPattern.test(jsonString)) {
    throw new Error('Response contains prohibited key: __proto__/prototype/constructor');
  }

  const seen = new Set();
  function visit(value, depth) {
    if (depth > maxDepth) {
      throw new Error(`Nested response exceeds maximum allowed depth (${maxDepth}).`);
    }

    if (value === null || value === undefined) return;

    if (typeof value === 'string') {
      if (value.length > maxStringLength) {
        throw new Error(`String field exceeds maximum length (${maxStringLength}).`);
      }
      return;
    }

    if (typeof value === 'number' || typeof value === 'boolean') return;

    if (Array.isArray(value)) {
      if (value.length > maxArrayLength) {
        throw new Error(`Array exceeds maximum length (${maxArrayLength}).`);
      }
      value.forEach((entry) => visit(entry, depth + 1));
      return;
    }

    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length > maxObjectKeys) {
        throw new Error(`Object exceeds maximum key count (${maxObjectKeys}).`);
      }

      for (const key of keys) {
        if (DANGEROUS_KEYS.has(key)) {
          throw new Error(`Response contains prohibited key: ${key}`);
        }
        if (typeof key === 'string' && key.length > 200) {
          throw new Error('Response key exceeds supported length.');
        }
        const child = value[key];
        if (seen.has(child)) {
          continue;
        }
        if (typeof child === 'object' && child !== null) {
          seen.add(child);
        }
        visit(child, depth + 1);
      }
    }
  }

  visit(parsed, 0);

  if (expectedRoot === 'object' && requiredKeys.length > 0) {
    for (const key of requiredKeys) {
      if (!(key in parsed)) {
        throw new Error(`Response missing required field: ${key}`);
      }
    }
  }

  return parsed;
}

function buildSafeOutputPath(targetPath, options = {}) {
  const {
    rootDir = null,
    allowAbsolute = true,
  } = options;

  if (typeof targetPath !== 'string') {
    throw new Error('Output path must be a string.');
  }
  if (targetPath.includes('\0')) {
    throw new Error('Output path cannot contain null bytes.');
  }

  const resolved = path.resolve(targetPath);

  if (rootDir) {
    const baseRoot = path.resolve(rootDir);
    const relative = path.relative(baseRoot, resolved);
    const escapesRoot = relative === '..' || relative.startsWith('../') || path.isAbsolute(relative);
    if (escapesRoot && !allowAbsolute) {
      throw new Error(`Output path escapes the permitted directory: ${targetPath}`);
    }
  }

  return resolved;
}

function sanitizeErrorPayload(value) {
  const redact = (input) => {
    if (input === null || input === undefined) return input;
    if (typeof input === 'string') {
      let text = input
        .replace(ANSI_ESCAPE_RE, ' ')
        .replace(CONTROL_RE, ' ')
        .replace(/(Bearer\s+)[A-Za-z0-9._~+/-]+/gi, '$1[REDACTED]')
        .replace(/(Authorization\s*:\s*)(Bearer\s+)?[^\s,;]+/gi, '$1[REDACTED]')
        .replace(/((?:api[_-]?key|token|authorization|secret|password)\s*[:=]\s*)([^\s,;]+)/gi, '$1[REDACTED]');
      return text.length > 2000 ? `${text.slice(0, 2000)}... [truncated]` : text;
    }
    if (Array.isArray(input)) {
      return input.map(redact);
    }
    if (typeof input === 'object') {
      const sanitized = {};
      for (const [key, entry] of Object.entries(input)) {
        const nextKey = /^(authorization|apiKey|token|secret|password)$/i.test(key) ? '[REDACTED]' : key;
        sanitized[nextKey] = redact(entry);
      }
      return sanitized;
    }
    return input;
  };

  return redact(value);
}

async function safeWriteText(filePath, content, encoding = 'utf8') {
  const resolvedPath = buildSafeOutputPath(filePath, { rootDir: process.cwd() });
  await fs.ensureDir(path.dirname(resolvedPath));
  await fs.writeFile(resolvedPath, content, encoding);
  return resolvedPath;
}

async function safeWriteJSON(filePath, data, options = {}) {
  const resolvedPath = buildSafeOutputPath(filePath, { rootDir: process.cwd() });
  await fs.ensureDir(path.dirname(resolvedPath));
  const jsonText = JSON.stringify(data, null, options.spaces ?? 2);
  await fs.writeFile(resolvedPath, jsonText, 'utf8');
  return resolvedPath;
}

module.exports = {
  sanitizeTerminalValue,
  validateStructuredResponse,
  buildSafeOutputPath,
  sanitizeErrorPayload,
  safeWriteText,
  safeWriteJSON,
};
