import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputCharComponent} from './input-char.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {InputCharModule} from '../../input-char.module';
import {NO_ERRORS_SCHEMA} from '@angular/core';


describe('Unit Tests:  InputCharComponent', () => {
  describe('InputCharComponent with default datentyp = DATENTYP_C', () => {
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
        ]
      })
        .compileComponents();

      fixture = TestBed.createComponent(InputCharComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have the specified default input configuration', () => {
      expect(component.header).toEqual(undefined);
      expect(component.isDialogClosable).toBeTrue();
      expect(component.isDialogDraggable).toBeTrue();
      expect(component.isDialogResizable).toBeFalse();
      expect(component.isDialogClosingOnOutsideClick).toBeFalse();
      expect(component.isDialogClosingOnEscape).toBeTrue();
      expect(component.isDialogModalDisplayed).toBeFalse();
      expect(component.isInputDisabled).toBeFalse();
      expect(component.visible).toBeFalse();
    });

    it('should not be visible by default', () => {
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

describe('Integration Test: InputCharComponent', () => {
  let component: InputCharComponent;
  let fixture: ComponentFixture<InputCharComponent>;

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
    component.visible = true;
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show 5 available groups', () => {
    const groupButton = fixture.debugElement.query(By.css('#schriftzeichengruppe-select-button .p-buttonset'));
    console.log(groupButton);
    const groupButtons = fixture.debugElement.queryAll(By.css('#schriftzeichengruppe-select-button .p-buttonset .p-button'));
    console.log(groupButtons);
    expect(groupButtons.length).toEqual(5);
  });
});
