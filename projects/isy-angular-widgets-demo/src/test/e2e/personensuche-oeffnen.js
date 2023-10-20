import {Selector} from 'testcafe';

const personenSuchenUrl = 'http://localhost:4200/personen/suchen';

fixture`Anwendung > Personensuche öffnen`.page`http://localhost:4200`;
test(`Personensuche öffnen`, async (t) => {
  await t.maximizeWindow().navigateTo(personenSuchenUrl).wait(1000);

  const title = Selector('h2').textContent;

  await t.expect(title).eql('Label Submenü');
});
