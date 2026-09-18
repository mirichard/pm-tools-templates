const sum = require('./sum');

describe('sum utility', () => {
  it('adds two numbers correctly', () => {
    expect(sum(2, 3)).toBe(5);
  });
  it('handles negative numbers', () => {
    expect(sum(-2, -3)).toBe(-5);
  });
});
