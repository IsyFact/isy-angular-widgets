import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {InputCharComponent} from './input-char.component';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Datentyp} from '../../model/datentyp';
import {CharacterService} from '../../services/character.service';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {InputCharDialogComponent} from '../input-char-dialog/input-char-dialog.component';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {Zeichenobjekt} from '../../model/model';
import {fakeAsync, tick} from '@angular/core/testing';

@Component({
  standalone: true,
  selector: 'isy-input-char-dialog',
  template: ''
})
class InputCharDialogStubComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() charList: Zeichenobjekt[] = [];
  @Output() insertCharacter = new EventEmitter<string>();
  @Input() datentyp?: Datentyp;
  @Input() width?: string;
  @Input() height?: string;
  @Input() header?: string;
  @Input() closable?: boolean;
  @Input() draggable?: boolean;
  @Input() resizable?: boolean;
  @Input() dismissableMask?: boolean;
  @Input() closeOnEscape?: boolean;
  @Input() modal?: boolean;
}

describe('Unit Tests: InputCharComponent', () => {
  let spectator: Spectator<InputCharComponent>;
  let component: InputCharComponent;
  const dialogDefaultWidth = '740px';
  const dialogDefaultHeight = '460px';
  const datentypValues = Object.values(Datentyp) as Datentyp[];

  const charServiceSpy = jasmine.createSpyObj<CharacterService>('CharacterService', ['getCharactersByDataType']);
  const configServiceSpy = jasmine.createSpyObj<WidgetsConfigService>('WidgetsConfigService', ['getTranslation']);

  const createComponent = createComponentFactory({
    component: InputCharComponent,
    detectChanges: false,

    overrideComponents: [
      [
        InputCharComponent,
        {
          set: {
            imports: [DialogModule, ButtonModule, InputCharDialogStubComponent],
            providers: [{provide: CharacterService, useValue: charServiceSpy}]
          }
        }
      ]
    ],

    providers: [{provide: WidgetsConfigService, useValue: configServiceSpy}]
  });

  const render = (): void => spectator.fixture.detectChanges(false);

  beforeEach(() => {
    charServiceSpy.getCharactersByDataType.calls.reset();
    charServiceSpy.getCharactersByDataType.and.returnValue([]);

    configServiceSpy.getTranslation.calls.reset();
    configServiceSpy.getTranslation.and.callFake((key: string) => key);
  });

  describe('with default datentyp', () => {
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

    it('should not load characters before opening the dialog', () => {
      expect(charServiceSpy.getCharactersByDataType).not.toHaveBeenCalled();
      expect(component.allCharacters).toEqual([]);
    });

    it('should load characters when opening the dialog', () => {
      spectator.click('.input-char-button');
      render();

      expect(charServiceSpy.getCharactersByDataType).toHaveBeenCalledWith(Datentyp.DATENTYP_C);
      expect(component.visible).toBeTrue();
    });

    it('should not load characters again when reopening with the same datentyp', () => {
      spectator.click('.input-char-button');
      render();

      spectator.click('.input-char-button');
      render();

      spectator.click('.input-char-button');
      render();

      expect(charServiceSpy.getCharactersByDataType).toHaveBeenCalledTimes(1);
    });

    it('should render the input char dialog only when visible is true', () => {
      expect(spectator.query(InputCharDialogStubComponent)).toBeFalsy();

      spectator.click('.input-char-button');
      render();

      expect(spectator.query(InputCharDialogStubComponent)).toBeTruthy();
    });

    it('should load characters again when datentyp changes while dialog is visible', () => {
      spectator.click('.input-char-button');
      render();

      spectator.setInput('datentyp', Datentyp.DATENTYP_A);
      render();

      expect(charServiceSpy.getCharactersByDataType).toHaveBeenCalledWith(Datentyp.DATENTYP_C);
      expect(charServiceSpy.getCharactersByDataType).toHaveBeenCalledWith(Datentyp.DATENTYP_A);
      expect(charServiceSpy.getCharactersByDataType).toHaveBeenCalledTimes(2);
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

      it('should have the specified default input configuration', () => {
        expect(component.header).toEqual(undefined);
        expect(component.closable).toBeTrue();
        expect(component.draggable).toBeTrue();
        expect(component.resizable).toBeFalse();
        expect(component.dismissableMask).toBeFalse();
        expect(component.closeOnEscape).toBeTrue();
        expect(component.modal).toBeFalse();
        expect(component.isInputDisabled).toBeFalse();
        expect(component.visible).toBeFalse();
      });

      it('should have the input char button disabled when isInputDisabled is true', () => {
        spectator.setInput('isInputDisabled', true);
        render();

        const button = spectator.query('.input-char-button') as HTMLButtonElement;
        expect(button).toBeTruthy();
        expect(button.disabled).toBeTrue();
      });

      it('should have the input char button enabled when isInputDisabled is false', () => {
        spectator.setInput('isInputDisabled', false);
        render();

        const button = spectator.query('.input-char-button') as HTMLButtonElement;
        expect(button).toBeTruthy();
        expect(button.disabled).toBeFalse();
      });

      it('should display after clicking the button', () => {
        const button = spectator.query('.input-char-button') as HTMLButtonElement;
        expect(button).toBeTruthy();

        spectator.click(button);
        render();

        expect(component.visible).toBeTrue();
      });

      it('should load characters for the selected datentyp after opening', () => {
        spectator.click('.input-char-button');
        render();

        expect(charServiceSpy.getCharactersByDataType).toHaveBeenCalledWith(datentyp);
      });
    });
  });
});

