import {MultiSelectButtonComponent} from './multi-select-button.component';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {MockModule} from 'ng-mocks';
import {AccordionModule} from 'primeng/accordion';
import {SelectButtonModule} from 'primeng/selectbutton';
import {FormsModule} from '@angular/forms';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {InputCharData, Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ComponentFixture} from '@angular/core/testing';

let spectator: Spectator<MultiSelectButtonComponent>;
let component: MultiSelectButtonComponent;
let fixture: ComponentFixture<MultiSelectButtonComponent>;

const charList = sonderzeichenliste as Zeichenobjekt[];
const bases = [...new Set(charList.map((item) => (item.grundzeichen === '' ? '*' : item.grundzeichen)))];
const groups = [...new Set(charList.map((item) => item.schriftzeichengruppe))];

const headerStr = 'All';
const inputData: InputCharData = {Base: bases, Groups: groups};
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
  // button.addEventListener(event, function () {
  //   spectator.component.onSelection(param);
  // });
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
    const spy = spyOn(component, 'onChange');
    const allSelectButton = spectator.query('.all-select-button') as HTMLButtonElement;
    const eventType = 'onChange';

    addClickEventListenerForSelection(allSelectButton, eventType, '');
    allSelectButton.dispatchEvent(new Event(eventType));
    spectator.detectChanges();

    expect(spy).toHaveBeenCalledWith('');
  });

  it('all button should be selected on init ', () => {
    expect(component.value).toBeUndefined();
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

  // groups.forEach((schriftzeichengruppe: Schriftzeichengruppe) => {
  //   // TODO this probably will be an integration test as this component doesnt know the selected group
  //   it('should only have a schriftzeichengruppe enabled active after corresponding selection', () => {
  //     selectSchriftzeichengruppe(schriftzeichengruppe);
  //
  //     // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
  //     expect(component.selectedGrundzeichen).toBeUndefined();
  //     expect(component.selectedSchriftzeichenGruppe).toEqual(schriftzeichengruppe);
  //   });
  //
  //   it('should show only characters with a selected schriftzeichengruppe', () => {
  //     const charactersSelectButton = fixture.debugElement.query(
  //       By.css('#right-panel-side p-selectButton')
  //     ).componentInstance;
  //     expect(charactersSelectButton).toBeTruthy();
  //
  //     selectSchriftzeichengruppe(schriftzeichengruppe);
  //
  //     const options = charactersSelectButton.options;
  //     expect(options).toBeTruthy();
  //     for (const character of options) {
  //       expect(character.schriftzeichengruppe).toEqual(schriftzeichengruppe);
  //     }
  //   });
  //
  //   it('should show all characters with a selected schriftzeichengruppe', () => {
  //     const schriftzeichengruppeSelectButton = fixture.debugElement.query(
  //       By.css('#schriftzeichengruppe-select-button')
  //     ).componentInstance;
  //     expect(schriftzeichengruppeSelectButton).toBeTruthy();
  //     const charactersSelectButton = fixture.debugElement.query(
  //       By.css('#right-panel-side p-selectButton')
  //     ).componentInstance;
  //     expect(charactersSelectButton).toBeTruthy();
  //
  //     // Couldn't figure out how to trigger a ngModel change from a test, so this is a bad placeholder
  //     component.selectedSchriftzeichenGruppe = schriftzeichengruppe;
  //
  //     schriftzeichengruppeSelectButton.onChange.emit(schriftzeichengruppe);
  //     fixture.detectChanges();
  //
  //     expect(charactersSelectButton.options.length).toEqual(
  //       sonderzeichenListe.filter((char) => char.schriftzeichengruppe === schriftzeichengruppe).length
  //     );
  //   });
  // });
});

describe('Integration Tests', () => {
  const createComponent = createComponentFactory({
    component: MultiSelectButtonComponent,
    imports: [SelectButtonModule, AccordionModule, FormsModule]
  });

  beforeEach(() => {
    spectator = createComponent({props: props});
    component = spectator.component;
    fixture = spectator.fixture;
    spectator.detectChanges();
  });

  const selectSchriftzeichengruppe = (schriftzeichengruppe: Schriftzeichengruppe): void => {
    const schriftzeichengruppeSelectButton = fixture.debugElement
      .queryAll(By.css('.Groups-select-button .p-buttonset div span'))
      .find((elem) => elem.nativeElement.textContent === schriftzeichengruppe)?.nativeElement as HTMLElement;
    expect(schriftzeichengruppeSelectButton).toBeTruthy();

    schriftzeichengruppeSelectButton.click();
    fixture.detectChanges();
  };

  const selectBasis = (basis: string): void => {
    const basisSelectButton = fixture.debugElement
      .queryAll(By.css('.Base-select-button .p-buttonset div span'))
      .find((elem) => elem.nativeElement.textContent === basis)?.nativeElement as HTMLElement;
    expect(basisSelectButton).toBeTruthy();

    basisSelectButton.click();
    fixture.detectChanges();
  };

  it('should always have only one selection when clicking through multiple selections', () => {
    bases.forEach((base: string) => {
      selectBasis(base);
      expect(fixture.debugElement.queryAll(By.css('.p-button.p-highlight')).length).toEqual(1);
      expect(
        fixture.debugElement.queryAll(By.css('.p-button')).filter((elem) => elem.attributes['aria-checked'] === 'true')
          .length
      ).toEqual(1);
    });

    groups.forEach((schriftzeichengruppe: Schriftzeichengruppe) => {
      selectSchriftzeichengruppe(schriftzeichengruppe);
      expect(fixture.debugElement.queryAll(By.css('.p-button.p-highlight')).length).toEqual(1);
      expect(
        fixture.debugElement.queryAll(By.css('.p-button')).filter((elem) => elem.attributes['aria-checked'] === 'true')
          .length
      ).toEqual(1);
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('all button should be selected on init ', () => {
    const allButton = fixture.debugElement.query(By.css('.all-select-button .p-selectbutton .p-button'));

    expect(allButton.classes['p-highlight']).toBeTrue();
    expect(allButton.attributes['aria-checked']).toBeTrue();
  });

  bases.forEach((base: string) => {
    it(`should show 'Base' and ${base} in value with those present in input`, () => {
      selectBasis(base);

      expect(component.value?.group).toEqual('Base');
      expect(component.value?.value).toEqual(base);
    });
  });

  groups.forEach((group: Schriftzeichengruppe) => {
    it(`should show 'Groups' and ${group} in value with those present in input`, () => {
      selectSchriftzeichengruppe(group);

      expect(component.value?.group).toEqual('Groups');
      expect(component.value?.value).toEqual(group);
    });
  });

  it('should have have the accordions ordered according to input', () => {
    const baseSelectButtons = spectator.queryAll('p-accordionTab .p-accordion-header-text');

    Object.keys(inputData).forEach((group, index) => {
      expect(baseSelectButtons[index].textContent).toContain(group);
    });
  });
});
