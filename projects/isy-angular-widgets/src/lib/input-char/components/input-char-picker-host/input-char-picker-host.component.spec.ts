import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {fakeAsync, tick} from '@angular/core/testing';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {DialogModule} from 'primeng/dialog';
import {InputCharPickerHostComponent} from './input-char-picker-host.component';
import {InputCharPickerService} from '../../services/input-char-picker.service';
import {CharacterService} from '../../services/character.service';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {Datentyp} from '../../model/datentyp';
import type {InputCharPickerState} from '../../model/input-char-picker.model';
import {InputCharSelection, Zeichenobjekt} from '../../model/model';

@Component({
  standalone: true,
  selector: 'isy-input-char-dialog',
  template: ''
})
class InputCharDialogStubComponent {
  @Input() charList: Zeichenobjekt[] = [];

  @Input() resetKey = 0;

  @Input() selection: InputCharSelection | undefined;

  @Input() selectedCharacter: string | undefined;

  @Output() insertCharacter = new EventEmitter<string>();

  @Output() selectionChange = new EventEmitter<InputCharSelection | undefined>();

  @Output() selectedCharacterChange = new EventEmitter<string | undefined>();
}

let visibleRectSourceElement: HTMLElement | undefined;

/**
 * Returns a DOMRectList with at least one rect.
 * @returns A visible DOMRectList.
 */
function createVisibleDomRectList(): DOMRectList {
  visibleRectSourceElement?.remove();

  visibleRectSourceElement = document.createElement('div');
  visibleRectSourceElement.style.position = 'fixed';
  visibleRectSourceElement.style.left = '0';
  visibleRectSourceElement.style.top = '0';
  visibleRectSourceElement.style.width = '10px';
  visibleRectSourceElement.style.height = '10px';
  visibleRectSourceElement.style.visibility = 'visible';
  visibleRectSourceElement.style.display = 'block';

  document.body.appendChild(visibleRectSourceElement);

  return visibleRectSourceElement.getClientRects();
}

/**
 * Returns an empty DOMRectList.
 * @returns An empty DOMRectList.
 */
function createEmptyDomRectList(): DOMRectList {
  return document.createElement('div').getClientRects();
}

/**
 * Removes the temporary element used to create a visible DOMRectList.
 */
function cleanupVisibleDomRectSourceElement(): void {
  visibleRectSourceElement?.remove();
  visibleRectSourceElement = undefined;
}

/**
 * Mocks an element as connected and visible.
 * @param element The element to mock.
 */
function mockElementAvailable(element: HTMLElement): void {
  spyOnProperty(element, 'isConnected', 'get').and.returnValue(true);
  spyOn(element, 'getClientRects').and.returnValue(createVisibleDomRectList());
  element.style.visibility = 'visible';
}

/**
 * Mocks an element as connected but not visible.
 * @param element The element to mock.
 */
function mockElementUnavailable(element: HTMLElement): void {
  spyOnProperty(element, 'isConnected', 'get').and.returnValue(true);
  spyOn(element, 'getClientRects').and.returnValue(createEmptyDomRectList());
  element.style.visibility = 'visible';
}

