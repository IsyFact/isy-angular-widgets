import {ElementRef, ErrorHandler} from '@angular/core';
import {fakeAsync, flushMicrotasks} from '@angular/core/testing';
import {InputCharComponent} from './input-char.component';
import {Datentyp} from '../../model/datentyp';
import {createComponentFactory, createSpyObject, Spectator} from '@ngneat/spectator/vitest';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {InputCharPickerService} from '../../services/input-char-picker.service';
import {expect} from 'vitest';

describe('Unit Tests: InputCharComponent', () => {
  let spectator: Spectator<InputCharComponent>;
  let component: InputCharComponent;

  const dialogDefaultWidth = '740px';
  const dialogDefaultHeight = '460px';
  const datentypValues = Object.values(Datentyp) as Datentyp[];

  const pickerServiceSpy = createSpyObject(InputCharPickerService);

  const configServiceSpy = createSpyObject(WidgetsConfigService);

  const errorHandlerSpy = createSpyObject(ErrorHandler);

  const createComponent = createComponentFactory({
    component: InputCharComponent,
    detectChanges: false,
    providers: [
      {provide: WidgetsConfigService, useValue: configServiceSpy},
      {provide: InputCharPickerService, useValue: pickerServiceSpy},
      {provide: ErrorHandler, useValue: errorHandlerSpy}
    ]
  });

  const render = (): void => spectator.fixture.detectChanges(false);

  beforeEach(() => {
    pickerServiceSpy.open.mockReset();
    pickerServiceSpy.open.mockResolvedValue(undefined);

    pickerServiceSpy.close.mockReset();

    pickerServiceSpy.closeFor.mockReset();

    pickerServiceSpy.isOpenFor.mockReset();
    pickerServiceSpy.isOpenFor.mockReturnValue(false);

    configServiceSpy.getTranslation.mockReset();
    configServiceSpy.getTranslation.mockImplementation((key: string) => key);

    errorHandlerSpy.handleError.mockReset();
  });

  describe('with default inputs', () => {
    beforeEach(() => {
      spectator = createComponent();
      component = spectator.component;
      render();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default datatype DATENTYP_C', () => {
      expect(component.datentyp).toEqual(Datentyp.DATENTYP_C);
    });

    it('should have the correct default size', () => {
      expect(component.width).toEqual(dialogDefaultWidth);
      expect(component.height).toEqual(dialogDefaultHeight);
    });

    it('should have the specified default input configuration', () => {
      expect(component.header).toBeUndefined();
      expect(component.closable).toBe(true);
      expect(component.draggable).toBe(true);
      expect(component.resizable).toBe(false);
      expect(component.dismissableMask).toBe(false);
      expect(component.closeOnEscape).toBe(true);
      expect(component.modal).toBe(true);
      expect(component.isInputDisabled).toBe(false);
    });

    it('should render the input char button', () => {
      const button = spectator.query('.input-char-button') as HTMLButtonElement;

      expect(button).toBeTruthy();
    });

    it('should set the translated aria-label on the input char button', () => {
      const button = spectator.query('.input-char-button') as HTMLButtonElement;

      expect(button.getAttribute('aria-label')).toBe('inputChar.aria.togglePicker');
      expect(configServiceSpy.getTranslation).toHaveBeenCalledWith('inputChar.aria.togglePicker');
    });

    it('should have the input char button disabled when isInputDisabled is true', () => {
      spectator.setInput('isInputDisabled', true);
      render();

      const button = spectator.query('.input-char-button') as HTMLButtonElement;

      expect(button).toBeTruthy();
      expect(button.disabled).toBe(true);
    });

    it('should have the input char button enabled when isInputDisabled is false', () => {
      spectator.setInput('isInputDisabled', false);
      render();

      const button = spectator.query('.input-char-button') as HTMLButtonElement;

      expect(button).toBeTruthy();
      expect(button.disabled).toBe(false);
    });

    it('should not have outlined style by default for the input char button', () => {
      const button = spectator.query('.input-char-button.p-button-outlined') as HTMLButtonElement;

      expect(button).toBeFalsy();
    });

    it('should not open or close the picker when the open dialog button is not available', () => {
      component.openDialogButton = new ElementRef<HTMLButtonElement>(undefined as unknown as HTMLButtonElement);

      component.toggleCharPicker();

      expect(pickerServiceSpy.isOpenFor).not.toHaveBeenCalled();
      expect(pickerServiceSpy.open).not.toHaveBeenCalled();
      expect(pickerServiceSpy.close).not.toHaveBeenCalled();
    });

    it('should open the shared input char picker when clicking the button', () => {
      const button = spectator.query('.input-char-button') as HTMLButtonElement;

      spectator.click(button);
      render();

      expect(pickerServiceSpy.open).toHaveBeenCalledWith(
        expect.objectContaining({
          datentyp: Datentyp.DATENTYP_C,
          triggerElement: button,
          width: dialogDefaultWidth,
          height: dialogDefaultHeight,
          header: undefined,
          closable: true,
          draggable: true,
          resizable: false,
          dismissableMask: false,
          closeOnEscape: true,
          modal: true
        })
      );
    });

    it('should close the shared input char picker when it is already open for the button', () => {
      const button = spectator.query('.input-char-button') as HTMLButtonElement;

      pickerServiceSpy.isOpenFor.mockReturnValue(true);

      spectator.click(button);
      render();

      expect(pickerServiceSpy.close).toHaveBeenCalled();
      expect(pickerServiceSpy.open).not.toHaveBeenCalled();
    });

    it('should emit insertCharacter when the picker insert callback is called', () => {
      const button = spectator.query('.input-char-button') as HTMLButtonElement;
      const emitSpy = spyOn(component.insertCharacter, 'emit');

      spectator.click(button);
      render();

      const openOptions = pickerServiceSpy.open.mock.lastCall?.[0];

      expect(openOptions).toBeDefined();

      openOptions!.onInsert('Ä');

      expect(emitSpy).toHaveBeenCalledWith('Ä');
    });

    it('should delegate picker opening errors to Angular ErrorHandler', async () => {
      const button = spectator.query('.input-char-button') as HTMLButtonElement;
      const error = new Error('Failed to open input char picker');

      pickerServiceSpy.open.mockRejectedValue(error);

      spectator.click(button);
      await Promise.resolve();
      await Promise.resolve();

      expect(errorHandlerSpy.handleError).toHaveBeenCalledWith(error);
    });

    it('should close the picker for its button when destroyed', () => {
      const button = spectator.query('.input-char-button') as HTMLButtonElement;

      component.ngOnDestroy();

      expect(pickerServiceSpy.closeFor).toHaveBeenCalledWith(button);
    });

    it('should not close the picker on destroy when the open dialog button is not available', () => {
      component.openDialogButton = new ElementRef<HTMLButtonElement>(undefined as unknown as HTMLButtonElement);

      component.ngOnDestroy();

      expect(pickerServiceSpy.closeFor).not.toHaveBeenCalled();
    });
  });

  describe('with outlined input char button', () => {
    it('should have outlined style when outlinedInputCharButton is true', () => {
      spectator = createComponent({
        props: {
          outlinedInputCharButton: true
        }
      });

      render();

      const button = spectator.query('.input-char-button') as HTMLButtonElement;

      expect(button).toBeTruthy();
      expect(button).toHaveClass('p-button-outlined');
    });

    it('should not have outlined style when outlinedInputCharButton is false', () => {
      spectator = createComponent({
        props: {
          outlinedInputCharButton: false
        }
      });

      render();

      const button = spectator.query('.input-char-button') as HTMLButtonElement;

      expect(button).toBeTruthy();
      expect(button).not.toHaveClass('p-button-outlined');
    });
  });

  datentypValues.forEach((datentyp) => {
    describe(`with ${datentyp}`, () => {
      beforeEach(() => {
        spectator = createComponent({props: {datentyp}});
        component = spectator.component;
        render();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should pass the selected datentyp to the shared input char picker', () => {
        const button = spectator.query('.input-char-button') as HTMLButtonElement;

        spectator.click(button);
        render();

        expect(pickerServiceSpy.open).toHaveBeenCalledWith(
          expect.objectContaining({
            datentyp,
            triggerElement: button
          })
        );
      });
    });
  });

  describe('with custom dialog configuration', () => {
    beforeEach(() => {
      spectator = createComponent({
        props: {
          datentyp: Datentyp.DATENTYP_A,
          width: '900px',
          height: '600px',
          header: 'Custom header',
          closable: false,
          draggable: false,
          resizable: true,
          dismissableMask: true,
          closeOnEscape: false,
          modal: true
        }
      });

      component = spectator.component;
      render();
    });

    it('should pass the custom configuration to the shared input char picker', () => {
      const button = spectator.query('.input-char-button') as HTMLButtonElement;

      spectator.click(button);
      render();

      expect(pickerServiceSpy.open).toHaveBeenCalledWith(
        expect.objectContaining({
          datentyp: Datentyp.DATENTYP_A,
          triggerElement: button,
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
    });
  });

  describe('with custom aria-label properties', () => {
    beforeEach(() => {
      spectator = createComponent({
        props: {
          togglePickerAriaLabel: 'Open custom character picker',
          closePickerAriaLabel: 'Close custom character picker'
        }
      });
      component = spectator.component;
      render();
    });

    it('should use custom togglePickerAriaLabel when provided', () => {
      const button = spectator.query('.input-char-button') as HTMLButtonElement;

      expect(button.getAttribute('aria-label')).toBe('Open custom character picker');
    });

    it('should use custom togglePickerAriaLabel when opening picker', () => {
      const button = spectator.query('.input-char-button') as HTMLButtonElement;

      spectator.click(button);
      render();

      expect(pickerServiceSpy.open).toHaveBeenCalledWith(
        expect.objectContaining({
          togglePickerAriaLabel: 'Open custom character picker',
          closePickerAriaLabel: 'Close custom character picker'
        })
      );
    });

    it('should use default aria-label when custom properties are not provided', () => {
      spectator = createComponent();
      component = spectator.component;
      render();

      const button = spectator.query('.input-char-button') as HTMLButtonElement;

      expect(button.getAttribute('aria-label')).toBe('inputChar.aria.togglePicker');
    });
  });
});
