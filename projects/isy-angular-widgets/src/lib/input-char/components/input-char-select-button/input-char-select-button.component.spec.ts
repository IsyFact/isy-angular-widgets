import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputCharSelectButtonComponent} from './input-char-select-button.component';
import {AccordionModule} from 'primeng/accordion';
import {SelectButtonModule} from 'primeng/selectbutton';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {SchriftZeichen, Schriftzeichengruppe} from '../../model/model';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

describe('InputCharAccordionTabComponent', () => {
  let component: InputCharSelectButtonComponent;
  let fixture: ComponentFixture<InputCharSelectButtonComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [InputCharSelectButtonComponent],
      imports:[
        AccordionModule,
        SelectButtonModule,
        BrowserAnimationsModule,
        FormsModule,
        ButtonModule
      ]
    }).overrideComponent(InputCharSelectButtonComponent, {
      remove: {
        templateUrl: './input-char-select-button.component.html'
      },
      add: {
        template: '<p-accordion>' +
          '<p-accordionTab #accordionTab [header]="header">\n' +
          '  <p-selectButton\n' +
          '    #selectButton\n' +
          '    [options]="options"\n' +
          '    [optionLabel]="optionLabel"\n' +
          '    [optionValue]="optionValue"\n' +
          '    [multiple]="false"\n' +
          '    [(ngModel)]="selectedValue"\n' +
          '    (onChange)="onSelection(selectButton.value)"\n' +
          '  >\n' +
          '  </p-selectButton>\n' +
          '</p-accordionTab>' +
          '</p-accordion>'
      }
    })
      .compileComponents();

    fixture = TestBed.createComponent(InputCharSelectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the reset function to have been called', () => {
    expect(component.selectedValue).toBeUndefined();
    const resetSpy = spyOn(component, 'reset') .and. callThrough();
    component.reset();
    expect(resetSpy).toHaveBeenCalled();
    expect(component.selectedValue).toEqual('');
  });

  it('should check the reset function to have been called', () => {
    const valueOnSelection = 'onSelection';
    const onSelectionSpy = spyOn(component, valueOnSelection);
    component.onSelection(valueOnSelection);
    expect(onSelectionSpy).toHaveBeenCalledWith(valueOnSelection);
  });

  it('should check the functionality on character/value selection', () => {
    const selectionSpy = spyOn(component.selection, 'emit');

    const value = 'A';
    component.onSelection(value);
    expect(selectionSpy).toHaveBeenCalledWith(value);
  });

  it('should check the selected value reset', () => {
    component.selectedValue = 'A';
    component.reset();
    expect(component.selectedValue).toEqual('');
  });
});

describe('Base', () => {
  let component: InputCharSelectButtonComponent;
  let fixture: ComponentFixture<InputCharSelectButtonComponent>;
  let baseSelectButtons: DebugElement[];

  const bases = [
    '*',
    'A',
    'B'
  ];
  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [InputCharSelectButtonComponent],
      imports:[
        SelectButtonModule,
        BrowserAnimationsModule,
        FormsModule,
        ButtonModule
      ]
    }).overrideComponent(InputCharSelectButtonComponent, {
      remove: {
        templateUrl: './input-char-select-button.component.html'
      }
    })
      .compileComponents();

    fixture = TestBed.createComponent(InputCharSelectButtonComponent);
    component = fixture.componentInstance;
    component.options = bases;
    fixture.detectChanges();
    baseSelectButtons = fixture.debugElement.queryAll(By.css('.base-select-button'));
  });

  it('should check the number of the rendere base select buttons', () => {
    expect(baseSelectButtons.length).toEqual(bases.length);
  });

  it('should check the inner text of the base select buttons', () => {
    for (let i = 0; i < bases.length; i++) {
      const button = baseSelectButtons[i].nativeElement as HTMLButtonElement;
      expect(button.innerText).toEqual(bases[i]);
    }
  });

  it('should check the functionality after pressing on base button', () => {
    const index = 0;
    const onSelectionSpy = spyOn(component, 'onSelection');

    const button = baseSelectButtons[index].nativeElement as HTMLButtonElement;
    expect(button.innerText).toEqual(bases[index]);

    button.click();
    expect(onSelectionSpy).toHaveBeenCalled();

    fixture.detectChanges();

    expect(component.selectedValue).toEqual(bases[index]);
  });

  it('should check if the groups buttons gonna be rendered', () => {
    const groupsButtons = fixture.debugElement.queryAll(By.css('.group-select-button'));
    expect(groupsButtons.length).toEqual(0);
  });
});

describe('Group', () => {
  let component: InputCharSelectButtonComponent;
  let fixture: ComponentFixture<InputCharSelectButtonComponent>;
  let groupSelectButtons: DebugElement[];

  const groups: SchriftZeichen[] = [
    {id: '0', gruppe: Schriftzeichengruppe.LATEIN},
    {id: '1', gruppe: Schriftzeichengruppe.N1}
  ];

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [InputCharSelectButtonComponent],
      imports:[
        SelectButtonModule,
        BrowserAnimationsModule,
        FormsModule,
        ButtonModule
      ]
    }).overrideComponent(InputCharSelectButtonComponent, {
      remove: {
        templateUrl: './input-char-select-button.component.html'
      }
    })
      .compileComponents();

    fixture = TestBed.createComponent(InputCharSelectButtonComponent);
    component = fixture.componentInstance;
    component.options = groups;
    fixture.detectChanges();
    groupSelectButtons = fixture.debugElement.queryAll(By.css('.group-select-button'));
  });

  it('should check the number of the rendere base select buttons', () => {
    expect(groupSelectButtons.length).toEqual(groups.length);
  });

  it('should check the inner text of the group select buttons', () => {
    for (let i = 0; i < groups.length; i++) {
      const button = groupSelectButtons[i].nativeElement as HTMLButtonElement;
      expect(button.innerText).toEqual(groups[i].gruppe);
    }
  });

  it('should check the functionality after pressing on group button', () => {
    const index = 0;
    const onSelectionSpy = spyOn(component, 'onSelection');

    const button = groupSelectButtons[index].nativeElement as HTMLButtonElement;
    expect(button.innerText).toEqual(groups[index].gruppe);

    button.click();
    expect(onSelectionSpy).toHaveBeenCalled();
  });

  it('should check if the bases buttons gonna be rendered', () => {
    const baseButtons = fixture.debugElement.queryAll(By.css('.base-select-button'));
    expect(baseButtons.length).toEqual(0);
  });
});
