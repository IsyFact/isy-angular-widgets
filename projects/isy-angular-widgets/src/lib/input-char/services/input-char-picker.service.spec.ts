import {ApplicationRef} from '@angular/core';
import {createServiceFactory, SpectatorService} from '@ngneat/spectator';
import {InputCharPickerService} from './input-char-picker.service';
import {Datentyp} from '../model/datentyp';
import type {InputCharPickerOpenOptions} from '../model/input-char-picker.model';
import {CharacterService} from './character.service';
import {WidgetsConfigService} from '../../i18n/widgets-config.service';
import {InputCharSelection} from '../model/model';

/**
 * Retrieves all host elements for the input char picker component.
 * @returns A NodeList of all 'isy-input-char-picker-host' elements in the DOM.
 */
function getHostElements(): NodeListOf<Element> {
  return document.querySelectorAll('isy-input-char-picker-host');
}

interface InputCharPickerServicePrivateApi {
  createHostComponent: () => Promise<void>;
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
    expect(service.state()).toEqual(
      jasmine.objectContaining({
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
        selectedCharacter: undefined
      })
    );
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
    expect(service.state()).toEqual(
      jasmine.objectContaining({
        datentyp: Datentyp.DATENTYP_A,
        width: '900px',
        height: '600px',
        header: 'Custom header',
        closable: false,
        draggable: false,
        resizable: true,
        dismissableMask: true,
        closeOnEscape: false,
        modal: true,
        resetKey: 1,
        selection: undefined,
        selectedCharacter: undefined
      })
    );
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

