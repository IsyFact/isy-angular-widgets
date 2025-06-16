import {Pipe, PipeTransform} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';

@Pipe({
  name: 'formControl'
})
export class FormControlPipe implements PipeTransform {
  /*
   * Transforms the input value (AbstractControl) into a FormControl.
   *
   * @param value An instance of AbstractControl, which is the parent type for form controls in Angular.
   * @return The input value cast as a FormControl, allowing access to FormControl properties and methods.
   */
  transform(value: AbstractControl): FormControl {
    return value as FormControl;
  }
}
