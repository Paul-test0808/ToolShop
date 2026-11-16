// @ts-check
import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures/fixtures.js';

/* ---------- Given / When ---------- */

Given('I am on the home page', async ({ homePage }) => {
  await homePage.open();
});

When('I go to {string} from the header', async ({ homePage }, section) => {
  const { header } = homePage;
  const actions = {
    Home: () => header.goHome(),
    Contact: () => header.goToContact(),
    'Sign in': () => header.goToSignIn(),
  };
  const go = actions[/** @type {keyof typeof actions} */ (section)];
  if (!go) throw new Error(`Unknown header section "${section}". Known: ${Object.keys(actions).join(', ')}`);
  await go();
});

When('I open the categories menu', async ({ homePage }) => {
  await homePage.header.openCategoriesMenu();
});

When('I open the {string} category from the header', async ({ homePage }, category) => {
  await homePage.header.openCategory(category);
});

/* ---------- Then: location ---------- */

Then(
  /^I should be on the (Home|Login|Contact|product) page$/,
  async ({ homePage, loginPage, contactPage, productPage }, name) => {
    const pages = { Home: homePage, Login: loginPage, Contact: contactPage, product: productPage };
    await pages[/** @type {keyof typeof pages} */ (name)].expectLoaded();
  },
);

Then('I should be on the {string} category page', async ({ categoryPage }, category) => {
  await categoryPage.expectCategory(category);
});

/* ---------- Then: page content ---------- */

Then('the page title should be {string}', async ({ basePage }, title) => {
  await basePage.expectTitle(title);
});

Then('I should see the {string} heading', async ({ basePage }, name) => {
  await basePage.expectHeading(name);
});

Then('the header should show the links:', async ({ basePage }, table) => {
  await expect(basePage.header.mainLinks).toHaveText(table.raw().flat());
});

Then('the language selector should show {string}', async ({ basePage }, code) => {
  await expect(basePage.header.languageMenu).toHaveText(code);
});

Then('I should see the categories:', async ({ basePage }, table) => {
  const { categoryItems } = basePage.header;
  await expect(categoryItems.first()).toBeVisible();
  await expect(categoryItems).toHaveText(table.raw().flat());
});

/* ---------- Then: forms ---------- */

Then('I should see the login form with fields:', async ({ loginPage }, table) => {
  await loginPage.expectFormFields(table.raw().flat());
});

Then('I should see the links to register and to reset the password', async ({ loginPage }) => {
  await expect(loginPage.registerLink).toBeVisible();
  await expect(loginPage.forgotPasswordLink).toBeVisible();
});

Then('I should see the contact form with fields:', async ({ contactPage }, table) => {
  await contactPage.expectFormFields(table.raw().flat());
});