describe('Integration Test: InputCharComponent', () => {
  const service = new CharacterService();
  let spectator: Spectator<InputCharComponent>;
  const datentypValues = Object.values(Datentyp) as Datentyp[];
  const createComponent = createComponentFactory({
    component: InputCharComponent,
    imports: [DialogModule, InputCharDialogComponent, ButtonModule],
    providers: [WidgetsConfigService, CharacterService]
  });

  datentypValues.forEach((datentyp) => {
    describe(`with ${datentyp}`, () => {
      beforeEach(() => {
        spectator = createComponent({
          props: {
            datentyp
          }
        });

        spectator.detectChanges();
        spectator.click('.input-char-button');
        spectator.detectChanges();
      });

      it('should create', () => {
        expect(spectator.component).toBeTruthy();
      });

      const expectedGroups = service.getGroupsByDataType(datentyp).length;
      it(`should show ${expectedGroups} available groups after opening`, () => {
        const groupButtons = spectator.queryAll('.charset-selectbutton--1 p-togglebutton');
        expect(groupButtons.length).toEqual(expectedGroups);
      });

      const expectedCharacters = service.getCharactersByDataType(datentyp).length;
      it(`should show ${expectedCharacters} characters after opening`, () => {
        const groupButtons = spectator.queryAll('.right-panel-side p-selectbutton p-togglebutton');
        expect(groupButtons.length).toEqual(expectedCharacters);
      });

      it('should not have outlined style by default for the input char button', () => {
        const button = spectator.query('.input-char-button.p-button-outlined') as HTMLButtonElement;
        expect(button).toBeFalsy();
      });

      it('should have outlined style when outlinedInputCharButton is true', () => {
        spectator = createComponent({
          props: {outlinedInputCharButton: true}
        });

        const button = spectator.query('.input-char-button') as HTMLButtonElement;
        expect(button).toHaveClass('p-button-outlined');
      });

      it('should not have outlined style when outlinedInputCharButton is false', () => {
        spectator = createComponent({
          props: {outlinedInputCharButton: false}
        });

        const button = spectator.query('.input-char-button') as HTMLButtonElement;
        expect(button).not.toHaveClass('p-button-outlined');
      });
    });
  });
});

describe('Accessibility Test: InputCharComponent', () => {
  let spectator: Spectator<InputCharComponent>;
  const mockConfigService = jasmine.createSpyObj('WidgetsConfigService', ['getTranslation']);

  const createComponent = createComponentFactory({
    component: InputCharComponent,
    detectChanges: false,
    overrideComponents: [
      [
        InputCharComponent,
        {
          set: {
            imports: [DialogModule, ButtonModule, InputCharDialogStubComponent]
          }
        }
      ]
    ],
    providers: [{provide: WidgetsConfigService, useValue: mockConfigService}]
  });

  const render = (): void => spectator.fixture.detectChanges(false);

  beforeEach(() => {
    mockConfigService.getTranslation.calls.reset();
    mockConfigService.getTranslation.and.returnValue('Close picker');
    spectator = createComponent({props: {datentyp: Datentyp.DATENTYP_C}});
    render();
    spectator.click('.input-char-button');
    render();
  });

  it('the dialog close icon should have an aria-label attribute with "Close picker"', () => {
    const element = spectator.query('.p-dialog-close-button') as HTMLElement;
    expect(element.getAttribute('aria-label')).toBe('Close picker');
  });

  it('should focus the open dialog button when dialog closes', fakeAsync(() => {
    const button = document.createElement('button');
    const focusSpy = spyOn(button, 'focus');
    spyOnProperty(button, 'isConnected', 'get').and.returnValue(true);

    spectator.component.openDialogButton = {
      nativeElement: button
    };

    spectator.component.onDialogClose();
    render();
    tick();

    expect(focusSpy).toHaveBeenCalled();
  }));

  it('should not focus the open dialog button when it is disabled', fakeAsync(() => {
    const button = document.createElement('button');
    button.disabled = true;

    const focusSpy = spyOn(button, 'focus');
    spyOnProperty(button, 'isConnected', 'get').and.returnValue(true);

    spectator.component.openDialogButton = {
      nativeElement: button
    };

    spectator.component.onDialogClose();
    render();
    tick();

    expect(focusSpy).not.toHaveBeenCalled();
  }));
});
