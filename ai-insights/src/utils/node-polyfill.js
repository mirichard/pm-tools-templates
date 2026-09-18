/**
 * Node.js Polyfill for deprecated util.isNullOrUndefined function
 * This function was deprecated in Node.js 4.0.0 and removed in Node.js 18.0.0
 * TensorFlow.js still depends on it, so we need to provide a polyfill.
 */

import { util } from 'util';

// Add the deprecated function back to util if it doesn't exist
if (typeof util.isNullOrUndefined === 'undefined') {
  util.isNullOrUndefined = function(value) {
    return value === null || value === undefined;
  };
}

export { util };
