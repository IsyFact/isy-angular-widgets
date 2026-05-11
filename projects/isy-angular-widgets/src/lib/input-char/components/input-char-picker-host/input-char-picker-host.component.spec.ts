import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {fakeAsync, tick} from '@angular/core/testing';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {DialogModule} from 'primeng/dialog';
import {InputCharPickerHostComponent} from './input-char-picker-host.component';
import {InputCharPickerService} from '../../services/input-char-picker.service';
import {CharacterService} from '../../services/character.service';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {Datentyp} from '../../model/datentyp';
import {InputCharPickerState} from '../../model/input-char-picker.model';
import {Zeichenobjekt} from '../../model/model';

@Component({
  standalone: true,
  selector: 'isy-input-char-dialog',
  template: ''
})
class InputCharDialogStubComponent {
  @Input() charList: Zeichenobjekt[] = [];

  @Output() insertCharacter = new EventEmitter<string>();
}

describe('Unit Tests: InputCharPickerHostComponent', () => {
  let spectator: Spectator<InputCharPickerHostComponent>;

  const visible = signal(false);

  const state = signal<InputCharPickerState | undefined>(undefined);

  const pickerServiceMock = {
    visible,
    state,
    close: jasmine.createSpy('close'),
    finishClose: jasmine.createSpy('finishClose'),
    insertCharacter: jasmine.createSpy('insertCharacter')
  };

  const charServiceSpy = jasmine.createSpyObj<CharacterService>('CharacterService', ['getCharactersByDataType']);

  const configServiceSpy = jasmine.createSpyObj<WidgetsConfigService>('WidgetsConfigService', ['getTranslation']);

  /**
   * Creates a picker state with default values and applies optional overrides.
   * @param overrides Partial state overrides
   * @returns InputCharPickerState with defaults and overrides applied
   */
  function createPickerState(overrides: Partial<InputCharPickerState> = {}): InputCharPickerState {
    return {
      datentyp: Datentyp.DATENTYP_C,
      triggerElement: document.createElement('button'),
      width: '740px',
      height: '460px',
      header: undefined,
      closable: true,
      draggable: true,
      resizable: false,
      dismissableMask: false,
      closeOnEscape: true,
      modal: false,
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

    pickerServiceMock.close.calls.reset();
    pickerServiceMock.finishClose.calls.reset();
    pickerServiceMock.insertCharacter.calls.reset();

    charServiceSpy.getCharactersByDataType.calls.reset();
    charServiceSpy.getCharactersByDataType.and.returnValue([]);

    configServiceSpy.getTranslation.calls.reset();
    configServiceSpy.getTranslation.and.callFake((key: string) => key);

    spectator = createComponent();
    render();
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

    spyOnProperty(button, 'isConnected', 'get').and.returnValue(true);

    const currentState = createPickerState({
      triggerElement: button
    });

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

    spyOnProperty(button, 'isConnected', 'get').and.returnValue(true);

    visible.set(true);
    state.set(
      createPickerState({
        triggerElement: button
      })
    );

    spectator.component.onDialogClose();
    render();
    tick();

    expect(focusSpy).not.toHaveBeenCalled();
  }));

  it('should not restore focus when the trigger element is no longer connected', fakeAsync(() => {
    const button = document.createElement('button');
    const focusSpy = spyOn(button, 'focus');

    spyOnProperty(button, 'isConnected', 'get').and.returnValue(false);

    visible.set(true);
    state.set(
      createPickerState({
        triggerElement: button
      })
    );

    spectator.component.onDialogClose();
    render();
    tick();

    expect(focusSpy).not.toHaveBeenCalled();
  }));

  it('should render the dialog only when a picker state exists', () => {
    expect(spectator.query('p-dialog')).toBeFalsy();

    state.set(createPickerState());
    visible.set(true);

    render();

    expect(spectator.query('p-dialog')).toBeTruthy();
  });
});
