import {InputCharDialogComponent} from './input-char-dialog.component';
import {By} from '@angular/platform-browser';
import {Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputCharModule} from '../../input-char.module';
import {MockComponent} from 'ng-mocks';
import {SelectButtonModule} from 'primeng/selectbutton';
import {AccordionModule} from 'primeng/accordion';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {FormsModule} from '@angular/forms';
import {InputCharPreviewComponent} from '../input-char-preview/input-char-preview.component';
import {ComponentFixture} from '@angular/core/testing';

let spectator: Spectator<InputCharDialogComponent>;
let fixture: ComponentFixture<InputCharDialogComponent>;
const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];

describe('Unit Tests: InputCharDialogComponent', () => {
  let component: InputCharDialogComponent;
  const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];
  const bases = [...new Set(sonderzeichenListe.map((item) => (item.grundzeichen === '' ? '*' : item.grundzeichen)))];
  const groups = [...new Set(sonderzeichenListe.map((item) => item.schriftzeichengruppe))];

  const createdComponent = createComponentFactory({
    component: InputCharDialogComponent,
    imports: [AccordionModule, SelectButtonModule, FormsModule],
    declarations: [MockComponent(InputCharPreviewComponent)]
  });

  beforeEach(() => {
    spectator = createdComponent();
    component = spectator.component;
    fixture = spectator.fixture;
    component.allCharacters = sonderzeichenListe;
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should show ${bases.length} available bases`, () => {
    const baseSelectButton = fixture.debugElement.query(By.css('#grundzeichen-select-button')).componentInstance;
    expect(baseSelectButton).toBeTruthy();
    expect(baseSelectButton.options.length).toEqual(bases.length);
  });

  it(`should show ${groups.length} available groups`, () => {
    const schriftzeichengruppeSelectButton = fixture.debugElement.query(
      By.css('#schriftzeichengruppe-select-button')
    ).componentInstance;
    expect(schriftzeichengruppeSelectButton).toBeTruthy();
    expect(schriftzeichengruppeSelectButton.options.length).toEqual(groups.length);
  });

  it('should only have all schriftzeichen active after corresponding selection', () => {
    const allButton = fixture.debugElement.query(By.css('#all-select-button')).componentInstance;
    expect(allButton).toBeTruthy();
    allButton.onChange.emit();

    expect(component.allCharsModel).toBeTruthy();
    expect(component.selectedGrundzeichen).toBeUndefined();
    expect(component.selectedSchriftzeichenGruppe).toBeUndefined();
  });

  const selectGrundzeichen = (grundzeichen: string): void => {
    const baseSelectButton = fixture.debugElement.query(By.css('#grundzeichen-select-button')).componentInstance;
    expect(baseSelectButton).toBeTruthy();

    // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
    component.selectedGrundzeichen = grundzeichen;

    baseSelectButton.onChange.emit(grundzeichen);
    fixture.detectChanges();
  };

  bases.forEach((grundzeichen: string) => {
    it(`should only have a ${grundzeichen} base enabled active after corresponding selection"`, () => {
      selectGrundzeichen(grundzeichen);

      // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
      expect(component.allCharsModel).toBeUndefined();
      expect(component.selectedGrundzeichen).toEqual(grundzeichen);
      expect(component.selectedSchriftzeichenGruppe).toBeUndefined();
    });

    it(`should show only characters with a selected base ${grundzeichen}`, () => {
      const charactersSelectButton = fixture.debugElement.query(
        By.css('#right-panel-side p-selectButton')
      ).componentInstance;
      expect(charactersSelectButton).toBeTruthy();

      selectGrundzeichen(grundzeichen);

      const options = charactersSelectButton.options;
      expect(options).toBeTruthy();
      for (const char of options) {
        expect(char.grundzeichen === '' ? '*' : char.grundzeichen).toEqual(grundzeichen);
      }
    });

    it(`should show all characters with a selected base ${grundzeichen}`, () => {
      const charactersSelectButton = fixture.debugElement.query(
        By.css('#right-panel-side p-selectButton')
      ).componentInstance;
      expect(charactersSelectButton).toBeTruthy();

      selectGrundzeichen(grundzeichen);

      expect(charactersSelectButton.options.length).toEqual(
        sonderzeichenListe.filter((char) => (char.grundzeichen === '' ? '*' : char.grundzeichen) === grundzeichen)
          .length
      );
    });
  });

  const selectSchriftzeichengruppe = (schriftzeichengruppe: Schriftzeichengruppe): void => {
    const schriftzeichengruppeSelectButton = fixture.debugElement.query(
      By.css('#schriftzeichengruppe-select-button')
    ).componentInstance;
    expect(schriftzeichengruppeSelectButton).toBeTruthy();

    // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
    component.selectedSchriftzeichenGruppe = schriftzeichengruppe;

    schriftzeichengruppeSelectButton.onChange.emit(schriftzeichengruppe);
    fixture.detectChanges();
  };

  groups.forEach((schriftzeichengruppe: Schriftzeichengruppe) => {
    it('should only have a schriftzeichengruppe enabled active after corresponding selection', () => {
      selectSchriftzeichengruppe(schriftzeichengruppe);

      // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
      expect(component.allCharsModel).toBeUndefined();
      expect(component.selectedGrundzeichen).toBeUndefined();
      expect(component.selectedSchriftzeichenGruppe).toEqual(schriftzeichengruppe);
    });

    it('should show only characters with a selected schriftzeichengruppe', () => {
      const charactersSelectButton = fixture.debugElement.query(
        By.css('#right-panel-side p-selectButton')
      ).componentInstance;
      expect(charactersSelectButton).toBeTruthy();

      selectSchriftzeichengruppe(schriftzeichengruppe);

      const options = charactersSelectButton.options;
      expect(options).toBeTruthy();
      for (const character of options) {
        expect(character.schriftzeichengruppe).toEqual(schriftzeichengruppe);
      }
    });

    it('should show all characters with a selected schriftzeichengruppe', () => {
      const schriftzeichengruppeSelectButton = fixture.debugElement.query(
        By.css('#schriftzeichengruppe-select-button')
      ).componentInstance;
      expect(schriftzeichengruppeSelectButton).toBeTruthy();
      const charactersSelectButton = fixture.debugElement.query(
        By.css('#right-panel-side p-selectButton')
      ).componentInstance;
      expect(charactersSelectButton).toBeTruthy();

      // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
      component.selectedSchriftzeichenGruppe = schriftzeichengruppe;

      schriftzeichengruppeSelectButton.onChange.emit(schriftzeichengruppe);
      fixture.detectChanges();

      expect(charactersSelectButton.options.length).toEqual(
        sonderzeichenListe.filter((char) => char.schriftzeichengruppe === schriftzeichengruppe).length
      );
    });
  });

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
  const createdComponent = createComponentFactory({
    component: InputCharDialogComponent,
    imports: [InputCharModule, BrowserAnimationsModule]
  });

  beforeEach(() => {
    spectator = createdComponent();
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
