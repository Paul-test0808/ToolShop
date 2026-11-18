// @ts-check
import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures/fixtures.js';
import { newCustomer } from '../support/testData.js';

/* ---------- Registration ---------- */

When('I open the registration page from the login page', async ({ loginPage, registerPage }) => {
  await loginPage.registerLink.click();
  await registerPage.expectLoaded();
});

Given('I am on the registration page', async ({ registerPage }) => {
  await registerPage.open();
});

When('I fill the registration form with valid details', async ({ registerPage, ctx }) => {
  ctx.customer = newCustomer();
  await registerPage.fill(ctx.customer);
});

When(
  'I fill the registration form with valid details except {string}',
  async ({ registerPage, ctx }, field) => {
    ctx.customer = newCustomer();
    await registerPage.fill(ctx.customer, field);
  },
);

When('I fill the registration form with {string} set to {string}', async ({ registerPage, ctx }, field, value) => {
  ctx.customer = newCustomer();
  await registerPage.fill(ctx.customer);
  await registerPage.field(field).fill(value);
});

When('I submit the registration form', async ({ registerPage }) => {
  await registerPage.submit();
});

Given('I have registered as a new customer', async ({ registerPage, loginPage, ctx }) => {
  ctx.customer = newCustomer();
  await registerPage.open();
  await registerPage.register(ctx.customer);
  await loginPage.expectLoaded();
});

When('I register again with the same email', async ({ registerPage, ctx }) => {
  await registerPage.open();
  await registerPage.register({ ...newCustomer(), email: ctx.customer.email });
});

When('I log in with my new account', async ({ loginPage, ctx }) => {
  await loginPage.login(ctx.customer);
});

Then('I should see the registration form', async ({ registerPage }) => {
  await expect(registerPage.heading).toBeVisible();
  await expect(registerPage.form).toBeVisible();
  await expect(registerPage.submitButton).toBeEnabled();
});

Then('I should see the error {string} for {string}', async ({ registerPage }, message, field) => {
  await expect(registerPage.fieldError(field)).toContainText(message);
});

Then('no other field should show an error', async ({ registerPage }) => {
  await expect(registerPage.visibleFieldErrors).toHaveCount(1);
});

Then('I should see the registration error {string}', async ({ registerPage }, message) => {
  await expect(registerPage.formError).toHaveText(message);
});

Then('the address should be filled in automatically', async ({ registerPage }) => {
  for (const field of ['Street', 'City', 'State']) await expect(registerPage.field(field)).not.toHaveValue('');
});

Then('the header should show my name', async ({ accountPage, ctx }) => {
  await expect(accountPage.userMenu).toHaveText(`${ctx.customer.firstName} ${ctx.customer.lastName}`);
});
