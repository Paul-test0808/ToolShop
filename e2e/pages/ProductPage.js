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
    /** "Out of stock" label; when shown, the quantity controls and Add to cart are disabled. */
    this.outOfStock = page.getByTestId('out-of-stock');
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

  /** @param {string} id product id from the API */
  async openById(id) {
    await this.page.goto(`/product/${id}`);
    await this.expectLoaded();
  }

  async expectInStock() {
    await expect(this.outOfStock, 'product should be in stock to change its quantity').toBeHidden();
  }

  async expectOutOfStock() {
    await expect(this.outOfStock).toHaveText('Out of stock');
  }

  async expectQuantityLocked() {
    await expect(this.decreaseQuantityButton).toBeDisabled();
    await expect(this.quantity).toBeDisabled();
    await expect(this.increaseQuantityButton).toBeDisabled();
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
