// @ts-check
import { expect } from '@playwright/test';
import { exactText } from '../../support/text.js';

/** Product cards grid used on the home and category pages. */
export class ProductGrid {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.cards = page.locator('a[data-test^="product-"]');
    this.names = page.getByTestId('product-name');
    this.prices = page.getByTestId('product-price');
    this.noResults = page.getByTestId('no-results');
    /** Page-number bar: the (unnamed) navigation landmark that holds the "Next" button. */
    this.pagination = page.getByRole('navigation').filter({ has: page.getByTestId('pagination-next') });
  }

  async waitForProducts() {
    await expect(this.cards.first()).toBeVisible();
  }

  /** @param {string} name exact product name */
  card(name) {
    return this.cards.filter({
      has: this.page.getByTestId('product-name').filter({ hasText: exactText(name) }),
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
    await expect(this.page, `"${name}" should open its product page`).toHaveURL((url) => url.pathname.startsWith('/product/'));
  }
}
