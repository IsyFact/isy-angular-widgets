import {Selector} from 'testcafe';

const nameInput = Selector('input#Nachname');
const vornameInput = Selector('input#Vorname');
const searchButton = Selector('button').withText('Suchen');

fixture`Personen suchen > Suchen`.page`http://localhost:4200/personen/suchen`;
test(`Suchen`, async (t) => {
  await t
    .maximizeWindow()
    .typeText(nameInput, 'Mustermann', {speed: 0.7})
    .typeText(vornameInput, 'Max', {speed: 0.7})
    .click(searchButton)
    .wait(1000);

  const searchResultRow = await Selector('tr').nth(1);
  const lastNameCell = searchResultRow.child('td').nth(0).textContent;
  const firstNameCell = searchResultRow.child('td').nth(1).textContent;

  await t.expect(lastNameCell).contains('Mustermann').expect(firstNameCell).contains('Max');
});
