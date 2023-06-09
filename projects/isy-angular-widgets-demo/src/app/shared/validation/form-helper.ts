import {FormGroup} from '@angular/forms';

/**
 * Marks all fields of a form as dirty.
 * @param form The form whose fields are affected
 */
export function markFormAsDirty(form: FormGroup): void {
  Object.keys(form.controls).forEach(key => {
    form.get(key)!.markAsDirty();
  });
}

/**
 * Marks an array of multiple forms as dirty.
 * @param formArray The form array containing all forms
 */
export function markFormArrayAsDirty(formArray: FormGroup []): void {
  formArray.forEach(form => {
    markFormAsDirty(form);
  });
}

/**
 * Resets the fields of a form and marks it as dirty.
 * @param form The shape to reset
 */
export function resetForm(form: FormGroup): void {
  Object.keys(form.controls).forEach(key => {
    form.controls[key].reset();
    form.controls[key].markAsDirty();
  });
}
