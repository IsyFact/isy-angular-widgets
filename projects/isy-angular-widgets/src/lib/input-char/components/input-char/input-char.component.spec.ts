import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputCharComponent} from './input-char.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {InputCharModule} from '../../input-char.module';
import {Datentyp} from '../../model/datentyp';
import {CharacterService} from '../../services/character.service';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {MockComponent} from 'ng-mocks';
import {Dialog} from 'primeng/dialog';
import {InputCharDialogComponent} from '../input-char-dialog/input-char-dialog.component';

describe('Unit Tests: InputCharComponent', () => {
  describe('with default datentyp', () => {
    let spectator: Spectator<InputCharComponent>;
    const createdComponent = createComponentFactory({
      component: InputCharComponent,
      declarations: [MockComponent(Dialog), MockComponent(InputCharDialogComponent)]
    });

    beforeEach(() => {
      spectator = createdComponent();
      spectator.component.ngOnChanges();
      spectator.fixture.detectChanges();
    });

    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should have default datatype DATENTYP_C', () => {
      expect(spectator.component.datentyp).toEqual(Datentyp.DATENTYP_C);
    });
  });

  Object.keys(Datentyp).forEach((datentyp) => {
    describe(`with ${datentyp}`, () => {
      const dialogDefaultWidth = '775px';
      const dialogDefaultHeight = '460px';

      let spectator: Spectator<InputCharComponent>;
      const createdComponent = createComponentFactory({
        component: InputCharComponent,
        declarations: [MockComponent(Dialog), MockComponent(InputCharDialogComponent)]
      });

      beforeEach(() => {
        spectator = createdComponent();
        spectator.component.datentyp = datentyp as Datentyp;
        spectator.fixture.componentRef.setInput('datentyp', datentyp);
        spectator.fixture.detectChanges();
      });

      it('should create', () => {
        expect(spectator.component).toBeTruthy();
      });

      it('should have the specified default input configuration', () => {
        expect(spectator.component.header).toEqual(undefined);
        expect(spectator.component.closable).toBeTrue();
        expect(spectator.component.draggable).toBeTrue();
        expect(spectator.component.resizable).toBeFalse();
        expect(spectator.component.dismissableMask).toBeFalse();
        expect(spectator.component.closeOnEscape).toBeTrue();
        expect(spectator.component.modal).toBeFalse();
        expect(spectator.component.isInputDisabled).toBeFalse();
        expect(spectator.component.visible).toBeFalse();
      });

      it('should display the input char button', () => {
        const button = spectator.fixture.debugElement.query(By.css('.input-char-button'))
          .nativeElement as HTMLButtonElement;
        spectator.component.isInputDisabled = true;
        spectator.fixture.detectChanges();
        expect(button.disabled).toBeTruthy();
      });

      it('should not display the input char button', () => {
        const button = spectator.fixture.debugElement.query(By.css('.input-char-button'))
          .nativeElement as HTMLButtonElement;
        spectator.component.isInputDisabled = false;
        spectator.fixture.detectChanges();
        expect(button.disabled).toBeFalsy();
      });

      it('should have the input char button disabled when isInputDisabled property is true', () => {
        const button = spectator.fixture.debugElement.query(By.css('.input-char-button'))
          .nativeElement as HTMLButtonElement;
        expect(button).toBeTruthy();

        spectator.component.isInputDisabled = true;
        spectator.fixture.detectChanges();

        expect(button.disabled).toBeTruthy();
      });

      it('should have the input char button not disabled when isInputDisabled property is false', () => {
        const button = spectator.fixture.debugElement.query(By.css('.input-char-button'))
          .nativeElement as HTMLButtonElement;
        expect(button).toBeTruthy();

        spectator.component.isInputDisabled = false;
        spectator.fixture.detectChanges();

        expect(button.disabled).toBeFalsy();
      });

      it('should display after clicking the button', () => {
        const button = spectator.fixture.debugElement.query(By.css('.input-char-button'))
          .nativeElement as HTMLButtonElement;
        expect(button).toBeTruthy();

        button.click();
        spectator.fixture.detectChanges();

        expect(spectator.component.visible).toBeTrue();
      });

      it('should have the correct default size', () => {
        expect(spectator.component.width).toEqual(dialogDefaultWidth);
        expect(spectator.component.height).toEqual(dialogDefaultHeight);
      });
    });
  });
});

describe('Integration Test: InputCharComponent', () => {
  Object.keys(Datentyp).forEach((datentyp) => {
    describe(`with ${datentyp}`, () => {
      let component: InputCharComponent;
      let fixture: ComponentFixture<InputCharComponent>;
      const service = new CharacterService();

      beforeEach(async () => {
        await TestBed.configureTestingModule({
          declarations: [InputCharComponent],
          imports: [InputCharModule, BrowserAnimationsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(InputCharComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('datentyp', datentyp);
        fixture.debugElement.query(By.css('.input-char-button')).nativeElement.click();
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      const expectedGroups = service.getGroupsByDataType(datentyp as Datentyp).length;
      it(`should show ${expectedGroups} available groups after opening`, () => {
        const groupButtons = fixture.debugElement.queryAll(
          By.css('#schriftzeichengruppe-select-button .p-buttonset .p-button')
        );
        expect(groupButtons.length).toEqual(expectedGroups);
      });

      const expectedCharacters = service.getCharactersByDataType(datentyp as Datentyp).length;
      it(`should show ${expectedCharacters} characters after opening`, () => {
        const groupButtons = fixture.debugElement.queryAll(
          By.css('#right-panel-side p-selectbutton .p-buttonset .p-button')
        );
        expect(groupButtons.length).toEqual(expectedCharacters);
      });
    });
  });
});
