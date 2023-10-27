import {IncompleteDateComponent} from './incomplete-date.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AbstractControl, FormControl} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {InputMask} from 'primeng/inputmask';

describe('IsyIncompleteDateComponent', () => {
  let component: IncompleteDateComponent;
  let fixture: ComponentFixture<IncompleteDateComponent>;
  let onChange: unknown = () => {};
  let onTouched: unknown = () => {};
  let input: HTMLInputElement;
  const keyEvent = new KeyboardEvent('keydown', {
    key: '.',
    code: '190'
  });

  /**
   * Initialize test
   */
  function init(): void {
    fixture = TestBed.createComponent(IncompleteDateComponent);
    component = fixture.componentInstance;
    onChange = jasmine.createSpy('onChange spy');
    onTouched = jasmine.createSpy('onTouched spy');
    const x = onChange;
    component.registerOnChange(onChange);
    component.registerOnTouched(onTouched);
  }

  describe('Integration Tests: IsyIncompleteDateComponent', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [IncompleteDateComponent, InputMask],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
      init();
      input = fixture.debugElement.query(By.css('p-inputmask .p-inputmask')).nativeElement as HTMLInputElement;
    });

    it('should transform the input value on losing the focus to "" when input value contains "_"', () => {
      component.inputValue = 'xx.__.____';
      fixture.detectChanges();
      component.onBlur();
      expect(input.value).toBe('');
    });

    it('should autocomplete the input value from __.__.____ to xx.__.____ when entering dot', () => {
      input.value = '__.__.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(0, 0);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.__.____');
    });

    it('should autocomplete the input value from __.__.____ to xx.__.____ when entering dot', () => {
      input.value = '__.__.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(1, 1);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.__.____');
    });

    it('should autocomplete the input value from __.__.____ to xx.__.____ when entering dot', () => {
      input.value = '__.__.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(2, 2);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.__.____');
    });

    it('should autocomplete the input value from __.__.____ to xx.xx.____ when entering dot', () => {
      input.value = '__.__.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(3, 3);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.xx.____');
    });

    it('should autocomplete the input value from __.__.____ to xx.xx.____ when entering dot', () => {
      input.value = '__.__.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(4, 4);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.xx.____');
    });

    it('should autocomplete the input value from __.__.____ to xx.xx.____ when entering dot', () => {
      input.value = '__.__.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(5, 5);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.xx.____');
    });

    it('should autocomplete the input value from x_.__.____ to xx.__.____ when entering dot', () => {
      input.value = 'x_.__.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(1, 1);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.__.____');
    });

    it('should autocomplete the input value from _x.__.____ to xx.__.____ when entering dot', () => {
      input.value = '_x.__.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(2, 2);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.__.____');
    });

    it('should autocomplete the input value from __.x_.____ to xx.xx.____ when entering dot', () => {
      input.value = '__.x_.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(4, 4);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.xx.____');
    });

    it('should autocomplete the input value from __._x.____ to xx.xx.____ when entering dot', () => {
      input.value = '__._x.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(5, 5);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.xx.____');
    });

    it('should autocomplete the input value from x_.x_.____ to xx.x_.____ when entering dot', () => {
      input.value = 'x_.x_.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(1, 1);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.x_.____');
    });

    it('should autocomplete the input value from _x.x_.____ to xx.x_.____ when entering dot', () => {
      input.value = '_x.x_.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(2, 2);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.x_.____');
    });

    it('should autocomplete the input value from x_.x_.____ to xx.xx.____ when entering dot', () => {
      input.value = 'x_.x_.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(4, 4);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.xx.____');
    });

    it('should autocomplete the input value from _x.x_.____ to xx.xx.____ when entering dot', () => {
      input.value = '_x.x_.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(4, 4);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.xx.____');
    });

    it('should autocomplete the input value from x_._x.____ to xx.xx.____ when entering dot', () => {
      input.value = 'x_._x.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(5, 5);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.xx.____');
    });

    it('should autocomplete the input value from _x._x.____ to xx.xx.____ when entering dot', () => {
      input.value = '_x._x.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(5, 5);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.xx.____');
    });

    it('should autocomplete the input value from 1_.__.____ to 01.__.____ when entering dot', () => {
      input.value = '1_.__.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(1, 1);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('01.__.____');
    });

    it('should autocomplete the input value from _1.__.____ to 01.__.____ when entering dot', () => {
      input.value = '_1.__.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(2, 2);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('01.__.____');
    });

    it('should autocomplete the input value from __.1_.____ to xx.01.____ when entering dot', () => {
      input.value = '__.1_.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(4, 4);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.01.____');
    });

    it('should autocomplete the input value from __._1.____ to xx.01.____ when entering dot', () => {
      input.value = '__._1.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(5, 5);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.01.____');
    });

    it('should autocomplete the input value from 1_.1_.____ to 01.1_.____ when entering dot', () => {
      input.value = '1_.1_.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(1, 1);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('01.1_.____');
    });

    it('should autocomplete the input value from _1.1_.____ to 01.1_.____ when entering dot', () => {
      input.value = '_1.1_.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(2, 2);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('01.1_.____');
    });

    it('should autocomplete the input value from 1_.1_.____ to 01.01.____ when entering dot', () => {
      input.value = '1_.1_.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(4, 4);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('01.01.____');
    });

    it('should autocomplete the input value from _1.1_.____ to 01.01.____ when entering dot', () => {
      input.value = '_1.1_.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(4, 4);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('01.01.____');
    });

    it('should autocomplete the input value from 1_._1.____ to 01.01.____ when entering dot', () => {
      input.value = '1_._1.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(5, 5);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('01.01.____');
    });

    it('should autocomplete the input value from _1._1.____ to 01.01.____ when entering dot', () => {
      input.value = '_1._1.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(5, 5);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('01.01.____');
    });

    it('should autocomplete the input value from _1._1.____ to 01.01.____ when entering dot', () => {
      input.value = '_1._1.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(5, 5);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('01.01.____');
    });

    it('should autocomplete the input value from 1_.x_.____ to 01.x_.____ when entering dot', () => {
      input.value = '1_.x_.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(1, 1);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('01.x_.____');
    });

    it('should autocomplete the input value from _1.x_.____ to 01.x_.____ when entering dot', () => {
      input.value = '_1.x_.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(2, 2);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('01.x_.____');
    });

    it('should autocomplete the input value from 1_.x_.____ to 01.xx.____ when entering dot', () => {
      input.value = '1_.x_.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(4, 4);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('01.xx.____');
    });

    it('should autocomplete the input value from _1.x_.____ to 01.xx.____ when entering dot', () => {
      input.value = '_1.x_.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(4, 4);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('01.xx.____');
    });

    it('should autocomplete the input value from 1_._x.____ to 01.xx.____ when entering dot', () => {
      input.value = '1_._x.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(5, 5);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('01.xx.____');
    });

    it('should autocomplete the input value from _1._x.____ to 01.xx.____ when entering dot', () => {
      input.value = '_1._x.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(5, 5);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('01.xx.____');
    });

    it('should not autocomplete the input value from xx.xx.____ to xx.xx.____ when entering dot in the year part', () => {
      input.value = 'xx.xx.____';
      input.dispatchEvent(keyEvent);
      input.setSelectionRange(6, 6);
      component.onKeydown(keyEvent);
      expect(input.value).toBe('xx.xx.____');
    });
  });

  describe('Unit Tests: IsyIncompleteDateComponent', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [IncompleteDateComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
      init();
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
      const errorKey = 'UNSPECIFIEDDATE';
      const control: AbstractControl = new FormControl('50.11.2023');

      const errors = component.validate(control);
      if (!errors) {
        throw new Error('errors is not defined');
      }

      expect(errors[errorKey]).toBeDefined();
    });

    it('should return UNSPECIFIEDDATE if the month is invalid', () => {
      const errorKey = 'UNSPECIFIEDDATE';
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
});
