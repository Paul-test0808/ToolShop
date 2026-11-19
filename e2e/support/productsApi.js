// @ts-check

/** API host for the app under test: https://x.com -> https://api.x.com (override with API_URL). */
export function apiUrl(baseURL = 'https://practicesoftwaretesting.com') {
  if (process.env.API_URL) return process.env.API_URL;
  const url = new URL(baseURL);
  return `${url.protocol}//api.${url.host}`;
}

/**
 * Stock on the demo site changes between data resets, so pick a product by its
 * current stock state instead of hard-coding a name.
 *
 * The product list's `in_stock` can disagree with the product's own details (which the
 * product page shows), so each candidate is double-checked on `/products/{id}`.
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string | undefined} baseURL
 * @param {boolean} inStock
 * @param {string[]} [excludeNames] products to skip, e.g. ones already in the cart
 * @returns {Promise<{ id: string, name: string }>}
 */
export async function findProductByStock(request, baseURL, inStock, excludeNames = []) {
  const api = apiUrl(baseURL);
  /** @type {string[]} */
  const mismatched = [];
  for (let page = 1, last = 1; page <= last; page++) {
    const body = await getJson(request, `${api}/products?page=${page}`);
    last = body.last_page;
    const candidates = body.data.filter(
      (/** @type {any} */ p) => p.in_stock === inStock && !excludeNames.includes(p.name.trim()),
    );
    for (const listed of candidates) {
      const details = await getJson(request, `${api}/products/${listed.id}`);
      if (details.in_stock === inStock) return { id: listed.id, name: listed.name };
      mismatched.push(listed.name);
    }
  }
  const state = inStock ? 'in-stock' : 'out-of-stock';
  throw new Error(
    `No ${state} product found` +
      (mismatched.length ? ` (list and details disagree for: ${mismatched.join(', ')})` : ''),
  );
}

/**
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} url
 */
async function getJson(request, url) {
  const res = await request.get(url);
  if (!res.ok()) throw new Error(`GET ${url} failed: ${res.status()}`);
  return res.json();
}
