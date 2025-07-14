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
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {IncompleteDateService} from './incomplete-date.service';
import {Validation} from '../validation/validation';
import {InputMask, InputMaskModule} from 'primeng/inputmask';
import {InputTextModule} from 'primeng/inputtext';

enum CursorPosition {
  DayFirstDigit = 0,
  DaySecondDigit = 1,
  DotAfterDay = 2,
  MonthSecondDigit = 4,
  DotAfterMonth = 5
}

const CURSOR_SHIFT = {
  Small: 1,
  Medium: 2,
  Large: 3
};

@Component({
  standalone: true,
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
  ],
  imports: [FormsModule, InputTextModule, InputMaskModule]
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
   * The label for the input element.
   */
  @Input() inputLabel = '';

  /**
   * The placeholder for the input element.
   */
  @Input() placeholder = '';

  /**
   * Decides whether only past dates are allowed (century switch - instead of 2050 e.g. 1950)
   */
  @Input() dateInPastConstraint = false;

  @Input() inputId?: string;

  /**
   * Currently displayed date string
   */
  inputValue: string = '';

  /**
   * Specifies whether to transfer the date value in ISO 8601 format.
   * If set to true, the date value will be transferred in ISO 8601 format (YYYY-MM-DD).
   * If set to false, the date value will be transferred in German date format (DD.MM.YYYY).
   */
  @Input() transferISO8601 = false;

  /**
   * @deprecated using the format "00.00.0000" for unknown dates is deprecated and will be removed in the future. Use "xx.xx.xxxx" instead.
   */
  @Input() allowZeroFormat = false;

  // ISO string data-side date format
  transferValue?: string;

  // To align with PrimeNG API
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onInput: EventEmitter<Event> = new EventEmitter<Event>();

  @ViewChild(InputMask) field?: InputMask;

  @ViewChild('p-inputmask') inputMask!: ElementRef;

  classMutationObserver?: MutationObserver;
  lastKeyPressed: string = '';
  lastInputElement: HTMLInputElement | null = null;

  /**
   * Default constructor
   * @param incompleteDateService The service that contains date transformation logic
   * @param element The ElementRef representing the host element
   */
  constructor(
    private readonly incompleteDateService: IncompleteDateService,
    private readonly element: ElementRef
  ) {}

  ngAfterViewInit(): void {
    const element = this.element.nativeElement as HTMLElement;

    // Observe changes in the DOM using MutationObserver
    this.classMutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Check if the 'class' attribute has changed
        if (mutation.attributeName === 'class') {
          const isInvalid = element.className.includes('ng-invalid');
          element.querySelector('p-inputmask')?.classList.remove(isInvalid ? 'ng-valid' : 'ng-invalid');
          if (isInvalid) element.querySelector('p-inputmask')?.classList.add('ng-invalid', 'ng-dirty');
        }
      });
    });

    // Start observing the target element for attribute changes
    this.classMutationObserver.observe(element, {attributes: true});

    if (this.transferISO8601) this.onChange(this.inputValue);
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
    this.readonly = this.readonly || this.readonly === ('' as unknown);
    this.disabled = this.disabled || this.disabled === ('' as unknown);
  }

  /**
   * If `transferISO8601` is true, it calls `Validation.validUnspecifiedISODate` to validate the control.
   * Otherwise, it calls `Validation.validUnspecifiedDate` to validate the control.
   * The Validation checks that the date is a valid unspecified date or valid date in German format DD.MM.YYYY resp. ISO 8601 YYYY-MM-DD.
   * If the date is invalid and not unspecified, a `INVALIDUNSPECIFIEDISODATE` resp. `INVALIDUNSPECIFIEDISODATE` error is thrown.
   * If the year is '0000' and `allowZeroFormat` is false, a `INVALIDUNSPECIFIEDISODATE` resp. `INVALIDUNSPECIFIEDISODATE` error is thrown.
   * E.g. unspecified dates: 00.MM.YYYY, 00.00.YYYY, 00.00.0000, xx.MM.YYYY, xx.xx.YYYY, xx.xx.xxxx,
   * YYYY-MM-00, YYYY-00-00, 0000-00-00, YYYY-MM-xx, YYYY-xx-xx, xxxx-xx-xx
   * For valid or valid unspecified dates, no error is thrown.
   * @param c The abstract control to validate.
   * @returns A `ValidationErrors` object if the control is invalid, otherwise null.
   */
  validate(c: AbstractControl): ValidationErrors | null {
    return this.transferISO8601
      ? Validation.validUnspecifiedISODate(c, this.allowZeroFormat)
      : Validation.validUnspecifiedDate(c, this.allowZeroFormat);
  }

  /**
   * Called by the Forms module to write a value into a form control
   * @param value The new value
   */
  writeValue(value: string): void {
    this.inputValue = value;
  }

  /**
   * Handles the keydown event for the input element.
   * Stores the last key pressed and the input element that triggered the event.
   * @param event - The keyboard event triggered by the user.
   */
  onKeydown(event: Event): void {
    this.lastKeyPressed = (event as KeyboardEvent).key;
    this.lastInputElement = event.target as HTMLInputElement;
  }

  /**
   * Handles changes to the date input model, updating the input value and cursor position as needed.
   * This method processes the input value when the user interacts with the date field, specifically
   * when editing the day or month parts. It replaces incomplete day or month values with a specified
   * character if necessary, updates the input field, and recalculates the cursor position to ensure
   * a smooth user experience.
   * @param value - The current value of the date input in the format "DD.MM.YYYY".
   */
  onModelChange(value: string): void {
    const input = this.lastInputElement;

    if (!input) return;

    const cursorPos = input.selectionStart ?? 0;
    const [day = '', month = '', year = ''] = value.split('.');
    let partDay = day;
    let partMonth = month;
    const dayClean = day.replace(/_/g, '');
    const monthClean = month.replace(/_/g, '');
    const unspecifiedChar = 'x';

    this.inputValue = value;

    const isInDayOrMonthRange = this.lastKeyPressed === '.' && cursorPos <= (CursorPosition.DotAfterMonth as number);

    if (isInDayOrMonthRange) {
      if (dayClean.length <= 1) partDay = this.transformDatePart(day, unspecifiedChar);

      if (
        cursorPos >= (CursorPosition.DotAfterDay as number) + 1 &&
        cursorPos <= (CursorPosition.DotAfterMonth as number) &&
        monthClean.length <= 1
      ) {
        if (cursorPos > (CursorPosition.DotAfterDay as number) + 1)
          partMonth = this.transformDatePart(month, unspecifiedChar);
      }

      const result = [partDay, partMonth, year].join('.');
      input.value = this.inputValue = result;

      const newCursor = this.calculateNewCursorPosition(cursorPos);
      input.setSelectionRange(newCursor, newCursor);
    }
  }

  /**
   * Calculates the new cursor position
   * @param position as a number
   * @returns position as a number
   */
  calculateNewCursorPosition(position: CursorPosition): number {
    switch (position) {
      case CursorPosition.DayFirstDigit:
        return position + CURSOR_SHIFT.Large;
      case CursorPosition.DaySecondDigit:
      case CursorPosition.MonthSecondDigit:
        return position + CURSOR_SHIFT.Medium;
      case CursorPosition.DotAfterDay:
      case CursorPosition.DotAfterMonth:
        return position + CURSOR_SHIFT.Small;
      default:
        return position;
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

    return partOfDateReplaced === char || partOfDateReplaced.length === 0
      ? char.repeat(partOfDate.length)
      : '0' + partOfDateReplaced;
  }

  /**
   * Transforms the input value if necessary and updates it when user completes the mask pattern
   */
  onComplete(): void {
    this.inputValue = this.incompleteDateService.transformValue(
      this.inputValue,
      this.dateInPastConstraint,
      this.allowZeroFormat
    );
    this.updateModel();
  }

  /**
   * Transforms the current input on losing the focus
   */
  onBlur(): void {
    if (this.inputValue) {
      this.inputValue = this.incompleteDateService.transformValue(
        this.inputValue,
        this.dateInPastConstraint,
        this.allowZeroFormat
      );
    }

    const inputEl = this.field?.inputViewChild!.nativeElement as HTMLInputElement;
    if (inputEl) {
      inputEl.value = this.inputValue;
      if (this.inputValue.includes('_')) {
        inputEl.value = this.inputValue = '';
      }
    }

    this.onTouched();
    this.updateModel();
  }

  onInputChange(event: Event): void {
    this.onInput.emit(event);
  }

  /**
   * Updates the internal model by converting the current input value to the transfer date format
   * and propagates the change to registered listeners.
   */
  updateModel(): void {
    this.transferValue = this.convertToTransferDateFormat(this.inputValue);
    this.onChange(this.transferValue);
  }

  /**
   * Reports the value back to the parent form
   * Calls the given function on component change
   * @param fn The function to be called on component change
   */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = (value): void => {
      this.transferValue = this.convertToTransferDateFormat(value);
      fn(this.transferValue);
    };
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

  /**
   * Converts the given value to the transfer date format.
   * If `transferISO8601` is true, the value is expected to be in the format "dd.mm.yyyy".
   * Otherwise, the original value is returned.
   * @param value - The value to convert.
   * @returns The converted value in the format "yyyy-mm-dd" if `transferISO8601` is true, otherwise the original value.
   */
  convertToTransferDateFormat(value: string): string {
    if (!this.transferISO8601) return value;

    const [day, month, year] = value.split('.');
    return `${year}-${month}-${day}`;
  }

  onChange: (value: string) => unknown = () => {};

  onTouched: () => void = () => {};
}
