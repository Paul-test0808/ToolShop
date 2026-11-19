// @ts-check
import { test as base, createBdd } from 'playwright-bdd';
import { BasePage } from '../pages/BasePage.js';
import { HomePage } from '../pages/HomePage.js';
import { CategoryPage } from '../pages/CategoryPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { ContactPage } from '../pages/ContactPage.js';
import { ProductPage } from '../pages/ProductPage.js';
import { RegisterPage } from '../pages/RegisterPage.js';
import { AccountPage } from '../pages/AccountPage.js';
import { CartPage } from '../pages/CartPage.js';

/**
 * @typedef {object} AppFixtures
 * @property {BasePage} basePage
 * @property {HomePage} homePage
 * @property {CategoryPage} categoryPage
 * @property {LoginPage} loginPage
 * @property {ContactPage} contactPage
 * @property {ProductPage} productPage
 * @property {RegisterPage} registerPage
 * @property {AccountPage} accountPage
 * @property {CartPage} cartPage
 * @property {Record<string, any>} ctx
 * @property {void} cloudflareGuard
 */

/** @type {import('@playwright/test').Fixtures<AppFixtures, {}, import('@playwright/test').PlaywrightTestArgs>} */
const appFixtures = {
  /** Generic page object for page-independent checks (headings, title). */
  basePage: async ({ page }, use) => use(new BasePage(page)),
  homePage: async ({ page }, use) => use(new HomePage(page)),
  categoryPage: async ({ page }, use) => use(new CategoryPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  contactPage: async ({ page }, use) => use(new ContactPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  accountPage: async ({ page }, use) => use(new AccountPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  /** Per-scenario state shared between steps. */
  ctx: async ({}, use) => use({}),

  /**
   * Runs for every test. The public site sits behind Cloudflare, which sometimes answers a page load with a
   * "Verify you are human" check (403 + `cf-mitigated: challenge`) — mostly on data-centre machines such as
   * GitHub runners. No test can pass that, so name it in the failure instead of leaving a vague timeout.
   */
  cloudflareGuard: [
    async ({ page }, use, testInfo) => {
      /** @type {string[]} */
      const blocked = [];
      page.on('response', (response) => {
        if (response.headers()['cf-mitigated'] === 'challenge') blocked.push(new URL(response.url()).pathname);
      });

      await use();

      if (!blocked.length) return;
      const message =
        `Blocked by the Cloudflare bot check ("Verify you are human") when loading ${blocked.join(', ')}. ` +
        'This is an environment problem (the site does not trust this machine, e.g. a GitHub runner), ' +
        'not a product or test bug.';
      testInfo.annotations.push({ type: 'blocked-by-cloudflare', description: message });
      if (testInfo.status !== testInfo.expectedStatus) throw new Error(message);
    },
    { auto: true },
  ],
};

export const test = base.extend(appFixtures);

export const { Given, When, Then, Before, After } = createBdd(test);
