import {AbstractControl, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {IncompleteDateComponent} from './incomplete-date.component';
import {Validation} from '@isy-angular-widgets/public-api';
import {InputMask} from 'primeng/inputmask';

enum CursorPosition {
  DayFirstDigit = 0,
  DaySecondDigit = 1,
  DotAfterDay = 2,
  MonthSecondDigit = 4,
  DotAfterMonth = 5
}

describe('Integration Tests: IncompleteDateComponent', () => {
  let component: IncompleteDateComponent;
  let onChange: (value: string) => void = () => {};
  let onTouched: unknown = () => {};
  let input: HTMLInputElement;
  const keyEvent = new KeyboardEvent('keydown', {
    key: '.',
    code: '190'
  });
  const errorKey = 'INVALIDUNSPECIFIEDDATE';
  let spectator: Spectator<IncompleteDateComponent>;
  const createComponent = createComponentFactory({
    component: IncompleteDateComponent,
    imports: [IncompleteDateComponent]
  });

  /**
   * Initialize test
   */
  function init(): void {
    onChange = jasmine.createSpy('onChange spy');
    onTouched = jasmine.createSpy('onTouched spy');
    component.registerOnChange(onChange);
    component.registerOnTouched(onTouched);
  }

  /**
   * Sets up and simulates a keyboard event on the input element for testing purposes.
   * This function updates the input value, dispatches the provided keyboard event,
   * sets the cursor position, updates component properties related to the last input,
   * and triggers relevant component methods to reflect the changes.
   * @param keyEvent - The keyboard event to dispatch on the input element.
   * @param value - The value to set on the input element before dispatching the event.
   * @param cursorPosition - The position to set the cursor within the input element.
   */
  function setupEvent(keyEvent: KeyboardEvent, value: string, cursorPosition: number): void {
    input.value = value;
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(cursorPosition, cursorPosition);

    component.lastInputElement = input;
    component.lastKeyPressed = keyEvent.key;
    component.onKeydown(keyEvent);
    component.onModelChange(value);
    spectator.detectChanges();
  }

  /**
   * Simulates typing a sequence of keys into an input field with a date mask.
   * This function sets the initial value of the input to a date mask (`'__.__.____'`),
   * focuses the input, and then iterates over the provided sequence of keys.
   * For each key, it creates a `KeyboardEvent`, calculates the correct cursor position,
   * and updates the input value accordingly, skipping over dot separators in the mask.
   * @param sequence - An array of string keys to simulate typing into the input field.
   */
  function typeSequence(sequence: string[]): void {
    const mask = '__.__.____';
    component.writeValue(mask);
    input.value = mask;
    input.focus();

    let cursorPosition = 0;

    sequence.forEach((key) => {
      const keyEvent = new KeyboardEvent('keydown', {key});

      while (
        cursorPosition === (CursorPosition.DotAfterDay as number) ||
        cursorPosition === (CursorPosition.DotAfterMonth as number)
      ) {
        cursorPosition++;
      }

      const inserted = key === '.' ? '.' : key;
      const newCursorPosition = cursorPosition === 4 ? cursorPosition - 1 : cursorPosition;
      const left = input.value.substring(0, newCursorPosition);
      const newValue = left + inserted;
      const nextCursor = cursorPosition + 1;
      setupEvent(keyEvent, newValue, nextCursor);
      cursorPosition = nextCursor;
    });
  }

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    init();
    input = spectator.query('p-inputmask .p-inputmask') as HTMLInputElement;
  });

  it('NG_VALUE_ACCESSOR should be covered', () => {
    const valueAccessor = spectator.fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);
    spectator.fixture.detectChanges();
    expect(valueAccessor).not.toBeUndefined();
  });

  it('NG_VALIDATORS should be covered', () => {
    const validators = spectator.fixture.debugElement.injector.get(NG_VALIDATORS);
    spectator.fixture.detectChanges();
    expect(validators).not.toBeUndefined();
  });

  const testCases0 = [{sequence: ['0', '1', '.', '0', '1', '.', '2', '0', '2', '4'], expected: '01.01.2024'}];

  testCases0.forEach(({sequence, expected}) => {
    it(`should autocomplete ${JSON.stringify(sequence)} to ${expected}`, () => {
      input.value = '';
      typeSequence(sequence);
      expect(input.value).toBe(expected);
    });
  });

  it('should transform the input value on losing the focus to "" when input value contains "_"', () => {
    component.inputValue = 'xx.__.____';
    spectator.fixture.detectChanges();
    component.onBlur();
    expect(input.value).toBe('');
  });

  it('should emit an event on input change', () => {
    const onInputSpy = spyOn(component.onInput, 'emit');

    component.inputValue = 'xx.__.____';
    spectator.fixture.detectChanges();

    input.dispatchEvent(keyEvent);
    component.onInputChange(keyEvent);
    spectator.fixture.detectChanges();

    expect(onInputSpy).toHaveBeenCalledWith(keyEvent);
  });

  const testCases1 = [
    {inputVal: '__.__.____', cursor: 0, expected: 'xx.__.____'},
    {inputVal: '__.__.____', cursor: 1, expected: 'xx.__.____'},
    {inputVal: '__.__.____', cursor: 2, expected: 'xx.__.____'},
    {inputVal: '__.__.____', cursor: 3, expected: 'xx.__.____'},
    {inputVal: '__.__.____', cursor: 4, expected: 'xx.xx.____'},
    {inputVal: '__.__.____', cursor: 5, expected: 'xx.xx.____'},
    {inputVal: 'x_.__.____', cursor: 1, expected: 'xx.__.____'},
    {inputVal: '_x.__.____', cursor: 2, expected: 'xx.__.____'},
    {inputVal: '__.x_.____', cursor: 4, expected: 'xx.xx.____'},
    {inputVal: '__._x.____', cursor: 5, expected: 'xx.xx.____'},
    {inputVal: 'x_.x_.____', cursor: 1, expected: 'xx.x_.____'},
    {inputVal: '_x.x_.____', cursor: 2, expected: 'xx.x_.____'},
    {inputVal: '1_.__.____', cursor: 1, expected: '01.__.____'},
    {inputVal: '_1.__.____', cursor: 2, expected: '01.__.____'},
    {inputVal: '__.1_.____', cursor: 4, expected: 'xx.01.____'},
    {inputVal: '__._1.____', cursor: 5, expected: 'xx.01.____'},
    {inputVal: '1_.1_.____', cursor: 1, expected: '01.1_.____'},
    {inputVal: '_1.1_.____', cursor: 2, expected: '01.1_.____'},
    {inputVal: '1_._x.____', cursor: 5, expected: '01.xx.____'},
    {inputVal: '_1._x.____', cursor: 5, expected: '01.xx.____'},
    {inputVal: 'xx.xx.____', cursor: 6, expected: 'xx.xx.____'},
    {inputVal: '01.__.____', cursor: 3, expected: '01.__.____'},
    {inputVal: 'x_.x_.____', cursor: 4, expected: 'xx.xx.____'},
    {inputVal: '_x.x_.____', cursor: 4, expected: 'xx.xx.____'},
    {inputVal: 'x_._x.____', cursor: 5, expected: 'xx.xx.____'},
    {inputVal: '_x._x.____', cursor: 5, expected: 'xx.xx.____'},
    {inputVal: '1_.x_.____', cursor: 4, expected: '01.xx.____'},
    {inputVal: '_1.x_.____', cursor: 4, expected: '01.xx.____'},
    {inputVal: '1_.1_.____', cursor: 4, expected: '01.01.____'},
    {inputVal: '_1.1_.____', cursor: 4, expected: '01.01.____'},
    {inputVal: '1_._1.____', cursor: 5, expected: '01.01.____'},
    {inputVal: '_1._1.____', cursor: 5, expected: '01.01.____'},
    {inputVal: '1_.x_.____', cursor: 1, expected: '01.x_.____'},
    {inputVal: '_1.x_.____', cursor: 2, expected: '01.x_.____'}
  ];

  testCases1.forEach(({inputVal, cursor, expected}) => {
    it(`should autocomplete ${inputVal} at cursor ${cursor} to ${expected}`, () => {
      input.value = inputVal;
      setupEvent(keyEvent, inputVal, cursor);
      expect(input.value).toBe(expected);
    });
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should set valid writeValue to inputValue', () => {
    component.writeValue('01.01.2023');

    expect(component.inputValue).toBe('01.01.2023');
    expect(onChange).not.toHaveBeenCalled();
    expect(onTouched).not.toHaveBeenCalled();
  });

  it('should correctly respond to class attribute changes', () => {
    component.ngAfterViewInit();
    const inputMask = spectator.query('p-inputmask') as HTMLElement;
    const hostElement = spectator.element;
    expect(inputMask.classList.contains('ng-invalid')).toBe(false);
    hostElement.classList.add('ng-invalid');
    // fakesyn and tick do not work
    setTimeout(() => {
      expect(inputMask).toBeTruthy();
      expect(inputMask.classList.contains('ng-invalid')).toBe(true);
    }, 50);
  });

  it('should handle NG_VALUE_ACCESSOR and NG_VALIDATORS', () => {
    expect(spectator.fixture.debugElement.injector.get(NG_VALUE_ACCESSOR)).toBeTruthy();
    expect(spectator.fixture.debugElement.injector.get(NG_VALIDATORS)).toBeTruthy();
  });

  it('should disable the state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTrue();
  });

  it('should set value by onComplete', () => {
    component.writeValue('01.01.2023');
    component.onComplete();
    expect(component.inputValue).toBe('01.01.2023');
  });

  it('should emit input change event', () => {
    const spy = spyOn(component.onInput, 'emit');
    component.inputValue = 'xx.__.____';
    spectator.detectChanges();
    component.onInputChange(keyEvent);
    expect(spy).toHaveBeenCalledWith(keyEvent);
  });

  it('should return null if date is valid', () => {
    const validDateControl: AbstractControl = new FormControl('11.11.2023');
    const errors = component.validate(validDateControl);
    expect(errors).toBeNull();
  });

  it('should return INVALIDUNSPECIFIEDDATE if the day is invalid', () => {
    const control: AbstractControl = new FormControl('50.11.2023');

    const errors = component.validate(control);
    if (!errors) {
      throw new Error('errors is not defined');
    }

    expect(errors[errorKey]).toBeDefined();
  });

  it('should return INVALIDUNSPECIFIEDDATE if the month is invalid', () => {
    const control: AbstractControl = new FormControl('11.50.2023');

    const errors = component.validate(control);
    if (!errors) {
      throw new Error('errors is not defined');
    }

    expect(errors[errorKey]).toBeDefined();
  });

  const testCases2 = [
    {inputVal: '__', fillChar: 'x', expected: 'xx'},
    {inputVal: 'x_', fillChar: 'x', expected: 'xx'},
    {inputVal: '_x', fillChar: 'x', expected: 'xx'},
    {inputVal: '1_', fillChar: 'x', expected: '01'},
    {inputVal: '_1', fillChar: 'x', expected: '01'}
  ];

  testCases2.forEach(({inputVal, fillChar, expected}) => {
    it(`should return the string ${inputVal} correctly transformed`, () => {
      expect(component.transformDatePart(inputVal, fillChar)).toBe(expected);
    });
  });

  it('should return the result from Validation.validUnspecifiedISODate when transferISO8601 is true', () => {
    component.transferISO8601 = true;
    const control = new FormControl();
    const result = component.validate(control);
    expect(result).toEqual(Validation.validUnspecifiedISODate(control, false));
    expect(result).toEqual(Validation.validUnspecifiedISODate(control, true));
  });

  it('should return the result from Validation.validUnspecifiedDate when transferISO8601 is false', () => {
    component.transferISO8601 = false;
    const control = new FormControl();
    const result = component.validate(control);
    expect(result).toEqual(Validation.validUnspecifiedDate(control, false));
    expect(result).toEqual(Validation.validUnspecifiedDate(control, true));
  });

  it('should convert date format to transfer format', () => {
    component.transferISO8601 = true;
    const input = '01.01.2024';
    const expectedOutput = '2024-01-01';
    const result = component.convertToTransferDateFormat(input);
    expect(result).toBe(expectedOutput);
  });

  it('should return the same value if transferISO8601 is false', () => {
    const input = '01.01.2024';
    const result = component.convertToTransferDateFormat(input);
    expect(result).toBe(input);
  });

  it('should clear invalid input on blur', () => {
    component.inputValue = 'xx.__.____';
    component.onBlur();
    expect(input.value).toBe('');
  });

  it('should call onChange method with inputValue if transferISO8601 is true', () => {
    component.transferISO8601 = true;
    component.inputValue = '2022-01-01';
    spyOn(component, 'onChange');
    component.ngAfterViewInit();
    expect(component.onChange).toHaveBeenCalledWith('2022-01-01');
  });

  it('should not produce an error when the input field is empty', () => {
    component.inputValue = '__.__.____';
    component.onBlur();
    const validDateControl: AbstractControl = new FormControl(component.inputValue);
    const errors = component.validate(validDateControl);
    expect(errors).toBeNull();
  });

  it('should validate correctly for valid and invalid values', () => {
    expect(component.validate(new FormControl('11.11.2023'))).toBeNull();
    let errors = component.validate(new FormControl('50.11.2023'));
    expect(errors?.[errorKey]).toBeDefined();
    errors = component.validate(new FormControl('11.50.2023'));
    expect(errors?.[errorKey]).toBeDefined();
  });

  it('should convert date format properly', () => {
    component.transferISO8601 = true;
    expect(component.convertToTransferDateFormat('01.01.2024')).toBe('2024-01-01');
    component.transferISO8601 = false;
    expect(component.convertToTransferDateFormat('01.01.2024')).toBe('01.01.2024');
  });

  const transformTests = [
    {inputVal: '__', char: 'x', expected: 'xx'},
    {inputVal: 'x_', char: 'x', expected: 'xx'},
    {inputVal: '_x', char: 'x', expected: 'xx'},
    {inputVal: '1_', char: 'x', expected: '01'},
    {inputVal: '_1', char: 'x', expected: '01'}
  ];

  transformTests.forEach(({inputVal, char, expected}) => {
    it(`should transform '${inputVal}' with '${char}' to '${expected}'`, () => {
      expect(component.transformDatePart(inputVal, char)).toBe(expected);
    });
  });

  it('should disconnect classMutationObserver on ngOnDestroy', () => {
    const disconnectSpy = jasmine.createSpy('disconnect');
    (component as unknown as {classMutationObserver: {disconnect: () => void}}).classMutationObserver = {
      disconnect: disconnectSpy
    };

    component.ngOnDestroy();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('should update lastKeyPressed and lastInputElement on onKeydown', () => {
    const event = new KeyboardEvent('keydown', {key: '1'});
    Object.defineProperty(event, 'target', {value: input});
    component.onKeydown(event);
    expect(component.lastKeyPressed).toBe('1');
    expect(component.lastInputElement).toBe(input);
  });

  it('should not update inputValue if lastInputElement is null in onModelChange', () => {
    component.lastInputElement = null;
    component.inputValue = '01.01.2024';
    component.onModelChange('01.01.2024');
    expect(component.inputValue).toBe('01.01.2024');
  });

  it('should handle onModelChange for day and month incomplete', () => {
    input.value = '_.01.2024';
    input.setSelectionRange(1, 1);
    component.lastInputElement = input;
    component.lastKeyPressed = '.';
    component.onModelChange('_.01.2024');
    expect(component.inputValue.startsWith('x')).toBeTrue();
  });

  it('should handle onModelChange for month incomplete', () => {
    input.value = '01._1.2024';
    input.setSelectionRange(4, 4);
    component.lastInputElement = input;
    component.lastKeyPressed = '.';
    component.onModelChange('01._1.2024');
    expect(
      component.inputValue.split('.')[1].startsWith('x') || component.inputValue.split('.')[1].startsWith('0')
    ).toBeTrue();
  });

  it('should calculate cursor position correctly', () => {
    expect(component.calculateNewCursorPosition(CursorPosition.DayFirstDigit)).toBe(CursorPosition.DayFirstDigit + 3);
    expect(component.calculateNewCursorPosition(CursorPosition.DaySecondDigit)).toBe(CursorPosition.DaySecondDigit + 2);
    expect(component.calculateNewCursorPosition(CursorPosition.DotAfterDay)).toBe(CursorPosition.DotAfterDay + 1);
    expect(component.calculateNewCursorPosition(99 as CursorPosition)).toBe(99);
  });

  it('should set inputValue to empty if inputValue contains _ onBlur', () => {
    component.inputValue = 'xx.__.____';
    component.field = {inputViewChild: {nativeElement: input}} as unknown as InputMask;
    component.onBlur();
    expect(component.inputValue).toBe('');
    expect(input.value).toBe('');
  });

  it('should update transferValue and call onChange in updateModel', () => {
    const spy = spyOn(component, 'onChange');
    component.inputValue = '01.01.2024';
    component.updateModel();
    expect(component.transferValue).toBe('01.01.2024');
    expect(spy).toHaveBeenCalledWith('01.01.2024');
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTrue();
    component.setDisabledState(false);
    expect(component.disabled).toBeFalse();
  });

  it('should register onChange and call with converted value', () => {
    const fn = jasmine.createSpy('onChange');
    component.transferISO8601 = true;
    component.registerOnChange(fn);
    component.onChange('01.01.2024');
    expect(fn).toHaveBeenCalledWith('2024-01-01');
  });

  it('should register onTouched and call', () => {
    const fn = jasmine.createSpy('onTouched');
    component.registerOnTouched(fn);
    component.onTouched();
    expect(fn).toHaveBeenCalled();
  });
});
