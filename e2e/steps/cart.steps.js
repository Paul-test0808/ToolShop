// @ts-check
import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures/fixtures.js';
import { findProductByStock } from '../support/productsApi.js';
import { toCents } from '../support/text.js';

/**
 * What this scenario put in the cart (ctx.cart), so the cart can be checked against it.
 * @param {Record<string, any>} ctx
 * @returns {import('../pages/CartPage.js').CartLine[]}
 */
function cartLines(ctx) {
  return (ctx.cart ??= []);
}

/** @param {Record<string, any>} ctx */
function itemsInCart(ctx) {
  return cartLines(ctx).reduce((sum, l) => sum + l.quantity, 0);
}

/**
 * Adds the open product (with its chosen quantity) and proves it: confirmation shown, and the
 * cart icon counts every item added so far.
 * @param {import('../pages/ProductPage.js').ProductPage} productPage
 * @param {Record<string, any>} ctx
 */
async function addOpenProduct(productPage, ctx) {
  const name = (await productPage.name.innerText()).trim();
  const cents = toCents(await productPage.unitPrice.innerText());
  const quantity = Number(await productPage.quantity.inputValue());

  await productPage.addToCart();

  const lines = cartLines(ctx);
  const existing = lines.find((l) => l.name === name);
  if (existing) existing.quantity += quantity;
  else lines.push({ name, cents, quantity });
  await expect(productPage.header.cartQuantity, 'cart icon count').toHaveText(String(itemsInCart(ctx)));
}

/* ---------- Given / When ---------- */

When('I add the product to the cart', async ({ productPage, ctx }) => {
  await addOpenProduct(productPage, ctx);
});

Given('I added the product to the cart', async ({ productPage, ctx }) => {
  await addOpenProduct(productPage, ctx);
});

When('I add another in-stock product to the cart', async ({ productPage, request, baseURL, ctx }) => {
  const inCart = cartLines(ctx).map((l) => l.name);
  const product = await findProductByStock(request, baseURL, true, inCart);
  await productPage.openById(product.id);
  await productPage.expectInStock();
  await addOpenProduct(productPage, ctx);
});

When('I open the cart', async ({ basePage, cartPage }) => {
  await basePage.header.openCart();
  await cartPage.waitForLoaded();
});

When('I change the quantity in the cart to {int}', async ({ cartPage, ctx }, quantity) => {
  const [line] = cartLines(ctx);
  line.quantity = quantity;
  await cartPage.changeQuantity(line);
});

When('I remove the product from the cart', async ({ cartPage, ctx }) => {
  const [line] = cartLines(ctx);
  await cartPage.remove(line.name);
  ctx.cart = [];
});

When('I reload the cart page', async ({ cartPage }) => {
  await cartPage.page.reload();
  await cartPage.expectLoaded();
});

/* ---------- Then ---------- */

Then('I should see the confirmation {string}', async ({ basePage }, message) => {
  await expect(basePage.page.getByText(message, { exact: true }).first()).toBeVisible();
});

Then('the cart icon should show {int}', async ({ basePage }, count) => {
  await expect(basePage.header.cartQuantity).toHaveText(String(count));
});

Then('the cart should contain my products', async ({ cartPage, ctx }) => {
  await cartPage.expectContents(cartLines(ctx));
});

Then('the cart total should be correct', async ({ cartPage, ctx }) => {
  await cartPage.expectTotal(cartLines(ctx));
});

Then('the cart should be empty', async ({ cartPage }) => {
  await expect(cartPage.items, 'no products should be listed').toHaveCount(0);
  await expect(cartPage.header.cartLink, 'cart icon should disappear').toBeHidden();
});

Then('every remove button should have an accessible name', async ({ cartPage }) => {
  await expect(cartPage.removeButtons.first()).toBeVisible();
  for (const button of await cartPage.removeButtons.all()) await expect(button).toHaveAccessibleName(/\S/);
});
