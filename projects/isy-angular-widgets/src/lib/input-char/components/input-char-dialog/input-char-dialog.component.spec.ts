import {InputCharDialogComponent} from './input-char-dialog.component';
import {By} from '@angular/platform-browser';
import {Zeichenobjekt} from '../../model/model';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {InputCharModule} from '../../input-char.module';
import {MockComponent, MockModule} from 'ng-mocks';
import {SelectButtonModule} from 'primeng/selectbutton';
import {AccordionModule} from 'primeng/accordion';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {FormsModule} from '@angular/forms';
import {InputCharPreviewComponent} from '../input-char-preview/input-char-preview.component';
import {ComponentFixture} from '@angular/core/testing';
import {MultiSelectButtonComponent} from '@isy-angular-widgets/input-char/components/multi-select-button/multi-select-button.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

let spectator: Spectator<InputCharDialogComponent>;
let fixture: ComponentFixture<InputCharDialogComponent>;
const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];

describe('Unit Tests: InputCharDialogComponent', () => {
  let component: InputCharDialogComponent;
  const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];

  const createComponent = createComponentFactory({
    component: InputCharDialogComponent,
    imports: [
      MockModule(AccordionModule),
      MockModule(SelectButtonModule),
      MockModule(FormsModule),
      // TODO Mock Translation
      TranslateModule.forRoot()
    ],
    declarations: [MockComponent(InputCharPreviewComponent), MockComponent(MultiSelectButtonComponent)],
    providers: [TranslateService]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    fixture = spectator.fixture;
    component.charList = sonderzeichenListe;
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const selectGrundzeichen = (grundzeichen: string): void => {
    const multiSelectButton = fixture.debugElement.query(By.directive(MultiSelectButtonComponent)).componentInstance;
    expect(multiSelectButton).toBeTruthy();

    // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
    // component.selectedGrundzeichen = grundzeichen;

    multiSelectButton.atSelection.emit({
      identifier: component.getTranslation('inputChar.headerBaseChars'),
      zeichen: grundzeichen
    });
    console.log(component.getTranslation('inputChar.headerBaseChars'));

    fixture.detectChanges();
  };

  sonderzeichenListe.forEach((zeichen: Zeichenobjekt) => {
    it(`should emit the chosen character ${zeichen.zeichen} after button press`, () => {
      const button = spectator.query('#lower-right-panel button') as HTMLButtonElement;
      expect(button).toBeTruthy();
      const insertCharacterSpy = spyOn(component.insertCharacter, 'emit');

      // Should use a model change event
      component.selectedZeichenObjekt = zeichen;

      button.click();
      component.insertSelectedZeichen();

      expect(insertCharacterSpy).toHaveBeenCalledWith(zeichen.zeichen);
    });
  });

  it('should have a button with the label "Einfügen"', () => {
    const button = spectator.query('#lower-right-panel button') as HTMLButtonElement;
    expect(button.innerHTML).toContain('Einfügen');
  });
});

describe('Integration Tests: InputCharDialogComponent', () => {
  const createComponent = createComponentFactory({
    component: InputCharDialogComponent,
    imports: [InputCharModule, TranslateModule.forRoot()],
    providers: [TranslateService]
  });

  beforeEach(() => {
    console.log('1');
    spectator = createComponent();
    console.log('2');
    fixture = spectator.fixture;
    console.log('3');

    fixture.componentRef.setInput('allCharacters', sonderzeichenListe);
    fixture.detectChanges();
  });

  const numberOfBases = [
    ...new Set(sonderzeichenListe.map((item) => (item.grundzeichen === '' ? '*' : item.grundzeichen)))
  ].length;
  it(`should show ${numberOfBases} available bases`, () => {
    console.log('!');
    const baseButtons = spectator.queryAll('.Gruppen-select-button .p-buttonset div');
    console.log(baseButtons);
    expect(baseButtons.length).toEqual(numberOfBases);
  });

  const numberOfGroups = [...new Set(sonderzeichenListe.map((item) => item.schriftzeichengruppe))].length;
  it(`should show ${numberOfGroups} available groups`, () => {
    const groupButtons = spectator.queryAll('.Basis-select-button .p-buttonset div');
    expect(groupButtons.length).toEqual(numberOfGroups);
  });
});
