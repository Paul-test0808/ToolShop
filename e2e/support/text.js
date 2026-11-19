// @ts-check

/** @param {string} s */
export function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Matches the whole text, ignoring surrounding spaces (including &nbsp;), so "Pliers" does not match "Combination Pliers".
 * @param {string} text
 */
export function exactText(text) {
  return new RegExp(`^\\s*${escapeRegExp(text)}\\s*$`);
}

/**
 * "$14.15" / "14.15" -> 1415. Money is kept in cents so totals have no rounding errors.
 * @param {string} price
 */
export function toCents(price) {
  return Math.round(Number(price.replace(/[^0-9.]/g, '')) * 100);
}

/**
 * 1415 -> "$14.15", as the cart shows it.
 * @param {number} cents
 */
export function money(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}
