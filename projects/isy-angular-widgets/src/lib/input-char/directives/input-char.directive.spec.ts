import {Component, DebugElement} from '@angular/core';
import {Datentyp} from '../model/datentyp';
import {InputCharDirective} from './input-char.directive';
import {By} from '@angular/platform-browser';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

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
  let directiveElement: DebugElement[];
  let directive: InputCharDirective;
  const createdComponent = createComponentFactory({
    component: TestComponent,
    declarations: [InputCharDirective]
  });

  beforeEach(() => {
    spectator = createdComponent();
    directiveElement = spectator.fixture.debugElement.queryAll(By.directive(InputCharDirective));
    directive = directiveElement[0].injector.get(InputCharDirective);
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('should add an input char button to the input', () => {
    const inputCharButton = spectator.fixture.debugElement.query(By.css('.input-char-button'))
      .nativeElement as HTMLButtonElement;
    expect(inputCharButton).toBeTruthy();
  });

  it('should set the input char button to disabled when the input is disabled', (done) => {
    const input = spectator.fixture.debugElement.query(By.css('#char-picker')).nativeElement as HTMLInputElement;
    expect(input).toBeTruthy();
    const inputCharButton = spectator.fixture.debugElement.query(By.css('.input-char-button'))
      .nativeElement as HTMLButtonElement;
    expect(inputCharButton).toBeTruthy();

    input.disabled = true;
    spectator.fixture.detectChanges();

    setTimeout(() => {
      spectator.fixture.detectChanges();
      expect(directive.componentRef.instance.isInputDisabled).toBeTrue();
      expect(inputCharButton.disabled).toBeTrue();
      done();
    });
  });

  it('should set the input char button to disabled when the input is readonly', (done) => {
    const input = spectator.fixture.debugElement.query(By.css('#char-picker')).nativeElement as HTMLInputElement;
    expect(input).toBeTruthy();
    const inputCharButton = spectator.fixture.debugElement.query(By.css('.input-char-button'))
      .nativeElement as HTMLButtonElement;
    expect(inputCharButton).toBeTruthy();

    input.readOnly = true;
    spectator.fixture.detectChanges();

    setTimeout(() => {
      spectator.fixture.detectChanges();
      expect(directive.componentRef.instance.isInputDisabled).toBeTrue();
      expect(inputCharButton.disabled).toBeTrue();
      done();
    });
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

    const input = spectator.fixture.debugElement.query(By.css('#char-picker')).nativeElement as HTMLInputElement;
    input.value = newValue;

    const changeEvent = new Event('change', {});
    input.dispatchEvent(changeEvent);
    spectator.fixture.detectChanges();

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
});
