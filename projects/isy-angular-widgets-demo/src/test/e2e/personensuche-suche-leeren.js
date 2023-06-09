import { Selector } from 'testcafe';

const idInput = Selector('input#ID');
const nameInput = Selector('input#Nachname');
const vornameInput = Selector('input#Vorname');
const geschlechtInput = Selector('input#Geschlecht');
const geburtsnameInput = Selector('input#Geburtsname');
const geburtsortInput = Selector('input#Geburtsort');
const calenderInput = Selector('.p-calendar .p-inputtext');
const leerenButton = Selector('button').withText('Suche leeren');

fixture `Personen suchen > Suche leeren`
  .page `http://localhost:4200/personen/suchen`;
test('Suche leeren', async t => {
  await t
    .maximizeWindow()
    .typeText(idInput, '7899', { speed:0.6})
    .typeText(nameInput, 'Muster', {speed:0.9})
    .typeText(vornameInput, 'Sabine', {speed:0.9})
    .typeText(geburtsnameInput, 'Meier', {speed:0.8})
    .typeText(geburtsortInput, 'Berlin', {speed:0.9})
    .typeText(calenderInput, '25.10.2002', {speed:0.7})
    .typeText(geschlechtInput, 'Weiblich', {speed:0.8})
    .pressKey('tab')
    .expect(idInput.value).eql('7899')
    .expect(nameInput.value).eql('Muster')
    .expect(vornameInput.value).eql('Sabine')
    .expect(geburtsnameInput.value).eql('Meier')
    .expect(calenderInput.value).eql('25.10.2002')
    .expect(geburtsortInput.value).eql('Berlin')
    .expect(geschlechtInput.value).eql('Weiblich')
    .click(leerenButton)

    .expect(idInput.value).eql('')
    .expect(nameInput.value).eql('')
    .expect(vornameInput.value).eql('')
    .expect(geburtsnameInput.value).eql('')
    .expect(calenderInput.value).eql('')
    .expect(geburtsortInput.value).eql('')
    .expect(geschlechtInput.value).eql('')
});
