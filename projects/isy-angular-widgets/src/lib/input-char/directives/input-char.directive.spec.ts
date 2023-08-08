import {Component} from '@angular/core';
import {Datentyp} from '../model/datentyp';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {InputCharDirective} from './input-char.directive';
import {By} from '@angular/platform-browser';
import {TranslateTestingModule} from 'ngx-translate-testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@Component({
  template:
    `<input
        #charPicker
        id="charPicker"
        pInputText
        isyInputChar
        (change)="valueGet($event, charPicker.value)"
    >`
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

describe('InputCharDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: any;
  let directive: InputCharDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        InputCharDirective
      ],
      imports: [
        TranslateTestingModule.withTranslations({}),
        BrowserAnimationsModule
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.queryAll(By.directive(InputCharDirective));
    directive = directiveElement[0].injector.get(InputCharDirective) as InputCharDirective;
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('should check the input mouse position of test component', () => {
    expect(directive.inputMousePosition).toEqual(0);
  });

  it('should set next input position', () => {
    expect(directive.inputMousePosition).toEqual(0);
    directive.setNextInputPosition(1);
    expect(directive.inputMousePosition).toEqual(1);
  });

  it('should check the arrival of changed input value', () => {
    const newValue = 'abc';
    const valueOnChangeSpy = spyOn(component, 'valueGet');

    const input = fixture.debugElement.query(By.css('#charPicker')).nativeElement as HTMLInputElement;
    input.value = newValue;

    const changeEvent = new Event('change', {});
    input.dispatchEvent(changeEvent);
    fixture.detectChanges();

    expect(valueOnChangeSpy).toHaveBeenCalledWith(changeEvent, newValue);
  });

  it('should check the build of the current input value', () => {
    const value = 'e';
    const zeichen = 'ç̆';

    expect(directive.inputMousePosition).toEqual(0);
    let inputValue = directive.buildInputValue(value, zeichen);
    directive.setNextInputPosition(zeichen.length);
    expect(inputValue).toEqual(`${zeichen}${value}`);
    
    inputValue = directive.buildInputValue(inputValue, value);
    directive.setNextInputPosition(value.length);
    expect(inputValue).toEqual(`${zeichen}${value}${value}`);
  });
});
