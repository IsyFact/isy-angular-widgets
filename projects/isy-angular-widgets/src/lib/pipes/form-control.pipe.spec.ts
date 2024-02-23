import {FormControlPipe} from './form-control.pipe';
import {FormControl, AbstractControl} from '@angular/forms';

describe('FormControlPipe', () => {
  let pipe: FormControlPipe;

  beforeEach(() => {
    pipe = new FormControlPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should cast AbstractControl to FormControl', () => {
    const control = new FormControl();
    const result: FormControl = pipe.transform(control as AbstractControl);
    expect(result).toEqual(control);
    expect(result instanceof FormControl).toBe(true);
  });
});
