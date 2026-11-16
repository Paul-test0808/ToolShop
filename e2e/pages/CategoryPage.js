// @ts-check
import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { ProductGrid } from './components/ProductGrid.js';
import { slug } from './components/Header.js';

export class CategoryPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.products = new ProductGrid(page);
    this.title = page.getByRole('heading', { name: /^Category:/ });
  }

  /** @param {string} name Category as shown in the menu, e.g. "Hand Tools". */
  async expectCategory(name) {
    await expect(this.page).toHaveURL((url) => url.pathname === `/category/${slug(name)}`);
    await expect(this.title).toHaveText(`Category: ${name}`);
  }
}
