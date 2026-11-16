// @ts-check
import { test as base, createBdd } from 'playwright-bdd';
import { BasePage } from '../pages/BasePage.js';
import { HomePage } from '../pages/HomePage.js';
import { CategoryPage } from '../pages/CategoryPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { ContactPage } from '../pages/ContactPage.js';
import { ProductPage } from '../pages/ProductPage.js';

/**
 * @typedef {object} AppFixtures
 * @property {BasePage} basePage
 * @property {HomePage} homePage
 * @property {CategoryPage} categoryPage
 * @property {LoginPage} loginPage
 * @property {ContactPage} contactPage
 * @property {ProductPage} productPage
 * @property {Record<string, any>} ctx
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
  /** Per-scenario state shared between steps. */
  ctx: async ({}, use) => use({}),
};

export const test = base.extend(appFixtures);

export const { Given, When, Then, Before, After } = createBdd(test);
