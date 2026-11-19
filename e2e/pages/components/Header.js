// @ts-check
import { expect } from '@playwright/test';

/** Top navigation bar: Home, Categories, Contact, Sign in, language switcher. */
export class Header {
  /** @param {import('@playwright/test').Locator} root */
  constructor(root) {
    this.root = root;
    this.homeLink = root.getByTestId('nav-home');
    this.categoriesMenu = root.getByTestId('nav-categories');
    this.contactLink = root.getByTestId('nav-contact');
    this.signInLink = root.getByTestId('nav-sign-in');
    this.languageMenu = root.getByTestId('language-select');
    /** Top-level links in DOM order: Home, Categories, Contact, Sign in. */
    this.mainLinks = root.getByTestId(/^nav-(home|categories|contact|sign-in)$/);
    /** Items inside the Categories dropdown. */
    this.categoryItems = root.getByTestId(/^nav-(?!home$|categories$|contact$|sign-in$)/);
  }

  async goHome() {
    await this.homeLink.click();
    await this.#expectPath('/');
  }

  async goToContact() {
    await this.contactLink.click();
    await this.#expectPath('/contact');
  }

  async goToSignIn() {
    await this.signInLink.click();
    await this.#expectPath('/auth/login');
  }

  async openCategoriesMenu() {
    await this.categoriesMenu.click();
    await expect(this.categoryItems.first(), 'categories menu should open').toBeVisible();
  }

  /** @param {string} name Category as shown in the menu, e.g. "Hand Tools". */
  async openCategory(name) {
    await this.openCategoriesMenu();
    await this.root.getByTestId(`nav-${slug(name)}`).click();
    await expect(this.root.page()).toHaveURL((url) => url.pathname.startsWith('/category/'));
  }

  /** Proves a header click navigated: the address bar now shows `path`. */
  async #expectPath(/** @type {string} */ path) {
    await expect(this.root.page()).toHaveURL((url) => url.pathname === path);
  }

  /** @param {string} code Two-letter language code, e.g. "DE". */
  async selectLanguage(code) {
    await this.languageMenu.click();
    await this.root.getByTestId(`lang-${code.toLowerCase()}`).click();
  }
}

/** "Hand Tools" -> "hand-tools" */
export function slug(/** @type {string} */ text) {
  return text.trim().toLowerCase().replace(/\s+/g, '-');
}
