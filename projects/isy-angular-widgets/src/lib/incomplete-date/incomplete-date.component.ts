/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */

import {Component, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';
import {IncompleteDateService} from './incomplete-date.service';
import {Validation} from '../validation/validation';
import {InputMask} from 'primeng/inputmask';

/**
 * This component is used to input complete and incomplete dates.
 * To enter an unknown day or month,  `0` or `x` can be used.
 *
 * The format DD.MM.YYYY is supported by the widget
 *
 * == Century switch / Birthdays in the past
 *
 * If only past dates are allowed (e.g. for already born persons),
 * the property `dateInPastConstraint` can be set to `true`via binding.
 *
 * When autocompleting e.g. 10.10.50, 10.10.1950 will be the output instead of 10.10.2050.
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
export class IncompleteDateComponent implements ControlValueAccessor, Validator, OnInit {

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
   * Decides whether only past dates are allowed (century switch - instead of 2050 e.g. 1950)
   */
  @Input() dateInPastConstraint = false;

  /**
   * Currently displayed date string
   */
  inputValue: string = '';

  @ViewChild(InputMask) field?: InputMask;
  
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
   * Autocompletes the input of day and month when entering dot
   * E.g. unspecified dates: x. -> xx, 1. -> 01
   * @param event KeyboardEvent
   */
  onKeydown(event: KeyboardEvent): void {
    let inputMousePosition = (event.target as HTMLInputElement).selectionStart!;
    const dayPartEndPos = 3;
    const monthPartEndPos = 6;

    if (event.key === '.' && inputMousePosition < monthPartEndPos) {
      const input = event.target as HTMLInputElement;
      const [day, month, year] = input.value.split('.');
      let partDay = `${day}`;
      let partMonth = `${month}`;
      const partYear = `${year}`;
      const partDayReplaced = partDay.replace(/_/g, '');
      const partMonthReplaced = partMonth.replace(/_/g, '');
      const dateUnspecifiedChar = 'x';

      if (partDayReplaced.length <= 1) partDay = this.transformDatePart(partDay, dateUnspecifiedChar);

      if (inputMousePosition >= dayPartEndPos && inputMousePosition < monthPartEndPos && partMonthReplaced.length <= 1) {
        partDay = partDayReplaced.length === 0 ? dateUnspecifiedChar.repeat(partDay.length) : partDay;
        partMonth = this.transformDatePart(partMonth, dateUnspecifiedChar);
      }
      
      const dateStr = [partDay, partMonth, partYear].join('.');
      input.value = this.inputValue = dateStr;

      // Mouse position (specific fixed numbers required)
      /* eslint-disable @typescript-eslint/no-magic-numbers */
      switch (inputMousePosition) {
        case 0:
        case 3:
          inputMousePosition += 3;
          break;
        case 1:
        case 4:
          inputMousePosition += 2;
          break;
        case 2:
        case 5:
          inputMousePosition += 1;
          break;
      }
      /* eslint-enable @typescript-eslint/no-magic-numbers */

      input.setSelectionRange(inputMousePosition, inputMousePosition);
      this.onChange(this.inputValue);
    }
  }

  /** 
   * Transforms a part of a date string
   * @param partOfDate part of a date as a string
   * @param char unspecified character as a string
   * @returns transformed part of a date
   */
  transformDatePart(partOfDate: string, char: string): string {
    const partOfDateReplaced = partOfDate.replace(/_/g, '');

    return partOfDateReplaced == char || partOfDateReplaced.length === 0  ? char.repeat(partOfDate.length) : '0' + partOfDateReplaced;
  }

  /**
   * Transforms the input value if necessary and updates it when user completes the mask pattern
   */
  onComplete(): void {
    this.inputValue = this.incompleteDateService.transformValue(this.inputValue);
    this.onChange(this.inputValue);
  }

  /**
   * Transforms the current input on losing the focus
   */
  onBlur(): void {
    this.inputValue = this.incompleteDateService.transformValue(
      this.inputValue,
      this.dateInPastConstraint
    );
    const input = this.field?.inputViewChild.nativeElement as HTMLInputElement;
    input.value = this.inputValue;

    if (this.inputValue.includes('_')) input.value = '';

    this.onTouched();
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
