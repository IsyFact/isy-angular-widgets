import { MultiSelectButtonComponent } from './multi-select-button.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockModule } from 'ng-mocks';
import { AccordionModule } from 'primeng/accordion';
import { SelectButton, SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import { InputCharData, Schriftzeichengruppe, Zeichenobjekt } from '../../model/model';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';

let spectator: Spectator<MultiSelectButtonComponent>;
let component: MultiSelectButtonComponent;
let fixture: ComponentFixture<MultiSelectButtonComponent>;

const charList = sonderzeichenliste as Zeichenobjekt[];
const bases = [...new Set(charList.map((item) => (item.grundzeichen === '' ? '*' : item.grundzeichen)))];
const groups = [...new Set(charList.map((item) => item.schriftzeichengruppe))];

const headerStr = 'Alle';
const inputData: InputCharData = {Basis: bases, Gruppen: groups};
const props = {
  dataToDisplay: inputData,
  allButtonOptions: headerStr
};

/**
 * Adds a click event listener to the given button
 * @param button The button who needs an event
 * @param event Event who must be
 * @param param Zeichen method parameter
 */
function addClickEventListenerForSelection(button: HTMLButtonElement, event: string, param: string): void {
  button.addEventListener(event, function () {
    spectator.component.onSelection(param);
  });
}

/**
 * Finds an HTML Element inside the DOM by text content value
 * @param contentValue The value for the search action
 */
function findElementByTextContent(contentValue: string): DebugElement {
  return spectator.fixture.debugElement.query((debugEl) => debugEl.nativeElement.textContent === contentValue);
}

describe('Unit Tests: InputCharDialogButtonSelectionSideComponent', () => {
  const createComponent = createComponentFactory({
    component: MultiSelectButtonComponent,
    imports: [MockModule(AccordionModule), MockModule(SelectButtonModule), MockModule(FormsModule)]
  });

  beforeEach(() => {
    spectator = createComponent({props: props});
    component = spectator.component;
    fixture = spectator.fixture;
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('all select button should have the correct option value', () => {
    const allSelectButton = spectator.query('#all-select-button') as HTMLButtonElement;
    const allSelectButtonAttributes = allSelectButton.attributes;

    const allSelectButtonInnerText = allSelectButtonAttributes.getNamedItem('ng-reflect-options')?.textContent;
    expect(allSelectButtonInnerText).toEqual(headerStr);
  });

  it('should firing event on all button click', () => {
    const spy = spyOn(component, 'onSelection');
    const allSelectButton = spectator.query('#all-select-button') as HTMLButtonElement;
    const eventType = 'onChange';

    addClickEventListenerForSelection(allSelectButton, eventType, '');
    allSelectButton.dispatchEvent(new Event(eventType));
    spectator.detectChanges();

    expect(spy).toHaveBeenCalledWith('');
  });

  // bases.forEach((grundzeichen: string) => {
  //   it(`should only have a ${grundzeichen} base enabled active after corresponding selection"`, () => {
  //     selectGrundzeichen(grundzeichen);
  //
  //     expect(component.allCharsModel).toBeUndefined();
  //     expect(component.selectedGrundzeichen).toEqual(grundzeichen);
  //     expect(component.selectedSchriftzeichenGruppe).toBeUndefined();
  //   });
  //
  //   it(`should show only characters with a selected base ${grundzeichen}`, () => {
  //     const charactersSelectButton = fixture.debugElement.query(
  //       By.css('#right-panel-side p-selectButton')
  //     ).componentInstance;
  //     expect(charactersSelectButton).toBeTruthy();
  //
  //     selectGrundzeichen(grundzeichen);
  //
  //     const options = charactersSelectButton.options;
  //     expect(options).toBeTruthy();
  //     for (const char of options) {
  //       expect(char.grundzeichen === '' ? '*' : char.grundzeichen).toEqual(grundzeichen);
  //     }
  //   });
  //
  //   it(`should show all characters with a selected base ${grundzeichen}`, () => {
  //     const charactersSelectButton = fixture.debugElement.query(
  //       By.css('#right-panel-side p-selectButton')
  //     ).componentInstance;
  //     expect(charactersSelectButton).toBeTruthy();
  //
  //     selectGrundzeichen(grundzeichen);
  //
  //     expect(charactersSelectButton.options.length).toEqual(
  //       sonderzeichenListe.filter((char) => (char.grundzeichen === '' ? '*' : char.grundzeichen) === grundzeichen)
  //         .length
  //     );
  //   });
  // });

  // TODO Test that tests basic functionality: emit an event on click

  groups.forEach((schriftzeichengruppe: Schriftzeichengruppe) => {
    // TODO this probably will be an integration test as this component doesnt know the selected group
    it('should only have a schriftzeichengruppe enabled active after corresponding selection', () => {
      selectSchriftzeichengruppe(schriftzeichengruppe);

      // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
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
});

describe('Integration Tests', () => {
  const createComponent = createComponentFactory({
    component: MultiSelectButtonComponent,
    imports: [SelectButtonModule, AccordionModule, FormsModule]
  });

  const selectSchriftzeichengruppe = (schriftzeichengruppe: Schriftzeichengruppe): void => {
    const schriftzeichengruppeSelectButton = fixture.debugElement.query(
      By.css('.schriftzeichengruppe-select-button')
    ).componentInstance as SelectButton;
    expect(schriftzeichengruppeSelectButton).toBeTruthy();

    // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
    // component.selectedSchriftzeichenGruppe = schriftzeichengruppe;

    schriftzeichengruppeSelectButton.onChange.emit(schriftzeichengruppe);
    schriftzeichengruppeSelectButton.fixture.detectChanges();
  };

  beforeEach(() => {
    spectator = createComponent({props: props});
    component = spectator.component;
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('all button should be selected on init ', () => {
    expect(component.allSelected).toBeTrue();
  });

  it('should select the all characters button', () => {
    const allButtonSpy = spyOn(component.atSelection, 'emit');
    const allSelectButton = spectator.query('#all-select-button') as HTMLButtonElement;
    allSelectButton.dispatchEvent(new Event('onChange'));

    expect(allButtonSpy).toHaveBeenCalledWith({identifier: '', zeichen: headerStr});
    expect(component.value).toEqual(headerStr);
    expect(component.allSelected).toBeTrue();
  });

  it('should select the all characters button after specific selection', () => {
    const buttonSpy = spyOn(component.atSelection, 'emit');

    const baseButton = findElementByTextContent('A');
    baseButton.nativeElement.click();
    expect(buttonSpy).toHaveBeenCalledWith({identifier: 'Basis', zeichen: 'A'});
    expect(component.value).toEqual('A');
    expect(component.allSelected).toBeFalse();

    buttonSpy.calls.reset();

    const allSelectButton = spectator.query('#all-select-button') as HTMLButtonElement;
    allSelectButton.dispatchEvent(new Event('onChange'));
    spectator.detectChanges();
    // ToDo: Fix
    // expect(buttonSpy).toHaveBeenCalledWith({identifier: '', zeichen: headerStr});
    // expect(component.selection).toEqual(headerStr);
    expect(component.allSelected).toBeTrue();
  });

  it('should select a base', () => {
    const spy = spyOn(component.atSelection, 'emit');
    bases.forEach((base) => {
      findElementByTextContent(base).nativeElement.click();
      expect(spy).toHaveBeenCalledWith({identifier: 'Basis', zeichen: base});
      spy.calls.reset();
    });
  });

  groups.forEach((schriftzeichengruppe: Schriftzeichengruppe) => {
    // TODO this probably will be an integration test as this component doesnt know the selected group
    it('should only have a schriftzeichengruppe enabled active after corresponding selection', () => {
      selectSchriftzeichengruppe(schriftzeichengruppe);

      // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
      expect(component.selectedGrundzeichen).toBeUndefined();
      expect(component.selectedSchriftzeichenGruppe).toEqual(schriftzeichengruppe);
    });
  }

  // it('should select a group', () => {
  // ToDo: Fix
  //   const spy = spyOn(component.atSelection, 'emit');
  //   groups.forEach((group) => {
  //     findElementByTextContent(group).nativeElement.click();
  //     expect(spy).toHaveBeenCalledWith({identifier: 'Gruppe', zeichen: group});
  //     spy.calls.reset();
  //   });
  // });

  it('first accordion tab header should contain bases', () => {
    const baseSelectButtons = spectator.query('p-accordionTab');
    expect(baseSelectButtons?.textContent).toContain('Basis');
  });

  // it('first accordion tab group should contain bases', () => {
  // ToDo: Fix
  //   const baseSelectButtons = spectator.query('p-accordionTab');
  //   expect(baseSelectButtons?.textContent).toContain('Gruppen');
  // });
});
