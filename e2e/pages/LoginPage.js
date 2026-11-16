// @ts-check
import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  path = '/auth/login';

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Login' });
    this.form = page.getByTestId('login-form');
    this.formLabels = this.form.locator('label');
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.submitButton = page.getByTestId('login-submit');
    this.registerLink = page.getByTestId('register-link');
    this.forgotPasswordLink = page.getByTestId('forgot-password-link');
  }

  async waitForLoaded() {
    await expect(this.form).toBeVisible();
  }

  /** @param {string[]} labels expected field labels, in order */
  async expectFormFields(labels) {
    await expect(this.formLabels).toHaveText(labels);
    await expect(this.emailInput).toBeEditable();
    await expect(this.passwordInput).toBeEditable();
    await expect(this.submitButton).toBeEnabled();
  }

  /**
   * @param {{ email: string, password: string }} user
   */
  async login({ email, password }) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
