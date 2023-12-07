import {Directive, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

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
export class FileUploadDirective {

}
