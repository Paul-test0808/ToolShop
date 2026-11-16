// @ts-check
import { expect } from '@playwright/test';

/** Product cards grid used on the home and category pages. */
export class ProductGrid {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.cards = page.locator('a[data-test^="product-"]');
    this.names = page.getByTestId('product-name');
    this.prices = page.getByTestId('product-price');
    this.noResults = page.getByTestId('no-results');
    this.pagination = page.locator('.pagination');
  }

  async waitForProducts() {
    await expect(this.cards.first()).toBeVisible();
  }

  /** @param {string} name exact product name */
  card(name) {
    return this.cards.filter({
      has: this.page.getByTestId('product-name').filter({ hasText: new RegExp(`^\\s*${escapeRegExp(name)}\\s*$`) }),
    });
  }

  /** @returns {Promise<string[]>} */
  async productNames() {
    return (await this.names.allInnerTexts()).map((n) => n.trim());
  }

  /** @returns {Promise<number[]>} */
  async productPrices() {
    return (await this.prices.allInnerTexts()).map((p) => Number(p.replace(/[^0-9.]/g, '')));
  }

  /** Every visible card has a non-empty name and a "$12.34" price. */
  async expectEveryProductHasNameAndPrice() {
    await this.waitForProducts();
    const count = await this.cards.count();
    for (let i = 0; i < count; i++) {
      const card = this.cards.nth(i);
      await expect(card.getByTestId('product-name')).toHaveText(/\S/);
      await expect(card.getByTestId('product-price')).toHaveText(/^\$\d+\.\d{2}$/);
    }
  }

  /** @param {string} name */
  async openProduct(name) {
    await this.card(name).click();
  }
}

/** @param {string} s */
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
