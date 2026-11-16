// @ts-check
import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class ContactPage extends BasePage {
  path = '/contact';

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Contact' });
    this.firstNameInput = page.getByTestId('first-name');
    this.lastNameInput = page.getByTestId('last-name');
    this.emailInput = page.getByTestId('email');
    this.subjectSelect = page.getByTestId('subject');
    this.messageInput = page.getByTestId('message');
    this.attachmentInput = page.getByTestId('attachment');
    this.submitButton = page.getByTestId('contact-submit');
    this.form = page.locator('form').filter({ has: this.submitButton });
    this.formLabels = this.form.locator('label');
  }

  async waitForLoaded() {
    await expect(this.submitButton).toBeVisible();
  }

  /** @param {string[]} labels expected field labels, in order */
  async expectFormFields(labels) {
    await expect(this.formLabels).toHaveText(labels);
    for (const field of [this.firstNameInput, this.lastNameInput, this.emailInput, this.messageInput]) {
      await expect(field).toBeEditable();
    }
    await expect(this.subjectSelect).toBeEnabled();
    await expect(this.attachmentInput).toBeAttached();
    await expect(this.submitButton).toBeEnabled();
  }
}
