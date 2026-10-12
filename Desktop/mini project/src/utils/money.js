function toCents(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) {
    throw new TypeError('Money values must be finite and non-negative.');
  }
  return Math.round((amount + Number.EPSILON) * 100);
}

function fromCents(cents) {
  return (cents / 100).toFixed(2);
}

module.exports = { toCents, fromCents };
