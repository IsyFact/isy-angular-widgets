import {InputCharDialogComponent} from './input-char-dialog.component';
import {By} from '@angular/platform-browser';
import {InputCharSelection, Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {SelectButtonModule} from 'primeng/selectbutton';
import {AccordionModule} from 'primeng/accordion';
import {createComponentFactory, Spectator, SpyObject} from '@ngneat/spectator';
import {FormsModule} from '@angular/forms';
import {InputCharPreviewComponent} from '../input-char-preview/input-char-preview.component';
import {ComponentFixture} from '@angular/core/testing';
import {MultiSelectButtonComponent} from '../multi-select-button/multi-select-button.component';
import {InputCharGridComponent} from '../input-char-grid/input-char-grid.component';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {CharacterService} from '../../services/character.service';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

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

  @Input() value: InputCharSelection | undefined;

  @Input() resetKey = 0;

  @Output() valueChange = new EventEmitter<InputCharSelection | undefined>();
}

let spectator: Spectator<InputCharDialogComponent>;
let mockWidgetsConfigService: SpyObject<WidgetsConfigService>;
let fixture: ComponentFixture<InputCharDialogComponent>;

const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];
const bases = [...new Set(sonderzeichenListe.map((item) => (item.grundzeichen === '' ? '*' : item.grundzeichen)))];
const groups = [...new Set(sonderzeichenListe.map((item) => item.schriftzeichengruppe))];

let headerBaseChars$: BehaviorSubject<string>;
let headerGroups$: BehaviorSubject<string>;

const translations: Record<string, string> = {
  'inputChar.headerBaseChars': 'Basis',
  'inputChar.headerGroups': 'Gruppen',
  'inputChar.insert': 'Einfügen',
  'inputChar.headerAllCharacters': 'Alle'
};

/**
 * Picks a small sample from an array (up to `max` elements).
 *
 * - If `arr.length <= max`, a shallow copy of the array is returned.
 * - Otherwise, the **first**, **middle**, and **last** elements are prioritized
 *   and then filled up with additional elements from the beginning of the array
 *   until `max` elements are reached.
 *
 * Note: The resulting order is `[first, middle, last, ...extras]`
 * and is finally truncated to `max` elements.
 * @template T - The element type of the array.
 * @param arr - The source array to sample from.
 * @param max - The maximum number of elements in the sample (default: `8`).
 * @returns A new array containing up to `max` elements as a representative sample.
 * @example pickSample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5); -> [1, 6, 10, 2, 3]
 * @example pickSample(["a", "b", "c"], 8); -> ["a", "b", "c"]
 */
