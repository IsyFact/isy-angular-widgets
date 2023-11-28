import {AbstractControl, FormGroup} from '@angular/forms';

/**
 * Marks a specific form control as dirty
 * @param control The affected form control
 */
export function markFormControlAsDirty(control: AbstractControl<unknown>): void {
  control.markAsDirty();
}

/**
 * Marks all fields of a form as dirty.
 * @param form The form whose fields are affected
 */
export function markFormAsDirty(form: FormGroup): void {
  Object.keys(form.controls).forEach((key) => {
    form.get(key)!.markAsDirty();
  });
}

/**
 * Resets the fields of a form and marks it as dirty.
 * @param form The shape to reset
 */
export function resetForm(form: FormGroup): void {
  Object.keys(form.controls).forEach((key) => {
    form.controls[key].reset();
  });
}
