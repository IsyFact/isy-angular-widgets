import {IncompleteDateService} from './incomplete-date.service';
import {IncompleteDateComponent} from './incomplete-date.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AbstractControl, FormControl, FormsModule} from '@angular/forms';

describe('IsyIncompleteDateComponent', () => {
  let component: IncompleteDateComponent;
  let fixture: ComponentFixture<IncompleteDateComponent>;
  let onChange: Function = () => {};
  let onTouched: Function = () => {};

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [IncompleteDateComponent],
      imports: [
        FormsModule
      ],
      providers: [
        IncompleteDateService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncompleteDateComponent);
    component = fixture.componentInstance;
    onChange = jasmine.createSpy('onChange spy');
    onTouched = jasmine.createSpy('onTouched spy');
    component.registerOnChange(onChange);
    component.registerOnTouched(onTouched);
  });

  it('it should be created', () => {
    expect(component).toBeDefined();
  });

  it('valid writeValue sets inputValue', () => {
    component.writeValue('01.01.2023');

    expect(component.inputValue).toBe('01.01.2023');
    expect(onChange).not.toHaveBeenCalled();
    expect(onTouched).not.toHaveBeenCalled();
  });

  it('expect disabled to be true', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTrue();
  });

  it('expect value set by onComplete', () => {
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
});
