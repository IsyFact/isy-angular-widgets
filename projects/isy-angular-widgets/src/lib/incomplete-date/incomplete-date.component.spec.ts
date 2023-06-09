import {IncompleteDateService} from './incomplete-date.service';
import { IncompleteDateComponent } from './incomplete-date.component';
import {TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';

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

  it('it should be created', () => {
    expect(sut).toBeDefined();
  });

  it('valid writeValue sets inputValue', () => {
    sut.writeValue('01.01.2020');

    expect(sut.inputValue).toBe('01.01.2020');
    expect(onChange).not.toHaveBeenCalled();
    expect(onTouched).not.toHaveBeenCalled();
  });

  it('invalid writeValue clears inputValue', () => {
    sut.writeValue('otto');

    expect(sut.inputValue).toBe('');
    expect(onChange).not.toHaveBeenCalled();
    expect(onTouched).not.toHaveBeenCalled();
  });

  it('expect disabled to be true', () => {
    sut.setDisabledState(true);
    expect(sut.disabled).toBeTrue();
  });

  it('expect value set by onFocusOut', () => {
    sut.writeValue('01.01.2020');
    sut.onFocusOut();
    expect(sut.inputValue).toBe('01.01.2020');
  });

  it('expect value set by onNgModelChange', () => {
    sut.onNgModelChange('01.01.2020');
    expect(sut.inputValue).toBe('01.01.2020');
  });
});
