import {AbstractControl, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {IncompleteDateComponent} from './incomplete-date.component';
import {Validation} from '@isy-angular-widgets/public-api';
import {InputMask} from 'primeng/inputmask';
import {IncompleteDateService} from './incomplete-date.service';

enum CursorPosition {
  DayFirstDigit = 0,
  DaySecondDigit = 1,
  DotAfterDay = 2,
  MonthSecondDigit = 4,
  DotAfterMonth = 5
}

describe('Integration Tests: IncompleteDateComponent', () => {
  let component: IncompleteDateComponent;
  let spectator: Spectator<IncompleteDateComponent>;
  let onChange: (value: string) => void = () => {};
  let onTouched: unknown = () => {};
  let input: HTMLInputElement;
  const errorKey = 'INVALIDUNSPECIFIEDDATE';

  const createComponent = createComponentFactory({
    component: IncompleteDateComponent,
    imports: [IncompleteDateComponent],
    detectChanges: false,
    providers: [
      {
        provide: IncompleteDateService,
        useValue: {
          transformValue: (v: string): string => v
        }
      }
    ]
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
   * Do NOT patch KeyboardEvent.target (causes "Cannot redefine property: target")
   * For component logic, only lastKeyPressed + lastInputElement are needed.
   * @param key The last key that was pressed (used by the component logic to decide whether to autocomplete).
   * @param value The current input value to apply before triggering the model change logic.
   * @param cursorPosition The cursor position to set on the input before triggering the model change logic.
   */
  function setupEvent(key: string, value: string, cursorPosition: number): void {
    input.value = value;
    input.setSelectionRange(cursorPosition, cursorPosition);

    component.lastInputElement = input;
    component.lastKeyPressed = key;
    component.onModelChange(value);
  }

  /**
   * Types a sequence of keys into the InputMask-backed input and triggers the component's model-change logic
   * after each key press to emulate user typing behavior (including cursor advancement over dot separators).
   * @param sequence Keys to type in order (e.g. digits or '.').
   */
  function typeSequence(sequence: string[]): void {
    const initialDateStr = (input.value = '__.__.____');
    input.focus();

    /*
    The input values are manually set for each key. On each execution of the setupEvent function,
    a sequential key is selected and linked to a corresponding result. This result is then synchronized with the input mask,
    updating the input for the next iteration.
    */
    sequence.forEach((key) => {
      input.selectionStart =
        input.selectionStart === 2 || input.selectionStart === 5 ? input.selectionStart + 1 : input.selectionStart;

      if (key === '.') input.value = input.value.substring(0, input.selectionStart!);
      else input.value = input.value.substring(0, input.selectionStart!) + key;

      const cursorPosition = input.selectionStart!;
      input.value += initialDateStr.substring(cursorPosition);

      setupEvent(key, input.value, cursorPosition);
    });
  }

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.detectChanges();
    init();
    input = spectator.query('p-inputmask input') as HTMLInputElement;
    expect(input).toBeTruthy();
    component.field = {inputViewChild: {nativeElement: input}} as unknown as InputMask;
  });

  it('NG_VALUE_ACCESSOR should be covered', () => {
    const valueAccessor = spectator.fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);
    expect(valueAccessor).not.toBeUndefined();
  });

  it('NG_VALIDATORS should be covered', () => {
    const validators = spectator.fixture.debugElement.injector.get(NG_VALIDATORS);
    expect(validators).not.toBeUndefined();
  });

  const testCases0 = [
    {sequence: ['0', '1', '.', '0', '1', '.', '2', '0', '2', '4'], expected: '01.01.2024'},
    {sequence: ['1', '.', '0', '1', '.', '2', '0', '2', '4'], expected: '01.01.2024'},
    {sequence: ['1', '.', '1', '.', '2', '0', '2', '4'], expected: '01.01.2024'},
    {sequence: ['0', '1', '0', '1', '2', '0', '2', '4'], expected: '01.01.2024'},
    {sequence: ['x', '.', 'x', '.'], expected: 'xx.xx.____'},
    {sequence: ['.'], expected: 'xx.__.____'}
  ];

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
    const keyEvent = new Event('input');

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
      setupEvent('.', inputVal, cursor);
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
    const evt = new Event('input');
    const spy = spyOn(component.onInput, 'emit');
    component.onInputChange(evt);
    expect(spy).toHaveBeenCalledWith(evt);
  });

  it('should return null if date is valid', () => {
    const validDateControl: AbstractControl = new FormControl('11.11.2023');
    const errors = component.validate(validDateControl);
    expect(errors).toBeNull();
  });

  it('should return INVALIDUNSPECIFIEDDATE if the day is invalid', () => {
    const control: AbstractControl = new FormControl('50.11.2023');
    const errors = component.validate(control);
    expect(errors?.[errorKey]).toBeDefined();
  });

  it('should return INVALIDUNSPECIFIEDDATE if the month is invalid', () => {
    const control: AbstractControl = new FormControl('11.50.2023');
    const errors = component.validate(control);
    expect(errors?.[errorKey]).toBeDefined();
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
    expect(component.convertToTransferDateFormat('01.01.2024')).toBe('2024-01-01');
  });

  it('should return the same value if transferISO8601 is false', () => {
    component.transferISO8601 = false;
    expect(component.convertToTransferDateFormat('01.01.2024')).toBe('01.01.2024');
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

  it('should update lastKeyPressed and lastInputElement on onKeydown', () => {
    const evt = {key: '1', target: input} as unknown as KeyboardEvent;
    component.onKeydown(evt as unknown as Event);
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
