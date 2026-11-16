// @ts-check
import { expect } from '@playwright/test';

/**
 * @typedef {object} ApiProduct
 * @property {string} name
 * @property {number} price
 * @property {boolean} is_eco_friendly
 * @property {{ name: string }} category
 * @property {{ name: string }} brand
 */

/**
 * Left-hand filter panel on the home page: categories, brands, eco-friendly and price range.
 * Checkboxes are found by their visible label — their data-test ids change when the demo data resets.
 */
export class Filters {
  /** @type {ApiProduct[] | null} Products from the latest /products API response the page received. */
  lastResults = null;

  /**
   * @param {import('@playwright/test').Page} page
   * @param {import('./ProductGrid.js').ProductGrid} grid
   */
  constructor(page, grid) {
    this.page = page;
    this.grid = grid;
    this.root = page.getByTestId('filters');
    this.ecoFriendly = page.getByTestId('eco-friendly-filter');
    this.maxPriceHandle = this.root.getByRole('slider', { name: 'ngx-slider-max', exact: true });

    // Card markup has no category/brand, so remember what the API answered to verify it.
    page.on('response', async (response) => {
      if (new URL(response.url()).pathname !== '/products') return;
      const body = await response.json().catch(() => null);
      if (Array.isArray(body?.data)) this.lastResults = body.data;
    });
  }

  /** @param {string} name category or sub-category label, e.g. "Hammer" */
  category(name) {
    return this.root.getByRole('checkbox', { name, exact: true });
  }

  /** @param {string} name brand label, e.g. "ForgeFlex Tools" */
  brand(name) {
    return this.root.getByRole('checkbox', { name, exact: true });
  }

  /** @param {string} name */
  async checkCategory(name) {
    await this.category(name).check();
  }

  /** @param {string} name */
  async uncheckCategory(name) {
    await this.category(name).uncheck();
  }

  /** @param {string} name */
  async checkBrand(name) {
    await this.brand(name).check();
  }

  async checkEcoFriendly() {
    await this.ecoFriendly.check();
  }

  /**
   * Moves the max handle with the keyboard (1 step per key press) until it shows `value`.
   * @param {number} value
   */
  async setMaxPrice(value) {
    await this.maxPriceHandle.focus();
    for (let i = 0; i < 250; i++) {
      const now = Number(await this.maxPriceHandle.getAttribute('aria-valuenow'));
      if (now === value) return;
      await this.maxPriceHandle.press(now > value ? 'ArrowLeft' : 'ArrowRight');
    }
    throw new Error(`Could not move the max price handle to ${value}`);
  }

  /**
   * Waits until the grid shows the latest API results and every one of them passes `check`.
   * @param {(p: ApiProduct) => boolean} check
   * @param {string} what human description used in the failure message
   */
  async expectEveryResult(check, what) {
    await expect
      .poll(
        async () => {
          const shown = await this.grid.productNames();
          const results = this.lastResults;
          if (!results?.length || !shown.length) return 'no products shown yet';
          if (shown.join('|') !== results.map((p) => p.name.trim()).join('|')) return 'grid not updated yet';
          const wrong = results.filter((p) => !check(p)).map((p) => p.name);
          return wrong.length ? `not ${what}: ${wrong.join(', ')}` : 'ok';
        },
        { message: `every shown product should be ${what}`, timeout: 10_000 },
      )
      .toBe('ok');
  }

  /**
   * Waits until the grid shows the latest API results and at least one of them passes `check`.
   * @param {(p: ApiProduct) => boolean} check
   * @param {string} what
   */
  async expectSomeResult(check, what) {
    await expect
      .poll(
        async () => {
          const shown = await this.grid.productNames();
          const results = this.lastResults;
          if (!results?.length || !shown.length) return 'no products shown yet';
          if (shown.join('|') !== results.map((p) => p.name.trim()).join('|')) return 'grid not updated yet';
          return results.some(check) ? 'ok' : `no product ${what}`;
        },
        { message: `some shown product should be ${what}`, timeout: 10_000 },
      )
      .toBe('ok');
  }
}
