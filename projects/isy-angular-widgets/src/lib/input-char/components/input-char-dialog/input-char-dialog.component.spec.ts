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
  const bases = [...new Set(sonderzeichenListe.map((item) => (item.grundzeichen === '' ? '*' : item.grundzeichen)))];
  const groups = [...new Set(sonderzeichenListe.map((item) => item.schriftzeichengruppe))];

  const createComponent = createComponentFactory({
    component: InputCharDialogComponent,
    imports: [
      MockModule(AccordionModule),
      MockModule(SelectButtonModule),
      MockModule(FormsModule),
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

  // const selectSchriftzeichengruppe = (schriftzeichengruppe: Schriftzeichengruppe): void => {
  //   const schriftzeichengruppeSelectButton = fixture.debugElement.query(
  //     By.css('#schriftzeichengruppe-select-button')
  //   ).componentInstance;
  //   expect(schriftzeichengruppeSelectButton).toBeTruthy();
  //
  //   // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
  //   component.selectedSchriftzeichenGruppe = schriftzeichengruppe;
  //
  //   schriftzeichengruppeSelectButton.onChange.emit(schriftzeichengruppe);
  //   fixture.detectChanges();
  // };

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
    imports: [InputCharModule]
  });

  beforeEach(() => {
    spectator = createComponent();
    fixture = spectator.fixture;

    fixture.componentRef.setInput('allCharacters', sonderzeichenListe);
    fixture.detectChanges();
  });

  const numberOfBases = [
    ...new Set(sonderzeichenListe.map((item) => (item.grundzeichen === '' ? '*' : item.grundzeichen)))
  ].length;
  it(`should show ${numberOfBases} available bases`, () => {
    const baseButtons = spectator.queryAll('#grundzeichen-select-button .p-buttonset div');
    expect(baseButtons.length).toEqual(numberOfBases);
  });

  const numberOfGroups = [...new Set(sonderzeichenListe.map((item) => item.schriftzeichengruppe))].length;
  it(`should show ${numberOfGroups} available groups`, () => {
    const groupButtons = spectator.queryAll('#schriftzeichengruppe-select-button .p-buttonset div');
    expect(groupButtons.length).toEqual(numberOfGroups);
  });
});
