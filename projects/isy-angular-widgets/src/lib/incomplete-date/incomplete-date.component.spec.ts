import {IncompleteDateComponent} from './incomplete-date.component';
import {AbstractControl, FormControl} from '@angular/forms';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {IncompleteDateModule} from './incomplete-date.module';

describe('Integration Tests: IncompleteDateComponent', () => {
  let component: IncompleteDateComponent;
  let onChange: unknown = () => {};
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

  it('should autocomplete the input sequence "01.01.2024" to "01.01.2024"', () => {
    typeSequence(['0', '1', '.', '0', '1', '.', '2', '0', '2', '4']);
    expect(input.value).toBe('01.01.2024');
  });

  it('should autocomplete the input sequence "1.01.2024" to "01.01.2024"', () => {
    typeSequence(['1', '.', '0', '1', '.', '2', '0', '2', '4']);
    expect(input.value).toBe('01.01.2024');
  });

  it('should autocomplete the input sequence "1.1.2024" to "01.01.2024"', () => {
    typeSequence(['1', '.', '1', '.', '2', '0', '2', '4']);
    expect(input.value).toBe('01.01.2024');
  });

  it('should autocomplete the input sequence "01012024" to "01.01.2024"', () => {
    typeSequence(['0', '1', '0', '1', '2', '0', '2', '4']);
    expect(input.value).toBe('01.01.2024');
  });

  it('should autocomplete the input sequence "x.x.____" to "xx.xx.____"', () => {
    typeSequence(['x', '.', 'x', '.']);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input sequence "._.__.____" to "xx.__.____"', () => {
    typeSequence(['.']);
    expect(input.value).toBe('xx.__.____');
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

  it('should autocomplete the input value from __.__.____ to xx.__.____ with current cursor position 0 when entering dot', () => {
    input.value = '__.__.____';
    setupEvent(keyEvent, 0, 0);
    expect(input.value).toBe('xx.__.____');
  });

  it('should autocomplete the input value from __.__.____ to xx.__.____ with current cursor position 1 when entering dot', () => {
    input.value = '__.__.____';
    setupEvent(keyEvent, 1, 1);
    expect(input.value).toBe('xx.__.____');
  });

  it('should autocomplete the input value from __.__.____ to xx.__.____ with current cursor position 2 when entering dot', () => {
    input.value = '__.__.____';
    setupEvent(keyEvent, 2, 2);
    expect(input.value).toBe('xx.__.____');
  });

  it('should autocomplete the input value from __.__.____ to xx.xx.____ with current cursor position 3 when entering dot', () => {
    input.value = '__.__.____';
    setupEvent(keyEvent, 3, 3);
    expect(input.value).toBe('xx.__.____');
  });

  it('should autocomplete the input value from __.__.____ to xx.xx.____ with current cursor position 4 when entering dot', () => {
    input.value = '__.__.____';
    setupEvent(keyEvent, 4, 4);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input value from __.__.____ to xx.xx.____ with current cursor position 5 when entering dot', () => {
    input.value = '__.__.____';
    setupEvent(keyEvent, 5, 5);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input value from x_.__.____ to xx.__.____ with current cursor position 1 when entering dot', () => {
    input.value = 'x_.__.____';
    setupEvent(keyEvent, 1, 1);
    expect(input.value).toBe('xx.__.____');
  });

  it('should autocomplete the input value from _x.__.____ to xx.__.____ with current cursor position 2 when entering dot', () => {
    input.value = '_x.__.____';
    setupEvent(keyEvent, 2, 2);
    expect(input.value).toBe('xx.__.____');
  });

  it('should autocomplete the input value from __.x_.____ to xx.xx.____ with current cursor position 4 when entering dot', () => {
    input.value = '__.x_.____';
    setupEvent(keyEvent, 4, 4);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input value from __._x.____ to xx.xx.____ with current cursor position 5 when entering dot', () => {
    input.value = '__._x.____';
    setupEvent(keyEvent, 5, 5);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input value from x_.x_.____ to xx.x_.____ with current cursor position 1 when entering dot', () => {
    input.value = 'x_.x_.____';
    setupEvent(keyEvent, 1, 1);
    expect(input.value).toBe('xx.x_.____');
  });

  it('should autocomplete the input value from _x.x_.____ to xx.x_.____ with current cursor position 2 when entering dot', () => {
    input.value = '_x.x_.____';
    setupEvent(keyEvent, 2, 2);
    expect(input.value).toBe('xx.x_.____');
  });

  it('should autocomplete the input value from x_.x_.____ to xx.xx.____ with current cursor position 4 when entering dot', () => {
    input.value = 'x_.x_.____';
    setupEvent(keyEvent, 4, 4);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input value from _x.x_.____ to xx.xx.____ with current cursor position 4 when entering dot', () => {
    input.value = '_x.x_.____';
    setupEvent(keyEvent, 4, 4);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input value from x_._x.____ to xx.xx.____ with current cursor position 5 when entering dot', () => {
    input.value = 'x_._x.____';
    setupEvent(keyEvent, 5, 5);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input value from _x._x.____ to xx.xx.____ with current cursor position 5 when entering dot', () => {
    input.value = '_x._x.____';
    setupEvent(keyEvent, 5, 5);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input value from 1_.__.____ to 01.__.____ with current cursor position 1 when entering dot', () => {
    input.value = '1_.__.____';
    setupEvent(keyEvent, 1, 1);
    expect(input.value).toBe('01.__.____');
  });

  it('should autocomplete the input value from _1.__.____ to 01.__.____ with current cursor position 2 when entering dot', () => {
    input.value = '_1.__.____';
    setupEvent(keyEvent, 2, 2);
    expect(input.value).toBe('01.__.____');
  });

  it('should autocomplete the input value from __.1_.____ to xx.01.____ with current cursor position 4 when entering dot', () => {
    input.value = '__.1_.____';
    setupEvent(keyEvent, 4, 4);
    expect(input.value).toBe('xx.01.____');
  });

  it('should autocomplete the input value from __._1.____ to xx.01.____ with current cursor position 5 when entering dot', () => {
    input.value = '__._1.____';
    setupEvent(keyEvent, 5, 5);
    expect(input.value).toBe('xx.01.____');
  });

  it('should autocomplete the input value from 1_.1_.____ to 01.1_.____ with current cursor position 1 when entering dot', () => {
    input.value = '1_.1_.____';
    setupEvent(keyEvent, 1, 1);
    expect(input.value).toBe('01.1_.____');
  });

  it('should autocomplete the input value from _1.1_.____ to 01.1_.____ with current cursor position 2 when entering dot', () => {
    input.value = '_1.1_.____';
    setupEvent(keyEvent, 2, 2);
    expect(input.value).toBe('01.1_.____');
  });

  it('should autocomplete the input value from 1_.1_.____ to 01.01.____ with current cursor position 4 when entering dot', () => {
    input.value = '1_.1_.____';
    setupEvent(keyEvent, 4, 4);
    expect(input.value).toBe('01.01.____');
  });

  it('should autocomplete the input value from _1.1_.____ to 01.01.____ with current cursor position 4 when entering dot', () => {
    input.value = '_1.1_.____';
    setupEvent(keyEvent, 4, 4);
    expect(input.value).toBe('01.01.____');
  });

  it('should autocomplete the input value from 1_._1.____ to 01.01.____ with current cursor position 5 when entering dot', () => {
    input.value = '1_._1.____';
    setupEvent(keyEvent, 5, 5);
    expect(input.value).toBe('01.01.____');
  });

  it('should autocomplete the input value from _1._1.____ to 01.01.____ with current cursor position 5 when entering dot', () => {
    input.value = '_1._1.____';
    setupEvent(keyEvent, 5, 5);
    expect(input.value).toBe('01.01.____');
  });

  it('should autocomplete the input value from 1_.x_.____ to 01.x_.____ with current cursor position 1 when entering dot', () => {
    input.value = '1_.x_.____';
    setupEvent(keyEvent, 1, 1);
    expect(input.value).toBe('01.x_.____');
  });

  it('should autocomplete the input value from _1.x_.____ to 01.x_.____ with current cursor position 2 when entering dot', () => {
    input.value = '_1.x_.____';
    setupEvent(keyEvent, 2, 2);
    expect(input.value).toBe('01.x_.____');
  });

  it('should autocomplete the input value from 1_.x_.____ to 01.xx.____ with current cursor position 4 when entering dot', () => {
    input.value = '1_.x_.____';
    setupEvent(keyEvent, 4, 4);
    expect(input.value).toBe('01.xx.____');
  });

  it('should autocomplete the input value from _1.x_.____ to 01.xx.____ with current cursor position 4 when entering dot', () => {
    input.value = '_1.x_.____';
    setupEvent(keyEvent, 4, 4);
    expect(input.value).toBe('01.xx.____');
  });

  it('should autocomplete the input value from 1_._x.____ to 01.xx.____ with current cursor position 5 when entering dot', () => {
    input.value = '1_._x.____';
    setupEvent(keyEvent, 5, 5);
    expect(input.value).toBe('01.xx.____');
  });

  it('should autocomplete the input value from _1._x.____ to 01.xx.____ with current cursor position 5 when entering dot', () => {
    input.value = '_1._x.____';
    setupEvent(keyEvent, 5, 5);
    expect(input.value).toBe('01.xx.____');
  });

  it('should not autocomplete the input value from xx.xx.____ to xx.xx.____ with current cursor position 6 when entering dot in the year part', () => {
    input.value = 'xx.xx.____';
    setupEvent(keyEvent, 6, 6);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should not autocomplete the input value from 01.__.____ to 01.xx.____ with current cursor position 3 when entering dot in the month part', () => {
    input.value = '01.__.____';
    setupEvent(keyEvent, 3, 3);
    expect(input.value).toBe('01.__.____');
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

  it('should return the string "__" correctly', () => {
    expect(component.transformDatePart('__', 'x')).toBe('xx');
  });

  it('should return the string "x_" correctly', () => {
    expect(component.transformDatePart('x_', 'x')).toBe('xx');
  });

  it('should return the string "_x" correctly', () => {
    expect(component.transformDatePart('_x', 'x')).toBe('xx');
  });

  it('should return the string "1_" correctly', () => {
    expect(component.transformDatePart('1_', 'x')).toBe('01');
  });

  it('should return the string "_1" correctly', () => {
    expect(component.transformDatePart('_1', 'x')).toBe('01');
  });
});
