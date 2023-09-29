import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputCharComponent} from './input-char.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {InputCharModule} from '../../input-char.module';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Datentyp} from '../../model/datentyp';
import {CharacterService} from '../../services/character.service';


describe('Unit Tests: InputCharComponent', () => {
  describe('with default datentyp', () => {
    let component: InputCharComponent;
    let fixture: ComponentFixture<InputCharComponent>;

    beforeEach(async() => {
      await TestBed.configureTestingModule({
        declarations: [
          InputCharComponent
        ],
        schemas: [
          NO_ERRORS_SCHEMA
        ]
      })
        .compileComponents();

      fixture = TestBed.createComponent(InputCharComponent);
      component = fixture.componentInstance;
      component.ngOnChanges();
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default datatype DATENTYP_C', () => {
      expect(component.datentyp).toEqual(Datentyp.DATENTYP_C);
    });
  });

  Object.keys(Datentyp).forEach(datentyp => {

    describe(`with ${datentyp}`, () => {
      let component: InputCharComponent;
      let fixture: ComponentFixture<InputCharComponent>;

      const dialogDefaultWidth = '775px';
      const dialogDefaultHeight = '460px';

      beforeEach(async() => {
        await TestBed.configureTestingModule({
          declarations: [
            InputCharComponent
          ],
          schemas: [
            NO_ERRORS_SCHEMA
          ],
          providers: [
            CharacterService
          ]
        })
          .compileComponents();

        fixture = TestBed.createComponent(InputCharComponent);
        component = fixture.componentInstance;
        component.datentyp = datentyp as Datentyp;
        fixture.componentRef.setInput('datentyp', datentyp);
        fixture.detectChanges();
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

      it('should check the input char button availability', () => {
        const button = fixture.debugElement.query(By.css('#input-char-button')).nativeElement as HTMLButtonElement;
        component.isInputDisabled = true;
        fixture.detectChanges();
        expect(button.disabled).toBeTruthy();

        component.isInputDisabled = false;
        fixture.detectChanges();
        expect(button.disabled).toBeFalsy();
      });

      it('should have the input char button disabled when isInputDisabled property is true', () => {
        const button = fixture.debugElement.query(By.css('#input-char-button')).nativeElement as HTMLButtonElement;
        expect(button).toBeTruthy();

        component.isInputDisabled = true;
        fixture.detectChanges();

        expect(button.disabled).toBeTruthy();
      });

      it('should have the input char button not disabled when isInputDisabled property is false', () => {
        const button = fixture.debugElement.query(By.css('#input-char-button')).nativeElement as HTMLButtonElement;
        expect(button).toBeTruthy();

        component.isInputDisabled = false;
        fixture.detectChanges();

        expect(button.disabled).toBeFalsy();
      });

      it('should display after clicking the button', () => {
        const button = fixture.debugElement.query(By.css('#input-char-button')).nativeElement as HTMLButtonElement;
        expect(button).toBeTruthy();

        button.click();
        fixture.detectChanges();

        expect(component.visible).toBeTrue();
      });

      it('should have the correct default size', () => {
        expect(component.width).toEqual(dialogDefaultWidth);
        expect(component.height).toEqual(dialogDefaultHeight);
      });
    });

  });
});

describe('Integration Test: InputCharComponent', () => {

  Object.keys(Datentyp).forEach(datentyp => {

    describe(`with ${datentyp}`, () => {
      let component: InputCharComponent;
      let fixture: ComponentFixture<InputCharComponent>;
      const service = new CharacterService();

      beforeEach(async() => {

        await TestBed.configureTestingModule({
          declarations: [
            InputCharComponent
          ],
          imports: [
            InputCharModule, BrowserAnimationsModule
          ]
        })
          .compileComponents();

        fixture = TestBed.createComponent(InputCharComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('datentyp', datentyp);
        fixture.debugElement.query(By.css('#input-char-button')).nativeElement.click();
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      const expectedGroups = service.getGroupsByDataType(datentyp as Datentyp).length;
      it(`should show ${expectedGroups} available groups after opening`, () => {
        const groupButtons = fixture.debugElement.queryAll(By.css('#schriftzeichengruppe-select-button .p-buttonset .p-button'));
        expect(groupButtons.length).toEqual(expectedGroups);
      });

      const expectedCharacters = service.getCharactersByDataType(datentyp as Datentyp).length;
      it(`should show ${expectedCharacters} characters after opening`, () => {
        const groupButtons = fixture.debugElement.queryAll(By.css('#right-panel-side p-selectbutton .p-buttonset .p-button'));
        expect(groupButtons.length).toEqual(expectedCharacters);
      });
    });
  });
});
