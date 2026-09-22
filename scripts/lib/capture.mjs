// Bounded file-tail reading, used by run-app-check.mjs to avoid loading an
// entire captured command-output file into memory for signature matching
// (round-5/6 QA finding F6: "do not load the entire file back into a
// bounded capture path for exception matching"). Split out as its own
// module so it can be unit tested directly against large files without
// spawning a real child process.
import { openSync, closeSync, fstatSync, readSync } from 'node:fs';

export function readTail(path, maxBytes) {
  const fd = openSync(path, 'r');
  try {
    const size = fstatSync(fd).size;
    const length = Math.min(size, maxBytes);
    const position = size - length;
    const buf = Buffer.alloc(length);
    readSync(fd, buf, 0, length, position);
    return buf.toString('utf8');
  } finally {
    closeSync(fd);
  }
}
