import {Directive, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {FileUpload} from 'primeng/fileupload';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'p-fileUpload[formControlName], p-fileUpload[formControl]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadDirective),
      multi: true
    }
  ]
})
export class FileUploadDirective implements ControlValueAccessor {

  constructor(private fileUpload: FileUpload) {}

  writeValue(value: unknown): void {
    console.log(value);
    // update the model and changes logic goes here
  }

  registerOnChange(fn: unknown): void {
    // notify the outside world about changes (when the user interacts with the input)
    this.fileUpload.onUpload.subscribe(fn);
  }

  registerOnTouched(fn: unknown): void {
    // here goes the touch logic
    this.fileUpload.onClear.subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.fileUpload.disabled = isDisabled;
  }
}
