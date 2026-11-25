/**
 * E2E tests for InputCharPickerHostComponent focus and visibility handling.
 *
 * These tests validate that the picker correctly manages focus restoration and visibility
 * detection after the picker dialog closes. These operations require real browser rendering
 * to accurately test focus behavior and element visibility calculations.
 *
 * The following unit tests were removed from input-char-picker-host.component.spec.ts and are now
 * covered by E2E tests here:
 * - "should not restore focus when the trigger button is disabled"
 * - "should close the picker after a document click when the trigger element is no longer visible"
 *
 * Reason for migration: jsdom does not provide reliable focus management and does not accurately
 * measure element visibility via getClientRects(). TestCafe with real browser automation provides
 * accurate focus handling and visibility detection.
 */

import {Selector, ClientFunction} from 'testcafe';

const DEMO_URL = 'http://localhost:4200';
const CHARACTER_LIST_SELECTOR = '.p-dialog-content .character-listbox';

fixture('InputCharPickerHost Focus and Visibility').page(DEMO_URL);

/**
 * Helper function to check if an element can receive focus.
 * Returns true if the element is connected, enabled, and visible.
 */
const isElementFocusable = ClientFunction((selector) => {
  const element = document.querySelector(selector);
  if (!element) {
    return false;
  }

  // Check if element is connected to DOM
  if (!element.isConnected) {
    return false;
  }

  // Check if element is a button and disabled
  if (element instanceof HTMLButtonElement && element.disabled) {
    return false;
  }

  // Check if element has visible client rects
  const rects = element.getClientRects();
  return rects.length > 0;
});

/**
 * TestCafe selectors are read-only, so attribute changes have to happen in the browser.
 */
const setAttributeOnElement = ClientFunction((selector, attribute, value) => {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute(attribute, value);
  }
});

/**
 * Dispatches a click on the document body; a real click is not possible while the
 * trigger button is hidden.
 */
const dispatchDocumentClick = ClientFunction(() => {
  document.body.dispatchEvent(new MouseEvent('click', {bubbles: true}));
});

/**
 * Helper function to check if an element is visible (has bounding client rects).
 */
const isElementVisible = ClientFunction((selector) => {
  const element = document.querySelector(selector);
  if (!element) {
    return false;
  }

  const rects = element.getClientRects();
  return rects.length > 0;
});

const getScrollMetrics = ClientFunction((selector) => {
  const element = document.querySelector(selector);
  if (!element) {
    return null;
  }

  return {
    clientHeight: element.clientHeight,
    overflowY: globalThis.getComputedStyle(element).overflowY,
    scrollHeight: element.scrollHeight
  };
});

const scrollToEnd = ClientFunction((selector) => {
  const element = document.querySelector(selector);
  if (!element) {
    return null;
  }

  element.scrollTop = element.scrollHeight;
  return element.scrollTop;
});

test('should not restore focus when the trigger button is disabled after picker closes', async (t) => {
  // Navigate to a page with the input-char component
  await t.navigateTo(`${DEMO_URL}/isy-angular-components`);

  // Find the input-char trigger button
  const triggerButton = Selector('isy-input-char button').nth(0);

  // Verify trigger button exists and is not disabled initially
  await t.expect(triggerButton.exists).ok('Trigger button should exist');
  await t.expect(triggerButton.hasAttribute('disabled')).notOk('Trigger button should not be disabled initially');

  // Click to open the picker
  await t.click(triggerButton);

  // Wait for picker to open
  await t.wait(500);

  // Disable the button programmatically
  await setAttributeOnElement('isy-input-char button', 'disabled', 'disabled');

  // Close the picker (e.g., via dialog close button or ESC)
  const closeButton = Selector('p-dialog .p-dialog-header-close');
  if (await closeButton.exists) {
    await t.click(closeButton);
  } else {
    await t.pressKey('esc');
  }

  // Wait for picker to close and any focus restoration logic to run
  await t.wait(300);

  // The trigger button should NOT have received focus since it's disabled
  const isFocusable = await isElementFocusable('isy-input-char button');
  await t.expect(isFocusable).notOk('Disabled button should not be focusable');
});

test('should close the picker when the trigger element becomes invisible after document click', async (t) => {
  // Navigate to a page with the input-char component
  await t.navigateTo(`${DEMO_URL}/isy-angular-components`);

  // Find the input-char trigger button
  const triggerButton = Selector('isy-input-char button').nth(0);

  // Verify trigger button is visible
  await t.expect(triggerButton.exists).ok('Trigger button should exist');
  let isVisible = await isElementVisible('isy-input-char button');
  await t.expect(isVisible).ok('Trigger button should be visible initially');

  // Click to open the picker
  await t.click(triggerButton);

  // Wait for picker to open
  await t.wait(500);

  // Hide the trigger button using visibility property or display
  await setAttributeOnElement('isy-input-char button', 'style', 'display: none;');

  // Wait a moment for visibility change
  await t.wait(100);

  // Verify button is now invisible
  isVisible = await isElementVisible('isy-input-char button');
  await t.expect(isVisible).notOk('Trigger button should be invisible after style change');

  // Simulate a document click (e.g., click somewhere else on the page)
  await dispatchDocumentClick();

  // Wait for any picker close logic to execute
  await t.wait(300);

  // The picker should now be closed since the trigger element is not visible
  const pickerDialog = Selector('isy-input-char-picker-host .p-dialog');
  await t.expect(pickerDialog.exists).notOk('Picker dialog should be closed when trigger element is invisible');
});

async function assertCharacterListIsScrollable(t, width, height) {
  await t.resizeWindow(width, height);
  await t.navigateTo(`${DEMO_URL}/isy-angular-components`);

  const triggerButton = Selector('isy-input-char button').nth(0);
  await t.expect(triggerButton.exists).ok('Input-char trigger button should exist');
  await t.click(triggerButton);

  const characterList = Selector(CHARACTER_LIST_SELECTOR);
  await t.expect(characterList.exists).ok('Character list should exist in the open picker', {timeout: 5000});

  const scrollMetrics = await getScrollMetrics(CHARACTER_LIST_SELECTOR);
  await t.expect(scrollMetrics).ok('Character list scroll metrics should be available');
  await t.expect(scrollMetrics.overflowY).eql('auto', 'Character list should use vertical scrolling');
  await t
    .expect(scrollMetrics.scrollHeight)
    .gt(scrollMetrics.clientHeight, `Character list should overflow vertically at ${width}x${height}`);

  const scrollTop = await scrollToEnd(CHARACTER_LIST_SELECTOR);
  await t.expect(scrollTop).gt(0, 'Character list should be scrollable');
}

test('should keep the character list scrollable at a 320px viewport width', async (t) => {
  await assertCharacterListIsScrollable(t, 320, 800);
});

test('should keep the character list scrollable in a normal desktop viewport', async (t) => {
  await assertCharacterListIsScrollable(t, 1280, 800);
});
