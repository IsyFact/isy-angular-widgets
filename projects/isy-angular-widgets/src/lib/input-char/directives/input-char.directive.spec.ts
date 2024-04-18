import {Component, DebugElement} from '@angular/core';
import {Datentyp} from '../model/datentyp';
import {InputCharDirective} from './input-char.directive';
import {By} from '@angular/platform-browser';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ComponentFixture} from '@angular/core/testing';

@Component({
  template: `<input
    #charPicker
    id="char-picker"
    pInputText
    isyInputChar
    (change)="valueGet($event, charPicker.value)"
  />`
})
class TestComponent {
  datentyp: Datentyp = Datentyp.DATENTYP_A;

  valueGet(event?: Event, referenceVariableValue?: string): void {
    if (event) {
      const target = event.target as HTMLInputElement;
      console.log(target.value);
    }

    if (referenceVariableValue) {
      console.log(referenceVariableValue);
    }
  }
}

describe('Integration Tests: InputCharDirective', () => {
  let spectator: Spectator<TestComponent>;
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: DebugElement[];
  let directive: InputCharDirective;
  let inputCharButton: HTMLButtonElement;
  let input: HTMLInputElement;
  const createComponent = createComponentFactory({
    component: TestComponent,
    imports: [InputCharDirective]
  });

  beforeEach(() => {
    spectator = createComponent();
    fixture = spectator.fixture;
    directiveElement = fixture.debugElement.queryAll(By.directive(InputCharDirective));
    directive = directiveElement[0].injector.get(InputCharDirective);
    input = spectator.query('#char-picker') as HTMLInputElement;
    inputCharButton = spectator.query('.input-char-button') as HTMLButtonElement;
  });

  /**
   * Expect that button is disabled
   * @param inputCharButton The current HTML button
   * @param done Action method that should be called when the async work is complete.
   */
  function expectInputCharButtonIsDisabled(inputCharButton: HTMLButtonElement, done: DoneFn): void {
    setTimeout(() => {
      fixture.detectChanges();
      expect(directive.componentRef.instance.isInputDisabled).toBeTrue();
      expect(inputCharButton.disabled).toBeTrue();
      done();
    });
  }

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('should add an input char button to the input', () => {
    expect(inputCharButton).toBeTruthy();
  });

  it('should set the input char button to disabled when the input is disabled', (done) => {
    expect(input).toBeTruthy();
    expect(inputCharButton).toBeTruthy();

    input.disabled = true;
    expectInputCharButtonIsDisabled(inputCharButton, done);
  });

  it('should handle changes to the datentyp attribute correctly', () => {
    expect(directive.datentyp).toBe(Datentyp.DATENTYP_C);
    input.setAttribute('ng-reflect-datentyp', Datentyp.DATENTYP_A);
    spectator.detectChanges();
    directive.handleDatentypChange(input, 'ng-reflect-datentyp');
    expect(directive.componentRef.instance.datentyp).toBe(Datentyp.DATENTYP_A);
  });

  it('should set the input char button to disabled when the input is readonly', (done) => {
    expect(input).toBeTruthy();
    expect(inputCharButton).toBeTruthy();

    input.readOnly = true;
    expectInputCharButtonIsDisabled(inputCharButton, done);
  });

  it('should have mouse position 0 by default', () => {
    expect(directive.selectionPosition).toEqual(0);
  });

  it('should set next input position', () => {
    expect(directive.selectionPosition).toEqual(0);
    directive.setNextInputPosition(1);
    expect(directive.selectionPosition).toEqual(1);
  });

  it('should change the input value', () => {
    const newValue = 'abc';
    const valueOnChangeSpy = spyOn(spectator.component, 'valueGet');

    input.value = newValue;

    const changeEvent = new Event('change', {});
    input.dispatchEvent(changeEvent);
    fixture.detectChanges();

    expect(valueOnChangeSpy).toHaveBeenCalledWith(changeEvent, newValue);
  });

  it('should build the current input value', () => {
    const value = 'e';
    const zeichen = 'ç̆';

    expect(directive.selectionPosition).toEqual(0);
    let inputValue = directive.buildInputValue(value, zeichen);
    directive.setNextInputPosition(zeichen.length);
    expect(inputValue).toEqual(`${zeichen}${value}`);

    inputValue = directive.buildInputValue(inputValue, value);
    directive.setNextInputPosition(value.length);
    expect(inputValue).toEqual(`${zeichen}${value}${value}`);
  });

  it('should get the current input position on keyup', () => {
    input.value = 'test';
    input.dispatchEvent(new KeyboardEvent('keyup'));
    expect(directive.selectionPosition).toEqual(input.value.length);
  });

  it('should get the current input position on mouseup', () => {
    input.value = 'test';
    input.dispatchEvent(new MouseEvent('mouseup'));
    expect(directive.selectionPosition).toEqual(input.value.length);
  });
});
