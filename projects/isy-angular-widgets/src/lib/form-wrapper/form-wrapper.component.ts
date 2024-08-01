import {Component, Input, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

/**
 * A component that wraps form controls and displays validation messages.
 * It requires the usage of reactive forms and supports standalone usage.
 * @example
 * ```html
 * <form [formGroup]="myForm">
 *   <isy-form-wrapper
 *     label="Email"
 *     fieldId="email"
 *     [control]="myForm.controls.email| formControl"
 *     [validationMessages]="{
 *       'required': 'Email is required',
 *       'email': 'Please enter a valid email address'
 *     }">
 *     <input
 *        id="email"
 *        formControlName="email"
 *        class="w-full"
 *        type="text"
 *        pInputText
 *     />
 *   </isy-form-wrapper>
 * </form>
 * ```
 * Ensure you have imported `ReactiveFormsModule` in your module:
 * ```typescript
 * import { ReactiveFormsModule } from '@angular/forms';
 * ```
 */
@Component({
  selector: 'isy-form-wrapper',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.scss']
})
export class FormWrapperComponent implements OnInit {
  @Input() label!: string;
  @Input() fieldId!: string;
  @Input() control!: FormControl;
  @Input() validationMessages: {[key: string]: string} = {};
  @Input() ifta: boolean = false;

  /**
   * Validates the control input on component initialization.
   * Throws an error if control is missing or not an instance of FormControl.
   */
  ngOnInit(): void {
    if (!this.control || !(this.control instanceof FormControl)) {
      throw new Error('control Input is required and must be an instance of FormControl');
    }
  }

  /**
   * Computes and returns the appropriate error message.
   * Iterates over control errors and matches them with custom validation messages.
   * @returns string | null The error message or null if no errors.
   */
  get errorMessage(): string | null {
    if (this.control.errors) {
      const errors = this.control.errors;
      for (const errorName in errors) {
        if (errors.hasOwnProperty(errorName)) {
          return this.validationMessages[errorName];
        }
      }
    }
    return null;
  }

  /**
   * Returns the CSS class for the label based on the current state.
   * @returns The CSS class for the label.
   */
  get labelOptionClass(): string {
    return this.ifta ? ' ifta' : ' static-label';
  }

  /**
   * Returns the CSS class for the label based on the value of the control.
   * If the control value is truthy, it returns 'label--filled',
   * otherwise it returns ''.
   * @returns The CSS class for the label.
   */
  get labelFilledClass(): string {
    return this.control.value && this.ifta ? ' label--filled' : '';
  }

  /**
   * Retrieves the label for the form wrapper component.
   * If the label is required, it appends an asterisk (*) to the label.
   * @returns The label for the form wrapper component.
   */
  getLabel(): string {
    return this.isRequired() ? `${this.label} *` : this.label;
  }

  /**
   * Determines whether the error message should be shown.
   * The error message should be shown if:
   * - The errorMessage is not null or empty
   * - The control is invalid
   * - The control has been touched
   * @returns A boolean value indicating whether the error message should be shown.
   */
  shouldShowError(): boolean {
    return this.errorMessage !== null && this.errorMessage !== '' && this.control.invalid && this.control.touched;
  }

  /**
   * Computes and returns the information about the required state
   * @returns the required state
   */
  isRequired(): boolean {
    const result = Object.keys(this.validationMessages).filter((value) => value.includes('required'));
    return result.length > 0;
  }
}
