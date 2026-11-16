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
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string | undefined} baseURL
 * @param {boolean} inStock
 * @returns {Promise<{ id: string, name: string }>}
 */
export async function findProductByStock(request, baseURL, inStock) {
  const api = apiUrl(baseURL);
  for (let page = 1, last = 1; page <= last; page++) {
    const res = await request.get(`${api}/products?page=${page}`);
    if (!res.ok()) throw new Error(`GET /products?page=${page} failed: ${res.status()}`);
    const body = await res.json();
    last = body.last_page;
    const product = body.data.find((/** @type {any} */ p) => p.in_stock === inStock);
    if (product) return { id: product.id, name: product.name };
  }
  throw new Error(`No ${inStock ? 'in-stock' : 'out-of-stock'} product found`);
}
