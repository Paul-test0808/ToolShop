// @ts-check
import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { ProductGrid } from './components/ProductGrid.js';

export class HomePage extends BasePage {
  path = '/';

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.products = new ProductGrid(page);
    this.sortSelect = page.getByTestId('sort');
    this.selectedSortOption = this.sortSelect.locator('option:checked');
    this.searchInput = page.getByTestId('search-query');
    this.searchButton = page.getByTestId('search-submit');
    this.searchReset = page.getByTestId('search-reset');
    this.searchCaption = page.getByTestId('search-caption');
  }

  async waitForLoaded() {
    await this.products.waitForProducts();
  }

  /** @param {string} term */
  async search(term) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
    await expect(this.searchCaption).toContainText(term);
  }

  async resetSearch() {
    await this.searchReset.click();
  }

  /** @param {string} label Visible option text, e.g. "Price (Low - High)". */
  async sortBy(label) {
    await this.sortSelect.selectOption({ label });
  }
}
