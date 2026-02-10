import {InputCharDialogComponent} from './input-char-dialog.component';
import {By} from '@angular/platform-browser';
import {Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {SelectButtonModule} from 'primeng/selectbutton';
import {AccordionModule} from 'primeng/accordion';
import {createComponentFactory, Spectator, SpyObject} from '@ngneat/spectator';
import {FormsModule} from '@angular/forms';
import {InputCharPreviewComponent} from '../input-char-preview/input-char-preview.component';
import {ComponentFixture} from '@angular/core/testing';
import {MultiSelectButtonComponent} from '../multi-select-button/multi-select-button.component';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {CharacterService} from '../../services/character.service';
import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'isy-input-char-preview',
  template: '',
  standalone: true
})
class MockInputCharPreviewComponent {
  @Input() zeichenObjekt: Zeichenobjekt | null = null;
}

@Component({
  selector: 'isy-multi-select-button',
  template: '',
  standalone: true
})
class MockMultiSelectButtonComponent {
  @Input() dataToDisplay: unknown;
  @Input() allButtonOptionsLabel = '';
  @Output() valueChange = new EventEmitter<{group: string; value: string} | undefined>();
}

let spectator: Spectator<InputCharDialogComponent>;
let mockWidgetsConfigService: SpyObject<WidgetsConfigService>;
let fixture: ComponentFixture<InputCharDialogComponent>;
const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];
const bases = [...new Set(sonderzeichenListe.map((item) => (item.grundzeichen === '' ? '*' : item.grundzeichen)))];
const groups = [...new Set(sonderzeichenListe.map((item) => item.schriftzeichengruppe))];

describe('Unit Tests: InputCharDialogComponent', () => {
  let component: InputCharDialogComponent;
  const createComponent = createComponentFactory({
    component: InputCharDialogComponent,
    imports: [AccordionModule, SelectButtonModule, FormsModule],
    providers: [CharacterService],
    mocks: [WidgetsConfigService],
    detectChanges: false,

    overrideComponents: [
      [
        InputCharDialogComponent,
        {
          remove: {imports: [InputCharPreviewComponent, MultiSelectButtonComponent]},
          add: {imports: [MockInputCharPreviewComponent, MockMultiSelectButtonComponent]}
        }
      ]
    ]
  });

  const render = (): void => fixture.detectChanges(false);

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    fixture = spectator.fixture;
    mockWidgetsConfigService = spectator.inject(WidgetsConfigService);
    mockWidgetsConfigService.getTranslation.and.callFake((key: string) => key);
    spectator.setInput('charList', sonderzeichenListe);
    render();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onAllSelection for unexpected selection values', () => {
    const onAllSelectionSpy = spyOn(component, 'onAllSelection').and.callThrough();
    component.onSelection({group: 'unexpectedGroup', value: 'unexpectedValue'});
    expect(onAllSelectionSpy).toHaveBeenCalled();
  });

  it('should call resetDisplayedCharacters when onAllSelection is called', () => {
    const resetDisplayedCharactersSpy = spyOn(component, 'resetDisplayedCharacters').and.callThrough();
    component.onAllSelection();
    expect(resetDisplayedCharactersSpy).toHaveBeenCalled();
  });

  it('should rebuild leftViewData when charList changes', () => {
    const spy = spyOn(component, 'initSelectButtonsData').and.callThrough();

    spectator.setInput('charList', [...sonderzeichenListe]);
    render();

    expect(spy).toHaveBeenCalled();
    expect(component.leftViewData).toBeTruthy();
  });

  sonderzeichenListe.forEach((zeichen: Zeichenobjekt) => {
    it(`should emit the chosen character ${zeichen.zeichen} after button press`, () => {
      const button = spectator.query('.lower-right-panel button') as HTMLButtonElement;
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
    const button = spectator.query('.lower-right-panel button') as HTMLButtonElement;
    const insertLabel = mockWidgetsConfigService.getTranslation('inputChar.insert') ?? '';
    expect(button.innerHTML).toContain(insertLabel);
  });

  bases.forEach((grundzeichen: string) => {
    it(`should show only characters with a selected base ${grundzeichen}`, () => {
      const headerBaseChars = mockWidgetsConfigService.getTranslation('inputChar.headerBaseChars') ?? '';

      component.onSelection({group: headerBaseChars, value: grundzeichen});

      expect(component.displayedCharacters.length).toBeGreaterThan(0);
      for (const char of component.displayedCharacters) {
        expect(char.grundzeichen === '' ? '*' : char.grundzeichen).toEqual(grundzeichen);
      }
    });

    it(`should show all characters with a selected base ${grundzeichen}`, () => {
      const headerBaseChars = mockWidgetsConfigService.getTranslation('inputChar.headerBaseChars') ?? '';

      component.onSelection({group: headerBaseChars, value: grundzeichen});

      expect(component.displayedCharacters.length).toEqual(
        sonderzeichenListe.filter((char) => (char.grundzeichen === '' ? '*' : char.grundzeichen) === grundzeichen)
          .length
      );
    });
  });

  groups.forEach((schriftzeichengruppe: Schriftzeichengruppe) => {
    it(`should show only characters with a selected schriftzeichengruppe ${schriftzeichengruppe}`, () => {
      const headerGroups = mockWidgetsConfigService.getTranslation('inputChar.headerGroups') ?? '';

      component.onSelection({group: headerGroups, value: String(schriftzeichengruppe)});

      expect(component.displayedCharacters.length).toBeGreaterThan(0);
      for (const character of component.displayedCharacters) {
        expect(character.schriftzeichengruppe).toEqual(schriftzeichengruppe);
      }
    });

    it(`should show all characters with a selected schriftzeichengruppe ${schriftzeichengruppe}`, () => {
      const headerGroups = mockWidgetsConfigService.getTranslation('inputChar.headerGroups') ?? '';

      component.onSelection({group: headerGroups, value: String(schriftzeichengruppe)});

      expect(component.displayedCharacters.length).toEqual(
        sonderzeichenListe.filter((char) => char.schriftzeichengruppe === schriftzeichengruppe).length
      );
    });
  });
});

