// @ts-check
import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures/fixtures.js';
import { findProductByStock } from '../support/productsApi.js';

/* ---------- Product grid ---------- */

Then('I should see {int} products', async ({ homePage }, count) => {
  await expect(homePage.products.cards).toHaveCount(count);
});

Then('I should see at least 1 product', async ({ homePage }) => {
  await homePage.products.waitForProducts();
});

Then('every product should show a name and a price', async ({ homePage }) => {
  await homePage.products.expectEveryProductHasNameAndPrice();
});

Then('the pagination should be visible', async ({ homePage }) => {
  await expect(homePage.products.pagination).toBeVisible();
});

Then('I should see exactly these products:', async ({ homePage }, table) => {
  await expect(homePage.products.names).toHaveText(table.raw().flat());
});

Then('{string} should be marked as out of stock', async ({ homePage }, name) => {
  await expect(homePage.products.card(name).getByTestId('out-of-stock')).toHaveText('Out of stock');
});

/* ---------- Search ---------- */

When('I search for {string}', async ({ homePage }, term) => {
  await homePage.search(term);
});

Given('I searched for {string}', async ({ homePage }, term) => {
  await homePage.search(term);
});

When('I reset the search', async ({ homePage }) => {
  await homePage.resetSearch();
});

Then('I should see the search caption {string}', async ({ homePage }, caption) => {
  await expect(homePage.searchCaption).toHaveText(caption);
});

Then('the search caption should not be shown', async ({ homePage }) => {
  await expect(homePage.searchCaption).toBeHidden();
});

Then('the search field should be empty', async ({ homePage }) => {
  await expect(homePage.searchInput).toHaveValue('');
});

Then('every product name should contain {string}', async ({ homePage }, term) => {
  // The grid re-renders after the search, so retry until every name matches.
  await expect
    .poll(
      async () => {
        const names = await homePage.products.productNames();
        return names.length > 0 && names.every((n) => n.toLowerCase().includes(term.toLowerCase()));
      },
      { message: `every product name should contain "${term}"` },
    )
    .toBe(true);
});

Then('I should see the message {string}', async ({ homePage }, message) => {
  await expect(homePage.products.noResults).toHaveText(message);
});

/* ---------- Sort ---------- */

When('I sort products by {string}', async ({ homePage }, option) => {
  await homePage.sortBy(option);
});

Then('the sort selector should show {string}', async ({ homePage }, option) => {
  await expect(homePage.selectedSortOption).toHaveText(option);
});

Then(
  /^products should be sorted by (name|price) in (ascending|descending) order$/,
  async ({ homePage }, field, direction) => {
    const grid = homePage.products;
    const read = field === 'name' ? () => grid.productNames() : () => grid.productPrices();
    // The grid re-renders after the API responds, so retry until it reaches sorted order.
    await expect
      .poll(
        async () => {
          const values = await read();
          return values.length > 1 && isSorted(values, direction === 'descending');
        },
        { message: `products sorted by ${field} ${direction}` },
      )
      .toBe(true);
  },
);

/* ---------- Product details ---------- */

When('I open the {string} product', async ({ homePage }, name) => {
  await homePage.products.openProduct(name);
});

Given('I am on the {string} product page', async ({ homePage, productPage }, name) => {
  await homePage.open();
  await homePage.products.openProduct(name);
  await productPage.expectLoaded();
});

Then('the product name should be {string}', async ({ productPage }, name) => {
  await expect(productPage.name).toHaveText(name);
});

Then('the product price should be {string}', async ({ productPage }, price) => {
  await expect(productPage.unitPrice).toHaveText(price);
});

Then('the product description should not be empty', async ({ productPage }) => {
  await expect(productPage.description).toHaveText(/\S/);
});

Given(
  /^I am on the page of an? (in-stock|out-of-stock) product$/,
  async ({ productPage, request, baseURL }, stock) => {
    const product = await findProductByStock(request, baseURL, stock === 'in-stock');
    await productPage.openById(product.id);
  },
);

Then('the product should be in stock', async ({ productPage }) => {
  await productPage.expectInStock();
});

Then('the product should be marked as out of stock', async ({ productPage }) => {
  await productPage.expectOutOfStock();
});

Then('the quantity should not be changeable', async ({ productPage }) => {
  await productPage.expectQuantityLocked();
});

Then('I should not be able to add the product to the cart', async ({ productPage }) => {
  await expect(productPage.addToCartButton).toBeDisabled();
});

Then('the quantity should be {int}', async ({ productPage }, quantity) => {
  await expect(productPage.quantity).toHaveValue(String(quantity));
});

When(/^I increase the quantity (\d+) times?$/, async ({ productPage }, times) => {
  await productPage.increaseQuantity(Number(times));
});

When(/^I decrease the quantity (\d+) times?$/, async ({ productPage }, times) => {
  await productPage.decreaseQuantity(Number(times));
});

Then('I should see the buttons {string}, {string} and {string}', async ({ productPage }, a, b, c) => {
  await expect(productPage.actionButtons).toHaveText([a, b, c]);
});

/**
 * @param {(string|number)[]} values
 * @param {boolean} desc
 */
function isSorted(values, desc) {
  const cmp = (/** @type {any} */ a, /** @type {any} */ b) =>
    typeof a === 'number' ? a - b : a.localeCompare(b, 'en', { sensitivity: 'base' });
  return values.every((v, i) => i === 0 || (desc ? cmp(values[i - 1], v) >= 0 : cmp(values[i - 1], v) <= 0));
}
