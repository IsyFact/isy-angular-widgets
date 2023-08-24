/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */

import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {IncompleteDateService} from './incomplete-date.service';

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
    }
  ]
})
export class IncompleteDateComponent implements ControlValueAccessor, OnInit {

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
   * Decides whether only past dates are allowed
   */
  @Input() dateInPastConstraint = true;

  /**
   * FormControl / ngModel Value of the host component, actual output
   */
  private outputValue: string = '';

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
   * Transforms and saves a value according to the display format
   * @param val The new value
   */
  writeValue(val: string): void {
    this.inputValue = this.incompleteDateService.transformValue(val);
  }

  /**
   * Updates input and output value according the format configuration
   * @param value The new value
   */
  onNgModelChange(value: string): void {
    this.inputValue = value;
    this.outputValue = this.incompleteDateService.transformValue(
      value,
      this.dateInPastConstraint
    );
    this._onChange(this.outputValue);
  }

  /**
   * Calls the given function on component change
   * @param fn The function to be called on component change
   */
  registerOnChange(fn: Function): void {
    this._onChange = fn;
  }

  /**
   * Calls the given function on component touch
   * @param fn The function to be called on component touch
   */
  registerOnTouched(fn: Function): void {
    this._onTouched = fn;
  }

  /**
   * Enables or disables the component
   * @param isDisabled True to disable the component; false to enable the component
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Transforms the current input according to configuration on losing the focus
   */
  onFocusOut(): void {
    this.inputValue = this.incompleteDateService.transformValue(
      this.inputValue,
      this.dateInPastConstraint
    );
    this._onTouched();
  }

  private _onChange: Function = (_: unknown) => {
    /*Empty*/
  };
  private _onTouched: Function = () => {
    /*Empty*/
  };
}
