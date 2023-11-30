import {IncompleteDateComponent} from './incomplete-date.component';
import {AbstractControl, FormControl, FormsModule} from '@angular/forms';
import {InputMask} from 'primeng/inputmask';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

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
  const createdComponent = createComponentFactory({
    component: IncompleteDateComponent,
    declarations: [InputMask],
    imports: [FormsModule]
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

  beforeEach(() => {
    spectator = createdComponent();
    component = spectator.component;
    init();
    input = spectator.query('p-inputmask .p-inputmask') as HTMLInputElement;
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

  describe('should autocomplete the input value from __.__.____ to xx.__.____ when entering dot and ', ()=> {
    it(' current cursor position is 0', () => {
      input.value = '__.__.____';
      setupEvent(keyEvent, 0, 0);
      expect(input.value).toBe('xx.__.____');
    });

    it('current cursor position is 1', () => {
      input.value = '__.__.____';
      setupEvent(keyEvent, 1, 1);
      expect(input.value).toBe('xx.__.____');
    });

    it('current cursor position is 2', () => {
      input.value = '__.__.____';
      setupEvent(keyEvent, 2, 2);
      expect(input.value).toBe('xx.__.____');
    });

    it('current cursor position is 3', () => {
      input.value = '__.__.____';
      setupEvent(keyEvent, 3, 3);
      expect(input.value).toBe('xx.xx.____');
    });

    it('current cursor position is 4', () => {
      input.value = '__.__.____';
      setupEvent(keyEvent, 4, 4);
      expect(input.value).toBe('xx.xx.____');
    });

    it('current cursor position is 5', () => {
      input.value = '__.__.____';
      setupEvent(keyEvent, 5, 5);
      expect(input.value).toBe('xx.xx.____');
    });
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
