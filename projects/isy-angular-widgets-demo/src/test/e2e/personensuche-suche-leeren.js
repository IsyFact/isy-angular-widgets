import {Selector} from 'testcafe';

const idInput = Selector('input#id');
const nameInput = Selector('input#last-name');
const vornameInput = Selector('input#first-name');
const genderInput = Selector('input#gender');
const geburtsnameInput = Selector('input#birth-name');
const geburtsortInput = Selector('input#birth-place');
const calenderInput = Selector('input#birth-date');
const searchButton = Selector('#search-button');
const leerenButton = Selector('button').withText('Suche leeren');

fixture`Objekt suchen > Suche leeren`.page`http://localhost:4200/objekt-suchen`;
test('Suche leeren', async (t) => {
  await t
    .maximizeWindow()
    .typeText(idInput, '7899', {speed: 0.6})
    .typeText(nameInput, 'Muster', {speed: 0.9})
    .typeText(vornameInput, 'Sabine', {speed: 0.9})
    .typeText(geburtsnameInput, 'Meier', {speed: 0.8})
    .typeText(geburtsortInput, 'Berlin', {speed: 0.9})
    .typeText(calenderInput, '25.10.2002', {speed: 0.7})
    .typeText(genderInput, 'Weiblich', {speed: 0.8})
    .pressKey('tab')
    .expect(idInput.value)
    .eql('7899')
    .expect(nameInput.value)
    .eql('Muster')
    .expect(vornameInput.value)
    .eql('Sabine')
    .expect(geburtsnameInput.value)
    .eql('Meier')
    .expect(calenderInput.value)
    .eql('25.10.2002')
    .expect(geburtsortInput.value)
    .eql('Berlin')
    .expect(genderInput.value)
    .eql('Weiblich')
    // Der Leeren-Button ist erst aktiv, wenn eine Trefferliste vorhanden ist.
    .click(searchButton)
    .wait(4000)
    .click(leerenButton)
    .wait(500)

    .expect(idInput.value)
    .eql('')
    .expect(nameInput.value)
    .eql('')
    .expect(vornameInput.value)
    .eql('')
    .expect(geburtsnameInput.value)
    .eql('')
    .expect(calenderInput.value)
    .eql('')
    .expect(geburtsortInput.value)
    .eql('')
    .expect(genderInput.value)
    .eql('');
});
