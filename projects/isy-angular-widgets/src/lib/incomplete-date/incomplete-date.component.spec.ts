import {IncompleteDateComponent} from './incomplete-date.component';
import {AbstractControl, FormControl, FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {InputMask} from 'primeng/inputmask';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

let onChange: unknown = () => {};
let onTouched: unknown = () => {};
let input: HTMLInputElement;
const keyEvent = new KeyboardEvent('keydown', {
  key: '.',
  code: '190'
});

/**
 * Initialize test
 * @param spectator Specator object with all the information
 */
function init(spectator: Spectator<IncompleteDateComponent>): void {
  onChange = jasmine.createSpy('onChange spy');
  onTouched = jasmine.createSpy('onTouched spy');
  spectator.component.registerOnChange(onChange);
  spectator.component.registerOnTouched(onTouched);
}

describe('Integration Tests: IsyIncompleteDateComponent', () => {
  let spectator: Spectator<IncompleteDateComponent>;
  const createdComponent = createComponentFactory({
    component: IncompleteDateComponent,
    declarations: [InputMask],
    imports: [FormsModule]
  });

  beforeEach(() => {
    spectator = createdComponent();
    init(spectator);
    input = spectator.fixture.debugElement.query(By.css('p-inputmask .p-inputmask')).nativeElement as HTMLInputElement;
  });

  it('should transform the input value on losing the focus to "" when input value contains "_"', () => {
    spectator.component.inputValue = 'xx.__.____';
    spectator.fixture.detectChanges();
    spectator.component.onBlur();
    expect(input.value).toBe('');
  });

  it('should autocomplete the input value from __.__.____ to xx.__.____ when entering dot', () => {
    input.value = '__.__.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(0, 0);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.__.____');
  });

  it('should autocomplete the input value from __.__.____ to xx.__.____ when entering dot', () => {
    input.value = '__.__.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(1, 1);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.__.____');
  });

  it('should autocomplete the input value from __.__.____ to xx.__.____ when entering dot', () => {
    input.value = '__.__.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(2, 2);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.__.____');
  });

  it('should autocomplete the input value from __.__.____ to xx.xx.____ when entering dot', () => {
    input.value = '__.__.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(3, 3);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input value from __.__.____ to xx.xx.____ when entering dot', () => {
    input.value = '__.__.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(4, 4);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input value from __.__.____ to xx.xx.____ when entering dot', () => {
    input.value = '__.__.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(5, 5);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input value from x_.__.____ to xx.__.____ when entering dot', () => {
    input.value = 'x_.__.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(1, 1);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.__.____');
  });

  it('should autocomplete the input value from _x.__.____ to xx.__.____ when entering dot', () => {
    input.value = '_x.__.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(2, 2);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.__.____');
  });

  it('should autocomplete the input value from __.x_.____ to xx.xx.____ when entering dot', () => {
    input.value = '__.x_.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(4, 4);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input value from __._x.____ to xx.xx.____ when entering dot', () => {
    input.value = '__._x.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(5, 5);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input value from x_.x_.____ to xx.x_.____ when entering dot', () => {
    input.value = 'x_.x_.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(1, 1);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.x_.____');
  });

  it('should autocomplete the input value from _x.x_.____ to xx.x_.____ when entering dot', () => {
    input.value = '_x.x_.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(2, 2);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.x_.____');
  });

  it('should autocomplete the input value from x_.x_.____ to xx.xx.____ when entering dot', () => {
    input.value = 'x_.x_.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(4, 4);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input value from _x.x_.____ to xx.xx.____ when entering dot', () => {
    input.value = '_x.x_.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(4, 4);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input value from x_._x.____ to xx.xx.____ when entering dot', () => {
    input.value = 'x_._x.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(5, 5);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input value from _x._x.____ to xx.xx.____ when entering dot', () => {
    input.value = '_x._x.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(5, 5);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should autocomplete the input value from 1_.__.____ to 01.__.____ when entering dot', () => {
    input.value = '1_.__.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(1, 1);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('01.__.____');
  });

  it('should autocomplete the input value from _1.__.____ to 01.__.____ when entering dot', () => {
    input.value = '_1.__.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(2, 2);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('01.__.____');
  });

  it('should autocomplete the input value from __.1_.____ to xx.01.____ when entering dot', () => {
    input.value = '__.1_.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(4, 4);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.01.____');
  });

  it('should autocomplete the input value from __._1.____ to xx.01.____ when entering dot', () => {
    input.value = '__._1.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(5, 5);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.01.____');
  });

  it('should autocomplete the input value from 1_.1_.____ to 01.1_.____ when entering dot', () => {
    input.value = '1_.1_.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(1, 1);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('01.1_.____');
  });

  it('should autocomplete the input value from _1.1_.____ to 01.1_.____ when entering dot', () => {
    input.value = '_1.1_.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(2, 2);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('01.1_.____');
  });

  it('should autocomplete the input value from 1_.1_.____ to 01.01.____ when entering dot', () => {
    input.value = '1_.1_.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(4, 4);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('01.01.____');
  });

  it('should autocomplete the input value from _1.1_.____ to 01.01.____ when entering dot', () => {
    input.value = '_1.1_.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(4, 4);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('01.01.____');
  });

  it('should autocomplete the input value from 1_._1.____ to 01.01.____ when entering dot', () => {
    input.value = '1_._1.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(5, 5);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('01.01.____');
  });

  it('should autocomplete the input value from _1._1.____ to 01.01.____ when entering dot', () => {
    input.value = '_1._1.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(5, 5);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('01.01.____');
  });

  it('should autocomplete the input value from _1._1.____ to 01.01.____ when entering dot', () => {
    input.value = '_1._1.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(5, 5);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('01.01.____');
  });

  it('should autocomplete the input value from 1_.x_.____ to 01.x_.____ when entering dot', () => {
    input.value = '1_.x_.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(1, 1);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('01.x_.____');
  });

  it('should autocomplete the input value from _1.x_.____ to 01.x_.____ when entering dot', () => {
    input.value = '_1.x_.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(2, 2);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('01.x_.____');
  });

  it('should autocomplete the input value from 1_.x_.____ to 01.xx.____ when entering dot', () => {
    input.value = '1_.x_.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(4, 4);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('01.xx.____');
  });

  it('should autocomplete the input value from _1.x_.____ to 01.xx.____ when entering dot', () => {
    input.value = '_1.x_.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(4, 4);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('01.xx.____');
  });

  it('should autocomplete the input value from 1_._x.____ to 01.xx.____ when entering dot', () => {
    input.value = '1_._x.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(5, 5);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('01.xx.____');
  });

  it('should autocomplete the input value from _1._x.____ to 01.xx.____ when entering dot', () => {
    input.value = '_1._x.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(5, 5);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('01.xx.____');
  });

  it('should not autocomplete the input value from xx.xx.____ to xx.xx.____ when entering dot in the year part', () => {
    input.value = 'xx.xx.____';
    input.dispatchEvent(keyEvent);
    input.setSelectionRange(6, 6);
    spectator.component.onKeydown(keyEvent);
    expect(input.value).toBe('xx.xx.____');
  });

  it('should create', () => {
    expect(spectator.component).toBeDefined();
  });

  it('should set valid writeValue to inputValue', () => {
    spectator.component.writeValue('01.01.2023');

    expect(spectator.component.inputValue).toBe('01.01.2023');
    expect(onChange).not.toHaveBeenCalled();
    expect(onTouched).not.toHaveBeenCalled();
  });

  it('should disable the state', () => {
    spectator.component.setDisabledState(true);
    expect(spectator.component.disabled).toBeTrue();
  });

  it('should set value by onComplete', () => {
    spectator.component.writeValue('01.01.2023');
    spectator.component.onComplete();
    expect(spectator.component.inputValue).toBe('01.01.2023');
  });

  it('should return null if date is valid', () => {
    const validDateControl: AbstractControl = new FormControl('11.11.2023');
    const errors = spectator.component.validate(validDateControl);
    expect(errors).toBeNull();
  });

  it('should return UNSPECIFIEDDATE if the day is invalid', () => {
    const errorKey = 'UNSPECIFIEDDATE';
    const control: AbstractControl = new FormControl('50.11.2023');

    const errors = spectator.component.validate(control);
    if (!errors) {
      throw new Error('errors is not defined');
    }

    expect(errors[errorKey]).toBeDefined();
  });

  it('should return UNSPECIFIEDDATE if the month is invalid', () => {
    const errorKey = 'UNSPECIFIEDDATE';
    const control: AbstractControl = new FormControl('11.50.2023');

    const errors = spectator.component.validate(control);
    if (!errors) {
      throw new Error('errors is not defined');
    }

    expect(errors[errorKey]).toBeDefined();
  });

  it('should return the string "__" correctly', () => {
    expect(spectator.component.transformDatePart('__', 'x')).toBe('xx');
  });

  it('should return the string "x_" correctly', () => {
    expect(spectator.component.transformDatePart('x_', 'x')).toBe('xx');
  });

  it('should return the string "_x" correctly', () => {
    expect(spectator.component.transformDatePart('_x', 'x')).toBe('xx');
  });

  it('should return the string "1_" correctly', () => {
    expect(spectator.component.transformDatePart('1_', 'x')).toBe('01');
  });

  it('should return the string "_1" correctly', () => {
    expect(spectator.component.transformDatePart('_1', 'x')).toBe('01');
  });
});
