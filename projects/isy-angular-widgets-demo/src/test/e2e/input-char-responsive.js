import {Selector} from 'testcafe';

const DEMO_URL = 'http://localhost:4200';
const VIEWPORTS = [
  {name: 'Smartphone', width: 390, height: 873},
  {name: 'Tablet', width: 1536, height: 864},
  {name: 'FullHD', width: 1920, height: 1080},
  {name: '2K', width: 2560, height: 1440}
];

fixture('InputChar Responsive').page(DEMO_URL);

for (const vp of VIEWPORTS) {
  test(`InputChar öffnet sich korrekt bei ${vp.name} (${vp.width}x${vp.height})`, async (t) => {
    await t.resizeWindow(vp.width, vp.height);

    // Zur Demo-Seite navigieren
    await t.navigateTo(`${DEMO_URL}/isy-angular-components`);

    const openButton = Selector('[data-testid="input-char-button"]').nth(0);
    // Fallback falls kein data-testid: Selector('button[aria-label*="Sonderzeichen"]')
    await t.click(openButton);

    const dialog = Selector('p-dialog .p-dialog');
    await t.expect(dialog.visible).ok(`Dialog nicht sichtbar bei ${vp.name}`);

    // Kein horizontaler Overflow
    const hasOverflow = await t.eval(() => document.documentElement.scrollWidth > window.innerWidth);
    await t.expect(hasOverflow).notOk(`Horizontaler Overflow bei ${vp.name}`);

    // Insert-Button erreichbar
    const insertButton = Selector('p-dialog button').withText('Einfügen');
    await t.expect(insertButton.visible).ok(`Einfügen-Button nicht sichtbar bei ${vp.name}`);
  });
}
