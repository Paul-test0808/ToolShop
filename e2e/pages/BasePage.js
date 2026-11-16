// @ts-check
import { expect } from '@playwright/test';
import { Header } from './components/Header.js';

export class BasePage {
  /** Path relative to baseURL; override in subclasses. */
  path = '/';

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.header = new Header(page.getByRole('navigation').filter({ has: page.getByTestId('nav-home') }));
  }

  async open() {
    await this.page.goto(this.path);
    await this.waitForLoaded();
  }

  /** Override to wait for a page-specific "ready" locator. */
  async waitForLoaded() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Asserts the browser is on this page (exact path) and it has rendered. */
  async expectLoaded() {
    await expect(this.page).toHaveURL((url) => url.pathname === this.path);
    await this.waitForLoaded();
  }

  /** @param {string} title */
  async expectTitle(title) {
    await expect(this.page).toHaveTitle(title);
  }

  /** @param {string | RegExp} name */
  async expectHeading(name) {
    await expect(this.page.getByRole('heading', { name, exact: true })).toBeVisible();
  }
}
