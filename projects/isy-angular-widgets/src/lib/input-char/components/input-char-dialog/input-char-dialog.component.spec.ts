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
    const headerBaseChars = mockWidgetsConfigService.getTranslation('inputChar.headerBaseChars') ?? '';

    for (const grundzeichen of bases) {
      component.onSelection({group: headerBaseChars, value: grundzeichen});

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
    const headerGroups = mockWidgetsConfigService.getTranslation('inputChar.headerGroups') ?? '';

    for (const schriftzeichengruppe of groups) {
      component.onSelection({group: headerGroups, value: String(schriftzeichengruppe)});

      const expected = sonderzeichenListe.filter((char) => char.schriftzeichengruppe === schriftzeichengruppe);

      expect(component.displayedCharacters.length).toEqual(expected.length);
      for (const character of component.displayedCharacters) {
        expect(character.schriftzeichengruppe).toEqual(schriftzeichengruppe);
      }
    }
  });

  it('should create and setup MutationObserver in ngAfterViewInit', () => {
    expect(component.mutationObserver).toBeTruthy();
  });

  it('should observe DOM changes on the component element', () => {
    const observeSpy = jasmine.createSpy('observe');
    const disconnectSpy = jasmine.createSpy('disconnect');
    const MockMutationObserver = function (this: Record<string, unknown>, _cb: MutationCallback): void {
      this.observe = observeSpy;
      this.disconnect = disconnectSpy;
    };

    spyOn(globalThis, 'MutationObserver' as keyof typeof globalThis).and.callFake(
      MockMutationObserver as unknown as typeof MutationObserver
    );

    component.ngAfterViewInit();

    expect(observeSpy).toHaveBeenCalledWith(
      fixture.nativeElement,
      jasmine.objectContaining({
        subtree: true,
        characterData: true,
        childList: true
      })
    );
  });

  it('should call initSelectButtonsData when relevant mutations occur', (done) => {
    const initSelectButtonsDataSpy = spyOn(component, 'initSelectButtonsData');
    const testElement = document.createElement('div');
    fixture.nativeElement.appendChild(testElement);

    setTimeout(() => {
      expect(initSelectButtonsDataSpy).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('should ignore irrelevant mutations', (done) => {
    const initSelectButtonsDataSpy = spyOn(component, 'initSelectButtonsData');

    if (component.mutationObserver) {
      component.mutationObserver.disconnect();
      component.mutationObserver = new MutationObserver((mutations) => {
        const relevant = mutations.some(
          (m) =>
            m.type === 'characterData' ||
            (m.type === 'childList' && (m.addedNodes.length > 0 || m.removedNodes.length > 0))
        );
        if (!relevant) return;
      });

      component.mutationObserver.observe(fixture.nativeElement, {
        subtree: true,
        characterData: true,
        childList: true
      });
    }

    setTimeout(() => {
      expect(initSelectButtonsDataSpy).not.toHaveBeenCalled();
      done();
    }, 150);
  });

  it('should clear rebuild timer on ngOnDestroy', () => {
    const clearTimeoutSpy = spyOn(globalThis, 'clearTimeout');

    const testComponent = component as unknown as {rebuildTimer?: ReturnType<typeof setTimeout>};
    testComponent.rebuildTimer = setTimeout(() => {}, 999999);

    component.ngOnDestroy();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(testComponent.rebuildTimer).toBeUndefined();
  });

  it('should disconnect MutationObserver on ngOnDestroy', () => {
    const disconnectSpy = spyOn(component.mutationObserver!, 'disconnect');
    component.ngOnDestroy();
    expect(disconnectSpy).toHaveBeenCalled();
    expect(component.mutationObserver).toBeUndefined();
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

      const charactersSelectButton = fixture.debugElement.query(
        By.css('.right-panel-side p-selectbutton')
      ).componentInstance;
      expect(charactersSelectButton.options).toBeTruthy();

      const expected = sonderzeichenListe.filter(
        (char) => (char.grundzeichen === '' ? '*' : char.grundzeichen) === base
      );
      expect(charactersSelectButton.options.length).toEqual(expected.length);

      for (const char of charactersSelectButton.options) {
        expect(char.grundzeichen === '' ? '*' : char.grundzeichen).toEqual(base);
      }
    }
  });

  it('should filter characters by a few representative groups (integration)', () => {
    const sampleGroups = pickSample(groups, 3);

    for (const group of sampleGroups) {
      selectSchriftzeichengruppe(group);

      const charactersSelectButton = fixture.debugElement.query(
        By.css('.right-panel-side p-selectbutton')
      ).componentInstance;
      expect(charactersSelectButton.options).toBeTruthy();

      const expected = sonderzeichenListe.filter((char) => char.schriftzeichengruppe === group);
      expect(charactersSelectButton.options.length).toEqual(expected.length);

      for (const character of charactersSelectButton.options) {
        expect(character.schriftzeichengruppe).toEqual(group);
      }
    }
  });
});
