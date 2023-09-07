import {IncompleteDateService} from './incomplete-date.service';
import {IncompleteDateComponent} from './incomplete-date.component';
import {TestBed} from '@angular/core/testing';
import {AbstractControl, FormControl, FormsModule} from '@angular/forms';

describe('IsyIncompleteDateComponent', () => {
  let sut: IncompleteDateComponent;
  let onChange: Function = () => {};
  let onTouched: Function = () => {};

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [IncompleteDateComponent],
      imports: [
        FormsModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    sut = new IncompleteDateComponent(/*new UniqueIdService(), */new IncompleteDateService());
    onChange = jasmine.createSpy('onChange spy');
    onTouched = jasmine.createSpy('onTouched spy');
    sut.registerOnChange(onChange);
    sut.registerOnTouched(onTouched);
  });

  it('should be created', () => {
    expect(sut).toBeDefined();
  });

  it('valid writeValue sets inputValue', () => {
    sut.writeValue('01.01.2023');

    expect(sut.inputValue).toBe('01.01.2023');
    expect(onChange).not.toHaveBeenCalled();
    expect(onTouched).not.toHaveBeenCalled();
  });

  it('expect disabled to be true', () => {
    sut.setDisabledState(true);
    expect(sut.disabled).toBeTrue();
  });

  it('expect value set by onComplete', () => {
    sut.writeValue('01.01.2023');
    sut.onComplete();
    expect(sut.inputValue).toBe('01.01.2023');
  });

  it('should return null if date is valid', () => {
    const validDateControl: AbstractControl = new FormControl('11.11.2023');
    const errors = sut.validate(validDateControl);
    expect(errors).toBeNull();
  });

  it('should return UNSPECIFIEDDATE if the day is invalid', () => {
    const errorKey = 'UNSPECIFIEDDATE';
    const control: AbstractControl = new FormControl('50.11.2023');

    const errors = sut.validate(control);
    if (!errors) {
      throw new Error('errors is not defined');
    }

    expect(errors[errorKey]).toBeDefined();
  });

  it('should return UNSPECIFIEDDATE if the month is invalid', () => {
    const errorKey = 'UNSPECIFIEDDATE';
    const control: AbstractControl = new FormControl('11.50.2023');

    const errors = sut.validate(control);
    if (!errors) {
      throw new Error('errors is not defined');
    }

    expect(errors[errorKey]).toBeDefined();
  });
});
