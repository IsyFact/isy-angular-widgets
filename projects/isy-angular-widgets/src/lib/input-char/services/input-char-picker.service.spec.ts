import {ApplicationRef} from '@angular/core';
import {createServiceFactory, SpectatorService} from '@ngneat/spectator';
import {InputCharPickerService} from './input-char-picker.service';
import {Datentyp} from '../model/datentyp';
import type {InputCharPickerOpenOptions} from '../model/input-char-picker.model';
import {CharacterService} from './character.service';
import {WidgetsConfigService} from '../../i18n/widgets-config.service';

/**
 * Retrieves all host elements for the input char picker component.
 * @returns A NodeList of all 'isy-input-char-picker-host' elements in the DOM.
 */
function getHostElements(): NodeListOf<Element> {
  return document.querySelectorAll('isy-input-char-picker-host');
}

describe('Unit Tests: InputCharPickerService', () => {
  let spectator: SpectatorService<InputCharPickerService>;
  let service: InputCharPickerService;

  const charServiceSpy = jasmine.createSpyObj<CharacterService>('CharacterService', ['getCharactersByDataType']);

  const configServiceSpy = jasmine.createSpyObj<WidgetsConfigService>('WidgetsConfigService', ['getTranslation']);

  /**
   * Creates InputCharPickerOpenOptions with default values and optional overrides.
   * @param overrides Optional partial overrides for the options.
   * @returns InputCharPickerOpenOptions with merged default and override values.
   */
  function createOpenOptions(overrides: Partial<InputCharPickerOpenOptions> = {}): InputCharPickerOpenOptions {
    return {
      datentyp: Datentyp.DATENTYP_C,
      triggerElement: document.createElement('button'),
      onInsert: jasmine.createSpy('onInsert'),
      ...overrides
    };
  }

  const createService = createServiceFactory({
    service: InputCharPickerService,
    providers: [
      {provide: CharacterService, useValue: charServiceSpy},
      {provide: WidgetsConfigService, useValue: configServiceSpy}
    ]
  });

  beforeEach(() => {
    charServiceSpy.getCharactersByDataType.calls.reset();
    charServiceSpy.getCharactersByDataType.and.returnValue([]);

    configServiceSpy.getTranslation.calls.reset();
    configServiceSpy.getTranslation.and.callFake((key: string) => key);

    spectator = createService();
    service = spectator.service;
  });

  afterEach(() => {
    service.ngOnDestroy();

    getHostElements().forEach((element) => element.remove());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be closed by default', () => {
    expect(service.visible()).toBeFalse();
    expect(service.state()).toBeUndefined();
  });

  it('should open the picker with default dialog configuration', async () => {
    const triggerElement = document.createElement('button');
    const onInsert = jasmine.createSpy('onInsert');

    await service.open(
      createOpenOptions({
        datentyp: Datentyp.DATENTYP_C,
        triggerElement,
        onInsert
      })
    );

    expect(service.visible()).toBeTrue();
    expect(service.state()).toEqual({
      datentyp: Datentyp.DATENTYP_C,
      triggerElement,
      width: '740px',
      height: '460px',
      header: undefined,
      closable: true,
      draggable: true,
      resizable: false,
      dismissableMask: false,
      closeOnEscape: true,
      modal: false
    });
  });

  it('should open the picker with custom dialog configuration', async () => {
    const triggerElement = document.createElement('button');

    await service.open(
      createOpenOptions({
        datentyp: Datentyp.DATENTYP_A,
        triggerElement,
        width: '900px',
        height: '600px',
        header: 'Custom header',
        closable: false,
        draggable: false,
        resizable: true,
        dismissableMask: true,
        closeOnEscape: false,
        modal: true
      })
    );

    expect(service.visible()).toBeTrue();
    expect(service.state()).toEqual({
      datentyp: Datentyp.DATENTYP_A,
      triggerElement,
      width: '900px',
      height: '600px',
      header: 'Custom header',
      closable: false,
      draggable: false,
      resizable: true,
      dismissableMask: true,
      closeOnEscape: false,
      modal: true
    });
  });

  it('should create the picker host component when opening the picker', async () => {
    expect(getHostElements().length).toBe(0);

    await service.open(createOpenOptions());

    expect(getHostElements().length).toBe(1);
  });

  it('should create the picker host component only once', async () => {
    await service.open(createOpenOptions());
    await service.open(createOpenOptions());

    expect(getHostElements().length).toBe(1);
  });

  it('should close the picker', async () => {
    await service.open(createOpenOptions());

    expect(service.visible()).toBeTrue();

    service.close();

    expect(service.visible()).toBeFalse();
  });

  it('should return true when the picker is open for the given trigger element', async () => {
    const triggerElement = document.createElement('button');

    await service.open(
      createOpenOptions({
        triggerElement
      })
    );

    expect(service.isOpenFor(triggerElement)).toBeTrue();
  });

  it('should return false when the picker is not open for the given trigger element', async () => {
    const triggerElement = document.createElement('button');
    const otherTriggerElement = document.createElement('button');

    await service.open(
      createOpenOptions({
        triggerElement
      })
    );

    expect(service.isOpenFor(otherTriggerElement)).toBeFalse();
  });

  it('should return false when the picker is closed', async () => {
    const triggerElement = document.createElement('button');

    await service.open(
      createOpenOptions({
        triggerElement
      })
    );

    service.close();

    expect(service.isOpenFor(triggerElement)).toBeFalse();
  });

  it('should close the picker for the matching trigger element', async () => {
    const triggerElement = document.createElement('button');

    await service.open(
      createOpenOptions({
        triggerElement
      })
    );

    service.closeFor(triggerElement);

    expect(service.visible()).toBeFalse();
  });

  it('should not close the picker for a different trigger element', async () => {
    const triggerElement = document.createElement('button');
    const otherTriggerElement = document.createElement('button');

    await service.open(
      createOpenOptions({
        triggerElement
      })
    );

    service.closeFor(otherTriggerElement);

    expect(service.visible()).toBeTrue();
  });

  it('should call the insert callback when inserting a character', async () => {
    const onInsert = jasmine.createSpy('onInsert');

    await service.open(
      createOpenOptions({
        onInsert
      })
    );

    service.insertCharacter('Ä');

    expect(onInsert).toHaveBeenCalledWith('Ä');
  });

  it('should close the picker after inserting a character', async () => {
    await service.open(createOpenOptions());

    service.insertCharacter('Ä');

    expect(service.visible()).toBeFalse();
  });

  it('should not clear state when finishClose is called while picker is visible', async () => {
    await service.open(createOpenOptions());

    const currentState = service.state();

    service.finishClose(currentState);

    expect(service.state()).toBe(currentState);
    expect(service.visible()).toBeTrue();
  });

  it('should clear state when finishClose is called after closing with the current state', async () => {
    await service.open(createOpenOptions());

    const currentState = service.state();

    service.close();
    service.finishClose(currentState);

    expect(service.state()).toBeUndefined();
  });

  it('should not clear state when finishClose is called with an outdated state', async () => {
    const firstTriggerElement = document.createElement('button');
    const secondTriggerElement = document.createElement('button');

    await service.open(
      createOpenOptions({
        triggerElement: firstTriggerElement
      })
    );

    const outdatedState = service.state();

    await service.open(
      createOpenOptions({
        triggerElement: secondTriggerElement
      })
    );

    const currentState = service.state();

    service.close();
    service.finishClose(outdatedState);

    expect(service.state()).toBe(currentState);
  });

  it('should clear the insert callback when finishClose clears the current state', async () => {
    const onInsert = jasmine.createSpy('onInsert');

    await service.open(
      createOpenOptions({
        onInsert
      })
    );

    const currentState = service.state();

    service.close();
    service.finishClose(currentState);

    service.insertCharacter('Ä');

    expect(onInsert).not.toHaveBeenCalled();
  });

  it('should detach, destroy and remove the host component on destroy', async () => {
    const appRef = spectator.inject(ApplicationRef);
    const detachViewSpy = spyOn(appRef, 'detachView').and.callThrough();

    await service.open(createOpenOptions());

    expect(getHostElements().length).toBe(1);

    service.ngOnDestroy();

    expect(detachViewSpy).toHaveBeenCalled();
    expect(getHostElements().length).toBe(0);
  });

  it('should recreate the host component after destroy and opening again', async () => {
    await service.open(createOpenOptions());

    expect(getHostElements().length).toBe(1);

    service.ngOnDestroy();

    expect(getHostElements().length).toBe(0);

    await service.open(createOpenOptions());

    expect(getHostElements().length).toBe(1);
  });

  it('should not throw when destroyed without an existing host component', () => {
    expect(() => service.ngOnDestroy()).not.toThrow();
  });
});
