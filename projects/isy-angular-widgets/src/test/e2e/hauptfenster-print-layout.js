/**
 * E2E tests for Hauptfenster print layout compliance.
 *
 * These tests validate that the Hauptfenster component properly handles print media styles,
 * filling the viewport on screen and releasing content into the print page flow.
 * These tests require real browser rendering to accurately measure element dimensions
 * and media query application.
 *
 * The following unit test was skipped in hauptfenster.component.spec.ts and is now
 * covered by E2E tests here:
 * - "should fill the viewport on screen and release content into the print page flow"
 *
 * Reason for migration: jsdom does not provide reliable CSS layout calculations for
 * media queries and computed style measurements. TestCafe with real browser automation
 * provides accurate sizing for both screen and print media.
 */

import {ClientFunction} from 'testcafe';

const DEMO_URL = 'http://localhost:4200';

fixture('Hauptfenster Print Layout').page(DEMO_URL);

/**
 * Helper function to get element dimensions via getBoundingClientRect.
 */
const getElementBounds = ClientFunction((selector) => {
  const element = document.querySelector(selector);
  if (!element) {
    return null;
  }

  const bounds = element.getBoundingClientRect();
  return {
    top: bounds.top,
    left: bounds.left,
    right: bounds.right,
    bottom: bounds.bottom,
    width: bounds.width,
    height: bounds.height
  };
});

/**
 * Helper to get viewport height (window.innerHeight).
 */
const getViewportHeight = ClientFunction(() => window.innerHeight);

/**
 * Helper to apply print media styles to the page for testing.
 * Returns function to restore original state.
 */
const applyPrintMediaStyles = ClientFunction(() => {
  // Get all CSS rules from stylesheets
  const componentPrintRules = Array.from(document.styleSheets)
    .flatMap((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules || []);
      } catch {
        return [];
      }
    })
    .filter(
      (rule) =>
        rule instanceof CSSMediaRule && rule.media.mediaText === 'print' && rule.cssText.includes('.isy-hauptfenster')
    );

  // Create and apply print styles
  const printStyle = document.createElement('style');
  printStyle.id = 'print-styles-test';
  printStyle.textContent = componentPrintRules
    .flatMap((mediaRule) => Array.from(mediaRule.cssRules || []))
    .map((rule) => rule.cssText)
    .join('\n');
  document.head.appendChild(printStyle);

  return true;
});

/**
 * Helper to remove applied print media styles.
 */
const removePrintMediaStyles = ClientFunction(() => {
  const printStyle = document.getElementById('print-styles-test');
  if (printStyle) {
    printStyle.remove();
    return true;
  }
  return false;
});

test('should fill the viewport on screen', async (t) => {
  await t.navigateTo(`${DEMO_URL}/isy-angular-components`);
  await t.wait(1000);

  // Get screen-mode bounds
  const shell = await getElementBounds('.isy-hauptfenster');
  const content = await getElementBounds('.isy-hauptfenster-inhaltsbereich');
  const main = await getElementBounds('.isy-hauptfenster-inhaltsbereich > main');
  const viewportHeight = await getViewportHeight();

  // Verify screen mode layout
  await t.expect(shell).ok('Shell element should exist');
  await t.expect(content).ok('Content element should exist');
  await t.expect(main).ok('Main element should exist');

  // Shell should fill viewport
  await t.expect(shell.height).gte(viewportHeight, 'Shell height should be >= viewport height on screen');

  // Main should appear below content header
  await t.expect(main.top).gt(content.top, 'Main top should be > content top (below header)');
});

test('should release content into the print page flow when print media is applied', async (t) => {
  await t.navigateTo(`${DEMO_URL}/isy-angular-components`);
  await t.wait(1000);

  // Apply print media styles
  await applyPrintMediaStyles();

  try {
    // Get print-mode bounds
    const shell = await getElementBounds('.isy-hauptfenster');
    const content = await getElementBounds('.isy-hauptfenster-inhaltsbereich');
    const main = await getElementBounds('.isy-hauptfenster-inhaltsbereich > main');
    const viewportHeight = await getViewportHeight();

    // Verify print mode layout
    await t.expect(shell).ok('Shell element should exist');
    await t.expect(content).ok('Content element should exist');
    await t.expect(main).ok('Main element should exist');

    // Shell should NOT fill viewport in print mode (content flows)
    await t.expect(shell.height).lt(viewportHeight, 'Shell height should be < viewport height in print mode');

    // Main should be aligned with content (no header offset in print)
    await t.expect(main.top).eql(content.top, 'Main top should align with content top in print mode');

    // Main should be within content bounds horizontally
    await t.expect(main.left).gte(content.left, 'Main left should be >= content left');
    await t.expect(main.right).lte(content.right, 'Main right should be <= content right');
  } finally {
    // Clean up print styles
    await removePrintMediaStyles();
  }
});
