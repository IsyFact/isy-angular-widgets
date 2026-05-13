import {Component, DebugElement} from '@angular/core';
import {Datentyp} from '../model/datentyp';
import {InputCharDirective} from './input-char.directive';
import {By} from '@angular/platform-browser';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ComponentFixture} from '@angular/core/testing';
import {WidgetsConfigService} from '../../i18n/widgets-config.service';
import {InputCharPickerService} from '../services/input-char-picker.service';

@Component({
  standalone: true,
  template: `<input
    #charPicker
    id="char-picker"
    pInputText
    isyInputChar
    [datentyp]="datentyp"
    [outlinedInputCharButton]="outlinedInputCharButton"
    (change)="valueGet($event, charPicker.value)"
  />`,
  imports: [InputCharDirective]
})
class TestComponent {
  datentyp: Datentyp = Datentyp.DATENTYP_A;

  outlinedInputCharButton = false;

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

  const configServiceSpy = jasmine.createSpyObj<WidgetsConfigService>('WidgetsConfigService', ['getTranslation']);

  const pickerServiceSpy = jasmine.createSpyObj<InputCharPickerService>('InputCharPickerService', [
    'open',
    'close',
    'closeFor',
    'isOpenFor'
  ]);

  const createComponent = createComponentFactory({
    component: TestComponent,
    providers: [
      {provide: WidgetsConfigService, useValue: configServiceSpy},
      {provide: InputCharPickerService, useValue: pickerServiceSpy}
    ]
  });

  beforeEach(() => {
    configServiceSpy.getTranslation.calls.reset();
    configServiceSpy.getTranslation.and.callFake((key: string) => key);

    pickerServiceSpy.open.calls.reset();
    pickerServiceSpy.open.and.resolveTo();

    pickerServiceSpy.close.calls.reset();
    pickerServiceSpy.closeFor.calls.reset();

    pickerServiceSpy.isOpenFor.calls.reset();
    pickerServiceSpy.isOpenFor.and.returnValue(false);

    spectator = createComponent();
    fixture = spectator.fixture;
    fixture.detectChanges();

    directiveElement = fixture.debugElement.queryAll(By.directive(InputCharDirective));
    directive = directiveElement[0]?.injector.get(InputCharDirective);
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

  it('should initialize the componentRef and set its inputs correctly', () => {
    expect(directive.componentRef).toBeTruthy();
    expect(directive.componentRef.instance.datentyp).toBe(Datentyp.DATENTYP_A);
    expect(directive.componentRef.instance.outlinedInputCharButton).toBeFalse();
  });

  it('should update the componentRef datentyp when the directive input changes', () => {
    spectator.component.datentyp = Datentyp.DATENTYP_C;
    fixture.detectChanges();

    expect(directive.datentyp).toBe(Datentyp.DATENTYP_C);
    expect(directive.componentRef.instance.datentyp).toBe(Datentyp.DATENTYP_C);
  });

  it('should update the componentRef outlinedInputCharButton when the directive input changes', () => {
    spectator.component.outlinedInputCharButton = true;
    fixture.detectChanges();

    expect(directive.outlinedInputCharButton).toBeTrue();
    expect(directive.componentRef.instance.outlinedInputCharButton).toBeTrue();
  });

  it('should set the input char button to disabled when the input is disabled', (done) => {
    expect(input).toBeTruthy();
    expect(inputCharButton).toBeTruthy();

    input.disabled = true;

    expectInputCharButtonIsDisabled(inputCharButton, done);
  });

  it('should set the input char button to disabled when the input is readonly', (done) => {
    expect(input).toBeTruthy();
    expect(inputCharButton).toBeTruthy();

    input.readOnly = true;

    expectInputCharButtonIsDisabled(inputCharButton, done);
  });

  it('should close the shared picker when the input becomes disabled', (done) => {
    input.disabled = true;

    setTimeout(() => {
      fixture.detectChanges();

      expect(pickerServiceSpy.closeFor).toHaveBeenCalledWith(inputCharButton);

      done();
    });
  });

  it('should close the shared picker when the input becomes readonly', (done) => {
    input.readOnly = true;

    setTimeout(() => {
      fixture.detectChanges();

      expect(pickerServiceSpy.closeFor).toHaveBeenCalledWith(inputCharButton);

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

    input.value = newValue;

    const changeEvent = new Event('change');
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
    input.setSelectionRange(input.value.length, input.value.length);

    input.dispatchEvent(new KeyboardEvent('keyup'));

    expect(directive.selectionPosition).toEqual(input.value.length);
  });

  it('should get the current input position on mouseup', () => {
    input.value = 'test';
    input.setSelectionRange(input.value.length, input.value.length);

    input.dispatchEvent(new MouseEvent('mouseup'));

    expect(directive.selectionPosition).toEqual(input.value.length);
  });

  it('should subscribe to insertCharacter and update input value correctly', () => {
    const zeichen = 'ç̆';

    directive.componentRef.instance.insertCharacter.emit(zeichen);

    expect(directive.htmlInputElement.value).toBe(zeichen);
    expect(directive.selectionPosition).toBe(zeichen.length);
  });

  it('should dispatch an input event when a character is inserted', () => {
    const zeichen = 'ç̆';
    const dispatchEventSpy = spyOn(directive.htmlInputElement, 'dispatchEvent').and.callThrough();

    directive.componentRef.instance.insertCharacter.emit(zeichen);

    expect(dispatchEventSpy).toHaveBeenCalled();

    const dispatchedEvent = dispatchEventSpy.calls.mostRecent().args[0];

    expect(dispatchedEvent).toEqual(jasmine.any(Event));
    expect(dispatchedEvent.type).toBe('input');
  });

  it('should not close the shared picker when no input char button is found', () => {
    const hostElement = directive.componentRef.location.nativeElement as HTMLElement;
    spyOn(hostElement, 'querySelector').and.returnValue(null);

    directive.handleDisabledReadonlyChange(input, 'disabled');

    expect(pickerServiceSpy.closeFor).not.toHaveBeenCalled();
  });
});
