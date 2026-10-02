import {Selector} from 'testcafe';

const nameInput = Selector('input#last-name');
const vornameInput = Selector('input#first-name');
const searchButton = Selector('#search-button');

fixture`Objekt suchen > Suchen`.page`http://localhost:4200/objekt-suchen`;
test(`Suchen`, async (t) => {
  await t
    .maximizeWindow()
    .typeText(nameInput, 'Mustermann', {speed: 0.7})
    .typeText(vornameInput, 'Max', {speed: 0.7})
    .click(searchButton)
    .wait(4000);

  const searchResultRow = Selector('tr').nth(1);
  const lastNameCell = searchResultRow.child('td').nth(0).textContent;
  const firstNameCell = searchResultRow.child('td').nth(1).textContent;

  await t.expect(lastNameCell).contains('Mustermann').expect(firstNameCell).contains('Max');
});
