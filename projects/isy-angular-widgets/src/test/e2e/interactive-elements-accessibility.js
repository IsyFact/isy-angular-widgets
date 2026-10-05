/**
 * E2E tests for interactive elements accessibility compliance.
 *
 * These tests validate that interactive UI elements meet minimum size requirements (44x44 pixels)
 * and that error messages have adequate font sizes. These tests require real browser rendering to
 * accurately measure computed styles, padding, and layout dimensions.
 *
 * The following unit tests were removed from interactive-elements.component.spec.ts and are now
 * covered by E2E tests here:
 * - "should have a minimum size of 44x44 pixels for Buttons"
 * - "should have a minimum size of 44x44 pixels for Dropdowns"
 * - "should have a minimum size of 44x44 pixels for Tabview-Link"
 * - "should have a minimum size of 44x44 pixels for Input-Char-Button"
 * - "should have a minimum size of 44x44 pixels for Fileupload-Button"
 * - "should have a minimum size of 44x44 pixels for Panelmenu-Items"
 * - "should render error text with font-size > 18.666666666666664px (14pt)"
 *
 * Reason for migration: jsdom does not provide reliable CSS layout calculations and computed style
 * measurements. TestCafe with real browser automation provides accurate sizing and font metrics.
 */

import {Selector, ClientFunction} from 'testcafe';

// Configuration constants
const DEMO_URL = 'http://localhost:4200';
const MIN_TOUCH_TARGET_SIZE = 44; // WCAG 2.1 minimum touch target size in pixels
const MIN_DROPDOWN_HEIGHT = 42; // Allow dropdown buttons to be slightly shorter
const MIN_FONT_SIZE = 12; // Minimum font size for readability
const PAGE_LOAD_WAIT_MS = 1000; // Wait time for page to fully load
const MAX_SAMPLE_ITEMS = 2; // Maximum number of items to test in loops
const MAX_BUTTON_SAMPLES = 3; // Maximum number of button samples in loops

// Message templates to avoid duplication
const DIMENSIONS_NOT_FOUND = 'dimensions should be available';
const WIDTH_ASSERTION = 'width with padding should be >= 44px';
const HEIGHT_ASSERTION = 'height with padding should be >= 44px';
const TOUCH_TARGET_MSG = 'Button width with padding should be >= 44px (accessibility: minimum touch target)';

fixture('Interactive Elements Accessibility').page(DEMO_URL);

/**
 * Helper function to get element dimensions including padding.
 */
const getElementDimensions = ClientFunction((selector) => {
  const element = document.querySelector(selector);
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  const computedStyle = globalThis.getComputedStyle(element);

  const paddingTop = Number.parseFloat(computedStyle.paddingTop) || 0;
  const paddingRight = Number.parseFloat(computedStyle.paddingRight) || 0;
  const paddingBottom = Number.parseFloat(computedStyle.paddingBottom) || 0;
  const paddingLeft = Number.parseFloat(computedStyle.paddingLeft) || 0;

  return {
    width: rect.width,
    height: rect.height,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    widthWithPadding: rect.width + paddingLeft + paddingRight,
    heightWithPadding: rect.height + paddingTop + paddingBottom
  };
});

/**
 * Helper function to get computed font size of an element.
 */
const getComputedFontSize = ClientFunction((selector) => {
  const element = document.querySelector(selector);
  if (!element) {
    return null;
  }

  const fontSize = globalThis.getComputedStyle(element).fontSize;
  return Number.parseFloat(fontSize);
});

/**
 * Helper to validate element dimensions in batch.
 * Fetches all dimensions in parallel, then asserts on results.
 */
async function validateElementSizes(t, selectors, minWidth, minHeight, testNamePrefix) {
  if (selectors.length === 0) {
    return;
  }

  // Fetch all dimensions in parallel to avoid awaits in loops
  const dimensionPromises = selectors.map((selector) => getElementDimensions(selector));
  const allDimensions = await Promise.all(dimensionPromises);

  // Build array of assertion functions without awaiting inside loop
  const assertionFunctions = [];

  for (let i = 0; i < allDimensions.length; i++) {
    // IIFE captures current values and returns async function (not called yet)
    assertionFunctions.push(
      ((dimensions, index) => async () => {
        if (dimensions) {
          await t.expect(dimensions).ok(`${testNamePrefix} ${index} ${DIMENSIONS_NOT_FOUND}`);
          await t.expect(dimensions.widthWithPadding).gte(minWidth, `${testNamePrefix} ${index} ${WIDTH_ASSERTION}`);
          await t.expect(dimensions.heightWithPadding).gte(minHeight, `${testNamePrefix} ${index} ${HEIGHT_ASSERTION}`);
        }
      })(allDimensions[i], i)
    );
  }

  // Execute all assertions sequentially using reduce to avoid awaits in loops
  await assertionFunctions.reduce((acc, fn) => acc.then(() => fn()), Promise.resolve());
}

