/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */

import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {IncompleteDateService} from './incomplete-date.service';

/**
 * This component is used to input complete and incomplete dates.
 * To enter an unknown day or month,  `0` or `X` can be used.
 *
 * The following formats are supported by the widget (for the example of displayDateFormat:
 * DD.MM.YYYY). Allowed seperators are `-`, `/`, `.` :
 *
 * [cols="1,1", options="header"]
 * |===
 * | Initial Value / Input    | Display
 * | null                     |
 * | undefined                |
 * | test                     | test
 * | test2017                 | test2017
 * | 9999-99-99               | 00.00.9999
 * | 2017                     | 00.00.2017
 * | 072017                   | 00.07.2017
 * | 01072017                 | 01.07.2017
 * | 201707                   | 00.07.2017
 * | 00072017                 | 00.07.2017
 * | XX072017                 | XX.07.2017
 * | 010717                   | 01.07.2017
 * | 00000000                 | 00.00.0000
 * | XXXX0000                 | XX.XX.0000
 * | 01-07-17                 | 01.07.2017
 * | 17-07-01                 | 17.07.2001
 * | 2017-07-01               | 01.07.2017
 * | 2017-07-00               | 00.07.2017
 * | 01/07/2017               | 01.07.2017
 * | 2017/07/01               | 01.07.2017
 * | 2017/00/00               | 00.00.2017
 * | 2017/XX/XX               | XX.XX.2017
 * | 2017/7/1                 | 01.07.2017
 * | 4.9.17                   | 04.09.2017
 * | 04.9.17                  | 04.09.2017
 * | 4.09.17                  | 04.09.2017
 * | 4.9.2017                 | 04.09.2017
 * |===
 *
 * == Century switch / Birthdays in the past
 *
 * If only past dates are allowed (e.g. for already born persons),
 * the property `dateInPastConstraint` can be set to `true`via binding.
 *
 * When autocompleting e.g. 101050, 10.10.1950 will be the output instead of 10.10.2050.
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
   * User-side date format.
   */
  @Input() displayDateFormat = 'DD.MM.YYYY';

  /**
   * Data-side date format.
   */
  @Input() outputValueFormat = 'YYYY-MM-DD';

  /**
   * Decides whether only past dates are allowed (century switch - instead of 2050 e.g. 1950)
   */
  @Input() dateInPastConstraint = false;

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
    this.inputValue = this.incompleteDateService.transformValue(val, this.displayDateFormat);
  }

  /**
   * Updates input and output value according the format configuration
   * @param value The new value
   */
  onNgModelChange(value: string): void {
    this.inputValue = value;
    this.outputValue = this.incompleteDateService.transformValue(
      value,
      this.outputValueFormat,
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
      this.displayDateFormat,
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
