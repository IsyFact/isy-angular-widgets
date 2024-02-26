import {Component, Input, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

/**
 * A component that wraps form controls and displays validation messages.
 * It requires the usage of reactive forms and supports standalone usage.
 */
@Component({
  selector: 'isy-form-wrapper',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-wrapper.component.html'
})
export class FormWrapperComponent implements OnInit {
  @Input() label!: string;
  @Input() fieldId!: string;
  @Input() control!: FormControl;
  @Input() validationMessages: {[key: string]: string} = {};
  @Input() required? = false;

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
}
