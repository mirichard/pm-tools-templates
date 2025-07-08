// Polyfills for Node.js environment
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Add other polyfills as needed
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = require('crypto');
}
