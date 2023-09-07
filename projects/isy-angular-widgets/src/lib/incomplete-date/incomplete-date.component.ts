/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */

import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';
import {IncompleteDateService} from './incomplete-date.service';
import {Validation} from '../validation/validation';

/**
 * This component is used to input complete and incomplete dates.
 * To enter an unknown day or month,  `0` or `x` can be used.
 *
 * The format DD.MM.YYYY is supported by the widget
 *
 *
 * If only past dates are allowed (e.g. for already born persons),
 * the property `dateInPastConstraint` can be set to `true`via binding.
 *
 */
@Component({
  selector: 'isy-incomplete-date',
  templateUrl: './incomplete-date.component.html',
  styleUrls: ['./incomplete-date.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IncompleteDateComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IncompleteDateComponent),
      multi: true
    }
  ]
})
export class IncompleteDateComponent implements ControlValueAccessor, Validator,  OnInit {

  /**
   * A disabled date picker can't be opened.
   */
  @Input() disabled = false;

  /**
   * Determines whether the date picker takes input.
   */
  @Input() readonly = false;

  /**
   * The placeholder for the input element.
   */
  @Input() placeholder = '';

  /**
   * Currently displayed date string
   */
  inputValue: string = '';

  /**
   * Default constructor
   * @param incompleteDateService The service that contains date transformation logic
   */
  constructor(private incompleteDateService: IncompleteDateService) {
  }

  /**
   * Initializes readonly and disabled properties
   */
  ngOnInit(): void {
    // Enable syntax <isy-incomplete-date readonly /> (isReadOnly has value "" which is true as boolean)
    this.readonly = this.readonly || '' === (this.readonly as any);
    this.disabled = this.disabled || '' === (this.disabled as any);
  }

  /**
   * Checks that the date is a valid unspecified date or valid date in german format DD.MM.YYYY.
   * If the date in german format is not valid and not unspecified, a "UNSPECIFIEDDATE" error is thrown. 
   * E.g. unspecified dates: 00.MM.YYYY, 00.00.YYYY, 00.00.0000, xx.MM.YYYY, xx.xx.YYYY, xx.xx.xxxx
   * For valid or valid unspecified dates, no error is thrown.
   * @param c The control element the validator is appended to
   * @returns The object {UNSPECIFIEDDATE: true} if the validation fails; null otherwise
   */
  validate(c: AbstractControl): ValidationErrors | null {
    return Validation.validUnspecifiedDate(c);
  }

  /**
   * Called by the Forms module to write a value into a form control
   * @param value The new value
   */
  writeValue(value: string): void {
    this.inputValue = value;
  }

  /**
   * Transforms the input value if necessary and updates it when user completes the mask pattern
   */
  onComplete(): void {
    this.inputValue = this.incompleteDateService.transformValue(this.inputValue);
    this.onChange(this.inputValue);
  }

  /**
   * Reports the value back to the parent form
   * Calls the given function on component change
   * @param fn The function to be called on component change
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Reports to the parent form that the control was touched
   * Calls the given function on component touch
   * @param fn The function to be called on component touch
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Transmits the state (enabled/disabled) to the form control
   * Enables or disables the component
   * @param isDisabled True to disable the component; false to enable the component
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange: Function = (_: any) => {};

  onTouched: Function = () => {}; 

}
