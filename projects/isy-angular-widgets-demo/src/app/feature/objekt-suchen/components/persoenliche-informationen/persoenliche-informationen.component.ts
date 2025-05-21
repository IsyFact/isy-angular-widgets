import {Component, Input} from '@angular/core';
import {AbstractControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {markFormControlAsDirty} from '../../../../shared/validation/form-helper';
import {FormWrapperComponent} from '@isy-angular-widgets/form-wrapper/form-wrapper.component';
import {FormControlPipe} from '@isy-angular-widgets/pipes/form-control.pipe';
import {TranslateModule} from '@ngx-translate/core';
import {InputTextModule} from 'primeng/inputtext';

/**
 * The component who is user for the demo presentation of the second screen of the wizard
 */
@Component({
  standalone: true,
  selector: 'demo-persoenliche-informationen',
  templateUrl: './persoenliche-informationen.component.html',
  imports: [FormWrapperComponent, ReactiveFormsModule, FormControlPipe, TranslateModule, InputTextModule]
})
export class PersoenlicheInformationenComponent {
  /**
   * The internal form of the component
   */
  @Input() form!: FormGroup;

  /**
   * Is called on input field touch
   * @param control The touched form control
   */
  onFormControlFocus(control: AbstractControl<unknown>): void {
    markFormControlAsDirty(control);
  }
}
