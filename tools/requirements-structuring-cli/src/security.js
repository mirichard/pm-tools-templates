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
  if (typeof targetPath !== 'string') {
    throw new Error('Output path must be a string.');
  }
  if (targetPath.includes('\0')) {
    throw new Error('Output path cannot contain null bytes.');
  }

  return path.resolve(targetPath);
}

function buildContainedChildPath(rootDir, childName) {
  if (typeof rootDir !== 'string' || typeof childName !== 'string' || !childName) {
    throw new Error('A root directory and application-controlled filename are required.');
  }
  if (childName.includes('\0') || childName !== path.basename(childName)) {
    throw new Error('Generated filenames must be simple application-controlled names.');
  }

  const resolvedRoot = path.resolve(rootDir);
  const resolvedPath = path.resolve(resolvedRoot, childName);
  const relative = path.relative(resolvedRoot, resolvedPath);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Generated output path escapes the permitted directory: ${childName}`);
  }

  const existingRoot = fs.existsSync(resolvedRoot) ? fs.realpathSync(resolvedRoot) : resolvedRoot;
  const parentDir = path.dirname(resolvedPath);
  if (fs.existsSync(parentDir)) {
    const existingParent = fs.realpathSync(parentDir);
    const realRelative = path.relative(existingRoot, existingParent);
    if (realRelative === '..' || realRelative.startsWith(`..${path.sep}`) || path.isAbsolute(realRelative)) {
      throw new Error(`Generated output path resolves outside the permitted directory: ${childName}`);
    }
  }

  return resolvedPath;
}

function sanitizeErrorPayload(value) {
  const text = (input, limit = 400) => {
    if (input === null || input === undefined) return '';
    return sanitizeTerminalValue(String(input)).replace(
      /(Bearer\s+|(?:authorization|api[-_]?key|x-api-key|token|secret|password|cookie|set-cookie)\s*[:=]\s*)[^\s,;]+/gi,
      '$1[REDACTED]'
    ).slice(0, limit);
  };
  const source = value && typeof value === 'object' ? value : {};
  const nestedError = source.error && typeof source.error === 'object' ? source.error : {};
  const headers = source.headers && typeof source.headers === 'object' ? source.headers : {};
  const diagnostic = {};

  if (source.provider !== undefined) diagnostic.provider = text(source.provider, 100);
  if (source.status !== undefined) diagnostic.status = Number.isFinite(Number(source.status)) ? Number(source.status) : 0;
  if (source.code !== undefined || nestedError.code !== undefined) diagnostic.code = text(source.code ?? nestedError.code, 100);
  const message = source.message ?? nestedError.message ?? (typeof value === 'string' ? value : '');
  if (message) diagnostic.message = text(message, 2000);
  const requestId = source.requestId ?? source.request_id ?? headers['request-id'] ?? headers['x-request-id'];
  if (requestId !== undefined) diagnostic.requestId = text(requestId, 200);
  return diagnostic;
}

async function safeWriteText(filePath, content, encoding = 'utf8', options = {}) {
  const resolvedPath = resolveWritePath(filePath, options.rootDir);
  const validatedContent = validateDocumentContent(content);
  await fs.ensureDir(path.dirname(resolvedPath));
  await fs.writeFile(resolvedPath, Buffer.from(validatedContent, encoding));
  return resolvedPath;
}

async function safeWriteJSON(filePath, data, options = {}) {
  const resolvedPath = resolveWritePath(filePath, options.rootDir);
  const validatedJson = validateAndSerializeJSON(data, options);
  await fs.ensureDir(path.dirname(resolvedPath));
  await fs.writeFile(resolvedPath, Buffer.from(validatedJson, 'utf8'));
  return resolvedPath;
}

function resolveWritePath(filePath, generatedRoot = null) {
  if (!generatedRoot) return buildSafeOutputPath(filePath);
  const resolvedPath = buildSafeOutputPath(filePath);
  return buildContainedChildPath(generatedRoot, path.basename(resolvedPath));
}

function validateDocumentContent(content) {
  if (typeof content !== 'string') throw new Error('Document content must be text.');
  if (content.length > 2000000) throw new Error('Document content exceeds the maximum supported size.');
  if (ANSI_ESCAPE_RE.test(content) || /[\u0000\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/.test(content)) {
    throw new Error('Document content contains unsupported control characters.');
  }
  ANSI_ESCAPE_RE.lastIndex = 0;
  return content;
}

function validateAndSerializeJSON(data, options = {}) {
  let jsonText;
  try {
    jsonText = JSON.stringify(data, null, options.spaces ?? 2);
  } catch (error) {
    throw new Error(`Unable to serialize JSON output: ${error.message}`);
  }
  const parsed = validateStructuredResponse(jsonText, {
    expectedRoot: options.expectedRoot || (Array.isArray(data) ? 'array' : 'object'),
  });
  const validatedJson = JSON.stringify(parsed, null, options.spaces ?? 2);
  if (validatedJson.length > 2000000) throw new Error('JSON output exceeds the maximum supported size.');
  return validatedJson;
}

module.exports = {
  sanitizeTerminalValue,
  validateStructuredResponse,
  buildSafeOutputPath,
  buildContainedChildPath,
  sanitizeErrorPayload,
  safeWriteText,
  safeWriteJSON,
  validateDocumentContent,
  validateAndSerializeJSON,
};