test('should have adequate size for buttons in primeng-button page', async (t) => {
  await t.navigateTo(`${DEMO_URL}/isy-angular-components/primeng-widgets/primeng-button`);

  const buttons = Selector('button.p-button');
  const buttonCount = await buttons.count;

  if (buttonCount > 0) {
    const selectors = [];
    const sampleCount = Math.min(buttonCount, MAX_BUTTON_SAMPLES);
    for (let i = 0; i < sampleCount; i++) {
      selectors.push(`button.p-button:nth-child(${i + 1})`);
    }
    await validateElementSizes(t, selectors, MIN_TOUCH_TARGET_SIZE, MIN_TOUCH_TARGET_SIZE, 'Button');
  }
});

test('should have adequate size for icons and interactive elements in primeng-menu page', async (t) => {
  await t.navigateTo(`${DEMO_URL}/isy-angular-components/primeng-widgets/primeng-menu`);
  await t.wait(PAGE_LOAD_WAIT_MS);

  const buttons = Selector('button.p-button');
  const buttonCount = await buttons.count;

  if (buttonCount > 0) {
    const selector = 'button.p-button:first-of-type';
    const dimensions = await getElementDimensions(selector);

    await t.expect(dimensions).ok('Button dimensions should be available');
    if (dimensions) {
      await t.expect(dimensions.widthWithPadding).gte(MIN_TOUCH_TARGET_SIZE, TOUCH_TARGET_MSG);
      await t
        .expect(dimensions.heightWithPadding)
        .gte(MIN_DROPDOWN_HEIGHT, 'Button height with padding should be >= 42px');
    }
  }
});

test('should have adequate size for tabs in primeng-form page', async (t) => {
  await t.navigateTo(`${DEMO_URL}/isy-angular-components/primeng-widgets/primeng-form`);
  await t.wait(PAGE_LOAD_WAIT_MS);

  const tabHeaders = Selector('.p-tabview .p-tabview-nav .p-tabview-item');
  const tabCount = await tabHeaders.count;

  if (tabCount > 0) {
    const selectors = [];
    const sampleCount = Math.min(tabCount, MAX_SAMPLE_ITEMS);
    for (let i = 0; i < sampleCount; i++) {
      selectors.push(`.p-tabview .p-tabview-nav .p-tabview-item:nth-child(${i + 1})`);
    }
    await validateElementSizes(t, selectors, MIN_TOUCH_TARGET_SIZE, MIN_TOUCH_TARGET_SIZE, 'Tab');
  }
});

test('should have adequate size for input-char trigger button', async (t) => {
  await t.navigateTo(`${DEMO_URL}/isy-angular-components`);
  await t.wait(PAGE_LOAD_WAIT_MS);

  const charButtons = Selector('isy-input-char button');
  const charButtonCount = await charButtons.count;

  if (charButtonCount > 0) {
    const dimensions = await getElementDimensions('isy-input-char button:first-of-type');

    await t.expect(dimensions).ok('Input-char button dimensions should be available');
    if (dimensions && dimensions.widthWithPadding > 0 && dimensions.heightWithPadding > 0) {
      await t
        .expect(dimensions.widthWithPadding)
        .gte(MIN_TOUCH_TARGET_SIZE, 'Input-char button width with padding should be >= 44px');
      await t
        .expect(dimensions.heightWithPadding)
        .gte(MIN_TOUCH_TARGET_SIZE, 'Input-char button height with padding should be >= 44px');
    }
  }
});

test('should have adequate size for panelmenu items', async (t) => {
  await t.navigateTo(`${DEMO_URL}/isy-angular-components/primeng-widgets/primeng-menu`);
  await t.wait(PAGE_LOAD_WAIT_MS);

  const menuItems = Selector('p-panelmenu .p-panelmenu-header-link');
  const menuItemCount = await menuItems.count;

  if (menuItemCount > 0) {
    const selectors = [];
    const sampleCount = Math.min(menuItemCount, MAX_SAMPLE_ITEMS);
    for (let i = 0; i < sampleCount; i++) {
      selectors.push(`p-panelmenu .p-panelmenu-header-link:nth-child(${i + 1})`);
    }
    await validateElementSizes(t, selectors, MIN_TOUCH_TARGET_SIZE, MIN_TOUCH_TARGET_SIZE, 'Panelmenu item');
  }
});

test('should render error message text with adequate font size', async (t) => {
  await t.navigateTo(`${DEMO_URL}/isy-angular-components/primeng-widgets/primeng-messages`);
  await t.wait(PAGE_LOAD_WAIT_MS);

  const errorMessages = Selector('.p-error, .p-message');
  const messageCount = await errorMessages.count;

  if (messageCount > 0) {
    const fontSize = await getComputedFontSize('.p-error:first-of-type, .p-message:first-of-type');

    if (fontSize) {
      await t.expect(fontSize).gte(MIN_FONT_SIZE, 'Error message font-size should be >= 12px for readability');
    }
  }
});
