import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {InputCharComponent} from './input-char.component';
import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Datentyp} from '../../model/datentyp';
import {CharacterService} from '../../services/character.service';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {InputCharDialogComponent} from '../input-char-dialog/input-char-dialog.component';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {Zeichenobjekt} from '../../model/model';

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
  const charServiceSpy = jasmine.createSpyObj<CharacterService>('CharacterService', ['getCharactersByDataType']);
  charServiceSpy.getCharactersByDataType.and.returnValue([]);
  const configServiceSpy = jasmine.createSpyObj<WidgetsConfigService>('WidgetsConfigService', ['getTranslation']);
  configServiceSpy.getTranslation.and.callFake((k: string) => k);
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
  });

  Object.values(Datentyp).forEach((datentyp) => {
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
    });
  });
});

describe('Integration Test: InputCharComponent', () => {
  const service = new CharacterService();
  let spectator: Spectator<InputCharComponent>;
  const createComponent = createComponentFactory({
    component: InputCharComponent,
    imports: [DialogModule, InputCharDialogComponent, ButtonModule],
    providers: [WidgetsConfigService, CharacterService]
  });

  Object.keys(Datentyp).forEach((datentyp) => {
    describe(`with ${datentyp}`, () => {
      beforeEach(() => {
        spectator = createComponent({
          props: {
            datentyp: datentyp as Datentyp
          }
        });
        spectator.detectChanges();
        spectator.component.ngOnChanges();
        spectator.click('.input-char-button');
      });

      it('should create', () => {
        expect(spectator.component).toBeTruthy();
      });

      const expectedGroups = service.getGroupsByDataType(datentyp as Datentyp).length;
      it(`should show ${expectedGroups} available groups after opening`, () => {
        const groupButtons = spectator.queryAll('.charset-selectbutton--1 p-togglebutton');
        expect(groupButtons.length).toEqual(expectedGroups);
      });

      const expectedCharacters = service.getCharactersByDataType(datentyp as Datentyp).length;
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

  it('should focus the button if no element is focused when dialog closes', () => {
    spectator.component.visible = true;

    const focusSpy = jasmine.createSpy('focus');
    spectator.component.openDialogButton = {
      nativeElement: {focus: focusSpy}
    } as unknown as ElementRef<HTMLButtonElement>;

    spyOnProperty(document, 'activeElement', 'get').and.returnValue(document.body);

    spectator.component.onDialogClose();

    expect(spectator.component.visible).toBeFalse();
    expect(focusSpy).toHaveBeenCalled();
  });

  it('should not focus the button if another element is already focused', () => {
    spectator.component.visible = true;

    const focusSpy = jasmine.createSpy('focus');
    spectator.component.openDialogButton = {
      nativeElement: {focus: focusSpy}
    } as unknown as ElementRef<HTMLButtonElement>;

    const mockInput = document.createElement('input');
    spyOnProperty(document, 'activeElement', 'get').and.returnValue(mockInput);

    spectator.component.onDialogClose();

    expect(spectator.component.visible).toBeFalse();
    expect(focusSpy).not.toHaveBeenCalled();
  });
});
