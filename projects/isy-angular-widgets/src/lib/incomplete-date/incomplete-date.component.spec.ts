import {IncompleteDateComponent} from './incomplete-date.component';
import {AbstractControl, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {IncompleteDateModule} from './incomplete-date.module';
import {Validation} from '@isy-angular-widgets/public-api';

describe('Integration Tests: IncompleteDateComponent', () => {
  let component: IncompleteDateComponent;
  let onChange: (value: string) => void = () => {};
  let onTouched: unknown = () => {};
  let input: HTMLInputElement;
  const keyEvent = new KeyboardEvent('keydown', {
    key: '.',
    code: '190'
  });
  const errorKey = 'UNSPECIFIEDDATE';
  let spectator: Spectator<IncompleteDateComponent>;
  const createComponent = createComponentFactory({
    component: IncompleteDateComponent,
    imports: [IncompleteDateModule]
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
   * Setting up the keyboard event
   * @param keyEvent the current keyboard event
   * @param selectionStartRange the starting range of the current selection
   * @param selectionEndRange the ending range of the current selection
   */
  function setupEvent(keyEvent: KeyboardEvent, selectionStartRange: number, selectionEndRange: number): void {
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(selectionStartRange, selectionEndRange);
    component.onKeydown(keyEvent);
  }

  /**
   * Simulate pressing the keys in sequence
   * Dispatching a keydown event in a unit test simulates only the event itself and does not automatically trigger the default behavior
   * that a real keydown event would cause in a browser (like changing an input value).
   * Thus the value of the input element is set manually before dispatching the keydown event in the setupEvent (onKeydown) function.
   * @param sequence the input sequence
   */
  function typeSequence(sequence: string[]): void {
    // The input mask has to be initially set since dispatching the keydown event alone does not alter the input value.
    const initialDateStr = (input.value = '__.__.____');
    input.focus();

    /*
    The input values are manually set for each key. On each execution of the setupEvent function,
    a sequential key is selected and linked to a corresponding result. This result is then synchronized with the input mask,
    updating the input for the next iteration.
    */
    sequence.forEach((key) => {
      const keyEvent = new KeyboardEvent('keydown', {key: key});
      input.selectionStart =
        input.selectionStart === 2 || input.selectionStart === 5 ? input.selectionStart + 1 : input.selectionStart;

      if (key === '.') input.value = input.value.substring(0, input.selectionStart!);
      else input.value = input.value.substring(0, input.selectionStart!) + key;

      const cursorPosition = input.selectionStart;
      input.value += initialDateStr.substring(cursorPosition!);
      setupEvent(keyEvent, cursorPosition!, cursorPosition!);
      spectator.detectChanges();
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
      setupEvent(keyEvent, cursor, cursor);
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

  it('should disable the state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTrue();
  });

  it('should set value by onComplete', () => {
    component.writeValue('01.01.2023');
    component.onComplete();
    expect(component.inputValue).toBe('01.01.2023');
  });

  it('should return null if date is valid', () => {
    const validDateControl: AbstractControl = new FormControl('11.11.2023');
    const errors = component.validate(validDateControl);
    expect(errors).toBeNull();
  });

  it('should return UNSPECIFIEDDATE if the day is invalid', () => {
    const control: AbstractControl = new FormControl('50.11.2023');

    const errors = component.validate(control);
    if (!errors) {
      throw new Error('errors is not defined');
    }

    expect(errors[errorKey]).toBeDefined();
  });

  it('should return UNSPECIFIEDDATE if the month is invalid', () => {
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
    expect(result).toEqual(Validation.validUnspecifiedISODate(control));
  });

  it('should return the result from Validation.validUnspecifiedDate when transferISO8601 is false', () => {
    component.transferISO8601 = false;
    const control = new FormControl();
    const result = component.validate(control);
    expect(result).toEqual(Validation.validUnspecifiedDate(control));
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

  it('should call onChange method with inputValue if transferISO8601 is true', () => {
    component.transferISO8601 = true;
    component.inputValue = '2022-01-01';
    spyOn(component, 'onChange');
    component.ngAfterViewInit();
    expect(component.onChange).toHaveBeenCalledWith('2022-01-01');
  });
});
