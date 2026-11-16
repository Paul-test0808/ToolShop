// @ts-check
import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class ProductPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.name = page.getByTestId('product-name');
    this.unitPrice = page.getByTestId('unit-price');
    this.description = page.getByTestId('product-description');
    this.quantity = page.getByTestId('quantity');
    this.increaseQuantityButton = page.getByTestId('increase-quantity');
    this.decreaseQuantityButton = page.getByTestId('decrease-quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
    /** Action buttons in DOM order: Add to cart, Add to favourites, Compare. */
    this.actionButtons = page.getByTestId(/^add-to-(cart|favorites|compare)$/);
  }

  async waitForLoaded() {
    await expect(this.name).toBeVisible();
  }

  /** Product URLs contain an id, so check the pattern instead of an exact path. */
  async expectLoaded() {
    await expect(this.page).toHaveURL((url) => /^\/product\/\w+$/.test(url.pathname));
    await this.waitForLoaded();
  }

  /** @param {number} times */
  async increaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) await this.increaseQuantityButton.click();
  }

  /** @param {number} times */
  async decreaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) await this.decreaseQuantityButton.click();
  }
}
