// @ts-check
import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

/**
 * Field label (as on the page) -> data-test id of the input. Its error uses `<id>-error`.
 * @type {Record<string, string>}
 */
const FIELDS = {
  'First name': 'first-name',
  'Last name': 'last-name',
  'Date of Birth': 'dob',
  Country: 'country',
  'Postal code': 'postal_code',
  'House number': 'house_number',
  Street: 'street',
  City: 'city',
  State: 'state',
  Phone: 'phone',
  Email: 'email',
  Password: 'password',
};

/** Fields the postcode lookup fills automatically once country, postcode and house number are set. */
const LOOKUP_FIELDS = ['Street', 'City', 'State'];

export class RegisterPage extends BasePage {
  path = '/auth/register';

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Customer registration' });
    this.form = page.getByTestId('register-form');
    this.submitButton = page.getByTestId('register-submit');
    /** Form-level error, e.g. "A customer with this email address already exists." */
    this.formError = page.getByTestId('register-error');
    this.visibleFieldErrors = this.form.locator('[data-test$="-error"]:visible');

    // The postcode lookup is debounced per field, so typing postcode + house number quickly queues
    // two lookups. Track them to know when the address has stopped changing.
    this.lookupsInFlight = 0;
    this.lastLookupAt = 0;
    const isLookup = (/** @type {import('@playwright/test').Request} */ r) => r.url().includes('/postcode-lookup');
    const done = (/** @type {import('@playwright/test').Request} */ r) => {
      if (isLookup(r)) this.lookupsInFlight--;
    };
    page.on('request', (r) => {
      if (!isLookup(r)) return;
      this.lookupsInFlight++;
      this.lastLookupAt = Date.now();
    });
    page.on('requestfinished', done);
    page.on('requestfailed', done);
  }

  /** Waits until no lookup is running and none has started for `quietMs` (longer than the debounce). */
  async waitForAddressLookup(quietMs = 1000) {
    await expect
      .poll(() => this.lookupsInFlight === 0 && Date.now() - this.lastLookupAt >= quietMs, {
        message: 'postcode lookup should finish',
        timeout: 15_000,
      })
      .toBe(true);
  }

  async waitForLoaded() {
    await expect(this.form).toBeVisible();
  }

  /** @param {string} label e.g. "Postal code" */
  field(label) {
    return this.page.getByTestId(fieldId(label));
  }

  /** @param {string} label */
  fieldError(label) {
    return this.page.getByTestId(`${fieldId(label)}-error`);
  }

  /**
   * Fills every field with the customer's data, leaving `skip` empty.
   * @param {import('../support/testData.js').Customer} c
   * @param {string} [skip] field label to leave empty
   */
  async fill(c, skip) {
    /** @type {Record<string, string>} */
    const values = {
      'First name': c.firstName,
      'Last name': c.lastName,
      'Date of Birth': c.dob,
      'Postal code': c.postalCode,
      'House number': c.houseNumber,
      Phone: c.phone,
      Email: c.email,
      Password: c.password,
    };
    if (skip !== 'Country') await this.field('Country').selectOption(c.country);
    for (const [label, value] of Object.entries(values)) {
      if (label !== skip) await this.field(label).fill(value);
    }

    // With country + postcode + house number set, the lookup fills street/city/state — wait for every
    // queued lookup to finish, so none can refill a field we clear afterwards.
    const lookupRuns = !['Country', 'Postal code', 'House number'].includes(skip ?? '');
    if (lookupRuns) {
      await expect(this.field('Street')).not.toHaveValue('');
      await this.waitForAddressLookup();
    }

    const own = { Street: c.street, City: c.city, State: c.state };
    for (const label of LOOKUP_FIELDS) {
      const input = this.field(label);
      if (label === skip) {
        await input.fill('');
        // Guard: if a late lookup refilled it, stop here instead of submitting (and creating) an account.
        await this.waitForAddressLookup();
        await expect(input, `${label} should stay empty after the address lookup`).toHaveValue('');
      } else if (!(await input.inputValue())) await input.fill(own[/** @type {keyof typeof own} */ (label)]);
    }
  }

  async submit() {
    await this.submitButton.click();
  }

  /** @param {import('../support/testData.js').Customer} customer */
  async register(customer) {
    await this.fill(customer);
    await this.submit();
  }
}

/** @param {string} label */
function fieldId(label) {
  const id = FIELDS[label];
  if (!id) throw new Error(`Unknown registration field "${label}". Known: ${Object.keys(FIELDS).join(', ')}`);
  return id;
}
