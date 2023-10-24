import {ComponentFixture, TestBed} from '@angular/core/testing';
import {InputCharDialogComponent} from './input-char-dialog.component';
import {By} from '@angular/platform-browser';
import {Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output} from '@angular/core';
import {SelectButton, SelectButtonChangeEvent} from 'primeng/selectbutton';
import {Accordion} from 'primeng/accordion';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputCharModule} from '../../input-char.module';

@Component({
  selector: 'p-selectButton',
  template: ''
})
class FakeSelectButtonComponent implements Partial<SelectButton> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() options?: any[];

  // Implementing onChange from SelectButton because usage of Partial
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onChange = new EventEmitter<SelectButtonChangeEvent>();
}

@Component({
  selector: 'p-accordion',
  template: '<ng-content></ng-content>'
})
class FakeAccordionComponent implements Partial<Accordion> {}

describe('Unit Tests: InputCharDialogComponent', () => {
  let component: InputCharDialogComponent;
  let fixture: ComponentFixture<InputCharDialogComponent>;

  const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];
  const bases = [...new Set(sonderzeichenListe.map((item) => (item.grundzeichen === '' ? '*' : item.grundzeichen)))];
  const groups = [...new Set(sonderzeichenListe.map((item) => item.schriftzeichengruppe))];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputCharDialogComponent, FakeSelectButtonComponent, FakeAccordionComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(InputCharDialogComponent);
    component = fixture.componentInstance;
    component.allCharacters = sonderzeichenListe;
    // Manually triggered as input doesn't come from outside in tests
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
      const button = fixture.debugElement.query(By.css('#lower-right-panel button')).nativeElement;
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
    const button = fixture.debugElement.query(By.css('#lower-right-panel button')).nativeElement;
    expect(button.innerHTML).toContain('Einfügen');
  });
});

describe('Integration Tests: InputCharDialogComponent', () => {
  let component: InputCharDialogComponent;
  let fixture: ComponentFixture<InputCharDialogComponent>;

  const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputCharDialogComponent],
      imports: [BrowserAnimationsModule, InputCharModule]
    }).compileComponents();

    fixture = TestBed.createComponent(InputCharDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('allCharacters', sonderzeichenListe);
    fixture.detectChanges();
  });

  const numberOfBases = [
    ...new Set(sonderzeichenListe.map((item) => (item.grundzeichen === '' ? '*' : item.grundzeichen)))
  ].length;
  it(`should show ${numberOfBases} available bases`, () => {
    const baseButtons = fixture.debugElement.queryAll(By.css('#grundzeichen-select-button .p-buttonset div'));
    expect(baseButtons.length).toEqual(numberOfBases);
  });

  const numberOfGroups = [...new Set(sonderzeichenListe.map((item) => item.schriftzeichengruppe))].length;
  it(`should show ${numberOfGroups} available groups`, () => {
    const groupButtons = fixture.debugElement.queryAll(By.css('#schriftzeichengruppe-select-button .p-buttonset div'));
    expect(groupButtons.length).toEqual(numberOfGroups);
  });
});
