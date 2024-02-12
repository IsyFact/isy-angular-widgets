import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
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
export class IncompleteDateComponent implements ControlValueAccessor, Validator, OnInit, AfterViewInit, OnDestroy {
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

  @Input() inputId?: string;

  inputClass = 'w-full';

  /**
   * Currently displayed date string
   */
  inputValue: string = '';

  // To align with PrimeNG API
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onInput: EventEmitter<Event> = new EventEmitter<Event>();

  @ViewChild(InputMask) field?: InputMask;

  classMutationObserver?: MutationObserver;

  /**
   * Default constructor
   * @param incompleteDateService The service that contains date transformation logic
   * @param element The ElementRef representing the host element
   */
  constructor(
    private incompleteDateService: IncompleteDateService,
    private element: ElementRef
  ) {}

  ngAfterViewInit(): void {
    const element = this.element.nativeElement as HTMLElement;

    // Observe changes in the DOM using MutationObserver
    this.classMutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Check if the 'class' attribute has changed
        if (mutation.attributeName === 'class') this.inputClass = element.className + ' w-full';
      });
    });

    // Start observing the target element for attribute changes
    this.classMutationObserver.observe(element, {attributes: true});
  }

  ngOnDestroy(): void {
    // Disconnect the MutationObserver to avoid memory leaks
    this.classMutationObserver?.disconnect();
  }

  /**
   * Initializes readonly and disabled properties
   */
  ngOnInit(): void {
    // Enable syntax <isy-incomplete-date readonly /> (isReadOnly has value "" which is true as boolean)
    this.readonly = this.readonly || '' === (this.readonly as unknown);
    this.disabled = this.disabled || '' === (this.disabled as unknown);
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
   * Autocompletes the day and month input based on the cursor position and key pressed.
   * If the dot key ('.') is pressed without a preceding number, it inserts "xx" to represent an uncertain day or month.
   * If the dot key is pressed after a single digit, it autocompletes to a two-digit format (e.g., '1.' becomes '01').
   * If the dot key is pressed when the cursor is at position 3 and the day is fully entered (i.e., two digits), the completion is ignored.
   * Otherwise, it autocompletes the day.
   * @param event KeyboardEvent
   */
  onKeydown(event: Event): void {
    const dayPartEndPos = 3;
    const monthPartEndPos = 6;
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart!;

    if (!(event instanceof KeyboardEvent) || event.key !== '.' || cursorPosition >= monthPartEndPos) return;

    const [day, month, year] = input.value.split('.');
    let partDay = `${day}`;
    let partMonth = `${month}`;
    const partDayReplaced = partDay.replace(/_/g, '');
    const partMonthReplaced = partMonth.replace(/_/g, '');
    const dateUnspecifiedChar = 'x';

    if (partDayReplaced.length <= 1) partDay = this.transformDatePart(partDay, dateUnspecifiedChar);

    if (cursorPosition >= dayPartEndPos && cursorPosition < monthPartEndPos && partMonthReplaced.length <= 1) {
      partDay = partDayReplaced.length === 0 ? dateUnspecifiedChar.repeat(partDay.length) : partDay;
      if (cursorPosition > dayPartEndPos) partMonth = this.transformDatePart(partMonth, dateUnspecifiedChar);
    }

    const dateStr = [partDay, partMonth, year].join('.');
    input.value = this.inputValue = dateStr;

    const newCursorPosition = this.calculateNewCursorPosition(cursorPosition);
    input.setSelectionRange(newCursorPosition, newCursorPosition);

    if (newCursorPosition !== dayPartEndPos && partDay !== day) this.onChange(this.inputValue);
  }

  /**
   * Calculates the new cursor position
   * @param cursorPosition as a number
   * @returns newCursorPosition as a number
   */
  private calculateNewCursorPosition(cursorPosition: number): number {
    let newCursorPosition = cursorPosition;
    const cursorPositionAtFirstDayLetter = 0;
    const cursorPositionAtSecondDayLetter = 1;
    const cursorPositionAtDotAfterDayLetter = 2;
    const cursorPositionAtSecondMonthLetter = 4;
    const cursorPositionAtDotAfterMonthLetter = 5;
    const onePosition = 1;
    const twoPositions = 2;
    const threePositions = 3;

    switch (newCursorPosition) {
      case cursorPositionAtFirstDayLetter:
        newCursorPosition += threePositions;
        break;
      case cursorPositionAtSecondDayLetter:
      case cursorPositionAtSecondMonthLetter:
        newCursorPosition += twoPositions;
        break;
      case cursorPositionAtDotAfterDayLetter:
      case cursorPositionAtDotAfterMonthLetter:
        newCursorPosition += onePosition;
        break;
    }

    return newCursorPosition;
  }

  /**
   * Transforms a part of a date string
   * @param partOfDate part of a date as a string
   * @param char unspecified character as a string
   * @returns transformed part of a date
   */
  transformDatePart(partOfDate: string, char: string): string {
    const partOfDateReplaced = partOfDate.replace(/_/g, '');

    return partOfDateReplaced === char || partOfDateReplaced.length === 0
      ? char.repeat(partOfDate.length)
      : '0' + partOfDateReplaced;
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
    this.inputValue = this.incompleteDateService.transformValue(this.inputValue, this.dateInPastConstraint);
    const input = this.field?.inputViewChild!.nativeElement as HTMLInputElement;
    input.value = this.inputValue;

    if (this.inputValue.includes('_')) input.value = '';

    this.onTouched();
    this.onChange(this.inputValue);
  }

  onInputChange(event: Event): void {
    this.onInput.emit(event);
  }

  /**
   * Reports the value back to the parent form
   * Calls the given function on component change
   * @param fn The function to be called on component change
   */
  registerOnChange(fn: unknown): void {
    this.onChange = fn as () => unknown;
  }

  /**
   * Reports to the parent form that the control was touched
   * Calls the given function on component touch
   * @param fn The function to be called on component touch
   */
  registerOnTouched(fn: unknown): void {
    this.onTouched = fn as () => unknown;
  }

  /**
   * Transmits the state (enabled/disabled) to the form control
   * Enables or disables the component
   * @param isDisabled True to disable the component; false to enable the component
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange: (_: unknown) => unknown = () => {};

  onTouched: () => void = () => {};
}
