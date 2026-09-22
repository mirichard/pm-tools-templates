// The 'asana' npm package (client v2.x) ships no type declarations of its
// own, and no @types/asana release matches this client's actual API shape
// closely enough to trust without independent verification. Declaring the
// module keeps the existing `noImplicitAny` guarantee for the rest of this
// codebase (identifiers *inside* this project stay fully typed) without
// asserting a level of precision for a third-party API we haven't verified.
declare module 'asana';
