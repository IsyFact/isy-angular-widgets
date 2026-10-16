import {ClientFunction, Selector} from 'testcafe';

const DEMO_URL = 'http://localhost:4200';
const CHARACTER_LIST_SELECTOR = '.p-dialog-content .character-listbox';
const VIEWPORTS = [
  {name: 'Smartphone', width: 390, height: 873},
  {name: 'Desktop', width: 1280, height: 800},
  {name: 'Tablet', width: 1536, height: 864},
  {name: 'FullHD', width: 1920, height: 1080},
  {name: '2K', width: 2560, height: 1440}
];

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

fixture('InputChar Responsive').page(DEMO_URL);

for (const vp of VIEWPORTS) {
  test(`InputChar öffnet sich korrekt bei ${vp.name} (${vp.width}x${vp.height})`, async (t) => {
    await t.resizeWindow(vp.width, vp.height);

    // Zur Demo-Seite navigieren
    await t.navigateTo(`${DEMO_URL}/isy-angular-components`);

    const openButton = Selector('button.input-char-button').nth(0);
    await t.click(openButton);

    const dialog = Selector('p-dialog .p-dialog');
    await t.expect(dialog.visible).ok(`Dialog nicht sichtbar bei ${vp.name}`);

    // Kein horizontaler Overflow
    const hasOverflow = await t.eval(() => document.documentElement.scrollWidth > window.innerWidth);
    await t.expect(hasOverflow).notOk(`Horizontaler Overflow bei ${vp.name}`);

    // Insert-Button erreichbar
    const insertButton = Selector('p-dialog button').withText('Einfügen');
    await t.expect(insertButton.visible).ok(`Einfügen-Button nicht sichtbar bei ${vp.name}`);

    if (vp.name === 'Desktop') {
      const scrollMetrics = await getScrollMetrics(CHARACTER_LIST_SELECTOR);
      await t.expect(scrollMetrics).ok('Die Scroll-Metriken des Zeichenbereichs sind nicht verfügbar');
      if (scrollMetrics) {
        await t.expect(scrollMetrics.overflowY).eql('auto');
        await t
          .expect(scrollMetrics.scrollHeight)
          .gt(scrollMetrics.clientHeight, 'Der Zeichenbereich hat keinen vertikalen Überlauf');
      }

      const scrollTop = await scrollToEnd(CHARACTER_LIST_SELECTOR);
      await t.expect(scrollTop).gt(0, 'Der Zeichenbereich kann nicht gescrollt werden');
    }
  });
}