describe('Unit Tests: InputCharPickerHostComponent', () => {
  let spectator: Spectator<InputCharPickerHostComponent>;

  const visible = signal(false);

  const state = signal<InputCharPickerState | undefined>(undefined);

  let triggerElement: HTMLElement | undefined;

  const pickerServiceMock = {
    visible,
    state,
    close: jasmine.createSpy('close'),
    finishClose: jasmine.createSpy('finishClose'),
    insertCharacter: jasmine.createSpy('insertCharacter'),
    updateSelection: jasmine.createSpy('updateSelection'),
    updateSelectedCharacter: jasmine.createSpy('updateSelectedCharacter'),
    getTriggerElement: jasmine.createSpy('getTriggerElement').and.callFake(() => triggerElement)
  };

  const charServiceSpy = jasmine.createSpyObj<CharacterService>('CharacterService', ['getCharactersByDataType']);

  const configServiceSpy = jasmine.createSpyObj<WidgetsConfigService>('WidgetsConfigService', ['getTranslation']);

  /**
   * Creates a picker state with default values and applies optional overrides.
   * @param overrides Partial state overrides.
   * @returns InputCharPickerState with defaults and overrides applied.
   */
  function createPickerState(overrides: Partial<InputCharPickerState> = {}): InputCharPickerState {
    return {
      datentyp: Datentyp.DATENTYP_C,
      width: '740px',
      height: '460px',
      header: undefined,
      closable: true,
      draggable: true,
      resizable: false,
      dismissableMask: false,
      closeOnEscape: true,
      modal: false,
      resetKey: 1,
      selection: undefined,
      selectedCharacter: undefined,
      ...overrides
    };
  }

  const createComponent = createComponentFactory({
    component: InputCharPickerHostComponent,
    detectChanges: false,
    overrideComponents: [
      [
        InputCharPickerHostComponent,
        {
          set: {
            imports: [DialogModule, InputCharDialogStubComponent]
          }
        }
      ]
    ],
    providers: [
      {provide: InputCharPickerService, useValue: pickerServiceMock},
      {provide: CharacterService, useValue: charServiceSpy},
      {provide: WidgetsConfigService, useValue: configServiceSpy}
    ]
  });

  const render = (): void => spectator.fixture.detectChanges(false);

  beforeEach(() => {
    visible.set(false);
    state.set(undefined);
    triggerElement = undefined;

    pickerServiceMock.close.calls.reset();
    pickerServiceMock.finishClose.calls.reset();
    pickerServiceMock.insertCharacter.calls.reset();
    pickerServiceMock.updateSelection.calls.reset();
    pickerServiceMock.updateSelectedCharacter.calls.reset();
    pickerServiceMock.getTriggerElement.calls.reset();
    pickerServiceMock.getTriggerElement.and.callFake(() => triggerElement);

    charServiceSpy.getCharactersByDataType.calls.reset();
    charServiceSpy.getCharactersByDataType.and.returnValue([]);

    configServiceSpy.getTranslation.calls.reset();
    configServiceSpy.getTranslation.and.callFake((key: string) => key);

    spectator = createComponent();
    render();
  });

  afterEach(() => {
    cleanupVisibleDomRectSourceElement();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should return an empty character list when no picker state exists', () => {
    expect(spectator.component.allCharacters()).toEqual([]);
    expect(charServiceSpy.getCharactersByDataType).not.toHaveBeenCalled();
  });

  it('should load characters for the current picker state datatype', () => {
    const characters = [{zeichen: 'Ä'}] as Zeichenobjekt[];

    charServiceSpy.getCharactersByDataType.and.returnValue(characters);

    state.set(createPickerState({datentyp: Datentyp.DATENTYP_C}));

    render();

    expect(spectator.component.allCharacters()).toBe(characters);
    expect(charServiceSpy.getCharactersByDataType).toHaveBeenCalledWith(Datentyp.DATENTYP_C);
  });

  it('should update the character list when the picker state datatype changes', () => {
    const charactersForA = [{zeichen: 'À'}] as Zeichenobjekt[];
    const charactersForC = [{zeichen: 'Ç'}] as Zeichenobjekt[];

    charServiceSpy.getCharactersByDataType.and.callFake((datentyp: Datentyp) => {
      if (datentyp === Datentyp.DATENTYP_A) {
        return charactersForA;
      }

      return charactersForC;
    });

    state.set(createPickerState({datentyp: Datentyp.DATENTYP_A}));
    render();

    expect(spectator.component.allCharacters()).toBe(charactersForA);

    state.set(createPickerState({datentyp: Datentyp.DATENTYP_C}));
    render();

    expect(spectator.component.allCharacters()).toBe(charactersForC);
    expect(charServiceSpy.getCharactersByDataType).toHaveBeenCalledWith(Datentyp.DATENTYP_A);
    expect(charServiceSpy.getCharactersByDataType).toHaveBeenCalledWith(Datentyp.DATENTYP_C);
  });

  it('should delegate inserted characters to the picker service', () => {
    spectator.component.insertCharacter('Ä');

    expect(pickerServiceMock.insertCharacter).toHaveBeenCalledWith('Ä');
  });

  it('should delegate selection updates to the picker service', () => {
    const selection: InputCharSelection = {group: 'baseChars', value: 'A'};

    spectator.component.updateSelection(selection);

    expect(pickerServiceMock.updateSelection).toHaveBeenCalledWith(selection);
  });

  it('should delegate selected character updates to the picker service', () => {
    spectator.component.updateSelectedCharacter('Ä');

    expect(pickerServiceMock.updateSelectedCharacter).toHaveBeenCalledWith('Ä');
  });

  it('should delegate cleared selected character updates to the picker service', () => {
    spectator.component.updateSelectedCharacter(undefined);

    expect(pickerServiceMock.updateSelectedCharacter).toHaveBeenCalledWith(undefined);
  });

  it('should close the picker when the dialog closes', () => {
    const currentState = createPickerState();

    visible.set(true);
    state.set(currentState);

    spectator.component.onDialogClose();

    expect(pickerServiceMock.close).toHaveBeenCalled();
    expect(pickerServiceMock.finishClose).toHaveBeenCalledWith(currentState);
  });

  it('should restore focus to the trigger button when the dialog closes', fakeAsync(() => {
    const button = document.createElement('button');
    const focusSpy = spyOn(button, 'focus');

    mockElementAvailable(button);

    triggerElement = button;

    const currentState = createPickerState();

    visible.set(true);
    state.set(currentState);

    spectator.component.onDialogClose();
    render();
    tick();

    expect(focusSpy).toHaveBeenCalled();
    expect(pickerServiceMock.close).toHaveBeenCalled();
    expect(pickerServiceMock.finishClose).toHaveBeenCalledWith(currentState);
  }));

  it('should not restore focus when the trigger button is disabled', fakeAsync(() => {
    const button = document.createElement('button');
    button.disabled = true;

    const focusSpy = spyOn(button, 'focus');

    mockElementAvailable(button);

    triggerElement = button;

    visible.set(true);
    state.set(createPickerState());

    spectator.component.onDialogClose();
    render();
    tick();

    expect(focusSpy).not.toHaveBeenCalled();
  }));

  it('should not restore focus when the trigger element is no longer connected', fakeAsync(() => {
    const button = document.createElement('button');
    const focusSpy = spyOn(button, 'focus');

    spyOnProperty(button, 'isConnected', 'get').and.returnValue(false);

    triggerElement = button;

    visible.set(true);
    state.set(createPickerState());

    spectator.component.onDialogClose();
    render();
    tick();

    expect(focusSpy).not.toHaveBeenCalled();
  }));

  it('should close the picker after a document click when the trigger element is no longer visible', fakeAsync(() => {
    const button = document.createElement('button');
    const currentState = createPickerState();

    mockElementUnavailable(button);

    triggerElement = button;

    visible.set(true);
    state.set(currentState);

    spectator.component.onDocumentClick();
    tick();

    expect(pickerServiceMock.close).toHaveBeenCalled();
    expect(pickerServiceMock.finishClose).toHaveBeenCalledWith(currentState);
  }));

  it('should close the picker after a document click when the trigger element is missing', fakeAsync(() => {
    const currentState = createPickerState();

    triggerElement = undefined;

    visible.set(true);
    state.set(currentState);

    spectator.component.onDocumentClick();
    tick();

    expect(pickerServiceMock.close).toHaveBeenCalled();
    expect(pickerServiceMock.finishClose).toHaveBeenCalledWith(currentState);
  }));

  it('should not close the picker after a document click when the trigger element is still visible', fakeAsync(() => {
    const button = document.createElement('button');

    mockElementAvailable(button);

    triggerElement = button;

    visible.set(true);
    state.set(createPickerState());

    spectator.component.onDocumentClick();
    tick();

    expect(pickerServiceMock.close).not.toHaveBeenCalled();
    expect(pickerServiceMock.finishClose).not.toHaveBeenCalled();
  }));

  it('should not check the trigger element after a document click when the picker is not visible', fakeAsync(() => {
    visible.set(false);
    state.set(createPickerState());

    spectator.component.onDocumentClick();
    tick();

    expect(pickerServiceMock.getTriggerElement).not.toHaveBeenCalled();
    expect(pickerServiceMock.close).not.toHaveBeenCalled();
  }));

  it('should clear an existing trigger check timer before scheduling a new one', fakeAsync(() => {
    const button = document.createElement('button');
    const currentState = createPickerState();

    mockElementUnavailable(button);

    triggerElement = button;

    visible.set(true);
    state.set(currentState);

    spectator.component.onDocumentClick();
    spectator.component.onDocumentClick();

    tick();

    expect(pickerServiceMock.getTriggerElement).toHaveBeenCalledTimes(1);
    expect(pickerServiceMock.close).toHaveBeenCalledTimes(1);
    expect(pickerServiceMock.finishClose).toHaveBeenCalledTimes(1);
    expect(pickerServiceMock.finishClose).toHaveBeenCalledWith(currentState);
  }));

  it('should render the dialog only when a picker state exists', () => {
    expect(spectator.query('p-dialog')).toBeFalsy();

    state.set(createPickerState());
    visible.set(true);

    render();

    expect(spectator.query('p-dialog')).toBeTruthy();
  });

  it('should clear the pending trigger check timer on destroy', fakeAsync(() => {
    const button = document.createElement('button');

    mockElementUnavailable(button);

    triggerElement = button;

    visible.set(true);
    state.set(createPickerState());

    spectator.component.onDocumentClick();
    spectator.component.ngOnDestroy();

    tick();

    expect(pickerServiceMock.close).not.toHaveBeenCalled();
    expect(pickerServiceMock.finishClose).not.toHaveBeenCalled();
  }));
});
