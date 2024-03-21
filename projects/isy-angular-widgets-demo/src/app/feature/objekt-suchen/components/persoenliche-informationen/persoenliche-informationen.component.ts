import {Component, Input} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {markFormControlAsDirty} from '../../../../shared/validation/form-helper';
import {charsAndMinus} from '../../../../shared/validation/validator';

/**
 * The component who is user for the demo presentation of the second screen of the wizard
 */
@Component({
  selector: 'demo-persoenliche-informationen',
  templateUrl: './persoenliche-informationen.component.html'
})
export class PersoenlicheInformationenComponent {
  /**
   * The internal form of the component
   */
  @Input() form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  /**
   * Is called on input field touch
   * @param control The touched form control
   */
  onFormControlFocus(control: AbstractControl<unknown>): void {
    markFormControlAsDirty(control);
  }

  /**
   * Is called on vorname field focus out event
   */
  onVornameFocusOut(): void {
    if (this.getVornamen().valid) {
      // ToDo: Check Verhalten
      // ToDo: Im HTML Code: Iteration beheben (tricky) - FormControl 'vorname' wird nicht erkannt, obwohl anwesend
      const vornameFormGroup = this.createVornameAsFormGroup();
      const vornamen = this.getVornamen();
      vornamen.push(vornameFormGroup);
      // ToDo: Check, ob Validierung des neuen Feldes aktiv ist, wenn nicht -> vornameFormGroup in die globale methode markFormAsDirty werfen
    }
  }

  getVornamen(): FormArray {
    return this.form.get('vornamen')! as FormArray;
  }

  createVornameAsFormGroup(): FormGroup {
    return this.fb.group({
      vorname: new FormControl('', charsAndMinus)
    });
  }
}
