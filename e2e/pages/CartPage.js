// @ts-check
import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { exactText, money } from '../support/text.js';

/**
 * @typedef {object} CartLine what the test put in the cart
 * @property {string} name
 * @property {number} cents unit price in cents
 * @property {number} quantity
 */

/** Step 1 ("Cart") of the checkout wizard at /checkout. Later steps (sign in, address, payment) are not covered. */
export class CartPage extends BasePage {
  path = '/checkout';

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    /** One table row per product in the cart. */
    this.items = page.getByRole('row').filter({ has: page.getByTestId('product-title') });
    this.total = page.getByTestId('cart-total');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
    /**
     * The ✕ buttons have no test id, text or label (an accessibility bug in the shop),
     * so the only way to find them is their red "btn-danger" style.
     */
    this.removeButtons = this.items.locator('a.btn-danger');
  }

  /** Waits for the cart table (only valid while the cart has products). */
  async waitForLoaded() {
    await expect(this.items.first(), 'cart should list products').toBeVisible();
  }

  /** @param {string} name exact product name */
  item(name) {
    return this.items.filter({ has: this.page.getByTestId('product-title').filter({ hasText: exactText(name) }) });
  }

  /** @param {string} name */
  removeButton(name) {
    return this.item(name).locator('a.btn-danger');
  }

  /**
   * Exactly one row for the product, with the right quantity, unit price and line total.
   * @param {CartLine} line
   */
  async expectItem({ name, cents, quantity }) {
    const row = this.item(name);
    await expect(row, `"${name}" should be in the cart once`).toHaveCount(1);
    await expect(row.getByTestId('product-quantity')).toHaveValue(String(quantity));
    await expect(row.getByTestId('product-price')).toHaveText(money(cents));
    await expect(row.getByTestId('line-price'), `line total of "${name}"`).toHaveText(money(cents * quantity));
  }

  /**
   * The cart lists exactly these products and its total is the sum of their line totals.
   * @param {CartLine[]} lines
   */
  async expectContents(lines) {
    await expect(this.items).toHaveCount(lines.length);
    for (const line of lines) await this.expectItem(line);
  }

  /** @param {CartLine[]} lines */
  async expectTotal(lines) {
    const cents = lines.reduce((sum, l) => sum + l.cents * l.quantity, 0);
    await expect(this.total, 'cart total').toHaveText(money(cents));
  }

  /**
   * Types a new quantity (the shop applies it when the box loses focus) and proves the line total followed.
   * @param {CartLine} line the product with its new quantity
   */
  async changeQuantity({ name, cents, quantity }) {
    const input = this.item(name).getByTestId('product-quantity');
    await input.fill(String(quantity));
    await input.press('Tab');
    await expect(this.item(name).getByTestId('line-price'), `line total of "${name}"`).toHaveText(
      money(cents * quantity),
    );
  }

  /** @param {string} name */
  async remove(name) {
    await this.removeButton(name).click();
    await expect(this.item(name), `"${name}" should be removed`).toHaveCount(0);
  }
}
