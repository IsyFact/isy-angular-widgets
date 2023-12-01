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
    expect(form.controls.control.valid).toBeTrue();
    expect(form.controls.control.value).toEqual('testValue');
  });

  it('form should not be dirty', () => {
    expect(form.dirty).toBeFalse();
  });

  it('form should be reseted', () => {
    let isValid = form.controls.control.valid;
    expect(isValid).toBeTrue();

    resetForm(form);

    isValid = form.controls.control.valid;
    expect(isValid).toBeFalse();
  });

  it('form control should be dirty', () => {
    expect(form.controls.control.dirty).toBeFalse();
    markFormControlAsDirty(form.controls.control);
    expect(form.controls.control.dirty).toBeTrue();
  });

  it('form should be dirty', () => {
    expect(form.controls.control.dirty).toBeFalse();
    markFormAsDirty(form);
    expect(form.controls.control.dirty).toBeTrue();
  });
});
