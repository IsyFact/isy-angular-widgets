import {InputCharComponent} from './input-char.component';
import {ElementRef} from '@angular/core';
import {Datentyp} from '../../model/datentyp';
import {CharacterService} from '../../services/character.service';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {MockComponents, MockModule} from 'ng-mocks';
import {DialogModule} from 'primeng/dialog';
import {InputCharDialogComponent} from '../input-char-dialog/input-char-dialog.component';
import {WidgetsConfigService} from '@isy-angular-widgets/public-api';
import {ButtonModule} from 'primeng/button';

let component: InputCharComponent;
let spectator: Spectator<InputCharComponent>;

describe('Unit Tests: InputCharComponent', () => {
  const dialogDefaultWidth = '740px';
  const dialogDefaultHeight = '460px';
  const createComponent = createComponentFactory({
    component: InputCharComponent,
    imports: [MockModule(DialogModule), MockComponents(InputCharDialogComponent), MockModule(ButtonModule)]
  });

  describe('with default datentyp', () => {
    beforeEach(() => {
      spectator = createComponent();
      component = spectator.component;

      component.ngOnChanges();
      spectator.fixture.detectChanges();
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

  Object.keys(Datentyp).forEach((datentyp) => {
    describe(`with ${datentyp}`, () => {
      beforeEach(() => {
        spectator = createComponent({props: {datentyp: datentyp as Datentyp}});
        component = spectator.component;

        spectator.fixture.componentRef.setInput('datentyp', datentyp);
        spectator.fixture.detectChanges();
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

      it('should display the input char button', () => {
        const button = spectator.query('.input-char-button') as HTMLButtonElement;
        component.isInputDisabled = true;
        spectator.fixture.detectChanges();
        expect(button.disabled).toBeTruthy();
      });

      it('should not display the input char button', () => {
        const button = spectator.query('.input-char-button') as HTMLButtonElement;
        component.isInputDisabled = false;
        spectator.fixture.detectChanges();
        expect(button.disabled).toBeFalsy();
      });

      it('should have the input char button disabled when isInputDisabled property is true', () => {
        const button = spectator.query('.input-char-button') as HTMLButtonElement;
        expect(button).toBeTruthy();

        component.isInputDisabled = true;
        spectator.fixture.detectChanges();

        expect(button.disabled).toBeTruthy();
      });

      it('should have the input char button not disabled when isInputDisabled property is false', () => {
        const button = spectator.query('.input-char-button') as HTMLButtonElement;
        expect(button).toBeTruthy();

        component.isInputDisabled = false;
        spectator.fixture.detectChanges();

        expect(button.disabled).toBeFalsy();
      });

      it('should not have outlined style by default for the input char button', () => {
        const button = spectator.query('.input-char-button') as HTMLButtonElement;
        const outlinedState = button.getAttribute('ng-reflect-outlined');
        expect(outlinedState).toBe('false');
      });

      it('should have outlined style when outlinedInputCharButton is true', () => {
        component.outlinedInputCharButton = true;
        spectator.fixture.detectChanges();

        const button = spectator.query('.input-char-button') as HTMLButtonElement;
        const outlinedState = button.getAttribute('ng-reflect-outlined');

        expect(outlinedState).toBe('true');
      });

      it('should not have outlined style when outlinedInputCharButton is false', () => {
        component.outlinedInputCharButton = false;
        spectator.fixture.detectChanges();

        const button = spectator.query('.input-char-button') as HTMLButtonElement;
        const outlinedState = button.getAttribute('ng-reflect-outlined');

        expect(outlinedState).toBe('false');
      });

      it('should display after clicking the button', () => {
        const button = spectator.query('.input-char-button') as HTMLButtonElement;
        expect(button).toBeTruthy();

        button.click();
        spectator.fixture.detectChanges();

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
    imports: [DialogModule, InputCharDialogComponent],
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
    });
  });
});

describe('Accessibility Test: InputCharComponent', () => {
  let spectator: Spectator<InputCharComponent>;
  const mockConfigService = jasmine.createSpyObj('WidgetsConfigService', ['getTranslation']);
  const createComponent = createComponentFactory({
    component: InputCharComponent,
    providers: [CharacterService],
    mocks: [WidgetsConfigService]
  });

  beforeEach(() => {
    mockConfigService.getTranslation.and.returnValue('Close picker');
    spectator = createComponent({
      props: {
        datentyp: Datentyp.DATENTYP_C as Datentyp
      },
      providers: [{provide: WidgetsConfigService, useValue: mockConfigService}]
    });
    spectator.detectChanges();
    spectator.component.ngOnChanges();
    spectator.click('.input-char-button');
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
