// @ts-check

const FIRST_NAMES = ['Alex', 'Maria', 'John', 'Olena', 'Pieter', 'Sofia', 'Liam', 'Emma', 'Noah', 'Ivan'];
const LAST_NAMES = ['Smith', 'Jansen', 'Kowalski', 'Garcia', 'Novak', 'Bakker', 'Brown', 'Petrov', 'Visser', 'Rossi'];

/** @param {number} min @param {number} max inclusive */
const int = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
/** @template T @param {T[]} list */
const pick = (list) => list[int(0, list.length - 1)];
const letter = () => String.fromCharCode(int(65, 90));
const pad = (/** @type {number} */ n) => String(n).padStart(2, '0');

/**
 * @typedef {object} Customer
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dob YYYY-MM-DD
 * @property {string} country option value, e.g. "NL"
 * @property {string} postalCode
 * @property {string} houseNumber
 * @property {string} street
 * @property {string} city
 * @property {string} state
 * @property {string} phone digits only
 * @property {string} email unique per call
 * @property {string} password meets the site rules (8+ chars, upper, lower, digit, symbol)
 */

/**
 * A brand-new, valid customer with different data on every call.
 * Country is NL because its postcode lookup reliably fills street/city/state;
 * street/city/state here are only used when the lookup does not run.
 * @returns {Customer}
 */
export function newCustomer() {
  const unique = `${Date.now()}${int(1000, 9999)}`;
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  return {
    firstName,
    lastName,
    dob: `${int(1950, 2000)}-${pad(int(1, 12))}-${pad(int(1, 28))}`,
    country: 'NL',
    postalCode: `${int(1000, 9999)}${letter()}${letter()}`,
    houseNumber: String(int(1, 250)),
    street: `${pick(LAST_NAMES)}straat`,
    city: pick(['Amsterdam', 'Utrecht', 'Rotterdam', 'Leiden']),
    state: pick(['Noord-Holland', 'Utrecht', 'Zuid-Holland']),
    phone: `06${int(10000000, 99999999)}`,
    email: `${firstName}.${lastName}.${unique}@example.com`.toLowerCase(),
    password: `Tt${int(100000, 999999)}!${letter()}${letter().toLowerCase()}`,
  };
}
