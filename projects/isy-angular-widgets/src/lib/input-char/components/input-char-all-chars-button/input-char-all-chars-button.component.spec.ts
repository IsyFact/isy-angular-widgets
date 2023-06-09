import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputCharAllCharsButtonComponent} from './input-char-all-chars-button.component';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

describe('InputCharAllCharsButtonComponent', () => {
  const startingAllCharsValue = 'Alle';
  let component: InputCharAllCharsButtonComponent;
  let fixture: ComponentFixture<InputCharAllCharsButtonComponent>;
  let allButton: DebugElement[];
  const buttonLabel = 'Alle';

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [InputCharAllCharsButtonComponent],
      imports: [
        SelectButtonModule,
        ButtonModule,
        FormsModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InputCharAllCharsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    allButton = fixture.debugElement.queryAll(By.css('.all-select-button'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the reset function to have been called', () => {
    const resetSpy = spyOn(component, 'reset') .and. callThrough();
    expect(component.allCharsValue).toEqual(startingAllCharsValue);
    component.reset();
    expect(resetSpy).toHaveBeenCalled();
    expect(component.allCharsValue).toEqual('');
  });

  it('should check the onAllSelection function to have been called', () => {
    const onAllSelectionSpy = spyOn(component, 'onAllSelection') .and. callThrough();
    const allSelectedOutputSpy = spyOn(component.allSelected, 'emit');
    component.onAllSelection();
    expect(onAllSelectionSpy).toHaveBeenCalled();
    expect(allSelectedOutputSpy).toHaveBeenCalled();
  });

  it('should check the default buttonLabel', () => {
    expect(component.allCharsValue).toEqual(buttonLabel);
  });

  it('should check the select button default options', () => {
    expect(component.options).toEqual([buttonLabel]);
  });

  it('should check the reset functionality', () => {
    component.reset();
    expect(component.allCharsValue).toEqual('');
  });

  it('should check the functionality on selection', () => {
    const onSelectSpy = spyOn(component.allSelected, 'emit');
    component.onAllSelection();

    expect(onSelectSpy).toHaveBeenCalledWith();
    expect(component.allCharsValue).toEqual(buttonLabel);
  });

  it('should check the all button length', () => {
    expect(allButton.length).toEqual([buttonLabel].length);
  });

  it('should check the inner text of the HTML all button', () => {
    const button = allButton[0].nativeElement as HTMLButtonElement;
    expect(button.innerText).toEqual(buttonLabel);
  });

  it('should check the functionality of all button on click', () => {
    const onSelectSpy = spyOn(component.allSelected, 'emit');
    const button = allButton[0].nativeElement as HTMLButtonElement;
    button.click();

    expect(onSelectSpy).toHaveBeenCalledWith();
  });
});