  it('should reset host creation promise and retry after host creation failed', async () => {
    const error = new Error('Host creation failed');
    const privateService = service as unknown as InputCharPickerServicePrivateApi;

    let shouldFail = true;

    const createHostComponentSpy = spyOn(privateService, 'createHostComponent').and.callFake(async () => {
      if (shouldFail) {
        shouldFail = false;
        await Promise.reject(error);
      }

      await Promise.resolve();
    });

    await expectAsync(service.open(createOpenOptions())).toBeRejectedWith(error);

    expect(createHostComponentSpy).toHaveBeenCalledTimes(1);
    expect(service.visible()).toBeFalse();
    expect(service.state()).toBeUndefined();

    await service.open(createOpenOptions());

    expect(createHostComponentSpy).toHaveBeenCalledTimes(2);
    expect(service.visible()).toBeTrue();
    expect(service.state()).toBeTruthy();
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

  it('should return the active trigger element while the picker is active', async () => {
    const triggerElement = document.createElement('button');

    await service.open(
      createOpenOptions({
        triggerElement
      })
    );

    expect(service.getTriggerElement()).toBe(triggerElement);
  });

  it('should return undefined as trigger element after finishing close', async () => {
    const triggerElement = document.createElement('button');

    await service.open(
      createOpenOptions({
        triggerElement
      })
    );

    const currentState = service.state();

    service.close();
    service.finishClose(currentState);

    expect(service.getTriggerElement()).toBeUndefined();
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

  it('should keep state when finishClose is called after closing with the current state', async () => {
    await service.open(createOpenOptions());

    const currentState = service.state();

    service.close();
    service.finishClose(currentState);

    expect(service.state()).toBe(currentState);
    expect(service.visible()).toBeFalse();
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

  it('should clear the insert callback when finishClose is called with the current state', async () => {
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

  it('should ignore selection updates when no picker state exists', () => {
    const selection: InputCharSelection = {group: 'baseChars', value: 'A'};

    service.updateSelection(selection);

    expect(service.state()).toBeUndefined();
  });

  it('should ignore selection updates when no active trigger element exists', async () => {
    const selection: InputCharSelection = {group: 'baseChars', value: 'A'};

    await service.open(createOpenOptions());

    const currentState = service.state();

    service.close();
    service.finishClose(currentState);

    service.updateSelection(selection);

    expect(service.state()).toBe(currentState);
    expect(service.state()?.selection).toBeUndefined();
  });

  it('should cache and restore selection for the same trigger element and datentyp', async () => {
    const triggerElement = document.createElement('button');
    const selection: InputCharSelection = {group: 'baseChars', value: 'A'};

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    service.updateSelection(selection);

    service.close();
    service.finishClose(service.state());

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    expect(service.state()?.selection).toEqual(selection);
  });

  it('should remove cached selection when selection is cleared', async () => {
    const triggerElement = document.createElement('button');
    const selection: InputCharSelection = {group: 'baseChars', value: 'A'};

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    service.updateSelection(selection);

    expect(service.state()?.selection).toEqual(selection);

    service.updateSelection(undefined);

    expect(service.state()?.selection).toBeUndefined();

    service.close();
    service.finishClose(service.state());

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    expect(service.state()?.selection).toBeUndefined();
  });

  it('should not restore selection for a different trigger element', async () => {
    const firstTriggerElement = document.createElement('button');
    const secondTriggerElement = document.createElement('button');
    const selection: InputCharSelection = {group: 'baseChars', value: 'A'};

    await service.open(
      createOpenOptions({
        triggerElement: firstTriggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    service.updateSelection(selection);

    service.close();
    service.finishClose(service.state());

    await service.open(
      createOpenOptions({
        triggerElement: secondTriggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    expect(service.state()?.selection).toBeUndefined();
  });

  it('should not restore selection for a different datentyp', async () => {
    const triggerElement = document.createElement('button');
    const selection: InputCharSelection = {group: 'baseChars', value: 'A'};

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    service.updateSelection(selection);

    service.close();
    service.finishClose(service.state());

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_A
      })
    );

    expect(service.state()?.selection).toBeUndefined();
  });

  it('should ignore selected character updates when no picker state exists', () => {
    service.updateSelectedCharacter('Ä');

    expect(service.state()).toBeUndefined();
  });

  it('should ignore selected character updates when no active trigger element exists', async () => {
    await service.open(createOpenOptions());

    const currentState = service.state();

    service.close();
    service.finishClose(currentState);

    service.updateSelectedCharacter('Ä');

    expect(service.state()).toBe(currentState);
    expect(service.state()?.selectedCharacter).toBeUndefined();
  });

  it('should update selected character in the current state', async () => {
    await service.open(createOpenOptions());

    service.updateSelectedCharacter('Ä');

    expect(service.state()?.selectedCharacter).toBe('Ä');
  });

  it('should cache and restore selected character for the same trigger element and datentyp', async () => {
    const triggerElement = document.createElement('button');

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    service.updateSelectedCharacter('Ä');

    service.close();
    service.finishClose(service.state());

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    expect(service.state()?.selectedCharacter).toBe('Ä');
  });

  it('should not restore selected character for a different trigger element', async () => {
    const firstTriggerElement = document.createElement('button');
    const secondTriggerElement = document.createElement('button');

    await service.open(
      createOpenOptions({
        triggerElement: firstTriggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    service.updateSelectedCharacter('Ä');

    service.close();
    service.finishClose(service.state());

    await service.open(
      createOpenOptions({
        triggerElement: secondTriggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    expect(service.state()?.selectedCharacter).toBeUndefined();
  });

  it('should not restore selected character for a different datentyp', async () => {
    const triggerElement = document.createElement('button');

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    service.updateSelectedCharacter('Ä');

    service.close();
    service.finishClose(service.state());

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_A
      })
    );

    expect(service.state()?.selectedCharacter).toBeUndefined();
  });

  it('should remove cached selected character when selected character is cleared', async () => {
    const triggerElement = document.createElement('button');

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    service.updateSelectedCharacter('Ä');

    expect(service.state()?.selectedCharacter).toBe('Ä');

    service.updateSelectedCharacter(undefined);

    expect(service.state()?.selectedCharacter).toBeUndefined();

    service.close();
    service.finishClose(service.state());

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    expect(service.state()?.selectedCharacter).toBeUndefined();
  });

  it('should clear selected character when selection changes', async () => {
    const triggerElement = document.createElement('button');
    const selection: InputCharSelection = {group: 'baseChars', value: 'A'};

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    service.updateSelectedCharacter('Ä');

    expect(service.state()?.selectedCharacter).toBe('Ä');

    service.updateSelection(selection);

    expect(service.state()?.selection).toEqual(selection);
    expect(service.state()?.selectedCharacter).toBeUndefined();

    service.close();
    service.finishClose(service.state());

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    expect(service.state()?.selection).toEqual(selection);
    expect(service.state()?.selectedCharacter).toBeUndefined();
  });

  it('should keep resetKey when opening the same trigger element with the same datentyp', async () => {
    const triggerElement = document.createElement('button');

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    const firstResetKey = service.state()?.resetKey;

    service.close();
    service.finishClose(service.state());

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    expect(service.state()?.resetKey).toBe(firstResetKey);
  });

  it('should increase resetKey when opening a different trigger element', async () => {
    const firstTriggerElement = document.createElement('button');
    const secondTriggerElement = document.createElement('button');

    await service.open(
      createOpenOptions({
        triggerElement: firstTriggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    const firstResetKey = service.state()?.resetKey ?? 0;

    service.close();
    service.finishClose(service.state());

    await service.open(
      createOpenOptions({
        triggerElement: secondTriggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    expect(service.state()?.resetKey).toBe(firstResetKey + 1);
  });

  it('should increase resetKey when opening the same trigger element with a different datentyp', async () => {
    const triggerElement = document.createElement('button');

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_C
      })
    );

    const firstResetKey = service.state()?.resetKey ?? 0;

    service.close();
    service.finishClose(service.state());

    await service.open(
      createOpenOptions({
        triggerElement,
        datentyp: Datentyp.DATENTYP_A
      })
    );

    expect(service.state()?.resetKey).toBe(firstResetKey + 1);
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
