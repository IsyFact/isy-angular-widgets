import {IncompleteDateComponent} from './incomplete-date.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AbstractControl, FormControl} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('Unit Tests: IsyIncompleteDateComponent', () => {
  let component: IncompleteDateComponent;
  let fixture: ComponentFixture<IncompleteDateComponent>;
  let onChange: Function = () => {};
  let onTouched: Function = () => {};

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        IncompleteDateComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(IncompleteDateComponent);
    component = fixture.componentInstance;
    onChange = jasmine.createSpy('onChange spy');
    onTouched = jasmine.createSpy('onTouched spy');
    component.registerOnChange(onChange);
    component.registerOnTouched(onTouched);
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should set valid writeValue to inputValue', () => {
    component.writeValue('01.01.2023');

    expect(component.inputValue).toBe('01.01.2023');
    expect(onChange).not.toHaveBeenCalled();
    expect(onTouched).not.toHaveBeenCalled();
  });

  it('should disable the state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTrue();
  });

  it('should set value by onComplete', () => {
    component.writeValue('01.01.2023');
    component.onComplete();
    expect(component.inputValue).toBe('01.01.2023');
  });

  it('should return null if date is valid', () => {
    const validDateControl: AbstractControl = new FormControl('11.11.2023');
    const errors = component.validate(validDateControl);
    expect(errors).toBeNull();
  });

  it('should return UNSPECIFIEDDATE if the day is invalid', () => {
    const errorKey = 'UNSPECIFIEDDATE';
    const control: AbstractControl = new FormControl('50.11.2023');

    const errors = component.validate(control);
    if (!errors) {
      throw new Error('errors is not defined');
    }

    expect(errors[errorKey]).toBeDefined();
  });

  it('should return UNSPECIFIEDDATE if the month is invalid', () => {
    const errorKey = 'UNSPECIFIEDDATE';
    const control: AbstractControl = new FormControl('11.50.2023');

    const errors = component.validate(control);
    if (!errors) {
      throw new Error('errors is not defined');
    }

    expect(errors[errorKey]).toBeDefined();
  });

  it('should fill input when dot is entered', () => {
    const val = 'x_.__.____';
    console.log(fixture.debugElement.query(By.css('p-inputmask')));
    console.log(fixture.debugElement.query(By.css('p-inputmask')).nativeElement);
    const input = fixture.debugElement.query(By.css('p-inputmask')).nativeElement as HTMLInputElement;

    input.value = val;

    const keyEvent = new KeyboardEvent("keydown", {
      key: ".",
      code: "190"
    });

    component.onKeydown(keyEvent);
    
    expect(input.value).toBe('xx.__.____');
  });
});
