import {Selector} from 'testcafe';

const objektSuchenUrl = 'http://localhost:4200/objekt-suchen';

fixture`Anwendung > Objektsuche öffnen`.page`http://localhost:4200`;
test(`Objektsuche öffnen`, async (t) => {
  await t.maximizeWindow().navigateTo(objektSuchenUrl).wait(1000);

  const title = Selector('.p-panel-title').nth(0).textContent;

  await t.expect(title).contains('Objekt suchen');
});
