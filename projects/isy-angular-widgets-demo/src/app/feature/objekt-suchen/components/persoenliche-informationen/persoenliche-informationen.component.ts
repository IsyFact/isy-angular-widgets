import {Component, Input} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {markFormControlAsDirty} from '../../../../shared/validation/form-helper';

/**
 * The component who is user for the demo presentation of the second screen of the wizard
 */
@Component({
  selector: 'demo-persoenliche-informationen',
  templateUrl: './persoenliche-informationen.component.html',
  standalone: false
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