describe('Integration Tests: InputCharDialogComponent', () => {
  const createComponent = createComponentFactory({
    component: InputCharDialogComponent,
    imports: [AccordionModule, SelectButtonModule, FormsModule, InputCharPreviewComponent, MultiSelectButtonComponent],
    providers: [WidgetsConfigService, CharacterService]
  });

  beforeEach(() => {
    spectator = createComponent();
    fixture = spectator.fixture;
    spectator.setInput('charList', sonderzeichenListe);
    spectator.detectChanges();
  });

  const selectOption = (selector: string, value: string): void => {
    const optionButton = fixture.debugElement
      .queryAll(By.css(selector))
      .find((elem) => (elem.nativeElement.textContent ?? '').trim() === value)?.nativeElement as HTMLElement;
    expect(optionButton).toBeTruthy();

    optionButton.click();
    fixture.detectChanges();
  };

  const selectSchriftzeichengruppe = (schriftzeichengruppe: Schriftzeichengruppe): void => {
    selectOption('.charset-selectbutton--1 p-togglebutton', String(schriftzeichengruppe));
  };

  const selectBasis = (basis: string): void => {
    selectOption('.charset-selectbutton--0 p-togglebutton', basis);
  };

  it(`should show ${bases.length} available bases`, () => {
    const baseButtons = spectator.queryAll('.charset-selectbutton--0 p-togglebutton');
    expect(baseButtons.length).toEqual(bases.length);
  });

  it(`should show ${groups.length} available groups`, () => {
    const groupButtons = spectator.queryAll('.charset-selectbutton--1 p-togglebutton');
    expect(groupButtons.length).toEqual(groups.length);
  });

  bases.forEach((base: string) => {
    it(`should show only characters with a selected base ${base}`, () => {
      selectBasis(base);

      const charactersSelectButton = fixture.debugElement.query(
        By.css('.right-panel-side p-selectbutton')
      ).componentInstance;
      const options = charactersSelectButton.options;

      expect(options).toBeTruthy();
      for (const char of options) {
        expect(char.grundzeichen === '' ? '*' : char.grundzeichen).toEqual(base);
      }
    });

    it(`should show all characters with a selected base ${base}`, () => {
      selectBasis(base);
      const charactersSelectButton = fixture.debugElement.query(
        By.css('.right-panel-side p-selectbutton')
      ).componentInstance;
      expect(charactersSelectButton.options.length).toEqual(
        sonderzeichenListe.filter((char) => (char.grundzeichen === '' ? '*' : char.grundzeichen) === base).length
      );
    });
  });

  groups.forEach((schriftzeichengruppe: Schriftzeichengruppe) => {
    it(`should show only characters with a selected schriftzeichengruppe ${schriftzeichengruppe}`, () => {
      selectSchriftzeichengruppe(schriftzeichengruppe);

      const charactersSelectButton = fixture.debugElement.query(
        By.css('.right-panel-side p-selectbutton')
      ).componentInstance;
      const options = charactersSelectButton.options;

      expect(options).toBeTruthy();
      for (const character of options) {
        expect(character.schriftzeichengruppe).toEqual(schriftzeichengruppe);
      }
    });

    it(`should show all characters with a selected schriftzeichengruppe ${schriftzeichengruppe}`, () => {
      selectSchriftzeichengruppe(schriftzeichengruppe);

      const charactersSelectButton = fixture.debugElement.query(
        By.css('.right-panel-side p-selectbutton')
      ).componentInstance;
      expect(charactersSelectButton.options.length).toEqual(
        sonderzeichenListe.filter((char) => char.schriftzeichengruppe === schriftzeichengruppe).length
      );
    });
  });
});
