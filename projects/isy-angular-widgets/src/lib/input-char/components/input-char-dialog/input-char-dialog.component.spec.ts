import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {InputCharDialogComponent} from './input-char-dialog.component';
import {Dialog} from 'primeng/dialog';
import {By} from '@angular/platform-browser';
import {Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output} from '@angular/core';
import {SelectButton} from 'primeng/selectbutton';
import {Accordion} from 'primeng/accordion';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InputCharModule} from "../../input-char.module";

// Disabled for mocking
/* eslint-disable @angular-eslint/component-selector */

@Component({
  selector: 'p-dialog',
  template: '<ng-content></ng-content>'
})
class FakeDialogComponent implements Partial<Dialog> {
  @Output() visibleChange = new EventEmitter<boolean>();
}

@Component({
  selector: 'p-selectButton',
  template: ''
})
class FakeSelectButtonComponent implements Partial<SelectButton> {
  @Input() options?: any[];

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onChange = new EventEmitter<void>();
}

@Component({
  selector: 'p-accordion',
  template: '<ng-content></ng-content>'
})
class FakeAccordionComponent implements Partial<Accordion> {

}

describe('Unit Tests: InputCharDialogComponent', () => {
  let component: InputCharDialogComponent;
  let fixture: ComponentFixture<InputCharDialogComponent>;

  const dialogDefaultWidth = '775px';
  const dialogDefaultHeight = '460px';

  const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];
  const numberOfBases = [...new Set(sonderzeichenListe.map(item => item.grundzeichen === '' ? '*' : item.grundzeichen))].length;
  const numberOfGroups = [...new Set(sonderzeichenListe.map(item => item.schriftzeichengruppe))].length;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [InputCharDialogComponent, FakeDialogComponent, FakeSelectButtonComponent, FakeAccordionComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InputCharDialogComponent);
    component = fixture.componentInstance;
    component.allCharacters = sonderzeichenListe;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct default size', () => {
    expect(component.width).toEqual(dialogDefaultWidth);
    expect(component.height).toEqual(dialogDefaultHeight);
  });

  describe('after showing', () => {
    beforeEach(fakeAsync(() => {
      component.visible = true;
      fixture.detectChanges();
    }));

    it('should emit a visibility change when inner dialog is closed', () => {
      const onCloseSpy = spyOn(component.visibleChange, 'emit');

      const innerDialog = fixture.debugElement.query(By.directive(FakeDialogComponent)).componentInstance;
      expect(innerDialog).toBeTruthy();

      innerDialog.visibleChange.emit(false);
      expect(onCloseSpy).toHaveBeenCalledWith(false);
    });

    it(`should show ${numberOfBases} available bases`, () => {
      const baseSelectButton = fixture.debugElement.query(By.css('#grundzeichen-select-button')).componentInstance;
      expect(baseSelectButton.options.length).toEqual(numberOfBases);
    });

    it(`should show ${numberOfGroups} available groups`, () => {
      const schriftzeichengruppeSelectButton = fixture.debugElement.query(By.css('#schriftzeichengruppe-select-button')).componentInstance;
      expect(schriftzeichengruppeSelectButton.options.length).toEqual(numberOfGroups);
    });

    it('should only have all schriftzeichen active after clicking it', () => {
      const allButton = fixture.debugElement.query(By.css('#all-select-button')).componentInstance;
      allButton.onChange.emit();

      expect(component.allCharsModel).toBeTruthy();
      expect(component.selectedGrundzeichen).toBeUndefined();
      expect(component.selectedSchriftzeichenGruppe).toBeUndefined();
    });

    it('should only have a "A" base enabled active after clicking it"', () => {
      const baseSelectButton = fixture.debugElement.query(By.css('#grundzeichen-select-button')).componentInstance;
      expect(baseSelectButton).toBeTruthy();

      // I couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
      component.selectedGrundzeichen = 'A';

      baseSelectButton.onChange.emit('A');

      expect(component.allCharsModel).toBeUndefined();
      expect(component.selectedGrundzeichen).toBeTruthy();
      expect(component.selectedSchriftzeichenGruppe).toBeUndefined();
    });

    it('should only have a schriftzeichengruppe enabled active after clicking it', () => {
      const schriftzeichengruppeSelectButton = fixture.debugElement.query(By.css('#schriftzeichengruppe-select-button')).componentInstance;
      expect(schriftzeichengruppeSelectButton).toBeTruthy();

      // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
      component.selectedSchriftzeichenGruppe = Schriftzeichengruppe.LATEIN;

      schriftzeichengruppeSelectButton.onChange.emit(Schriftzeichengruppe.LATEIN);

      expect(component.allCharsModel).toBeUndefined();
      expect(component.selectedGrundzeichen).toBeUndefined();
      expect(component.selectedSchriftzeichenGruppe).toBeTruthy();
    });

    /**
     * Helper function to emulate a grundzeichen selection.
     * @param grundzeichen The grundzeichen to select.
     */
    function selectGrundzeichen(grundzeichen: string): void {
      const baseSelectButton = fixture.debugElement.query(By.css('#grundzeichen-select-button')).componentInstance;
      expect(baseSelectButton).toBeTruthy();

      // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
      component.selectedGrundzeichen = grundzeichen;

      baseSelectButton.onChange.emit(grundzeichen);
      fixture.detectChanges();
    }

    it('should show only characters with a selected base', () => {
      const charactersSelectButton = fixture.debugElement.query(By.css('#right-panel-side p-selectButton')).componentInstance;
      expect(charactersSelectButton).toBeTruthy();

      selectGrundzeichen('A');

      const options = charactersSelectButton.options;
      expect(options).toBeTruthy();
      for (const character of options) {
        expect(character.grundzeichen).toEqual('A');
      }
    });

    it('should show all characters with a selected base', () => {
      const charactersSelectButton = fixture.debugElement.query(By.css('#right-panel-side p-selectButton')).componentInstance;
      expect(charactersSelectButton).toBeTruthy();

      selectGrundzeichen('A');

      expect(charactersSelectButton.options.length).toEqual(sonderzeichenListe.filter(char => char.grundzeichen === 'A').length);
    });

    /**
     * Helper function to emulate a schriftzeichengruppe selection.
     * @param schriftzeichengruppe The schriftzeichengruppe to select.
     */
    function selectSchriftzeichengruppe(schriftzeichengruppe: Schriftzeichengruppe): void {
      const schriftzeichengruppeSelectButton = fixture.debugElement.query(By.css('#schriftzeichengruppe-select-button')).componentInstance;
      expect(schriftzeichengruppeSelectButton).toBeTruthy();

      // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
      component.selectedSchriftzeichenGruppe = schriftzeichengruppe;

      schriftzeichengruppeSelectButton.onChange.emit(schriftzeichengruppe);
      fixture.detectChanges();
    }

    it('should show only characters with a selected schriftzeichengruppe', () => {
      const charactersSelectButton = fixture.debugElement.query(By.css('#right-panel-side p-selectButton')).componentInstance;
      expect(charactersSelectButton).toBeTruthy();

      selectSchriftzeichengruppe(Schriftzeichengruppe.LATEIN);

      const options = charactersSelectButton.options;
      expect(options).toBeTruthy();
      for (const character of options) {
        expect(character.schriftzeichengruppe).toEqual(Schriftzeichengruppe.LATEIN);
      }
    });

    it('should show all characters with a selected schriftzeichengruppe', () => {
      const schriftzeichengruppeSelectButton = fixture.debugElement.query(By.css('#schriftzeichengruppe-select-button')).componentInstance;
      expect(schriftzeichengruppeSelectButton).toBeTruthy();
      const charactersSelectButton = fixture.debugElement.query(By.css('#right-panel-side p-selectButton')).componentInstance;
      expect(charactersSelectButton).toBeTruthy();

      // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
      component.selectedSchriftzeichenGruppe = Schriftzeichengruppe.LATEIN;

      schriftzeichengruppeSelectButton.onChange.emit(Schriftzeichengruppe.LATEIN);
      fixture.detectChanges();

      expect(charactersSelectButton.options.length).toEqual(sonderzeichenListe.filter(char => char.schriftzeichengruppe === Schriftzeichengruppe.LATEIN).length);
    });

    it('should have a button with the label "Einfügen"', () => {
      const button = fixture.debugElement.query(By.css('#lower-right-panel button')).nativeElement;
      expect(button.innerHTML).toContain('Einfügen');
    });
  });
});

describe('Integration Tests: InputCharDialogComponent', () => {
  let component: InputCharDialogComponent;
  let fixture: ComponentFixture<InputCharDialogComponent>;

  const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];
  const numberOfBases = [...new Set(sonderzeichenListe.map(item => item.grundzeichen === '' ? '*' : item.grundzeichen))].length;
  const numberOfGroups = [...new Set(sonderzeichenListe.map(item => item.schriftzeichengruppe))].length;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [InputCharDialogComponent],
      imports: [BrowserAnimationsModule, InputCharModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InputCharDialogComponent);
    component = fixture.componentInstance;
    component.visible = true;
    component.allCharacters = sonderzeichenListe;
    fixture.detectChanges();
  });

  it(`should show ${numberOfBases} available bases`, () => {
    const baseButtons = fixture.debugElement.queryAll(By.css('#grundzeichen-select-button .p-buttonset div'));
    expect(baseButtons.length).toEqual(numberOfBases);
  });

  it(`should show ${numberOfGroups} available groups`, () => {
    const groupButtons = fixture.debugElement.queryAll(By.css('#schriftzeichengruppe-select-button .p-buttonset div'));
    expect(groupButtons.length).toEqual(numberOfGroups);
  });
});
