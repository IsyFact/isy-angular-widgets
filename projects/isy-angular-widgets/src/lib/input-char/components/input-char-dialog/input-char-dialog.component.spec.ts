import {InputCharDialogComponent} from './input-char-dialog.component';
import {By} from '@angular/platform-browser';
import {Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {SelectButtonModule} from 'primeng/selectbutton';
import {AccordionModule} from 'primeng/accordion';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputCharModule} from '../../input-char.module';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {FormsModule} from '@angular/forms';
import {MockComponent} from 'ng-mocks';
import {InputCharPreviewComponent} from '../input-char-preview/input-char-preview.component';

let spectator: Spectator<InputCharDialogComponent>;

describe('Unit Tests: InputCharDialogComponent', () => {
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
    spectator.component.allCharacters = sonderzeichenListe;
    spectator.component.ngOnChanges();
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it(`should show ${bases.length} available bases`, () => {
    const baseSelectButton = spectator.fixture.debugElement.query(
      By.css('#grundzeichen-select-button')
    ).componentInstance;
    expect(baseSelectButton).toBeTruthy();
    expect(baseSelectButton.options.length).toEqual(bases.length);
  });

  it(`should show ${groups.length} available groups`, () => {
    const schriftzeichengruppeSelectButton = spectator.fixture.debugElement.query(
      By.css('#schriftzeichengruppe-select-button')
    ).componentInstance;
    expect(schriftzeichengruppeSelectButton).toBeTruthy();
    expect(schriftzeichengruppeSelectButton.options.length).toEqual(groups.length);
  });

  it('should only have all schriftzeichen active after corresponding selection', () => {
    const allButton = spectator.fixture.debugElement.query(By.css('#all-select-button')).componentInstance;
    expect(allButton).toBeTruthy();
    allButton.onChange.emit();

    expect(spectator.component.allCharsModel).toBeTruthy();
    expect(spectator.component.selectedGrundzeichen).toBeUndefined();
    expect(spectator.component.selectedSchriftzeichenGruppe).toBeUndefined();
  });

  const selectGrundzeichen = (grundzeichen: string): void => {
    const baseSelectButton = spectator.fixture.debugElement.query(
      By.css('#grundzeichen-select-button')
    ).componentInstance;
    expect(baseSelectButton).toBeTruthy();

    // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
    spectator.component.selectedGrundzeichen = grundzeichen;

    baseSelectButton.onChange.emit(grundzeichen);
    spectator.fixture.detectChanges();
  };

  bases.forEach((grundzeichen: string) => {
    it(`should only have a ${grundzeichen} base enabled active after corresponding selection"`, () => {
      selectGrundzeichen(grundzeichen);

      // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
      expect(spectator.component.allCharsModel).toBeUndefined();
      expect(spectator.component.selectedGrundzeichen).toEqual(grundzeichen);
      expect(spectator.component.selectedSchriftzeichenGruppe).toBeUndefined();
    });

    it(`should show only characters with a selected base ${grundzeichen}`, () => {
      const charactersSelectButton = spectator.fixture.debugElement.query(
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
      const charactersSelectButton = spectator.fixture.debugElement.query(
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
    const schriftzeichengruppeSelectButton = spectator.fixture.debugElement.query(
      By.css('#schriftzeichengruppe-select-button')
    ).componentInstance;
    expect(schriftzeichengruppeSelectButton).toBeTruthy();

    // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
    spectator.component.selectedSchriftzeichenGruppe = schriftzeichengruppe;

    schriftzeichengruppeSelectButton.onChange.emit(schriftzeichengruppe);
    spectator.fixture.detectChanges();
  };

  groups.forEach((schriftzeichengruppe: Schriftzeichengruppe) => {
    it('should only have a schriftzeichengruppe enabled active after corresponding selection', () => {
      selectSchriftzeichengruppe(schriftzeichengruppe);

      // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
      expect(spectator.component.allCharsModel).toBeUndefined();
      expect(spectator.component.selectedGrundzeichen).toBeUndefined();
      expect(spectator.component.selectedSchriftzeichenGruppe).toEqual(schriftzeichengruppe);
    });

    it('should show only characters with a selected schriftzeichengruppe', () => {
      const charactersSelectButton = spectator.fixture.debugElement.query(
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
      const schriftzeichengruppeSelectButton = spectator.fixture.debugElement.query(
        By.css('#schriftzeichengruppe-select-button')
      ).componentInstance;
      expect(schriftzeichengruppeSelectButton).toBeTruthy();
      const charactersSelectButton = spectator.fixture.debugElement.query(
        By.css('#right-panel-side p-selectButton')
      ).componentInstance;
      expect(charactersSelectButton).toBeTruthy();

      // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
      spectator.component.selectedSchriftzeichenGruppe = schriftzeichengruppe;

      schriftzeichengruppeSelectButton.onChange.emit(schriftzeichengruppe);
      spectator.fixture.detectChanges();

      expect(charactersSelectButton.options.length).toEqual(
        sonderzeichenListe.filter((char) => char.schriftzeichengruppe === schriftzeichengruppe).length
      );
    });
  });

  sonderzeichenListe.forEach((zeichen: Zeichenobjekt) => {
    it(`should emit the chosen character ${zeichen.zeichen} after button press`, () => {
      const button = spectator.fixture.debugElement.query(By.css('#lower-right-panel button')).nativeElement;
      expect(button).toBeTruthy();
      const insertCharacterSpy = spyOn(spectator.component.insertCharacter, 'emit');

      // Should use a model change event
      spectator.component.selectedZeichenObjekt = zeichen;

      button.click();
      spectator.component.insertSelectedZeichen();

      expect(insertCharacterSpy).toHaveBeenCalledWith(zeichen.zeichen);
    });
  });

  it('should have a button with the label "Einfügen"', () => {
    const button = spectator.fixture.debugElement.query(By.css('#lower-right-panel button')).nativeElement;
    expect(button.innerHTML).toContain('Einfügen');
  });
});

describe('Integration Tests: InputCharDialogComponent', () => {
  const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];

  const createdComponent = createComponentFactory({
    component: InputCharDialogComponent,
    imports: [InputCharModule, BrowserAnimationsModule]
  });

  beforeEach(() => {
    spectator = createdComponent();
    spectator.fixture.componentRef.setInput('allCharacters', sonderzeichenListe);
    spectator.fixture.detectChanges();
  });

  const numberOfBases = [
    ...new Set(sonderzeichenListe.map((item) => (item.grundzeichen === '' ? '*' : item.grundzeichen)))
  ].length;
  it(`should show ${numberOfBases} available bases`, () => {
    const baseButtons = spectator.fixture.debugElement.queryAll(By.css('#grundzeichen-select-button .p-buttonset div'));
    expect(baseButtons.length).toEqual(numberOfBases);
  });

  const numberOfGroups = [...new Set(sonderzeichenListe.map((item) => item.schriftzeichengruppe))].length;
  it(`should show ${numberOfGroups} available groups`, () => {
    const groupButtons = spectator.fixture.debugElement.queryAll(
      By.css('#schriftzeichengruppe-select-button .p-buttonset div')
    );
    expect(groupButtons.length).toEqual(numberOfGroups);
  });
});
