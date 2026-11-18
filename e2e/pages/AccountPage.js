// @ts-check
import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

/** Landing page after a customer logs in. */
export class AccountPage extends BasePage {
  path = '/account';

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.title = page.getByTestId('page-title');
    /** Header dropdown that shows the logged-in customer's name. */
    this.userMenu = page.getByTestId('nav-menu');
  }

  async waitForLoaded() {
    await expect(this.title).toHaveText('My account');
  }
}
