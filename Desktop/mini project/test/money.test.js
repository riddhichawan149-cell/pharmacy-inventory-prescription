const test = require('node:test');
const assert = require('node:assert/strict');
const { toCents, fromCents } = require('../src/utils/money');

test('converts currency amounts to integer cents and back', () => {
  assert.equal(toCents('12.35'), 1235);
  assert.equal(fromCents(1235), '12.35');
  assert.equal(toCents(0.1) + toCents(0.2), 30);
});

test('rejects invalid or negative money values', () => {
  assert.throws(() => toCents(-1), /non-negative/);
  assert.throws(() => toCents('not a price'), /non-negative/);
});