function pickSample<T>(arr: T[], max = 8): T[] {
  if (arr.length <= max) return [...arr];

  const first = arr[0];
  const last = arr.at(-1) as T;
  const middle = arr[Math.floor(arr.length / 2)];
  const extras = arr.slice(1, Math.min(arr.length - 1, max - 3));

  return [first, middle, last, ...extras].slice(0, max);
}

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
    translations['inputChar.headerBaseChars'] = 'Basis';
    translations['inputChar.headerGroups'] = 'Gruppen';
    translations['inputChar.insert'] = 'Einfügen';
    translations['inputChar.headerAllCharacters'] = 'Alle';

    headerBaseChars$ = new BehaviorSubject<string>(translations['inputChar.headerBaseChars']);
    headerGroups$ = new BehaviorSubject<string>(translations['inputChar.headerGroups']);

    spectator = createComponent();
    component = spectator.component;
    fixture = spectator.fixture;
    mockWidgetsConfigService = spectator.inject(WidgetsConfigService);

    mockWidgetsConfigService.getTranslation.and.callFake((key: string) => translations[key] ?? key);

    mockWidgetsConfigService.getTranslation$.and.callFake((key: string) => {
      if (key === 'inputChar.headerBaseChars') {
        return headerBaseChars$.asObservable();
      }

      if (key === 'inputChar.headerGroups') {
        return headerGroups$.asObservable();
      }

      return new BehaviorSubject<string>(translations[key] ?? key).asObservable();
    });

    spectator.setInput('charList', sonderzeichenListe);
    render();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onAllSelection for unexpected selection values', () => {
    const onAllSelectionSpy = spyOn(component, 'onAllSelection').and.callThrough();

    component.onSelection({group: 'unexpectedGroup', value: 'unexpectedValue'} as unknown as InputCharSelection);

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
    expect(component.leftViewData.baseChars.values.length).toBeGreaterThan(0);
    expect(component.leftViewData.groups.values.length).toBeGreaterThan(0);
  });

  it('should rebuild leftViewData labels when translations change', () => {
    expect(component.leftViewData.baseChars.label).toBe('Basis');
    expect(component.leftViewData.groups.label).toBe('Gruppen');

    translations['inputChar.headerBaseChars'] = 'Base characters';
    translations['inputChar.headerGroups'] = 'Groups';

    headerBaseChars$.next('Base characters');
    headerGroups$.next('Groups');

    render();

    expect(component.leftViewData.baseChars.label).toBe('Base characters');
    expect(component.leftViewData.groups.label).toBe('Groups');
    expect(component.leftViewData.baseChars.values).toEqual(component.grundZeichenListe);
    expect(component.leftViewData.groups.values).toEqual(component.schriftZeichenGruppen);
  });

  it('should keep the displayed characters when translations change', () => {
    const base = bases.find((value) => value !== '*') ?? bases[0];

    component.onGrundzeichenSelection(base);
    const selectedCharacters = component.displayedCharacters;

    translations['inputChar.headerBaseChars'] = 'Base characters';
    translations['inputChar.headerGroups'] = 'Groups';

    headerBaseChars$.next('Base characters');
    headerGroups$.next('Groups');

    render();

    expect(component.displayedCharacters).toBe(selectedCharacters);
  });

  it('should emit selectionChange when a selection is made', () => {
    const selectionChangeSpy = spyOn(component.selectionChange, 'emit');
    const selection: InputCharSelection = {group: 'baseChars', value: 'A'};

    component.onSelection(selection);

    expect(selectionChangeSpy).toHaveBeenCalledWith(selection);
    expect(component.selection).toEqual(selection);
  });

  it('should apply selection input when selection changes', () => {
    const selection: InputCharSelection = {group: 'baseChars', value: 'A'};

    spectator.setInput('selection', selection);
    render();

    expect(component.selection).toEqual(selection);

    for (const char of component.displayedCharacters) {
      expect(char.grundzeichen === '' ? '*' : char.grundzeichen).toEqual('A');
    }
  });

  it('should reset selected character to first entry when selection changes', () => {
    const selection: InputCharSelection = {group: 'baseChars', value: 'A'};

    spectator.setInput('selection', selection);
    render();

    expect(component.selectedZeichenObjekt).toEqual(component.displayedCharacters[0]);
  });

  it('should emit selectedCharacterChange when selected character changes', () => {
    const selectedCharacterChangeSpy = spyOn(component.selectedCharacterChange, 'emit');
    const selectedZeichenObjekt = sonderzeichenListe[0];

    component.onSelectedZeichenObjektChange(selectedZeichenObjekt);

    expect(component.selectedZeichenObjekt).toBe(selectedZeichenObjekt);
    expect(selectedCharacterChangeSpy).toHaveBeenCalledWith(selectedZeichenObjekt.zeichen);
  });

  it('should emit undefined when selected character is cleared', () => {
    const selectedCharacterChangeSpy = spyOn(component.selectedCharacterChange, 'emit');

    component.onSelectedZeichenObjektChange(undefined);

    expect(component.selectedZeichenObjekt).toBeUndefined();
    expect(selectedCharacterChangeSpy).toHaveBeenCalledWith(undefined);
  });

  it('should restore selected character when selectedCharacter input changes', () => {
    const selectedZeichenObjekt = sonderzeichenListe.find((item) => item.grundzeichen === 'A');

    expect(selectedZeichenObjekt).toBeTruthy();

    spectator.setInput('selectedCharacter', selectedZeichenObjekt!.zeichen);
    render();

    expect(component.selectedZeichenObjekt).toEqual(selectedZeichenObjekt);
  });

  it('should keep first displayed character when selectedCharacter does not exist in displayed characters', () => {
    const firstCharacter = component.displayedCharacters[0];

    spectator.setInput('selectedCharacter', 'not-existing-character');
    render();

    expect(component.selectedZeichenObjekt).toEqual(firstCharacter);
  });

  it('should emit chosen characters (sample) after insertSelectedZeichen', () => {
    const insertCharacterSpy = spyOn(component.insertCharacter, 'emit');
    const sample = pickSample(sonderzeichenListe, 10);

    for (const zeichen of sample) {
      component.selectedZeichenObjekt = zeichen;
      component.insertSelectedZeichen();
      expect(insertCharacterSpy).toHaveBeenCalledWith(zeichen.zeichen);
    }
  });

  it('should have a button with the insert label', () => {
    const button = spectator.query('.lower-right-panel button') as HTMLButtonElement;
    const insertLabel = mockWidgetsConfigService.getTranslation('inputChar.insert') ?? '';

    expect(button).toBeTruthy();
    expect(button.innerHTML).toContain(insertLabel);
  });

  it('should filter characters correctly by base (all bases in one spec)', () => {
    for (const grundzeichen of bases) {
      component.onSelection({group: 'baseChars', value: grundzeichen});

      const expected = sonderzeichenListe.filter(
        (char) => (char.grundzeichen === '' ? '*' : char.grundzeichen) === grundzeichen
      );

      expect(component.displayedCharacters.length).toEqual(expected.length);

      for (const char of component.displayedCharacters) {
        expect(char.grundzeichen === '' ? '*' : char.grundzeichen).toEqual(grundzeichen);
      }
    }
  });

  it('should filter characters correctly by schriftzeichengruppe (all groups in one spec)', () => {
    for (const schriftzeichengruppe of groups) {
      component.onSelection({group: 'groups', value: schriftzeichengruppe});

      const expected = sonderzeichenListe.filter((char) => char.schriftzeichengruppe === schriftzeichengruppe);

      expect(component.displayedCharacters.length).toEqual(expected.length);

      for (const character of component.displayedCharacters) {
        expect(character.schriftzeichengruppe).toEqual(schriftzeichengruppe);
      }
    }
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

  it('should filter characters by a few representative bases (integration)', () => {
    const sampleBases = pickSample(bases, 3);

    for (const base of sampleBases) {
      selectBasis(base);

      const grid = fixture.debugElement.query(By.css('isy-input-char-grid'))
        .componentInstance as InputCharGridComponent;

      expect(grid.characters).toBeTruthy();

      const expected = sonderzeichenListe.filter(
        (char) => (char.grundzeichen === '' ? '*' : char.grundzeichen) === base
      );

      expect(grid.characters.length).toEqual(expected.length);

      for (const char of grid.characters) {
        expect(char.grundzeichen === '' ? '*' : char.grundzeichen).toEqual(base);
      }
    }
  });

  it('should filter characters by a few representative groups (integration)', () => {
    const sampleGroups = pickSample(groups, 3);

    for (const group of sampleGroups) {
      selectSchriftzeichengruppe(group);

      const grid = fixture.debugElement.query(By.css('isy-input-char-grid'))
        .componentInstance as InputCharGridComponent;

      expect(grid.characters).toBeTruthy();

      const expected = sonderzeichenListe.filter((char) => char.schriftzeichengruppe === group);

      expect(grid.characters.length).toEqual(expected.length);

      for (const character of grid.characters) {
        expect(character.schriftzeichengruppe).toEqual(group);
      }
    }
  });

  describe('ESC focus return (FR-7)', () => {
    const filterHeaders = (): HTMLElement[] =>
      Array.from(spectator.element.querySelectorAll<HTMLElement>('p-accordion-header'));

    const makeEsc = (): KeyboardEvent => {
      const event = new KeyboardEvent('keydown', {key: 'Escape', cancelable: true, bubbles: true});
      spyOn(event, 'preventDefault').and.callThrough();
      spyOn(event, 'stopPropagation').and.callThrough();

      return event;
    };

    it('returns focus to the last focused filter header and keeps the dialog open', () => {
      const headers = filterHeaders();
      expect(headers.length).toBeGreaterThan(1);

      const firstHeader = headers[0];
      const lastHeader = headers[headers.length - 1];
      const firstFocusSpy = spyOn(firstHeader, 'focus');
      const lastFocusSpy = spyOn(lastHeader, 'focus');

      // Focus had last entered the FIRST header before leaving the filter.
      firstHeader.dispatchEvent(new FocusEvent('focusin', {bubbles: true}));

      const event = makeEsc();
      spectator.component.onGridEscape(event);

      expect(firstFocusSpy).toHaveBeenCalled();
      expect(lastFocusSpy).not.toHaveBeenCalled();
      // E8: closeOnEscape is suppressed via preventDefault + stopPropagation.
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('falls back to a filter header when the grid was entered without prior filter focus', () => {
      const headers = filterHeaders();
      const lastHeader = headers[headers.length - 1];
      const focusSpy = spyOn(lastHeader, 'focus');

      const event = makeEsc();
      spectator.component.onGridEscape(event);

      // No section is expanded by default -> last header in DOM order (FR-7.4 c).
      expect(focusSpy).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('lets the dialog close (default) when no focusable filter header exists', () => {
      filterHeaders().forEach((header) => header.remove());

      const event = makeEsc();
      spectator.component.onGridEscape(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
    });

    it('suppresses the event end-to-end when the grid emits its escape output', () => {
      const grid = fixture.debugElement.query(By.css('isy-input-char-grid'))
        .componentInstance as InputCharGridComponent;

      const event = makeEsc();
      grid.escape.emit(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    const escFrom = (element: HTMLElement): KeyboardEvent => {
      const event = makeEsc();
      Object.defineProperty(event, 'target', {value: element});

      return event;
    };

    it('returns focus from a filter value to its accordion header on ESC (left panel)', () => {
      const value = spectator.element.querySelector('.charset-selectbutton--0 p-togglebutton') as HTMLElement;
      expect(value).toBeTruthy();

      const header = value.closest('p-accordion-panel')?.querySelector('p-accordion-header') as HTMLElement;
      const focusSpy = spyOn(header, 'focus');

      const event = escFrom(value);
      spectator.component.onFilterEscape(event);

      expect(focusSpy).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('lets ESC close the dialog when focus is on an accordion header (left panel)', () => {
      const event = escFrom(filterHeaders()[0]);

      spectator.component.onFilterEscape(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
    });

    it('lets ESC close the dialog when focus is on a value outside any accordion section', () => {
      // A filter value (toggle button) that is not nested inside an accordion panel.
      const detachedValue = document.createElement('p-togglebutton');

      const event = escFrom(detachedValue);
      spectator.component.onFilterEscape(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
    });
  });

  describe('focus jump into the grid after a filter selection', () => {
    it('moves focus into the grid when a filter value is activated via keyboard', async () => {
      const grid = spectator.component.gridComponent!;
      const focusSpy = spyOn(grid, 'focusActiveCell');
      const toggle = spectator.element.querySelector('p-togglebutton') as HTMLElement;

      expect(toggle).toBeTruthy();

      spectator.component.onFilterItemActivate(toggle);
      spectator.detectChanges();
      await spectator.fixture.whenStable();

      expect(focusSpy).toHaveBeenCalled();
    });

    it('does not move focus into the grid when an accordion header is toggled', async () => {
      const grid = spectator.component.gridComponent!;
      const focusSpy = spyOn(grid, 'focusActiveCell');
      const header = spectator.element.querySelector('p-accordion-header') as HTMLElement;

      expect(header).toBeTruthy();

      spectator.component.onFilterItemActivate(header);
      spectator.detectChanges();
      await spectator.fixture.whenStable();

      expect(focusSpy).not.toHaveBeenCalled();
    });
  });
});
