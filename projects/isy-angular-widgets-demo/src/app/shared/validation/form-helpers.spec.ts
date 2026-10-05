import {FormControl, FormGroup} from '@angular/forms';
import {required} from './validator';
import {markFormAsDirty, markFormControlAsDirty, resetForm} from './form-helper';

describe('Unit Tests: form-helper', () => {
  let form!: FormGroup;

  beforeEach(() => {
    form = new FormGroup({
      control: new FormControl('testValue', [required])
    });
    form.markAllAsTouched();
  });

  it('form should be created', () => {
    expect(form).not.toBeUndefined();
    expect(form.controls.control).not.toBeUndefined();
    expect(form.controls.control.valid).toBe(true);
    expect(form.controls.control.value).toEqual('testValue');
  });

  it('form should not be dirty', () => {
    expect(form.dirty).toBe(false);
  });

  it('form should be reseted', () => {
    let isValid = form.controls.control.valid;
    expect(isValid).toBe(true);

    resetForm(form);

    isValid = form.controls.control.valid;
    expect(isValid).toBe(false);
  });

  it('form control should be dirty', () => {
    expect(form.controls.control.dirty).toBe(false);
    markFormControlAsDirty(form.controls.control);
    expect(form.controls.control.dirty).toBe(true);
  });

  it('form should be dirty', () => {
    expect(form.controls.control.dirty).toBe(false);
    markFormAsDirty(form);
    expect(form.controls.control.dirty).toBe(true);
  });
});
