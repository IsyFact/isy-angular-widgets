import {InputCharComponent} from './input-char.component';
import {Datentyp} from '../../model/datentyp';
import {CharacterService} from '../../services/character.service';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {MockComponents} from 'ng-mocks';
import {Dialog} from 'primeng/dialog';
import {InputCharDialogComponent} from '../input-char-dialog/input-char-dialog.component';
import {InputCharModule} from '../../input-char.module';
import {WidgetsConfigService} from '@isy-angular-widgets/public-api';

let component: InputCharComponent;
let spectator: Spectator<InputCharComponent>;

describe('Unit Tests: InputCharComponent', () => {
  const dialogDefaultWidth = '775px';
  const dialogDefaultHeight = '460px';
  const createComponent = createComponentFactory({
    component: InputCharComponent,
    declarations: [MockComponents(Dialog, InputCharDialogComponent)]
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
    declarations: [Dialog, InputCharDialogComponent],
    imports: [InputCharModule],
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
        const groupButtons = spectator.queryAll('.charset-selectButton--1 div span');
        expect(groupButtons.length).toEqual(expectedGroups);
      });

      const expectedCharacters = service.getCharactersByDataType(datentyp as Datentyp).length;
      it(`should show ${expectedCharacters} characters after opening`, () => {
        const groupButtons = spectator.queryAll('.right-panel-side div span');
        expect(groupButtons.length).toEqual(expectedCharacters);
      });
    });
  });
});
